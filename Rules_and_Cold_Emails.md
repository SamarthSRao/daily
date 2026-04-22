# Non-Negotiable Rules + Cold Email Templates
## Enforced Across All 13 Repos

---

## Non-Negotiable Rules by Language

### Go Rules (PayCore, DungBeetle, OpenTrace backend, vault, pgpool, relay, resolver, lsm)

| Rule | Enforcement | Why |
|---|---|---|
| `go test -race ./...` before every commit | CI blocks merge if it fails | Data races in payment workers / span pipeline cause silent corruption under load |
| `goleak.VerifyNone(t)` in every `*_test.go` file | CI blocks merge if it fails | Goroutine leaks in worker pools accumulate over days and crash production |
| `EXPLAIN ANALYZE` on every PostgreSQL query | PR checklist — reviewer blocks merge if absent | Missing indexes cause p99 explosions — you must see the query plan before shipping |
| Never `fmt.Sprintf` in SQL — always parameterised queries | `golangci-lint` `sqlclosecheck` | SQL injection in a payment system is regulatory violation, not just embarrassment |
| `DECIMAL(19,4)` in PostgreSQL, `decimal.Decimal` in Go | `sqlc` enforces — no `float64` in schema | Floating-point money arithmetic causes reconciliation failures |
| Outbox pattern for every Kafka publish | Architecture rule — code reviewer enforces | Crash between DB write and Kafka publish = lost payment event = incorrect ledger state |
| `govulncheck ./...` before every deploy | CI step | Go known vulnerabilities in dependencies |
| `trivy image` before every deploy | CI step | Container CVE scan |
| `pprof` endpoint available in staging | Deployment config | On-call requires flame graphs for production incidents |
| ADR for every technology decision | PR checklist | Your LFX application is rejected if you can't explain design tradeoffs |

### TypeScript Rules (BookWise, RouteMaster, OpenTrace TS components, herald, gatekeeper, switchboard)

| Rule | Enforcement | Why |
|---|---|---|
| `tsc --noEmit` in CI — `strict: true`, no `any`, no `@ts-ignore` | CI blocks merge | TypeScript's value is zero if you disable it |
| Zod schema on every API route body — in middleware, not in handlers | Architecture rule | Handlers should receive validated, typed data — not raw `req.body` |
| `pipeline()` for all stream processing — never `.pipe()` | ESLint rule or code review | `.pipe()` doesn't propagate errors; `pipeline()` does |
| `timingSafeEqual` for all HMAC/token comparisons | `crypto` module required | Timing oracle attacks allow secret extraction from constant-time differences |
| `crypto.randomInt` for all security-sensitive random values | `no-restricted-globals` ESLint | `Math.random()` is a PRNG — predictable from observed outputs |
| `AsyncLocalStorage` for trace context — never pass `traceId` as a parameter | Architecture rule | Parameter threading pollutes every function signature |
| Parameterised queries — Prisma + typed Elasticsearch client | Architecture rule | Raw string interpolation in queries = injection |
| `clinic.js` flame graph before calling anything production-ready | Process rule | Node.js hot loops are invisible without profiling |
| `trivy image` before every deploy | CI step | Container CVE scan |
| Playwright E2E for every user-facing flow | CI blocks deploy | Booking + payment + notification must be tested end-to-end |

### Universal Rules (All 13 Repos)

| Rule | Why |
|---|---|
| README: Mermaid architecture diagram + benchmark table + live demo link | Interviewers form an opinion in 30 seconds — make those 30 seconds count |
| `BENCHMARKS.md` with p50/p95/p99 at target RPS | Untested performance claims are fiction |
| One ADR per major decision, linked from README | Communication is engineering |
| One RFC per project per month | Senior engineers write constantly — this builds the habit |
| k6 load test before calling anything "production-ready" | Numbers, not vibes |
| Prometheus + Grafana dashboard live for every service | On-call without dashboards is guessing |
| OTel traces emitted — all services point at their own Jaeger (except OpenTrace which self-instruments) | Distributed tracing is not optional in 2026 |
| Structured JSON logs with `trace_id` on every line | Log grep without `trace_id` is archaeology |
| PITR drill: `DROP TABLE` → restore → RTO < 10 min → runbook written | You don't know your RTO until you've measured it |
| SLO alert rules: P1 → PagerDuty, P2/P3 → Slack | Alerting without runbooks is noise |

---

## Cold Email Templates (Per Company)

### Formula
```
Subject: Backend Engineer — built [HEADLINE PROJECT]: [ONE NUMBER] — [ROLE] at [COMPANY]
```

One specific number. One sentence of context. No fluff. Numbers get replies; prose gets deleted.

---

### Infraspec

```
Subject: Backend Engineer — built OpenTrace: Jaeger-equivalent tracing system,
         10M spans/sec, Go + TypeScript — applying for Backend Engineer at Infraspec

I spent 9 months building 5 production-grade systems across 13 GitHub repos.
The centrepiece is OpenTrace — a complete distributed tracing system in Go and
TypeScript, equivalent to Jaeger. It receives OTLP spans over gRPC/HTTP, processes
through Kafka with tail-based sampling, stores in ClickHouse (10M spans/sec,
p99 < 200ms on 30-day window), and renders in a Next.js UI with D3.js trace
waterfalls and live tail.

Alongside it: PayCore (financial ledger, double-entry bookkeeping, Saga payments,
Go), DungBeetle (job platform, leader election, monolith→event-driven migration,
Go), BookWise (distributed booking, fencing-token locks, 10K concurrent, 0
double-bookings, TypeScript), RouteMaster (logistics, Elasticsearch hybrid search,
fan-out notifications, TypeScript).

8 standalone building blocks: WAL store, TCP connection pool, clustered WebSocket
server, DNS resolver, LSM-tree engine, notification service, OTP gateway, API gateway.

Also applying to LFX September cycle for Jaeger — ClickHouse storage plugin
(Jaeger currently has none). N PRs already merged.

[GitHub] [OpenTrace demo] [BENCHMARKS.md] [Architecture RFC]
```

---

### Rippling

```
Subject: Backend Engineer — built DungBeetle: background job platform with
         leader election, 50K jobs/min — applying for Software Engineer 1 at Rippling

DungBeetle is a production-grade background job platform in Go: distributed leader
election (Redis SETNX + fencing), exactly-once cron across N nodes, Kafka-backed
queues, AI job orchestration, 50K jobs/min throughput. It started as a Node.js
monolith — the migration RFC documents exactly why Go, with before/after benchmarks.

The broader portfolio includes 4 other independent systems and 8 building blocks,
all with their own benchmarks and ADRs. LFX Mentorship application in progress
for Jaeger (open source contribution track).

Strong TypeScript as well: BookWise (distributed booking platform, TypeScript),
RouteMaster (logistics + Elasticsearch search, TypeScript).

[GitHub] [DungBeetle live demo] [BENCHMARKS.md]
```

---

### Uber

```
Subject: Backend Engineer — built distributed systems from scratch: leader election,
         fencing-token locks, consistent hashing — applying for SE-1 at Uber

Every distributed systems concept Uber tests — I built it in running code:

• Leader election: DungBeetle cron scheduler, Redis SETNX + TTL + Lua renewal,
  split-brain test passing
• Distributed locks with fencing tokens: BookWise seat reservation, 10K concurrent
  users, 0 double-bookings
• Consistent hashing: job routing in DungBeetle, trace routing in OpenTrace
• Exactly-once Kafka: PayCore payment events, DungBeetle job events, outbox pattern
• Go primary: PayCore, DungBeetle, OpenTrace backend — go test -race on every commit

OpenTrace: 10M spans/sec ingestion, ClickHouse p99 < 200ms on 30-day window.

[GitHub] [BENCHMARKS.md] [Architecture RFC]
```

---

### Zomato

```
Subject: Backend Engineer — Go + PostgreSQL deep, EXPLAIN ANALYZE mastery,
         10K concurrent bookings with 0 double-bookings — applying for SDE-1 at Zomato

Primary language: Go. PostgreSQL depth: MVCC, WAL, B-tree internals, all 4
isolation levels demonstrated with live anomaly scripts. EXPLAIN ANALYZE on every
query — zero seq scans on tables over 10K rows.

BookWise: distributed seat reservation, TypeScript, 10K concurrent booking attempts,
fencing-token distributed locks, Saga payment flow — 0 double-bookings verified.

PayCore: financial ledger in Go, double-entry bookkeeping, 5K TPS, sqlc-generated
queries, event sourcing from scratch.

First-principles problem solving: built WAL from scratch, LSM-tree from scratch,
TCP connection pool from scratch (pgwire protocol parsing).

[GitHub] [BookWise benchmark] [PayCore benchmark]
```

---

### Swiggy

```
Subject: Backend Engineer — built fan-out notifications at scale + Elasticsearch
         hybrid search — applying for Associate SDE at Swiggy

RouteMaster: logistics platform in TypeScript/Node.js. Fan-out: 10K shipment
notifications dispatched in < 2s using Node.js streams + Kafka consumer pipeline.
Search: Elasticsearch BM25 + kNN hybrid vector search on 1M shipment documents,
p99 < 80ms.

End-to-end system design ownership across 5 independent repos: PayCore,
DungBeetle, BookWise, RouteMaster, OpenTrace — each with k6 benchmarks,
ADRs, and CI pipelines. Both Go and TypeScript at production depth.

[GitHub] [RouteMaster demo] [BENCHMARKS.md]
```

---

### DoorDash

```
Subject: Backend Engineer — built API gateway + notification delivery service +
         job platform — applying for Software Engineer (Backend) at DoorDash

Three projects that map directly to DoorDash's stack:

1. switchboard: TypeScript API gateway — JWT RS256 via JWKS, sliding window
   rate limiting (Redis Lua), circuit breaker, SSE transparent proxy
2. herald: TypeScript notification delivery service — outbox pattern, multi-channel
   (email/SMS/push/webhook), idempotency keys, 10K notifications/hour
3. DungBeetle: Go background job platform — goroutine-per-job pool, exactly-once
   cron, leader election, 50K jobs/min — mirrors DoorDash's DevEx team's work

Go + TypeScript at production depth. All 13 repos with benchmarks and ADRs.

[GitHub] [DungBeetle demo] [herald demo] [BENCHMARKS.md]
```

---

### Amazon

```
Subject: Backend Engineer — full SDLC ownership across 5 systems, PITR drills,
         on-call runbooks — applying for SDE-1 at Amazon

5 independent production-grade systems, 9 months, 13 GitHub repos. Every project:
RFC written, ADR for every decision, k6 benchmarks, PITR drill runbook, SLO alert
rules with Alertmanager routing.

Not tutorials. Real systems: PayCore (5K TPS payment ledger), BookWise (10K
concurrent bookings), OpenTrace (10M spans/sec distributed tracing), DungBeetle
(50K jobs/min job platform), RouteMaster (logistics + Elasticsearch search).

Go primary. TypeScript secondary. Both at production depth.

[GitHub] [BENCHMARKS.md across all projects]
```

---

### Google

```
Subject: Backend Engineer — built Jaeger-equivalent distributed tracing system,
         applying for Graduate Software Engineer at Google

OpenTrace: complete open-source distributed tracing system in Go and TypeScript,
architecturally equivalent to Jaeger. OTLP-compatible (official OTel SDK → OpenTrace
with zero config changes). 10M spans/sec, ClickHouse p99 < 200ms on 30-day window.
K8s Operator manages all 7 components.

CNCF contribution track: applying to LFX September cycle for Jaeger ClickHouse
storage plugin (Jaeger currently has none — I built one for OpenTrace).

Also: PGVector RAG pipeline (BookWise seat recommendations), Vercel AI SDK tool use
(DungBeetle AI job orchestration), vector search (RouteMaster semantic search).

Go + TypeScript. 8 standalone systems projects demonstrating protocol-level
implementation depth.

[GitHub] [OpenTrace demo] [LFX proposal draft] [BENCHMARKS.md]
```

---

## Weekly Execution Rhythm

| Day | Activity | Interview Evidence It Produces |
|---|---|---|
| **Mon–Tue** | Learn the concept by reading source code. Break things intentionally. Run `EXPLAIN ANALYZE` on every query you add. | Deep technical answers in rounds 2–3. *"I triggered a phantom read in psql — here's the script."* |
| **Wed–Thu** | Ship a named feature of a named project. `go test -race ./...` or `tsc --noEmit` before pushing. | GitHub commit history with real dates. Project deep-dive material. |
| **Fri** | One Document_from_Sam problem. Write up time/space complexity before coding. | OA preparation. Constraint → complexity → approach — second nature. |
| **Sat** | Weekend biweekly project work. Benchmark it. `BENCHMARKS.md` updated. | Cold email subject line numbers: *"10M spans/sec"*, *"0 double-bookings"*. |
| **Sun** | Write one ADR. Update one README. Post one benchmark number publicly (GitHub/LinkedIn). | Bar raiser material. Shows communication is engineering. |
