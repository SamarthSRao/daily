# PayCore — Project Specification
## Financial Transactions & Ledger System

**Role:** Financial Transactions & Ledger System  
**Stack:** Go · PostgreSQL · Redis · Kafka · gRPC · Next.js

---

## 1. Project Overview

PayCore is a production-grade financial transaction and ledger system built in Go. It demonstrates the hardest correctness problems in backend engineering: double-entry bookkeeping, idempotency across retries, event sourcing, and distributed Saga-based payment flows. Every mutation is guaranteed to be safe to retry; every ledger entry is balanced; every payment failure triggers a compensating transaction.

---

## 2. Key Demonstrations

- Double-entry bookkeeping — every debit has a matching credit, ledger always balances
- Idempotency keys — every mutation safe to retry with no duplicate charges
- Saga pattern — distributed payment flow with compensating transactions on failure
- Event sourcing — account state reconstructed from event replay
- JWT RS256 auth + refresh token rotation
- HMAC-signed webhooks for payment callbacks

---

## 3. Architecture

| Component | Technology | Responsibility |
|---|---|---|
| Auth Service | Go + JWT RS256 | Login, token issuance, refresh rotation, Redis revocation |
| Ledger Service | Go + PostgreSQL | Double-entry bookkeeping, account balances, audit trail |
| Payment Orchestrator | Go + Kafka + Saga | Multi-step payment flow, compensating transactions |
| Event Store | PostgreSQL + Kafka | Immutable event log, state reconstruction by replay |
| Webhook Delivery | Go + HMAC | Signed outbound notifications to merchant callbacks |
| Frontend | Next.js + Tanstack Query | Transaction dashboard, ledger viewer, payment flow UI |

---

## 4. Technical Depth

### Double-Entry Bookkeeping

Every financial movement creates two ledger entries: a debit on the source account and an equal credit on the destination. The ledger INSERT is wrapped in a transaction with a CHECK constraint: `SUM(debits) = SUM(credits)`. Any imbalance causes a constraint violation and rolls back. This eliminates an entire class of accounting bugs that affect most fintech systems.

### Idempotency Key Pattern

Every payment mutation accepts an `idempotency_key` header. The key is stored with the result in a Redis hash (TTL: 24 hours). On retry, if the key exists, the stored result is returned immediately — no second charge, no duplicate ledger entry. The key covers the full response, not just the status code.

### Saga Pattern — Choreography

A payment flow spans three services: reserve funds, charge payment gateway, confirm ledger. Each step publishes a Kafka event. If the gateway charge fails, a compensating event releases the reserved funds. The Kafka outbox pattern guarantees events are published even if the producer crashes between database write and Kafka publish.

### Event Sourcing

Account state is never stored directly. The events table is the source of truth: `AccountOpened`, `FundsDeposited`, `PaymentInitiated`, `PaymentCompleted`, `PaymentFailed`. Current balance is computed by replaying events. Snapshots are taken every 1000 events to avoid full replay on startup.

---

## 5. Data Model

- `accounts (id, owner_id, currency, created_at)`
- `ledger_entries (id, account_id, amount, direction, transaction_id, created_at)`
- `payment_events (id, aggregate_id, type, payload JSONB, sequence, created_at)`
- `idempotency_keys (key, result JSONB, created_at)` — Redis, TTL 24h
- `outbox (id, topic, payload, published_at)` — transactional Kafka guarantee

---

## 6. Benchmarks

| Metric | Result |
|---|---|
| Payment throughput | 5,000 TPS (k6, 50 concurrent users) |
| Ledger INSERT p99 | < 8ms |
| Saga compensation time | < 200ms end-to-end |
| Event replay (10K events) | < 50ms |
| Idempotency lookup (Redis) | < 1ms |

---

## 7. Non-Negotiable Rules

- `go test -race ./...` passes — concurrent ledger access must be safe
- `EXPLAIN ANALYZE` on every query — zero seq scans on tables > 10K rows
- Idempotency key on every mutation that can be retried
- Outbox pattern for every Kafka publish that must be guaranteed
- Saga compensating transactions triggered and verified on payment failure
- `goleak.VerifyNone(t)` passes — goroutine leaks in payment workers accumulate

---

## 8. Infraspec Requirement Mapping

| Infraspec Requirement | How This Project Delivers It |
|---|---|
| 3–5 years or equivalent | Production-deployed with k6 benchmarks and ADRs |
| Double-entry accounting | Full ledger with constraint-enforced balance |
| Distributed transactions | Saga choreography with compensating events |
| Event-driven architecture | Kafka outbox, event sourcing, CQRS read model |
| Security best practices | JWT RS256, HMAC webhooks, input sanitization |
