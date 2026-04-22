# 9-Month Implementation Schedule
## New Language Split Applied — TypeScript + Go At Production Depth

---

## Reading This Document

Each month has three tracks running simultaneously:
- **Main concept** (what the Backend 2026 Roadmap says to learn this month)
- **OpenTrace milestone** (what component gets built)
- **Other 4 projects** (what each one ships independently)
- **Biweekly block** (which building block runs on weekends)

The language used in each project is fixed — don't context-switch mid-project. TypeScript projects (BookWise, RouteMaster) stay TypeScript throughout. Go projects (PayCore, DungBeetle) stay Go throughout. OpenTrace is the only hybrid.

---

## Month 1 — Fundamentals + OS + Networks + JavaScript Engine

**Backend 2026 Focus:** HTTP, DNS, TCP, OS internals, JS engine
**Languages this month:** TypeScript/Node.js (primary), Go (echo servers only)

### OpenTrace
- Monorepo scaffold: `packages/types`, `packages/schemas`, `packages/utils`
- Proto definitions for OTLP, hand-read from the spec
- Raw gRPC echo server in Go: receives a span, logs it, nothing stored
- Read Jaeger collector source code and write notes on how it works

### RouteMaster (TypeScript)
- Raw Node.js HTTP server (`http.createServer`, no Express yet)
- `POST /orders` endpoint — idempotency key in header, stored in memory
- Cloudflare domain registered, A record configured
- `README.md` + `BENCHMARKS.md` placeholders created

### BookWise (TypeScript)
- Raw Node.js HTTP server
- `POST /bookings` endpoint — seat ID + user ID, naive in-memory check
- No concurrency protection yet (intentionally broken — fixed in Month 5)
- Branded types: `SeatId`, `UserId`, `EventId` defined in `types.ts`

### PayCore (Go)
- Raw Go `net/http` server
- `POST /payments` endpoint — accepts JSON, returns mock success
- `DECIMAL(19,4)` schema designed in PostgreSQL from Day 1 — never float for money
- `go test -race ./...` passing from Day 1

### DungBeetle (TypeScript — Node.js Monolith v0.1)
- Raw Node.js HTTP server — the monolith this project will migrate away from
- `POST /jobs` endpoint — stores job in memory, processes synchronously
- This is the baseline the Month 3 Go rewrite RFC will benchmark against

### Biweekly: `vault` (Go) — Weeks 1–2
Build WAL writer + recovery by end of weekend. Compaction + crash test by Week 4 capstone.

### Key Concepts Demonstrated
| Concept | Where |
|---|---|
| HTTP/HTTPS model, status codes | All 5 raw servers |
| `curl -v` on every endpoint | Every route documented with `curl` example in README |
| DNS — A, CNAME, TTL | Cloudflare domains for all 5 projects |
| TCP three-way handshake | Raw `net.Listen` in Go echo server |
| Node.js event loop, libuv phases | DungBeetle Node.js monolith |
| Branded TypeScript types | BookWise type definitions |

---

## Month 2 — Node.js Deep + TypeScript + API Design

**Backend 2026 Focus:** V8 JIT, libuv, streams, `AsyncLocalStorage`, TypeScript strict
**Languages this month:** TypeScript/Node.js primary

### OpenTrace
- **Collector v0.1** (Go): OTLP/gRPC + OTLP/HTTP receiver, validates spans, publishes to Kafka
- Partition key = `trace_id` — all spans of one trace → same Kafka partition
- `RESOURCE_EXHAUSTED` backpressure when Kafka is slow — documented in ADR

### RouteMaster (TypeScript)
- Express 5 + Zod validation added
- JWT RS256 auth middleware (public key from `switchboard` JWKS endpoint)
- `AsyncLocalStorage` for trace context through entire request chain
- Kafka `kafkajs` producer: publish `order.created` events
- `tsc --noEmit` in CI from this month forward

### BookWise (TypeScript)
- Express 5 + Zod validation
- JWT auth via `switchboard`
- Stripe Checkout Session creation — `POST /bookings` initiates payment
- HMAC webhook handler for `payment_intent.succeeded` (Stripe → BookWise)
- `tsc --noEmit` in CI

### PayCore (Go)
- JWT RS256 auth middleware (Go)
- HMAC webhook handler for incoming payment gateway callbacks
- gRPC `LedgerService` proto defined, stub implementation
- `sqlc` introduced — all DB queries generated from SQL, zero `interface{}`

### DungBeetle (TypeScript — still Node.js monolith)
- HMAC-signed webhook delivery for job completion callbacks
- `AsyncLocalStorage` for job execution context
- PostgreSQL queue: `SELECT FOR UPDATE SKIP LOCKED` replaces in-memory storage

### Biweekly: `pgpool` (Go) — Weeks 3–4
pgwire protocol parsing, transaction mode, benchmark vs raw PostgreSQL.

### Key Concepts Demonstrated
| Concept | Where |
|---|---|
| V8 JIT pipeline, hidden classes, generational GC | RouteMaster + BookWise — `clinic.js` profiling |
| libuv event loop all 6 phases | DungBeetle Node.js monolith — `AsyncLocalStorage` usage |
| Node.js streams with backpressure | OpenTrace Collector OTLP HTTP receiver |
| TypeScript strict mode, branded types | BookWise + RouteMaster — enforced by CI |
| JWT RS256 asymmetric | All projects auth via `switchboard` |
| HMAC webhook signatures | PayCore, BookWise (Stripe), herald |

---

## Month 3 — Go Mastery + Concurrency + Protocols

**Backend 2026 Focus:** Go language deep, goroutines, channels, M:N scheduler
**Languages this month:** Go primary

### OpenTrace
- **Pipeline Processor** (Go): Kafka consumer, tail-based sampling, ClickHouse bulk insert
- `go test -race ./...` passing on Processor from Day 1
- `goleak.VerifyNone(t)` passing — no goroutine leaks in span pipeline

### RouteMaster (TypeScript)
- Kafka `kafkajs` consumer: `shipment.events` topic → status update pipeline
- Node.js streams pipeline: `KafkaReadStream` → `StatusTransform` → `NotifierTransform`
- `pipeline()` replaces `.pipe()` — proper error propagation

### BookWise (TypeScript)
- Kafka `kafkajs` consumer: `booking.events` topic → waitlist state machine trigger
- Discriminated union `BookingState` type enforces all state transitions at compile time

### PayCore (Go) — **Go rewrite month**
- Complete Go language: goroutines, channels, `errgroup`, `singleflight`, `sync.RWMutex`
- gRPC `LedgerService` implemented — double-entry bookkeeping over gRPC
- `go test -race ./...` enforced — concurrent ledger writes are the correctness problem
- `goleak.VerifyNone(t)` in every test file

### DungBeetle (Go) — **Migration RFC written and merged**
- **Go rewrite RFC**: Node.js monolith → Go event-driven
  - Goroutine-per-job model vs Node.js single-threaded
  - `go test -race` coverage from Day 1
  - Benchmark: Node.js monolith latency vs Go worker pool
- DungBeetle v1.0 Go: goroutine worker pool, `SELECT FOR UPDATE SKIP LOCKED`
- Node.js v0.1 branch kept — RFC references both for comparison

### Biweekly: `relay` (Go) — Weeks 5–6
Redis pub/sub fan-out, ping/pong, `sync.Map` connection registry.

### Key Concepts Demonstrated
| Concept | Where |
|---|---|
| Goroutines, M:N scheduler, work stealing | PayCore, DungBeetle, pgpool, relay |
| Channels — pipeline/fan-out/fan-in/semaphore | DungBeetle worker pool semaphore |
| `errgroup`, `singleflight` | PayCore (Saga), DungBeetle (dedup) |
| `go test -race ./...` | PayCore, DungBeetle — enforced in CI from this month |
| `goleak.VerifyNone(t)` | PayCore, DungBeetle — goroutine leak detection |
| Node.js Kafka consumer + streams | RouteMaster, BookWise |

---

## Month 4 — React + Next.js + TypeScript UI + Testing

**Backend 2026 Focus:** React deep, Next.js App Router, testing (Vitest, Playwright, testcontainers)
**Languages this month:** TypeScript primary

### OpenTrace
- **UI v0.1** (TypeScript/Next.js): trace list, trace detail, basic D3.js waterfall
- D3.js virtualised rendering — only visible spans rendered (10K+ span support)
- `tsc --noEmit` in CI for UI

### RouteMaster (TypeScript)
- Next.js 15 frontend: order list, order detail, driver map placeholder
- Tanstack Query: order status polling with `staleTime`, optimistic status update
- Playwright E2E: create order → assign driver → complete delivery flow
- Vitest 80%+ coverage on order service logic

### BookWise (TypeScript)
- Next.js 15 frontend: seat map component (SVG grid), booking flow, confirmation page
- Tanstack Query optimistic booking: mark seat as `HOLDING` immediately, rollback on failure
- SSE live seat availability: `EventSource` with `Last-Event-ID` for reconnect
- Playwright E2E: seat selection → payment → confirmation flow
- Vitest 80%+ coverage on booking saga logic

### PayCore (Go)
- Next.js frontend (TypeScript): transaction dashboard, account balance, ledger view
- `testcontainers-go`: real PostgreSQL + Redis + Kafka in every integration test
- Table-driven tests for all ledger entry scenarios

### DungBeetle (Go)
- Next.js frontend (TypeScript): job dashboard, DLQ viewer, live job status via `relay`
- `testcontainers-go`: real PostgreSQL + Kafka in integration tests
- Vercel AI SDK chat UI stub (full AI in Month 8): `useChat` component

### Biweekly: `resolver` (Go) — Weeks 7–8
Full DNS resolution from root hints, `dig +trace` validation.

### Key Concepts Demonstrated
| Concept | Where |
|---|---|
| React hooks, reconciliation, `React.memo` | BookWise seat map, RouteMaster order tracker |
| Next.js App Router, Server Components, streaming Suspense | All 3 TS project frontends |
| Tanstack Query optimistic updates + rollback | BookWise booking flow |
| SSE — `text/event-stream`, `Last-Event-ID`, auto-reconnect | BookWise live seat map |
| Vitest 80%+ coverage | BookWise, RouteMaster (TS projects) |
| `testcontainers-go` | PayCore, DungBeetle (Go projects) |
| Playwright E2E | BookWise, RouteMaster |

---

## Month 5 — DBMS Deep + ClickHouse + Caching

**Backend 2026 Focus:** THE most important month — databases, isolation levels, EXPLAIN ANALYZE
**Languages this month:** Go + TypeScript (database work is language-agnostic)

### OpenTrace
- **Storage Layer** (Go): ClickHouse schema, monthly partitions, TTL, bulk insert benchmark
- `EXPLAIN` on every ClickHouse query — partition pruning verified (`Selected 1/7 parts`)
- Query p99 target: < 200ms on 30-day window

### RouteMaster (TypeScript)
- Elasticsearch 8 integrated: shipment index, BM25 search, faceted aggregations
- MongoDB for shipment documents: `$lookup` aggregation, TTL index on sessions
- `EXPLAIN ANALYZE` on every PostgreSQL query — zero seq scans
- Cache-aside with Redis TTL jitter for order status

### BookWise (TypeScript)
- Redis distributed lock added: `SET NX PX` + Lua release script
- Fencing tokens enforced in Prisma `$queryRaw` UPDATE
- `SELECT FOR UPDATE SKIP LOCKED` for seat claim
- Isolation level demo scripts: dirty read, phantom read in `psql` — saved to `scripts/`
- **10K concurrent booking correctness test** — exactly 0 double-bookings

### PayCore (Go)
- Double-entry ledger complete: `sqlc`-generated queries, `DECIMAL(19,4)` enforced
- All 4 isolation level demos in `/scripts/isolation-level-demos/`
- `auto_explain` enabled in local PostgreSQL — catch slow queries in development
- PgBouncer transaction mode configured, pool sizing formula documented in ADR
- Event sourcing: `payment_events` table, `AccountProjector` from event replay

### DungBeetle (Go)
- Kafka queue replaces PostgreSQL `SELECT FOR UPDATE SKIP LOCKED`
- Outbox pattern: job enqueue + Kafka publish in single transaction
- Exactly-once consumer: idempotent processing with `vault` dedup

### Biweekly: `lsm` (Go) — Weeks 9–10 (shifted one month for DBMS synergy)
MemTable, SSTable, Bloom filter, compaction — understanding LSM makes ClickHouse immediately legible.

### Key Concepts Demonstrated
| Concept | Where |
|---|---|
| PostgreSQL MVCC, WAL, B-tree internals | PayCore (WAL demo), DungBeetle |
| All 4 isolation levels with live anomaly demos | PayCore + BookWise `/scripts/isolation-level-demos/` |
| `EXPLAIN ANALYZE` mastery | All 5 projects — zero seq scans enforced |
| `SELECT FOR UPDATE SKIP LOCKED` | BookWise (seat claim), DungBeetle (job queue) |
| Redis Lua scripts — atomic check-and-set | BookWise (distributed lock), RouteMaster (rate limit) |
| Elasticsearch BM25 + faceted search | RouteMaster |
| ClickHouse MergeTree + partition pruning | OpenTrace |
| Event sourcing, CQRS | PayCore |

---

## Month 6 — Infrastructure + K8s + Observability

**Backend 2026 Focus:** Docker, Kubernetes, Terraform, GitHub Actions, gRPC, OTel
**Languages this month:** Go + TypeScript (infra is language-agnostic)

### OpenTrace
- **Query Service** (Go): gRPC streaming, service dependency graph from ClickHouse
- **API Gateway** (TypeScript): REST wrapper over gRPC, `traceparent` injection
- All 7 components emit OTel spans to their own Collector — **self-instrumentation demo live**

### RouteMaster (TypeScript)
- ECS Fargate deployment via Terraform — own repo, own state file
- Prometheus + Grafana: RED method for `/orders`, `/search`, `/track` endpoints
- OTel Node.js SDK auto-instrumentation (Express + Prisma + kafkajs)
- `pino` structured JSON logs with `trace_id` from `AsyncLocalStorage`
- PITR drill: `DROP TABLE orders` → restore → RTO < 10 min → runbook written

### BookWise (TypeScript)
- ECS Fargate deployment via Terraform
- Prometheus: booking saga latency histogram, DLQ depth gauge
- OTel auto-instrumentation
- `herald` building block integrated: waitlist promotion sends SMS + push
- `gatekeeper` building block integrated: 2FA before large bookings

### PayCore (Go)
- ECS Fargate deployment via Terraform
- gRPC `PaymentService` full implementation with streaming `StreamTransactions`
- Prometheus: payment throughput counter, p99 ledger write histogram
- `pprof` endpoint: `/debug/pprof/` — CPU flame graph accessible in production

### DungBeetle (Go)
- ECS Fargate deployment
- Leader election: `SET NX EX` + Lua renewal, split-brain test passing
- Exactly-once cron: distributed lock on job name + hour window
- `pprof` CPU flame graph: identify hot loop in worker dispatch

### Biweekly: `herald` (TypeScript) — Weeks 11–12
Multi-channel delivery, outbox, idempotency, HMAC webhooks — all TS projects start consuming it.

### Key Concepts Demonstrated
| Concept | Where |
|---|---|
| Docker multi-stage builds, non-root user, `trivy` | All 13 repos |
| Kubernetes Pod/Deployment/Service/Ingress/HPA | OpenTrace (K8s Operator begins) |
| Terraform HCL, state, modules | All 5 projects — own state files |
| OTel auto-instrumentation | All 5 projects — different SDKs (Go vs Node.js) |
| gRPC streaming | OpenTrace Query Service, PayCore |
| Leader election, split-brain test | DungBeetle |
| PITR drill + runbook | RouteMaster, PayCore |

---

## Month 7 — Distributed Systems Deep

**Backend 2026 Focus:** The hardest month — Bloom filters, consistent hashing, Raft, Sagas
**Languages this month:** Go primary (DS work), TypeScript (UI + state machines)

### OpenTrace
- **UI v2** (TypeScript): service map D3.js graph, live tail WebSocket via `relay`
- **SDK** (Go + TypeScript): auto-instrumentation with one import

### RouteMaster (TypeScript)
- Go crawler binary: Bloom filter dedup, Kafka `crawler.seeds` consumer
- S3 multipart upload for proof-of-delivery photos
- Cloudflare R2 cost comparison documented in ADR
- Consistent hashing for driver-to-zone assignment (Go microservice)

### BookWise (TypeScript)
- Waitlist engine: Kafka event-driven state machine
  - `booking.cancelled` → find first `WAITING` → offer seat (15-min window) → confirm or promote next
- PGVector seat recommendations: embed seat metadata → cosine ANN → personalised suggestions

### PayCore (Go)
- Consistent hashing for account sharding across read replicas
- Kafka exactly-once producer: transactional API (`BeginTxn`, `CommitTxn`)
- Two-phase commit vs Saga comparison: ADR written — why Saga wins for microservices

### DungBeetle (Go)
- Consistent hashing for job-to-worker routing (same job type → same worker)
- Bloom filter job dedup: check before DB lookup — O(1) space
- AI job orchestration Go backend: LLM classifies job type, routes to handler
- Vercel AI SDK frontend: `useChat` interface calls Go AI router

### Biweekly: `gatekeeper` (TypeScript) — Weeks 13–14
`crypto.randomInt`, Redis TTL OTP lifecycle, multi-tenancy, `timingSafeEqual`.

### Key Concepts Demonstrated
| Concept | Where |
|---|---|
| Consistent hashing + virtual nodes | DungBeetle (jobs), RouteMaster (drivers), OpenTrace (traces) |
| Bloom filters — false positive rate | RouteMaster (crawler), lsm (SSTable), DungBeetle (dedup) |
| Saga choreography + compensating transactions | BookWise (booking + payment) |
| Event-driven state machine | BookWise (waitlist) |
| PGVector, HNSW, cosine ANN | BookWise (seat recs) |
| Vercel AI SDK `useChat`, `streamText` | DungBeetle AI UI |
| S3 multipart upload, Cloudflare R2 | RouteMaster |

---

## Month 8 — Performance Engineering + AI-Native Stack

**Backend 2026 Focus:** k6 load testing, `pprof`, flame graphs, LLM/RAG
**Languages this month:** Go + TypeScript

### OpenTrace
- **Production hardening**: K8s Operator, OTel compatibility tests, 10M spans/sec load test
- `BENCHMARKS.md` final — all numbers documented

### RouteMaster (TypeScript)
- `clinic.js` flame graph: identify hot loop in Kafka consumer pipeline
- k6 load test: 20K orders/min, p50/p95/p99 documented
- AI semantic search: Vercel AI SDK `streamText` → translate NL query → Elasticsearch query
- Bloom filter false positive rate measured and documented

### BookWise (TypeScript)
- `clinic.js` heap profiling: detect memory leak in SSE subscriber registry
- k6 load test: 10K concurrent bookings, zero double-bookings verified
- AI seat recommendations: Vercel AI SDK chat interface for "find me seats near my friends"

### PayCore (Go)
- `pprof` CPU flame graph: identify hot loop in event projector
- k6 load test: 5K TPS, p99 < 20ms
- Three deliberately introduced bugs fixed:
  1. Missing index on `payment_events(aggregate_id)` → add partial index
  2. Goroutine leak in Kafka consumer → `goleak` catches it
  3. `N+1` query in account balance → batch with `sqlc` CTE

### DungBeetle (Go)
- `pprof` goroutine dump: verify worker pool cleans up on shutdown
- k6 load test: 50K jobs/min throughput
- AI job orchestration full implementation: classify → route → execute with LLM

### Biweekly: `switchboard` (TypeScript) — Weeks 15–16
JWT RS256 via JWKS, sliding window rate limiting (Lua), circuit breaker, SSE proxy.

### Key Concepts Demonstrated
| Concept | Where |
|---|---|
| `pprof` CPU flame graph, heap profile, goroutine dump | PayCore, DungBeetle |
| `clinic.js` (Node.js profiler) | RouteMaster, BookWise |
| k6 load testing — p50/p95/p99 | All 5 projects |
| Three deliberately introduced bugs + fixes | PayCore (missing index, goroutine leak, N+1) |
| RAG pipeline: embed → PGVector → retrieve → inject | BookWise, RouteMaster |
| Vercel AI SDK `streamText`, tool use | DungBeetle, RouteMaster |
| K8s Operator | OpenTrace |

---

## Month 9 — Polish + LFX + Cold Emails

**Backend 2026 Focus:** Everything production-ready, open source contributions
**Languages this month:** Go + TypeScript (equally)

### OpenTrace
- LFX Mentorship application: Jaeger ClickHouse plugin proposal
- ≥ 2 PRs merged in Jaeger/OTel repo
- Architecture RFC: complete, public, linked from README
- Self-referential demo live: UI → API Gateway → Query Service → ClickHouse visible in OpenTrace

### All 5 Projects
- All 13 READMEs: Mermaid architecture diagram + benchmark table + live demo link
- `BENCHMARKS.md` final in every repo
- All ADRs written and linked from README
- `govulncheck ./...` passing (Go projects)
- `trivy image` passing (all projects)
- Cold emails drafted and sent

### Final Polish Checklist (All Projects)
- [ ] `go test -race ./...` green — all Go projects
- [ ] `goleak.VerifyNone(t)` green — all Go projects
- [ ] `tsc --noEmit` green — all TypeScript projects
- [ ] Vitest 80%+ — all TypeScript backend projects
- [ ] Playwright E2E in CI — BookWise, RouteMaster, OpenTrace UI
- [ ] k6 benchmark documented with p50/p95/p99 — all 5 main projects
- [ ] Prometheus + Grafana dashboard live — all 5 main projects
- [ ] Isolation level demos in `scripts/` — PayCore, BookWise
- [ ] PITR drill runbook written — PayCore, RouteMaster
- [ ] `EXPLAIN ANALYZE` zero seq scans — all 5 main projects
- [ ] ClickHouse `EXPLAIN` partition pruning verified — OpenTrace
- [ ] OTel compatibility: official OTel SDK → OpenTrace with zero config changes

---

## Biweekly Schedule (Revised with New Language Split)

| Weeks | Building Block | Language | Synergy with Main Projects |
|---|---|---|---|
| 1–2 | `vault` | Go | PayCore idempotency, DungBeetle job dedup, lsm WAL |
| 3–4 | `pgpool` | Go | All 5 projects — point `DATABASE_URL` at it |
| 5–6 | `relay` | Go | OpenTrace live tail, BookWise seat hold, RouteMaster driver location |
| 7–8 | `resolver` | Go | DNS debug for all services in Docker network |
| 9–10 | `lsm` | Go | OpenTrace ClickHouse understanding, DungBeetle storage education |
| 11–12 | `herald` | TypeScript | BookWise waitlist, RouteMaster shipment updates, PayCore confirmations |
| 13–14 | `gatekeeper` | TypeScript | PayCore 2FA, BookWise confirm booking, RouteMaster driver verification |
| 15–16 | `switchboard` | TypeScript | All external traffic, JWT verification, circuit breaking |

---

## Language Depth Delivered

### TypeScript / Node.js
From OpenTrace, RouteMaster, BookWise, herald, gatekeeper, switchboard:
- V8 JIT pipeline, libuv event loop all 6 phases
- Streams: `Transform`, `highWaterMark`, `drain`, `pipeline()` — 200MB in 20MB RAM
- `AsyncLocalStorage` for distributed tracing context without parameter threading
- `crypto` module: `randomInt`, `createHash`, `timingSafeEqual`, `createHmac`
- TypeScript strict: branded types, discriminated unions, conditional types, `tsc --noEmit` in CI
- Zod: one schema = runtime validation + TypeScript type (used in all 3 TS building blocks)
- Next.js 15: App Router, Server Components, ISR, streaming Suspense, Server Actions
- React: all hooks, reconciliation, `React.memo`, optimistic updates with Tanstack Query
- Kafka `kafkajs`: consumer groups, partition assignment, graceful shutdown
- Express 5: middleware chains, SSE, streaming proxy

### Go
From OpenTrace, PayCore, DungBeetle, vault, pgpool, relay, resolver, lsm:
- Complete Go: goroutines (M:N scheduler, work stealing, 2KB stacks), channels (all patterns)
- `sync.RWMutex/Pool/Once`, `errgroup`, `singleflight`, `atomic`
- `context` propagation, `sqlc`, `chi`, `cobra`, `slog`, `pprof`
- `go test -race ./...` enforced before every commit
- `goleak.VerifyNone(t)` in every test file
- gRPC: `grpc-go`, Protobuf 3, streaming RPCs
- Kafka `sarama`: exactly-once producer, transactional API
- Binary protocol parsing: pgwire (pgpool), DNS wire format (resolver)
- File I/O: `fsync`, `os.Rename` (atomic), `encoding/binary`, `hash/crc32`

---

## Standardized Non-Negotiable Rules

Applied across all projects to ensure production quality:

### TypeScript / Node.js
- **Strict Mode**: `tsc --noEmit` + `strict: true` must pass in CI.
- **Validation**: Zod schema on every API route body/query.
- **Streams**: Use `pipeline()` for all stream operations (avoid `.pipe()`).
- **Security**: Verify webhook signatures with `timingSafeEqual`.
- **Tracing**: `AsyncLocalStorage` for trace context propagation.

### Go
- **Race Safety**: `go test -race ./...` must pass before every commit.
- **Leak Detection**: `goleak.VerifyNone(t)` in every test file.
- **Error Handling**: No ignored errors; use `errgroup` for concurrent work.
- **Shutdown**: All services must implement graceful shutdown with context.
- **Schema**: No `interface{}` in DB layer; use `sqlc` for type safety.

### Infrastructure & DB
- **Zero Seq Scans**: `EXPLAIN ANALYZE` must show index scans for all hot paths.
- **Container Safety**: Non-root users, `trivy` image scans in CI.
- **Durability**: Use `fsync` or transactional outbox for all state-changing events.
- **Observability**: Prometheus metrics + OTel spans on all cross-service calls.
