# BookWise — Project Specification
## Distributed Seat Reservation System · TypeScript-Heavy

**Primary Language:** TypeScript (Node.js + Next.js)
**Stack:** Node.js 22 · Express 5 · TypeScript · PostgreSQL · Redis · Kafka · Next.js 15 · Stripe
**Building Blocks:** `relay` (live seat map) · `gatekeeper` (booking 2FA) · `herald` (waitlist notifications) · `switchboard` (API gateway) · `pgpool` (PG proxy)

---

## 1. What It Is

A production-grade distributed seat reservation platform — concerts, flights, doctor appointments. 10K concurrent booking attempts, zero double-bookings. This is the TypeScript-heavy project that demonstrates Node.js's async model under extreme concurrency pressure: `async/await` race conditions, `AsyncLocalStorage` for saga context, Kafka event-driven waitlist, and a Next.js seat map with SSE live updates.

**Why TypeScript here:** The booking flow's complexity is in orchestrating async steps (check → lock → charge → confirm → notify) without callbacks or race conditions. TypeScript's strict types catch booking state machine bugs at compile time. The Next.js frontend's live seat map — SSE updates, optimistic UI, conflict resolution — demands deep React + Tanstack Query knowledge.

---

## 2. Stack Breakdown

| Layer | Technology | Depth Point |
|---|---|---|
| Backend API | Node.js 22 + Express 5 + TypeScript strict | Async/await saga orchestration, `AsyncLocalStorage` for booking context |
| Validation | Zod | BookingRequest schema = TS type + runtime validation simultaneously |
| ORM | Prisma + PostgreSQL | `$transaction()` for atomic seat claims; `$queryRaw` for `SELECT FOR UPDATE SKIP LOCKED` |
| Distributed lock | Redis + Lua scripts (via `ioredis`) | `SET NX PX` + atomic release Lua — fencing tokens enforced in Prisma transaction |
| Payment | Stripe SDK + webhook HMAC | Stripe Checkout Session, webhook `payment_intent.succeeded` |
| Queue | Kafka (`kafkajs`) | Waitlist events, booking cancellation fan-out |
| Real-time | SSE (Express) + `relay` building block | SSE for live seat availability; `relay` WS for seat-hold countdowns |
| Frontend | Next.js 15 + Tailwind + Shadcn + Tanstack Query | Seat map component, optimistic booking, real-time availability |
| Testing | Vitest + Supertest + Testcontainers + Playwright | 10K concurrent booking correctness test |
| Observability | OTel Node.js SDK + `pino` + Prometheus | Booking saga traced end-to-end in OpenTrace |
| CI | GitHub Actions | `tsc --noEmit` → Vitest → 10K concurrency test → Playwright → deploy |

---

## 3. TypeScript Depth — Key Implementations

### Branded Types for Booking Safety
```typescript
// Prevent mixing up SeatId, BookingId, UserId at compile time
type SeatId    = string & { readonly __brand: 'SeatId' };
type BookingId = string & { readonly __brand: 'BookingId' };
type UserId    = string & { readonly __brand: 'UserId' };

// This is a compile error — TypeScript catches it:
function reserveSeat(seatId: SeatId, userId: UserId): Promise<BookingId> { ... }
reserveSeat(bookingId, userId);  // ❌ Argument of type 'BookingId' not assignable to 'SeatId'
```

### Booking State Machine with Discriminated Unions
```typescript
type BookingState =
  | { status: 'PENDING';    seatId: SeatId; heldUntil: Date }
  | { status: 'PAYMENT';    seatId: SeatId; stripeSessionId: string }
  | { status: 'CONFIRMED';  seatId: SeatId; bookingId: BookingId }
  | { status: 'CANCELLED';  reason: string }
  | { status: 'EXPIRED' };

// TypeScript forces you to handle every state:
function handleBookingUpdate(state: BookingState) {
  switch (state.status) {
    case 'CONFIRMED': sendTicket(state.bookingId); break;
    case 'CANCELLED': releaseInventory(state.seatId); break;
    // TS error if you forget a case
  }
}
```

### Async Saga Orchestration
```typescript
// Every step typed, every error handled, context propagated via AsyncLocalStorage
async function bookingSaga(req: BookingRequest): Promise<BookingResult> {
  const sagaCtx = { sagaId: randomUUID(), traceId: traceStore.getStore()?.traceId };
  sagaStore.run(sagaCtx, async () => {
    const lock = await acquireLock(`seat:${req.seatId}`);           // step 1
    try {
      const seat = await claimSeat(req.seatId, lock.fencingToken);  // step 2
      const session = await stripe.createCheckout(seat);             // step 3
      await kafka.publish('booking.payment.initiated', { ...req, session }); // step 4
      return { status: 'PAYMENT', stripeUrl: session.url };
    } catch (err) {
      await releaseLock(lock);
      await compensate(req);  // Saga compensating action
      throw err;
    }
  });
}
```

### Redis Distributed Lock with Fencing Token
```typescript
// Atomic acquire via Lua — no GET+SET race condition
const acquireScript = `
  local result = redis.call('SET', KEYS[1], ARGV[1], 'NX', 'PX', ARGV[2])
  if result then
    return redis.call('INCR', KEYS[2])  -- fencing token
  end
  return nil
`;
const fencingToken = await redis.eval(acquireScript, 2,
  `lock:seat:${seatId}`, `fence:seat:${seatId}`,
  ownerToken, '30000'
);
if (!fencingToken) throw new ConflictError('Seat already being booked');
```

### Live Seat Map with SSE
```typescript
// Client subscribes to seat availability for an event
app.get('/events/:id/seats/stream', auth, (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Last-Event-ID', req.headers['last-event-id'] || '0');
  res.flushHeaders();

  const sub = redis.duplicate();
  sub.subscribe(`event:${req.params.id}:seats`);
  sub.on('message', (_, msg) => {
    const update = JSON.parse(msg) as SeatUpdate;
    res.write(`id: ${update.seq}\nevent: seat_update\ndata: ${msg}\n\n`);
  });

  req.on('close', () => { sub.unsubscribe(); sub.quit(); });
});
```

---

## 4. Next.js Frontend — Seat Map
```typescript
// Optimistic UI: mark seat as held immediately, rollback if booking fails
const { mutate: bookSeat } = useMutation({
  mutationFn: (seatId: SeatId) => api.post('/bookings', { seatId }),
  onMutate: async (seatId) => {
    await queryClient.cancelQueries(['seats', eventId]);
    const prev = queryClient.getQueryData(['seats', eventId]);
    queryClient.setQueryData(['seats', eventId], (old: Seat[]) =>
      old.map(s => s.id === seatId ? { ...s, status: 'HOLDING' } : s)
    );
    return { prev };
  },
  onError: (_err, _seatId, ctx) => {
    queryClient.setQueryData(['seats', eventId], ctx?.prev);  // rollback
  }
});
```

---

## 5. PostgreSQL Patterns
```typescript
// Atomic seat claim — no check-then-update race
const claimed = await prisma.$queryRaw<Seat[]>`
  UPDATE seats
  SET    status = 'HELD', held_by = ${userId}, held_until = NOW() + INTERVAL '10 minutes',
         fencing_token = ${fencingToken}
  WHERE  id = ${seatId}
    AND  status = 'AVAILABLE'
    AND  (fencing_token IS NULL OR fencing_token < ${fencingToken})
  RETURNING *
`;
if (claimed.length === 0) throw new ConflictError('Seat taken');
```

---

## 6. Waitlist State Machine (Kafka-driven)
```
Booking cancelled → Kafka event → Waitlist consumer
  → Find first WAITING entry for this seat/event
  → Publish 'seat.offered' to that user via herald
  → Start 15-min confirmation window (Redis TTL)
  → If confirmed: run full booking saga
  → If expired: move to next WAITING entry
  → State: WAITING → OFFERED → CONFIRMED | EXPIRED → WAITING (next)
```

---

## 7. Features by Month

| Month | Feature | Concept |
|---|---|---|
| 1 | Raw HTTP booking, idempotency key in header | REST idempotency, Node.js `http` |
| 2 | JWT auth, multi-venue tenant isolation, `gatekeeper` 2FA | OAuth2, multi-tenancy, OTP |
| 3 | Kafka waitlist events, Node.js stream consumer | Kafka consumer groups |
| 4 | Next.js seat map, SSE live availability, Tanstack Query optimistic | SSE, optimistic UI |
| 5 | `SELECT FOR UPDATE`, Redis distributed lock, fencing tokens | Database + distributed locking |
| 6 | Stripe payment Saga, compensating transactions | Saga pattern |
| 7 | Waitlist Kafka state machine, `relay` WS hold countdown | Event-driven state machine |
| 8 | PGVector seat recommendations, `clinic.js` profiling | RAG, Node.js performance |

---

## 8. Non-Negotiable Rules

- `tsc --noEmit` + `strict: true` — branded types on all domain IDs
- 10K concurrent booking correctness test in CI — exactly 0 double-bookings
- Saga compensation verified — Stripe failure releases seat, notifies user
- `pipeline()` for stream processing — never `.pipe()`
- Zod schema on every API route
- OTel span covers full saga: acquire lock → claim seat → charge → confirm
- Stripe webhook signature verified with `timingSafeEqual`

---

## 9. Benchmarks

| Metric | Target |
|---|---|
| 10K concurrent bookings — double-booking count | 0 |
| Seat claim p99 (Redis lock + DB write) | < 50ms |
| Booking saga end-to-end p99 | < 2s |
| SSE seat update delivery latency | < 100ms |
| Waitlist promotion time (cancel → offer) | < 500ms |
