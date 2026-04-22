# RouteMaster — Project Specification
## Logistics & Notifications Platform · TypeScript-Heavy

**Primary Language:** TypeScript (Node.js) · **Crawler only:** Go
**Stack:** Node.js 22 · Express 5 · TypeScript · PostgreSQL · MongoDB · Elasticsearch · Kafka · Redis · Next.js 15 · AWS S3 · Cloudflare R2
**Building Blocks:** `herald` (notifications) · `relay` (live WS tracking) · `gatekeeper` (driver 2FA) · `switchboard` (API gateway) · `pgpool` (PG proxy)

---

## 1. What It Is

A production-grade logistics and real-time order tracking platform. Three-sided marketplace: senders create orders, drivers accept and fulfil them, recipients track in real time. This is the Node.js-at-scale project — where libuv's event loop, `AsyncLocalStorage`, stream backpressure, and the Kafka `kafkajs` consumer are used at production depth.

---

## 2. Stack Breakdown

| Layer | Technology | Depth Point |
|---|---|---|
| Backend API | Node.js 22 + Express 5 + TypeScript strict | `AsyncLocalStorage` for trace context, graceful shutdown, `worker_threads` for CPU work |
| Validation | Zod — one schema = TS type + runtime check | All route bodies validated in middleware, never in handlers |
| ORM | Prisma (PostgreSQL) + Mongoose (MongoDB) | Prisma migrations; Mongoose for flexible shipment document schema |
| Search | Elasticsearch 8 (`@elastic/elasticsearch`) | BM25 + faceted aggregations + kNN hybrid vector search |
| Queue | Kafka (`kafkajs`) | Consumer group for status events; producer for notification fan-out |
| Cache + Locks | Redis (`ioredis`) + Lua scripts | Bloom filter (driver dedup), rate limiting, session |
| Real-time | SSE (Express) + `relay` building block | SSE for status page; `relay` for driver location WebSocket |
| Object storage | AWS S3 + Cloudflare R2 | Proof-of-delivery photos, multipart upload, presigned URLs |
| Frontend | Next.js 15 App Router + Tailwind + Shadcn + Tanstack Query | Order tracker, driver map, Elasticsearch search UI |
| Testing | Vitest + Supertest + Testcontainers (Node) + Playwright | Unit, integration (real ES + Kafka), E2E |
| Observability | OTel Node.js SDK auto-instrumentation + `pino` JSON + Prometheus | Express + Prisma + kafkajs auto-instrumented |
| Crawler | Go binary (separate repo) | Bloom-filter URL dedup; CPU-bound HTML parsing |
| CI | GitHub Actions | `tsc --noEmit` → Vitest → Playwright → `trivy image` → deploy |

---

## 3. Node.js Depth — Key Implementations

### Streams Pipeline (Kafka → Status → Notify)
```typescript
// 10K status events/sec without holding everything in memory
pipeline(
  kafkaReadStream(consumer, 'shipment.events'),   // Readable
  new StatusUpdaterTransform({ highWaterMark: 100 }), // Transform — backpressure
  new NotifierTransform(),                         // Transform — calls herald
  (err) => { if (err) log.error({ err }, 'pipeline failed') }
);
```

### AsyncLocalStorage for Distributed Tracing
```typescript
const ctx = new AsyncLocalStorage<{ traceId: string }>();
app.use((req, _res, next) => ctx.run({ traceId: req.headers['traceparent'] as string }, next));
// Anywhere in the call stack — no parameter threading
function queryDB(sql: string) {
  log.info({ trace_id: ctx.getStore()?.traceId, sql }, 'query');
}
```

### SSE Live Order Tracking
```typescript
app.get('/orders/:id/track', auth, (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.flushHeaders();

  const sub = redis.duplicate();
  sub.subscribe(`order:${req.params.id}:location`);
  sub.on('message', (_, msg) => res.write(`data: ${msg}\n\n`));
  req.on('close', () => { sub.unsubscribe(); sub.quit(); });
});
```

---

## 4. Elasticsearch Full-Text + Hybrid Search
```typescript
const { hits, aggregations } = await es.search({
  index: 'shipments',
  query: {
    bool: {
      should: [
        { match: { destination_address: { query, boost: 2 } } },
        { term: { status: filter.status } }
      ]
    }
  },
  knn: { field: 'desc_embedding', query_vector: await embed(query), k: 10 },
  aggs: {
    by_carrier: { terms: { field: 'carrier_name' } },
    by_status:  { terms: { field: 'status' } }
  }
});
```

---

## 5. MongoDB for Shipment Documents
```typescript
// Flexible schema — each carrier has different document structure
const ShipmentSchema = new Schema({
  orderId:  { type: String, index: true },
  carrier:  String,
  metadata: Schema.Types.Mixed,   // courier-specific fields
  events:   [{ status: String, location: String, ts: Date }]
});
```

---

## 6. Go Crawler (Standalone Binary)
Separate repo. Consumes `crawler.seeds` Kafka topic, uses a Bloom filter (10M URLs, 0.1% FP), parses carrier data from HTML, publishes to `crawler.results`. Go chosen because CPU-bound parsing is 3–5x faster than Node.js for this workload.

---

## 7. Benchmarks

| Metric | Target |
|---|---|
| Order API throughput | 20K orders/min |
| Elasticsearch search p99 | < 80ms (1M docs) |
| SSE location update latency | < 100ms |
| Kafka consumer lag at peak | < 1000 messages |
| Crawler throughput | 500 URLs/sec |

---

## 8. Non-Negotiable Rules

- `tsc --noEmit` + `strict: true` — no `any`, no `@ts-ignore`
- `pipeline()` everywhere — never `.pipe()` (swallows errors)
- Zod on every route body in middleware
- Parameterised queries — Prisma enforces; Elasticsearch uses typed client
- OTel auto-instrumentation imports before any other module
- `clinic.js` flame graph before calling anything production-ready
