# PayCore — Project Specification
## Financial Transactions & Ledger System · Go-Heavy

**Primary Language:** Go
**Stack:** Go · PostgreSQL · Redis · Kafka · gRPC + Protobuf · Next.js (frontend only)
**Building Blocks:** `herald` (payment confirmations) · `gatekeeper` (2FA for wire transfers) · `pgpool` (PG proxy) · `vault` (idempotency key cache) · `switchboard` (API gateway)

---

## 1. What It Is

A production-grade financial transaction and ledger system. Double-entry bookkeeping, idempotency across retries, event sourcing, distributed Saga-based payment flows. Every mutation is safe to retry. Every ledger entry is balanced. Every payment failure triggers a compensating transaction. This is the Go-heavy project that demonstrates Go's strengths for correctness-critical systems: `go test -race`, `goleak`, `errgroup`, type-safe `sqlc`, gRPC service definitions.

**Why Go here:** Financial systems demand predictable latency (no GC pauses), data-race detection (`go test -race`), and goroutine leak detection (`goleak`). Go's explicit error handling makes the Saga state machine auditable — every error path is handled or the compiler rejects the code.

---

## 2. Stack Breakdown

| Layer | Technology | Depth Point |
|---|---|---|
| Backend API | Go + `chi` router + `slog` | Graceful shutdown, `signal.Notify`, structured JSON logs with `trace_id` |
| Database queries | `sqlc` (generated type-safe SQL) | Zero `interface{}` in DB layer — all queries typed |
| ORM layer | Raw PostgreSQL via `pgx/v5` | `BEGIN/COMMIT` explicit, `SELECT FOR UPDATE SKIP LOCKED` in job queue |
| gRPC | `grpc-go` + hand-written Protobuf | LedgerService, PaymentService — internal service communication |
| Kafka | `sarama` (Go) | Exactly-once producer, outbox pattern, Saga choreography |
| Cache | Redis (`go-redis/v9`) + Lua scripts | Idempotency keys, distributed locks, token bucket rate limiter |
| Event store | PostgreSQL `payment_events` table | Append-only, immutable, `sequence` column for replay ordering |
| Frontend | Next.js 15 (TypeScript) | Transaction dashboard — TS frontend only, Go backend |
| Testing | `testing` + `testify` + `testcontainers-go` + `go test -race` | Real PostgreSQL + Redis + Kafka in tests |
| Observability | OTel Go SDK + `pprof` + Prometheus | Ledger write span, Saga step span, goroutine dumps |
| CI | GitHub Actions | `go test -race` → `goleak` → `govulncheck` → `trivy image` → deploy |

---

## 3. Go Depth — Key Implementations

### Double-Entry Bookkeeping (sqlc + pgx transaction)
```go
// sqlc generates this from SQL — fully type-safe, no interface{}
func (q *Queries) CreateLedgerEntries(ctx context.Context, arg CreateLedgerEntriesParams) error {
    // Single transaction: debit + credit — both commit or neither does
    tx, err := q.db.BeginTx(ctx, pgx.TxOptions{IsoLevel: pgx.Serializable})
    if err != nil { return fmt.Errorf("begin: %w", err) }
    defer tx.Rollback(ctx)

    if err := q.WithTx(tx).InsertLedgerEntry(ctx, LedgerEntryParams{
        AccountID: arg.SourceID, Amount: -arg.Amount, Direction: "DEBIT",
    }); err != nil { return fmt.Errorf("debit: %w", err) }

    if err := q.WithTx(tx).InsertLedgerEntry(ctx, LedgerEntryParams{
        AccountID: arg.DestID, Amount: arg.Amount, Direction: "CREDIT",
    }); err != nil { return fmt.Errorf("credit: %w", err) }

    return tx.Commit(ctx)
    // PostgreSQL CHECK constraint: SUM(debits) == SUM(credits) — enforced at DB level
}
```

### Idempotency Key Pattern (Redis + `vault`)
```go
func (s *PaymentService) Charge(ctx context.Context, req *pb.ChargeRequest) (*pb.ChargeResponse, error) {
    key := "idempotency:" + req.IdempotencyKey

    // Check vault building block first (durable KV store)
    if cached, err := s.vault.Get(ctx, key); err == nil {
        return unmarshalResponse(cached), nil  // already processed — return exact same result
    }

    result, err, _ := s.sf.Do(key, func() (interface{}, error) {
        return s.processCharge(ctx, req)  // singleflight: collapse concurrent identical requests
    })
    if err != nil { return nil, err }

    resp := result.(*pb.ChargeResponse)
    s.vault.Set(ctx, key, marshalResponse(resp), 24*time.Hour)  // store for 24h
    return resp, nil
}
```

### Saga Pattern — Choreography via Kafka
```go
// Step 1: Reserve funds (PayCore internal)
// Step 2: Publish to Kafka → payment gateway service listens
// Step 3: On success → publish confirmation → ledger confirms
// On failure at any step → compensating event restores state

func (s *SagaOrchestrator) Run(ctx context.Context, saga PaymentSaga) error {
    g, ctx := errgroup.WithContext(ctx)

    g.Go(func() error { return s.reserveFunds(ctx, saga) })

    select {
    case ev := <-s.events:
        switch ev.Type {
        case "payment.gateway.succeeded":
            return s.confirmLedger(ctx, saga, ev)
        case "payment.gateway.failed":
            return s.compensate(ctx, saga)  // release reserved funds
        }
    case <-ctx.Done():
        return s.compensate(ctx, saga)
    }
    return g.Wait()
}
```

### Event Sourcing — Account State from Events
```go
// Account state is never stored directly — computed by replaying events
type AccountProjector struct{ db *Queries }

func (p *AccountProjector) CurrentBalance(ctx context.Context, accountID uuid.UUID) (decimal.Decimal, error) {
    events, err := p.db.GetEventsSince(ctx, GetEventsSinceParams{
        AggregateID: accountID,
        AfterSeq:    latestSnapshotSeq,
    })
    if err != nil { return decimal.Zero, fmt.Errorf("load events: %w", err) }

    balance := latestSnapshot.Balance
    for _, e := range events {
        switch e.Type {
        case "FundsDeposited":  balance = balance.Add(e.Amount)
        case "PaymentDebited":  balance = balance.Sub(e.Amount)
        case "PaymentRefunded": balance = balance.Add(e.Amount)
        }
    }
    return balance, nil
}
```

### gRPC Service Definition
```protobuf
syntax = "proto3";

service PaymentService {
  rpc Charge(ChargeRequest) returns (ChargeResponse);
  rpc Refund(RefundRequest) returns (RefundResponse);
  rpc GetBalance(GetBalanceRequest) returns (GetBalanceResponse);
  rpc StreamTransactions(StreamRequest) returns (stream Transaction);
}

message ChargeRequest {
  string idempotency_key = 1;  // required — payment without this is rejected
  string from_account    = 2;
  string to_account      = 3;
  string amount          = 4;  // decimal string — never float for money
  string currency        = 5;
}
```

### Outbox Pattern (Kafka Guarantee)
```go
// In one DB transaction:
// 1. Write the business event (payment confirmed)
// 2. Write to outbox table (topic + payload)
// Separate worker polls outbox, publishes to Kafka, marks published
// On crash: worker restarts, finds unpublished rows, retries — no spans lost
func (s *Store) ConfirmPayment(ctx context.Context, payment Payment) error {
    return s.db.WithTx(ctx, func(tx *Queries) error {
        if err := tx.UpdatePaymentStatus(ctx, payment.ID, "CONFIRMED"); err != nil {
            return err
        }
        return tx.InsertOutbox(ctx, OutboxRow{
            Topic:   "payments.confirmed",
            Payload: mustMarshal(PaymentConfirmedEvent{PaymentID: payment.ID}),
        })
    })
}
```

---

## 4. PostgreSQL Isolation Level Demos

These scripts live in `scripts/isolation-level-demos/` — the most valuable database education artifact:

```sql
-- DIRTY READ: Terminal 1 updates, Terminal 2 reads before commit
-- NON-REPEATABLE READ: same SELECT returns different values mid-transaction
-- PHANTOM READ: same COUNT(*) returns different value mid-transaction
-- SERIALIZABLE: all anomalies prevented — use for double-entry ledger writes
```

---

## 5. Features by Month

| Month | Feature | Concept |
|---|---|---|
| 1 | Raw HTTP payment endpoint, Go `net/http` | Go HTTP, error handling |
| 2 | JWT RS256 auth, HMAC webhook (Stripe callbacks) | Asymmetric JWT, webhook security |
| 3 | Go rewrite from Node.js, gRPC LedgerService | gRPC, Go concurrency |
| 4 | Next.js transaction dashboard | Frontend consumes gRPC via gateway |
| 5 | Double-entry ledger, `sqlc` queries, isolation level demos | DBMS deep, event sourcing |
| 6 | Kafka Saga choreography, outbox pattern | Exactly-once, Saga |
| 7 | Consistent hashing for account sharding | Distributed systems |
| 8 | AI fraud detection (PGVector anomaly scoring), `pprof` | AI stack, performance |

---

## 6. Non-Negotiable Rules

- `go test -race ./...` — concurrent ledger writes are the core correctness problem
- `goleak.VerifyNone(t)` — goroutine leaks in payment workers accumulate silently
- `sqlc` for all DB queries — zero raw string SQL in Go code
- Idempotency key on every mutation — duplicate charge = regulatory violation
- Outbox pattern for every Kafka publish — lost payment event = incorrect ledger state
- All money as `DECIMAL(19,4)` in PostgreSQL, `decimal.Decimal` in Go — never `float64`
- Saga compensation verified: Stripe decline → funds released → user notified

---

## 7. Benchmarks

| Metric | Target |
|---|---|
| Payment throughput | 5K TPS |
| Ledger INSERT p99 | < 8ms |
| Saga compensation time | < 200ms end-to-end |
| Event replay (10K events) | < 50ms |
| gRPC Charge p99 | < 20ms |
