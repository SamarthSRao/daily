# 10-Month Full-Stack Engineering Mastery Plan
## Targeting JioHotstar · Razorpay · PhonePe · Flipkart · Tekion
### India Scale — Consumer + Fintech Track

---

## Why This Track

**JioHotstar** — live sports (IPL) drives 50M+ concurrent streams. Engineers deal with: adaptive bitrate streaming, CDN pre-warming, real-time score overlays, burst traffic (wicket → 10× spike in 2 seconds), low-latency video player. The bar is high because the failure mode is national news.

**Razorpay** — one of the best India-scale product shops. Payment gateway, risk engine, UPI stack, merchant dashboard, payout rails. Brutal traffic, real financial consequences for bugs. Your portfolio must show: payment flows, UPI integration patterns, risk/fraud, idempotency, reconciliation.

**PhonePe** — India's largest UPI payments platform. 500M+ users, billions of transactions. Deep infra work: distributed ledger, real-time fraud, UPI protocol, high-availability payment rails.

**Flipkart** — India's e-commerce at scale. Product catalog serving 100M+ users, flash sales (surge from 0 to peak in seconds), inventory management, real-time delivery tracking. The problems are hard and the traffic is real.

**The engineer who gets all of this** understands: high-throughput systems, payment protocol design, consumer-scale performance, and how to build under regulatory constraints (RBI compliance). That combination is rare and well-compensated.

---

## The 4 Platform Projects

- 📺 **StreamEdge** — Live streaming platform (mirrors JioHotstar: adaptive bitrate, live sports, concurrent viewers, score overlays)
- 💸 **PayRail** — Payment processing + UPI engine (mirrors Razorpay/PhonePe: gateway, UPI, risk, reconciliation)
- 🛒 **BazaarFast** — Flash-sale e-commerce (mirrors Flipkart: catalog, flash sales, inventory, delivery tracking)
- 🔮 **InsightHub** — Real-time analytics + recommendation engine (cross-platform: personalisation, trending, fraud signals)

**Monorepo structure:**
```
/
├── apps/
│   ├── streamedge/     ← video shell → HLS player → live stream → concurrent viewers → score overlay
│   ├── payrail/        ← payment form → UPI flow → webhook system → reconciliation → risk engine
│   ├── bazaarfast/     ← product listing → flash sale → inventory → delivery tracking
│   └── insighthub/     ← analytics shell → recommendation engine → fraud signals → trending
├── packages/
│   ├── types/          ← shared TypeScript types (payment, product, stream, analytics)
│   ├── schemas/        ← Zod schemas (Week 1, used forever)
│   ├── ui/             ← shared Shadcn components
│   └── api/            ← typed fetch client with retry + idempotency built-in
└── infrastructure/
    ├── terraform/      ← AWS infra (CDN, EKS, ElastiCache, RDS)
    └── k8s/            ← manifests
```

---

## Master Technology Checklist

### Fundamentals
- [ ] HTTP/HTTPS, DNS, Client/Server, WebRTC (P2P low-latency)
- [ ] HLS / DASH adaptive bitrate streaming
- [ ] UPI protocol + NPCI integration patterns
- [ ] RBI compliance patterns (PCI-DSS adjacent)

### Frontend
- [ ] HTML, CSS, JavaScript, TypeScript, React, Next.js
- [ ] Video.js / HLS.js (adaptive bitrate player)
- [ ] Tailwind, Shadcn, Zustand, Tanstack Query, Zod, RHF
- [ ] Motion, Svelte (lightweight embeds), Vue

### Backend
- [ ] Node.js + Go (high-throughput services)
- [ ] Python (ML + recommendation engine)
- [ ] gRPC (internal), REST (external), WebSockets, SSE

### Databases + Storage
- [ ] PostgreSQL + Redis + ClickHouse (analytics)
- [ ] Elasticsearch (product search)
- [ ] Cassandra (write-heavy telemetry)
- [ ] PGVector (embeddings, recommendations)
- [ ] S3 / CloudFront (video segments, product images)
- [ ] SQLite (offline order drafts)

### Streaming + Queues
- [ ] Kafka (event backbone)
- [ ] HLS (HTTP Live Streaming) + DASH (Dynamic Adaptive Streaming)
- [ ] WebSockets (live score updates, real-time inventory)
- [ ] SSE (notification feeds, order status)
- [ ] Redis Streams (real-time fraud signals)

### DevOps
- [ ] AWS (CloudFront CDN, MediaStore, EKS, ElastiCache, RDS, SQS)
- [ ] Docker, Kubernetes, Helm, GitHub Actions
- [ ] Terraform + Pulumi
- [ ] Cloudflare Workers (edge caching, DDoS)

### Payments + Fintech
- [ ] UPI payment flow (collect + pay)
- [ ] Idempotency (no double charges — ever)
- [ ] Reconciliation (every rupee accounted for)
- [ ] Webhook design + delivery guarantees
- [ ] Rate limiting on payment APIs
- [ ] 2FA / risk-based auth challenges

### System Design — 11 Case Studies
- [ ] Live Video Streaming at Scale (JioHotstar-pattern)
- [ ] Payment Gateway Design (Razorpay-pattern)
- [ ] Flash Sale Inventory at Scale (Flipkart-pattern)
- [ ] Real-Time Score Overlay + Push Notifications (sports app)
- [ ] Product Search at Scale (Elasticsearch + vector hybrid)
- [ ] UPI Fraud Detection (real-time, < 200ms)
- [ ] Recommendation System (collaborative + content)
- [ ] Rate Limiter for Payment APIs
- [ ] Distributed Ledger / Double-Entry Bookkeeping
- [ ] Real-Time Delivery Tracking
- [ ] E-Commerce Listing at Scale (ISR + Elasticsearch)

---

## MONTH 1: Full-Stack From Day One — All 4 Platforms Introduced

### Week 1: HTTP + HTML + CSS + HLS Basics — India-Scale Mental Model

**The narrative this week:** You're building the streaming platform for India's biggest cricket league, a payments company that processes crores of rupees/day, an e-commerce platform with flash sales at 10:00 AM sharp, and an analytics engine that powers all three. Scale assumptions from Day 1: everything must handle 10× normal load as burst.

---

**MONDAY — HTTP + HLS Protocol + CLI + Git**

**Morning (3h):**
- Full HTTP/HTTPS/DNS/TLS depth (same as reference)
- **HLS (HTTP Live Streaming):** `m3u8` playlist → chunks (`.ts` files, 2-6s each) → adaptive bitrate (multiple quality renditions). Player downloads playlist → requests chunks → switches quality based on bandwidth
- **CDN for video:** chunks pre-cached at PoPs. Cache-Control on `.ts` files: long TTL. Cache-Control on `.m3u8`: short TTL (live stream, always fresh)
- Why India needs edge: viewer in Ahmedabad should hit Mumbai PoP, not US-East

**Evening (2h): StreamEdge Live Stream Ingest Server**
- Feature: **StreamEdge needs a server that receives an HLS stream from an encoder and serves it to viewers**
- Raw Node.js HTTP server: receives `PUT /live/{streamId}/{segment}` (encoder pushes `.ts` chunks)
- Stores to memory map, serves via `GET /live/{streamId}/playlist.m3u8` and `GET /live/{streamId}/{segment}`
- Test: `ffmpeg -re -i sample.mp4 -f hls http://localhost:3000/live/cricket-ipl2025` — push a real stream
- This same server becomes the full HLS origin in Week 9 (Express + S3 + CloudFront)

```javascript
// apps/streamedge/server/index.js — Day 1. HLS origin server.
const http = require('http');
const segments = new Map(); // streamId → { playlist: string, chunks: Map<string, Buffer> }

const server = http.createServer((req, res) => {
  const [, , streamId, file] = req.url.split('/');

  if (req.method === 'PUT') {
    // Encoder pushes segment
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => {
      if (!segments.has(streamId)) segments.set(streamId, { chunks: new Map() });
      segments.get(streamId).chunks.set(file, Buffer.concat(chunks));
      res.writeHead(200); res.end('OK');
      console.log(`[stream:${streamId}] segment ${file} received (${Buffer.concat(chunks).length} bytes)`);
    });
  } else {
    // Viewer requests playlist or segment
    const stream = segments.get(streamId);
    if (!stream) { res.writeHead(404); res.end(); return; }

    if (file.endsWith('.m3u8')) {
      res.writeHead(200, { 'Content-Type': 'application/x-mpegURL', 'Cache-Control': 'no-cache' });
      res.end(generatePlaylist(streamId, stream.chunks));
    } else {
      const chunk = stream.chunks.get(file);
      res.writeHead(200, { 'Content-Type': 'video/mp2t', 'Cache-Control': 'max-age=3600' });
      res.end(chunk);
    }
  }
});
server.listen(3000, () => console.log('StreamEdge HLS origin :3000'));
```

**X Post:**
```
Day 1: Built an HLS origin server. 40 lines.

Push with ffmpeg: ffmpeg -re -i cricket.mp4 -f hls http://localhost:3000/live/ipl
Watch in VLC: http://localhost:3000/live/ipl/playlist.m3u8

The playlist says: "here are the last 6 segments, pick your quality, request them."
Each segment: 4 seconds of video, cached for an hour at CDN.
The playlist: cached for 0 seconds (it's live).

Same server becomes full JioHotstar-style origin in Week 9.
Building StreamEdge — live streaming for 50M concurrent viewers.

[VLC screenshot playing from localhost HLS server]
```

---

**TUESDAY — HTML — PayRail UPI Payment Form + BazaarFast Product Page**

- PayRail: UPI payment flow HTML — phone number / UPI ID input, amount, purpose. `inputmode="numeric"` for phone, `pattern="[0-9]{10}"`, `pattern=".+@.+"` for UPI ID
- BazaarFast: product page semantic HTML — `<article>` for product, `<figure>` for image, price with `<data value="999">₹999</data>`, Add to Cart button
- Accessibility: `aria-live="polite"` on payment status (updates without full page reload)

---

**WEDNESDAY — CSS — All 4 Platforms Styled**

- `packages/tokens.css`: India-specific design tokens — `--color-upi: #097939` (UPI green), `--color-cta: #fb923c` (Indian e-commerce orange), `--color-live: #ef4444` (live indicator red)
- StreamEdge: video player container (`aspect-ratio: 16/9`), live badge (pulsing red dot), quality selector overlay
- PayRail: payment form (minimal, trustworthy), step indicator (initiate → processing → confirmed)
- BazaarFast: product grid (`repeat(auto-fill, minmax(200px, 1fr))`), flash sale banner (countdown CSS animation)

---

**THURSDAY — JavaScript — StreamEdge Player + BazaarFast Cart**

- StreamEdge: HLS.js integration — `new Hls()`, load playlist, play. Quality switch UI. Live indicator (updates every 2s)
- BazaarFast: cart with localStorage, `setInterval` countdown for flash sale end time, optimistic "Add to Cart" before server confirms

---

**FRIDAY — TypeScript — packages/types + packages/schemas**

- `packages/types`: `Stream`, `Viewer`, `PaymentIntent`, `UpiTransaction`, `Product`, `Order`, `CartItem`, `RecommendationEvent`
- `packages/schemas`: Zod schemas for all + UPI-specific validations (`upiId: z.string().regex(/^[a-zA-Z0-9._-]+@[a-zA-Z]+$/)`)
- `packages/api`: typed fetch with automatic retry (3× with jitter) and idempotency key injection — critical for payment APIs from Day 1

---

**WEEKEND — All 4 Platforms v0.1 Deployed**

---

### Week 2: React — All 4 Platforms Rebuilt in React

*Same React depth as reference (useState, useEffect, hooks, RHF+Zod, Tanstack Query, Zustand+Immer) — applied to:*

- **StreamEdge**: `<VideoPlayer>` component (HLS.js in `useRef`), `<LiveBadge>` (SSE for viewer count), `<QualitySelector>` (Zustand for selected quality)
- **PayRail**: multi-step payment wizard (RHF + Zod, same Zod schema validates frontend + backend), `<PaymentStatus>` (optimistic UI with rollback)
- **BazaarFast**: product list + cart (Tanstack Query + Zustand). Flash sale countdown with `useEffect` cleanup
- **InsightHub**: trending products list (Tanstack Query, real-time updates every 30s)

**Key addition:** `usePaymentIntent()` custom hook — creates PaymentIntent on server, tracks lifecycle in Zustand. Same hook used in all payment flows throughout 10 months.

---

### Week 3: Tailwind + Next.js + Svelte + Vue + Testing

- **Next.js (BazaarFast)**: ISR product listing (`revalidate: 60`), dynamic `app/products/[id]/page.tsx` Server Component, flash sale countdown as `'use client'` island
- **Svelte**: StreamEdge embeddable score widget (IPL score overlay — 8KB bundle, Cloudflare edge)
- **Vue**: PayRail merchant dashboard (separate team, same REST API)
- **Testing**: Vitest (payment state machine, cart calculations, UPI validation), Playwright (full checkout E2E with network mock for payment gateway)

---

### Week 4: Node.js + Express + All Databases

**MONDAY — Node.js Streams — StreamEdge HLS Segment Pipeline**
- Transform stream: incoming `.ts` chunk → validate → compute duration → upload to S3 → update playlist in Redis
- Memory stays flat: stream chunks through, never hold entire video in memory

**TUESDAY — Express + REST APIs — All 4 Platforms**
- PayRail: `POST /v1/payment-intents` (idempotency key required), `GET /v1/payment-intents/:id`, `POST /v1/payment-intents/:id/confirm`
- BazaarFast: `GET /products` (paginated, cursor-based), `POST /orders`, `POST /orders/:id/cancel`
- All: Zod validation middleware, structured pino logging, `X-Request-ID` correlation

**WEDNESDAY — PostgreSQL + Double-Entry Ledger (PayRail core)**
- PayRail: double-entry bookkeeping — every rupee movement has debit + credit entries. `ledger_entries(account_id, amount, type, reference_id, created_at)`. Balance is always `SUM(credits) - SUM(debits)`
- BazaarFast: `products`, `inventory`, `orders`, `order_items` — inventory with `SELECT ... FOR UPDATE` on reservation
- StreamEdge: `streams`, `sessions`, `viewer_events` — Cassandra for high-write telemetry (bitrate switches, buffering events)

**THURSDAY — Redis + JWT + UPI Auth Patterns**
- PayRail: UPI transaction state in Redis (`upi:txn:{txnId}` → status, expires in 15min). 2-step auth: initiate → confirm. Redis `SETNX` for exactly-once transaction processing
- StreamEdge: Redis sorted set for concurrent viewer count per stream. `ZADD viewers:live:{streamId} {timestamp} {viewerId}` — `ZRANGEBYSCORE` to count active in last 60s

**FRIDAY — Elasticsearch + Cassandra + PGVector**
- **Elasticsearch (BazaarFast)**: product search — `name^3`, `brand^2`, `tags`, `geo_distance` for hyperlocal delivery
- **Cassandra (StreamEdge)**: viewer telemetry (`stream_id, viewer_id, timestamp, bitrate, buffer_events` — `PRIMARY KEY (stream_id, timestamp)`)
- **PGVector (InsightHub)**: product embedding search — `"show me products similar to what I just bought"`

---

**WEEKEND — All 4 Platforms Full-Stack + Real DBs + UPI Payment Flow**

---

## MONTH 2: APIs + Real-Time + DevOps

### Week 5: gRPC + GraphQL + WebSockets + SSE + WebRTC + UPI Webhooks

**MONDAY — REST + Idempotency — PayRail Production-Grade**
- Feature: PayRail must be idempotent like Razorpay — same `Idempotency-Key` → same response, no double charge
- Token Bucket rate limiting: 100 payment requests/min per merchant, 10 on `/confirm` endpoint (stricter)
- Cursor pagination on transaction history

**TUESDAY — gRPC — StreamEdge Internal Services**
- Feature: StreamEdge transcoder service communicates with ingest server via gRPC
- `stream.proto`: `IngestSegment (Unary)`, `StreamSegmentLog (Server Stream)`, `BatchIngestSegments (Client Stream)`

**WEDNESDAY — WebSockets + SSE — Live Score + Live Inventory**
- Feature: StreamEdge needs live cricket score overlay. BazaarFast needs real-time "only 3 left" inventory
- StreamEdge: WebSocket → live score updates pushed during match. Score changes with CricAPI
- BazaarFast: SSE → inventory count updates. Viewer on product page sees `"2 left"` go to `"1 left"` live
- Redis pub/sub bridges both

**THURSDAY — UPI Webhooks + PayRail Webhook System**
- Feature: PayRail receives payment status webhooks from NPCI/bank and must forward to merchants reliably
- HMAC-SHA256 signed outbound webhooks. Retry + DLQ. Merchant dashboard for failed deliveries
- UPI collect flow: `POST /upi/collect` → poll status → webhook on completion

**FRIDAY — WebRTC — StreamEdge Low-Latency Commentary**
- Feature: commentators broadcast < 500ms latency to StreamEdge via WebRTC (not HLS — too much delay)
- WebRTC signaling server → P2P audio/video → StreamEdge injects into HLS stream via compositing

---

### Week 6: Docker + CI/CD + AWS CloudFront + CDN Architecture

**MONDAY — Docker + Multi-Stage + GitHub Actions**
- All 4 platforms containerized. Matrix CI: Node 18/20/22 × 3 browsers. Trivy CVE scan

**TUESDAY-WEDNESDAY — AWS CloudFront + MediaStore — StreamEdge CDN Architecture**
- Feature: StreamEdge needs global CDN for video segments + RTMP ingest
- AWS CloudFront: origin = S3 (`.ts` segments, long TTL) + StreamEdge server (`.m3u8`, no-cache)
- Pre-warming CDN for IPL match start: Lambda runs 10 min before match → requests first 5 segments at all PoPs
- Edge function: verify viewer auth token before serving segment (no unauthorized stream access)

**THURSDAY — Terraform — All 4 Platforms on AWS**
- StreamEdge → AWS: EKS + CloudFront + MediaStore + S3 + ElastiCache
- PayRail → AWS: ECS + RDS + SQS (webhook queue) + ElastiCache
- BazaarFast → AWS: EKS + ElastiSearch Service + RDS + ElastiCache + S3 (product images)
- InsightHub → Railway (fast iteration)

**FRIDAY — Cloudflare Workers — Score Widget + DDoS Protection**
- StreamEdge: Cloudflare Worker serves score overlay widget at edge (Svelte, < 8KB, global PoP)
- BazaarFast: Cloudflare WAF rules for flash sale abuse (bot detection, IP rate limiting)

---

## MONTH 3: Go + Caching + Kafka + High-Throughput Systems

### Week 7: Go — Rewrite StreamEdge HLS Pipeline + BazaarFast Inventory Service

**MONDAY — Go Fundamentals (same depth as reference) — India-Scale Context**
- Go goroutines vs Node.js event loop: at 50M concurrent viewers, Go wins for connection handling
- `net/http` vs gRPC vs WebSockets — when each

**TUESDAY-WEDNESDAY — Go StreamEdge HLS Pipeline**
- Feature: Replace Node.js HLS segment processor with Go — handles 10× more concurrent segments
- 500 goroutines processing `.ts` segments: validate → transcode metadata → upload to S3 → update Redis playlist
- Benchmark: Node.js: 5K segments/sec. Go: 65K segments/sec. Same S3 bucket.

**THURSDAY — Go BazaarFast Inventory Service**
- Feature: BazaarFast flash sale: 500K users click "Buy" simultaneously. Must not oversell
- Go service: `SELECT ... FOR UPDATE` replacement — Redis atomic `DECR` on inventory counter. `-1` means oversold → reject
- 500K concurrent requests: Go handles them with goroutines + Redis atomic ops. No oversell.

**FRIDAY — WebAssembly — BazaarFast Client-Side Price Calculation**
- Feature: BazaarFast needs client-side coupon + tax calculation (no server round-trip for every keystroke)
- AssemblyScript: `calculateFinalPrice(basePrice, couponDiscount, gstRate): f64` → `.wasm` → React

---

### Week 8: Kafka + Payment Saga + Database Scaling

**MONDAY — Kafka — PayRail Payment Event Pipeline**
- Feature: Every payment event (initiate, processing, success, failure, refund) published to Kafka — multiple consumers
- Topic: `payrail.payment.events` (keyed by `paymentId` — ordered per payment)
- Consumer 1: PayRail PostgreSQL (source of truth)
- Consumer 2: InsightHub analytics (fraud signals, merchant metrics)
- Consumer 3: BazaarFast order service (confirm order on payment success)
- DLQ: failed events → `payail.payment.dlq` → alert

**TUESDAY — PayRail Payment Saga**
- Feature: Order payment spans 3 services: payment gateway, inventory reservation, order creation
- Step 1: `inventory.reserved` → Step 2: `payment.captured` → Step 3: `order.confirmed`
- Failure: `payment.failed` → compensate → `inventory.released`
- Same Kafka choreography pattern as reference (Trip Booking Saga), applied to payments

**WEDNESDAY — CDC + CQRS**
- BazaarFast CDC: PostgreSQL WAL → Kafka → Elasticsearch (product search always fresh). Price change → Elasticsearch updated automatically
- InsightHub CQRS: writes to PostgreSQL, read model in ClickHouse (pre-aggregated per product, category, user)

**THURSDAY-FRIDAY — Database Scaling**
- PayRail: `Serializable` isolation on ledger entries, `SELECT FOR UPDATE` on account balances. PgBouncer. Read replica for reporting
- BazaarFast: monthly partitioning on `orders` table. Consistent hash sharding of product catalog by `category_id`
- StreamEdge: Cassandra for viewer telemetry handles 10M writes/sec — no relational DB can

---

## MONTH 4: Go Deep + K8s Operator + AI Engineering

### Week 9: Go Deep + StreamEdge Autoscaler Operator

**MONDAY-WEDNESDAY — Go + StreamEdgeScaler Kubernetes Operator**
- Feature: When a match goes live (IPL boundary), viewer count spikes 10× in 2 seconds. K8s must auto-scale the HLS origin servers
- CRD: `StreamEdgeLiveEvent` — spec: `expectedViewers`, `startTime`, `stream_id`
- Operator: at `startTime - 15min` → scale origin pods to `expectedViewers / 50000`. At match end → scale down
- Also reads live Prometheus metric `concurrent_viewers` → fine-tunes replica count every 30s

```go
// apps/streamedge/operator/controllers/liveevent_controller.go
func (r *LiveEventReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
  var event streamv1.StreamEdgeLiveEvent
  if err := r.Get(ctx, req.NamespacedName, &event); err != nil {
    return ctrl.Result{}, client.IgnoreNotFound(err)
  }

  // How many concurrent viewers right now?
  currentViewers, _ := r.queryPrometheus(ctx, `sum(concurrent_viewers{stream_id="`+event.Spec.StreamID+`"})`)

  // Scale: 1 origin pod per 50K viewers (empirically determined)
  desiredPods := max(event.Spec.MinOriginPods, int32(currentViewers/50_000)+1)

  if err := r.ensureOriginDeployment(ctx, &event, desiredPods); err != nil {
    return ctrl.Result{}, err
  }

  // Pre-warm CloudFront 15 min before match start
  if time.Until(event.Spec.StartTime.Time) <= 15*time.Minute && !event.Status.CloudFrontWarmed {
    r.prewarmCloudFront(ctx, event.Spec.StreamID)
    event.Status.CloudFrontWarmed = true
  }

  return ctrl.Result{RequeueAfter: 30 * time.Second}, r.Status().Update(ctx, &event)
  // IPL boundary: 10× viewers in 2 seconds. Operator handles it automatically.
}
```

**THURSDAY — Go: PayRail Reconciliation Service**
- Feature: Every rupee that goes in must match every rupee that comes out (RBI requirement)
- Go reconciliation worker: reads PayRail ledger → compares against bank settlement files → flags discrepancies
- Runs every 4 hours. Discrepancy → Kafka alert → human review

**FRIDAY — fleetctl-equivalent: streamctl + payctl CLIs**
- `streamctl streams list --live`, `streamctl viewers --stream=ipl2025 --last=1h`
- `payctl transactions list --merchant=flipkart --status=failed`, `payctl reconcile --date=2025-01-15`

---

### Week 10: Vercel AI SDK + RAG + AI Agents — InsightHub Full AI Layer

**MONDAY — InsightHub AI Shopping Assistant**
- Feature: "I want cricket shoes under ₹2000 with good reviews" → AI queries BazaarFast catalog, searches InsightHub embeddings, returns ranked results with reasoning
- Tools: `searchProducts` (Elasticsearch on BazaarFast), `getSimilarProducts` (PGVector), `getReviews` (PostgreSQL), `checkInventory` (BazaarFast inventory service)

**TUESDAY — RAG — InsightHub Product Catalog Semantic Search**
- Embed: product name + description + brand + category + reviews
- Hybrid search: `0.7 × vector similarity + 0.3 × keyword`
- Cache: top 1K product embeddings pre-loaded in Redis on deploy

**WEDNESDAY — AI Agents — InsightHub 3-Agent Fraud Detection**
- Detector Agent: monitors PayRail Kafka events → fires on anomalous transaction pattern
- Analyst Agent: queries PayRail ledger, checks user history, computes risk score
- Action Agent: low risk → allow, medium → require OTP, high → block + alert

**THURSDAY — MLflow + ONNX**
- InsightHub recommendation model: train collaborative filtering → MLflow experiment tracking → ONNX export → Go inference (same pattern as reference)
- A/B test: model v1 vs v2 — measure CTR on product recommendations

**FRIDAY — WebRTC + Live Streaming Low-Latency Mode**
- StreamEdge: WebRTC WHIP (WebRTC-HTTP Ingestion Protocol) → < 500ms glass-to-glass latency for live commentary
- Fallback: HLS for viewers, WebRTC only for commentator ingest

---

## MONTH 5: System Design Fundamentals

### Week 11: High-Availability at India Scale

**MONDAY — CAP Theorem: India Payment Rails**
- PayRail is CP (Consistency + Partition Tolerance) for ledger entries. AP for payment status queries
- Demo: show both modes, explain why UPI MUST be CP for money

**TUESDAY — Fault Tolerance: StreamEdge During IPL**
- Circuit breaker: CDN origin slow → fall back to cached segments (viewers see slight delay, not crash)
- Bulkhead: score overlay service separate from video serving — score widget down ≠ video down
- Graceful degradation: stream quality drops before buffering starts

**WEDNESDAY — Rate Limiting: Payment APIs + Live Stream APIs**
- PayRail: all 4 algorithms. Leaky Bucket on `/confirm` (no bursting on payment confirmation). Token Bucket on general API
- StreamEdge: rate limit HLS playlist requests (100/min per viewer) — prevents bandwidth abuse during matches

**THURSDAY — Flash Sale: Inventory at Scale (Flipkart Pattern)**
- Pre-sale reservation: Redis `SETNX item:{productId}:reserved:{userId}` — one reservation per user
- Atomic decrement: `DECRBY inventory:{productId} {qty}` — returns new value. If < 0: oversold, reject
- Queue system: 500K users click at 10:00:00 AM → Redis sorted set queue → process 1K/sec → prevent DB overload

**FRIDAY — Leader Election + Consistent Hashing**
- StreamEdge: consistent hash ring for which origin server handles which stream ID
- PayRail: leader election for reconciliation worker (exactly 1 running at a time)

---

### Week 12: Notifications + Caching + Real-Time at India Scale

**MONDAY-TUESDAY — Push Notifications at India Scale**
- PayRail: payment success/failure notification within 500ms (RBI guideline)
- StreamEdge: match event push (wicket, six, four) to all subscribed viewers — fan-out to 50M
- APNs batch + FCM batch + Redis dedup (`SET notif:{idempotencyKey} NX EX 86400`)

**WEDNESDAY — Caching: India CDN Architecture**
- StreamEdge: `.ts` segments (1 year immutable), `.m3u8` playlist (no-cache), score overlay (5s TTL)
- BazaarFast: product images (1 year immutable), product pages (ISR 60s), inventory counts (SSE, never cached)
- CloudFront pre-warming automation: Lambda → hit all edge PoPs 15 min before IPL match

**THURSDAY-FRIDAY — Kafka Streams + Real-Time Analytics**
- InsightHub: Kafka Streams sliding window → top trending products per 5 min window (Count-Min Sketch for 10M SKUs)
- PayRail: Kafka Streams → real-time merchant dashboard (transactions/sec, success rate, avg amount)

---

## MONTH 6: All 11 Case Studies

### Week 13: Live Video Streaming at Scale + Payment Gateway Design

**Monday-Wednesday: StreamEdge Live Streaming (Case Study 1 — JioHotstar pattern)**
- Problem: 50M concurrent viewers, < 3s start time, adaptive bitrate, IPL wicket → 10× spike in 2s
- Full architecture: RTMP/WHIP ingest → transcoder → HLS segments → S3 → CloudFront (pre-warmed)
- k6: simulate 50M viewers requesting `.m3u8` → p99 < 100ms globally with CDN

**Thursday-Friday: PayRail Payment Gateway (Case Study 2 — Razorpay pattern)**
- Problem: 10K TPS, no double charges, < 500ms notification, RBI compliance
- Full architecture: API → idempotency check → ledger → UPI rail → Kafka → reconciliation
- k6: 10K TPS sustained, zero double charges (verified with dedup check), < 500ms webhook delivery

---

### Week 14: Flash Sale Inventory + Product Search + Score Overlay Push

**Monday-Wednesday: BazaarFast Flash Sale (Case Study 3 — Flipkart pattern)**
- Problem: 500K users at 10:00 AM, 1000 units available, never oversell, < 200ms response
- Architecture: Redis atomic DECR + queue + BazaarFast API + order saga
- k6: 500K VU at exactly T+0 → 1000 orders created, 499K rejected, 0 oversells

**Thursday-Friday: BazaarFast Product Search (Case Study 4) + StreamEdge Score Overlay Push (Case Study 5)**
- Search: Elasticsearch (12ms) + PGVector (semantic) + Bloom Filter + Redis cache
- Score push: Kafka → Go fan-out → WebSocket → 50M connected devices. Count-Min Sketch for trending topics

---

### Weeks 15-16: Fraud Detection + Recommendation + Reconciliation + Remaining Case Studies

- **PayRail Fraud Detection (Case Study 6)**: Wasm pre-filter + rules (Go) + ONNX ML. < 200ms decision. RBI-compliant logging
- **InsightHub Recommendation Engine (Case Study 7)**: collaborative filtering + PGVector hybrid. Trained on BazaarFast purchase history
- **PayRail Distributed Ledger (Case Study 8)**: double-entry bookkeeping, reconciliation, audit trail
- **BazaarFast Real-Time Delivery Tracking (Case Study 9)**: driver GPS → Kafka → SSE → customer order page
- **Rate Limiter (Case Study 10)**: all 4 algorithms on PayRail payment APIs
- **Real-Time Abuse Masker (Case Study 11)**: StreamEdge piracy detection (concurrent sessions from same account)

**WEEKEND — All 11 Case Studies Deployed + Portfolio Site Live**

---

## MONTH 7: Hiring Sprint

### Week 17-18: Portfolio Polish + Open Source
- All 4 platform READMEs with architecture diagrams, benchmark numbers
- ADRs: why Cassandra for viewer telemetry, why Redis DECR for inventory, why Go for HLS pipeline
- Open source: contribute to `HLS.js`, `video.js`, or a Kafka connector

### Week 19-20: Mock Interviews + Applications

**System design mocks (JioHotstar-specific):**
- Design a live sports streaming platform for 50M concurrent viewers
- Design the score overlay + push notification system for IPL

**System design mocks (Razorpay-specific):**
- Design a UPI payment gateway with no double charges
- Design a reconciliation system for payment rails

**Target applications:**
1. JioHotstar — StreamEdge is your portfolio. You understand HLS, CDN pre-warming, concurrent scale
2. Razorpay — PayRail demonstrates UPI flow, double-entry ledger, idempotency, reconciliation
3. PhonePe — Same portfolio works. Emphasize distributed ledger + fraud detection
4. Flipkart — BazaarFast flash sale architecture is exactly their problem
5. Tekion — Show systems thinking, Go + Kafka + real-time tracking

**Cold email:**
```
Subject: [Role] — built StreamEdge: HLS streaming for 50M concurrent viewers, auto-scales on IPL boundary

I built StreamEdge — it mirrors JioHotstar's technical stack.

Most relevant:
• HLS origin + CloudFront CDN: p99 < 100ms at 50M concurrent, pre-warmed 15 min before match
• Kubernetes Operator: IPL boundary → 10× scale in 30s (reads live Prometheus viewer count)
• Score overlay push: Kafka → Go fan-out → WebSocket, Count-Min Sketch for 50M subscribers

Also built PayRail (Razorpay-pattern): double-entry ledger, UPI flow, < 200ms fraud detection.

[GitHub + Live demo + k6 benchmarks + ADRs]
```

---

## Interconnection Map

```
Week 1 StreamEdge HLS server (raw Node.js)
  ↓ becomes Week 4 Express API + S3 upload + Redis playlist
  ↓ becomes Week 7 Go HLS pipeline (65K segments/sec)
  ↓ becomes Week 9 K8s Operator target (auto-scales for IPL)
  ↓ becomes Month 4 WebRTC low-latency commentary ingest

Week 1 PayRail payment form
  ↓ gets React + RHF Week 2
  ↓ gets double-entry PostgreSQL schema Week 4
  ↓ gets UPI webhook system Week 5
  ↓ gets Kafka event backbone Week 8 (BazaarFast confirms order on payment.success)
  ↓ gets Saga Week 8 (inventory → payment → order)
  ↓ gets AI fraud detection Month 4
  ↓ becomes full Razorpay-pattern case study Month 6

Week 8 Kafka PayRail payment events
  ↓ BazaarFast consumes to confirm orders
  ↓ InsightHub consumes for fraud signals
  ↓ reconciliation service consumes for ledger validation
  Three platforms connected by one Kafka topic. From Week 8 forward.
```
