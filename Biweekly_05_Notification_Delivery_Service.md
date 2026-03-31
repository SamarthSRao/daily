# Biweekly Project 5 — Notification Delivery Service
## Multi-Channel Reliable Delivery with Idempotency

**Timeline:** Weeks 9–10  
**Language:** Go + TypeScript  
**What it mirrors:** Twilio · SendGrid · AWS SNS · RouteMaster notification pipeline  

---

## 1. What This Teaches

How to build a reliable, multi-channel notification system that guarantees at-least-once delivery with idempotent consumers — so retries never cause duplicate emails or SMS. This is a standalone microservice consumed independently by RouteMaster and PayCore via a clean REST API.

---

## 2. The Problem It Solves

Notifications need to reach users across multiple channels (email, SMS, push, webhook) with guaranteed delivery even when downstream providers are temporarily unavailable. A naive implementation that calls SendGrid directly from the business logic has no retry, no deduplication, and no observability. This service fixes all three.

---

## 3. What You Build

### 3.1 Architecture

```
PayCore ──REST──→  Notification Service  ──→ Email (SendGrid/SES)
RouteMaster ───→  [Queue + Retry Engine]  ──→ SMS (Twilio/SNS)
                                           ──→ Push (FCM/APNs)
                                           ──→ Webhook (HMAC signed)
```

### 3.2 Components

| Component | Responsibility |
|---|---|
| REST API | `POST /notifications` — accepts notification request with idempotency key |
| Queue Engine | Persists notification to PostgreSQL outbox before attempting delivery |
| Dispatcher | Routes to correct channel handler (email/SMS/push/webhook) |
| Retry Worker | Exponential backoff: 1s, 2s, 4s, 8s, 16s — then DLQ |
| Idempotency Store | Redis: `notif:{idempotency_key}` → result, TTL 24h |
| Receipt Store | PostgreSQL: delivery receipts, timestamps, provider response codes |
| DLQ API | `GET /dlq` — lists failed notifications. `POST /dlq/{id}/retry` — manual re-queue |

### 3.3 Notification Request Schema

```json
{
  "idempotency_key": "paycore-payment-7f3a-confirmed",
  "recipient": {
    "user_id": "usr_123",
    "email": "user@example.com",
    "phone": "+919876543210",
    "push_token": "fcm_abc123"
  },
  "channels": ["email", "push"],
  "template": "payment_confirmed",
  "data": {
    "amount": "₹1,500",
    "merchant": "Zomato",
    "transaction_id": "txn_456"
  },
  "priority": "high"
}
```

### 3.4 Delivery State Machine

```
PENDING → DISPATCHED → DELIVERED
                    ↘ FAILED → RETRYING → DELIVERED
                                        ↘ DLQ
```

### 3.5 Idempotency Pattern

```go
// Before dispatching:
key := "notif:" + req.IdempotencyKey
existing, err := redis.Get(ctx, key).Result()
if err == nil {
    return parseReceipt(existing), nil  // Already delivered — return stored result
}

// Attempt delivery
receipt, err := dispatch(req)

// Store result regardless of success/failure
redis.SetEX(ctx, key, marshalReceipt(receipt), 24*time.Hour)
return receipt, err
```

### 3.6 Webhook Delivery (HMAC Signed)

```
POST https://merchant.example.com/webhooks/payments
Content-Type: application/json
X-Notification-Signature: sha256=<HMAC-SHA256(secret, body)>
X-Notification-Timestamp: 1706000000
X-Idempotency-Key: paycore-payment-7f3a-confirmed

{"event": "payment.confirmed", "amount": 1500, ...}
```

Recipients verify: `HMAC-SHA256(secret, body) == header signature` using `hmac.Equal` (timing-safe comparison).

---

## 4. Key Concepts Demonstrated

- **Outbox pattern** — write notification to PostgreSQL in the same transaction as the business event. A separate worker reads from the outbox and delivers. Crash between write and delivery = safe, the outbox entry remains and gets retried.
- **Idempotency across retries** — the same `idempotency_key` sent twice returns the same result without sending two emails/SMS. The key is stored in Redis for 24 hours.
- **Exponential backoff with jitter** — backoff = `min(base × 2^attempt + jitter, max)`. Jitter prevents the thundering herd when all retries fire simultaneously after a provider outage recovers.
- **Channel abstraction** — `type Dispatcher interface { Send(ctx, notification) (Receipt, error) }`. Adding a new channel (WhatsApp, Slack) requires implementing one interface, zero changes to the retry engine.
- **HMAC webhook signing** — prevents webhook forgery. Merchant verifies the signature before processing. Timestamp prevents replay attacks (reject if `|now - timestamp| > 5 min`).

---

## 5. Implementation Checklist

- [ ] `POST /notifications` with idempotency key header
- [ ] PostgreSQL outbox table: `(id, payload JSONB, status, attempts, next_retry_at, created_at)`
- [ ] Email dispatcher: SendGrid API or AWS SES (mock for local dev)
- [ ] SMS dispatcher: Twilio API (mock for local dev)
- [ ] Push dispatcher: FCM HTTP v1 API (mock for local dev)
- [ ] Webhook dispatcher: HTTP POST with HMAC-SHA256 signature
- [ ] Retry worker: reads PENDING entries, attempts delivery, updates status
- [ ] Exponential backoff with jitter
- [ ] Idempotency: Redis check before dispatch, store result after
- [ ] DLQ: move to DLQ after 5 failed attempts
- [ ] `GET /receipts/{idempotency_key}` — check delivery status
- [ ] `go test -race ./...` passes
- [ ] Load test: 10,000 notifications/min, measure delivery latency p99

---

## 6. Benchmarks to Document

| Metric | Target |
|---|---|
| Notification ingestion throughput | 10,000/min |
| Email delivery latency p99 | < 5s (SendGrid SLA) |
| SMS delivery latency p99 | < 10s (Twilio SLA) |
| Webhook delivery latency p99 | < 500ms (direct HTTP) |
| Retry success rate after provider recovery | > 99% |
| Idempotency key lookup (Redis) | < 1ms |

---

## 7. Interview Value

- **RouteMaster system design:** *"How do you send 10,000 shipment notifications simultaneously?"* → This service is the answer.
- **PayCore:** *"How do you notify users of payment confirmation without sending duplicate emails on retry?"* → Idempotency key + Redis.
- **Swiggy/Zomato LLD:** *"Design a notification service"* → outbox pattern, channel abstraction, retry with DLQ.
- **Uber:** *"What happens when SendGrid is down for 10 minutes and recovers?"* → Outbox entries remain, retry worker picks up after recovery, exponential backoff prevented thundering herd.

---

## 8. ADR to Write

**"Notification delivery: synchronous vs asynchronous"**  
Decision: asynchronous with PostgreSQL outbox.  
Synchronous alternative: call SendGrid directly from PayCore. Rejected: PayCore's response latency becomes coupled to SendGrid's latency (SLA violation risk).  
Tradeoff: asynchronous delivery means the user might not receive the email for up to 30s. Acceptable for payment notifications; not for OTP (which uses a separate high-priority queue with no exponential backoff).
