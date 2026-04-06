# Full-Stack Engineering Mastery Plan
## Targeting JioHotstar · Razorpay · PhonePe · Flipkart · Tekion
### India Scale — Consumer + Fintech Track — Sequential Projects

---

## The Core Principle: One Project at a Time

You finish one project completely before starting the next. No juggling four codebases. Each project is built deeply, deployed, benchmarked, and documented before you touch the next one. Every project is **specifically modelled on real internal engineering work** at the target company — not a generic portfolio piece.

---

## The 4 Projects (Sequential — Complete One Before Starting the Next)

| Order | Project | Mirrors | Duration | What the Company Actually Uses This For |
|-------|---------|---------|----------|-----------------------------------------|
| **1st** | **StreamEdge** | JioHotstar's internal HLS origin + CDN pipeline | Months 1–2 | JioHotstar engineers build and operate the HLS origin server that receives RTMP/WHIP from encoders, transcodes to multiple bitrates, pushes `.ts` segments to S3, and manages CloudFront CDN pre-warming before IPL matches. StreamEdge is that internal system. |
| **2nd** | **PayRail** | Razorpay's internal payment gateway + UPI engine | Month 3 | Razorpay's engineers build the payment gateway (idempotent charge API, webhook delivery, double-entry ledger), UPI collect/pay flows, reconciliation engine, and risk scoring. PayRail mirrors that internal platform. |
| **3rd** | **BazaarFast** | Flipkart's internal flash sale + inventory system | Months 4–5 | Flipkart's engineers handle Big Billion Day: 500K users click "Buy" at 10:00 AM, there are 1000 units, and the system must never oversell while serving < 200ms responses. BazaarFast is that internal system. |
| **4th** | **InsightHub** | Razorpay/Flipkart's internal analytics + recommendation engine | Month 6 | Razorpay's merchant analytics dashboard, Flipkart's product recommendation engine, and JioHotstar's personalized content feed all use the same underlying real-time analytics + ML infrastructure. InsightHub is that shared internal platform. |

---

## Project 1: StreamEdge — Live Streaming HLS Origin + CDN Pipeline
### Months 1–2 · Mirrors JioHotstar's Live Broadcast Infrastructure

**What JioHotstar actually uses:** During IPL, an encoder at the stadium pushes RTMP to JioHotstar's ingest server. The ingest server transcodes to 4 bitrate renditions (240p/480p/720p/1080p) and pushes `.ts` segments (2s each) to S3 every 2 seconds. CloudFront CDN is pre-warmed 15 minutes before the match starts. When a wicket falls, viewer count spikes 10× in 2 seconds — the CDN absorbs the spike without touching the origin. StreamEdge is that entire pipeline.

---

### Month 1, Week 1: HTTP + HTML + CSS + HLS Mental Model

**Monday — HTTP + HLS Protocol + CDN Architecture + CLI**

| | |
|---|---|
| 🛠 **Technologies** | Node.js 22, VS Code, pnpm, `curl`, `ffmpeg`, `dig` |
| 📖 **Concepts** | HTTP/HTTPS/DNS/TLS model, HLS (HTTP Live Streaming): `m3u8` playlist → `.ts` segments → adaptive bitrate (ABR), CDN for video segments (`Cache-Control: max-age=3600` on `.ts`, `no-cache` on `.m3u8`), India PoP geography |
| 🎯 **You Build** | StreamEdge raw Node.js HLS origin server: `PUT /live/{streamId}/{segment}` (encoder pushes `.ts` chunks), `GET /live/{streamId}/playlist.m3u8` (viewer requests playlist), `GET /live/{streamId}/{segment}` (viewer requests chunk). Test with `ffmpeg -re -i sample.mp4 -f hls http://localhost:3000/live/cricket-test`. |
| 🔗 **Why It Matters** | This is JioHotstar's Day 1 ingest architecture. The server you build today becomes the full S3 + CloudFront pipeline in Month 2. The `Cache-Control` decision (long TTL on `.ts`, no cache on `.m3u8`) is the fundamental trade-off that enables CDN caching of live video. |

**HLS core concepts you implement today:**
- `m3u8` playlist: text file listing the last N `.ts` segment URLs + their durations. Updated every 2 seconds (new segment appended, oldest removed). `Cache-Control: no-cache` because it changes every 2 seconds.
- `.ts` segments: 2–6 second MPEG-TS files. Immutable once written. `Cache-Control: max-age=3600`. CDN caches indefinitely — these never change.
- Adaptive bitrate (ABR): master playlist lists multiple rendition playlists (240p/480p/720p/1080p). Player switches renditions based on available bandwidth. Low bandwidth → player downloads 240p rendition's playlist. Network improves → switches to 720p.

**Tuesday — HTML + CSS + StreamEdge Player + Dashboard**

| | |
|---|---|
| 🛠 **Technologies** | HTML5 `<video>`, `hls.js`, Tailwind, Shadcn |
| 📖 **Concepts** | Semantic HTML, `hls.js` integration (polyfills HLS in non-Safari browsers), `<video>` element API, CSS grid for video player layout, responsive design for mobile-first (India is 90% mobile) |
| 🎯 **You Build** | StreamEdge: HLS.js player that plays your own `m3u8` stream. Bitrate indicator showing current quality (240p/480p/720p/1080p). Buffering spinner when network is slow. Broadcaster admin dashboard: active streams list, viewer count, CDN health status. |

**Wednesday — JavaScript Engine: Types + Closures + Event Loop**

| | |
|---|---|
| 🛠 **Technologies** | Node.js, TypeScript, Vitest |
| 📖 **Concepts** | Primitive vs reference, closures, `var`/`let`/`const`, event loop phases, `Promise.all`/`allSettled`, generators for lazy segment pagination |
| 🎯 **You Build** | `packages/utils/retry.ts` — used by StreamEdge for failed S3 segment uploads (retry with jitter). `packages/utils/concurrent.ts` — `ConcurrencyLimiter` for concurrent CDN pre-warm requests (max 50 parallel). `packages/utils/emitter.ts` — stream state machine emitter. |

**Thursday — TypeScript Deep + Zod**

| | |
|---|---|
| 🛠 **Technologies** | TypeScript strict mode, Zod |
| 📖 **Concepts** | Branded types (`StreamId`, `SegmentIndex`, `H3ViewerCell`), generics, `z.infer`, discriminated unions for stream events |
| 🎯 **You Build** | `packages/types`: `StreamId`, `SegmentIndex` branded. `packages/schemas`: `StreamIngestEventSchema`, `ViewerPingSchema`, `BitrateSwitchSchema` all Zod-validated. |

**Friday — React + Next.js + Tanstack Query + Motion**

| | |
|---|---|
| 🛠 **Technologies** | React 18, Next.js 14, Tanstack Query, Zustand, Motion, `hls.js` |
| 📖 **Concepts** | Server Components for static player page (fast first load), `'use client'` for interactive player controls, Tanstack Query for viewer count polling, Zustand for playback state, `AnimatePresence` for quality badge transitions |
| 🎯 **You Build** | StreamEdge React player: Server Component wraps (fast initial HTML), client player with `hls.js`, quality indicator animates on bitrate switch. Admin dashboard: viewer count chart (Tanstack Query, 5s poll). |

**Weekend — StreamEdge Shell Deployed**

HLS origin + `hls.js` player + admin dashboard. Live stream works end-to-end with `ffmpeg`. Deployed. Lighthouse 90+.

---

### Month 1, Week 2–3: Node.js Internals + PostgreSQL + Redis + WebSocket

**Week 2, Monday — V8 + Streams: HLS Segment Pipeline**

| | |
|---|---|
| 🛠 **Technologies** | Node.js streams, `worker_threads`, `node --inspect` |
| 📖 **Concepts** | V8 JIT, hidden classes, GC, streams backpressure, `pipeline()`, `worker_threads` for HLS manifest generation |
| 🎯 **You Build** | StreamEdge HLS pipeline: encoder push → Transform stream (validate segment) → parallel Writable (S3 upload + Redis cache + manifest update). Worker thread generates `m3u8` manifest without blocking event loop. 10K segments/sec handled. |
| 🔗 **Why It Matters** | During IPL, 100+ streams push segments simultaneously. Generating `m3u8` manifests synchronously blocks the Node.js event loop during viewer request handling. Moving it to `worker_threads` keeps request latency low while encoding happens. |

**Week 2, Tuesday — PostgreSQL + MVCC + Indexes**

| | |
|---|---|
| 🛠 **Technologies** | PostgreSQL, `sqlc`, `pgxpool` |
| 📖 **Concepts** | MVCC, B-tree/partial/GIN indexes, all 4 isolation levels, `EXPLAIN ANALYZE`, N+1 elimination, TimescaleDB for viewer telemetry |
| 🎯 **You Build** | StreamEdge PostgreSQL: `streams`, `segments`, `viewer_sessions`. TimescaleDB hypertable for viewer count time-series. Partial index: `CREATE INDEX ON streams(id) WHERE status='live'`. All queries `EXPLAIN ANALYZE`'d. |

**Week 2, Wednesday — Redis: Viewer Count + Segment Cache**

| | |
|---|---|
| 🛠 **Technologies** | Redis, `ioredis`, Lua scripts |
| 📖 **Concepts** | String/Hash/List/Set/Sorted Set use cases, TTL jitter, Lua atomicity, Redis Streams for real-time viewer events |
| 🎯 **You Build** | StreamEdge Redis: `INCR viewers:{streamId}` on viewer join, `DECR` on leave. `SETEX segment:{streamId}:{index} 3600 {s3url}` for segment cache. `XADD viewerEvents` for real-time analytics. Rate limiting: `ZADD ratelimit:{ip}` (100 playlist requests/min per IP — prevents bandwidth abuse). |

**Week 2, Thursday — WebSocket: Live Score Overlay**

| | |
|---|---|
| 🛠 **Technologies** | WebSocket (`ws`), Redis pub/sub |
| 📖 **Concepts** | WebSocket upgrade, fan-out across replicas via Redis pub/sub, score overlay state sync, ping/pong keepalive for mobile networks |
| 🎯 **You Build** | StreamEdge score overlay: cricket scoring system pushes score updates to Redis pub/sub channel `score:{matchId}`. All StreamEdge server replicas subscribe. Connected viewers receive score overlay updates within 200ms of wicket. Test: kill one replica, viewers on other replicas continue receiving score updates. |
| 🔗 **Why It Matters** | When Rohit Sharma hits a six, 50M JioHotstar viewers see the score overlay update within 200ms. This WebSocket + Redis pub/sub fan-out is exactly how that works. |

**Week 2, Friday — Kafka + SSE + JWT Auth**

| | |
|---|---|
| 🛠 **Technologies** | Kafka, SSE, JWT RS256 |
| 📖 **Concepts** | Kafka for viewer telemetry (100M events/match), SSE for admin dashboard live updates, JWT RS256 auth for broadcaster API |
| 🎯 **You Build** | StreamEdge: every viewer bitrate switch, buffer event, and quality metric → Kafka `viewer-telemetry` topic. Admin dashboard receives updates via SSE (don't need WebSocket — one-way push). JWT RS256 for broadcaster API (`packages/auth`). |

---

### Month 2, Week 5–6: Go HLS Pipeline + K8s Operator + S3/CloudFront

**Week 5: Go Language + Concurrency**

| | |
|---|---|
| 🛠 **Technologies** | Go 1.22, `golangci-lint`, `goleak`, `go test -race` |
| 📖 **Concepts** | Zero values, interfaces, error wrapping, goroutines + M:N scheduler, channels, `sync.RWMutex`, `errgroup`, `atomic.Int64`, `singleflight` |
| 🎯 **You Build** | StreamEdge Go HLS pipeline: receive `.ts` segment → `errgroup` in parallel: (1) transcode to 4 bitrates (goroutines), (2) upload all 4 to S3, (3) update `m3u8` manifest in Redis. `atomic.Int64` viewer counter (no mutex needed). `singleflight` deduplicates concurrent `m3u8` manifest requests for same stream. `go test -race` passes. `goleak.VerifyNone(t)` clean. |
| 🔗 **Why It Matters** | JioHotstar's HLS pipeline is written in Go for exactly this reason: transcoding 4 bitrate renditions, uploading all to S3, and updating the manifest must happen in parallel, not sequentially. `errgroup` is the right tool. |

**Week 5, Thursday–Friday — Go `net/http` + `sqlc` + CDN Pre-Warming**

| | |
|---|---|
| 🛠 **Technologies** | Go `net/http`, `chi`, `sqlc`, `pgx`, AWS CloudFront Go SDK |
| 📖 **Concepts** | `http.Handler`, all 4 server timeouts, `sqlc` compile-time queries, CloudFront cache warming via Lambda (trigger GET on all edge PoPs 15min before match) |
| 🎯 **You Build** | StreamEdge CDN pre-warm: 15 minutes before every scheduled match (`cron`), DungBeetle-style scheduler triggers `warmup_cdn` job → concurrently GETs the first 10 `.ts` segments from all 18 India CloudFront PoPs. Match start: first viewer in Mumbai hits CloudFront cache, not origin. |

**Week 6: K8s Operator + Load Testing**

| | |
|---|---|
| 🛠 **Technologies** | Go, `controller-runtime`, Prometheus, k6 |
| 📖 **Concepts** | K8s Operator, CRD (`LiveStream`), Prometheus metrics (`viewer_count{streamId}`) driving autoscale decisions |
| 🎯 **You Build** | StreamEdge `StreamScalerOperator`: reads Prometheus `viewer_count`. When viewer count exceeds threshold → scale HLS origin pods. IPL match boundary (match starts, viewer count spikes) → 10× scale in 30s without human intervention. k6: 50K concurrent viewers requesting `.m3u8`, p99 < 100ms with CloudFront in front. |

**WebRTC Low-Latency Mode**

| | |
|---|---|
| 🛠 **Technologies** | WebRTC, WHIP (WebRTC-HTTP Ingestion Protocol), STUN/TURN |
| 📖 **Concepts** | WebRTC peer connection, STUN (NAT traversal), TURN (relay for symmetric NAT), WHIP for broadcaster ingest, < 500ms glass-to-glass latency |
| 🎯 **You Build** | StreamEdge WebRTC: commentator ingest via WHIP (< 500ms latency). Fallback: HLS for viewers (3s latency). The commentator's audio/video arrives at StreamEdge via WebRTC, re-published to viewers via HLS. |
| 🔗 **Why It Matters** | JioHotstar uses WebRTC for low-latency commentary and reaction feeds. The WHIP protocol (standardized 2023) is the modern approach to WebRTC-based live ingest. |

**Weekend — StreamEdge COMPLETE**

k6: 50K concurrent viewers, CloudFront p99 < 100ms. K8s Operator auto-scales on viewer count. CDN pre-warming 15min before matches. WebRTC WHIP ingest < 500ms. ADRs: "Why HLS over DASH for India", "Why CloudFront pre-warming over origin-on-demand". LinkedIn post. Now start PayRail.

---

## Project 2: PayRail — Payment Gateway + UPI Engine + Reconciliation
### Month 3 · Mirrors Razorpay's Internal Payment Infrastructure

**What Razorpay actually uses:** Razorpay's engineers build the payment gateway API (idempotent charge, card network routing, UPI collect/pay), the webhook delivery system (retry with exponential backoff, HMAC signing), the double-entry ledger (every rupee accounted for), the reconciliation engine (reconcile Razorpay records against bank settlement files), and the risk scoring system (real-time fraud decision < 200ms). PayRail is that internal platform.

---

### Month 3, Week 7: PayRail Foundation

**Monday — Double-Entry Ledger + ACID**

| | |
|---|---|
| 🛠 **Technologies** | Go, PostgreSQL, `DECIMAL(19,4)` |
| 📖 **Concepts** | Double-entry bookkeeping (debit + credit always sum to zero), ACID transactions, `SERIALIZABLE` isolation for ledger ops, DB-level constraint on balance |
| 🎯 **You Build** | PayRail ledger: `journal_entries` table. Every financial movement creates two rows in one transaction. `CHECK (SUM(debits) = SUM(credits))` enforced. One-sided write fails at DB level — not at application level. |
| 🔗 **Why It Matters** | RBI requires that every payment company maintains a complete, auditable double-entry ledger. A bug that creates a debit without a credit is a compliance failure, not just an application bug. |

**Tuesday — Idempotency Keys + UPI Flow**

| | |
|---|---|
| 🛠 **Technologies** | Go, PostgreSQL (`ON CONFLICT DO NOTHING`), Redis |
| 📖 **Concepts** | Idempotency key pattern, UPI payment flow (collect: payee requests payment from payer, pay: payer initiates), NPCI integration patterns, VPA (Virtual Payment Address) validation |
| 🎯 **You Build** | PayRail: UPI collect flow (`POST /upi/collect` → generates collect request, sends to payer's VPA). UPI pay flow (`POST /upi/pay` → debit merchant account). Idempotency: same `X-Idempotency-Key` 10 times → 1 debit, 9 cached responses. Verified by test. |
| 🔗 **Why It Matters** | UPI is India's primary payment rail. Razorpay wraps NPCI's UPI APIs. The idempotency layer is critical: mobile apps retry on network timeout. Without it, a user who clicks "Pay" twice gets double-debited. |

**Wednesday — Webhook Delivery: Razorpay-Pattern**

| | |
|---|---|
| 🛠 **Technologies** | Go, PostgreSQL, Redis, Kafka |
| 📖 **Concepts** | Webhook delivery guarantees (at-least-once), exponential backoff retry (1s, 2s, 4s, ... up to 3 days), DLQ, HMAC-SHA256 signing, delivery log per event |
| 🎯 **You Build** | PayRail webhook delivery: `payment.captured`, `payment.failed`, `refund.processed` events delivered with HMAC signing (`X-Razorpay-Signature` header — same as Razorpay's real header name). Retry up to 3 days. DLQ with manual retry UI. Delivery log: every attempt logged (status code, response time). |
| 🔗 **Why It Matters** | Razorpay's webhook system is exactly this. Their documentation even specifies the same exponential backoff schedule. You build the system their customers depend on. |

**Thursday — Reconciliation Engine**

| | |
|---|---|
| 🛠 **Technologies** | Go, PostgreSQL, S3 (for settlement files) |
| 📖 **Concepts** | Bank settlement file processing (CSV from NPCI), reconciliation (match PayRail records against bank records), discrepancy detection, RBI-mandated daily reconciliation |
| 🎯 **You Build** | PayRail reconciliation: bank settlement file (CSV, uploaded to S3 daily) → parse → match each row against PayRail ledger entry by UTR number → flag discrepancies. Discrepancy types: missing in PayRail (bank settled but we have no record), missing in bank (PayRail charged but bank has no record). |
| 🔗 **Why It Matters** | RBI mandates that every payment aggregator (Razorpay, PhonePe) reconcile with bank settlement files daily. A discrepancy not caught and resolved within 24 hours is a regulatory violation. |

**Friday — Risk Engine: Real-Time Fraud Scoring**

| | |
|---|---|
| 🛠 **Technologies** | Go, Wasm (AssemblyScript), ONNX, Redis |
| 📖 **Concepts** | 3-layer fraud detection (Wasm pre-filter → Go rules engine → ONNX ML), velocity checks, amount anomaly, new account + high value, < 200ms decision |
| 🎯 **You Build** | PayRail risk engine: (1) Wasm pre-filter (AssemblyScript, known malicious BIN numbers, blocklisted VPAs — < 1ms), (2) Go rules (velocity: > 5 payments/minute from same device → flag; amount: 10× above usual transaction size → flag), (3) ONNX ML model (gradient boosting, < 10ms inference). Total: < 200ms p99. |
| 🔗 **Why It Matters** | Razorpay's risk team says fraud detection must be < 200ms — slower and you increase false positives (legitimate transactions blocked while ML model thinks). RBI also mandates logging every fraud decision for audit. |

---

### Month 3, Week 8: PayRail Advanced + Outbox + Testing

**Monday–Tuesday — Outbox Pattern + Kafka + Saga**

| | |
|---|---|
| 🛠 **Technologies** | Go, Kafka, PostgreSQL outbox |
| 📖 **Concepts** | Outbox pattern (payment event in same DB transaction as ledger update), Kafka exactly-once, payment Saga (debit merchant → NPCI route → credit beneficiary), compensating transactions |
| 🎯 **You Build** | PayRail Saga: UPI pay → debit merchant account (step 1) → NPCI route (step 2) → credit beneficiary (step 3). Failure at step 2: step 1 reversed. Outbox: `payment.captured` event written to outbox in same transaction as ledger. Outbox worker → Kafka. Crash-safe. |

**Wednesday — Rate Limiting + Caching + All Isolation Levels**

| | |
|---|---|
| 🛠 **Technologies** | Redis Lua, ClickHouse |
| 📖 **Concepts** | All 4 rate limit algorithms (leaky bucket on `/confirm` — no bursting on payment confirmation), all 4 isolation levels, merchant analytics in ClickHouse |
| 🎯 **You Build** | PayRail rate limiting: leaky bucket on payment confirmation (RBI mandates rate limiting on payment APIs). ClickHouse merchant analytics: transactions/sec, success rate, avg amount — real-time merchant dashboard. |

**Thursday–Friday — Full Test Suite + k6**

| | |
|---|---|
| 🛠 **Technologies** | `testcontainers`, Playwright, k6, `go test -race` |
| 📖 **Concepts** | E2E payment flow (Playwright), real PostgreSQL + Kafka in tests, k6 load test |
| 🎯 **You Build** | PayRail k6: 10K TPS sustained, p99 < 500ms, zero double charges (dedup check post-load). `go test -race` passes. Playwright: full UPI pay + webhook delivery flow. |

**Weekend — PayRail COMPLETE**

k6: 10K TPS, p99 < 500ms, zero double charges. Fraud engine: < 200ms p99. Reconciliation: processes 1M settlement rows in < 5 minutes. ADRs: "Why leaky bucket on payment confirmation", "Why SERIALIZABLE for ledger writes". LinkedIn post. Now start BazaarFast.

---

## Project 3: BazaarFast — Flash Sale Inventory + Product Marketplace
### Months 4–5 · Mirrors Flipkart's Big Billion Day Infrastructure

**What Flipkart actually uses:** On Big Billion Day, Flipkart sees 500K+ users click "Buy" on a product with 1000 units at exactly 10:00:00 AM. The system must: never oversell (sell more than inventory), serve < 200ms responses to all 500K users simultaneously, and process the 1000 valid orders in the correct sequence (first click gets the item). BazaarFast is the internal system that handles exactly this.

---

### Month 4, Week 9: BazaarFast Foundation

**Monday — Flash Sale Inventory: Redis Atomic DECR**

| | |
|---|---|
| 🛠 **Technologies** | Go, Redis, PostgreSQL |
| 📖 **Concepts** | Redis `DECRBY` atomic decrement (returns new value — if < 0, reject), `SETNX` for one reservation per user, sorted set queue for burst traffic ordering |
| 🎯 **You Build** | BazaarFast inventory engine: `DECRBY inventory:{productId} 1` → returns new count. If `< 0`: `INCR inventory:{productId}` (rollback) + reject with "sold out". Pre-sale reservation: `SETNX reservation:{productId}:{userId}` — one reservation per user. k6: 500K VUs at T+0 → exactly 1000 orders created, 499K rejected, 0 oversells. |
| 🔗 **Why It Matters** | This is Flipkart's exact Big Billion Day inventory mechanism. The Redis `DECRBY` + check is the atomic operation that prevents overselling. The sorted set queue (`ZADD flash_queue:{productId} {timestamp} {userId}`) orders the 500K requests by arrival time — fair queue. |

**Tuesday — Product Catalog: Elasticsearch + Next.js ISR**

| | |
|---|---|
| 🛠 **Technologies** | Elasticsearch, Next.js ISR, PGVector |
| 📖 **Concepts** | Elasticsearch inverted index for full-text search, `multi_match` query, faceted search (brand, price range, category), ISR (Incremental Static Regeneration) for product pages, semantic search with PGVector |
| 🎯 **You Build** | BazaarFast search: `GET /search?q=iphone+case&brand=apple&price_max=500` → Elasticsearch + PGVector hybrid (keyword + semantic). Product page: Next.js ISR (`revalidate: 60`) — static HTML served from CDN, refreshed every 60s. Inventory count excluded from ISR (SSE for live count). |
| 🔗 **Why It Matters** | Flipkart serves 100M+ users browsing products. ISR means product pages are served from CDN (< 10ms) without hitting origin. Inventory count is excluded from the static page and delivered via real-time SSE — because it changes every second during a flash sale. |

**Wednesday — Order Management + Kafka Saga**

| | |
|---|---|
| 🛠 **Technologies** | Go, Kafka, PostgreSQL |
| 📖 **Concepts** | Order state machine (placed → reserved → payment_initiated → payment_confirmed → fulfilled → shipped → delivered), Kafka Saga with PayRail integration, `SELECT FOR UPDATE SKIP LOCKED` for order processing |
| 🎯 **You Build** | BazaarFast order Saga: user places order → reserve inventory (Redis DECRBY) → call PayRail (Project 2) → on `payment.captured` Kafka event → confirm order + release inventory reservation → trigger fulfillment. Payment failure → inventory INCR (release). |

**Thursday — Delivery Tracking: GPS → Kafka → SSE**

| | |
|---|---|
| 🛠 **Technologies** | Go, Kafka, SSE, Redis |
| 📖 **Concepts** | Delivery partner GPS ping → Kafka → SSE fan-out to customer browser, geofence (PostGIS `ST_DWithin` → trigger "arriving soon" notification), estimated delivery time (ONNX model) |
| 🎯 **You Build** | BazaarFast delivery tracking: delivery partner app sends GPS ping every 10s → Kafka `delivery-location` → Go consumer → Redis pub/sub → SSE to customer order page. Customer sees delivery partner dot on map updating in real time. Geofence: partner within 500m of customer → push notification. |

**Friday — Caching Architecture + CDN + CloudFront**

| | |
|---|---|
| 🛠 **Technologies** | Redis, CloudFront, Cloudflare Workers |
| 📖 **Concepts** | Product image CDN (immutable, 1-year TTL), product page ISR (60s), inventory count (SSE, never cached), `Cache-Control` headers, Cloudflare Worker for A/B testing at edge |
| 🎯 **You Build** | BazaarFast caching: product images (`max-age=31536000, immutable`), product pages (ISR, CDN `s-maxage=60`), inventory count (SSE, `Cache-Control: no-store`). Cloudflare Worker: A/B test product page layout at edge — 50% get v1, 50% get v2, no origin hit. |

---

### Month 5, Week 11–12: BazaarFast System Design + Resiliency

**System design implementations in BazaarFast:**
- **Database isolation levels** — all 4 levels. `SELECT FOR UPDATE SKIP LOCKED` for order claiming. `SERIALIZABLE` for inventory reservation in PostgreSQL (backup path to Redis DECRBY).
- **Consistent hashing** — order processing workers use consistent hash ring. Flash sale creates massive number of orders for one product — hash ring routes all orders for one `productId` to same worker (no lock contention).
- **Bloom filters** — product view deduplication (user viewed same product 100 times → count as 1 unique view). Saves 99% of ClickHouse writes.
- **Scaling databases** — read replicas for product catalog reads. PgBouncer for connection pooling. Sharding: `orders` partitioned by `order_date` month.
- **Leader election** — reconciliation worker (exactly 1 running at a time) uses Redis SETNX election.
- **Circuit breaker** — PayRail slow → circuit trips → orders queue in Kafka instead of failing. When PayRail recovers → drain queue.

**Week 12: Notifications at India Scale**

| | |
|---|---|
| 🛠 **Technologies** | FCM, APNs, Kafka, Redis |
| 📖 **Concepts** | Fan-out notification (order update → 50M users), FCM batch API, APNs batch, Redis dedup (`SET notif:{idempotencyKey} NX EX 86400`), < 500ms delivery (regulatory requirement) |
| 🎯 **You Build** | BazaarFast + PayRail notifications: payment confirmed → notification within 500ms (RBI guideline). Order shipped → tracking notification. Big Billion Day sale start → push to 50M subscribers in < 30 minutes using Kafka fan-out + FCM/APNs batch. |

**Weekend — BazaarFast COMPLETE**

k6: 500K VU flash sale, 0 oversells, < 200ms p99. Product search p99 < 50ms. Delivery tracking SSE < 200ms. Notifications: 50M recipients, < 500ms. ADRs: "Why Redis DECRBY over DB transaction for inventory", "Why Kafka fan-out for notifications over direct FCM". LinkedIn post. Now start InsightHub.

---

## Project 4: InsightHub — Real-Time Analytics + Recommendation Engine
### Month 6 · Mirrors Razorpay/Flipkart's Internal Analytics + ML Platform

**What these companies actually use:** Razorpay's merchant analytics team tracks transactions/sec, success rates, and fraud signals in real time. Flipkart's recommendation team trains collaborative filtering models on purchase history and serves them at < 10ms. JioHotstar's personalization team recommends IPL highlights based on viewing history. InsightHub is the shared analytics + ML platform that all three use internally.

---

### Month 6, Week 13: InsightHub Foundation

**Monday — ClickHouse Analytics Pipeline**

| | |
|---|---|
| 🛠 **Technologies** | ClickHouse, Kafka Connect (ClickHouse sink), Go |
| 📖 **Concepts** | Kafka → ClickHouse Kafka table engine (real-time streaming insert), MergeTree partitioning, materialized views for real-time aggregations, sub-second queries on billions of rows |
| 🎯 **You Build** | InsightHub ClickHouse pipeline: PayRail `payment.captured` Kafka events → ClickHouse `payments` table (via Kafka table engine, no batch delay). Materialized view: `payment_hourly_stats` (transactions/hour, success rate, avg amount per merchant). Merchant dashboard: charts update every 5s from ClickHouse. |
| 🔗 **Why It Matters** | Razorpay's merchant analytics dashboard shows live transaction data. The Kafka → ClickHouse Kafka table engine approach means new payments appear in analytics within seconds of capture — no batch ETL, no delay. |

**Tuesday — Count-Min Sketch + Trending**

| | |
|---|---|
| 🛠 **Technologies** | Go, Redis |
| 📖 **Concepts** | Count-Min Sketch for top-K approximation with bounded memory (top trending products across 10M SKUs), sliding window counters, redis `ZINCRBY` for exact counters on smaller keyspace |
| 🎯 **You Build** | InsightHub trending: `ZINCRBY trending:products:{5min_window} 1 {productId}` for every view event → `ZREVRANGE` for top 10. Count-Min Sketch for 10M SKU keyspace (exact sorted set would be 800MB → Count-Min Sketch is 50KB with 1% error). BazaarFast "Trending Now" section reads from this. |

**Wednesday — Recommendation Engine: Collaborative Filtering**

| | |
|---|---|
| 🛠 **Technologies** | Python (model training), ONNX, Go inference, PGVector |
| 📖 **Concepts** | Collaborative filtering (matrix factorization: user × item → score), content-based (product embedding similarity via PGVector), hybrid model, ONNX Go inference < 10ms, A/B test framework |
| 🎯 **You Build** | InsightHub recommendation: train collaborative filtering on BazaarFast purchase history (Python, MLflow experiment tracking). Export to ONNX. Go inference: `POST /recommend/{userId}` → top-10 products in < 10ms. A/B test: v1 (collaborative only) vs v2 (hybrid). CTR tracked in ClickHouse. |
| 🔗 **Why It Matters** | Flipkart's "Customers also bought" and "Recommended for you" sections are this system. The ONNX Go inference approach avoids a Python microservice round-trip — critical for < 10ms latency at scale. |

**Thursday — JioHotstar Content Personalization**

| | |
|---|---|
| 🛠 **Technologies** | Go, PGVector, ClickHouse |
| 📖 **Concepts** | Content embeddings (IPL match → video embedding via PGVector), viewing history → preference vector, cosine similarity for content recommendation |
| 🎯 **You Build** | InsightHub JioHotstar feed: user watching IPL matches → viewing history stored as embeddings in PGVector. "Recommended Highlights" → `SELECT content_id, 1 - (embedding <=> $1) AS similarity FROM content_embeddings ORDER BY similarity DESC LIMIT 10`. Real-time personalised cricket highlights feed. |

**Friday — Fraud Signal Aggregation + Anomaly Detection**

| | |
|---|---|
| 🛠 **Technologies** | Kafka Streams, Go, ONNX, ClickHouse |
| 📖 **Concepts** | Fraud signal aggregation across platforms (PayRail fraud signals → InsightHub → BazaarFast risk score), anomaly detection on payment patterns (Kafka Streams sliding window), streaming classifier |
| 🎯 **You Build** | InsightHub fraud cross-platform: PayRail risk engine flags merchant_id:123 → InsightHub aggregates with BazaarFast order velocity for same merchant → combined fraud signal → PayRail increases fraud score. Anomaly detection: Kafka Streams sliding window detects `payment_failure_rate > 3× baseline for 5 minutes` → alert. |

---

### Month 6, Week 14: All System Design Cases Documented

**Monday — Live Video + Payment Gateway (System Design 1 + 2)**

StreamEdge and PayRail implement these. Write final ADRs, Mermaid diagrams, k6 numbers.

**Tuesday — Flash Sale Inventory + Product Search + Score Overlay Push (System Design 3 + 4 + 5)**

BazaarFast implements flash sale and product search. StreamEdge implements score overlay push. Document: Redis DECRBY atomic inventory, Elasticsearch hybrid search, WebSocket fan-out architecture.

**Wednesday — UPI Fraud Detection + Recommendation + Distributed Ledger (System Design 6 + 7 + 8)**

PayRail implements fraud detection and ledger. InsightHub implements recommendation. Document all three with benchmarks.

**Thursday–Friday — Real-Time Delivery Tracking + Rate Limiter + Abuse Masker (System Design 9 + 10 + 11)**

| | |
|---|---|
| 🛠 **Technologies** | Go, Kafka, SSE, Redis Lua, Wasm |
| 📖 **Concepts** | GPS → Kafka → SSE delivery tracking, all 4 rate limit algorithms on PayRail, StreamEdge piracy detection (concurrent sessions abuse masker) |
| 🎯 **You Build** | BazaarFast delivery tracking: full system documented. PayRail rate limiter: all 4 algorithms, leaky bucket on `/confirm`, documented. StreamEdge piracy detection (abuse masker): same account streaming from > 3 simultaneous IPs → flag for review (Wasm pre-screen → Go rules → shadow restrict). |

**Weekend — InsightHub COMPLETE. All 4 Projects COMPLETE.**

---

## Month 7: OTel + Polish + Hiring Sprint

### Week 15: Final Instrumentation + Benchmarks

Add OTel to all 4 projects. All projects send traces to a shared Jaeger instance. k6 all endpoints. `pprof` all Go services. Lighthouse 100 on all frontends.

**Final k6 targets:**
- StreamEdge: 50K concurrent viewers, CloudFront p99 < 100ms
- PayRail: 10K TPS, p99 < 500ms, zero double charges
- BazaarFast: 500K VU flash sale, 0 oversells, p99 < 200ms
- InsightHub: recommendation p99 < 10ms, ClickHouse analytics p99 < 100ms

### Week 16: Portfolio + Cold Outreach

**Cold Email — JioHotstar:**
```
Subject: [JioHotstar SDE] — built StreamEdge: HLS pipeline for 50M concurrent viewers, auto-scales on IPL match start

StreamEdge mirrors JioHotstar's live broadcast infrastructure.

• Go HLS pipeline: RTMP/WHIP ingest → transcode 4 bitrates → S3 upload → CloudFront, all in parallel via errgroup
• K8s Operator: viewer_count Prometheus metric → auto-scale in 30s during IPL match boundary
• Score overlay: Redis pub/sub fan-out → WebSocket → 50M devices, < 200ms from wicket to screen

[GitHub] [k6 benchmarks] [HLS architecture ADR]
```

**Cold Email — Razorpay:**
```
Subject: [Razorpay SDE] — built PayRail: UPI payment gateway, double-entry ledger, < 200ms fraud scoring

PayRail mirrors Razorpay's internal payment infrastructure.

• Double-entry ledger: every rupee accounted for, DB-level constraint prevents single-entry writes
• UPI flow: idempotency (10 retries → 1 charge, verified), webhook delivery with HMAC signing + 3-day retry
• Risk engine: Wasm pre-filter + Go rules + ONNX ML, 3 layers, < 200ms decision, RBI-compliant logging

[GitHub] [k6 benchmarks] [reconciliation engine ADR]
```

**Cold Email — Flipkart:**
```
Subject: [Flipkart SDE] — built BazaarFast: Big Billion Day flash sale, 500K VUs, 0 oversells

BazaarFast mirrors Flipkart's Big Billion Day infrastructure.

• Flash sale: Redis DECRBY atomic inventory, sorted set queue for 500K burst. k6: 500K VUs, 1000 orders, 0 oversells
• Kafka Saga: order → PayRail payment → inventory confirmation → fulfillment (each step compensatable)
• Notifications: 50M recipients in < 30 minutes (Kafka fan-out → FCM/APNs batch → Redis dedup)

[GitHub] [k6 benchmarks] [inventory architecture ADR]
```

---

## Monthly Summary

| Month | Project | Phase | Key Milestones |
|-------|---------|-------|----------------|
| 1 | StreamEdge | Full-stack: HLS, WebSocket score overlay, Redis | HLS player, S3 pipeline, 50M score overlay fan-out |
| 2 | StreamEdge | Go pipeline + K8s Operator + WebRTC | Go transcode pipeline, CloudFront pre-warm, K8s auto-scale |
| 3 | PayRail | Full build: UPI, ledger, webhooks, fraud | 10K TPS, < 200ms fraud, reconciliation engine |
| 4 | BazaarFast | Foundation: flash sale, catalog, order Saga | Redis DECRBY, Elasticsearch, Kafka Saga |
| 5 | BazaarFast | Advanced: delivery tracking, system design | SSE tracking, notifications at India scale |
| 6 | InsightHub | Full build: ClickHouse, recommendation, fraud signals | ONNX < 10ms, Count-Min Sketch trending, cross-platform fraud |
| 7 | All | OTel, k6, polish, hiring | All benchmarks, cold emails, portfolio live |

---

## Non-Negotiable Rules

| Rule | Why |
|------|-----|
| `go test -race ./...` before every commit | Race in the HLS pipeline causes segment corruption |
| `EXPLAIN ANALYZE` on every query | Unindexed queries under IPL load cause outages |
| Idempotency key on every payment API call | Double UPI debit is a regulatory incident |
| Outbox pattern for every Kafka payment event | Lost `payment.captured` event = merchant never notified |
| Redis `DECRBY` for inventory — never optimistic lock | Optimistic lock at 500K TPS causes massive retry loops |
| `goleak.VerifyNone(t)` in every Go test file | Goroutine leaks in HLS pipeline accumulate to OOM |
| k6 before calling anything "production-ready" | Flash sale at 500K VUs behaves nothing like development |
| `Cache-Control: no-cache` on `.m3u8` | Cached stale playlist → viewers see frozen stream |
| HMAC-sign every PayRail webhook | Unsigned webhooks allow attackers to forge payment confirmations |
| Post benchmark numbers publicly every weekend | Building in public is proof of work |
