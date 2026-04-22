# ADR Templates
## Architecture Decision Records — One Per Major Decision in Every Repo

---

## What an ADR Is

A one-page document that records: what decision was made, why, what alternatives were considered, and what the tradeoffs are. Written at the time of the decision, not after. Linked from the project README. This is what senior engineers write. The discipline of writing ADRs is what interviewers are actually testing in the "walk me through your project" round.

**Format:**
```
Title: ADR-001 — [Decision in one line]
Status: Accepted | Superseded by ADR-XXX
Context: What problem were you solving? What constraints existed?
Decision: What did you decide?
Alternatives Considered: What else did you evaluate and why did you reject it?
Tradeoffs: What do you give up with this decision?
Consequences: What changes because of this decision?
```

---

## ADRs by Project

---

## OpenTrace ADRs

### ADR-001 — ClickHouse over PostgreSQL for span storage
```
Context: OpenTrace stores up to 10M spans/sec. Spans are append-only time-series
         data — never updated after insertion. Query pattern: filter by service_name
         + time range, aggregate duration percentiles.

Decision: ClickHouse with MergeTree engine, monthly partitioning, 30-day TTL.

Alternatives:
  PostgreSQL: Excellent for transactional workloads. Too slow for 10M spans/sec
              write throughput — random B-tree page writes can't compete with
              LSM-tree sequential writes. Also: no columnar compression.
  Elasticsearch: Used by Jaeger by default. 8x more expensive per GB than
                 ClickHouse. Query p99 worse than ClickHouse for analytical
                 aggregations at 30-day window.
  Cassandra: LSM-tree write path similar to ClickHouse. But lacks ClickHouse's
             SQL interface and columnar analytical performance.

Tradeoffs:
  - ClickHouse is not a transactional database — no UPDATE/DELETE on individual rows.
    For spans this is fine: they are immutable after insertion.
  - Joins across ClickHouse and PostgreSQL require two separate queries and
    application-level joining.

Consequences:
  - Span metadata (service list, operation list) stays in PostgreSQL.
  - All analytical queries (latency percentiles, error rates, service maps) go to
    ClickHouse — never PostgreSQL.
  - Partition pruning must be verified on every ClickHouse query with EXPLAIN.
```

### ADR-002 — Tail-based sampling over head-based sampling
```
Context: OpenTrace cannot store 100% of spans at 10M/sec — storage would grow
         unboundedly. Must sample. Two approaches: head-based (decide on first span)
         or tail-based (decide after trace is complete).

Decision: Tail-based sampling. Keep 100% errors + slow spans (> 500ms), sample 5%
          of normal traces.

Alternatives:
  Head-based: Simple — sample on the first span. Problem: you don't know if a
              trace will contain errors until you've seen all its spans. Sampling
              away the first span of an eventually-failing trace loses the error.

Tradeoffs:
  - Tail-based requires buffering spans per trace_id for 10 seconds before making
    the sampling decision. This adds 10s of latency to storage.
  - Memory usage for the buffer: at 10M spans/sec × 10s window = 100M spans in
    flight. Mitigated by flushing partial traces after the window.

Consequences:
  - Pipeline Processor must maintain an in-memory buffer per trace_id.
  - Consistent hashing on trace_id ensures all spans of one trace go to the same
    Processor instance — no cross-instance coordination needed for sampling.
```

### ADR-003 — Kafka for span pipeline over direct ClickHouse write
```
Context: Collector receives spans and must write them to ClickHouse. Two options:
         Collector writes directly to ClickHouse, or Collector → Kafka → Processor
         → ClickHouse.

Decision: Kafka pipeline. Collector publishes to Kafka; Processor consumes and
          writes to ClickHouse.

Alternatives:
  Direct write: Simpler architecture, lower latency. Problem: if ClickHouse is
                slow or unavailable, Collector blocks. Backpressure propagates to
                instrumented applications. A slow database should not make tracing
                unavailable.

Tradeoffs:
  - Adds ~50ms latency (Kafka round trip) to span ingestion.
  - Adds operational complexity: Kafka cluster to manage.

Consequences:
  - Collector is stateless and fast — its only job is validate + publish.
  - Pipeline Processor handles retries, batching, and ClickHouse backpressure
    independently of the Collector.
  - Tail-based sampling happens in the Processor, not the Collector.
```

---

## PayCore ADRs

### ADR-001 — DECIMAL(19,4) over float64 for money
```
Context: PayCore stores monetary amounts in PostgreSQL and Go.

Decision: DECIMAL(19,4) in PostgreSQL, decimal.Decimal in Go (shopspring/decimal).
          Never float64. Never float32.

Alternatives:
  float64: Cannot represent 0.10 exactly (0.1 + 0.2 ≠ 0.3 in IEEE 754).
           Reconciliation failures: ledger debits ≠ ledger credits by small amounts
           that accumulate over millions of transactions.
  Integer cents: Store amounts as integer cents (100 = ₹1.00). Works. But loses
                 generality for currencies with more than 2 decimal places.

Tradeoffs:
  - DECIMAL is slower than float in PostgreSQL arithmetic.
  - decimal.Decimal is slower than float64 in Go.
  - Both are acceptable — correctness is not negotiable in financial systems.

Consequences:
  - All `sqlc` queries use `pgtype.Numeric` for amount columns.
  - All Go functions that handle money use `decimal.Decimal` — no `float64` in
    any function signature that touches amounts.
```

### ADR-002 — Saga choreography over two-phase commit
```
Context: A payment spans multiple services: reserve funds, charge gateway, confirm
         ledger. Must be atomic: either all succeed or all roll back.

Decision: Saga choreography via Kafka events with compensating transactions.

Alternatives:
  Two-phase commit (2PC): Coordinator asks all participants to prepare, then commit.
    Problems: blocking (coordinator failure leaves all participants blocked),
    performance (synchronous round trips to all participants), and operational
    complexity (distributed XA transactions in Go are painful).

Tradeoffs:
  - Saga provides eventual consistency, not strong consistency. Between steps,
    a partial Saga is visible (funds reserved but payment not yet confirmed).
  - Compensating transactions must be idempotent — they may be executed more than
    once if the consumer retries.

Consequences:
  - Every Saga step publishes a Kafka event.
  - Every Saga step has a corresponding compensating transaction (e.g. release
    reserved funds if payment fails).
  - Idempotency keys on every Saga step prevent duplicate execution.
```

### ADR-003 — Event sourcing over state updates for account balance
```
Context: Account balance in PayCore can be derived two ways: store the current
         balance directly (updated on each transaction) or store all events and
         compute balance by replaying them.

Decision: Event sourcing. payment_events table is the source of truth.
          Current balance = replay of all events from last snapshot.

Alternatives:
  Direct state: Simpler. One row per account, UPDATE on each transaction.
    Problem: audit trail is lossy (what was the balance on 15 Jan 2026?),
    and reconciliation requires separate audit logging anyway.

Tradeoffs:
  - Event replay is O(events since snapshot). Mitigated by snapshots every
    1000 events.
  - Read model (current balance) requires projection — separate query or
    pre-computed read model.

Consequences:
  - Immutable event log enables perfect audit trail.
  - State reconstruction from events enables point-in-time balance queries.
  - Snapshot + WAL (like PostgreSQL) keeps startup time bounded.
```

---

## DungBeetle ADRs

### ADR-001 — Go over Node.js for job worker (Migration RFC)
```
Context: DungBeetle v0.1 is a Node.js monolith. The job worker is CPU-bound
         (job classification, payload transformation). Evaluating Go rewrite.

Decision: Rewrite worker in Go. Keep Node.js for DLQ dashboard UI only.

Benchmarks (documented in BENCHMARKS.md):
  Node.js v0.1: 8,000 jobs/min (event loop blocked by CPU-bound tasks)
  Go v1.0:      50,000 jobs/min (goroutine-per-job, GOMAXPROCS = CPU count)

Alternatives:
  Node.js worker_threads: Could parallelise CPU-bound work. But M:N goroutine
    scheduler is more efficient than OS thread pool for thousands of concurrent
    short-lived jobs. Also: go test -race provides safety guarantees that
    Node.js worker_threads cannot match.

Tradeoffs:
  - Operational complexity: two codebases (Go worker, TypeScript UI).
  - Loss of npm ecosystem for worker logic.

Consequences:
  - Go worker: goroutine-per-job, SELECT FOR UPDATE SKIP LOCKED queue, Kafka consumer.
  - TypeScript: Next.js frontend only. No TypeScript in the critical path.
  - go test -race enforced from v1.0 — concurrent job dispatch must be safe.
```

### ADR-002 — Redis SETNX for leader election over etcd
```
Context: DungBeetle runs N instances. Only one should run the cron scheduler at
         a time. Need leader election.

Decision: Redis SET NX EX with Lua-based renewal. Single primary Redis with Sentinel
          (not Cluster mode).

Alternatives:
  etcd: Raft-based, truly linearizable. But adds another piece of infrastructure
        (etcd cluster) when Redis is already present for the job queue.
  PostgreSQL advisory locks: Would work. But advisory locks are session-scoped —
        connection failure releases the lock, which is actually desirable. Fallback
        option if Redis is unavailable.

Tradeoffs:
  - Redis SETNX is not safe in Redis Cluster during network partition (Redlock
    debate). Mitigated by using single-primary Redis with Sentinel — not Cluster.
  - If Redis primary fails before Sentinel promotes replica, leader lock is lost
    and all nodes compete for leadership. Acceptable — worst case is two cron
    executions, mitigated by idempotent cron jobs.

Consequences:
  - Leader renewal: Lua script atomically verifies token + extends TTL every TTL/3.
  - Split-brain test: must pass before v3.0 tag.
```

---

## BookWise ADRs

### ADR-001 — Redis distributed lock over PostgreSQL SELECT FOR UPDATE for seat claims
```
Context: BookWise must prevent double-booking. Two mechanisms available:
         PostgreSQL SELECT FOR UPDATE or Redis distributed lock.

Decision: Redis distributed lock (SET NX PX) as the outer guard + PostgreSQL
          atomic UPDATE WHERE status = 'AVAILABLE' as the inner guard.
          Two layers because Redis lock prevents wasted DB roundtrips under
          high contention; PostgreSQL UPDATE is the correctness guarantee.

Alternatives:
  PostgreSQL SELECT FOR UPDATE only: Correct, but under 10K concurrent users
    each holding a row lock causes lock contention at the PostgreSQL level.
    Lock wait timeout errors cascade to the API.

Tradeoffs:
  - Two distributed components (Redis + PostgreSQL) must both be available for
    a booking to succeed. If Redis is down, fall back to PostgreSQL-only.
  - Fencing tokens add complexity: every DB write must include the token check.

Consequences:
  - Fencing token checked in every PostgreSQL UPDATE for seat status changes.
  - Lock TTL = 30 seconds. If payment takes > 30s, lock expires and seat is
    released — considered acceptable given Stripe's typical latency.
```

### ADR-002 — SSE over WebSocket for live seat map
```
Context: Seat availability updates must reach all connected browsers in real time.
         Two options: SSE (server-sent events) or WebSocket.

Decision: SSE from BookWise API server for seat availability updates.
          relay building block for seat hold countdown timers (WebSocket needed
          for bidirectional countdown sync).

Alternatives:
  WebSocket for everything: Bidirectional, but adds complexity. Seat availability
    updates are server→client only — SSE is sufficient and simpler.
  Polling: Simple but creates thundering herd under high concurrency
           (10K users polling every 1s = 10K requests/sec just for status).

Tradeoffs:
  - SSE requires a persistent HTTP connection per client. 10K concurrent browsers
    = 10K open connections. Nginx upstream keepalive handles this.
  - SSE auto-reconnects with Last-Event-ID — missed updates are replayed.

Consequences:
  - All seat status changes publish to Redis channel.
  - SSE endpoint subscribes to Redis channel, streams to client.
  - switchboard proxies SSE transparently (Content-Type: text/event-stream passthrough).
```

---

## RouteMaster ADRs

### ADR-001 — Elasticsearch over PostgreSQL full-text for shipment search
```
Context: RouteMaster needs full-text search over 1M+ shipment records with
         faceted filtering (by carrier, status, date) and relevance scoring.

Decision: Elasticsearch 8 with BM25 + kNN hybrid vector search.

Alternatives:
  PostgreSQL full-text: tsvector + GIN index. Works for simple text search.
    Problems: no faceted aggregations without GROUP BY (slow at scale),
    no vector/semantic search, index maintenance complexity.

Tradeoffs:
  - Separate search cluster to manage and keep in sync with PostgreSQL.
  - Debezium CDC connector required to sync PostgreSQL → Elasticsearch.
  - Added latency for writes (dual write or CDC lag).

Consequences:
  - Kafka Connect Debezium: changes in PostgreSQL shipments table → Elasticsearch.
  - All search queries go to Elasticsearch. CRUD goes to PostgreSQL.
  - Hybrid search: BM25 for keyword relevance + kNN for semantic (description embedding).
```

### ADR-002 — Go for web crawler over Node.js
```
Context: RouteMaster's web crawler parses HTML from carrier websites to extract
         tracking data. Evaluating Go vs Node.js for the crawler binary.

Decision: Go binary (separate repo, separate deployment) for the crawler.

Benchmarks:
  Node.js (cheerio + axios): 150 URLs/sec (event loop saturated by HTML parsing)
  Go (golang.org/x/net/html): 500 URLs/sec (3.3x improvement)

Alternatives:
  Node.js: Familiar ecosystem (cheerio for HTML, axios for HTTP). But CPU-bound
           HTML parsing saturates the event loop even with worker_threads.
  Python (scrapy): Mature crawler framework. But adds a third language to the stack.

Tradeoffs:
  - Separate language for one binary. Team must know Go.
  - Bloom filter Bloom filter dedup (10M URLs, 0.1% FP) is more natural in Go
    than Node.js.

Consequences:
  - Go crawler binary publishes results to Kafka crawler.results topic.
  - RouteMaster Node.js API consumes from crawler.results.
  - Bloom filter state persisted to Redis on shutdown, reloaded on startup.
```

---

## Building Block ADRs

### vault — ADR-001: fsync ON vs OFF
```
Decision: fsync ON for PayCore idempotency keys, DungBeetle job dedup.
          fsync OFF for pure caches (TTL-only data where loss is acceptable).
Tradeoff: fsync ON adds ~10ms latency per write. Required for D in ACID.
          fsync OFF risks data loss on power failure — acceptable for cache workloads.
```

### pgpool — ADR-001: Transaction mode vs session mode
```
Decision: Transaction mode for all HTTP API services.
          Session mode only for DungBeetle's long-running reporting jobs.
Tradeoff: Transaction mode: connection returned after each transaction.
          10K app connections → 9 PostgreSQL connections.
          But: SET commands and prepared statements don't persist across transactions.
          Session mode: connection held for entire session. Full PostgreSQL feature set.
          But: idle connections hold backend connections.
```

### relay — ADR-001: Redis pub/sub vs Kafka for fan-out
```
Decision: Redis pub/sub.
Tradeoff: Redis pub/sub: < 10ms delivery, fire-and-forget (no persistence).
          Kafka: 50–200ms delivery, durable, replayable.
          Live trace tailing and seat hold countdowns require < 10ms — Kafka too slow.
          Durable event delivery (payment confirmations) uses Kafka directly — not relay.
```

### herald — ADR-001: Synchronous vs asynchronous notification delivery
```
Decision: Asynchronous via PostgreSQL outbox.
Tradeoff: Synchronous (call SES from PayCore): simple, but couples PayCore latency
          to SES SLA. One SES degradation spikes PayCore p99.
          Asynchronous (herald outbox): PayCore returns in < 10ms.
          Notification arrives within 30s. Acceptable for payment confirmation.
          NOT acceptable for OTP — use `priority: critical` fast queue with no backoff.
```

### switchboard — ADR-001: JWT RS256 via JWKS over HS256 shared secret
```
Decision: RS256 with JWKS endpoint.
Tradeoff: HS256: simpler, faster. But every service that verifies tokens must
          know the shared secret. If one service is compromised, all tokens can
          be forged.
          RS256: services only need the public key (from JWKS endpoint).
          Private key never leaves the auth service. If a downstream service is
          compromised, tokens cannot be forged.
```
