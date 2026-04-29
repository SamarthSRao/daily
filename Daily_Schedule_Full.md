# Daily Schedule — 9-Month Plan
## Updated for New Language Split: 3 TypeScript-Heavy · 2 Go-Heavy Projects + 8 Building Blocks

---

## Daily Rhythm (Every Weekday)

| Block | Duration | Activity |
|---|---|---|
| **Morning** | 2 hours | Learn the concept. Run code. Break it. Read source code — not docs. Concept introduced because a project needs it. GitHub Copilot open — use it, explain every accepted suggestion. |
| **Evening** | 2 hours | Build the named feature of the named project. Must use ≥ 3 technologies together. Always "BookWise needs X" or "DungBeetle needs X" or "OpenTrace needs X" — each project drives its own features. Never a tutorial. |
| **DSA** | 30 min | 1 problem. Always connects to what you built. LRU = Redis eviction. Bloom Filter = URL crawler dedup. Consistent Hash = job routing. |
| **RFC/ADR** | 30 min | Write a short RFC or ADR for a decision you made. Do this every day. Senior engineers write constantly. |
| **Saturday** | 5 hours | Weekend capstone: wire the week's features into the flagship project. Deploy. Benchmark with k6. Push biweekly project milestone. |
| **Sunday** | 3 hours | Document: README + ADR update, benchmark numbers, LinkedIn/X post, Loom walkthrough. CI must be green. |

**AI workflow (from Day 1):**
- GitHub Copilot always open — every suggestion you accept, you must explain
- Month 2+: Claude drafts your first RFC — you rewrite it entirely in your own reasoning
- Month 4+: TestSprite generates E2E tests — review and fix every single one
- Month 6+: You build AI features (Vercel AI SDK + tool use) — not just consume AI, build with it

---

# MONTH 1 — Fundamentals + OS + Computer Networks + JavaScript Engine
### Backend 2026 Roadmap: Blocks 1 + 2 · OpenTrace: Scaffold + Protocol Study

> **What you build this month for OpenTrace:** The monorepo scaffold, proto definitions for OTLP, a raw gRPC echo server (Go) that receives spans and logs them — nothing stored yet. You study the actual Jaeger source code and OTLP spec this month. You understand the protocol before you implement it.
>
> **Language focus this month:** TypeScript/Node.js primary for learning (event loop, HTTP model). Go for raw echo servers and vault biweekly. The 3 TypeScript projects (BookWise, RouteMaster, DungBeetle) and 2 Go projects (PayCore, DungBeetle-Go-in-Month-3) all get their own repos with raw HTTP server shells.
>
> **Biweekly Project 1 — `vault` (Go):** WAL-Backed KV Store starts this month. Runs on weekends in parallel.
>
> **By end of Month 1:** OpenTrace monorepo with proto-generated code. A gRPC server receives a span and prints it. Jaeger collector source code read and notes written. All 4 other projects have their own GitHub repos with a raw HTTP server, `README.md` stub, and `BENCHMARKS.md` placeholder.

---

## Week 1 — How the Web Works: HTTP, DNS, Client/Server, Browsers

---

### Monday — Week 1 · HTTP/HTTPS Model + Dev Environment

| | |
|---|---|
| 🛠 **Technologies** | Node.js 22 LTS, VS Code, pnpm, `curl`, `dig`, `openssl` |
| 📖 **Concepts** | HTTP methods, status codes, request/response headers, HTTP/2 multiplexing, TLS handshake |
| 🎯 **You Build** | Dev environment configured. `curl -v` dissection of 5 real sites documented. Domains registered on Cloudflare for all 5 projects. |

**Morning — HTTP from First Principles**

Run `curl -v https://google.com` and observe: TCP handshake → TLS handshake → HTTP request → HTTP response. HTTP status code families: 2xx (success), 3xx (redirect), 4xx (client error), 5xx (server error). HTTP/2 multiplexes multiple requests over a single TCP connection, solving HTTP/1.1 head-of-line blocking.

**VS Code Setup:** ESLint, Prettier, Error Lens, GitLens, Thunder Client. Format-on-save. pnpm workspaces for TypeScript projects with `packages/types`, `packages/schemas`, `packages/utils`. Go workspace (`go.work`) for Go projects.

**DSA — Big O Notation:** O(1), O(log N), O(N), O(N log N), O(N²). Connect: HTTP header lookup is O(1) (hash map). DNS recursive resolution is O(depth of tree). Sorting HTTP logs is O(N log N).

---

### Tuesday — Week 1 · Client/Server Concepts + REST Design

| | |
|---|---|
| 🛠 **Technologies** | Node.js `http` stdlib (TS projects), Go `net/http` (Go projects), `curl`, `httpie` |
| 📖 **Concepts** | Stateless vs stateful, REST resource design, idempotency (GET/PUT/DELETE vs POST), request/response lifecycle |
| 🎯 **You Build** | All 5 projects: raw HTTP server shells. RouteMaster: `POST /orders`. BookWise: `POST /bookings`. DungBeetle: `POST /jobs` (Node.js). PayCore: `POST /payments` (Go). OpenTrace: gRPC echo scaffold. |

**RouteMaster + BookWise + DungBeetle (TypeScript):** `http.createServer`, no framework yet. Parse `Content-Type`, return JSON. Handle malformed requests gracefully — `400 Bad Request` with a body, not a crash.

**PayCore (Go):**
```go
http.HandleFunc("/payments", func(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
        return
    }
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
})
```

**Idempotency rule:** GET, PUT, DELETE are idempotent. POST is not. Every BookWise `POST /bookings` and PayCore `POST /payments` accepts an `Idempotency-Key` header from Day 1 — even before the implementation stores it.

---

### Wednesday — Week 1 · DNS — From Browser to IP

| | |
|---|---|
| 🛠 **Technologies** | `dig`, `nslookup`, Cloudflare DNS, Wireshark |
| 📖 **Concepts** | DNS record types (A, CNAME, MX, TXT, NS, PTR), TTL, recursive vs iterative resolution, CDN DNS routing |
| 🎯 **You Build** | Register domains for all 5 projects on Cloudflare. Configure A and CNAME records. Set TTLs correctly. |

Run `dig +trace google.com`. Follow: browser cache → OS cache → recursive resolver → root servers → TLD servers → authoritative nameservers.

**TTL rule:** lower TTL 48 hours before any planned migration, raise it back after. This is why the `resolver` building block (Biweekly 4) matters — you will build this resolution chain from UDP sockets.

---

### Thursday — Week 1 · How Websites Work — Browser Rendering Pipeline

| | |
|---|---|
| 🛠 **Technologies** | Chrome DevTools (Elements, Network, Performance, Lighthouse) |
| 📖 **Concepts** | HTML → DOM → CSSOM → Render Tree → Layout → Paint → Composite, critical render path, reflow vs repaint |
| 🎯 **You Build** | Profile OpenTrace UI landing page with Lighthouse. Profile BookWise landing page. Achieve 90+ on both before adding React. |

**Render pipeline:** CSS blocks rendering — browser must finish parsing all CSS before painting. Animating `transform` and `opacity` only triggers compositing — the cheapest GPU operation. This is why CSS animations using `transform` are smooth and `top/left` animations are janky.

**Applied to BookWise:** The seat map SVG must never cause reflow. Use `transform` for seat state transitions, not `top/left`. This matters at 10K concurrent users with live SSE updates.

---

### Friday — Week 1 · CLI + Shell Scripting

| | |
|---|---|
| 🛠 **Technologies** | Bash, `grep`, `sed`, `awk`, `find`, `top`, `htop`, `ps`, `kill`, `cron` |
| 📖 **Concepts** | File system hierarchy, pipes and redirection, process management, environment variables, cron jobs |
| 🎯 **You Build** | Deploy script for each project: stops old server, pulls new code, runs tests (`go test ./...` or `pnpm test`), starts new server, health checks. |

---

## Week 2 — HTML + CSS + TypeScript Foundation

---

### Monday — Week 2 · HTML + Accessibility

| | |
|---|---|
| 🛠 **Technologies** | HTML5, WAVE accessibility checker, Lighthouse |
| 📖 **Concepts** | Semantic HTML elements, ARIA attributes, forms, what the DOM actually is |
| 🎯 **You Build** | OpenTrace UI dashboard markup. BookWise seat map HTML skeleton. Both pass WAVE accessibility check before any CSS. |

---

### Tuesday — Week 2 · CSS Box Model + Cascade

| | |
|---|---|
| 🛠 **Technologies** | CSS3, Chrome DevTools Computed tab |
| 📖 **Concepts** | Box model, `box-sizing: border-box`, cascade algorithm, specificity, CSS custom properties |
| 🎯 **You Build** | OpenTrace layout styled with pure CSS. BookWise seat grid laid out with pure CSS Grid — no JS. |

**Critical rule:** Always add `*, *::before, *::after { box-sizing: border-box }`. Specificity scoring: inline style (1000) > ID (100) > class/attribute/pseudo-class (10) > element (1).

---

### Wednesday — Week 2 · Flexbox + Grid + Tailwind CSS

| | |
|---|---|
| 🛠 **Technologies** | CSS Flexbox, CSS Grid, Tailwind CSS, media queries |
| 📖 **Concepts** | Main axis vs cross axis, Grid template areas, auto-fill vs auto-fit, Tailwind utility-first model, `cn()`, `cva()` |
| 🎯 **You Build** | OpenTrace trace list: CSS Grid responsive layout. BookWise seat map grid: rows × columns laid out with CSS Grid, Tailwind applied. RouteMaster order tracker layout. |

---

### Thursday — Week 2 · Shadcn UI + Radix UI

| | |
|---|---|
| 🛠 **Technologies** | Shadcn UI, Radix UI, Tailwind |
| 📖 **Concepts** | Headless components, compound component pattern, accessibility built-in, owning your component source |
| 🎯 **You Build** | OpenTrace UI: DataTable for trace list, Dialog for trace detail, Command palette for search. BookWise: Dialog for booking confirmation. RouteMaster: DataTable for order list. |

---

### Friday — Week 2 · TypeScript Deep — Strict Mode + Branded Types

| | |
|---|---|
| 🛠 **Technologies** | TypeScript strict mode, `tsc --noEmit`, Zod |
| 📖 **Concepts** | Strict mode, generics, conditional types, branded types (`UserId ≠ DriverId`), `tsc --noEmit` in CI |
| 🎯 **You Build** | BookWise: `SeatId`, `BookingId`, `UserId`, `EventId` branded types — all domain IDs typed. RouteMaster: `OrderId`, `DriverId`, `ShipmentId`. PayCore: `AccountId`, `TransactionId` in TypeScript frontend. |

**Why branded types matter for BookWise:** `reserveSeat(seatId: SeatId, userId: UserId)` cannot be accidentally called as `reserveSeat(userId, seatId)` — TypeScript rejects it at compile time. This prevents a category of booking bugs where IDs are transposed.

```typescript
// BookWise types.ts — established from Week 2, used for 9 months
type SeatId    = string & { readonly __brand: 'SeatId' };
type BookingId = string & { readonly __brand: 'BookingId' };
type UserId    = string & { readonly __brand: 'UserId' };
type EventId   = string & { readonly __brand: 'EventId' };

// RouteMaster types.ts
type OrderId    = string & { readonly __brand: 'OrderId' };
type DriverId   = string & { readonly __brand: 'DriverId' };
type ShipmentId = string & { readonly __brand: 'ShipmentId' };
```

### Weekend Capstone — Week 2 · Web Fundamentals + `vault` Biweekly Project 1 Start

All 5 project landing pages: semantic HTML, Tailwind, Shadcn, Lighthouse 90+, deployed to Cloudflare Pages.

`vault` (Go) building block: WAL writer + `fsync` + CRC32 checksums + recovery on startup by end of weekend. Not complete yet — compaction + crash simulation test next weekend.

---

## Weeks 3–4 — JavaScript Engine: Types, Scope, Closures, Prototypes, Event Loop

*(Full coverage: closures, prototypes, event loop all 6 phases, async/await, generators, TypeScript strict mode, Zod, branded types.)*

**Applied to TypeScript projects this month:**
- **RouteMaster:** `packages/utils` — retry helper, exponential backoff, `ConcurrencyLimiter`. `packages/schemas` — Zod schemas for Order, Driver, Shipment. `packages/types` — all branded entity IDs.
- **BookWise:** `packages/utils` — seat availability check, booking state machine transitions. `packages/schemas` — Zod schemas for BookingRequest, PaymentWebhook. `packages/types` — SeatId, BookingId, UserId.
- **DungBeetle (Node.js monolith):** `packages/utils` — job queue utilities. No framework yet.

**Applied to Go projects:**
- **PayCore:** `internal/types` package — `Money` type wrapping `decimal.Decimal`. `go test -race ./...` from Day 1.
- **OpenTrace:** `packages/types` (TypeScript side) — TraceId, SpanId, ServiceName branded types for the UI.

### Weekend Capstone — Weeks 3–4 · All 5 Platform Shells + `vault` Complete

All 5 platforms have working raw HTTP servers with typed request/response handling. `vault` Go building block: WAL writer, recovery, log compaction, crash simulation test passing, benchmark results in `BENCHMARKS.md`. `goleak.VerifyNone` passing.

---

# MONTH 2 — JavaScript Deep + Node.js + TypeScript Mastery
### OpenTrace: Collector v0.1 (Go)

> **What you build this month for OpenTrace:** The Collector (Go) — receives OTLP/gRPC and OTLP/HTTP, validates spans, publishes to Kafka. The TypeScript projects build their auth and webhook layers this month, deepening Node.js internals knowledge.
>
> **RFC this month:** "OpenTrace Collector Design — backpressure strategy, Kafka topic partitioning scheme, and validation failure handling." One page. Three options. Recommendation with tradeoffs.
>
> **Biweekly Project 2 — `pgpool` (Go):** TCP connection pool with pgwire protocol parsing. Runs on weekends.

---

## Weeks 5–6 — Node.js Internals + Streams

| | |
|---|---|
| 🛠 **Technologies** | Node.js 22 internals — V8 JIT, libuv, `AsyncLocalStorage`, `worker_threads`, streams, `crypto`, `clinic.js` |
| 📖 **Concepts** | V8 JIT pipeline (Ignition → TurboFan), hidden classes, generational GC, libuv event loop all 6 phases, streams with backpressure, `pipeline()`, `AsyncLocalStorage` |
| 🎯 **You Build** | RouteMaster: `AsyncLocalStorage` for trace context propagation. BookWise: HMAC webhook handler for Stripe. DungBeetle: `AsyncLocalStorage` for job execution context. |

**`AsyncLocalStorage` — applied across all 3 TypeScript projects:**
```typescript
// RouteMaster, BookWise, DungBeetle — same pattern
import { AsyncLocalStorage } from 'node:async_hooks';
const reqCtx = new AsyncLocalStorage<{ traceId: string; requestId: string }>();

app.use((req, _res, next) =>
  reqCtx.run({ traceId: req.headers['traceparent'] as string ?? randomUUID(), requestId: randomUUID() }, next)
);
// Now every log line, every DB query, every Kafka message in this request chain
// has the trace context — without passing it as a parameter to every function
```

**Node.js streams — applied to RouteMaster:**
```typescript
// Kafka consumer → status update → notification fan-out, all streamed
// 10K status events/sec without buffering all in memory
pipeline(
  kafkaReadStream(consumer, 'shipment.events', { highWaterMark: 100 }),
  new StatusUpdateTransform(),
  new NotificationFanoutTransform(),
  (err) => { if (err) logger.error({ err }, 'pipeline error') }
);
// pipeline() propagates errors — never use .pipe() which swallows them
```

**HMAC signing — applied across projects:**
- **BookWise:** verify Stripe `payment_intent.succeeded` webhook — `timingSafeEqual` comparison
- **DungBeetle:** sign outbound job completion webhooks to merchant callbacks
- **`herald` building block** (built in Month 6): uses same HMAC pattern for delivery receipts

---

## Weeks 7–8 — TypeScript Mastery + OpenTrace Collector v0.1

### OpenTrace Collector v0.1 (Go — Built This Month)

```go
// gRPC service definition from OTLP spec
service TraceService {
  rpc Export(ExportTraceServiceRequest) returns (ExportTraceServiceResponse) {}
}
// Implementation: grpc-go + sarama (Kafka) + protobuf
// Partition key = trace_id: all spans of one trace → same partition → ordering guaranteed
// Backpressure: Kafka slow → RESOURCE_EXHAUSTED → instrumented app queues locally
```

**Components built this month:**
- **OTLP/gRPC receiver** — validates spans (required fields, valid timestamps, trace ID format)
- **OTLP/HTTP receiver** — accepts Protobuf and JSON-encoded OTLP
- **Kafka producer** — `spans.raw` topic, partition key = `trace_id`
- **Backpressure** — `RESOURCE_EXHAUSTED` when Kafka is slow, documented in ADR-003

**Benchmark this month:** Collector throughput at 1K, 10K, 100K spans/sec. Find the bottleneck (Kafka publish latency). Fix with batching. Document in `BENCHMARKS.md`.

### TypeScript Projects This Month

**RouteMaster:**
- Express 5 framework added
- JWT RS256 auth middleware (verifies public key from `switchboard` JWKS endpoint)
- `tsc --noEmit` added to CI — enforced from this month forward
- Zod validation middleware on all routes

**BookWise:**
- Express 5 + Zod validation
- Stripe Checkout Session creation (`POST /bookings` initiates payment flow)
- HMAC webhook handler for `payment_intent.succeeded`
- Discriminated union `BookingState` type defined — all state transitions at compile time

**DungBeetle (still Node.js monolith):**
- HMAC-signed webhook delivery for job completion callbacks
- PostgreSQL queue added: `SELECT FOR UPDATE SKIP LOCKED` replaces in-memory array
- This is the Node.js version the Month 3 Go migration RFC will benchmark against

**PayCore (Go):**
- JWT RS256 auth middleware in Go
- gRPC `LedgerService` proto defined, stub server started
- `sqlc` introduced — all DB queries generated, zero `interface{}` in DB layer

### Weekend Capstone — Month 2 · OpenTrace Collector + `pgpool` Complete

OpenTrace Collector deployed, load tested, synthetic OTLP spans flowing into Kafka. `pgpool` Go building block: pgwire startup parsing, transaction mode, benchmark showing 10 backend connections serving 1000 clients. ADR written: "Why PgBouncer transaction mode over session mode."

---

# MONTH 3 — Go Mastery
### OpenTrace: Pipeline Processor (Go)

> **Go is the primary language for PayCore and DungBeetle from this month onward.** DungBeetle migrates from Node.js monolith to Go. One full month on the Go language before any project uses it in production.
>
> **RFC this month:** "DungBeetle v0.1 → Go Rewrite — Why Go over Node.js for the job worker." Covers: goroutine-per-job model, `go test -race`, `goleak`, benchmark numbers before/after. Node.js branch kept for comparison.
>
> **Biweekly Project 3 — `relay` (Go):** Clustered WebSocket server with Redis pub/sub fan-out. Runs on weekends.

---

## Weeks 7–10 — Go Language Core + Concurrency + Stdlib

*(Full Go coverage: zero values, implicit interfaces, error wrapping `%w`, `defer`, goroutines (M:N scheduler, work stealing, 2KB stacks), channels (all patterns: pipeline/fan-out/fan-in/semaphore), `sync.RWMutex/Pool/Once`, `errgroup`, `singleflight`, `atomic`, `context`, `sqlc`, `chi`, `cobra`, `slog`, `pprof`, `go test -race`, `goleak`, `golangci-lint`, generics.)*

### OpenTrace Pipeline Processor (Go — Built This Month)

```go
func (p *Processor) Run(ctx context.Context) error {
    for msg := range p.consumer.Messages() {
        spans := p.deserialize(msg)
        spans = p.enrich(spans)
        if p.sampler.ShouldKeep(spans) {
            p.buffer.Add(spans)  // buffer for bulk insert
        }
        p.consumer.MarkOffset(msg)
    }
    return nil
}
// Tail-based sampling: 100% errors + slow spans (> 500ms), 5% normal traces
// ClickHouse bulk insert: batch 10K spans — 100x throughput vs single-row insert
```

### DungBeetle (Go) — Migration This Month

```go
// v1.0 — goroutine-per-job worker pool
type WorkerPool struct {
    sem chan struct{}  // semaphore: max 100 concurrent jobs
    wg  sync.WaitGroup
}

func (p *WorkerPool) Dispatch(ctx context.Context, job Job) {
    p.sem <- struct{}{}  // acquire (blocks if pool full)
    p.wg.Add(1)
    go func() {
        defer func() { <-p.sem; p.wg.Done() }()
        if err := executeJob(ctx, job); err != nil {
            p.handleFailure(ctx, job, err)
        }
    }()
}
```

**Migration RFC benchmarks documented in `BENCHMARKS.md`:**
- Node.js v0.1 monolith: ~8,000 jobs/min (event loop blocks on CPU-bound tasks)
- Go v1.0 worker pool: ~50,000 jobs/min (goroutine-per-job, `GOMAXPROCS` = CPU count)

### TypeScript Projects This Month

**RouteMaster (TypeScript):**
- Kafka `kafkajs` consumer: `shipment.events` topic
- Node.js streams pipeline: `KafkaReadStream → StatusTransform → NotifierTransform`
- `pipeline()` enforced everywhere — lint rule added to ESLint config

**BookWise (TypeScript):**
- Kafka `kafkajs` consumer: `booking.events` topic
- Waitlist Kafka consumer stub (full implementation in Month 7)
- TypeScript discriminated union state machine tested with Vitest

**PayCore (Go):**
- `go test -race ./...` enforced in CI from this month
- `goleak.VerifyNone(t)` in every `*_test.go`
- gRPC `LedgerService`: double-entry bookkeeping over gRPC, `sqlc`-generated queries

### Weekend Capstone — Month 3 · Pipeline Processor + `relay` Complete

`go test -race ./...` passes everywhere. `goleak.VerifyNone` passes everywhere. Collector → Kafka → Processor → ClickHouse pipeline end-to-end verified. DungBeetle v1.0 Go job queue running in its own repo. `relay` building block: Redis pub/sub fan-out, 5000 concurrent WS connections, p99 < 10ms cross-node delivery.

---

# MONTH 4 — React + Frameworks + Testing + Dev Tools
### OpenTrace: UI v0.1 (TypeScript/Next.js)

> **What you build this month:** OpenTrace UI v0.1 — trace list, trace detail, D3.js waterfall. All 5 projects get Next.js frontends. All TypeScript projects get Vitest + Playwright. All Go projects get `testcontainers-go`.
>
> **Biweekly Projects 4–5:** `resolver` DNS (Weeks 7–8) and `herald` Notification Service (Weeks 9–10).

---

## Weeks 11–14 — React + Next.js + Testing

*(Full coverage: all React hooks, reconciliation, `React.memo`, Tanstack Query optimistic updates + rollback, `staleTime`/`gcTime`, Zustand selective subscription, Next.js 15 App Router + Server Components + ISR + streaming Suspense + Server Actions, Vitest, `@testing-library/react`, Playwright E2E, TestSprite, `testcontainers-go`.)*

### OpenTrace UI v0.1 (TypeScript — Built This Month)

**D3.js Trace Waterfall — virtualised for 10K+ spans:**
```typescript
// Virtualised rendering: only DOM nodes for spans visible in viewport
const WaterfallChart = ({ spans, traceStart, totalDuration }: Props) => {
  const rowHeight = 24;
  const [scrollY, setScrollY] = useState(0);
  const visibleStart = Math.floor(scrollY / rowHeight);
  const visibleEnd   = visibleStart + Math.ceil(containerHeight / rowHeight);

  return (
    <div style={{ overflowY: 'auto', height: containerHeight }}
         onScroll={e => setScrollY(e.currentTarget.scrollTop)}>
      <div style={{ height: spans.length * rowHeight, position: 'relative' }}>
        {spans.slice(visibleStart, visibleEnd).map(span => (
          <SpanBar key={span.spanId}
            style={{
              left:  `${((span.startTime - traceStart) / totalDuration) * 100}%`,
              width: `${(span.durationUs / totalDuration / 10) * 100}%`,
              top:   span.depth * rowHeight,
            }} />
        ))}
      </div>
    </div>
  );
};
```

**Server Components for OpenTrace UI:** Trace list renders on server — zero JS bundle for initial list. Clicking a trace streams the waterfall via Next.js streaming Suspense as spans arrive from the Query Service.

### BookWise Frontend (TypeScript — Built This Month)

**Live seat map with optimistic booking + SSE updates:**
```typescript
// Optimistic: mark seat as HOLDING immediately, rollback if booking fails
const { mutate: bookSeat } = useMutation({
  mutationFn: (seatId: SeatId) => api.post('/bookings', { seatId }),
  onMutate: async (seatId) => {
    await queryClient.cancelQueries(['seats', eventId]);
    const prev = queryClient.getQueryData<Seat[]>(['seats', eventId]);
    queryClient.setQueryData(['seats', eventId], (old: Seat[]) =>
      old.map(s => s.id === seatId ? { ...s, status: 'HOLDING' } : s)
    );
    return { prev };
  },
  onError: (_err, _id, ctx) => queryClient.setQueryData(['seats', eventId], ctx?.prev),
});

// SSE for live seat availability — auto-reconnect with Last-Event-ID
useEffect(() => {
  const es = new EventSource(`/events/${eventId}/seats/stream`);
  es.addEventListener('seat_update', (e) => {
    const update = JSON.parse(e.data) as SeatUpdate;
    queryClient.setQueryData(['seats', eventId], (old: Seat[]) =>
      old.map(s => s.id === update.seatId ? { ...s, status: update.status } : s)
    );
  });
  return () => es.close();
}, [eventId]);
```

### RouteMaster Frontend (TypeScript — Built This Month)

- Next.js 15 order tracker with Tanstack Query
- SSE live order status with `Last-Event-ID` reconnect
- Elasticsearch search UI with faceted filters (carrier, status, date range)
- Playwright E2E: create order → assign driver → deliver flow

### Go Projects Frontends (TypeScript — Built This Month)

**PayCore:** Next.js transaction dashboard — account balance, ledger entries, payment history. Reads from Go gRPC backend via REST API Gateway.

**DungBeetle:** Next.js job dashboard — job list (Shadcn DataTable), DLQ viewer, live job status via `relay` WebSocket. AI copilot UI stub (`useChat` component — full implementation Month 8).

### Testing Strategy This Month

**TypeScript projects (BookWise, RouteMaster, herald):**
- Vitest: 80%+ coverage on all business logic
- Supertest: HTTP integration tests
- `@testing-library/react`: component tests for seat map, waterfall
- Playwright E2E: full user journey tests in CI

**Go projects (PayCore, DungBeetle):**
- `testcontainers-go`: real PostgreSQL + Redis + Kafka in every integration test
- Table-driven tests for all business logic
- `go test -race ./...` and `goleak.VerifyNone(t)` pass

### Weekend Capstone — Month 4 · All 5 Platforms Full-Stack + `resolver` + `herald`

All 5 projects: Next.js/React frontends, full backends, PostgreSQL + Redis, JWT auth, full test suites — each in its own repo with its own CI. OpenTrace UI v0.1: waterfall renders real spans. `resolver` building block: cold/warm cache DNS benchmark. `herald` building block: multi-channel delivery, outbox, idempotency, HMAC webhooks — consumed independently by RouteMaster and PayCore.

---

# MONTH 5 — DBMS Deep Internals + Caching Architecture + System Design Part 1
### Backend 2026 Roadmap: Block 4 — THE Most Important Month
### OpenTrace: Storage Layer (Go/ClickHouse)

> **This is the most important month.** The Backend 2026 roadmap is explicit: databases are a massive block. You don't learn PostgreSQL by reading the docs. You learn it by running `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)` on 50 queries, watching seq scans appear and disappear as you add indexes, and intentionally triggering dirty reads and phantom reads in live transactions.
>
> **Biweekly Projects 6–7:** `gatekeeper` OTP Gateway — TypeScript (Weeks 11–12) and `lsm` Storage Engine — Go (Weeks 13–14). Both deepen database internals understanding from different angles.
>
> **The sequence matters:** Isolation levels before Kafka (understand distributed transactions before designing Sagas). MVCC before sharding. Query planner before read replicas.

---

## Week 13 — Relational Databases Deep + PostgreSQL Mastery

---

### Monday — Week 13 · ACID + Transactions + All 4 Isolation Levels with Live Anomaly Demos

| | |
|---|---|
| 🛠 **Technologies** | PostgreSQL, `psql`, two terminal windows for concurrent transactions |
| 📖 **Concepts** | ACID properties, all 4 isolation levels demonstrated live, `SELECT FOR UPDATE`, `ON CONFLICT DO UPDATE` (upsert) |
| 🎯 **You Build** | PayCore (Go): double-entry ledger — every financial movement creates two journal entries in a single `pgx` transaction. BookWise (TypeScript): Prisma `$transaction()` for atomic seat claim. |

**The 4 Isolation Levels — live anomaly scripts in `scripts/isolation-level-demos/`:**

| Level | Dirty Read | Non-Repeatable Read | Phantom Read |
|---|---|---|---|
| Read Uncommitted | ✓ possible | ✓ possible | ✓ possible |
| Read Committed (PG default) | ✗ prevented | ✓ possible | ✓ possible |
| Repeatable Read | ✗ prevented | ✗ prevented | ✓ possible |
| Serializable | ✗ prevented | ✗ prevented | ✗ prevented |

```sql
-- NON-REPEATABLE READ demo (PayCore — Read Committed level)
-- TERMINAL 1: BEGIN; SELECT balance FROM accounts WHERE id = 1; (gets 1000)
-- TERMINAL 2: BEGIN; UPDATE accounts SET balance = 500 WHERE id = 1; COMMIT;
-- TERMINAL 1: SELECT balance FROM accounts WHERE id = 1; (gets 500 — changed mid-transaction!)
-- TERMINAL 1: COMMIT;

-- PHANTOM READ demo (BookWise — Repeatable Read level)
-- TERMINAL 1: BEGIN ISOLATION LEVEL REPEATABLE READ;
--             SELECT COUNT(*) FROM seats WHERE status = 'AVAILABLE'; (gets 100)
-- TERMINAL 2: INSERT INTO seats (status) VALUES ('AVAILABLE'); COMMIT;
-- TERMINAL 1: SELECT COUNT(*) FROM seats WHERE status = 'AVAILABLE'; (still 100 — phantom prevented in PG)
```

Write the anomaly demonstration scripts and push to `scripts/isolation-level-demos/` in PayCore and BookWise repos. This is the most valuable database education artifact you will produce.

**Applied to Go projects (PayCore, DungBeetle):** Use `pgx.TxOptions{IsoLevel: pgx.Serializable}` for double-entry ledger writes. Use `pgx.ReadCommitted` for read-heavy analytics queries.

**Applied to TypeScript projects (BookWise, RouteMaster):** Use Prisma's `prisma.$transaction()` with explicit isolation level options for critical paths.

---

### Tuesday — Week 13 · PostgreSQL Internals: MVCC + WAL + All Index Types

| | |
|---|---|
| 🛠 **Technologies** | PostgreSQL, `pg_stat_activity`, `pg_locks`, WAL settings, `pgstattuple` |
| 📖 **Concepts** | MVCC — tuple versions, `xmin`/`xmax`, vacuum, table bloat; WAL segments, checkpoints, WAL archiving; all index types |
| 🎯 **You Build** | All 5 platform schemas with proper indexes. `EXPLAIN ANALYZE` on every endpoint — zero seq scans on tables > 10K rows. `pg_stat_statements` enabled on all PostgreSQL instances. |

```sql
-- MVCC — see tuple headers directly
SELECT ctid, xmin, xmax, * FROM bookings LIMIT 5;
-- ctid: physical location (page, offset)
-- xmin: transaction that created this tuple
-- xmax: transaction that deleted/updated this tuple (0 = current)
-- After UPDATE: old tuple marked with xmax, new tuple gets new xmin
-- VACUUM reclaims dead tuples

-- Measure table bloat (important for BookWise under high booking churn)
SELECT tablename,
       round(n_dead_tup::numeric / nullif(n_live_tup + n_dead_tup, 0) * 100, 2) AS bloat_pct
FROM pg_stat_user_tables ORDER BY n_dead_tup DESC;
```

**Connection to `vault` building block:** The WAL you built in Biweekly Project 1 is exactly what PostgreSQL does internally. The fsync, the CRC32 checksum, the replay on startup — all the same mechanism.

**All PostgreSQL index types with correct use cases:**
```sql
-- B-tree: =, <, >, BETWEEN, ORDER BY — default for everything
CREATE INDEX ON payments (account_id);

-- Partial: only index rows matching condition — BookWise error spans index
CREATE INDEX ON bookings (seat_id) WHERE status = 'FAILED';

-- Covering: satisfy query from index alone, no heap fetch — PayCore hot path
CREATE INDEX ON payments (account_id, created_at) INCLUDE (amount, status);

-- Composite: column order matters — leftmost prefix rule
-- Good: WHERE account_id = X AND created_at > Y
-- Bad:  WHERE created_at > Y  (can't use this index efficiently without account_id)

-- GIN: JSONB, arrays — RouteMaster shipment metadata search
CREATE INDEX ON shipments USING GIN (metadata);

-- BRIN: append-only time-series, 1000x smaller than B-tree
CREATE INDEX ON gps_pings USING BRIN (recorded_at);
```

---

### Wednesday — Week 13 · Query Planner + `EXPLAIN ANALYZE` Mastery

| | |
|---|---|
| 🛠 **Technologies** | `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)`, `auto_explain`, `pg_stat_statements` |
| 📖 **Concepts** | Seq scan vs index scan vs bitmap scan vs index-only scan, join strategies, planner statistics, `auto_explain` for production slow query logging |
| 🎯 **You Build** | Fix 5 slow queries across all projects. Before/after `EXPLAIN ANALYZE` documented. Zero seq scans on tables > 10K rows. |

```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT b.id, b.seat_id, u.email, e.name
FROM bookings b
JOIN users u ON b.user_id = u.id
JOIN events e ON b.event_id = e.id
WHERE b.status = 'CONFIRMED'
  AND b.created_at > NOW() - INTERVAL '24 hours'
ORDER BY b.created_at DESC
LIMIT 50;
```

**Key fields to read:**
- `Seq Scan` on a large table → missing index. Add it.
- `Rows Removed by Filter` → many rows scanned, few returned. Index on filter column.
- `Shared Hit Blocks` → buffer pool (fast). `Shared Read Blocks` → disk (slow).
- `Actual Loops` in nested loop → high = inner side scanned repeatedly. Switch to hash join.
- `Actual Time` per node → where is the time spent?

**`auto_explain` — catch slow queries in production without connecting to the DB:**
```sql
-- postgresql.conf
shared_preload_libraries = 'auto_explain'
auto_explain.log_min_duration = '100ms'
auto_explain.log_analyze = true
auto_explain.log_buffers = true
```

**Applied to TypeScript projects (BookWise, RouteMaster):** Prisma doesn't expose `EXPLAIN ANALYZE` directly. Use `prisma.$queryRaw` for slow query analysis: `SELECT * FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 10`.

---

### Thursday — Week 13 · Scaling PostgreSQL — Read Replicas + `pgpool`

| | |
|---|---|
| 🛠 **Technologies** | PostgreSQL streaming replication, `pgpool` building block, `pg_stat_replication` |
| 📖 **Concepts** | Streaming replication, replication lag monitoring, connection pool sizing formula, WAL archiving for PITR |
| 🎯 **You Build** | All 5 projects: point `DATABASE_URL` at `pgpool:5433` instead of PostgreSQL directly. Read replica configured for PayCore analytics queries. |

**`pgpool` integration — same config for Go and TypeScript projects:**
```yaml
# docker-compose.yml — identical pattern for all 5 projects
pgpool:
  image: yourname/pgpool:latest
  environment:
    PGPOOL_BACKEND: postgres:5432
    PGPOOL_SIZE: 9        # (4 CPUs × 2) + 1 spindle
    PGPOOL_MODE: transaction
  ports: ["5433:5433"]

paycore-api:     # Go project
  environment:
    DATABASE_URL: postgres://user:pass@pgpool:5433/paycore

bookwise-api:    # TypeScript project
  environment:
    DATABASE_URL: postgres://user:pass@pgpool:5433/bookwise
```

**Connection to `pgpool` building block:** You built pgwire protocol parsing in Biweekly Project 2. Today you see why it exists — without pgpool, 10K concurrent BookWise booking goroutines/async handlers would spawn 10K PostgreSQL processes.

**Replication lag monitoring:**
```sql
SELECT client_addr, state, (sent_lsn - replay_lsn) AS lag_bytes
FROM pg_stat_replication;
-- Alert when lag > 10MB
```

---

### Friday — Week 13 · Sharding + Partitioning

| | |
|---|---|
| 🛠 **Technologies** | PostgreSQL partitioning, ClickHouse partitioning, consistent hash router (Go) |
| 📖 **Concepts** | Range vs hash vs list partitioning, partition pruning, consistent hashing for horizontal sharding |
| 🎯 **You Build** | OpenTrace: ClickHouse partition pruning verified. PayCore: `payment_events` partitioned by month. RouteMaster: `shipments` partitioned by `created_at`. |

```sql
-- PayCore: range partitioning for payment_events
CREATE TABLE payment_events (
    id UUID, aggregate_id UUID, type TEXT,
    payload JSONB, sequence INT, created_at TIMESTAMPTZ
) PARTITION BY RANGE (created_at);

CREATE TABLE payment_events_2026_01 PARTITION OF payment_events
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
-- New partitions created monthly by DungBeetle cron job
```

```sql
-- OpenTrace: verify partition pruning is working
EXPLAIN SELECT trace_id, duration_us FROM spans
WHERE service_name = 'bookwise' AND start_time > now() - INTERVAL 24 HOUR;
-- Look for: Selected 1/7 parts — partition pruning is working
```

---

## Week 14 — Caching Architecture

*(Full coverage: cache-aside, read-through, write-through, write-behind, cache stampede, thundering herd, TTL jitter, Redis all data structures with correct use cases, Lua scripts for atomicity, `Cache-Control` headers.)*

**Cache-aside applied to TypeScript projects:**
```typescript
// BookWise: cache event seat availability — Redis + TTL jitter
async function getSeats(eventId: EventId): Promise<Seat[]> {
  const key = `seats:${eventId}`;
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const seats = await prisma.seat.findMany({ where: { eventId } });
  // TTL jitter: 300s ± 30s — prevents thundering herd when multiple users
  // open the same event simultaneously
  const ttl = 300 + Math.floor(Math.random() * 60 - 30);
  await redis.setex(key, ttl, JSON.stringify(seats));
  return seats;
}
```

**`singleflight` in Go (prevents thundering herd):**
```go
// PayCore: deduplicate concurrent balance requests for the same account
result, err, _ := sf.Do("balance:"+accountID, func() (interface{}, error) {
    return db.GetBalance(ctx, accountID)
})
// Only one DB call made even if 100 goroutines request the same balance simultaneously
```

**Applied to OpenTrace:** Query Service caches frequently-requested traces in Redis. Cache key: `trace:{traceId}`. TTL jitter: 5min ± 30s. Invalidation: when a new span arrives for a cached trace, DEL the key.

---

## Week 15 — Kafka Essentials + System Design

### Kafka — Applied Differently in TypeScript vs Go Projects

**TypeScript projects use `kafkajs`:**
```typescript
// RouteMaster: consume shipment events with kafkajs
const consumer = kafka.consumer({ groupId: 'routemaster-status-updater' });
await consumer.connect();
await consumer.subscribe({ topic: 'shipment.events', fromBeginning: false });

await consumer.run({
  eachMessage: async ({ message }) => {
    const event = JSON.parse(message.value!.toString()) as ShipmentEvent;
    await updateShipmentStatus(event);  // TypeScript async/await, no goroutines
    await herald.notify(event.recipientId, 'shipment_update', event);
  }
});
```

**Go projects use `sarama`:**
```go
// PayCore: consume payment events with sarama
func (c *Consumer) Run(ctx context.Context) error {
    handler := sarama.NewConsumerGroupHandler(func(msg *sarama.ConsumerMessage) error {
        var event PaymentEvent
        if err := proto.Unmarshal(msg.Value, &event); err != nil { return err }
        return c.processPayment(ctx, event)
    })
    return c.group.Consume(ctx, []string{"payments.events"}, handler)
}
```

**Outbox pattern — TypeScript (BookWise) and Go (PayCore) use same concept, different syntax:**
```typescript
// BookWise: TypeScript Prisma transaction with outbox
await prisma.$transaction([
  prisma.booking.update({ where: { id }, data: { status: 'CONFIRMED' } }),
  prisma.outbox.create({ data: { topic: 'booking.confirmed', payload: { id, userId } } }),
]);
```
```go
// PayCore: Go pgx transaction with outbox
tx.Exec(ctx, "UPDATE payments SET status=$1 WHERE id=$2", "confirmed", id)
tx.Exec(ctx, "INSERT INTO outbox (topic,payload) VALUES ($1,$2)", "payments.confirmed", payload)
tx.Commit(ctx)
```

### System Design: URL Shortener + API Rate Limiter

*(Coverage: URL shortener with base62 encoding, redirect cache, analytics counters; rate limiter with token bucket, sliding window log, Redis Lua atomic implementation.)*

**`switchboard` building block** (built in Month 8) will implement the production rate limiter. This week: implement rate limiting directly in RouteMaster and BookWise as the learning exercise.

```typescript
// BookWise: sliding window rate limiter via Redis Lua (TypeScript)
const slidingWindowLua = `
  local key = KEYS[1]
  local now = tonumber(ARGV[1])
  redis.call('ZREMRANGEBYSCORE', key, 0, now - 60000)
  if tonumber(redis.call('ZCARD', key)) < tonumber(ARGV[2]) then
    redis.call('ZADD', key, now, now .. math.random())
    redis.call('EXPIRE', key, 60)
    return 1
  end
  return 0
`;
const allowed = await redis.eval(slidingWindowLua, 1, `rl:${userId}:bookings`, Date.now(), 10);
```

### Weekend Capstone — Month 5 · All Database Patterns + `gatekeeper` + `lsm`

All 5 projects: correct index strategy, EXPLAIN ANALYZE zero seq scans, pgpool in transaction mode, outbox pattern verified. ClickHouse partition pruning verified in OpenTrace. `gatekeeper` TypeScript building block complete: `crypto.randomInt`, SHA256 hash, `timingSafeEqual`, Redis TTL OTP, multi-tenant namespacing. `lsm` Go building block: MemTable + SSTable + Bloom filter + compaction — 1M write benchmark in BENCHMARKS.md.

---

# MONTH 6 — Infrastructure + Real-Time + Resiliency + System Design Part 2
### OpenTrace: Query Service (Go) + API Gateway (TypeScript)

> **Full observability stack this month.** OpenTrace instruments itself. Every other project instruments itself independently using OTel SDKs pointing at their own Jaeger instances.
>
> **Biweekly Building Blocks this month:** `switchboard` TypeScript API Gateway (Weeks 15–16). All TypeScript projects (BookWise, RouteMaster, OpenTrace API Gateway) go behind `switchboard` this month.

---

## Weeks 16–17 — Docker + K8s + Terraform + GitHub Actions + gRPC + Observability

*(Full coverage: Docker multi-stage builds, non-root user, `trivy` CVE scan, Kubernetes Pod/Deployment/Service/Ingress/HPA, Terraform HCL + state + modules, GitHub Actions CI, S3 presigned URLs + multipart upload, Cloudflare Workers, gRPC + Protocol Buffers, circuit breaker pattern, OTel distributed tracing + Prometheus + structured logs.)*

### OpenTrace Query Service (Go) + API Gateway (TypeScript)

**Query Service gRPC (Go):**
```go
service QueryService {
  rpc FindTraces(FindTracesRequest) returns (stream Trace) {}
  rpc GetTrace(GetTraceRequest) returns (Trace) {}
  rpc GetDependencies(GetDependenciesRequest) returns (DependencyGraph) {}
}
// GetDependencies: JOIN spans to spans on parent_span_id, GROUP BY service pairs
// Result: directed graph of all service-to-service calls in the system
```

**API Gateway (TypeScript) — translates REST to gRPC:**
```typescript
app.get('/api/traces', auth, validate(FindTracesSchema), async (req, res) => {
  const params = req.query as z.infer<typeof FindTracesSchema>;
  const traces: Trace[] = [];
  const stream = queryClient.FindTraces({ ...params });
  for await (const trace of stream) { traces.push(traceFromProto(trace)); }
  res.json({ traces });
});
// OTel auto-instrumentation: this TypeScript gateway's requests appear in OpenTrace's own traces
```

### `switchboard` Building Block Integrated This Month

All external traffic to BookWise and RouteMaster now goes through `switchboard`:
- JWT RS256 verification via JWKS endpoint (public key, no shared secret)
- Sliding window rate limiting per client per route (Redis Lua)
- Circuit breaker per upstream service
- SSE passthrough for BookWise seat updates and RouteMaster tracking
- `traceparent` header injection on every proxied request

### OTel Auto-Instrumentation — Different SDKs, Same Protocol

**TypeScript projects (BookWise, RouteMaster, OpenTrace API Gateway):**
```typescript
// Auto-instrumentation: import before anything else
import './tracing';  // wraps Express, Prisma, ioredis, kafkajs automatically
// tracing.ts:
const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({ url: process.env.OTEL_ENDPOINT }),
  instrumentations: [getNodeAutoInstrumentations()],
});
sdk.start();
```

**Go projects (PayCore, DungBeetle, OpenTrace components):**
```go
// Auto-instrumentation: wrap HTTP handler and database client
import "go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
handler := otelhttp.NewHandler(mux, "paycore-api")
// Wraps every route with span creation, propagates W3C traceparent
```

**All projects emit to their own separate Jaeger instance.** OpenTrace emits to itself — the self-referential demo.

### Full-Stack Observability (All 5 Projects)

**Prometheus metrics — RED method for every service:**
```go
// PayCore (Go): histogram for payment latency
paymentDuration := prometheus.NewHistogramVec(
    prometheus.HistogramOpts{Name: "payment_duration_seconds", Buckets: prometheus.DefBuckets},
    []string{"status"},
)
```
```typescript
// BookWise (TypeScript): counter for booking attempts
const bookingAttempts = new Counter({
  name: 'booking_attempts_total',
  help: 'Total booking attempts',
  labelNames: ['status'],
});
```

**Structured logs with `trace_id`:**
```go
// Go: slog JSON with trace_id
slog.InfoContext(ctx, "payment processed", "trace_id", span.SpanContext().TraceID().String())
```
```typescript
// TypeScript: pino with trace_id from AsyncLocalStorage
logger.info({ trace_id: reqCtx.getStore()?.traceId }, 'booking confirmed');
```

### PITR Drill — PayCore and RouteMaster

```bash
# Executed this month on both projects
# 1. Drop the table (simulate data loss incident)
psql -c "DROP TABLE payments;"

# 2. Restore from PITR backup
aws rds restore-db-instance-to-point-in-time \
  --source-db-instance-identifier paycore-prod \
  --target-db-instance-identifier paycore-pitr \
  --restore-time 2026-06-01T12:00:00Z

# 3. Measure RTO — target: < 10 minutes
# 4. Write the runbook — stored in /runbooks/pitr.md
```

### Weekend Capstone — Month 6 · All Infrastructure Live + `switchboard` Complete

All 5 projects deployed to ECS Fargate — each from its own repo, own Terraform config, own CI pipeline. OpenTrace self-referential trace demo live. PITR drill complete on PayCore and RouteMaster. `switchboard` TypeScript building block integrated: BookWise and RouteMaster external traffic routed through it with JWT verification, rate limiting, circuit breaker.

---

# MONTH 7 — Distributed Systems Deep
### OpenTrace: UI v2 (TypeScript) + SDK (Go + TypeScript)

> **This is the distributed systems month.** Every building block converges here: vault (dedup), pgpool (connection management), relay (live tail), resolver (DNS debug), lsm (ClickHouse understanding), herald (notifications), gatekeeper (2FA), switchboard (gateway). DungBeetle v3.0 gets leader election + exactly-once cron. BookWise gets its waitlist state machine.
>
> **Biweekly Project 8 — `lsm` is the last building block.** By end of Month 7, all 8 building blocks are complete.

---

## Weeks 19–21 — Bloom Filters + Consistent Hashing + S3 + Edge + System Designs

### Bloom Filters

| | |
|---|---|
| 🛠 **Technologies** | Go (implementation), Redis `BF.ADD`/`BF.EXISTS`, TypeScript (consumer) |
| 📖 **Concepts** | Probabilistic membership, false positive rate formula, sizing, no false negatives guarantee |
| 🎯 **You Build** | RouteMaster Go crawler: Bloom filter URL dedup (10M URLs, 0.1% FP). DungBeetle (Go): Bloom filter job dedup before DB lookup. lsm building block: Bloom filter per SSTable. |

**Sizing calculation:** For RouteMaster's crawler at 10M URLs, 0.1% FP rate: `m = -10M × ln(0.001) / ln(2)² ≈ 144MB`. Acceptable. Persisted to Redis on shutdown, reloaded on startup.

### Consistent Hashing

| | |
|---|---|
| 🛠 **Technologies** | Go (standalone `pkg/consistenthash` package) |
| 📖 **Concepts** | Hash ring, virtual nodes (vnodes), adding/removing nodes remaps only 1/N keys |
| 🎯 **You Build** | `pkg/consistenthash` Go package used in: DungBeetle (job-to-worker routing), OpenTrace Processor (trace_id → processor instance for tail-based sampling). |

### DungBeetle v3.0 (Go) — Leader Election + Exactly-Once Cron

```go
// Leader election: Redis SETNX + Lua renewal
func (w *Worker) TryBecomeLeader(ctx context.Context) bool {
    acquired, _ := w.redis.SetNX(ctx, "cron:leader", w.nodeID, 30*time.Second).Result()
    if !acquired { return false }
    go w.renewLease(ctx)  // Lua script: verify token + extend TTL every 10s
    return true
}
// Exactly-once cron: distributed lock on job name + hour window
// Split-brain test must pass before v3.0 tag: pause renewal TTL+1s, verify new leader wins
```

### OpenTrace UI v2 (TypeScript/Next.js)

- **Service map** (D3.js force graph): nodes = services, edges = call relationships from `GetDependencies` gRPC
- **Live tail WebSocket**: connects to `relay` building block, streams new spans in real time as they arrive
- **SDK demo page**: shows real spans from the auto-instrumentation SDK flowing into OpenTrace

### OpenTrace SDK (Go + TypeScript)

```go
// Go SDK: zero-code-change instrumentation
import _ "github.com/yourname/opentrace/sdk/go"
otrace.Instrument(mux)
// Wraps http.Handler, database/sql, net/http.Transport, grpc
// Reads OPENTRACE_ENDPOINT from env
```

```typescript
// TypeScript SDK: Node.js auto-instrumentation
import { OpenTraceSDK } from '@yourname/opentrace-sdk';
OpenTraceSDK.start({ endpoint: process.env.OPENTRACE_ENDPOINT });
// Wraps Express, Prisma, ioredis, kafkajs
```

### BookWise Waitlist State Machine (TypeScript/Kafka)

```typescript
// Kafka consumer: booking.cancelled → promote waitlist
consumer.subscribe({ topic: 'booking.cancelled' });
consumer.run({
  eachMessage: async ({ message }) => {
    const { eventId, seatId } = JSON.parse(message.value!.toString());
    const next = await prisma.waitlist.findFirst({
      where: { eventId, seatId, status: 'WAITING' },
      orderBy: { position: 'asc' }
    });
    if (!next) return;
    // Set 15-minute offer window via Redis TTL
    await redis.setex(`waitlist:offer:${next.id}`, 900, JSON.stringify(next));
    // Notify via herald building block
    await herald.notify(next.userId, 'seat_offered', { seatId, expiresIn: 900 });
    await prisma.waitlist.update({ where: { id: next.id }, data: { status: 'OFFERED' } });
  }
});
```

### S3 + Cloudflare Workers + WebAssembly

*(Coverage: S3 presigned URLs, multipart upload, lifecycle policies, Cloudflare Workers V8 isolates, Cloudflare KV, R2 zero-egress storage, Wasm Go compilation, in-browser fraud detection.)*

**RouteMaster:** S3 multipart upload for proof-of-delivery photos. Cloudflare R2 for static assets (zero egress). ADR: "R2 vs S3 for static assets — R2 saves ~$0.09/GB egress."

### Weekend Capstone — Month 7 · OpenTrace UI v2 + SDK + All 8 Building Blocks Complete

OpenTrace UI v2: service map + live tail live. SDK: standalone sample app demonstrates zero-code auto-instrumentation. All 8 building blocks complete. DungBeetle v3.0: leader election + exactly-once cron — split-brain test passing. BookWise waitlist: Kafka state machine running.

**Building block portfolio at end of Month 7:**
- `vault` (Go) — WAL KV store
- `pgpool` (Go) — pgwire TCP proxy
- `relay` (Go) — clustered WebSocket
- `resolver` (Go) — recursive DNS
- `lsm` (Go) — LSM-tree storage engine
- `herald` (TypeScript) — notification delivery
- `gatekeeper` (TypeScript) — OTP gateway
- `switchboard` (TypeScript) — API gateway

---

# MONTH 8 — AI-Native Stack + Performance Engineering + Final System Designs
### OpenTrace: Production Hardening

> **K8s Operator for OpenTrace lifecycle management. OTel SDK compatibility verified. 10M spans/sec load test. Final `BENCHMARKS.md`.**

---

## Weeks 22–24 — AI Engineering + Performance Engineering + System Designs

### AI Engineering — Applied to TypeScript and Go Projects

**RouteMaster (TypeScript) — AI semantic search:**
```typescript
// Vercel AI SDK: translate natural language → Elasticsearch query
const result = await streamText({
  model: openai('gpt-4o-mini'),
  system: `You translate user queries to Elasticsearch DSL for shipment search.
           Available fields: destination_address, carrier_name, status, created_at`,
  prompt: `User query: "${userQuery}". Return JSON Elasticsearch query only.`,
  tools: { executeSearch: { execute: async (esQuery) => esClient.search(esQuery) } }
});
```

**DungBeetle (Go + TypeScript) — AI job orchestration:**
```go
// Go: LLM classifies job type and routes to handler
resp, _ := openaiClient.CreateChatCompletion(ctx, openai.ChatCompletionRequest{
    Model: "gpt-4o-mini",
    Tools: jobClassificationTools,
    Messages: []openai.ChatCompletionMessage{{
        Role: "user",
        Content: fmt.Sprintf("Classify and route this job payload: %s", job.Payload),
    }},
})
```
```typescript
// TypeScript Next.js: AI copilot UI using Vercel AI SDK
const { messages, handleSubmit } = useChat({ api: '/api/copilot' });
// "Why is job X failing?" → LLM reads job logs + DLQ → explains root cause
```

**BookWise (TypeScript) — PGVector seat recommendations:**
```typescript
// Embed seat metadata → store in PGVector → cosine ANN query
const embedding = await embed(userPreferences);
const seats = await prisma.$queryRaw`
  SELECT id, section, row, description,
         embedding <=> ${embedding}::vector AS distance
  FROM seats
  WHERE event_id = ${eventId} AND status = 'AVAILABLE'
  ORDER BY distance
  LIMIT 10
`;
```

### Performance Engineering — `pprof` (Go) + `clinic.js` (TypeScript)

**Go projects (PayCore, DungBeetle):**
```bash
# CPU flame graph
go tool pprof http://localhost:6060/debug/pprof/profile?seconds=30
# Heap profile  
go tool pprof http://localhost:6060/debug/pprof/heap
# Goroutine dump
go tool pprof http://localhost:6060/debug/pprof/goroutine
```

**Three deliberately introduced bugs (Go — PayCore):**
1. Allocating inside hot loop → `sync.Pool` fix → document p99 improvement
2. N+1 query in event projector → JOIN fix → document query plan change
3. Goroutine leak in Kafka consumer → `goleak` catches → `defer ticker.Stop()` fix

**TypeScript projects (BookWise, RouteMaster):**
```bash
# clinic.js flame graph for Node.js
npx clinic flame -- node dist/server.js
# Heap profiler
npx clinic heapprofiler -- node dist/server.js
```

**Three deliberately introduced bugs (TypeScript — BookWise):**
1. Memory leak in SSE subscriber registry → `WeakMap` fix → document heap before/after
2. Missing `pipeline()` error handler → silent stream corruption → `pipeline()` fix
3. Synchronous JSON.parse in hot loop → `worker_threads` offload → document throughput

### k6 Load Tests — All 5 Projects

| Project | Target | p99 SLO | Language |
|---|---|---|---|
| OpenTrace span ingestion | 10M spans/sec | < 5ms | Go |
| PayCore payments | 5K TPS | < 20ms | Go |
| DungBeetle job dispatch | 50K jobs/min | < 50ms | Go |
| BookWise seat reservations | 10K concurrent | < 500ms | TypeScript |
| RouteMaster orders | 20K orders/min | < 100ms | TypeScript |

### Weekend Capstone — Month 8 · OpenTrace Production Hardened + All System Designs

K8s Operator deployed. OTel compatibility verified — official `go.opentelemetry.io/otel` SDK → OpenTrace with only `OTEL_EXPORTER_OTLP_ENDPOINT`. 10M spans/sec load test documented. All system designs implemented. `BENCHMARKS.md` final for all projects.

---

# MONTH 9 — Polish + LFX Mentorship Sprint
### The Month That Opens CNCF Doors

> **Goal 1:** OpenTrace production-ready. 10M spans/sec verified. K8s Operator deployed. OTel compatibility confirmed. Architecture RFC complete. Final year project documentation done.
>
> **Goal 2:** LFX September cycle application submitted. Cover letter + ≥ 2 merged PRs + project proposal.

---

## Weeks 25–26 — Performance Engineering + LFX Application

### Three Performance Regressions Introduced and Fixed (Month 9 Polish)

*(Documentation pass: allocating inside hot loop → `sync.Pool`, N+1 query → batch query, goroutine leak → `defer ticker.Stop()`. All with before/after benchmark numbers in `BENCHMARKS.md`.)*

**Final SLO targets — all verified with k6:**

| Project | Target | p99 Latency | Error Rate |
|---|---|---|---|
| OpenTrace span ingestion | 50K/sec | < 50ms | < 0.01% |
| PayCore payments | 10K TPS | < 200ms | < 0.001% |
| DungBeetle job claims | 5K/sec | < 100ms | < 0.01% |
| BookWise seat reservations | 10K concurrent | < 500ms | < 0.001% |
| RouteMaster orders | 20K/sec | < 100ms | < 0.01% |

### LFX Mentorship Application

**Target projects ranked by fit:**

| Project | Why It Fits | Entry Points |
|---|---|---|
| **Jaeger** | You rebuilt Jaeger. You know the architecture at implementation depth. | `jaeger-ui` TypeScript waterfall improvements, Go collector, ClickHouse storage plugin |
| **OpenTelemetry Go** | You implemented OTLP. You understand the SDK from building the Collector. | `sdk/trace`, `exporters/otlp`, receiver components |
| **OpenTelemetry Collector Contrib** | You built a collector. Contrib has 100+ receivers/exporters. | ClickHouse receiver, OTLP improvements |
| **Prometheus** | You've written Prometheus exporters across all projects in both Go and TypeScript. | Client library improvements, Node.js exporter |
| **Kubernetes** (`controller-runtime`) | You wrote a K8s Operator for OpenTrace. | Reconciler improvements, better error handling |

**How to read the Jaeger codebase fast:**
```
jaeger/
├── cmd/collector/    ← mirrors your OpenTrace Collector (Go)
├── cmd/query/        ← mirrors your OpenTrace Query Service (Go)
├── plugin/storage/   ← storage plugins
│   └── clickhouse/  ← your contribution target
├── jaeger-ui/        ← mirrors your OpenTrace UI (TypeScript/React)
└── proto/            ← identical to what you generated in Month 1
```

**Your natural Jaeger contribution:** Production-quality ClickHouse storage plugin. Jaeger has Cassandra, Elasticsearch, BadgerDB — but no ClickHouse. You built one for OpenTrace. This is the proposal.

**Cover letter structure:**

```
Paragraph 1 — What you built:
"I spent 9 months building 13 GitHub repos across two languages. The centrepiece
is OpenTrace — a complete distributed tracing system in Go and TypeScript,
equivalent to Jaeger. I also built 4 independent backend systems (PayCore in Go,
DungBeetle in Go, BookWise in TypeScript, RouteMaster in TypeScript) and 8
production-grade building blocks. Both Go and TypeScript at production depth."

Paragraph 2 — Why this project specifically:
"I'm applying to contribute to Jaeger because OpenTrace gave me implementation-depth
familiarity with the OTLP protocol, ClickHouse storage patterns, the trace query
model, and the Jaeger UI's waterfall rendering. I've already contributed [N] PRs.
My natural contribution: the ClickHouse storage plugin."

Paragraph 3 — Technical proposal:
"Implementation approach: implements `spanstore.Reader` and `spanstore.Writer`
interfaces using ClickHouse MergeTree with monthly partitioning and 30-day TTL.
Schema matches the Jaeger data model. Tested with testcontainers-go. Benchmarked
at 10M spans/sec. See BENCHMARKS.md."

Paragraph 4 — Why you complete what you start:
"Here is my GitHub activity graph for the last 9 months. Here are the 8 standalone
building blocks. I ship every week. I complete what I start."
```

### Final Week — All 13 READMEs + Cold Emails

**Every README must have:**
- Mermaid architecture diagram
- Benchmark table with p50/p95/p99 at target RPS
- Live demo link
- ADR index (links to all ADRs)
- Building blocks consumed (with links)
- `BENCHMARKS.md` link

**Cold emails sent this month:** Infraspec, Rippling, Uber, Zomato, Swiggy, DoorDash, Amazon, Google. Subject line formula: `Built [PROJECT]: [ONE NUMBER] — applying for [ROLE] at [COMPANY]`.
