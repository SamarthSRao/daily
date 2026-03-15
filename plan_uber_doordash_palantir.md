# 10-Month Full-Stack Engineering Mastery Plan
## Targeting Uber · DoorDash · Palantir
### Real-Time Marketplace + Last-Mile Logistics + Data/AI Platform Track

---

## Why This Track

**Uber** pays extremely well for engineers who understand their actual problems: sub-second driver-rider matching at city scale, surge pricing that doesn't anger everyone, geospatial computation (H3 hexagons, PostGIS), fraud detection that doesn't false-positive on legitimate drivers, and a dispatch engine that holds state across millions of concurrent trips. They don't want engineers who "have experience with distributed systems" — they want engineers who have solved the specific class of problems they solve every day.

**DoorDash** is a logistics company wearing an app. Their hard problems: optimal dasher assignment (the knapsack problem, live), restaurant marketplace with real inventory constraints, merchant onboarding at scale, delivery time prediction under uncertainty, and consumer experience during a supply crunch (Saturday 8 PM). The engineer they want understands marketplace dynamics, not just CRUD.

**Palantir** is unlike either. They build **Foundry** — a data integration platform where heterogeneous data sources (CSV, APIs, databases, streams) are unified into a typed ontology of business objects, pipelines are built on top, and every transformation has full lineage. They build **AIP** — AI workflows where LLMs are decision support tools inside human analyst workflows, with hard constraints on what the AI can act on autonomously vs what requires human approval. The Palantir engineer must understand: graph data models, pipeline reliability, access control at the object level, Python for data, and human-in-the-loop AI system design. Palantir interviews are among the hardest in the industry.

**The engineer who gets all three** understands: real-time systems, marketplace dynamics, geospatial computation, data pipeline reliability, ontology-based data modeling, and the architecture of AI systems that augment humans rather than replace them. That combination opens every door.

---

## Philosophy: One Codebase. Everything Connected.

Every concept you learn exists because one of your four platforms needs it. Nothing is a tutorial project. Nothing is thrown away. Every mini-project is a named feature of a named platform.

**The thread that runs through everything:**
- The raw Node.js server you write on Day 1 receives driver location events. That same event pipeline, extended week by week, becomes the geospatial matching engine in Month 3, the Kafka backbone in Month 3, the Go aggregator in Month 3, and the FoundryOS ingestion source in Month 4.
- The CourierNet order form from Week 1 gets React in Week 2, PostgreSQL in Week 4, a Kafka Saga in Month 3, real-time dasher assignment in Month 5, and becomes the E-Commerce Listing case study in Month 6.
- AIPilot reads from all three other platforms from Week 1 — every AI decision it makes is grounded in live data from DispatchOS and CourierNet. FoundryOS is the data foundation AIPilot queries.
- Nothing is thrown away. Everything compounds.

---

## The 4 Platform Projects

These share a monorepo, shared TypeScript + Python types, shared infrastructure, and grow together across all 10 months.

- 🚗 **DispatchOS** — Real-time marketplace matching engine (Uber's core: driver-rider matching, surge pricing, geospatial dispatch, fraud detection)
- 🍔 **CourierNet** — Last-mile logistics + merchant platform (DoorDash's core: order assignment, dasher routing, restaurant ops, delivery prediction)
- 🔭 **FoundryOS** — Data integration + ontology platform (Palantir Foundry: pipeline orchestration, typed object graph, lineage tracking, heterogeneous source unification)
- 🤖 **AIPilot** — Human-in-the-loop AI decision platform (Palantir AIP: LLM-powered analyst workflows, approval queues, audit trail, constrained autonomy)

**Monorepo structure (Week 1, used for all 10 months):**
```
/
├── apps/
│   ├── dispatchos/      ← location event receiver → geospatial matcher → surge engine → fraud detection
│   ├── couriernet/      ← order form → React → Kafka Saga → dasher routing → ETA prediction
│   ├── foundryos/       ← pipeline shell → ontology graph → lineage tracker → dataset catalog
│   └── aipilot/         ← analyst shell → AI chat → approval queue → audit trail → constrained agents
├── packages/
│   ├── types/           ← Driver, Trip, Order, Dasher, OntologyObject, PipelineRun (Week 1, forever)
│   ├── schemas/         ← Zod + Pydantic schemas (Week 1, forever)
│   ├── ui/              ← Shadcn components (Week 3)
│   ├── api/             ← Typed fetch client with retry + idempotency (Week 1, forever)
│   └── geo/             ← Shared geospatial utilities: H3, PostGIS helpers (Week 4, forever)
├── infrastructure/
│   ├── terraform/       ← AWS infra (Week 6)
│   └── k8s/             ← Kubernetes manifests + Operators (Week 6, Week 9)
└── python/
    ├── pipelines/       ← PySpark + dbt transforms (Month 3)
    ├── ontology/        ← FoundryOS object type definitions (Month 3)
    └── ml/              ← ETA prediction + surge forecasting models (Month 4-5)
```

---

## Master Technology Checklist

### Fundamentals
- [ ] HTTP/HTTPS, DNS, Client/Server, WebSockets
- [ ] Geospatial: H3 hexagonal grid, PostGIS, haversine, spatial indexes
- [ ] Marketplace dynamics: supply-demand matching, dynamic pricing
- [ ] Ontology / knowledge graph: typed objects, relationships, lineage

### Frontend
- [ ] HTML, CSS, JavaScript, TypeScript
- [ ] React, Next.js, Tanstack Start, Svelte, Vue
- [ ] Tailwind, Shadcn UI, Radix UI, Motion
- [ ] Zustand, Immer, Tanstack Query, Zod, React Hook Form
- [ ] Mapbox GL JS (live driver map, H3 heatmap, dasher routing)

### Backend
- [ ] Node.js (TypeScript) — primary API layer
- [ ] Go — high-throughput location aggregator, matching engine
- [ ] Python — data pipelines (PySpark), ML models (ETA prediction, surge forecasting)
- [ ] gRPC (internal matching service), REST (external), GraphQL, tRPC, Webhooks

### Databases + Storage
- [ ] PostgreSQL + PostGIS (geospatial queries — driver locations, H3 zones)
- [ ] Redis (driver location cache, surge multipliers, rate limiting, pub/sub)
- [ ] Cassandra (write-heavy location telemetry — 1M events/sec)
- [ ] ClickHouse (analytics — trip data, funnel metrics, dasher performance)
- [ ] PGVector (embeddings — ontology object search, semantic similarity)
- [ ] Elasticsearch (merchant search, full-text across ontology objects)
- [ ] Delta Lake / Parquet (FoundryOS dataset storage)
- [ ] SQLite (offline order drafts, edge)

### Data Engineering (Palantir-critical)
- [ ] Apache Spark (PySpark) — large-scale transformations on FoundryOS datasets
- [ ] Apache Kafka — event backbone across all 4 platforms
- [ ] dbt — SQL transformation layer on FoundryOS
- [ ] Apache Airflow — FoundryOS pipeline scheduling
- [ ] Delta Lake — ACID transactions, time-travel on datasets
- [ ] Great Expectations — data quality validation
- [ ] Data lineage: every transformation records its inputs and outputs

### DevOps
- [ ] Docker, Kubernetes, Helm, GitHub Actions
- [ ] Terraform + Pulumi
- [ ] AWS (EKS, RDS + PostGIS, ElastiCache, S3, Athena, SQS, SNS)
- [ ] GCP (GKE, Dataproc, BigQuery)
- [ ] Cloudflare (Workers, Pages, R2)

### Real-Time + AI (Palantir AIP-critical)
- [ ] SSE, WebSockets, gRPC streaming
- [ ] Vercel AI SDK + LangChain
- [ ] Human-in-the-loop AI: approval queues, constrained autonomy, audit trail
- [ ] RAG over ontology objects (semantic search across FoundryOS graph)
- [ ] AI Agents with bounded tool use (can query, cannot act without approval)
- [ ] ONNX (Go) — ETA prediction + fraud inference
- [ ] WebAssembly (AssemblyScript)

### System Design — 11 Case Studies (adapted for this track)
- [ ] Real-Time Marketplace Matching (Uber dispatch)
- [ ] Surge Pricing Engine (dynamic pricing + demand forecasting)
- [ ] Geospatial Driver Feed (Tinder Feed pattern applied to dispatch)
- [ ] Notifications at Scale (trip events, ETA updates)
- [ ] Last-Mile Routing + ETA Prediction
- [ ] Dasher Assignment Optimization (combinatorial matching)
- [ ] Data Pipeline Reliability (FoundryOS — Palantir Foundry pattern)
- [ ] Human-in-the-Loop AI Workflow (AIPilot — Palantir AIP pattern)
- [ ] Fraud Detection (GPS spoofing + account fraud)
- [ ] Recommendation System (restaurant ranking, personalization)
- [ ] API Rate Limiter + Realtime Abuse Masker

---

## How Every Day Works

**Morning (3h):** Learn the concept using one platform's real problem as context.
**Evening (2h):** Build a named feature of one of the 4 platforms using that concept.
**Weekend (12h):** Wire the week's features together — each platform takes a version step forward.

The evening build is never a tutorial. It is always: *"DispatchOS needs X"* or *"FoundryOS needs X"*.

---

## MONTH 1: Full-Stack From Day One — All 4 Platforms Introduced

**Month 1 goal:** By end of Week 4, all four platforms exist front to back — and they are already feeding each other. DispatchOS location events flow into FoundryOS as a dataset from Week 1. AIPilot reads from FoundryOS from Week 2. The data platform architecture that makes Palantir Foundry compelling is designed on Day 1, not bolted on in Month 5.

---

### Week 1: HTTP + HTML + CSS + Geospatial Mental Model — All 4 Platforms Get a Shell

**The narrative this week:** You're building the dispatch engine for a city's worth of drivers, the logistics platform routing thousands of dashers, the data integration layer that makes sense of all of it, and the AI analyst interface that turns data into decisions. The architectural choice that shapes everything: DispatchOS location events are also FoundryOS dataset records from the moment they arrive. The data platform is not a downstream consumer — it is a peer.

---

**MONDAY — HTTP + Geospatial Fundamentals + CLI + Git**

**Morning (3h):**
- Full HTTP/HTTPS/DNS/TLS depth (same as reference roadmap)
- **H3 Hexagonal Grid (Uber's geospatial system):** divide the Earth into hexagons at multiple resolutions. Resolution 7: ~5km² (city zones for surge pricing). Resolution 9: ~0.1km² (pickup areas). `h3.latLngToCell(lat, lng, resolution)` — driver location → H3 cell instantly. `h3.gridDisk(cell, k)` — find all cells within k rings (nearby drivers)
- **Why hexagons beat squares:** 6 equidistant neighbors (not 4 + 4 diagonal), consistent cell areas, hierarchical (resolution 7 cell contains exactly 7 resolution 8 cells). Uber, Airbnb, Lyft all use H3
- **PostGIS:** PostgreSQL extension for geospatial data. `geography` type handles Earth's curvature. `ST_DWithin(a, b, meters)` — fast radius search. `ST_Distance(a, b)` — great-circle distance. Spatial index: `GIST` — essential for `ST_DWithin` to be fast
- CLI, VS Code, Git, ESLint, Prettier — same depth as reference

**Evening (2h): DispatchOS Driver Location Event Receiver**
- Feature: **DispatchOS needs a server that receives driver location pings and immediately publishes them to FoundryOS as dataset records**
- Raw Node.js HTTP server: `POST /events/location` receives `{ driverId, lat, lng, speedKph, heading, timestamp }`
- H3: convert `lat, lng` → H3 cell (resolution 9) immediately on receipt — every location event is spatially indexed from arrival
- Log: `[dispatch] driver D001 in cell 8928308280fffff → zone Downtown`
- Also `POST /events/location` to FoundryOS (same server, second route) — DispatchOS feeds FoundryOS from Day 1
- Test: `curl -X POST http://localhost:3000/events/location -d '{"driverId":"D001","lat":37.775,"lng":-122.418,"speedKph":32}'`

```javascript
// apps/dispatchos/server/index.js — Day 1. H3 from the start.
const http = require('http');
// h3-js: pure JS H3 implementation (no native deps)
const { latLngToCell, gridDisk, cellToLatLng } = require('h3-js');

const server = http.createServer((req, res) => {
  if (req.method !== 'POST') { res.writeHead(405); res.end(); return; }

  let body = '';
  req.on('data', c => (body += c));
  req.on('end', () => {
    const event = JSON.parse(body);
    // Every location event → H3 cell at resolution 9 (~0.1km²)
    const cell = latLngToCell(event.lat, event.lng, 9);
    // Nearby cells (drivers within ~1km): ring of radius 2
    const nearbyCells = gridDisk(cell, 2);

    const enriched = { ...event, h3Cell: cell, nearbyCells, receivedAt: Date.now() };
    console.log(`[dispatch] ${event.driverId} → cell ${cell} (${nearbyCells.length} nearby cells)`);

    // This same event also ingested into FoundryOS dataset pipeline (Month 3)
    res.writeHead(202, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ queued: true, h3Cell: cell }));
  });
});
server.listen(3000, () => console.log('DispatchOS location receiver :3000'));
// H3 cell from lat/lng: 0.02ms. Spatial index query: 2ms.
// This is why Uber chose H3 over PostGIS for the hot path.
```

**X Post:**
```
Day 1: DispatchOS location receiver. H3 hexagonal indexing from the first line.

curl -X POST localhost:3000/events/location \
  -d '{"driverId":"D001","lat":37.775,"lng":-122.418}'

Driver D001 → H3 cell 8928308280fffff
Nearby cells (within ~1km): 7 hexagons, instant lookup.

H3 is why Uber can answer "drivers near this rider" in 2ms for a whole city.
Squares have 8 neighbors at unequal distances. Hexagons have 6 equidistant ones.

This same event pipeline feeds FoundryOS (the data platform) from Day 1.
One event. Two consumers. Same server.

Building DispatchOS + FoundryOS — dispatch engine + data platform.

[H3 hexagon visualization screenshot]
```

---

**TUESDAY — HTML — CourierNet Order Form + FoundryOS Pipeline Config Form**

- **CourierNet order form**: restaurant selection, delivery address, special instructions, scheduled time — semantic HTML, `inputmode="decimal"` for amounts, `autocomplete="shipping"` address fields, `type="time"` for scheduling
- **FoundryOS pipeline config**: dataset source URL, schema definition (key-value fieldset rows), schedule cron expression, output dataset name — this form is how you define a FoundryOS pipeline. Same form gets React in Week 2, CRUD persistence in Week 4, and a live pipeline editor in Month 3
- Both: accessible, validatable without JavaScript, tab-navigable

---

**WEDNESDAY — CSS — All 4 Platforms Styled**

- `packages/tokens.css`: platform design tokens. DispatchOS uses dark-default (ops dashboards are dark). CourierNet is light (consumer-facing). FoundryOS uses dense-data tokens (`--font-size-mono`, `--color-pipeline-running`, `--color-pipeline-failed`). AIPilot uses trust-focused design (`--color-ai-suggestion`, `--color-human-decision`, `--color-approved`)
- **DispatchOS**: CSS Grid map layout — full-width map area, floating driver list sidebar, H3 zone heat overlay placeholder
- **CourierNet**: order flow stepper (horizontal progress bar, CSS transitions between steps), restaurant card grid (`repeat(auto-fill, minmax(240px, 1fr))`)
- **FoundryOS**: pipeline DAG layout — nodes + edges using CSS Grid + absolute positioning. Dataset table with monospace values
- **AIPilot**: split-panel layout — AI suggestion left, human context right, approval buttons at bottom

---

**THURSDAY — JavaScript — DispatchOS Live Map + CourierNet Order Feed**

- **DispatchOS**: fetch driver locations from Monday's server, initialize Mapbox GL JS map (`map.addSource`, `map.addLayer`), plot driver markers, update every 5s — live city map from Day 1
- **CourierNet**: order feed page — fetch orders, render with status badges, filter by status, event delegation on rows
- **FoundryOS shell**: pipeline list page — fetch pipelines, render with last-run status, simple without React yet
- All: `X-Request-ID` header on every fetch, event loop patterns from reference, cleanup on unmount

---

**FRIDAY — TypeScript — packages/types + packages/schemas + packages/geo**

- `packages/types`: `Driver`, `Trip`, `RiderRequest`, `Dasher`, `Order`, `Restaurant`, `OntologyObjectType`, `OntologyObject`, `PipelineRun`, `AnalystDecision`, `AIPilotAction`
- `packages/schemas`: Zod for all 4 platforms. `LocationEventSchema`, `OrderSchema`, `PipelineConfigSchema`, `AnalystDecisionSchema`
- `packages/geo`: shared geospatial utilities — `latLngToH3(lat, lng, resolution)`, `h3Distance(cell1, cell2)`, `cellsInRadius(centerCell, radiusKm)`, `h3ToLatLng(cell)`. Used by all 4 platforms throughout 10 months
- `packages/api`: typed fetch with retry + idempotency built in. Used everywhere

---

**WEEKEND — All 4 Platforms v0.1 Deployed + Already Interconnected**

**Saturday (6h):**
- DispatchOS v0.1: H3 location receiver + live Mapbox GL driver map on Cloudflare Pages
- CourierNet v0.1: order form + order feed, pulling from Node server
- FoundryOS v0.1: pipeline list + dataset table shell
- AIPilot v0.1: analyst interface shell — incident feed reading from DispatchOS event stream (Day 1 connection)

**Sunday (6h):**
- Monorepo: `npm workspaces`, all 4 apps share `packages/types`, `packages/schemas`, `packages/geo`, `packages/api`
- GitHub Actions: on push → `tsc --noEmit` → ESLint → deploy
- Cloudflare Pages: all 4 frontends deployed on custom subdomains
- Verify: DispatchOS location events appear in FoundryOS dataset table live

---

### Week 2: React — All 4 Platforms Rebuilt in React

*Same React depth as reference (useState, useEffect, useRef, useCallback, useMemo, useContext, React.memo, RHF + Zod, Tanstack Query, Zustand + Immer) — applied to:*

**MONDAY-TUESDAY — Core React Concepts**
- Why React: rebuild DispatchOS driver map in React — vanilla JS required 40 DOM mutations on status change. React: 1 targeted re-render
- `useState`, `useEffect` with cleanup (cancel SSE on unmount), re-render mechanics

**WEDNESDAY — Advanced Hooks**
- `useRef` for Mapbox GL map instance (don't re-create map on every render — put it in a ref)
- `useCallback` + `React.memo` on `<DriverMarker>` — only re-renders when that specific driver's location changes, not all 200 markers
- `useContext` for `MapContext` (current H3 resolution, selected zone) — shared across sidebar and map

**THURSDAY — Forms + State**
- CourierNet order form: RHF + Zod (`OrderSchema` from `packages/schemas` — same schema validates on server). Multi-step wizard: address → items → schedule → confirm. `trigger(['deliveryAddress'])` validates step before proceeding
- Zustand `dispatchStore`: `selectedDriverId`, `selectedH3Zone`, `surgeMultipliers: Map<h3Cell, number>` — Immer for map updates

**FRIDAY — Tanstack Query**
- Replace all `useEffect` fetches with `useQuery`. `useQuery({ queryKey: ['drivers', h3Zone], queryFn: () => fetchDriversInZone(h3Zone) })` — automatically refetches when `h3Zone` changes
- `useMutation` with optimistic update: assign trip to driver — instantly updates in UI, rolls back on failure

**WEEKEND — All 4 Platforms v0.2: Full React Apps**
- DispatchOS v0.2: React + Mapbox GL (map in `useRef`) + `React.memo` on markers + Zustand dispatch store + Tanstack Query
- CourierNet v0.2: RHF + Zod multi-step order wizard + Tanstack Query order feed
- FoundryOS v0.2: pipeline list + dataset browser (Tanstack Query)
- AIPilot v0.2: analyst decision feed — reads DispatchOS + CourierNet events, renders with AI suggestion annotations

---

### Week 3: Tailwind + Shadcn + Next.js + Svelte + Vue + Testing

**MONDAY — Tailwind + Shadcn + Motion**
- Migrate all 4 platforms to Tailwind. `packages/tokens.css` → `tailwind.config.ts` (tokens preserved as Tailwind theme extensions)
- Shadcn `Command` (Cmd+K in DispatchOS: search drivers, zones, trips). Shadcn `Dialog` (trip assignment modal). Motion `AnimatePresence` for slide transitions
- AIPilot: Motion `layout` animation — approval decision slides from AI suggestion panel to human decision panel

**TUESDAY — Next.js: CourierNet Consumer App + FoundryOS Dataset Viewer**
- CourierNet: `app/orders/[id]/page.tsx` — Server Component, fetches order from CourierNet Node server. ISR for restaurant pages (`revalidate: 60`). Server Action for order status rating
- FoundryOS: `app/datasets/[id]/page.tsx` — Server Component renders dataset schema + sample rows. `app/pipelines/[id]/page.tsx` — pipeline run history with streaming Suspense

**WEDNESDAY — Svelte + Vue + Tanstack Start**
- Svelte: DispatchOS embeddable driver status widget (third-party partners embed `<script src="dispatchos.io/widget.js?driverId=D001">`) — 9KB bundle, edge deployed
- Vue: CourierNet restaurant merchant dashboard (different internal team) — Pinia for store, same REST API
- Tanstack Start: FoundryOS type-safe admin (route name typos are TypeScript errors)

**THURSDAY-FRIDAY — Testing**
- Vitest: `H3 cell computation`, `order state machine transitions`, `pipeline DAG validation`, `surge price calculation`
- Playwright: full trip assignment flow (DispatchOS), complete order checkout (CourierNet)
- TestSprite: generate E2E for AIPilot approval flow

**WEEKEND — All 4 Platforms v0.3: All Frameworks + Tests Running in CI**

---

### Week 4: Node.js + Express + All Databases — Real Backends

**MONDAY — Node.js Streams — DispatchOS Location Pipeline**
- Feature: DispatchOS location events are high-volume (1M/day per city). Stream them: receive → validate with Zod → enrich with H3 → batch-insert to Cassandra (high-write telemetry) + publish to Redis (current position cache)
- Transform stream pipeline: socket stream → `GpsPingSchema.safeParse()` → H3 enrichment → batch write. Memory stays flat at ~25MB regardless of volume

**TUESDAY — Express + All APIs — Multi-Platform REST Layer**
- DispatchOS: `GET /drivers/nearby?lat=&lng=&radiusKm=` (PostGIS `ST_DWithin`), `POST /trips`, `PATCH /trips/:id/assign`
- CourierNet: `GET /restaurants`, `POST /orders`, `GET /orders/:id`, `POST /orders/:id/rate-dasher`
- FoundryOS: `GET /datasets`, `POST /datasets`, `POST /pipelines`, `GET /pipelines/:id/runs`
- AIPilot: `GET /decisions/pending`, `POST /decisions/:id/approve`, `POST /decisions/:id/reject`
- All: Zod validation middleware (same schemas from Week 1), pino structured logging, `X-Request-ID` correlation

**WEDNESDAY — PostgreSQL + PostGIS — Geospatial Schema**
- DispatchOS: `drivers (id, location geography(POINT,4326), h3_cell_r9 text, status, zone_id)`. `trips (id, status, pickup geography, dropoff geography, driver_id)`. Spatial index: `CREATE INDEX ON drivers USING GIST(location)`. Query: `SELECT id FROM drivers WHERE ST_DWithin(location::geography, ST_MakePoint($1,$2)::geography, 2000)` — all drivers within 2km
- CourierNet: `restaurants (id, location geography, h3_cell text)`, `orders`, `dashers (id, location geography, current_order_id)`
- FoundryOS: `datasets (id, name, schema jsonb, source_config jsonb, row_count)`, `pipeline_runs (id, pipeline_id, status, lineage_graph jsonb, started_at, completed_at)`
- AIPilot: `decisions (id, decision_type, ai_suggestion jsonb, human_decision text, approved_by, audit_trail jsonb)`

**THURSDAY — Redis + JWT + H3 Zone Cache**
- DispatchOS: Redis sorted set `drivers:active:{h3Cell}` — `ZADD drivers:active:8928308280fffff {timestamp} {driverId}`. Expire inactive drivers: `ZREMRANGEBYSCORE ... 0 {now-60s}`. Count active: `ZCARD drivers:active:{h3Cell}`
- Surge multipliers in Redis: `SET surge:{h3Cell} 1.8 EX 120` — all active cells' multipliers cached, read on every pricing request
- JWT: DispatchOS 3 roles (driver/dispatcher/admin), CourierNet 3 roles (customer/dasher/merchant)

**FRIDAY — Cassandra + ClickHouse + PGVector + Delta Lake Preview**
- **Cassandra (DispatchOS)**: driver location history — `PRIMARY KEY (driver_id, event_time)`. Write-heavy (1M events/day per driver in a busy city). Query: last 1hr of a driver's route
- **ClickHouse (FoundryOS)**: pipeline run analytics — query duration, row throughput, failure rates across all pipelines. Sub-100ms aggregations on millions of runs
- **PGVector (AIPilot)**: embed every past analyst decision (`decision_type + context`). When new decision arrives, find similar past decisions → AI uses them as few-shot examples
- **Delta Lake preview**: FoundryOS stores output datasets as Parquet on S3 with Delta ACID guarantees (full implementation Month 3)

**WEEKEND — All 4 Platforms v0.4: Full-Stack + Real Databases**
- DispatchOS v0.4: React ← Express ← PostgreSQL/PostGIS + Cassandra + Redis. Live driver map now has real driver positions from PostGIS
- CourierNet v0.4: React ← Express ← PostgreSQL. Order creation persists. Restaurant list from real DB
- FoundryOS v0.4: pipeline CRUD + ClickHouse run analytics + Delta Lake dataset storage
- AIPilot v0.4: decision queue reading from DispatchOS + CourierNet events, PGVector few-shot lookup

---

## MONTH 2: APIs + Real-Time + DevOps — All 4 Platforms in Production

### Week 5: gRPC + GraphQL + tRPC + Webhooks + Real-Time

**MONDAY — REST + Idempotency — DispatchOS Trip Assignment**
- Feature: Trip assignment must be idempotent — network retry must not double-assign a driver
- Idempotency key: Redis `SET trip:assign:{key} NX EX 300` → cache response. Same `Idempotency-Key` header → same response
- Token Bucket rate limiting: 1000 GPS pings/min per driver, 200 API calls/min per dispatcher

**TUESDAY — gRPC — DispatchOS Internal Matching Service**
- Feature: DispatchOS matching engine (driver ↔ rider) is a separate internal service — gRPC for sub-5ms communication
- `dispatch.proto`: `MatchTrip (Unary)` — send trip request, get assigned driver. `StreamNearbyTrips (Server Stream)` — driver subscribes, gets pushed new nearby trips as they arrive
- Benchmark: same matching request over REST vs gRPC — 40% smaller payload, 3× throughput

**WEDNESDAY — GraphQL — CourierNet Merchant Partner API**
- Feature: CourierNet restaurant partners need a flexible query API for their analytics
- `Restaurant → orders (Order[]) → items (OrderItem[]) → dasher (Dasher)` — nested queries
- DataLoader: batch all `dasherId → dasher` lookups (N+1 eliminated)
- Subscription: `orderStatusChanged` — merchant dashboard live updates

**THURSDAY — tRPC + Webhooks**
- FoundryOS admin: tRPC (full TypeScript types — dataset schema changes caught at compile time)
- CourierNet webhooks: HMAC-SHA256 signed to merchant systems. Retry + DLQ. `order.placed`, `order.picked_up`, `order.delivered`

**FRIDAY — WebSockets + SSE — Live Map + Live Order Tracking**
- **DispatchOS SSE**: `GET /drivers/stream` → Redis pub/sub → 50K dispatcher connections each receive driver location updates within 500ms
- **DispatchOS WebSocket**: driver ↔ dispatcher in-trip communication
- **CourierNet SSE**: `GET /orders/:id/track` → dasher location + ETA pushed live to customer
- **AIPilot SSE**: new pending decision → pushed to analyst dashboard immediately

**WEEKEND — All 4 Platforms v0.5: All APIs + Real-Time**
- DispatchOS: live map updating via SSE (Redis pub/sub bridged across 3 replicas). Trip assignment idempotent. gRPC internal matching
- CourierNet: live order tracking via SSE. GraphQL partner API. Webhooks with HMAC signing
- AIPilot: new decisions pushed instantly to analysts via SSE — no polling

---

### Week 6: Docker + CI/CD + Kubernetes + Multi-Cloud

*Same infra depth as reference — applied to this track:*

**MONDAY — Docker + Firecracker**
- All 4 platforms containerized with multi-stage builds (900MB → ~85MB)
- AIPilot: Firecracker sandbox — analysts can run Python diagnostic scripts safely. 256MB RAM, 5s timeout, no network. Human-approved scripts only

**TUESDAY — GitHub Actions CI/CD**
- Matrix: `platform: [dispatchos, couriernet, foundryos, aipilot]` × `node: [18, 20, 22]` × `browser: [chromium, firefox]`
- `paths` filter: only DispatchOS pipeline runs when `apps/dispatchos/**` changes
- Trivy CVE scan on every Docker image. Fail on HIGH/CRITICAL

**WEDNESDAY — Kubernetes + PostGIS on K8s**
- DispatchOS: Deployment + HPA (scale on custom metric `active_trips_per_pod > 500`). `Ingress` with NGINX + TLS
- PostGIS: running in K8s with persistent volume. Spatial index warmup job on startup

**THURSDAY — Terraform + Pulumi + AWS/GCP**
- DispatchOS → **AWS**: EKS + RDS PostgreSQL+PostGIS + ElastiCache + S3 (trip receipts) + CloudFront
- CourierNet → **GCP**: GKE + Dataproc (for FoundryOS Spark jobs) + Cloud SQL + GCS
- FoundryOS → **AWS**: S3 (Delta Lake datasets) + Athena (ad-hoc SQL on datasets) + Glue (schema registry)
- AIPilot → **Railway** (fast iteration)

**FRIDAY — Cloudflare + OTel Sidecar**
- Go OTel sidecar: zero-code distributed tracing across all 4 platforms. Deployed as K8s sidecar
- Cloudflare Workers: DispatchOS driver widget at edge. AIPilot edge auth (verify JWT before request hits origin)

**WEEKEND — All 4 Platforms in Production on Real Cloud + Full Observability**
- Prometheus + Grafana: dashboards for all 4 platforms (RPS, p50/p95/p99, DB query time, H3 lookup time)
- Jaeger: distributed traces. Find the slow query. Fix it. Verify fix.

---

## MONTH 3: Go + Geospatial Engine + Kafka + Data Pipelines

**Month 3 goal:** DispatchOS's matching engine moves to Go and becomes genuinely fast — 500K location events/sec. FoundryOS gets a real data pipeline engine with PySpark + Delta Lake + Airflow. Kafka becomes the backbone connecting all four platforms. By the end, FoundryOS is ingesting real-time data from DispatchOS and CourierNet continuously.

---

### Week 7: Go — DispatchOS Matching Engine

**MONDAY — Go Foundations — Why Go for Dispatch**
- Go vs Node.js for geospatial matching: 100 goroutines computing H3 ring lookups simultaneously vs Node.js single thread. For 500K location events/sec, Go wins
- `cgo` + H3 bindings: use Go's H3 bindings (`uber-go/h3`) for native-speed cell computations

**TUESDAY-WEDNESDAY — Go DispatchOS Location Aggregator + Matching Engine**
- Feature: Replace Node.js location event receiver with Go — same PostGIS DB, 13× throughput
- 500 goroutines: each processes a batch of location events → H3 enrichment → PostGIS update → Redis cache update
- Matching engine goroutine: every 500ms, for each open trip request → `h3.GridDisk(riderCell, 3)` → Redis lookup for active drivers in those cells → score by (distance × driver_rating × ETA) → assign top candidate
- Benchmark: Node.js: 40K location events/sec. Go: 520K events/sec. Same PostGIS, same Redis.

```go
// apps/dispatchos/matcher/main.go
// Matching engine: every 500ms, match open trip requests to nearby drivers

func runMatchingEngine(ctx context.Context, pool *pgxpool.Pool, rdb *redis.Client) {
  ticker := time.NewTicker(500 * time.Millisecond)
  for {
    select {
    case <-ticker.C:
      openRequests, _ := fetchOpenRequests(ctx, pool)
      var wg sync.WaitGroup
      for _, req := range openRequests {
        wg.Add(1)
        go func(r TripRequest) {
          defer wg.Done()
          // H3 ring search: rider cell + rings of radius 3 (~2km)
          candidateCells := h3.GridDisk(r.H3Cell, 3)
          // Redis: active drivers in each cell (ZUNION across all candidate cells)
          candidates := fetchDriversFromRedis(ctx, rdb, candidateCells)
          if len(candidates) == 0 { return }
          // Score: composite of distance + rating + estimated pickup time
          best := scoreCandidates(r, candidates, pool)
          assignTrip(ctx, pool, rdb, r.ID, best.DriverID)
        }(req)
      }
      wg.Wait()
    case <-ctx.Done():
      return
    }
  }
}
// Matching latency: < 50ms for 10K open requests simultaneously.
// This is the architecture that makes sub-minute pickups possible at city scale.
```

**THURSDAY — Go: CourierNet ETA Prediction Service**
- Feature: CourierNet needs delivery ETA — ML model predicts based on distance, time of day, restaurant prep time, dasher speed history
- ONNX model (trained in Python, served in Go): `[distanceKm, hourOfDay, restaurantAvgPrepMins, dasherSpeedKmph]` → `predictedMinsToDelivery`
- < 5ms inference, embedded in Go binary, no Python runtime on the server
- ETA updated live: dasher location changes → re-inference → new ETA via SSE to customer

**FRIDAY — Go Circuit Breaker + Load Balancer + fleetctl-equivalent CLI**
- Go circuit breaker: wraps every external call (payment provider, restaurant POS, mapping API)
- Consistent hash ring: DispatchOS matching engine shards across 4 instances by H3 zone
- `dispatchctl`: `dispatchctl drivers active --zone=downtown`, `dispatchctl trips pending --count`, `dispatchctl surge --set 1.8 --zone=8928308280fffff`
- `courierctl`: `courierctl orders pending --restaurant=chipotle`, `courierctl eta --order=O001`

---

### Week 8: Python + PySpark + FoundryOS Data Pipelines

**MONDAY — Python + FastAPI — FoundryOS Pipeline Execution API**
- Python: types, Pydantic, async/await, decorators, generators — same depth as Rippling plan
- FastAPI: `POST /api/pipelines/:id/run` → validate with Pydantic → submit Spark job to Dataproc → return `{ runId, status: 'queued' }`
- Pydantic `PipelineConfig` has same field names as Zod `PipelineConfigSchema` — change a field → both TypeScript and Python errors

**TUESDAY — PySpark — FoundryOS First Real Pipeline**
- Feature: FoundryOS ingests raw DispatchOS location events (from Kafka, next week) → PySpark transformation → clean driver activity dataset → Delta Lake
- `SparkSession`, DataFrames, lazy evaluation, `filter().groupBy().agg()`, window functions
- FoundryOS pipeline: DispatchOS events → deduplicate → compute `trips_per_driver_per_hour` → write Delta table

```python
# python/pipelines/dispatchos_driver_activity.py
# Ingests DispatchOS location events. Outputs driver activity dataset.
# FoundryOS UI shows this pipeline's lineage: raw_events → driver_activity

from pyspark.sql import SparkSession
from pyspark.sql.functions import col, count, window, first
from delta import DeltaTable

spark = SparkSession.builder \
    .appName("FoundryOS: DispatchOS Driver Activity") \
    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension") \
    .getOrCreate()

# Source: DispatchOS location events (from Kafka — wired in Week 9)
events = spark.readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", "kafka:9092") \
    .option("subscribe", "dispatchos.location.events") \
    .load() \
    .selectExpr("CAST(value AS STRING) as json") \
    .select(from_json(col("json"), location_event_schema).alias("e")).select("e.*")

# Transform: aggregate to 1-hour windows per driver
activity = events \
    .withWatermark("event_time", "10 minutes") \
    .groupBy(window("event_time", "1 hour"), "driver_id") \
    .agg(
        count("*").alias("event_count"),
        first("h3_cell_r9").alias("most_recent_cell"),
    )

# Output: Delta Lake (FoundryOS dataset — AIPilot will query this)
activity.writeStream \
    .format("delta") \
    .outputMode("append") \
    .option("checkpointLocation", "s3://foundryos/checkpoints/driver-activity/") \
    .start("s3://foundryos/delta/driver-activity/")
# FoundryOS lineage: dispatchos.location.events → driver_activity → aipilot.surge_decisions
```

**WEDNESDAY — Delta Lake + dbt + Great Expectations**
- Delta Lake: every FoundryOS output dataset is Delta. `MERGE INTO` for upserts (dasher performance scores — not append-only). Time-travel: `VERSION AS OF 5` to audit what data looked like before a pipeline change
- dbt: SQL-based transformation on top of Delta tables. `dim_drivers`, `dim_restaurants`, `fact_trips`, `fact_orders` — Palantir Foundry's semantic layer is essentially dbt at scale
- Great Expectations: validate every pipeline output — row count within bounds, no null `driver_id`, `duration_ms > 0`

**THURSDAY — Airflow + FoundryOS Lineage Tracking**
- Airflow DAG: `DispatchOS_to_FoundryOS` — runs every 30 min. Depends on Kafka consumer lag < 5K messages. Retries 3× with backoff
- **Lineage tracking (Palantir-critical)**: every FoundryOS pipeline run records `{ inputs: ['dispatchos.location.events'], outputs: ['driver_activity'], transformations: [...], run_id, started_at, completed_at }` in PostgreSQL
- FoundryOS UI: click any dataset → see full upstream lineage graph (D3.js DAG visualization)

**FRIDAY — Kafka — Event Backbone Across All 4 Platforms**
- Topics: `dispatchos.location.events`, `dispatchos.trip.events`, `couriernet.order.events`, `foundryos.pipeline.runs`, `aipilot.decisions`
- FoundryOS subscribes to all 4 platform topics — every event is a potential dataset record
- Exactly-once: idempotent producers + transactional API on DispatchOS trip assignment (no duplicate trip events)
- Schema Registry: Avro schemas for all topics — FoundryOS schema compatibility enforced at publish time

---

### Week 9 (continues Month 3): Kafka Saga + CDC + DB Scaling

**MONDAY — Trip Booking Saga — DispatchOS**
- Feature: Trip assignment spans: payment hold → driver assignment → trip start. Any step can fail. All compensatable
- Kafka choreography: `payment.held` → `driver.assigned` → `trip.started`. Failure: `driver.unavailable` → `payment.released`
- Idempotency key on every compensation: `release-{tripId}` — no double-release

**TUESDAY — Order Delivery Saga — CourierNet**
- `order.confirmed` → `restaurant.accepted` → `dasher.assigned` → `picked_up` → `delivered`
- Failure: `dasher.unavailable` → reassign (not compensate — find next dasher, not cancel order)
- State machine: tracked in PostgreSQL `saga_state` table, survives service restarts

**WEDNESDAY — CDC — FoundryOS Auto-Ingestion**
- Feature: When DispatchOS writes a new trip to PostgreSQL, FoundryOS ingests it automatically — no manual pipeline trigger
- PostgreSQL WAL → Debezium → Kafka `dispatchos.cdc.trips` → FoundryOS consumer → Delta Lake
- Every DB row change in DispatchOS automatically appears as a new record in FoundryOS

**THURSDAY-FRIDAY — Database Scaling**
- DispatchOS: read replica for `GET /drivers/nearby` queries (heavy read, can tolerate 1s lag). Primary for writes only. PgBouncer connection pooling
- PostGIS spatial index benchmark: `ST_DWithin` without GIST index: 800ms on 500K drivers. With GIST: 2ms. Document this
- Monthly partitioning on `trips` table: `trips_2025_01`, `trips_2025_02`. Partition pruning on date-range queries
- CourierNet: Cassandra for dasher location history (same write-heavy pattern as DispatchOS)

---

## MONTH 4: Go Deep + Kubernetes Operator + AI Engineering

### Week 10: Go Deep + DispatchOS Autoscaler Operator

**MONDAY-WEDNESDAY — Go + DispatchOSMatcher Kubernetes Operator**
- Feature: During surge events (concerts, rain, New Year's Eve), matching engine must scale in 30 seconds — not 5 minutes
- CRD: `DispatchOSMatcherPool` — spec: `minReplicas`, `maxReplicas`, `targetActiveTripsPerReplica`
- Operator: reads live Prometheus metric `active_trips_total` → computes desired replicas → updates HPA target
- Pre-event scaling: CRD can specify `preScaleAt: "2025-01-01T23:30:00Z"` — operator scales before demand hits

```go
// apps/dispatchos/operator/controllers/matcherpool_controller.go
func (r *MatcherPoolReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
  var pool dispatchv1.DispatchOSMatcherPool
  if err := r.Get(ctx, req.NamespacedName, &pool); err != nil {
    return ctrl.Result{}, client.IgnoreNotFound(err)
  }

  // Live trip load from Prometheus
  activeTrips, _ := r.queryPrometheus(ctx, `sum(active_trips_total)`)
  desired := max(pool.Spec.MinReplicas, int32(activeTrips/float64(pool.Spec.TargetActiveTripsPerReplica))+1)

  // Pre-scale for scheduled events (concerts, NYE)
  for _, event := range pool.Spec.ScheduledEvents {
    if time.Until(event.StartTime.Time) < 30*time.Minute {
      desired = max(desired, event.MinReplicas)
    }
  }

  if err := r.ensureHPA(ctx, &pool, desired); err != nil {
    return ctrl.Result{}, err
  }

  pool.Status.CurrentActiveTrips = int64(activeTrips)
  pool.Status.CurrentReplicas = desired
  return ctrl.Result{RequeueAfter: 15 * time.Second}, r.Status().Update(ctx, &pool)
}
```

**THURSDAY — CNCF Contribution**
- Contribute to `opentelemetry-go` or `controller-runtime` — Go + K8s work from Week 9 is the portfolio
- Target a `good first issue`, write test, open PR, document the process

**FRIDAY — Go: FoundryOS Pipeline Scheduler**
- Go replaces Node.js for FoundryOS pipeline scheduling — same pattern as GPS aggregator in reference
- 200 goroutines: each monitors a pipeline's Airflow DAG status, updates FoundryOS run records

---

### Week 11: Vercel AI SDK + RAG + AI Agents — AIPilot Full AI Layer

**MONDAY — AIPilot Analyst Assistant (AI SDK + streaming)**
- Feature: Analyst asks "why did surge pricing activate in zone 8928308280fffff at 14:32?" → AI queries DispatchOS metrics, searches FoundryOS driver activity dataset, explains causal chain
- Tools: `queryDispatchOSMetrics` (ClickHouse), `searchFoundryDataset` (PGVector over Delta table metadata), `getDriverActivityInZone` (FoundryOS Delta Lake), `getSurgeHistory` (Redis), `listPendingDecisions` (AIPilot PostgreSQL)
- Every tool call hits a real system built in Months 1-3
- **Constrained autonomy (Palantir AIP-critical):** AI can query and suggest, it cannot act. `executeAction` tool requires human approval — every suggested action goes to the approval queue first

```typescript
// apps/aipilot/src/app/api/analyst/route.ts
// Palantir AIP pattern: AI can SUGGEST, not ACT. Every action requires human approval.

const result = await streamText({
  model: anthropic('claude-sonnet-4-20250514'),
  system: `You are an operations analyst assistant. You can query data and suggest actions.
You CANNOT execute actions directly. When you identify an action to take,
use the proposeAction tool — a human analyst will review and approve it.`,
  messages,
  tools: {
    queryDispatchMetrics: {
      description: 'Query DispatchOS metrics from ClickHouse',
      parameters: z.object({ sql: z.string().startsWith('SELECT') }),
      execute: async ({ sql }) => clickhouse.query(sql),
    },
    searchFoundryDataset: {
      description: 'Semantic search across FoundryOS datasets and pipelines',
      parameters: z.object({ query: z.string() }),
      execute: async ({ query }) => pgVectorSearch('foundry_objects', query),
    },
    proposeAction: {
      // AI CANNOT execute this — it creates a pending human decision
      description: 'Propose an action for human analyst approval',
      parameters: z.object({
        actionType: z.enum(['adjust_surge', 'suspend_driver', 'pause_restaurant', 'escalate']),
        parameters: z.record(z.unknown()),
        justification: z.string(),
      }),
      execute: async ({ actionType, parameters, justification }) => {
        // Creates a record in AIPilot decisions table — human must approve
        return db.insert('decisions', {
          status: 'pending_approval',
          ai_suggestion: { actionType, parameters, justification },
          created_at: new Date(),
        });
        // Returns: { decisionId, status: 'awaiting_human_approval' }
        // The AI cannot approve its own suggestions. Ever.
      },
    },
  },
});
```

**TUESDAY — RAG — AIPilot Over FoundryOS Ontology**
- Feature: AIPilot can semantically search across all FoundryOS datasets, pipelines, and past analyst decisions
- Embed: dataset names + schemas + descriptions + sample queries + past decisions
- PGVector HNSW index. Hybrid search (vector + keyword)
- "Find all datasets related to surge pricing" → hits `driver_activity`, `trip_requests_by_zone`, `surge_history` — all from FoundryOS Delta Lake

**WEDNESDAY — AI Agents — 3-Agent Operations Response**
- Detector Agent: monitors DispatchOS Kafka `trip.events` + surge thresholds (from Redis)
- Analyst Agent: given anomaly → queries FoundryOS datasets, identifies causal chain, computes severity
- Proposal Agent: drafts action proposals (adjust surge, alert dispatchers, pre-scale matching engine) → all go to human approval queue — no autonomous execution
- AIPilot dashboard: live agent activity + pending approval queue + decision audit trail

**THURSDAY — Surge Pricing Engine (ML + real-time)**
- Feature: DispatchOS surge price = ML model prediction, not rule-based threshold
- Python: train `XGBoost` on historical `(h3_cell, hour, day_of_week, weather, active_drivers, open_requests)` → `surge_multiplier`. Export to ONNX
- Go: ONNX inference service, < 3ms per cell prediction. Redis: cache computed surge per H3 cell (TTL 30s)
- FoundryOS: surge model retraining pipeline (Airflow DAG, weekly, reads Delta Lake trip history)

**FRIDAY — WebAssembly + MLflow**
- AssemblyScript Wasm: CourierNet client-side delivery fee calculation (`baseFare + distanceFare + surgeFare + serviceFee`) — same formula as server, no round-trip for every address change
- MLflow: ETA prediction model + surge model both tracked in MLflow. Promote staging → production without downtime

---

## MONTH 5: System Design Fundamentals — All Built Into 4 Platforms

### Week 12: Geospatial Scale + CAP + Fault Tolerance + Rate Limiting

**MONDAY — Geospatial at Scale + H3 Sharding**
- Problem: 500K active drivers globally. `ST_DWithin` on 500K drivers = slow. Solution: H3 cell prefix sharding
- Consistent hash on H3 cell prefix → dispatch region → matching engine pod. Each pod only knows its region
- `gridDisk(riderCell, 3)` → 19 cells → Redis multi-key lookup across those cells only → never scan all 500K drivers

**TUESDAY — Fault Tolerance: Matching Engine Under Load**
- Circuit breaker: PostGIS slow → use Redis-only matching (less accurate but available). Fallback scoring uses cached positions
- Bulkhead: payment service pool separate from matching pool — payment slow ≠ matching slow
- Graceful degradation: ETA prediction ONNX model fails → return rule-based estimate (distance / avg_speed)

**WEDNESDAY — Rate Limiting: All 4 Algorithms**
- DispatchOS: GPS ping endpoint (Fixed Window), trip request (Token Bucket), admin bulk operations (Leaky Bucket)
- AIPilot: analyst queries (Sliding Window Log — audit requires exact counts)
- All 4 Lua scripts as per reference. `Retry-After` + rate limit headers on every 429

**THURSDAY — CAP + Leader Election**
- DispatchOS trip assignment: CP (Consistency required — no double driver assignment)
- FoundryOS pipeline runs: AP acceptable (slightly stale run status OK, availability matters more)
- Leader election: exactly 1 surge pricing calculator per H3 zone cluster (Redis SETNX + heartbeat)

**FRIDAY — Big Data + Bloom Filters + Consistent Hashing**
- FoundryOS → S3 Parquet → Athena: analyst can write SQL on 1TB+ of historical trip data
- Bloom Filters: DispatchOS GPS spam (known spoofed locations blocked before Redis hit), CourierNet unknown restaurant IDs
- Consistent hashing deep dive: DispatchOS matching pods shard by H3 zone cluster. Add pod → 25% zones reassign

**WEEKEND — All System Design Fundamentals + System Health Dashboard**
- AIPilot System Health: shows CAP mode, circuit breaker states, matching engine load, surge map, rate limit status — across all 4 platforms from one dashboard

---

### Week 13: Notifications + Caching + Real-Time PubSub

**MONDAY-TUESDAY — Notifications at Scale**
- DispatchOS: driver gets trip request notification within 500ms — 1M notifications/day
- APNs batch (1000 tokens/call). Redis dedup. Kafka fan-out. DLQ with Slack alert
- CourierNet: "your order is 5 mins away" — real-time ETA push (re-computed every dasher location update)

**WEDNESDAY — Caching Architecture**
- DispatchOS multi-level cache: driver positions (Redis, 30s TTL + jitter) → PostgreSQL/PostGIS (fallback)
- Surge multipliers: Redis (30s TTL), warmed by Go inference service every 20s
- CourierNet restaurant data: Redis (5min TTL), ISR Next.js pages (60s revalidate), CDN for images (1yr immutable)
- PER algorithm: surge multiplier cache probabilistically recomputed before expiry — no stampede under load

**THURSDAY-FRIDAY — Real-Time PubSub at Scale**
- DispatchOS: surge zone activated → Redis `PUBLISH surge:NYC` → 200K connected driver apps receive within 1s
- Benchmark: fan-out latency curve at 10K / 50K / 200K subscribers
- CourierNet: dasher location update → SSE to customer order tracking page. 3-replica Node.js bridged by Redis pub/sub

---

## MONTH 6: All 11 Case Studies — Built Into 4 Platforms

### Week 14: Marketplace Matching + Geospatial Driver Feed + Surge Pricing

**Monday-Wednesday: DispatchOS Marketplace Matching (Case Study 1 — Uber core)**
- Problem: 1M riders/drivers in NYC, match in < 200ms, minimize total pickup time citywide
- Architecture: H3 ring search → Redis active driver sets → Go scoring goroutines → assignment Saga
- k6: 100K simultaneous trip requests, p99 assignment < 200ms, zero double-assignments

**Wednesday: Surge Pricing Engine (Case Study 2 — Uber pricing)**
- Problem: balance supply and demand in real time. Surge too high → riders leave. Too low → no drivers
- Architecture: ONNX Go inference (demand forecast × supply count × elasticity model) → Redis per-cell cache → UI heatmap
- A/B test: ML surge vs rule-based surge — measure earnings + cancellations

**Thursday-Friday: Geospatial Driver Feed (Case Study 3 — Tinder Feed applied to dispatch)**
- Same pattern as reference Tinder Feed case study, applied to DispatchOS
- PostGIS `ST_DWithin` → score by `fare / distance × surge_multiplier` → Redis Sorted Set per driver → SSE push
- Cold start: H3 ring search → rank → cache in < 50ms

---

### Week 15: Notifications + ETA Prediction + Dasher Assignment

**Monday-Wednesday: Notifications at Scale (Case Study 4)**
- Expand Week 13 to full case study. 1M notifications/day. APNs batch. DLQ. k6 benchmarked.

**Thursday-Friday: CourierNet ETA Prediction + Dasher Assignment (Cases 5 + 6)**
- ETA Prediction: ONNX Go model, history-trained, < 5ms. Compare to rule-based. A/B test on live traffic
- Dasher Assignment: greedy matching (nearest dasher) vs optimization (minimize total delivery time across 100 open orders). Go: branch-and-bound with 100ms time limit

---

### Week 16: FoundryOS Data Pipeline + AIPilot Human-in-the-Loop + Fraud + Recommendation

**Monday-Tuesday: FoundryOS Pipeline Reliability (Case Study 7 — Palantir Foundry)**
- Problem: 200 pipelines, each with dependencies. One failure cascades. How to detect, recover, re-run correctly?
- Architecture: Airflow DAG with Great Expectations gating (bad data → halt pipeline, alert), Delta Lake time-travel for rollback, lineage graph for impact analysis
- Demo: inject bad data → pipeline halts → lineage shows all downstream datasets affected → rollback to last good version

**Wednesday-Thursday: AIPilot Human-in-the-Loop Workflow (Case Study 8 — Palantir AIP)**
- Problem: AI identifies that a driver cluster is likely GPS-spoofing. Should it suspend them automatically?
- Architecture: Detector Agent (Kafka) → Analyst Agent (queries FoundryOS driver activity) → Proposal Agent (`proposeAction: suspend_driver`) → Human approval queue → Audit trail
- Key constraint: AI cannot approve its own proposals. Every `proposeAction` generates a row in `decisions` table with `status: 'pending_approval'`. Analyst sees AI's justification + evidence, decides
- Full audit trail: every AI suggestion, every human decision, every action taken — queryable via AIPilot

**Friday: Fraud Detection + Recommendation**
- GPS Spoofing (Case Study 9): Wasm pre-filter (known spoof coordinates) + Go rules (impossible speed, teleportation) + ONNX ML. < 15ms. But suspicious accounts → `proposeAction: suspend` → human review
- Restaurant Recommendation (Case Study 10): collaborative filtering (PGVector user embeddings) + content-based (dish embeddings) + hybrid. A/B test cohorts
- API Rate Limiter (Case Study 11): all 4 algorithms, DispatchOS GPS endpoints

**WEEKEND — All 11 Case Studies Deployed + Portfolio Site + Hiring Materials**

---

## MONTH 7: Hiring Sprint

### Weeks 17-18: Portfolio Polish + Open Source

- All 4 platform READMEs: architecture diagrams (Mermaid.js), k6 benchmarks, ADRs for every major decision
- CNCF contributions: `opentelemetry-go`, `controller-runtime` — operator work from Month 4 is the portfolio piece
- LFX application: `DispatchOSMatcherPool` operator + CNCF PRs
- ADR examples: "Why H3 hexagons over PostGIS for matching hot path", "Why Kafka choreography over orchestration for trip Saga", "Why ONNX Go for ETA prediction over Python microservice"

### Weeks 19-20: Mock Interviews + Applications

**System design mocks (Uber-specific):**
- Design the real-time driver-rider matching system (you built this — answer from code)
- Design the surge pricing engine (you built this — explain the ONNX model, Redis cache, A/B test)
- Design GPS fraud detection (you built this — Wasm + rules + ONNX layers)

**System design mocks (DoorDash-specific):**
- Design the dasher assignment system for optimal delivery time
- Design the real-time delivery tracking for customers
- Design a restaurant recommendation system

**System design mocks (Palantir-specific — hardest interviews):**
- Design a data integration platform that unifies heterogeneous sources with full lineage
- Design a human-in-the-loop AI workflow where the AI cannot act without approval
- Design a pipeline reliability system that handles cascading failures

**Target applications:**

Tier 1 (your portfolio is their problem domain):
- Uber — DispatchOS: H3 matching, surge pricing ONNX, GPS fraud, Kubernetes Operator for scale
- DoorDash — CourierNet: dasher assignment optimization, ETA prediction, restaurant marketplace
- Palantir — FoundryOS + AIPilot: pipeline reliability, ontology-based data model, constrained AI autonomy

Tier 2 (adjacent, same skills):
- Lyft, Instacart, Rappi — same marketplace + logistics vocabulary
- Airbnb — H3 geospatial + pricing + fraud detection + data platform work
- Stripe — payment Saga, idempotency, fraud detection (ONNX Go inference)
- Scale AI / Weights & Biases — data platform + human-in-the-loop AI workflow work
- Any company running Palantir internally — FoundryOS shows you understand what they're running

**Cold email — Uber:**
```
Subject: [Role] — built DispatchOS: H3 matching engine, sub-200ms assignment at 100K TPS

I built DispatchOS over 7 months — it mirrors Uber's dispatch architecture.

Most relevant:
• Go matching engine: H3 ring search → Redis driver sets → goroutine scoring → < 200ms p99 at 100K TPS
• Kubernetes Operator: surge event → auto-scales matching engine in 30s (reads live Prometheus)
• GPS fraud: Wasm pre-filter + Go rules + ONNX inference, 3 layers, < 15ms decision

[GitHub + live demo + k6 benchmarks + H3 architecture ADR]
```

**Cold email — Palantir:**
```
Subject: [Role] — built FoundryOS + AIPilot: data integration platform + human-in-the-loop AI

I built FoundryOS and AIPilot — they mirror Palantir's Foundry + AIP architecture.

Most relevant:
• FoundryOS: heterogeneous source ingestion (Kafka + CDC + CSV) → PySpark transforms → Delta Lake → typed ontology. Full lineage on every pipeline run
• AIPilot: LLM analyst assistant where AI can query but cannot act autonomously. All actions go to human approval queue. Full audit trail
• Pipeline reliability: Great Expectations gating + Delta time-travel rollback + lineage impact analysis

[GitHub + live demo + pipeline lineage visualization + ADRs]
```

---

## Monthly Summary

| Month | New Concepts | Platform Milestones | Key Interconnections |
|---|---|---|---|
| 1 | HTTP + H3 geospatial + TypeScript + PostgreSQL/PostGIS + Cassandra + PGVector + Delta Lake preview | All 4 platforms deployed, DispatchOS events already flowing into FoundryOS | DispatchOS → FoundryOS from Day 1 |
| 2 | gRPC (matching) + GraphQL (merchants) + SSE (live map + tracking) + Docker + K8s + AWS/GCP | All 4 on real cloud, CI/CD gating merges, OTel tracing | AIPilot SSE feed reads DispatchOS + CourierNet live |
| 3 | Go (matching engine + ETA) + PySpark + Delta Lake + Airflow + dbt + Kafka + Saga + CDC + DB scaling | FoundryOS full data stack, all 4 platforms on Kafka backbone | CDC: every DispatchOS DB write auto-ingested into FoundryOS |
| 4 | Go deep + K8s Operator + AI SDK + RAG + constrained agents + ONNX surge pricing | AIPilot full AI layer, DispatchOS auto-scales via Operator | AIPilot queries FoundryOS datasets to ground AI decisions |
| 5 | All system design fundamentals + geospatial scale + human-in-the-loop patterns | All concepts live in platforms, System Health dashboard in AIPilot | Every platform feeds AIPilot's decision support |
| 6 | All 11 case studies as platform features | Full portfolio, all live, all benchmarked, all documented | Every case study uses 5+ technologies from earlier months |
| 7 | Mock interviews + CNCF + Uber/DoorDash/Palantir applications | CNCF PRs merged, applications submitted, portfolio live | Your GitHub is the interview |

---

## Interconnection Map

```
Week 1 DispatchOS location event receiver (raw Node.js, H3 from Day 1)
  ↓ becomes Week 4 Express API + PostGIS + Cassandra writer
  ↓ becomes Week 5 SSE broadcaster (dispatchers see live driver map)
  ↓ becomes Week 7 Go aggregator (520K events/sec, same PostGIS)
  ↓ becomes Week 8 Kafka source (FoundryOS ingests via subscription)
  ↓ becomes Week 9 K8s Operator target (auto-scales matching engine)
  ↓ becomes Month 4 AIPilot data source (AI tools query its metrics)
  ↓ becomes Month 6 Matching Engine case study (you built the answer)

Week 1 FoundryOS pipeline config form
  ↓ gets React + React Hook Form Week 2
  ↓ gets PostgreSQL persistence Week 4
  ↓ gets PySpark pipeline execution Month 3
  ↓ gets Delta Lake + lineage tracking Month 3
  ↓ gets Airflow scheduling Month 3
  ↓ gets AIPilot RAG search across it Month 4
  ↓ becomes Pipeline Reliability case study Month 6

Week 1 AIPilot analyst shell
  ↓ reads DispatchOS events from Day 1 (already connected)
  ↓ gets AI SDK + streaming Month 4
  ↓ gets constrained tool use (proposeAction → human queue) Month 4
  ↓ gets FoundryOS RAG search Month 4
  ↓ gets 3-agent ops response Month 4
  ↓ becomes Human-in-the-Loop case study Month 6
  ↓ is the interview answer for every Palantir AIP question

Week 8 Kafka backbone
  ↓ DispatchOS publishes location + trip events
  ↓ CourierNet publishes order events
  ↓ FoundryOS subscribes to both (CDC + streaming ingest)
  ↓ AIPilot subscribes for anomaly detection
  Four platforms connected. From Week 8 forward, nothing is siloed.
```
