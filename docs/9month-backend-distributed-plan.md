# 9-Month Backend Engineering Mastery Plan
### 7-Company Target · Backend & Distributed Systems Focus
### Mapped to Sunny's Framework

---

## Your A-List (S1 ✓)

> Sunny: "Don't chase 50 logos. Go deep on a focused 5–7."

| # | Company | Bucket | Core Engineering Bar |
|---|---------|--------|----------------------|
| 1 | **Rippling** | Infra + B2B SaaS | Multi-tenant, RBAC, workflow engines, audit logs, ownership + docs |
| 2 | **Palantir** | Data Platform + AI Infra | Pipeline reliability, ontology/lineage, human-in-the-loop AI, Python + Go |
| 3 | **Uber** | Real-Time Marketplace | H3 geospatial matching, surge pricing, GPS fraud, sub-200ms dispatch |
| 4 | **DoorDash** | Last-Mile Logistics | Dasher assignment, ETA prediction, restaurant marketplace, delivery at scale |
| 5 | **JioHotstar** | Consumer Scale | High-read, CDN, live events, caching, 50M concurrent viewers |
| 6 | **Razorpay** | Fintech / Payments | Idempotency, correctness, reconciliation, RBI compliance |
| 7 | **Databricks** | Data + AI Platform | Spark, Delta Lake, distributed compute, batch vs streaming, columnar storage, ML pipelines |

**Databricks** is the 7th — they build the world's data and AI infrastructure: Spark, Delta Lake, Unity Catalog, and LLM fine-tuning pipelines. Their India bands are among the highest in the industry and their technical bar is genuinely deep. FoundryOS (your Palantir project) and the distributed pipeline work throughout the plan directly prepare you for their bar — understanding columnar storage, batch vs streaming trade-offs, and distributed compute patterns is the exact depth they hire for.

---

## Company Briefs — 4-Sentence Rule (S2 ✓)

> Sunny: "If you can't explain this in 4–5 sentences, you're not ready to interview there."

**Rippling** — Rippling unifies HR, IT, payroll, identity, and device management in one workforce platform. B2B companies pay per employee seat. You'd work on multi-tenant SaaS architecture, RBAC, audit logs, workflow engines, and external API integrations. Their culture is brutally doc-heavy — every system decision is expected to be written, owned, and defended in prose.

**Palantir** — Palantir builds Foundry (a data integration platform where heterogeneous sources are unified into a typed ontology with full pipeline lineage) and AIP (human-in-the-loop AI workflows where LLMs suggest but humans must approve actions). Enterprise governments and companies pay. You'd work on pipeline reliability, ontology-based data modeling, access control at the object level, and AI systems with hard constraints on autonomous action. Their interviews are among the hardest in the industry.

**Uber** — Uber is a real-time marketplace: matching riders to drivers in under 200ms at city scale. Revenue comes from rides and Uber Eats. You'd work on the dispatch engine (H3 geospatial matching, goroutine scoring), surge pricing (demand forecasting + ONNX inference), and GPS fraud detection (3-layer: Wasm + rules + ML). The hardest problems are sub-second matching under million-driver concurrency and fraud that adapts faster than rule engines.

**DoorDash** — DoorDash is a logistics company wearing a food app. They make money from delivery fees and restaurant commissions. You'd work on dasher assignment (combinatorial optimisation), ETA prediction (ONNX model, < 5ms), the restaurant marketplace (real-time inventory, flash-sale-style Saturday 8pm spikes), and the notification pipeline (1M delivery-status notifications/day). The hard problems are optimal assignment under uncertainty and consumer experience during supply crunches.

**JioHotstar** — JioHotstar is India's largest live-streaming platform for sports and entertainment. Revenue from subscribers and advertisers. You'd work on the HLS origin pipeline (RTMP ingest → transcode → S3 → CloudFront), live score overlay (WebSocket fan-out to 50M devices within 200ms of a wicket), viewer telemetry, and the systems that absorb 10× spike when a match starts. The hardest problem is absorbing IPL-scale spikes without touching the origin.

**Razorpay** — Razorpay builds payment infrastructure for Indian internet companies. Businesses processing payments are their customers. You'd work on the charge API, UPI collect/pay flows, webhook delivery, reconciliation against bank settlement files, and the real-time fraud scoring engine. Every system decision has RBI compliance implications — correctness and auditability are non-negotiable.

**Databricks** — Databricks builds the world's unified data and AI platform: Apache Spark, Delta Lake (ACID transactions on object storage), Unity Catalog (governance + lineage), and LLM fine-tuning pipelines. Enterprises running analytics and machine learning pay them. You'd work on distributed pipeline reliability, columnar storage query optimisation, batch vs streaming trade-offs, and the data systems that power large-scale ML. Their bar: you must think about performance and cost together, understand why ClickHouse is better than PostgreSQL for trace queries, and be able to reason from first principles about why columnar storage beats row storage for analytical workloads.

---

## Work Buckets (S3 ✓)

> Sunny: "Your projects should rhyme with the kind of work they do."

| Bucket | Companies | What They Care About |
|--------|-----------|----------------------|
| Infra + B2B SaaS | Rippling | Multi-tenancy, RBAC, workflow state machines, audit logs, docs |
| Data Platform + AI Infra | Palantir | Pipeline reliability, lineage tracking, ontology graphs, constrained AI |
| Real-Time Marketplace | Uber | Geospatial matching, surge, fraud, sub-200ms at city scale |
| Last-Mile Logistics | DoorDash | Dasher assignment, ETA, notifications at scale, consumer reliability |
| Consumer Scale | JioHotstar | HLS, CDN, WebSocket fan-out, spike absorption, telemetry |
| Fintech / Payments | Razorpay | Idempotency, double-entry, Saga, reconciliation, RBI compliance |
| Data + AI Platform | Databricks | Spark, Delta Lake, columnar storage, batch vs streaming, distributed compute, ML pipelines |

---

## The 5 Projects — Sequential Starts (S7 + S8 ✓)

> Sunny: "Pick 1 or 2 projects that look like a real product with non-trivial scale/complexity."
> You have 5 — each in its own GitHub repo, independently deployed, benchmarked, documented.

```
Month:  1    2    3    4    5    6    7    8    9
        |    |    |    |    |    |    |    |    |
PayRail      [====|====]                            → Razorpay + Databricks
DispatchOS             [====|====]                  → Uber + DoorDash
WorkOS                       [====|====]            → Rippling
FoundryOS                          [====|====]      → Palantir + Databricks
StreamEdge                               [====|=]   → JioHotstar
```

**Why these projects:**
- **PayRail** — Payment gateway + UPI engine + reconciliation. Mirrors Razorpay's internal infra. Kafka outbox, exactly-once semantics, idempotency — and the ClickHouse analytics pipeline rhymes directly with Databricks' data platform work.
- **DispatchOS** — Real-time marketplace matching engine. H3 geospatial, Go goroutine matching, surge pricing ONNX, GPS fraud. Mirrors Uber's dispatch + DoorDash's dasher assignment.
- **WorkOS** — Multi-tenant workforce platform. RBAC, audit logs, Kafka CDC, K8s Operator for tenant provisioning, workflow engine. Mirrors Rippling's entire product surface.
- **FoundryOS** — Data integration + ontology platform with human-in-the-loop AI. PySpark, Delta Lake, lineage tracking, constrained AI agents. Mirrors Palantir Foundry + AIP. Delta Lake + columnar storage + distributed compute rhymes directly with Databricks' core engineering.
- **StreamEdge** — HLS origin + CDN pipeline + live score overlay. WebSocket fan-out, K8s autoscaler, Redis pub/sub. Mirrors JioHotstar's live broadcast infra.

---

## The 3 Parallel Tracks — Never Skipped (S4 ✓)

> Sunny: "No hack — you can't skip any of the three if you're aiming for the top."

```
         M1   M2   M3   M4   M5   M6   M7   M8   M9
DSA      ████ ████ ████ ████ ████ ████ ████ ████ ████  (tapers in volume, never stops)
SYSTEMS  ████ ████ ████ ████ ████ ████ ████ ████ ░░░░  (company-specific only in M9)
PROJECT  ░░░░ ████ ████ ████ ████ ████ ████ ████ ████  (polish + deploy in M8–9)
```

---

## Month-by-Month Plan

---

### Month 1 — Foundations & Target Lock
**Phase:** Orient | **Weeks 1–4**
**Sunny's points:** S1, S2, S3, S4, S5, S6

---

#### DSA Track
Arrays, strings, hashing, two pointers — 3–4 problems/day.
Connect every problem to reality: LRU cache = Redis eviction. Consistent hashing = Uber matching pod routing. Bloom filter = Razorpay fraud pre-screen.

#### Systems Track
- HTTP/HTTPS/DNS/TLS/TCP deep: run `curl -v` and `dig +trace` on every endpoint you build
- REST vs gRPC vs webhooks vs SSE vs WebSocket — know when to use each
- PostgreSQL fundamentals: ACID, isolation levels, indexes, `EXPLAIN ANALYZE`
- Small designs: URL shortener, leaderboard, rate limiter, notification service
- ADR/RFC habit from Day 1: every major decision → 3-paragraph doc

#### Project Track
No project yet. All 5 repos created with:
- Raw HTTP server shell (Go)
- `README.md` + `BENCHMARKS.md` placeholder
- GitHub Actions: `go test -race ./...` passing
- `goleak.VerifyNone(t)` in every test file

**Deliverables this month:**
- Lock A-list to exactly 7 companies
- Write the 4-sentence brief for each (S2)
- Categorise each into its work bucket (S3)
- Weekly time-block locked in: DSA 5h + Systems 3h + Project 10h (S4)

---

#### How This Month Covers Sunny's Points

| Point | What You Do |
|---|---|
| S1 | Lock exactly 7 companies. No more added. |
| S2 | 4-sentence brief written for all 7. What they solve, who pays, core engineering surface. |
| S3 | Bucketed: infra SaaS / data platform / marketplace / logistics / consumer scale / fintech / distributed infra. |
| S4 | 3-track weekly rhythm established — runs all 9 months. |
| S5 | Arrays, strings, hashing starts today. 3–4/day. Review old problems every 3rd day. |
| S6 | Small designs only: URL shortener, leaderboard, notifications. Trade-offs over buzzwords. |

---

### Month 2 — PayRail v1 + DSA Patterns
**Phase:** Build | **Weeks 5–8**
**Sunny's points:** S4, S5, S6, S7, S8

---

#### DSA Track
Sliding window, two pointers, binary search, linked lists — 3 problems/day. Tag by pattern.

#### Systems Track
- **Kafka essentials:** topic → partition → offset model, partition key selection, consumer groups, idempotent producer, exactly-once semantics (transactional API) — **Databricks' entire data pipeline reliability bar lives here**
- Outbox pattern: guaranteed at-least-once with idempotent consumer = effective exactly-once
- All 4 PostgreSQL isolation levels with live anomaly demos in `psql`
- Design: "charge a card", "retry a failed payment", "webhook with retries + backoff" (Sunny's verbatim Razorpay prep)

#### Project Track — PayRail v1

**What it is:** A payment gateway + UPI engine. Mirrors Razorpay's internal infrastructure. Kafka outbox and exactly-once semantics also directly demonstrate Databricks' pipeline reliability bar.

**v1 deliverables:**

**Double-entry ledger** — Every rupee accounted for at the DB level, not just the application level:
```sql
CREATE TABLE journal_entries (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    transaction_id  UUID NOT NULL,
    account_id      UUID NOT NULL,
    amount          DECIMAL(19,4) NOT NULL,
    direction       TEXT CHECK (direction IN ('DEBIT', 'CREDIT')),
    idempotency_key TEXT UNIQUE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
-- A single-sided write fails at the DB before PayRail code runs.
-- RBI compliance: every rupee has two matching journal entries.
```

**Idempotency** — Same `X-Idempotency-Key` sent 10 times → 1 charge, 9 cached responses. Verified by test:
```go
// PostgreSQL: INSERT ... ON CONFLICT (idempotency_key) DO NOTHING RETURNING id
// If no rows returned → idempotency hit → return cached response from Redis
```

**UPI flow:**
- `POST /upi/collect` → generates collect request, sends to payer's VPA
- `POST /upi/pay` → debit merchant account
- NPCI integration pattern: VPA validation, collect expiry, status polling

**Webhook delivery:**
- HMAC-SHA256 signed (`X-Razorpay-Signature`-style header)
- Retry: 1s, 2s, 4s, 8s... up to 3 days
- DLQ with manual retry UI
- Delivery log: every attempt recorded (status code, response time, payload hash)

**Outbox pattern:**
```go
// In ONE transaction:
// 1. Insert journal_entries (debit + credit)
// 2. Insert into payment_outbox (status: pending)
// 3. Commit
// Separate outbox worker: reads pending → publishes to Kafka → marks published
// Crash between steps 1 and 2: transaction rolls back. No partial state.
// Crash between Kafka publish and mark: worker retries. Idempotent consumer deduplicates.
// This is the exact pipeline reliability guarantee Databricks requires in their data infra.
```

**Kafka topic design:**
```
payments.events    → partition key = user_id   (ordering per user guaranteed)
payments.dlq       → partition key = payment_id
```

**Benchmarks (k6):** 10K TPS, p99 < 500ms, zero double charges. Documented in `BENCHMARKS.md`.

---

#### How This Month Covers Sunny's Points

| Point | What You Do |
|---|---|
| S4 | All 3 tracks parallel. |
| S5 | Sliding window, binary search. Pattern-tagged. |
| S6 | Design "charge a card" and "retry failed payment" from scratch. All 4 isolation levels demoed live. |
| S7 | PayRail has real product surface: users, auth, payments, double-entry ledger, webhooks. |
| S8 | PayRail = mini Razorpay. Outbox + exactly-once rhymes directly with Databricks' pipeline reliability bar. |

---

### Month 3 — PayRail v2 + Trees & Graphs
**Phase:** Build | **Weeks 9–12**
**Sunny's points:** S4, S5, S6, S7, S8, S9

---

#### DSA Track
Trees, graphs, BFS/DFS, heaps — 2–3 medium/hard per day. Speed + explanation clarity.

#### Systems Track
- Reconciliation engine: bank settlement file processing, UTR matching, discrepancy detection
- Risk engine: 3-layer fraud detection (Wasm pre-filter → Go rules → ONNX ML)
- Saga pattern: sequence of local transactions with compensating rollbacks
- Observability: structured logs with `trace_id`, Prometheus metrics, Grafana RED method
- Kafka Connect: Debezium CDC source connector

#### Project Track — PayRail v2

**Reconciliation engine:**
- Bank settlement file (CSV from NPCI) uploaded to S3 daily
- Go worker: download → parse → match each row against PayRail ledger by UTR number
- Discrepancy types: missing in PayRail (bank settled, we have no record) / missing in bank (we charged, bank has no record)
- RBI mandates daily reconciliation. A discrepancy not resolved within 24h is a compliance violation.

**Risk engine — 3 layers, < 200ms total:**
```
Layer 1: Wasm pre-filter (AssemblyScript)
  → Known malicious BIN numbers, blocklisted VPAs
  → < 1ms decision

Layer 2: Go rules engine
  → Velocity: > 5 payments/minute from same device → flag
  → Amount anomaly: 10× above usual transaction size → flag
  → New account + high value → flag

Layer 3: ONNX ML model (Go inference, embedded in binary)
  → Gradient boosting, < 10ms inference
  → No Python runtime on the server

Total: < 200ms p99 (RBI requirement)
```

**Payment Saga:**
```
UPI pay → debit merchant (step 1) → NPCI route (step 2) → credit beneficiary (step 3)
Failure at step 2: step 1 reversed (compensating transaction)
All steps idempotent. Outbox on every Kafka publish.
```

Write 3 behavioural stories for PayRail: big win (idempotency saved X duplicate charges), big failure (outbox pattern missing in v1 lost events on crash, fixed in v2), conflict (leaky bucket vs token bucket for payment confirmation endpoint — documented in ADR).

---

#### How This Month Covers Sunny's Points

| Point | What You Do |
|---|---|
| S4 | All 3 tracks maintained. |
| S5 | Medium/hard trees & graphs. Speed + clarity. |
| S6 | Metrics pipeline design. Kafka CDC patterns. Exactly-once semantics deep. |
| S7 | PayRail now has reconciliation, fraud engine, Saga — non-trivial complexity. |
| S8 | Reconciliation + fraud = exactly what Razorpay engineers build. ClickHouse analytics pipeline rhymes with Databricks. |
| S9 | Sunny's Razorpay prep: real examples of bugs prevented in critical flows. You built it. |

---

### Month 4 — DispatchOS v1 + DP & Greedy
**Phase:** Build | **Weeks 13–16**
**Sunny's points:** S4, S5, S6, S7, S8

---

#### DSA Track
DP fundamentals, greedy, intervals — 2–3 problems/day.

#### Systems Track
- H3 hexagonal grid: divide Earth into hexagons at multiple resolutions. Resolution 7 (~5km², city surge zones), Resolution 9 (~0.1km², pickup areas). `h3.latLngToCell(lat, lng, resolution)` → instant spatial index. `h3.gridDisk(cell, k)` → all cells within k rings
- PostGIS: `ST_DWithin` for radius search, GIST spatial index — benchmark with and without index (800ms → 2ms on 500K drivers)
- Consistent hashing: matching engine shards across pods by H3 zone cluster. Adding a pod remaps only 1/N zones
- Cassandra: write-heavy location telemetry at 1M events/day per driver

#### Project Track — DispatchOS v1

**What it is:** Real-time marketplace matching engine. Mirrors Uber's dispatch core + DoorDash's dasher assignment.

**v1 deliverables:**

**Go location aggregator — 13× throughput over Node.js:**
```go
// 500 goroutines: each processes a batch of location events
// → H3 enrichment (cell from lat/lng, < 0.02ms)
// → PostGIS update (driver's current position)
// → Redis sorted set update (ZADD drivers:active:{h3Cell} {timestamp} {driverId})
// Benchmark: Node.js 40K events/sec → Go 520K events/sec. Same PostGIS, same Redis.
```

**Matching engine — every 500ms:**
```go
func runMatchingEngine(ctx context.Context) {
    ticker := time.NewTicker(500 * time.Millisecond)
    for range ticker.C {
        openRequests, _ := fetchOpenRequests(ctx)
        var wg sync.WaitGroup
        for _, req := range openRequests {
            wg.Add(1)
            go func(r TripRequest) {
                defer wg.Done()
                // H3 ring search: all cells within ~2km of rider
                candidateCells := h3.GridDisk(r.H3Cell, 3)
                // Redis multi-key: active drivers in each cell
                candidates := fetchDriversFromRedis(ctx, candidateCells)
                // Score: distance × driver_rating × estimated_pickup_time
                best := scoreCandidates(r, candidates)
                assignTrip(ctx, r.ID, best.DriverID) // idempotent
            }(req)
        }
        wg.Wait()
    }
}
// < 50ms for 10K open requests simultaneously.
// k6: 100K concurrent trip requests, p99 assignment < 200ms, zero double-assignments.
```

**Trip assignment Saga:**
```
payment.held → driver.assigned → trip.started
Failure: driver.unavailable → payment.released (compensating transaction)
Idempotency key on every compensation: release-{tripId}
```

**PostgreSQL schema with PostGIS:**
```sql
CREATE TABLE drivers (
    id          UUID PRIMARY KEY,
    location    geography(POINT, 4326),
    h3_cell_r9  TEXT,     -- pre-computed, updated on every ping
    status      TEXT CHECK (status IN ('active', 'on_trip', 'offline'))
);
-- Spatial index: essential for ST_DWithin to be fast
CREATE INDEX ON drivers USING GIST(location);
-- Query: all active drivers within 2km
-- SELECT id FROM drivers WHERE ST_DWithin(location::geography, ST_MakePoint($1,$2)::geography, 2000)
-- With GIST index: 2ms on 500K drivers. Without: 800ms. Document this in BENCHMARKS.md.
```

---

#### How This Month Covers Sunny's Points

| Point | What You Do |
|---|---|
| S4 | Two repos now. 3 tracks still held. |
| S5 | DP + greedy — classic hard patterns. |
| S6 | H3 geospatial design + consistent hashing + Cassandra write patterns. |
| S7 | DispatchOS adds geospatial + matching + distributed coordination complexity. |
| S8 | DispatchOS directly rhymes with Uber dispatch + DoorDash dasher assignment. |

---

### Month 5 — DispatchOS v2 + WorkOS v1
**Phase:** Build | **Weeks 17–20**
**Sunny's points:** S4, S5, S6, S7, S8, S10

---

#### DSA Track
Bit manipulation, tries, union-find — 2 problems/day. Start timed mock sets (45-min blocks).

#### Systems Track
- Multi-tenant SaaS patterns: RLS (Row-Level Security), schema-per-tenant for sensitive data, `X-Tenant-ID` header, `AsyncLocalStorage`
- RBAC + ABAC: JWT payload with `roles` + `permissions`, middleware enforcement, attribute-based conditions
- K8s Operator: CRD pattern, reconcile loop, `controller-runtime`
- System design: multi-tenant SaaS platform (Rippling's core problem)

#### Project Track — DispatchOS v2 + WorkOS v1

**DispatchOS v2 additions:**

**Surge pricing engine (ONNX Go inference):**
```go
// ONNX model: [active_trips, open_requests, hour_of_day, weather_code] → surge_multiplier
// < 3ms inference, embedded in Go binary — no Python runtime
// Redis: SET surge:{h3Cell} {multiplier} EX 30   (30s TTL, recomputed every 20s)
// H3 heatmap served to dispatcher UI via SSE
```

**K8s Operator — DispatchOSMatcherPool:**
```go
// CRD spec: minReplicas, maxReplicas, targetActiveTripsPerReplica
// Operator reads live Prometheus metric active_trips_total
// Computes desired replicas, updates HPA target
// Pre-event scaling: spec.scheduledEvents[].startTime → scale before demand hits
// New Year's Eve at 23:30 → Operator scales to maxReplicas automatically
```

**GPS fraud detection (3 layers, < 15ms):**
```
Layer 1: Wasm pre-screen — known spoof coordinates, < 1ms
Layer 2: Go rules — impossible speed (> 300 kmph), teleportation (> 100km in 10s)
Layer 3: ONNX ML — pattern classifier, embedded in binary
Suspicious accounts → proposeAction: suspend → human review (not auto-suspend)
```

---

**WorkOS v1:**
**What it is:** Multi-tenant workforce platform. Mirrors Rippling's HRIS + identity + workflow engine.

**v1 deliverables:**

**Multi-tenancy from Day 1:**
```go
// Every DB query automatically scoped — tenant can never read another's data
// PostgreSQL RLS: CREATE POLICY tenant_isolation ON employees
//   USING (tenant_id = current_setting('app.tenant_id')::uuid)
// Set at connection time: SET LOCAL app.tenant_id = $1
```

**RBAC middleware:**
```go
// JWT payload: { sub, tenantId, roles: ["hr_admin"], permissions: ["employees:read", "payroll:write"] }
// Middleware: requirePermission("payroll:write") → check JWT → 403 if missing
// Attribute-based: manager can only read employees in their own department
//   WHERE manager_id = req.user.id
```

**Employee onboarding Saga (Rippling's core workflow engine pattern):**
```
HRIS record created →
  IT provisioning (laptop + accounts) →
  Slack invite →
  Payroll setup →
  Benefits enrollment
Each step: idempotent, retryable, compensatable.
Failure at step 3: steps 1+2 NOT reversed (additive workflow, not transactional).
Failure at step 5 (benefits): alert HR to manually complete.
State machine stored in PostgreSQL. Survives service restarts.
```

**Write 3 behavioural stories per project.** First full mock interview: DSA + design + behavioural (60–90 min).

---

#### How This Month Covers Sunny's Points

| Point | What You Do |
|---|---|
| S4 | Still 3 tracks. No skipping. |
| S5 | Timed mock sets start. Speed + clarity. |
| S6 | Multi-tenant SaaS design = Rippling's entire interview territory. |
| S7 | Three non-trivial projects building in parallel. |
| S8 | WorkOS rhymes with Rippling's exact product surface. DispatchOS v2 adds DoorDash delivery patterns. |
| S10 | Behavioural story bank starts — 3 stories per project, big win / failure / conflict. |

---

### Month 6 — WorkOS v2 + FoundryOS v1 + Mock Ramp-Up
**Phase:** Sharpen | **Weeks 21–24**
**Sunny's points:** S4, S5, S6, S7, S8, S9, S10

---

#### DSA Track
Graph algorithms (Dijkstra, Bellman-Ford), topological sort, advanced DP — 2 problems/day.

#### Systems Track
- K8s Operator deep: `WorkOSTenantProvisioner` CRD — auto-provisions PostgreSQL schema + Redis keyspace + S3 bucket + Kafka topics for a new customer in 30 seconds
- Kafka Connect: Debezium CDC source (WorkOS DB changes → Kafka → FoundryOS ingests automatically)
- Delta Lake: ACID transactions on object storage, time-travel (`VERSION AS OF N`), `MERGE INTO` for upserts
- Data lineage: every pipeline run records `{ inputs, outputs, transformations, run_id }`
- System design: live sports score service — CDN, cache-control, push vs pull, backpressure (**Sunny's verbatim JioHotstar prep**)

#### Project Track — WorkOS v2 + FoundryOS v1

**WorkOS v2 additions:**

**K8s Operator — WorkOSTenantProvisioner:**
```go
// CRD spec: tenantId, plan, region
// Operator reconcile:
// 1. Provision PostgreSQL schema (CREATE SCHEMA tenant_{id})
// 2. Create Redis ACL (keyspace prefix tenant:{id}:*)
// 3. Create S3 bucket with tenant isolation policy
// 4. Create Kafka topics (workos.{tenantId}.events)
// New Rippling customer → kubectl apply -f tenant.yaml → fully provisioned in 30s
// This is exactly the kind of ownership Rippling values:
// "Here is a broken system. Here is the cleaned-up version. Here are the metrics."
```

**Audit log (append-only, tamper-evident):**
```sql
-- PostgreSQL CDC → Kafka vaultauth.audit.events → ObserveFlow
-- PARTITION BY HASH (user_id) + CLUSTER INDEX (user_id, created_at)
-- NEVER deletes. RLS prevents tenants from reading other tenants' audit logs.
-- Written as: "I built an append-only audit log because Rippling needs regulatory compliance
--              and I wanted to demonstrate I understand why append-only matters."
```

**Usage-based billing:**
- `ZINCRBY usage:{tenantId}:{month} 1 api_calls` on every API call
- Go worker drains Redis counters to PostgreSQL every hour
- Monthly invoice: sum usage × unit price per tier
- Proration: mid-month plan change → `days × old_rate + days × new_rate`

---

**FoundryOS v1:**
**What it is:** Data integration + ontology platform. Mirrors Palantir Foundry.

**v1 deliverables:**

**CDC auto-ingestion (Palantir Foundry's core value prop):**
```
WorkOS PostgreSQL WAL
  → Debezium CDC source connector
  → Kafka dispatchos.cdc.trips
  → FoundryOS consumer
  → Delta Lake dataset (s3://foundryos/delta/trips/)
Every WorkOS DB write automatically appears as a FoundryOS dataset record.
No manual pipeline trigger. No batch delay.
```

**PySpark pipeline:**
```python
# WorkOS employee events → PySpark → clean + aggregate → Delta Lake
events = spark.readStream \
    .format("kafka") \
    .option("subscribe", "workos.employee.events") \
    .load()

activity = events \
    .withWatermark("event_time", "10 minutes") \
    .groupBy(window("event_time", "1 hour"), "tenant_id") \
    .agg(count("*").alias("event_count"))

activity.writeStream \
    .format("delta") \
    .option("checkpointLocation", "s3://foundryos/checkpoints/workos/") \
    .start("s3://foundryos/delta/workos-activity/")
```

**Lineage tracking (Palantir's hardest interview question):**
```
raw_kafka_events → spark_pipeline → delta_table → dbt_model → dashboard
Every pipeline run writes: { inputs: [...], outputs: [...], run_id, started_at }
FoundryOS UI: click any dataset → see full upstream lineage DAG
```

3x/week mock interviews: DSA + design + behavioural.

---

#### How This Month Covers Sunny's Points

| Point | What You Do |
|---|---|
| S4 | 3 tracks, every week. |
| S5 | Graph algos — Dijkstra, topological sort. Timed. |
| S6 | Live score system = Sunny's JioHotstar exercise. Delta Lake + CDC + lineage = Palantir's bar. |
| S7 | Four non-trivial projects active. Each with real distributed systems depth. |
| S8 | WorkOS = Rippling. FoundryOS = Palantir Foundry. Direct project-to-company alignment. |
| S9 | Rippling seasoning: K8s Operator, audit log, doc-heavy culture met with ADRs. Palantir: lineage tracking first version live. Databricks: Delta Lake + CDC + columnar storage patterns running in real code. |
| S10 | 3x/week mocks including behavioural. Story bank expanding across all 4 projects. |

---

### Month 7 — FoundryOS v2 + StreamEdge v1 + Company Deep-Dives
**Phase:** Sharpen | **Weeks 25–28**
**Sunny's points:** S4, S5, S6, S7, S8, S9, S10, S11

---

#### DSA Track
Hard problems only — 1–2/day. Tag weak areas, review systematically.

#### Systems Track
- HLS internals: `m3u8` playlist (text file, `Cache-Control: no-cache`), `.ts` segments (immutable, `Cache-Control: max-age=3600`), adaptive bitrate (ABR), master playlist
- WebRTC: WHIP ingestion protocol, STUN/TURN, < 500ms glass-to-glass latency
- Spark Structured Streaming: stateful windowing, watermarking, trigger intervals, checkpointing — **Databricks' exact streaming model**
- Human-in-the-loop AI: approval queues, constrained autonomy, audit trail — **Palantir AIP's hardest design problem**
- System design: distributed data pipeline (Databricks/Palantir pattern) — batch vs streaming trade-off

#### Project Track — FoundryOS v2 + StreamEdge v1

**FoundryOS v2 additions:**

**Human-in-the-loop AI (Palantir AIP — the exact architecture they interview on):**
```typescript
// AIPilot: AI can query and suggest. It CANNOT act autonomously.
tools: {
  queryFoundryDataset: { /* reads Delta Lake — OK */ },
  searchPipelineHistory: { /* reads ClickHouse — OK */ },
  proposeAction: {
    // AI calls this when it identifies something to fix.
    // Creates a row in decisions table with status: 'pending_approval'.
    // A human analyst reviews the AI's justification + evidence, then approves or rejects.
    // The AI cannot approve its own suggestions. Ever.
    // This is the architecture Palantir AIP is built on.
    execute: async ({ actionType, parameters, justification }) => {
      return db.insert('decisions', {
        status: 'pending_approval',
        ai_suggestion: { actionType, parameters, justification },
      });
    }
  }
}
// Full audit trail: every AI suggestion, every human decision, every action taken.
// Queryable for compliance.
```

**Great Expectations data quality gating:**
```
Pipeline runs → Great Expectations validation → if row_count < expected OR null_rate > 1%:
  halt pipeline, alert team, DO NOT write bad data to Delta Lake downstream
Delta time-travel: if bad data slipped through → VERSION AS OF N rollback
Lineage: every downstream dataset marked "may be affected" automatically
```

---

**StreamEdge v1:**
**What it is:** HLS origin + CDN pipeline + live score overlay. Mirrors JioHotstar's live broadcast infrastructure.

**v1 deliverables:**

**HLS origin server (Go):**
```go
// Encoder pushes .ts segment every 2 seconds via RTMP/WHIP
// Go pipeline (errgroup — all in parallel):
//   1. Validate segment
//   2. Transcode to 4 bitrates (240p/480p/720p/1080p) — goroutines
//   3. Upload all 4 to S3 (immutable, Cache-Control: max-age=3600)
//   4. Update m3u8 manifest in Redis (Cache-Control: no-cache — changes every 2s)
// The CDN caches .ts segments forever. Never caches the playlist.
// This is the fundamental CDN decision that enables streaming at scale.
```

**Live score overlay (WebSocket + Redis pub/sub fan-out):**
```
Cricket scoring system → PUBLISH score:{matchId} "Kohli six! 184/3" to Redis
All StreamEdge server replicas SUBSCRIBE to that channel
50M connected viewers receive the score overlay within 200ms of the wicket
Test: kill one replica → viewers on other replicas continue uninterrupted
Benchmark: fan-out latency at 10K / 50K / 200K concurrent subscribers
```

**CDN pre-warming (15 minutes before every IPL match):**
```go
// DungBeetle-style cron job: 15 min before scheduled match start
// Concurrently GET first 10 .ts segments from all 18 India CloudFront PoPs
// Result: first viewer in Mumbai hits CloudFront cache, not origin server
// Without pre-warming: first-viewer cold start adds 200-400ms to every PoP
```

**Resume v1 drafted.** Decision docs written for 2 projects (Rippling prep). Cold DM templates drafted for all 7 companies.

---

#### How This Month Covers Sunny's Points

| Point | What You Do |
|---|---|
| S4 | Heavy project load. DSA/systems still held. |
| S5 | Hard-only problems. Systematic pattern review. |
| S6 | Distributed pipeline design + human-in-the-loop AI = Palantir's exact questions. Batch vs streaming ADR + ClickHouse columnar design = Databricks' exact questions. |
| S7 | Five active projects. Each independently deployed. |
| S8 | FoundryOS = Palantir Foundry + AIP + Databricks data platform. StreamEdge = JioHotstar broadcast infra. |
| S9 | Palantir seasoning: constrained AI agents, lineage tracking, Great Expectations gating. JioHotstar: CDN cache decisions, HLS. Databricks: you can now speak to Delta Lake compaction, ClickHouse MergeTree, and batch vs streaming from implementation. |
| S10 | Stories updated with numbers across all 5 projects. |
| S11 | Resume v1 live. Cold DMs drafted. Referral research started. |

---

### Month 8 — StreamEdge v2 + Interview Simulation Sprint
**Phase:** Peak | **Weeks 29–32**
**Sunny's points:** S4, S5, S6, S9, S10, S11, S12

---

#### DSA Track
1–2 hard problems/day. Weak pattern focus only.

#### Systems Track — Company-Specific Designs Only

One full 45-min system design mock per target company this month:

| Company | Design You Do |
|---------|--------------|
| **Rippling** | Multi-tenant HRIS + employee onboarding Saga (20 steps, compensatable). K8s Operator for tenant provisioning. |
| **Palantir** | Data pipeline reliability: cascading failure detection, Great Expectations gating, Delta time-travel rollback, lineage impact graph. |
| **Uber** | Real-time driver-rider matching: H3 ring search → Redis driver sets → Go goroutine scoring → < 200ms p99 at 100K TPS. |
| **DoorDash** | Dasher assignment optimisation + ETA prediction under uncertainty. Notifications: 1M/day, APNs/FCM, Redis dedup. |
| **JioHotstar** | Live sports streaming at 50M concurrent: HLS + CDN pre-warming + WebSocket score overlay + K8s autoscaler. |
| **Razorpay** | Payment gateway: idempotency, UPI flow, webhook delivery, reconciliation, fraud engine < 200ms. |
| **Databricks** | Distributed pipeline reliability: batch vs streaming trade-off, Delta Lake compaction, columnar storage query optimisation, ClickHouse vs PostgreSQL for analytical workloads. |

#### Project Track — StreamEdge v2 + All Projects Polish

**StreamEdge v2 additions:**
- K8s Operator (`StreamScalerOperator`): reads Prometheus `viewer_count{streamId}` → scales HLS origin pods → 10× scale in 30s during IPL match boundary
- WebRTC WHIP ingest (< 500ms glass-to-glass for commentator feeds)
- TimescaleDB hypertable for viewer telemetry (Kafka `viewer-telemetry` topic → continuous aggregates)

**All 5 projects get:**
- `BENCHMARKS.md` complete: k6 p50/p95/p99 at target RPS, before/after optimisation
- Architecture diagram (Mermaid) in README
- ADR for every major technology decision
- `go test -race ./...` passing everywhere
- `goleak.VerifyNone(t)` passing everywhere
- Deployed, publicly accessible demo

**Target benchmarks:**

| Project | Target | p99 SLO | Zero-Error SLO |
|---------|--------|---------|----------------|
| PayRail | 10K TPS | < 500ms | zero double charges |
| DispatchOS | 100K concurrent trip requests | < 200ms assignment | zero double-assignments |
| WorkOS | 10K tenants, 500 concurrent sessions each | < 100ms, zero cross-tenant leaks | — |
| FoundryOS | 1M pipeline events/sec | < 5min end-to-end | zero data quality violations downstream |
| StreamEdge | 50K concurrent viewers | CloudFront p99 < 100ms | — |

**Full interview simulations: 3x/week** — 45-min DSA + 45-min design + 30-min behavioural. Cold DMs sent to engineers at all 7 companies.

---

#### How This Month Covers Sunny's Points

| Point | What You Do |
|---|---|
| S4 | DSA + company designs + project polish — all 3. |
| S5 | 1–2 hard/day retention. |
| S6 | One company-specific design mock per all 7 targets. |
| S9 | Dedicated seasoning: Databricks columnar + batch/stream ADR, Palantir lineage, JioHotstar CDN, Uber H3 matching, Rippling docs. |
| S10 | Full mock rounds. Every story has specific numbers, impact, your role. No inflated metrics. |
| S11 | Cold DMs sent. 5 shipped, benchmarked projects = proof of work. |
| S12 | Deliberate, focused prep. Not luck-chasing. |

---

### Month 9 — Applications, Referrals & Serious Pitches
**Phase:** Launch | **Weeks 33–36**
**Sunny's points:** S5, S9, S10, S11, S12

---

#### DSA Track
1 problem/day. Maintenance only.

#### Systems Track
Revise only. No new material.

**Deliverables:**
- Apply to all 7 companies via referral > portal
- 5–10 real conversations with engineers at target companies
- Per-company prep card: their recent eng blog posts, open source contributions, your aligned project
- Resume v2 after peer/community feedback

---

**Cold Email Templates:**

**Uber:**
```
Subject: [Uber SDE] — built DispatchOS: H3 matching, sub-200ms assignment at 100K TPS

DispatchOS mirrors Uber's dispatch architecture.

• Go matching engine: H3 ring search → Redis driver sets → goroutine scoring.
  k6: 100K concurrent requests, p99 assignment < 200ms, zero double-assignments.
• K8s Operator: surge event → auto-scales matching pods in 30s (live Prometheus metric).
• GPS fraud: Wasm pre-screen + Go rules + ONNX inference, 3 layers, < 15ms decision.

[GitHub] [BENCHMARKS.md] [H3 architecture ADR]
```

**Palantir:**
```
Subject: [Palantir SDE] — built FoundryOS + human-in-the-loop AI, full pipeline lineage

FoundryOS mirrors Palantir Foundry + AIP.

• Pipeline reliability: Great Expectations gating + Delta time-travel rollback +
  lineage impact analysis. Bad data halts pipeline before reaching downstream datasets.
• Human-in-the-loop AI: LLM can query and suggest, cannot act autonomously.
  All proposed actions go to approval queue. Full audit trail. Immutable decision log.
• CDC auto-ingestion: WorkOS DB changes → Debezium → Kafka → Delta Lake automatically.

[GitHub] [BENCHMARKS.md] [lineage tracking ADR]
```

**Rippling:**
```
Subject: [Rippling SDE] — built WorkOS: multi-tenant HRIS, tenant provisioning in 30s via K8s Operator

WorkOS mirrors Rippling's architecture.

• K8s Operator: new tenant → PostgreSQL schema + Redis ACL + S3 bucket + Kafka topics in 30s.
  kubectl apply -f tenant.yaml. Fully isolated. No manual steps.
• Multi-tenant isolation: RLS + schema separation + connection pooling.
  k6: 10K tenants, p99 < 100ms, zero cross-tenant data leaks.
• Employee onboarding Saga: 20 steps (HRIS → IT → Slack → payroll → benefits),
  each idempotent, retryable, compensatable. Written decision doc attached.

[GitHub] [BENCHMARKS.md] [tenant isolation ADR]
```

**JioHotstar:**
```
Subject: [JioHotstar SDE] — built StreamEdge: HLS pipeline, 50K concurrent viewers,
         score overlay < 200ms from wicket to screen

StreamEdge mirrors JioHotstar's live broadcast infrastructure.

• Go HLS pipeline: RTMP ingest → transcode 4 bitrates → S3 upload → CloudFront,
  all in parallel via errgroup.
• Score overlay: Redis pub/sub fan-out → WebSocket → 50K concurrent viewers,
  < 200ms end-to-end from wicket event to screen.
• K8s Operator: viewer_count Prometheus metric → auto-scale HLS origin in 30s.

[GitHub] [BENCHMARKS.md] [CDN cache decision ADR]
```

**Razorpay:**
```
Subject: [Razorpay SDE] — built PayRail: UPI gateway, double-entry ledger, < 200ms fraud

PayRail mirrors Razorpay's internal payment infrastructure.

• Double-entry ledger: DB-level constraint prevents single-entry writes.
  CHECK enforced before application code runs. RBI-compliant.
• Idempotency: same X-Idempotency-Key 10 times → 1 charge, 9 cached responses.
  Verified by test in BENCHMARKS.md.
• Risk engine: Wasm pre-screen + Go rules + ONNX ML, 3 layers, < 200ms p99.

[GitHub] [BENCHMARKS.md] [reconciliation engine ADR]
```

**Databricks:**
```
Subject: [Databricks SDE] — built FoundryOS + PayRail: Delta Lake pipelines,
         ClickHouse columnar storage, distributed compute at scale

FoundryOS mirrors Databricks' data platform architecture.

• Delta Lake pipelines: PySpark streaming (WorkOS events → transform → Delta Lake),
  MERGE INTO for upserts, time-travel rollback (VERSION AS OF N) on bad data,
  monthly partitioning with pruning verified via EXPLAIN.
• ClickHouse analytics: 1M pipeline events/sec, p99 query < 200ms on 30-day window.
  ADR written: "Why columnar storage beats row storage for analytical workloads —
  MergeTree vs PostgreSQL benchmarked."
• Batch vs streaming trade-off: Airflow DAG (batch, 6h) vs Kafka Structured Streaming
  (real-time) — decision doc with latency vs cost analysis attached.

[GitHub] [BENCHMARKS.md] [columnar storage ADR]
```

**DoorDash:**
```
Subject: [DoorDash SDE] — built DispatchOS: dasher assignment, ETA prediction, 
         delivery notifications at scale

DispatchOS covers DoorDash's core engineering problems.

• Dasher assignment: H3 geospatial matching + consistent hash ring across worker pods.
  Greedy (nearest dasher) vs branch-and-bound (optimal across 100 open orders).
  k6: 100K assignments, p99 < 200ms.
• ETA prediction: ONNX Go inference (no Python runtime on server), < 5ms.
  A/B test: rule-based vs ML model on live traffic.
• Notifications: 1M/day, Kafka fan-out → FCM/APNs batch → Redis dedup,
  < 500ms delivery (DoorDash SLO).

[GitHub] [BENCHMARKS.md] [dasher assignment ADR]
```

---

#### How This Month Covers Sunny's Points

| Point | What You Do |
|---|---|
| S5 | 1/day maintenance. Stay sharp. |
| S9 | You walk into each of the 7 interviews knowing their engineering patterns cold. You built a smaller version of their systems. Databricks: you walk in knowing Delta Lake, ClickHouse, and batch vs streaming from code. |
| S10 | Every behavioural answer: specific numbers, your exact role, real impact. No inflation. |
| S11 | Referral-first outreach. 5 deployed, benchmarked projects = Sunny's exact definition of proof of work. |
| S12 | Deliberate pitches to 7 focused targets. Not luck. Training to operate in high-density environments. |

---

## Full Coverage Matrix

| Sunny's Point | Months Active | Summary |
|---|---|---|
| S1: Pick A-list | M1 | Locked to 7: Rippling, Palantir, Uber, DoorDash, JioHotstar, Razorpay, Databricks. |
| S2: Know what companies do | M1 | 4-sentence brief for all 7. Reviewed again before M8 company mocks. |
| S3: Understand type of work | M1 | Bucketed into 7 distinct engineering profiles. Every project aligned to a bucket. |
| S4: 3 parallel tracks | M1–M9 | DSA + Systems + Project. Never dropped. Tapers in volume only. |
| S5: DSA daily grind | M1–M9 | 3–4/day → 2–3/day → 1–2/day → 1/day. Timed mocks from M5. |
| S6: System design | M1–M8 | Small designs M1 → 2–5 YOE M2–5 → company-specific mocks M6–8. |
| S7: Projects: biggest lever | M2–M9 | 5 projects: real product surface, non-trivial scale, queues/caching/jobs in every one. |
| S8: Align to company | M2–M7 | PayRail→Razorpay/Databricks, DispatchOS→Uber/DoorDash, WorkOS→Rippling, FoundryOS→Palantir/Databricks, StreamEdge→JioHotstar. |
| S9: Company-specific seasoning | M3–M9 | Grows from code-embedded patterns (M3) to dedicated 45-min mocks (M8) per company. |
| S10: Behavioural prep | M5–M9 | 3 stories per project from M5. Mocks 3x/week from M6. Numbers + role + impact. |
| S11: Resume & outreach | M7–M9 | Resume v1 M7. Cold DMs M8. Referral-first applications M9. |
| S12: Final mindset | M8–M9 | 7 focused targets. Deliberate prep. Not luck-chasing. |

---

## Distributed Systems Concepts — Built Into Real Code

> Every concept below is implemented in running, tested, benchmarked code across the 5 projects.
> Not read about. Not watched on YouTube. Built.

| Concept | Where You Build It | Company It Impresses |
|---------|-------------------|----------------------|
| Kafka exactly-once semantics (outbox + idempotent producer + transactional API) | PayRail | Databricks, Razorpay |
| Leader election (Redis SETNX + TTL + heartbeat + Lua atomic lease renewal) | WorkOS cron runner | Rippling |
| Distributed locking with fencing tokens (monotonic counter, stale holder rejection) | WorkOS seat reservation | Rippling, Uber |
| Consistent hashing (ring + virtual nodes, remaps 1/N keys on node add/remove) | DispatchOS matching pods | Uber, DoorDash |
| H3 geospatial indexing (hexagonal grid, multi-resolution, ring search in O(1)) | DispatchOS | Uber, DoorDash |
| Saga pattern (choreography via Kafka events, compensating transactions) | PayRail + WorkOS | Razorpay, Rippling, Databricks |
| Outbox pattern (guaranteed delivery, crash-safe, exactly-once effective) | PayRail | Razorpay, Databricks |
| MVCC + all 4 isolation levels (live anomaly demos in psql) | PayRail | Razorpay, all |
| Tail-based sampling (keep 100% errors, 5% normal, O(trace_id) routing) | FoundryOS pipeline | Palantir, Databricks |
| Delta Lake time-travel (ACID on object storage, VERSION AS OF N rollback) | FoundryOS | Palantir, Databricks |
| CDC via Debezium (WAL → Kafka, auto-ingest on every DB write) | FoundryOS | Palantir, Databricks |
| Bloom filters (probabilistic dedup, false positive rate formula, per-SSTable) | DispatchOS fraud pre-screen | Databricks, Uber |
| ONNX Go inference (ML model embedded in binary, no Python runtime, < 5ms) | DispatchOS surge + fraud | Uber, DoorDash |
| K8s Operator (CRD + reconcile loop, controller-runtime) | WorkOS + DispatchOS + StreamEdge | Rippling, Uber |
| WebSocket + Redis pub/sub fan-out (distributed, cross-replica, sub-200ms) | StreamEdge score overlay | JioHotstar |
| HLS pipeline (m3u8 + .ts segments, CDN cache decisions, ABR, CloudFront pre-warm) | StreamEdge | JioHotstar |
| PostGIS + GIST spatial index (800ms → 2ms on 500K rows) | DispatchOS | Uber, DoorDash |
| Human-in-the-loop AI (constrained tool use, approval queue, audit trail) | FoundryOS AIPilot | Palantir |
| Data lineage tracking (DAG of pipeline inputs/outputs, impact analysis on failure) | FoundryOS | Palantir, Databricks |
| Great Expectations data quality gating (halt + rollback on bad data) | FoundryOS | Palantir, Databricks |
| ClickHouse columnar storage (MergeTree, partition pruning, LowCardinality, TTL) | FoundryOS + PayRail | Databricks |
| Batch vs streaming trade-off (Airflow DAG vs Kafka Structured Streaming, documented ADR) | FoundryOS | Databricks, Palantir |
| PySpark distributed transforms (lazy evaluation, partitions, watermarking, Delta write) | FoundryOS | Databricks, Palantir |

---

## Non-Negotiable Rules

| Rule | Why |
|------|-----|
| `go test -race ./...` before every commit | Silent data race in DispatchOS causes duplicate trip assignments at load. |
| `EXPLAIN ANALYZE` on every query. Zero seq scans on tables > 10K rows. | PostGIS without GIST index: 800ms. With: 2ms. You must know this before shipping. |
| `goleak.VerifyNone(t)` in every Go test file | Goroutine leak in StreamEdge HLS pipeline accumulates to OOM over hours. |
| Idempotency key on every payment mutation | RBI compliance. Double-debit is a regulatory incident. |
| Outbox pattern for every Kafka publish that must be guaranteed | PayRail: crash between journal write and Kafka publish loses the event permanently. |
| ADR for every major technology decision | Rippling is doc-heavy. Write the 3-paragraph decision doc before you merge. |
| k6 load test before calling anything production-ready | 100K concurrent trip requests behave nothing like development. |
| HMAC-sign every webhook | Unsigned webhooks allow attackers to forge payment confirmations. |
| Partition pruning verified on every ClickHouse + Delta Lake query | Databricks interview question: query that reads all partitions instead of 1 is 30× slower. You must prove it in BENCHMARKS.md. |
| Post benchmark numbers publicly every weekend | Sunny: "Proof of work is the only ask." Public benchmarks are your proof. |
