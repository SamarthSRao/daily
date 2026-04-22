# Biweekly 06 — `herald` · Notification Delivery Service · TypeScript
**Stack:** TypeScript · Node.js 22 · Express 5 · PostgreSQL · Redis · AWS SES · Kafka (`kafkajs`) · Zod · Vitest
**Interface:** REST `POST /v1/notifications` · `GET /v1/receipts/{key}` · `GET /v1/dlq`
**Consumed by:** PayCore (payment confirms), BookWise (waitlist promotions), DungBeetle (job failure alerts), RouteMaster (shipment updates)
**Teaches:** Node.js streams, `AsyncLocalStorage`, multi-channel delivery abstraction, outbox pattern, idempotency, HMAC webhooks, exponential backoff with jitter

## What It Is
A standalone notification microservice. Any project that needs to notify a user — email, SMS, push, webhook — calls `herald` once with a payload and an idempotency key. `herald` handles channel routing, retry, dedup, rate limiting, and delivery receipts. The building block nature: change the email provider once in `herald` and all 5 projects benefit instantly.

**Why TypeScript here:** Node.js's async I/O model is ideal for a delivery pipeline that makes many concurrent outbound HTTP calls (SES, Twilio, FCM). `AsyncLocalStorage` propagates `trace_id` through the async dispatch chain without parameter threading. TypeScript's strict types and Zod schemas catch malformed notification payloads at the boundary — before they get enqueued.

## Stack Detail
| Layer | Tech | Depth Point |
|---|---|---|
| Language | TypeScript (Node.js 22) + strict | `AsyncLocalStorage`, stream pipeline, graceful shutdown |
| Framework | Express 5 + Zod middleware | Route-level validation; Zod schema = TS type + runtime check |
| Queue store | PostgreSQL + `SELECT FOR UPDATE SKIP LOCKED` | Durable queue — no notifications lost on crash |
| Idempotency | Redis `SET NX EX 86400` | Dedup across retries — no duplicate emails/SMS |
| Rate limiting | Redis `INCR notif:rate:{userId}:{minute}` | Max 5 per user per minute |
| Email | AWS SES SDK (`@aws-sdk/client-ses`) | Real integration; LocalStack for tests |
| SMS | Twilio mock behind `Channel` interface | Interface-based mock — swap real Twilio in production |
| Push | FCM HTTP v1 mock | Interface-based mock |
| Webhook | `node:https` + HMAC-SHA256 | `X-Herald-Signature`, timing-safe compare, replay prevention |
| Observability | OTel Node.js SDK + `pino` JSON logs | All deliveries traced; `pino` structured logs with `trace_id` |
| Testing | Vitest + Supertest + `ioredis-mock` + Testcontainers | Unit + integration with real PostgreSQL + Redis |

## Channel Interface (TypeScript)
```typescript
interface Channel {
  id(): 'email' | 'sms' | 'push' | 'webhook';
  send(ctx: DeliveryContext, n: Notification): Promise<Receipt>;
}
// Adding WhatsApp: implement Channel, register it — zero changes to dispatch engine
```

## Node.js Depth Points

### AsyncLocalStorage for Trace Propagation
```typescript
const traceCtx = new AsyncLocalStorage<{ traceId: string; deliveryId: string }>();

// Middleware: inject from incoming request
app.use((req, _res, next) =>
  traceCtx.run({ traceId: req.headers['x-trace-id'] as string, deliveryId: randomUUID() }, next)
);

// In dispatch pipeline — no parameter threading
function logDelivery(channelId: string, status: string) {
  const ctx = traceCtx.getStore();
  log.info({ trace_id: ctx?.traceId, delivery_id: ctx?.deliveryId, channelId, status });
}
```

### Streams for Batch Dispatch
```typescript
// Dispatch 500 pending notifications/min without loading all into memory
pipeline(
  new PendingNotificationsReadable(db, { batchSize: 50 }),  // streams from PG
  new ChannelDispatchTransform({ concurrency: 10 }),         // parallel dispatch
  new ReceiptWriterWritable(db),                              // write receipts back
  (err) => { if (err) log.error({ err }, 'dispatch pipeline error') }
);
```

### HMAC Webhook
```typescript
function signWebhook(secret: string, body: string, timestamp: number): string {
  return 'sha256=' + createHmac('sha256', secret)
    .update(`${timestamp}.${body}`)
    .digest('hex');
}
// Recipient verifies:
function verifyWebhook(secret: string, body: string, header: string, ts: number): boolean {
  if (Math.abs(Date.now() / 1000 - ts) > 300) return false;  // replay prevention
  return timingSafeEqual(
    Buffer.from(signWebhook(secret, body, ts)),
    Buffer.from(header)
  );
}
```

## PostgreSQL Queue Schema
```sql
CREATE TABLE notifications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key TEXT NOT NULL UNIQUE,
  user_id         TEXT NOT NULL,
  channels        TEXT[] NOT NULL,
  template        TEXT NOT NULL,
  data            JSONB NOT NULL,
  status          TEXT NOT NULL DEFAULT 'pending',
  attempts        INT  NOT NULL DEFAULT 0,
  next_retry_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX ON notifications (status, next_retry_at) WHERE status IN ('pending', 'retrying');
```

## Checklist
- [ ] `POST /v1/notifications` + Zod validation + idempotency Redis check
- [ ] PostgreSQL queue: `SELECT ... FOR UPDATE SKIP LOCKED LIMIT 50` worker
- [ ] Exponential backoff: `base × 2^attempt + jitter(0–25%)`, cap 30s
- [ ] Email channel: AWS SES SDK, LocalStack for tests
- [ ] SMS channel: Twilio interface mock
- [ ] Push channel: FCM interface mock
- [ ] Webhook: HMAC-SHA256 + timestamp header + `timingSafeEqual`
- [ ] DLQ: after 3 failures → move to `dlq` table, `POST /v1/dlq/{id}/retry`
- [ ] Prometheus: `herald_notifications_total{channel,status}`, `herald_dlq_depth`
- [ ] OTel auto-instrumentation (Express + Prisma + `kafkajs`) with `AsyncLocalStorage`
- [ ] `tsc --noEmit` + `strict: true` pass
- [ ] Vitest 80%+ coverage; Supertest integration with Testcontainers

## Benchmarks
| Metric | Target |
|---|---|
| Ingestion throughput | 10K notifications/hour |
| Email delivery p99 (SES) | < 5s |
| Webhook delivery p99 | < 500ms |
| Idempotency key lookup (Redis) | < 1ms |
| DLQ depth under normal operation | 0 |
