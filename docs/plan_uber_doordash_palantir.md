# Full-Stack Engineering Mastery Plan
## Targeting Uber · DoorDash · Palantir
### Real-Time Marketplace + Last-Mile Logistics + Data/AI Platform Track — Sequential Projects

---

## The Core Principle: One Project at a Time

You finish one project completely before starting the next. No juggling four codebases. Each project is built deeply, deployed, benchmarked, and documented before you touch the next one. Every project is **specifically modelled on real internal engineering work** at the target company — not a generic portfolio piece.

---

## The 4 Projects (Sequential — Complete One Before Starting the Next)

| Order | Project | Mirrors | Duration | What Uber / DoorDash / Palantir Actually Uses This For |
|-------|---------|---------|----------|-------------------------------------------------------|
| **1st** | **DispatchOS** | Uber's internal dispatch + matching infrastructure | Months 1–2 | Uber's matching engine assigns a driver to a rider in < 200ms at city scale. The Go service uses H3 hexagons to spatially index drivers, scores candidates in goroutines, and commits via Redis. This is that system. |
| **2nd** | **CourierNet** | DoorDash's internal logistics + merchant platform | Month 3 | DoorDash's dasher assignment, order lifecycle management, ETA prediction, and merchant portal. The Go optimizer matches dashers to orders using a scoring pipeline. The ML model predicts ETA from live traffic. |
| **3rd** | **FoundryOS** | Palantir Foundry's internal data integration platform | Months 4–5 | Palantir Foundry unifies heterogeneous data sources into a typed ontology. Every pipeline records lineage. Great Expectations gates data quality. This is the internal tooling Palantir's data engineers build and operate. |
| **4th** | **AIPilot** | Palantir AIP's internal human-in-the-loop AI system | Month 6 | Palantir AIP gives analysts LLM-powered decision support — but the AI can only **propose** actions, never execute them without human approval. Every proposal, every decision, every action is audit-logged. This is that system. |

---

## Project 1: DispatchOS — Real-Time Driver-Rider Matching Engine
### Months 1–2 · Mirrors Uber's Core Dispatch Infrastructure

**What Uber actually uses:** Uber's matching engine is a Go service. Every 5 seconds, it runs a matching cycle: find all drivers within N H3 hexagons of each waiting rider, score each driver by ETA + rating + acceptance rate, assign the best match via Redis atomic operation. The matching must complete in < 200ms end-to-end. DispatchOS is that system.

---

### Month 1, Week 1: HTTP + HTML + CSS + Geospatial Mental Model

**Monday — HTTP + H3 Hexagonal Grid + CLI + Dev Setup**

| | |
|---|---|
| 🛠 **Technologies** | Node.js 22, VS Code, pnpm, `curl`, `dig`, H3 library |
| 📖 **Concepts** | HTTP/HTTPS model, DNS, TLS, `curl -v` anatomy, H3 hexagonal grid (why hexagons over squares for geospatial), CLI essentials |
| 🎯 **You Build** | DispatchOS raw Node.js server — `POST /location` receives driver GPS ping with H3 cell ID. `GET /nearby/:riderH3` returns drivers in surrounding hexagons. |
| 🔗 **Why It Matters** | Uber uses H3 (Uber's open-source hexagonal grid library) for spatial indexing. H3 hexagons tessellate uniformly — every cell has 6 equidistant neighbors. This makes "find all drivers within 2km" a `SET` lookup in Redis (`SMEMBERS h3:cell:{h3Index}`) instead of a slow `ST_DWithin` PostGIS query on every matching cycle. |

**H3 core concepts you implement today:**
- `latLngToCell(lat, lng, resolution)` — converts GPS coordinate to H3 cell ID at resolution 9 (~1km² cells)
- `gridDisk(h3Index, k)` — returns all H3 cells within k rings (for k=2: up to 2 hexagons away = ~2km radius)
- Driver location stored as `SADD h3:drivers:{cellId} {driverId}` in Redis. Find nearby: `gridDisk(riderCell, 2)` → union of all cell SMEMBERS

**Tuesday — HTML + CSS + DispatchOS Dispatcher Dashboard**

| | |
|---|---|
| 🛠 **Technologies** | HTML5, CSS, Tailwind, Shadcn, Mapbox GL JS |
| 📖 **Concepts** | Semantic HTML, box model, flexbox, grid, Tailwind utility-first, Shadcn DataTable, Mapbox GL JS for live driver map |
| 🎯 **You Build** | DispatchOS dispatcher UI: live map (Mapbox GL) showing driver dots, H3 hex heatmap showing demand density, DataTable with pending trips. Lighthouse 90+. |
| 🔗 **Why It Matters** | Uber's internal dispatch tools show exactly this: a city map with colored H3 hexagons indicating demand, driver dots updating in real time. You're building their internal operations tooling. |

**Wednesday — JavaScript Engine: Types + Closures + Event Loop**

| | |
|---|---|
| 🛠 **Technologies** | Node.js, TypeScript, Vitest |
| 📖 **Concepts** | Primitive vs reference types, `===` vs `==`, lexical scope, closures, `var`/`let`/`const`, event loop (call stack, microtask queue, macrotask queue) |
| 🎯 **You Build** | `packages/utils/retry.ts` — exponential backoff for DispatchOS webhook delivery. `packages/utils/emitter.ts` — typed EventEmitter for driver state changes. `packages/utils/concurrent.ts` — `ConcurrencyLimiter` for bulk location updates. |

**Thursday — TypeScript: Generics + Branded Types + Zod**

| | |
|---|---|
| 🛠 **Technologies** | TypeScript strict mode, Zod |
| 📖 **Concepts** | Branded types (`DriverId`, `RiderId`, `TripId`, `H3Index` — all distinct string types), generics, conditional types, `z.infer` |
| 🎯 **You Build** | `packages/types` — `H3Index`, `DriverId`, `RiderId`, `TripId` are branded. `packages/schemas` — `GpsLocationSchema`, `TripSchema`, `MatchRequestSchema` validated with Zod. |
| 🔗 **Why It Matters** | At Uber's scale, passing a `RiderId` where a `DriverId` is expected causes silent mismatches. Branded types prevent this at compile time. |

**Friday — Promises + async/await + Node.js Streams**

| | |
|---|---|
| 🛠 **Technologies** | Node.js, TypeScript, Vitest |
| 📖 **Concepts** | Promise states, async/await sugar, `Promise.all`/`allSettled`/`race`, generators for lazy pagination of trip history |
| 🎯 **You Build** | DispatchOS location stream processor: reads GPS events from a stream, validates with Zod, updates H3 Redis sets. `pipeline()` for backpressure. 1M events processed in constant memory. |

---

### Month 1, Week 2: React + PostgreSQL + PostGIS + Redis

**Monday–Tuesday — React + Tanstack Query + Zustand + Mapbox**

| | |
|---|---|
| 🛠 **Technologies** | React 18, Tanstack Query, Zustand, Motion, Mapbox GL JS |
| 📖 **Concepts** | `UI = f(state)`, all hooks, optimistic updates, selective subscription, `AnimatePresence`, Mapbox source updates |
| 🎯 **You Build** | DispatchOS live dispatcher map: driver dots update every 5s (Tanstack Query poll), H3 heatmap updates in background, trip assignment shows animated route line. |

**Wednesday — Next.js + Server Components**

| | |
|---|---|
| 🛠 **Technologies** | Next.js 14, React Server Components |
| 📖 **Concepts** | Server Components, `'use client'`, ISR for public pages, streaming Suspense |
| 🎯 **You Build** | DispatchOS public status page (Server Component), admin dashboard (`'use client'` with real-time map). |

**Thursday — PostgreSQL + PostGIS + EXPLAIN ANALYZE**

| | |
|---|---|
| 🛠 **Technologies** | PostgreSQL + PostGIS, `node-postgres`, `sqlc`, `pgxpool` |
| 📖 **Concepts** | PostGIS `ST_DWithin`, spatial indexes (GiST), `EXPLAIN ANALYZE`, N+1 elimination, MVCC, all 4 isolation levels |
| 🎯 **You Build** | DispatchOS schema: `drivers` with `location GEOMETRY(Point, 4326)`, GiST spatial index. `trips` table. All queries `EXPLAIN ANALYZE`'d. Driver lookup within 2km: `ST_DWithin` < 5ms with GiST index. |
| 🔗 **Why It Matters** | Uber uses PostGIS for precision geospatial queries (exact matching). They use H3+Redis for the hot matching path (< 1ms). You implement both — same as Uber's actual two-layer geospatial architecture. |

**Friday — Redis All Data Structures for DispatchOS**

| | |
|---|---|
| 🛠 **Technologies** | Redis, `ioredis`, Lua scripts |
| 📖 **Concepts** | H3 cell → driver set (`SADD`/`SMEMBERS`), surge multiplier by H3 zone (Hash), trip status (String + TTL), rate limiting (Sorted Set), TTL jitter |
| 🎯 **You Build** | DispatchOS Redis layer: `h3:drivers:{cell}` sets updated on every GPS ping. `surge:{h3Cell}` hash stores current multiplier. Trip status cached with 30s TTL. Rate limiting on `/location` endpoint (100 pings/sec per driver). |

**Weekend — DispatchOS Full-Stack v1.0**

DispatchOS full-stack: Next.js + PostGIS + Redis H3 sets + JWT auth. Deployed. Lighthouse 90+.

---

### Month 1, Week 3: Node.js Internals + DispatchOS Advanced

**Monday — V8 + `worker_threads` + Streams**

| | |
|---|---|
| 🛠 **Technologies** | `node --inspect`, `worker_threads`, `stream/promises` |
| 📖 **Concepts** | V8 JIT, hidden classes, GC, `worker_threads` for CPU-bound matching scoring, backpressure |
| 🎯 **You Build** | DispatchOS matching: candidate scoring (distance × rating × acceptance_rate) moved to `worker_threads`. 4x throughput on multi-core. GPS event stream with backpressure. |

**Tuesday — JWT Auth + RBAC + Webhook HMAC**

| | |
|---|---|
| 🛠 **Technologies** | JWT RS256, Node.js `crypto`, Express middleware |
| 📖 **Concepts** | RS256 asymmetric JWT, 3-role RBAC (driver/dispatcher/admin), HMAC-SHA256 webhook signing, `timingSafeEqual` |
| 🎯 **You Build** | DispatchOS auth: `packages/auth` with JWT RS256 (shared across projects). Trip events webhooks signed with HMAC. |

**Wednesday–Thursday — Kafka + Outbox Pattern**

| | |
|---|---|
| 🛠 **Technologies** | Apache Kafka, MSK |
| 📖 **Concepts** | Topic → partition → offset, partition key (use `driverId` for ordering), idempotent producer, outbox pattern, consumer group rebalancing |
| 🎯 **You Build** | DispatchOS: GPS ping → Kafka `location-events` topic (key: `driverId` → ordering guaranteed per driver). Trip lifecycle events → outbox → Kafka. FoundryOS (Project 3) will consume from this same topic. |

**Friday — SSE + WebSockets: Live Driver Map**

| | |
|---|---|
| 🛠 **Technologies** | SSE (`text/event-stream`), WebSockets (`ws`) |
| 📖 **Concepts** | SSE vs WebSocket, fan-out across replicas via Redis pub/sub, connection registry, ping/pong keepalive |
| 🎯 **You Build** | DispatchOS: driver GPS updates push to dispatcher browser via WebSocket. Redis pub/sub fans out across 3 server replicas. Kill one replica — all dispatchers continue receiving updates. |

---

### Month 2, Week 5–6: Go Matching Engine + Kubernetes Operator

**Week 5: Go Language + Concurrency**

| | |
|---|---|
| 🛠 **Technologies** | Go 1.22, `golangci-lint`, `goleak`, `go test -race` |
| 📖 **Concepts** | Zero values, implicit interfaces, error wrapping, goroutines + M:N scheduler, channels (pipeline/fan-out/fan-in), `sync.RWMutex`, `errgroup`, `singleflight`, `atomic` |
| 🎯 **You Build** | DispatchOS matching engine in Go: for each waiting rider, `gridDisk(riderH3, 2)` → Redis SMEMBERS (all nearby drivers) → `errgroup` scores N drivers in parallel → select best → `SET NX` atomic assignment. Tested with `go test -race`. `goleak.VerifyNone(t)` confirms zero goroutine leaks. |
| 🔗 **Why It Matters** | Uber's matching engine is written in Go. The concurrency model — score N drivers in parallel goroutines, select winner atomically via Redis — is exactly what you implement here. |

**Week 5, Thursday — Go `net/http` + `sqlc` + `chi` + `cobra`**

| | |
|---|---|
| 🛠 **Technologies** | Go `net/http`, `chi`, `sqlc`, `pgx/v5`, `cobra` |
| 📖 **Concepts** | `http.Handler` interface, middleware chain, all 4 server timeouts, `sqlc` compile-time SQL validation, `CopyFrom` bulk insert, `cobra` CLI |
| 🎯 **You Build** | DispatchOS Go API: `chi` router, `sqlc`-generated DB layer, all timeouts set. `dispatchctl` CLI: `dispatchctl trips list`, `dispatchctl drivers status`. |

**Week 6: gRPC + Kubernetes Operator**

| | |
|---|---|
| 🛠 **Technologies** | gRPC, Protocol Buffers, `controller-runtime`, Kubernetes |
| 📖 **Concepts** | Proto3 service definitions, gRPC streaming, K8s Operator pattern, CRD, reconcile loop, Prometheus metrics from Operator |
| 🎯 **You Build** | DispatchOS internal gRPC: `MatchingService.RequestMatch`, `MatchingService.GetMatchStatus`. K8s Operator: Prometheus alert `matching_queue_depth > 1000` → Operator scales matching engine pod count. New pods join in 30s. |
| 🔗 **Why It Matters** | This is Uber's on-call engineer's dream: the dispatch infrastructure auto-scales in response to demand spikes without human intervention. |

**Week 6: Load Testing + PITR + All System Design**

| | |
|---|---|
| 🛠 **Technologies** | k6, `go tool pprof`, PostgreSQL WAL |
| 📖 **Concepts** | k6 virtual users, p50/p95/p99 measurement, CPU flame graphs, PITR drill, consistent hashing, Bloom filters |
| 🎯 **You Build** | DispatchOS: k6 at 100K TPS (GPS pings/sec), matching engine p99 < 200ms. pprof: find and fix top allocator. PITR drill documented. Bloom filter for deduplicating GPS events. Consistent hashing for matching worker routing. |

**Weekend — DispatchOS COMPLETE**

k6 benchmark: 100K GPS pings/sec, matching p99 < 200ms. Architecture diagram. ADRs: "Why H3+Redis over PostGIS for hot matching path", "Why Go goroutines over Node.js for concurrent driver scoring". LinkedIn post. Now start CourierNet.

---

## Project 2: CourierNet — Last-Mile Logistics + Merchant Platform
### Month 3 · Mirrors DoorDash's Internal Dasher Assignment + Merchant Tools

**What DoorDash actually uses:** DoorDash's dasher assignment engine solves a combinatorial optimization problem every few seconds: assign available dashers to pending orders to minimize delivery time while satisfying restaurant prep time, dasher proximity, and order urgency constraints. The ETA model predicts delivery time from live traffic. The merchant portal shows real-time order status. CourierNet is that internal system.

---

### Month 3, Week 7: CourierNet Foundation

**Monday — Dasher Assignment Optimizer**

| | |
|---|---|
| 🛠 **Technologies** | Go, PostgreSQL + PostGIS, Redis |
| 📖 **Concepts** | Combinatorial assignment (greedy approximation of minimum-cost bipartite matching), scoring function (proximity + restaurant readiness + order urgency), `errgroup` parallel scoring |
| 🎯 **You Build** | CourierNet dasher assignment: every 10s, score all available dasher × pending order pairs. Assign using greedy minimum cost. Commit via Redis atomic operation (same `SET NX` pattern as DispatchOS). |
| 🔗 **Why It Matters** | DoorDash's dispatch team describes their assignment engine exactly this way. The scoring function is the key IP — distance is only one factor. Restaurant ETA (is the food ready?) often matters more than dasher proximity. |

**Tuesday — Order Lifecycle: Kafka Saga**

| | |
|---|---|
| 🛠 **Technologies** | Go, Kafka, PostgreSQL |
| 📖 **Concepts** | Order state machine (placed → accepted → preparing → ready → picked_up → delivered), Kafka Saga with compensating transactions, `SELECT FOR UPDATE SKIP LOCKED` for order claiming |
| 🎯 **You Build** | CourierNet order Saga: `place_order` → PayRail payment → restaurant accept → dasher assignment → pickup → delivery. Each step compensatable. Failed payment → order cancelled, restaurant notified. |
| 🔗 **Why It Matters** | DoorDash's order lifecycle is this exact Saga. The hard case: restaurant accepts but dasher never picks up. The compensating action is reassignment, not cancellation — and only cancellation after 3 failed reassignments. |

**Wednesday — ETA Prediction: ONNX in Go**

| | |
|---|---|
| 🛠 **Technologies** | Python (model training), ONNX, Go ONNX runtime |
| 📖 **Concepts** | Feature engineering (distance, traffic conditions, time of day, restaurant type), ONNX export, Go inference at < 10ms, model versioning, A/B test |
| 🎯 **You Build** | CourierNet ETA: train gradient boosting model in Python (features: dasher proximity, restaurant prep time estimate, live traffic score). Export to ONNX. Go inference server: `POST /eta` → prediction in < 10ms. A/B test v1 vs v2. |

**Thursday — Merchant Portal**

| | |
|---|---|
| 🛠 **Technologies** | Next.js, React, Tanstack Query, WebSockets |
| 📖 **Concepts** | Real-time order feed (WebSocket), SSE for kitchen display, merchant analytics (ClickHouse) |
| 🎯 **You Build** | CourierNet merchant portal: live order queue (WebSocket push), kitchen display (`text/event-stream`), daily analytics (ClickHouse: orders/hour, avg prep time, top items). |
| 🔗 **Why It Matters** | DoorDash's merchant portal is a core product. Restaurants see live orders, prep time averages, and top-performing menu items. The kitchen display needs sub-second updates when an order is placed. |

**Friday — Testing + k6 Benchmarks + Caching**

| | |
|---|---|
| 🛠 **Technologies** | `testcontainers`, k6, Redis, Cloudflare CDN |
| 📖 **Concepts** | Cache-aside for restaurant menus, Redis `DECRBY` atomic inventory, CDN for product images, circuit breaker for ETA service |
| 🎯 **You Build** | CourierNet caching: menu cache (Redis, 5min TTL with jitter), inventory atomic decrement (`DECRBY inventory:{productId} 1`), product images (CloudFront, immutable). Circuit breaker: ETA service slow → fallback to distance-based estimate. |

**Week 8: Remaining System Design Cases + Polish**

Implement: Product search (Elasticsearch + PGVector hybrid), real-time delivery tracking (GPS → Kafka → SSE → customer order page), recommendation system (collaborative filtering + PGVector), flash sale inventory (Redis `DECRBY` + sorted set queue for burst traffic). k6 all endpoints. `go test -race` passes. `EXPLAIN ANALYZE` every query.

**Weekend — CourierNet COMPLETE**

k6: dasher assignment < 500ms p99, order placement 10K TPS. ETA model: ONNX inference < 10ms. All system design cases documented. ADRs: "Why Go optimizer over Python for assignment engine", "Why ONNX Go over Python microservice for ETA". LinkedIn post. Now start FoundryOS.

---

## Project 3: FoundryOS — Data Integration + Ontology Platform
### Months 4–5 · Mirrors Palantir Foundry's Internal Data Platform

**What Palantir actually uses:** Palantir Foundry ingests heterogeneous data sources (CSVs, databases, APIs, Kafka streams) and unifies them into a typed ontology of business objects (Person, Organization, Event, Location). Every transformation is a versioned pipeline with full lineage. Data quality is enforced by Great Expectations gates. FoundryOS mirrors this internal platform exactly.

**The thing that makes Foundry different from Databricks:** Foundry isn't just a data pipeline tool. It models data as a **graph of typed objects with relationships** — a Person `worksAt` an Organization, a Trip `involvesDriver` a Driver. Queries traverse this graph. You build that.

---

### Month 4, Week 9: FoundryOS Foundation

**Monday — Ontology: Typed Object Graph**

| | |
|---|---|
| 🛠 **Technologies** | Go, PostgreSQL, pgvector |
| 📖 **Concepts** | Ontology model (object types, relationship types, property types), graph schema in PostgreSQL, object-level access control (different from table-level) |
| 🎯 **You Build** | FoundryOS ontology schema: `object_types` (Driver, Trip, Location, Restaurant), `object_instances`, `relationship_types` (worksAt, locatedIn, assignedTo), `relationship_instances`. Object-level access control: analyst A can see Driver objects but not Trip objects for the same dataset. |
| 🔗 **Why It Matters** | This is Palantir's core IP. The ontology is what makes Foundry different from a data warehouse. A Trip object has properties (duration, distance, fare) AND relationships (assignedDriver → Driver, pickupLocation → Location). Querying the graph is fundamentally different from JOIN queries on normalized tables. |

**Tuesday — Pipeline Ingestion: Kafka + CDC + CSV**

| | |
|---|---|
| 🛠 **Technologies** | Go, Kafka, Debezium (CDC), Python (CSV parser) |
| 📖 **Concepts** | Heterogeneous source unification, CDC (every DispatchOS DB change → FoundryOS Kafka topic), CSV ingestion with schema inference, source → ontology mapping |
| 🎯 **You Build** | FoundryOS ingests from 3 sources simultaneously: (1) Kafka CDC from DispatchOS's `trips` table → `Trip` object type, (2) CSV upload → `Location` object type, (3) REST API call → `Driver` object type. All mapped to the same ontology. |

**Wednesday–Thursday — PySpark Transformations + Delta Lake**

| | |
|---|---|
| 🛠 **Technologies** | PySpark, Delta Lake (`delta-rs`), dbt, S3 |
| 📖 **Concepts** | Spark job lifecycle, Delta Lake transaction log, ACID on S3, time-travel (`VERSION AS OF`), schema evolution |
| 🎯 **You Build** | FoundryOS pipeline: raw Kafka events → PySpark transform → Delta Lake table on S3 → dbt SQL model → FoundryOS ontology. Each step versioned. Delta time-travel: roll back to any previous version of any table. |

**Friday — Data Lineage Recording**

| | |
|---|---|
| 🛠 **Technologies** | Go, PostgreSQL, React (graph visualization) |
| 📖 **Concepts** | Lineage DAG (source → pipeline → dataset → model → dashboard), lineage recording at run time, impact analysis ("what breaks if I change this column?") |
| 🎯 **You Build** | FoundryOS lineage: every pipeline run records `(input_dataset_id, output_dataset_id, pipeline_id, run_id)` in PostgreSQL. React graph: click any dataset → see all upstreams and downstreams. |
| 🔗 **Why It Matters** | Palantir's engineers say lineage is the feature customers pay for most. "Why did this dashboard number change?" → lineage trace back to the upstream data source change in 3 clicks. |

---

### Month 4, Week 10: FoundryOS Advanced

**Monday–Tuesday — Airflow Scheduling + Great Expectations Quality Gates**

| | |
|---|---|
| 🛠 **Technologies** | Apache Airflow, Great Expectations, Kafka |
| 📖 **Concepts** | Airflow DAG (task dependencies, SLA monitoring, XCom), Great Expectations validation suites, blocking pipeline on failed quality gate, Delta time-travel rollback on failure |
| 🎯 **You Build** | FoundryOS pipeline scheduling: `daily_trip_aggregation` Airflow DAG. After each run: Great Expectations validates (no nulls, value ranges, row count). Failure → pipeline fails, Delta rollback, PagerDuty alert. |

**Wednesday — ClickHouse Analytics**

| | |
|---|---|
| 🛠 **Technologies** | ClickHouse, Go ClickHouse client |
| 📖 **Concepts** | Columnar storage, MergeTree engine, partitioning by date, sub-second aggregations on billions of rows |
| 🎯 **You Build** | FoundryOS dashboard: pipeline metrics (runs/day, data volumes, error rates) in ClickHouse. Analyst query on 10B trip rows: `SELECT count(*) FROM trips WHERE date > '2024-01-01'` returns in < 200ms. |

**Thursday — Kubernetes + Terraform + GitHub Actions**

| | |
|---|---|
| 🛠 **Technologies** | Docker multi-stage, EKS, Terraform, GitHub Actions, `trivy` |
| 📖 **Concepts** | Multi-stage builds, K8s HPA, Terraform state, GitHub Actions matrix CI, `trivy` CVE scanning |
| 🎯 **You Build** | FoundryOS deployed to EKS. Terraform: EKS + RDS + ElastiCache + S3 + MSK. GitHub Actions: lint → test → build → trivy scan → deploy. Branch protection: no merge without green CI. |

**Friday — Semantic Search over Ontology**

| | |
|---|---|
| 🛠 **Technologies** | PGVector, OpenAI embeddings, Elasticsearch |
| 📖 **Concepts** | Hybrid BM25 + vector search, HNSW index, object embedding (embed description → vector), semantic vs keyword search |
| 🎯 **You Build** | FoundryOS catalog search: "Find datasets with driver location history from last quarter" → hybrid search: Elasticsearch (keyword) + PGVector (semantic) → re-rank by recency. |

---

### Month 5, Week 11–12: FoundryOS System Design + Polish

**System design implementations in FoundryOS:**

- **Database Isolation Levels** — all 4 levels with live anomaly demos. FoundryOS uses `SERIALIZABLE` for ontology schema changes, `READ COMMITTED` for pipeline reads.
- **Caching architecture** — pipeline results cached in Redis (cache-aside, 5min TTL with jitter). Object type definitions cached (write-through — always fresh).
- **Consistent Hashing** — pipeline workers use consistent hash ring for job routing. Adding a worker remaps only 1/N jobs.
- **Bloom Filters** — CDC event deduplication: same change event received twice is a no-op.
- **Message queues** — pipeline job queue: `SELECT FOR UPDATE SKIP LOCKED` for claiming, DLQ for failed pipelines.
- **Load balancers + circuit breakers** — Spark cluster slow → circuit breaker trips → jobs queue. PITR drill documented.

**Weekend — FoundryOS COMPLETE**

k6: pipeline submission → Delta Lake write < 5s p99. Ontology query p99 < 50ms. Lineage graph correct for 1000 pipeline runs. ADRs written. Now start AIPilot.

---

## Project 4: AIPilot — Human-in-the-Loop AI Decision Platform
### Month 6 · Mirrors Palantir AIP's Internal AI Workflow System

**What Palantir actually uses:** AIP gives analysts an LLM assistant that can query FoundryOS, propose actions (suspend an account, escalate an alert, create a task), and explain its reasoning — but it **cannot execute actions autonomously**. Every proposed action generates a row in the `decisions` table with `status: 'pending_approval'`. The analyst sees the AI's proposal, the evidence, and decides yes/no. Every decision is audit-logged forever. AIPilot is that system.

**The hard constraint:** `proposeAction` is the only action the AI can take. There is no `executeAction` without a human in the loop. This constraint is implemented as a hard rule in the tool definitions — the LLM literally cannot call any tool that executes state changes.

---

### Month 6, Week 13: AIPilot Foundation

**Monday — Human-in-the-Loop Architecture**

| | |
|---|---|
| 🛠 **Technologies** | Go, PostgreSQL, Redis |
| 📖 **Concepts** | Human-in-the-loop AI design, approval queue pattern, action proposal vs execution, audit log (append-only, tamper-evident) |
| 🎯 **You Build** | AIPilot `decisions` table: `id`, `proposed_by` (AI agent ID), `action_type`, `action_payload`, `evidence` (JSON — what data the AI used to make this proposal), `status` (pending_approval/approved/rejected), `decided_by` (analyst ID), `decided_at`. **No update to `status` is possible by the AI** — only analysts can approve/reject. |
| 🔗 **Why It Matters** | Palantir's sales pitch for AIP is exactly this: AI that augments human analysts, not replaces them. The human remains accountable for every action. The audit log proves it to regulators. |

**Tuesday — AI Tool Definitions: Read-Only Tools Only**

| | |
|---|---|
| 🛠 **Technologies** | OpenAI function calling, Go, FoundryOS API, DispatchOS API |
| 📖 **Concepts** | Tool definitions with read-only constraints, the LLM decision loop (decide → tool call → observe → decide), bounded tool use |
| 🎯 **You Build** | AIPilot tools — all read-only: `query_foundryos_dataset(datasetId, filter)`, `get_driver_stats(driverId, timeRange)`, `search_trip_history(query)`, `get_anomaly_score(entityId)`. One write tool: `propose_action(actionType, payload, evidence)` which inserts into `decisions` with `status: 'pending_approval'`. |
| 🔗 **Why It Matters** | The tool definitions are the security boundary. If `execute_suspension(driverId)` existed as a tool, the AI could suspend drivers autonomously. It doesn't exist. `propose_suspension(driverId, evidence)` exists — creates a pending decision for an analyst. |

**Wednesday — RAG over FoundryOS Ontology**

| | |
|---|---|
| 🛠 **Technologies** | PGVector, OpenAI embeddings, FoundryOS API, Go |
| 📖 **Concepts** | RAG pipeline (embed query → retrieve top-K similar ontology objects → inject into prompt → generate grounded answer), chunking strategy, citation in response |
| 🎯 **You Build** | AIPilot: "Show me all trips where the driver's GPS trace suggests possible fare manipulation" → RAG over FoundryOS trip ontology objects (semantic search) → retrieved evidence injected into prompt → AI analyzes and proposes action if warranted. |

**Thursday — Vercel AI SDK + Streaming + Multi-Agent**

| | |
|---|---|
| 🛠 **Technologies** | Vercel AI SDK, `useChat`, `streamText`, Next.js |
| 📖 **Concepts** | `useChat` hook, streaming token-by-token, multi-agent orchestration (coordinator → specialist agents), DungBeetle-style job queue for agent tasks |
| 🎯 **You Build** | AIPilot multi-agent: analyst asks "Investigate this surge of cancellations on driver_id:123". Coordinator agent → spawns 3 sub-agents: (1) trip history analysis, (2) GPS trace anomaly detection, (3) payment pattern analysis. All 3 run in parallel. Coordinator synthesizes. Proposes action if warranted. |

**Friday — Audit Log + Compliance Reporting**

| | |
|---|---|
| 🛠 **Technologies** | PostgreSQL, Go, Elasticsearch |
| 📖 **Concepts** | Append-only audit log (no UPDATE/DELETE ever), tamper-evident (hash chain: each row includes hash of previous row), compliance export (CSV + JSON), Elasticsearch for full-text search over audit log |
| 🎯 **You Build** | AIPilot audit log: every AI proposal, every human decision, every tool call is an immutable row. Hash chain: `hash(row) = SHA256(previous_hash + row_content)`. Compliance export: "Show me all AI proposals that were rejected by analyst team in Q4 2024". |
| 🔗 **Why It Matters** | Palantir's enterprise contracts require full audit trails for AI-assisted decisions. Regulators (banks, government agencies) need to verify that humans reviewed every AI proposal. The hash chain makes the log tamper-evident. |

---

### Month 6, Week 14: All System Design Cases

**Monday–Tuesday — Real-Time Marketplace Matching + Surge Pricing (System Design 1 + 2)**

DispatchOS already implements these. This week: write the architecture ADR, create Mermaid diagrams, document k6 numbers. "H3 matching engine: 100K TPS, p99 < 200ms. Surge pricing: ONNX model in Go, < 5ms inference."

**Wednesday — Dasher Assignment + Last-Mile Routing + ETA Prediction (System Design 5 + 6)**

CourierNet already implements these. Document: dasher assignment algorithm, ETA ONNX model accuracy, delivery tracking architecture.

**Thursday — Human-in-the-Loop AI + Data Pipeline Reliability (System Design 7 + 8)**

AIPilot and FoundryOS implement these. Document: approval queue pattern, bounded tool use, audit log hash chain, pipeline quality gating, Delta time-travel rollback.

**Friday — Fraud Detection + Recommendation + Rate Limiter + Abuse Masker (System Design 9–11)**

| | |
|---|---|
| 🛠 **Technologies** | Wasm (AssemblyScript), Go rules engine, ONNX, PGVector, Redis Lua |
| 📖 **Concepts** | GPS spoofing detection (impossible speed, teleport detection, known spoof coordinates), restaurant recommendation (collaborative + content-based), all 4 rate limit algorithms |
| 🎯 **You Build** | DispatchOS GPS fraud: Wasm pre-filter (known spoof GPS coords in AssemblyScript) + Go rules (impossible speed: > 200km/h between pings) + ONNX ML score → `propose_action: suspend` in AIPilot (never auto-suspend). CourierNet recommendation: PGVector collaborative filtering. DispatchOS rate limiter: all 4 algorithms. |

**Weekend — AIPilot COMPLETE. All 4 Projects COMPLETE.**

---

## Month 7: Observability + Polish + Hiring Sprint

### Week 15: OpenTelemetry + Final Benchmarks

Add OTel instrumentation to all 4 projects. Jaeger traces. Prometheus + Grafana dashboards. k6 all endpoints. `pprof` all Go services. Fix every regression.

**Final k6 numbers to achieve:**
- DispatchOS: 100K GPS pings/sec, matching p99 < 200ms
- CourierNet: 10K TPS order placement, dasher assignment p99 < 500ms
- FoundryOS: pipeline submission → Delta write < 5s p99
- AIPilot: RAG query p99 < 1s

### Week 16: Portfolio + Cold Outreach

**Cold Email — Uber:**
```
Subject: [Uber SDE] — built DispatchOS: H3 matching engine, 100K GPS/sec, p99 < 200ms

DispatchOS mirrors Uber's dispatch infrastructure.

• Go matching engine: H3 gridDisk → Redis driver sets → goroutine scoring → Redis SET NX assignment, p99 < 200ms at 100K TPS
• K8s Operator: Prometheus alert matching_queue_depth > 1000 → auto-scale matching pods in 30s
• GPS fraud: Wasm (AssemblyScript) pre-filter + Go rules + ONNX ML, 3 layers, < 15ms decision

[GitHub] [k6 benchmarks] [H3 architecture ADR] [Live demo]
```

**Cold Email — Palantir:**
```
Subject: [Palantir SDE] — built FoundryOS + AIPilot: data integration ontology + human-in-the-loop AI

FoundryOS mirrors Palantir Foundry. AIPilot mirrors Palantir AIP.

• FoundryOS: heterogeneous ingestion (Kafka CDC + CSV + API) → PySpark → Delta Lake → typed ontology. Full lineage on every run.
• AIPilot: LLM analyst assistant. AI can query. AI can propose actions. AI cannot execute without human approval. Full audit log with hash chain.
• Pipeline reliability: Great Expectations gating + Delta time-travel rollback + lineage impact analysis

[GitHub] [lineage visualization] [AIP architecture ADR]
```

---

## Monthly Summary

| Month | Project | Phase | Key Milestones |
|-------|---------|-------|----------------|
| 1 | DispatchOS | Full-stack: H3, PostGIS, Redis, React, Kafka | H3 matching, dispatcher map, Kafka event backbone |
| 2 | DispatchOS | Go engine + K8s Operator | Go matching engine 100K TPS, K8s auto-scaling, GPS fraud |
| 3 | CourierNet | Full build: Saga, ONNX ETA, merchant portal | Dasher assignment, ETA < 10ms, flash sale inventory |
| 4 | FoundryOS | Foundation: ontology, pipelines, lineage | Typed object graph, Delta Lake, lineage DAG |
| 5 | FoundryOS | Advanced: Airflow, ClickHouse, system design | All system design cases in platform |
| 6 | AIPilot | Full build: human-in-the-loop AI | Approval queue, bounded tools, audit hash chain, RAG |
| 7 | All | OTel, k6, polish, hiring | All benchmarks, cold emails, portfolio live |

---

## Non-Negotiable Rules

| Rule | Why |
|------|-----|
| `go test -race ./...` before every commit | Data races in the matching engine cause double-assignment bugs |
| `EXPLAIN ANALYZE` on every PostGIS query | Spatial queries without GiST indexes are catastrophically slow |
| `goleak.VerifyNone(t)` in every Go test file | Goroutine leaks in the matching engine accumulate under load |
| Idempotency key on every trip assignment | Double-assignment is worse than no assignment |
| Outbox pattern for every Kafka publish | Trip lifecycle events cannot be lost |
| AIPilot AI tools are read-only except `propose_action` | This is the hard security boundary — never relax it |
| Audit log is append-only — no UPDATE/DELETE | Tamper-evident log is a compliance requirement |
| k6 before calling anything "production-ready" | DispatchOS at 100K TPS behaves very differently from development load |
