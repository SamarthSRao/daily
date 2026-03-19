# 8–9 Month Backend Engineering Mastery Plan
### Target: Infraspec · AI-First Product Engineering · Backend at Scale

---

## Why Infraspec

**Infraspec** (infraspec.dev) is an AI-first technology consulting firm founded by engineers from Gojek, Navi, Swiggy, and Rapido. They partner with fast-scaling startups globally. The role is Backend Engineer — building scalable systems, shipping fast, and leveraging AI-driven development to deliver high-quality product engineering outcomes.

This plan is built specifically around Infraspec's hiring bar:

| Infraspec Requirement | How This Plan Delivers It |
|---|---|
| 3–5 years experience or strong equivalent track record | 5 production-deployed projects with real benchmarks, ADRs, and k6 results |
| 0-to-1 consumer product experience | FleetPulse + RouteMaster built ground-up, Week 1 to production |
| Strong in one backend language (Go / TypeScript / Python) | Go: Months 3, 6, 7, 8. TypeScript/Node.js: Months 1, 2, 4 |
| Working knowledge of a second backend language | TypeScript primary, Go secondary (both at production depth) |
| REST, gRPC, webhooks, OAuth2, JWT | Implemented in every project from Month 2 onward |
| SQL, NoSQL, Redis, Elasticsearch | PostgreSQL + MongoDB + Redis + Elasticsearch — all five projects |
| Monolith vs microservices, event-driven architecture | DungBeetle (monolith → event-driven), PayCore (microservices + Kafka) |
| CI/CD, feature flags, progressive rollouts | GitHub Actions from Month 6; feature flags via LaunchDarkly in Month 8 |
| Debugging + production issue resolution | PITR drills, pprof flame graphs, distributed tracing every month |
| Unit, integration, E2E testing | Vitest + Playwright + Go testify + testcontainers — Month 4 onward |
| System observability and reliability | OpenTelemetry + Prometheus + Grafana on all 5 projects |
| Security best practices | JWT RS256, HMAC webhooks, `govulncheck`, `trivy`, non-root containers |
| AI tools for development and code review | GitHub Copilot workflow + AI SDK + Claude for RFC drafting — built in from Day 1 |
| RFCs and decision documents | Every major decision → ADR. Every system design → RFC. Written weekly. |
| Client and stakeholder communication | Technical write-ups, Loom walkthroughs, async documentation practiced monthly |

---

## The Infraspec Engineer's Mindset

Every day you operate with three simultaneous goals:

1. **Ship something real** — every evening you build a named feature of a named project. Not a tutorial. Not a toy.
2. **Understand the why** — every morning you learn the concept that makes the evening build possible. You read source code, not docs.
3. **Document like a senior** — every Sunday you write an ADR, update the README, and post a benchmark number publicly. Communication is engineering.

**AI-assisted development is not optional.** From Day 1, GitHub Copilot is open. From Month 3, you write RFC drafts with Claude. From Month 6, you build AI agents as features. The goal is not to use AI as a crutch — it is to use it to ship 3× faster while maintaining the quality bar a senior engineer would accept in code review.

---

## Master Concept Checklist

Every item below is **implemented in running, deployed code** — not watched in a tutorial. Check them off as you go.

### Fundamentals & Web Basics
- [ ] HTTP/HTTPS model — methods, status codes, headers, HTTP/2 multiplexing, TLS handshake; `curl -v` on every endpoint
- [ ] Client/Server concepts — stateless vs stateful, REST resource design, request/response lifecycle
- [ ] DNS — A, CNAME, MX, TXT, TTL, full resolution path (`dig +trace`); custom subdomains on Cloudflare
- [ ] How websites work — HTML → DOM → CSSOM → Render Tree → Layout → Paint → Composite; Lighthouse 100

### Frontend Development
- [ ] HTML — semantic elements, forms, accessibility (ARIA), meta tags, `<head>` structure
- [ ] CSS — box model, flexbox, grid, cascade, specificity, custom properties, responsive design, animations
- [ ] JavaScript — types, closures, event loop, prototypes, async/await, generators, modules
- [ ] Browser Dev Tools — Elements, Console, Network tab, Performance profiler, Memory tab, Lighthouse
- [ ] CLI — file system ops, grep/sed/awk, pipes, process management, cron, shell scripts
- [ ] VS Code — extensions (ESLint, Prettier, Error Lens, GitLens), tasks, debugging, workspace settings
- [ ] Linters — ESLint rules, auto-fix, custom rules, CI integration
- [ ] Formatters — Prettier config, format-on-save, pre-commit hooks
- [ ] TypeScript — strict mode, generics, conditional types, branded types, utility types, Zod integration

### Frontend Frameworks
- [ ] ReactJS — all hooks, reconciliation, React.memo, DevTools Profiler; all 4 platforms
- [ ] Next.js — App Router, Server Components, `'use client'`, ISR, streaming Suspense, Server Actions
- [ ] Tanstack Start — type-safe routing, compile-time route validation
- [ ] Svelte — compiler model, reactive `$:`, 14KB bundle, edge deploy on Cloudflare
- [ ] Vue 3 + Nuxt — Composition API, Pinia, SSR

### React Libraries
- [ ] Zod — `z.object`, `safeParse`, `z.infer<typeof schema>`, one schema = runtime validation + TypeScript type
- [ ] Zustand — `create<State>`, selective subscription, devtools middleware
- [ ] Immer.js — write mutating code, get immutable output; structural sharing
- [ ] Tanstack Query — `useQuery`/`useMutation`, optimistic updates + rollback, `staleTime`/`gcTime`
- [ ] Tailwind CSS — `cn()`/`cva()`, state variants, all CSS deleted
- [ ] Motion (Framer Motion) — `AnimatePresence`, `layoutId` shared transitions
- [ ] Shadcn UI — command palette, DataTable, Dialog; source owned
- [ ] Radix UI — headless accessible primitives underlying Shadcn

### Backend
- [ ] Shell/Linux — `ls`/`find`/`grep`/`sed`/`awk`, `free`/`top`/`htop`/`ulimit`, process management, cron
- [ ] Node.js — V8 + libuv, event loop phases, streams with backpressure, `worker_threads`, graceful shutdown
- [ ] Go — complete language, goroutines, channels, `sync`, `errgroup`, `singleflight`, stdlib deep
- [ ] Streams — Node.js Transform pipeline, backpressure, `pipeline()` (200MB log → 20MB constant RAM)

### Testing
- [ ] Unit Testing — Vitest + `@testing-library/react`, Go `testing` + `testify`, table-driven tests, 80%+ coverage
- [ ] E2E (Playwright) — `getByRole`, auto-wait, network mocking, cross-browser
- [ ] Puppeteer — PDF generation, visual regression baselines
- [ ] Cypress — component testing in real browser
- [ ] TestSprite — AI-generated E2E tests, reviewed and refined

### Databases
- [ ] PostgreSQL — schemas, B-tree/partial/covering/GIN indexes, `EXPLAIN ANALYZE`, MVCC, WAL, N+1 fix
- [ ] MySQL — compared to PostgreSQL in ADR; InnoDB internals, replication
- [ ] Redis — all data structures, Lua scripts, pub/sub, pipelines, TTL jitter
- [ ] PGVector — `vector(1536)`, HNSW index, cosine `<=>`, hybrid BM25 + vector search
- [ ] AWS S3 Vector — large-scale embedding storage
- [ ] TurboBuffer — bulk vector batch operations
- [ ] SQLite — embedded, offline, zero-config
- [ ] Convex — reactive queries, auto-push to subscribed clients
- [ ] Relational DB design — normalization, ACID, transactions, foreign keys
- [ ] Database Isolation Levels — all 4 levels with live anomaly demos, `SELECT FOR UPDATE`, `ON CONFLICT`
- [ ] Scaling Databases — read replicas, PgBouncer, connection pool monitoring
- [ ] Sharding and Partitioning — consistent hash router, monthly range partitioning
- [ ] Non-relational databases — MongoDB (schema-flexible docs), Cassandra (time-series)
- [ ] Picking the right database — ADR for every choice

### Caching
- [ ] Understanding caching — cache-aside, read-through, write-through, write-behind patterns
- [ ] Populating and scaling caches — cache warming, TTL jitter, cache stampede prevention
- [ ] Caching at different levels — browser cache, CDN cache, reverse proxy cache, application cache, DB cache

### Asynchronous Systems
- [ ] Message Queues — `SELECT FOR UPDATE SKIP LOCKED`, DLQ (dead letter queue), retry policies
- [ ] Message Streams and Kafka — topics, partitions, consumer groups, idempotent producer, exactly-once
- [ ] Real-time PubSub — Redis pub/sub, WebSockets, SSE fan-out across replicas

### Resiliency
- [ ] Load Balancers — round-robin, least-connections, consistent hash, health checks, sticky sessions
- [ ] Circuit Breakers — closed/open/half-open states, exponential backoff, bulkhead pattern
- [ ] Data Redundancy and Recovery — PITR drill, RTO/RPO, backup strategies, WAL archiving
- [ ] Leader Election — Redis SETNX-based leader election, ZooKeeper model, Raft basics

### Essentials at Scale
- [ ] Bloom Filters — probabilistic membership, false positive rate, sizing formula; implemented in Go
- [ ] Consistent Hashing — ring + virtual nodes, adding/removing nodes; implemented in Go
- [ ] Client-server and Communication Protocols — HTTP/1.1, HTTP/2, HTTP/3, gRPC, WebSocket, SSE, WebRTC
- [ ] Blob Storage and S3 — presigned URLs, multipart upload, lifecycle policies, S3-compatible APIs
- [ ] Introduction to Big Data — OLAP vs OLTP, columnar storage, MapReduce model

### DevOps
- [ ] AWS — ECS Fargate, RDS (Multi-AZ), ElastiCache, MSK, S3, CloudFront
- [ ] GCP — Cloud Run, Cloud SQL, GCS, Pub/Sub
- [ ] Azure — Container Apps, Azure DB
- [ ] Railway — fast iteration deploys
- [ ] Terraform — HCL, state (S3 + DynamoDB lock), modules, `plan → apply`
- [ ] Pulumi — TypeScript IaC (loops + conditions impossible in HCL)
- [ ] GitHub Actions — matrix builds, `paths` filter, Trivy CVE scan, branch protection
- [ ] Docker — multi-stage builds (900MB → 85MB), non-root user, health checks
- [ ] Firecracker — microVM isolation model; understand how Lambda/Fly.io work underneath
- [ ] S3 Object Storage — versioning, replication, presigned URLs
- [ ] Cloudflare — DNS, CDN, Workers (edge computing), R2, Pages
- [ ] CDNs — cache-control headers, cache invalidation, edge PoPs, origin shield
- [ ] Edge Computing — Cloudflare Workers, Vercel Edge Runtime, cold starts eliminated

### Real-Time & Networking
- [ ] Server-Sent Events (SSE) — one-way server push, `text/event-stream`, reconnection
- [ ] WebSockets — full-duplex, upgrade handshake, ping/pong, fan-out registry
- [ ] WebRTC — STUN/TURN servers, peer-to-peer, signaling server pattern

### AI Engineering
- [ ] AI Agents — tool use, function calling, agent loops, multi-agent orchestration on DungBeetle
- [ ] AI SDK (Vercel) — `useChat`, `streamText`, tool definitions, React integration
- [ ] RAG — embed → store → retrieve → augment → generate; BookWise seat recommendation assistant + RouteMaster restaurant assistant

### WebAssembly
- [ ] Wasm — compile Go/Rust to Wasm, run in browser; FleetPulse fraud detection at < 15ms in-browser

### Infraspec-Specific Engineering Practices
- [ ] **API Design** — REST resource design (versioning, breaking change policy), gRPC service definitions, webhook HMAC signing, OAuth2 flows, JWT RS256 (asymmetric)
- [ ] **Feature Flags + Progressive Rollouts** — LaunchDarkly SDK, percentage rollouts, kill switches, flag-driven A/B testing without redeployment
- [ ] **RFC Writing** — structured RFC format (problem, options, decision, tradeoffs). At least one RFC per project. Reviewed and iterated.
- [ ] **ADRs (Architecture Decision Records)** — one-page format, every major decision documented, linked from README
- [ ] **Production Debugging** — `pprof` flame graphs, `EXPLAIN ANALYZE` on live queries, distributed trace root cause, goroutine dumps on OOM
- [ ] **Observability — Traces** — OpenTelemetry SDK in Go + Node.js, auto-instrumentation for HTTP/DB/Redis/Kafka, manual spans for business logic, W3C `traceparent` propagation across services, tail-based sampling (100% errors + slow requests, 5% normal traffic), traces in Jaeger
- [ ] **Observability — Metrics** — Prometheus Counter/Gauge/Histogram on all 5 projects, RED method per service endpoint, Go runtime metrics (goroutine count, GC pause, heap), business metrics per project, PromQL queries for rate/error rate/p99 latency, Grafana dashboards with 4 rows per service
- [ ] **Observability — Logs** — `slog` structured JSON in all Go services, `trace_id` + `span_id` injected into every log line via middleware, logs shipped to Loki/Elasticsearch, queryable by service/level/trace ID
- [ ] **Observability — Alerting** — SLI/SLO/error budget definitions for all 5 projects, Prometheus alert rules (SLO breach, latency degradation, Kafka consumer lag, DLQ depth), Alertmanager routing P1→PagerDuty P2/P3→Slack, `for: 5m` noise reduction on all rules, Grafana exemplars linking metric spikes to traces
- [ ] **Observability — Runbooks** — on-call runbook for every alert: what it means, top 3 causes, diagnosis steps, fix steps, rollback, escalation path
- [ ] **Production Debugging Workflow** — the five-step process: alert → Grafana dashboard → find anomaly → Jaeger trace → slow span → pprof → fix → verify. Practiced on 3 deliberately introduced bugs (missing index, goroutine leak, N+1 query)
- [ ] **Security practices** — JWT RS256, `timingSafeEqual` for HMAC, `govulncheck`, `trivy` container scan, non-root Docker, `OWASP` top 10 awareness
- [ ] **AI-assisted development** — GitHub Copilot for boilerplate, Claude for RFC and ADR drafting, AI code review checklist, prompt engineering for backend tasks
- [ ] **Client communication** — async technical write-ups (Notion/Markdown), Loom architecture walkthrough, weekly status in one paragraph
- [ ] **Code review practice** — PR description template, reviewer checklist, inline comments explaining *why* not *what*
- [ ] **Monolith vs microservices** — DungBeetle starts as a monolith, extracted to event-driven services by Month 6. The ADR explains the decision.
- [ ] **Event-driven architecture** — outbox pattern, Kafka Saga, exactly-once semantics, event sourcing, CQRS
- [ ] **CI/CD pipeline** — GitHub Actions: lint → test → build → trivy → deploy. Branch protection. Zero-downtime deploys.
- [ ] **Graceful degradation** — circuit breakers, fallback responses, bulkhead isolation — tested with chaos (kill a pod, verify system degrades gracefully)

### System Design (All Implemented)
- [ ] e-Commerce Product Listing — pagination, faceted search, inventory consistency
- [ ] Tinder Feed — candidate generation, scoring pipeline, swipe event stream
- [ ] Notifications at scale — fan-out on write vs fan-out on read, APNs/FCM, deduplication
- [ ] Twitter Trends — sliding window counters, top-K with Count-Min Sketch
- [ ] URL Shortener — hash collision handling, redirect caching, analytics counters
- [ ] API Rate Limiter — token bucket, sliding window log, Redis Lua atomic implementation
- [ ] Realtime Abuse Masker — streaming classifier, shadow banning, appeal workflow
- [ ] Web Crawler — politeness policy, robots.txt, deduplication with Bloom filter, BFS queue
- [ ] GitHub Gists — presigned S3 upload, full-text search, forking with CoW
- [ ] Fraud Detection — feature store, rules engine, ML scoring, < 15ms p99
- [ ] Recommendation System — collaborative filtering, content-based, embedding similarity

---

## The 5 Flagship Projects

Every project is chosen because it demonstrates exactly what Infraspec's clients need: fast 0-to-1 shipping, scalable backend architecture, real observability, and AI-integrated workflows. Projects are sequenced to match your interests — distributed systems internals first, consumer product second.

| Project | What It Proves | Stack | Grows Into |
|---------|---------------|-------|-----------|
| **FleetPulse** | 0-to-1 consumer product, real-time systems, GPS at scale | Next.js + Go + PostgreSQL + Kafka + WebSocket | GPS tracking → surge pricing → fraud detection → AI dispatch |
| **PayCore** | Financial system reliability, idempotency, event sourcing | Go + PostgreSQL + Redis + Kafka + gRPC | Double-entry ledger → Saga transfers → reconciliation engine |
| **DungBeetle** | Monolith → event-driven migration, background job infra | Go + Kafka + PostgreSQL + Redis + AI | Job scheduler → webhook manager → leader election → AI orchestration |
| **BookWise** | Distributed booking system, concurrency, double-booking prevention | Go + PostgreSQL + Redis + Kafka + gRPC | Seat reservation → inventory locking → payment saga → waitlist |
| **RouteMaster** | Marketplace logistics, notifications at scale, Elasticsearch | Next.js + Go + Elasticsearch + Kafka | Orders → delivery → notifications → recommendation |

**The Infraspec narrative for each project:**
- FleetPulse → *"I built a GPS dispatch platform from scratch. Here's the RFC for the matching algorithm, the ADR for PostgreSQL+PostGIS vs Redis+H3, and the k6 benchmark showing 50K concurrent connections."*
- PayCore → *"I designed a double-entry ledger with exactly-once payment processing. Zero double charges in 10K TPS load test. Here's the outbox pattern ADR."*
- DungBeetle → *"I built a background job system that started as a monolith and evolved into an event-driven architecture. The RFC documents why we moved to Kafka at 100K jobs/day."*
- BookWise → *"I built a distributed seat booking system that handles 10K concurrent reservation requests with zero double-bookings. Here's the Redis SETNX distributed lock ADR and the Saga pattern for payment-then-confirm flows."*
- RouteMaster → *"I built a delivery notification system that fans out to 50M recipients. Here's the fan-out-on-write vs fan-out-on-read ADR."*

---

## Biweekly Deep Projects

> Every two weeks, alongside the main flagship work, you build a **standalone deep project** that directly exercises your core interest: distributed systems internals, database internals, protocol implementation, and systems programming in Go. These are not tutorials. They are original implementations that you push to GitHub, benchmark, and write up.
>
> These projects are calibrated to your existing work — you already built a multi-tenant KV store and a WebSocket chat server with JWT rotation. These biweekly projects go deeper, broader, and harder on exactly those foundations.

---

### Biweekly Project 1 — Weeks 1–2: Multi-Tenant JSON Store v2 (WAL + Compaction)

**Your existing project:** Multi-tenant KV store with 100MB quotas and LRU eviction.

**What this adds:** Your current store loses all data on restart (in-memory). This version adds durability using a Write-Ahead Log — the same mechanism PostgreSQL uses. Understanding WAL at implementation level is the most valuable distributed systems concept you can have.

**What you build:**
- **WAL writer** — every write appends a log entry `{op: SET/DEL, key, value, timestamp, checksum}` to an append-only file before modifying the in-memory map. If the process crashes mid-write, the checksum catches partial writes on recovery.
- **Recovery on startup** — replay the WAL from the last known good checkpoint. The store comes back to its exact pre-crash state.
- **Log compaction** — WAL files grow unboundedly. Compaction: snapshot the current in-memory state to a new file, delete all WAL entries before the snapshot. Same mechanism as Redis RDB + AOF.
- **Tenant isolation at storage level** — each tenant's data is in a separate WAL segment. Quotas enforced during WAL write (reject if tenant's segment would exceed 100MB).
- **Benchmark:** 100K writes, crash halfway, recover, verify all committed writes are present, no partial writes.

**What you learn:** WAL design, crash recovery, log compaction, why SQLite and PostgreSQL both use this pattern, fsync vs fdatasync tradeoffs.

**Connection to plan:** This is the exact internals of KVault (Month 7 in the plan — build Redis from scratch). You will have implemented half of it already.

**Push to GitHub with:** README explaining WAL format (binary layout diagram), benchmark results (writes/sec with and without fsync), recovery time on 1GB WAL.

---

### Biweekly Project 2 — Weeks 3–4: TCP Connection Pool (like pgbouncer, but yours)

**Why this:** You explored Arpit Bhayani's TCP server. The next step is understanding why connection pools exist — and building one.

**What you build:** A TCP proxy that sits between clients and a PostgreSQL server, maintaining a fixed pool of backend connections and multiplexing many client connections onto them.

```
Client 1 ──┐
Client 2 ──┤──→ ConnectionPool ──→ [PG conn 1]
Client 3 ──┤                    ──→ [PG conn 2]
...        ┘                    ──→ [PG conn 3]
```

- **Pool manager in Go** — maintain N persistent TCP connections to PostgreSQL. Queue client requests. Assign idle connection. Return to pool on query completion.
- **Protocol-aware proxying** — parse enough of the PostgreSQL wire protocol (pgwire) to know when a query starts and when it completes. This requires reading the PostgreSQL protocol specification.
- **Transaction mode vs session mode** — session mode: client owns the connection for its entire session. Transaction mode: connection returned to pool after each transaction (how PgBouncer works in production). Implement both.
- **Health checking** — periodically send a `SELECT 1` on idle connections. Remove broken connections. Replace them.
- **Benchmark:** Compare raw PostgreSQL (1000 connections) vs your pool (10 backend connections, 1000 clients). Measure: connection setup latency, throughput, memory.

**What you learn:** pgwire protocol, connection multiplexing, why PgBouncer exists, why opening 10K raw PostgreSQL connections kills a database.

**Connection to plan:** This is what PgBouncer does (covered in Month 5 database scaling). You understand it at implementation depth, not just "set pool_size=20."

---

### Biweekly Project 3 — Weeks 5–6: WebSocket Chat Server v2 (Distributed, Clustered)

**Your existing project:** WebSocket chat server with room-scoped broadcast hub, gorilla/websocket, JWT with hourly key rotation.

**What this adds:** Your current server is single-instance. If you run two instances, a message sent on instance 1 never reaches clients connected to instance 2. This version fixes that with Redis pub/sub — the same pattern used in production chat systems.

**What you build:**
- **Redis pub/sub fan-out** — when a message arrives on any instance, it publishes to `channel:room:{roomId}` in Redis. All instances subscribe. All broadcast to their local connected clients.
- **Distributed room state** — room membership stored in Redis (`SADD room:{roomId}:members {connectionId}`). Any instance can answer "who is in this room?"
- **Presence heartbeat** — client sends heartbeat every 30s. Server refreshes `HSET presence:{userId} last_seen {timestamp}` with 60s TTL. Dead connections expire automatically. No explicit disconnect needed.
- **Message history** — `XADD room:{roomId}:history` (Redis Stream). New clients joining mid-conversation get the last 50 messages from the stream. History truncated at 1000 messages per room.
- **Sub-10ms delivery** — benchmark end-to-end latency (message sent → received by all subscribers). Target: p99 < 10ms on same datacenter. Document what contributes to latency (network RTT, Redis round trip, Go channel dispatch).
- **Kill one instance** — clients reconnect to the other instance. Room state is intact in Redis. No messages lost.

**What you learn:** Redis pub/sub vs Redis Streams, distributed presence, the split-brain problem (what happens if Redis goes down), reconnection with backoff.

**Connection to plan:** FleetPulse uses exactly this pattern for live driver location broadcasting (Month 6). Your chat server is the simplified version.

---

### Biweekly Project 4 — Weeks 7–8: DNS Resolver (Recursive, from Raw UDP)

**Inspiration:** dns.toys — creative use of the DNS protocol. Understanding DNS at implementation level is rare and impressive.

**What you build:** A recursive DNS resolver in Go that resolves domain names from scratch — no OS resolver, no libraries. Start from the root servers, follow the delegation chain, return the final A record.

- **DNS wire format parser** — DNS messages are binary. Parse: header (12 bytes: ID, flags, QDCOUNT, ANCOUNT, NSCOUNT, ARCOUNT), question section, answer records. Implement your own DNS message struct and binary encoder/decoder.
- **Recursive resolution algorithm:**
  1. Query root servers (hardcoded IPs) for the TLD nameserver
  2. Query TLD nameserver (`.com`) for the authoritative nameserver
  3. Query authoritative nameserver for the final A record
  4. Return result
- **Caching layer** — cache every response with its TTL. `dig google.com @localhost -p 5353` twice: first miss (full recursion), second hit (cache, < 1ms).
- **CNAME following** — if the answer is a CNAME, recursively resolve the CNAME target.
- **Query types** — A, AAAA, MX, TXT, NS records.
- **Benchmark:** Resolution time for cold cache vs warm cache. Cold: ~100ms (3 UDP round trips). Warm: < 1ms (in-memory cache lookup).

**What you learn:** Binary protocol parsing, UDP vs TCP, DNS delegation chain, why TTL-based caching exists, how split-horizon DNS works.

**Connection to plan:** DNS is covered in Week 1 of the plan conceptually. You will understand it at a depth that makes every DNS debugging session trivial.

---

### Biweekly Project 5 — Weeks 9–10: SMTP Server (Send and Receive Email from Scratch)

**Inspiration:** smtp-server-go and listmonk. You understand how email actually works by implementing the protocol.

**What you build:** A minimal SMTP server in Go that can:
- Accept inbound email via the SMTP protocol (TCP, port 25)
- Parse the SMTP conversation (`EHLO`, `MAIL FROM`, `RCPT TO`, `DATA`, `QUIT`)
- Store messages in PostgreSQL (from, to, subject, body, timestamp, status)
- Forward outbound email to Gmail/SendGrid via SMTP relay
- Web UI (minimal) showing inbox per recipient

**The protocol conversation you implement:**
```
Client: EHLO mail.example.com
Server: 250-mail.example.com Hello
Server: 250-SIZE 14680064
Server: 250 STARTTLS

Client: MAIL FROM:<sender@example.com>
Server: 250 OK

Client: RCPT TO:<recipient@yourdomain.com>
Server: 250 OK

Client: DATA
Server: 354 Start mail input
Client: Subject: Hello\r\nFrom: ...\r\n\r\nBody text.\r\n.
Server: 250 OK: queued

Client: QUIT
Server: 221 Bye
```

- **MX record validation** — before accepting mail for a domain, validate via DNS that your server is the MX for that domain.
- **Anti-spam basics** — SPF check (verify sender IP against SPF DNS record), rate limiting per sender IP.
- **Delivery queue** — outbound emails go into a PostgreSQL queue (DungBeetle pattern). Worker retries with exponential backoff. Max 3 attempts then DLQ.

**What you learn:** SMTP protocol, email authentication (SPF/DKIM/DMARC), why email is hard, how listmonk works under the hood.

**Connection to plan:** DungBeetle's webhook delivery system uses the same outbound queue + retry pattern. PayCore sends payment receipts via this SMTP server.

---

### Biweekly Project 6 — Weeks 11–12: OTP Gateway (Multi-Tenant Auth Primitive)

**Inspiration:** The OTP Gateway project above. You build a production-grade, self-hosted OTP verification service.

**What you build:**
- **Multi-tenant** — each tenant (app) gets a namespace + secret for BasicAuth. OTPs are scoped per namespace. `tenant_a:otp_123` ≠ `tenant_b:otp_123`.
- **Provider abstraction** — pluggable provider interface. Implement: SMTP (send via your Week 9–10 SMTP server), webhook (POST to any URL). Interface:
  ```go
  type Provider interface {
      ID() string
      Send(ctx context.Context, to, otp, message string) error
  }
  ```
- **OTP lifecycle** — generate cryptographically random 6-digit OTP (`crypto/rand`). Store in Redis with TTL (`SETEX otp:{namespace}:{id} {ttl} {hashedOTP}`). Hash the OTP on storage (bcrypt or SHA256 — the stored value is never the raw OTP). Verify by hashing the incoming value and comparing.
- **Rate limiting** — max 5 verification attempts per OTP. Redis `INCR otp:attempts:{id}` + TTL. Block after 5.
- **REST API** — `PUT /api/otp/:id` (generate + send), `POST /api/otp/:id` (verify), `POST /api/otp/:id/status` (check if verified). Mirror the exact API design from the OTP Gateway project above.
- **Built-in UI** — minimal HTML form for OTP entry. Served by the same Go binary.

**What you learn:** Multi-tenancy at API level (same pattern as Infraspec's clients), crypto/rand vs math/rand for secrets, Redis as ephemeral state store, rate limiting at the application layer.

**Connection to plan:** This is a standalone service that all 5 flagship projects use for 2FA. PayCore uses it for high-value transaction confirmation. The multi-tenant namespace pattern mirrors DungBeetle's multi-tenant job queue.

---

### Biweekly Project 7 — Weeks 13–14: Distributed Lock Service (like Redlock, but simpler and yours)

**Why:** Distributed locks are at the heart of every system that handles concurrent access to shared resources — booking systems, payment processing, job queues. You've been using `SETNX` patterns throughout the plan. Now you build the service that provides them.

**What you build:** A standalone Go service that provides distributed mutex primitives over HTTP and gRPC.

- **Lock acquisition** — `POST /locks/:resource` → try `SET lock:{resource} {ownerToken} NX PX {ttlMs}`. Returns the lock token if acquired, 409 if already held.
- **Lock release** — `DELETE /locks/:resource` with `Authorization: Bearer {token}`. Lua script: verify token matches stored token, then delete. Atomic — no race between verify and delete.
  ```lua
  if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("del", KEYS[1])
  else
    return 0
  end
  ```
- **Lock renewal** — `PATCH /locks/:resource` extends TTL if the caller still holds the lock. Used by long-running jobs that need to hold a lock beyond the initial TTL.
- **Fencing tokens** — every lock acquisition returns a monotonically increasing fencing token (Redis `INCR lock:fence:{resource}`). The resource holder passes the token with every write. The resource rejects writes with stale tokens. This prevents the "process paused by GC, lock expired, other process takes lock, first process wakes and writes" race condition.
- **Watchdog goroutine** — automatically renew locks held by live clients on a heartbeat schedule. If the heartbeat stops (client died), the lock expires via TTL.
- **gRPC interface** — same operations as HTTP, but for Go clients.

**What you learn:** The distributed lock problem, why TTL alone is not enough (fencing tokens), why Redlock is controversial, how DynamoDB, PostgreSQL advisory locks, and ZooKeeper solve the same problem differently.

**Connection to plan:** BookWise (Month 6 in the plan) uses this lock service to prevent double-booking. DungBeetle uses it for leader election. PayCore uses it for idempotency key deduplication.

---

### Biweekly Project 8 — Weeks 15–16: LSM-Tree Storage Engine (the write path of RocksDB, yours)

**Why:** You're learning database internals. The LSM-tree is the most important data structure in modern databases. RocksDB, LevelDB, Cassandra, DynamoDB, and ScyllaDB all use it. Building it teaches you more about database internals than any course.

**What you build:** A key-value storage engine in Go using an LSM-tree (Log-Structured Merge-tree). Same architecture as LevelDB.

- **MemTable** — in-memory sorted map (Go `map` + sorted slice). All writes go here first. Fast. O(log N) lookup.
- **WAL** — every write to MemTable is first written to the WAL (append-only file). Recovery: replay WAL on startup.
- **Flush to SSTable** — when MemTable exceeds 4MB, flush it to disk as an SSTable (Sorted String Table): a sorted, immutable file of key-value pairs with a binary search index at the end.
  ```
  SSTable layout:
  [data block 1][data block 2]...[index block][footer]
  index block: sorted list of (last_key_in_block → block_offset)
  ```
- **Compaction** — multiple SSTables accumulate. Compaction merges them: read all, merge-sort (like merge sort), write new SSTable, delete old ones. Handle tombstones (deleted keys).
- **Bloom filter per SSTable** — before reading an SSTable to check if a key exists, check its Bloom filter. If the filter says "no," skip the file. Reduces unnecessary disk reads from O(N files) to O(1) for missing keys.
- **Get operation** — check MemTable → check SSTables newest-to-oldest (with Bloom filter shortcut) → return first match or "not found."
- **Benchmark:** 1M writes, measure: write throughput, read latency (warm cache, cold cache), compaction impact on write latency (write stalls).

**What you learn:** Why LSM-trees have excellent write performance (sequential writes), why reads are more expensive (multiple files to check), what "write amplification" means, why Bloom filters are essential for LSM performance.

**Connection to plan:** KVault (Month 7) builds Redis internals. This builds the storage engine underneath. If someone asks "how does RocksDB work?" you can answer from code, not Wikipedia.

---

### BookWise — The Booking System (Replaces AeroOps)

**Why a booking system:** Booking systems are one of the hardest classes of distributed systems problems. Double-booking prevention requires distributed locking. Seat inventory requires atomic operations. Payment + confirmation requires Sagas. Waitlists require event-driven state machines. Every startup that handles appointments, reservations, tickets, or slots has this problem.

**What BookWise is:** A production-grade distributed booking platform. Think: flight seat reservation + concert ticket booking + doctor appointment scheduling. Not a demo. Not a tutorial. A real system that handles 10K concurrent booking attempts with zero double-bookings.

**Domain:** Seats (or slots) are finite resources. Multiple users try to book the same seat simultaneously. Exactly one must succeed. The others must get a meaningful error or be added to a waitlist. Payment must be collected before confirming the booking. If payment fails, the seat must be released.

**What it grows into across the months:**

| Month | BookWise Feature | Distributed Systems Concept |
|-------|-----------------|----------------------------|
| 1 | Raw HTTP booking endpoint — POST /bookings, no concurrency protection yet | REST API design, idempotency keys |
| 2 | JWT auth, tenant isolation (multi-venue support), webhook notifications | OAuth2, webhooks, multi-tenancy |
| 3 | Go rewrite, gRPC internal inventory service | gRPC service definitions, Go concurrency |
| 4 | React booking UI, seat map component, real-time availability via SSE | Server-Sent Events for live seat updates |
| 5 | PostgreSQL advisory locks + Redis distributed lock (uses your Biweekly Project 7) | Database locking, distributed locks |
| 6 | Payment Saga (reserve seat → charge payment → confirm booking → release if payment fails) | Saga pattern, compensating transactions |
| 7 | Waitlist engine — Kafka event triggers automatic assignment when booking cancelled | Event-driven state machine |
| 8 | AI-powered seat recommendation — "based on your group size and preferences, these seats" | RAG over seat metadata, PGVector |

**The double-booking problem — how BookWise solves it:**

```go
// Naive (broken): check then book — race condition between check and insert
available := db.QueryRow("SELECT count FROM inventory WHERE seat_id = $1", seatId)
if available > 0 {
    db.Exec("UPDATE inventory SET count = count - 1 WHERE seat_id = $1", seatId) // another request wins the race here
    db.Exec("INSERT INTO bookings ...")
}

// Correct: atomic decrement with check
result := db.Exec(`
    UPDATE inventory
    SET count = count - 1
    WHERE seat_id = $1 AND count > 0  -- atomic: decrement only if available
    RETURNING count
`, seatId)
if result.RowsAffected == 0 {
    return ErrSeatUnavailable  // someone else got it
}
// Only one transaction can win — database guarantees atomicity
db.Exec("INSERT INTO bookings ...")
```

**For high-contention seats (e.g., front row at a Taylor Swift concert):**
- Redis `DECR inventory:{seatId}` — atomic, O(1), returns new count. If < 0, INCR back and reject.
- Distributed lock via your Biweekly Project 7 — only one BookWise instance processes requests for a given seat simultaneously.
- Fencing token passed with every inventory mutation — prevents stale lock holders from booking.

**BookWise Infraspec narrative:** *"I built a distributed seat reservation system that handles 10K concurrent booking requests with zero double-bookings. The inventory uses Redis atomic DECR with PostgreSQL as the source of truth and distributed locks with fencing tokens to prevent stale lock races. The payment flow is a Saga — if Stripe declines the card, the seat is automatically released and the next person on the waitlist is notified within 200ms."*

---

## Daily Schedule

| Block | Duration | Activity |
|-------|----------|----------|
| **Morning** | 2 hours | Learn the concept. Run code. Break it. Read source. Concept introduced because a project needs it. **GitHub Copilot open the entire time — use it, learn from its suggestions, reject bad ones.** |
| **Evening** | 2 hours | Build the named feature. Must use ≥ 3 technologies together. Always *"FleetPulse needs X."* Never a tutorial. |
| **DSA** | 30 min | 1 problem. Connect it to what you built. LRU = Redis. Bloom Filter = you built it. |
| **RFC/ADR** | 30 min | Write a short RFC or ADR for a decision you made today or this week. Infraspec engineers write constantly. |
| **Saturday** | 5 hours | Weekend capstone: wire the week's features into the flagship project. Deploy. Benchmark with k6. |
| **Sunday** | 3 hours | Document: README + ADR update, benchmark numbers, LinkedIn/X post, Loom walkthrough of the week's feature. CI must be green. |

**AI workflow rules (from Day 1):**
- GitHub Copilot is always open — but every suggestion you accept, you must be able to explain
- Week 1: use Copilot for boilerplate only (imports, repetitive structs)
- Month 2+: use Claude to draft RFC first drafts — then rewrite with your own reasoning
- Month 4+: use AI for test generation (TestSprite) — review and fix every generated test
- Month 6+: build AI features using the Vercel AI SDK + tool use — not just consume AI, build with it

---

## 8–9 Month Overview

| Month | Theme | Infraspec Skill Unlocked | Flagship Work |
|-------|-------|--------------------------|--------------|
| **1** | Web Fundamentals + HTML + CSS + JavaScript Engine | API design fundamentals, HTTP mental model | FleetPulse raw HTTP server + REST API design + first RFC |
| **2** | JavaScript Deep + Node.js + TypeScript | OAuth2/JWT auth, webhook design, TypeScript at production depth | All 5 platforms on Express + PostgreSQL + TypeScript + auth |
| **3** | Go Mastery — Language + Concurrency + Stdlib | Second backend language at production depth, gRPC | DungBeetle v0.1 in pure Go + gRPC internal API |
| **4** | React + Frameworks + Testing + CI/CD | Full test coverage, CI/CD pipeline, feature flags, progressive rollouts | All 5 platforms full React/Next.js, GitHub Actions CI, LaunchDarkly |
| **5** | Databases + Caching + System Design Part 1 | SQL/NoSQL/Redis/Elasticsearch mastery, ADR practice | All DB patterns, caching layers, URL Shortener + Rate Limiter RFCs |
| **6** | Infrastructure + Real-Time + Async + Resiliency + **Full Observability Stack** | Event-driven architecture, complete traces+metrics+logs+alerting, production debugging workflow | All 5 projects deployed + OTel + Prometheus + Grafana + Alertmanager + on-call runbooks |
| **7** | Distributed Systems + System Design Part 2 | DungBeetle monolith → event-driven migration, Bloom Filters | DungBeetle v3.0, Bloom Filters, Web Crawler, Notifications at scale |
| **8** | AI Engineering + Wasm + Final System Designs | AI-assisted development, feature flag progressive rollout, client-facing RFC | OpsAI multi-agent, Wasm fraud detection, Fraud + Recommendation |
| **9** | Performance + Polish + Infraspec Interview Sprint | Full production readiness, client communication artifacts | k6 benchmarks, pprof, ADRs, cold emails, mock RFC presentation |

---

---

# MONTH 1 — Web Fundamentals + HTML + CSS + JavaScript Engine

> The first month has three phases. Week 1 covers the web itself: how HTTP works, how DNS resolves, how browsers render. Week 2 covers HTML and CSS properly — semantic markup, box model, flexbox, grid, accessibility. Weeks 3–4 cover the JavaScript engine itself. No frameworks yet. You understand the foundation before you build on it.
>
> **Infraspec goal this month:** By end of Month 1, you can design a REST API from first principles, explain every HTTP status code without looking it up, and have written your first RFC — a 1-page document proposing the FleetPulse GPS ping API design with tradeoffs documented.
>
> **AI workflow this month:** GitHub Copilot open from Day 1. Use it for boilerplate. Reject anything you cannot explain. Write your first Claude-assisted RFC draft on Friday Week 4 — then rewrite it entirely in your own words.

---

## Week 1 — How the Web Works: HTTP, DNS, Client/Server, Browsers

---

### Monday — Week 1 · HTTP/HTTPS Model + Dev Environment

| | |
|---|---|
| 🛠 **Technologies** | Node.js 22 LTS, VS Code, pnpm, `curl`, `dig`, `openssl` |
| 📖 **Concepts** | HTTP methods (GET/POST/PUT/PATCH/DELETE), status codes, request/response headers, HTTP/2 multiplexing, TLS handshake, HTTPS vs HTTP |
| 🎯 **You Build** | Dev environment configured. `curl -v` dissection of 5 real sites documented. FleetPulse domain registered on Cloudflare. |
| 🔗 **Why It Matters** | Every web request you ever debug starts with understanding what bytes go over the wire. Without this, networking errors are magic. |

**Morning — HTTP from First Principles**

Open your terminal and run `curl -v https://google.com`. You will see the exact bytes exchanged:

- **TCP handshake** — SYN, SYN-ACK, ACK — before any HTTP data moves
- **TLS handshake** — certificate exchange, cipher negotiation, session key establishment — this is what HTTPS adds on top of HTTP
- **HTTP request** — request line (`GET / HTTP/1.1`), headers (`Host:`, `User-Agent:`, `Accept-Encoding:`), blank line, optional body
- **HTTP response** — status line (`HTTP/1.1 301 Moved Permanently`), response headers, blank line, body

HTTP status code families you must know cold:
- **2xx** — success: 200 OK, 201 Created, 204 No Content
- **3xx** — redirect: 301 Permanent, 302 Temporary, 304 Not Modified (cached)
- **4xx** — client error: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable, 429 Too Many Requests
- **5xx** — server error: 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout

**HTTP/2**: multiplexes multiple requests over a single TCP connection. HTTP/1.1 required one request at a time per connection, causing head-of-line blocking. HTTP/2 sends requests and responses interleaved as numbered frames. Browsers open one connection to a domain instead of 6–8 in parallel.

**HTTPS vs HTTP**: HTTP is plaintext — anyone on the network can read it. HTTPS wraps HTTP in TLS: data is encrypted, the server's identity is verified via certificate, and data integrity is guaranteed. The TLS handshake adds ~1 round trip of latency (TLS 1.3 reduces this).

**VS Code Setup**: install ESLint, Prettier, Error Lens, GitLens, Thunder Client. Configure format-on-save. Set up pnpm workspaces with `packages/types`, `packages/schemas`, `packages/utils`.

**DSA — Big O Notation**

Review O(1), O(log N), O(N), O(N log N), O(N²). Connect to what you just learned: HTTP header lookup is O(1) (hash map). DNS recursive resolution is O(depth of tree). Sorting HTTP logs is O(N log N).

---

### Tuesday — Week 1 · Client/Server Concepts + REST Design

| | |
|---|---|
| 🛠 **Technologies** | Node.js `http` stdlib, `curl`, `httpie` |
| 📖 **Concepts** | Stateless vs stateful, REST resource design, idempotency (GET/PUT/DELETE vs POST), request/response lifecycle, connection keep-alive |
| 🎯 **You Build** | FleetPulse raw GPS receiver — plain `http.createServer`, no framework. Handles malformed requests gracefully. |
| 🔗 **Why It Matters** | REST is not a library — it is a set of constraints. Understanding them means you design APIs that are predictable and debuggable. |

**Morning — Stateless Architecture and REST**

A **stateless** server does not remember who you are between requests. Every request carries all the information needed to fulfill it (auth token, session ID, all required data). This is why HTTP scales horizontally — any server in the cluster can handle any request because no server holds your session.

**REST** (Representational State Transfer) has six constraints. The important ones:
- **Uniform interface** — resources identified by URLs, manipulated through representations, stateless interactions
- **Statelessness** — no session state on the server
- **Cacheability** — responses must label themselves as cacheable or not

REST URL design rules:
- Nouns, not verbs: `/drivers`, not `/getDrivers`
- Plural: `/drivers/123`, not `/driver/123`
- Hierarchy represents relationships: `/drivers/123/trips`
- Query strings for filtering: `/trips?status=pending&driverId=123`

**Idempotency**: an operation is idempotent if applying it multiple times produces the same result as applying it once. GET, PUT, DELETE are idempotent. POST is not. This matters enormously for retries — a network error on a payment POST could cause a double charge if the server processed it but the response was lost.

**Evening — Build the FleetPulse GPS Receiver**

Build a raw HTTP server using only `http.createServer`:
- `POST /pings` — accepts GPS ping JSON, validates it, responds `{ok: true}`
- `GET /health` — health check endpoint
- Handle body chunking manually — `req.on('data')` and `req.on('end')`
- Handle all error cases: malformed JSON, missing fields, wrong content-type
- Log every request: method, path, status, duration in milliseconds

Why no Express yet? Express is just a pretty wrapper. Understanding the underlying `http` module means you can debug Express internals, write custom middleware, and understand every framework that runs on Node.js.

**DSA — Array and HashMap Problems**

Two Sum with HashMap O(N). Valid Anagram with character frequency map. Connection: the HashMap pattern (trade space for time) is the foundation of Redis, database indexes, and DNS caches.

---

### Wednesday — Week 1 · DNS — From Browser to IP

| | |
|---|---|
| 🛠 **Technologies** | `dig`, `nslookup`, Cloudflare DNS, Wireshark |
| 📖 **Concepts** | DNS record types (A, CNAME, MX, TXT, NS, PTR), TTL, recursive vs iterative resolution, DNS caching at every level, CDN DNS routing |
| 🎯 **You Build** | Register `fleetpulse.dev`, `bookwise.dev`, `routemaster.dev`, `paycoreapp.dev` on Cloudflare. Configure A and CNAME records. Set TTLs. |
| 🔗 **Why It Matters** | Every time you deploy, DNS propagation delays can confuse your users. Understanding TTL means you know when to change it (lower TTL before a migration, raise it after). |

**Morning — How DNS Resolution Works**

Run `dig +trace google.com` and follow every step:

1. **Browser cache** — recently resolved names are cached (TTL seconds)
2. **OS cache** — `/etc/hosts` and OS resolver cache checked first
3. **Recursive resolver** — usually your ISP or `8.8.8.8` (Google) or `1.1.1.1` (Cloudflare)
4. **Root servers** — 13 root server addresses, hardcoded in resolvers. They know where `.com` TLD servers are.
5. **TLD servers** — `.com` servers know where `google.com`'s nameservers are
6. **Authoritative nameservers** — Google's own nameservers return the final A record

DNS record types:
- **A** — maps hostname to IPv4 address: `fleetpulse.dev → 1.2.3.4`
- **AAAA** — maps hostname to IPv6 address
- **CNAME** — alias to another hostname: `www.fleetpulse.dev → fleetpulse.dev`
- **MX** — mail server for the domain: `fleetpulse.dev → mail.fleetpulse.dev`
- **TXT** — arbitrary text: used for SPF/DKIM email authentication, domain ownership verification
- **NS** — nameserver records — which servers are authoritative for this domain
- **PTR** — reverse DNS: IP address → hostname (used by email servers for spam checks)

**TTL (Time To Live)**: how long resolvers cache the answer. Low TTL (60 seconds) = changes propagate quickly but more DNS traffic. High TTL (86400 = 1 day) = caches everywhere, changes take 24 hours to propagate. Rule: lower your TTL 48 hours before any planned migration, raise it back after.

---

### Thursday — Week 1 · How Websites Work — Browser Rendering Pipeline

| | |
|---|---|
| 🛠 **Technologies** | Chrome DevTools (Elements, Network, Performance, Lighthouse), `curl` |
| 📖 **Concepts** | HTML → DOM → CSSOM → Render Tree → Layout → Paint → Composite, critical render path, reflow vs repaint, Lighthouse scoring |
| 🎯 **You Build** | Profile FleetPulse landing page with Lighthouse. Document every bottleneck. Achieve 90+ score before adding any React. |
| 🔗 **Why It Matters** | Framework performance problems start here. Understanding the render pipeline means you know why React.memo, CSS containment, and lazy loading exist. |

**Morning — The Browser Rendering Pipeline**

When a browser receives HTML, it does not just display it. It executes a complex pipeline:

1. **Parse HTML → DOM** — the browser parses HTML into a tree of nodes (Document Object Model). `<div>`, `<p>`, `<img>` all become nodes.
2. **Parse CSS → CSSOM** — CSS is parsed into a separate tree (CSS Object Model). Stylesheets block rendering — the browser must finish downloading and parsing all CSS before it can paint.
3. **Combine → Render Tree** — DOM + CSSOM = Render Tree. Only visible nodes are included (`display: none` nodes are excluded).
4. **Layout (Reflow)** — the browser calculates the exact position and size of every element on screen. This is expensive. Changing any property that affects layout (width, height, top, left, margin) triggers a reflow of potentially the entire document.
5. **Paint** — fills in pixels for each element: text, colors, images, shadows. Changing `color` or `background-color` triggers repaint but not reflow (cheaper).
6. **Composite** — some elements (those with `transform`, `opacity`, `will-change`) are painted on separate GPU layers and composited together. Animating `transform` and `opacity` only triggers compositing — the cheapest operation. This is why CSS animations using `transform` are smooth and animations using `top/left` are janky.

**Chrome DevTools mastery**:
- **Elements tab** — inspect and modify the live DOM. See which CSS rules apply, computed styles, box model dimensions.
- **Network tab** — every request: timing (DNS, TCP, TLS, TTFB, download), headers, response body. Waterfall view shows parallel vs sequential loading.
- **Performance tab** — record a session, see flame chart of JS execution, layout events, paint events, FPS.
- **Lighthouse** — automated audit: Performance (LCP, CLS, FID), Accessibility (ARIA, color contrast), Best Practices (HTTPS, console errors), SEO (meta tags, robots.txt).

**DSA — Stack and Queue**

Implement both with arrays and linked lists. Connection: the browser's rendering pipeline is a queue. The JavaScript call stack is a stack. You will use both data structures in your scheduler utility.

---

### Friday — Week 1 · CLI + Shell Scripting

| | |
|---|---|
| 🛠 **Technologies** | Bash, `zsh`, `grep`, `sed`, `awk`, `find`, `top`, `htop`, `ps`, `kill`, `cron` |
| 📖 **Concepts** | File system hierarchy, pipes and redirection, process management, environment variables, shell scripts, cron jobs |
| 🎯 **You Build** | Deploy script for FleetPulse: stops old server, pulls new code, runs tests, starts new server, health checks. |
| 🔗 **Why It Matters** | Every DevOps operation, every production debug session, every CI pipeline is shell commands. You cannot be a backend engineer without owning the command line. |

**Morning — The Command Line**

Essential commands organized by category:

**File system**: `ls -la` (list with permissions), `find . -name "*.ts" -mtime -1` (files modified in last day), `cp -r src dst` (recursive copy), `mv`, `rm -rf`, `mkdir -p path/to/dir` (create with parents), `chmod 755 script.sh`, `chown user:group file`

**Text processing**: `grep -r "TODO" src/` (search recursively), `grep -v "test" file` (exclude matches), `sed 's/old/new/g' file` (replace in file), `awk '{print $1, $3}' file` (print columns 1 and 3), `sort | uniq -c | sort -nr` (count occurrences, sort by count)

**Pipes and redirection**: `command | command` (pipe stdout to stdin), `command > file` (redirect stdout to file), `command >> file` (append), `command 2>&1 | tee file` (capture both stdout and stderr, also print to terminal)

**Process management**: `ps aux | grep node` (find Node.js processes), `kill -9 PID` (force kill), `top` / `htop` (live process view), `lsof -i :3000` (what is using port 3000), `ulimit -n 65536` (raise file descriptor limit), `nohup command &` (run in background, persist after logout)

**Environment**: `export KEY=value`, `printenv`, `source .env`, `.env` files loaded with `dotenv`

**Cron**: `crontab -e` opens the cron editor. Format: `minute hour day month weekday command`. `0 2 * * * /home/ubuntu/backup.sh` runs at 2am daily.

**Evening — Write the Deploy Script**

Write a shell script that: checks Node.js version, runs `pnpm test`, builds the app, copies files to the server via rsync, SSHs in and runs the restart commands, polls the health endpoint until it returns 200. This script will be used every day for the rest of the plan.

---

## Week 2 — HTML + CSS: Semantic Markup, Box Model, Flexbox, Grid, Accessibility

---

### Monday — Week 2 · HTML — Semantic Markup + Accessibility + Forms

| | |
|---|---|
| 🛠 **Technologies** | HTML5, browser DevTools, WAVE (accessibility checker), Lighthouse |
| 📖 **Concepts** | Semantic HTML elements, ARIA attributes, form elements and validation, `<head>` structure, meta tags, accessibility tree |
| 🎯 **You Build** | FleetPulse driver dashboard markup — semantic HTML with no CSS yet. Passes WAVE accessibility check. |
| 🔗 **Why It Matters** | Screen readers and search engines read your HTML, not your CSS. Semantic HTML is free SEO and accessibility. React Testing Library's `getByRole` works because of semantic HTML. |

**Morning — HTML Done Right**

HTML has 100+ elements. Most developers use 10. The rest provide **semantic meaning** — they tell browsers, search engines, and screen readers what role each piece of content plays.

Structural semantic elements:
- `<header>` — introductory content, logo, navigation
- `<nav>` — navigation links
- `<main>` — the primary content of the page (only one per page)
- `<article>` — self-contained content: a blog post, a product card, a news story
- `<section>` — thematic grouping within a document, with a heading
- `<aside>` — tangentially related content: sidebars, related links
- `<footer>` — footer information: copyright, links, contact

Why use these instead of `<div>` everywhere? Search engines weight content in `<main>` and `<article>` more heavily. Screen readers announce these landmarks so users can jump to them. `getByRole('main')` in tests only works with proper semantics.

**ARIA (Accessible Rich Internet Applications)**: fills semantic gaps. `role="dialog"` marks a modal. `aria-label="Close"` names an icon button with no text. `aria-expanded={isOpen}` communicates dropdown state. `aria-live="polite"` announces dynamic content changes to screen readers.

**Forms done right**:
- `<label for="email">` linked to `<input id="email">` — clicking the label focuses the input
- `required`, `pattern`, `minlength`, `type="email"` — native browser validation before JavaScript runs
- `<fieldset>` + `<legend>` — group related fields
- `<button type="submit">` not `<div onclick>` — keyboard accessible by default

---

### Tuesday — Week 2 · CSS — Box Model, Cascade, Specificity, Custom Properties

| | |
|---|---|
| 🛠 **Technologies** | CSS3, Chrome DevTools Computed tab |
| 📖 **Concepts** | Box model (content, padding, border, margin), `box-sizing: border-box`, cascade algorithm, specificity scoring, inheritance, CSS custom properties |
| 🎯 **You Build** | FleetPulse layout styled with pure CSS — no framework. Box model understood by measuring every element in DevTools. |
| 🔗 **Why It Matters** | Tailwind generates CSS. If you do not understand CSS, you cannot debug when Tailwind produces unexpected results. |

**Morning — The CSS Box Model**

Every HTML element is a rectangular box. The box has four layers from inside out:
1. **Content** — where text and images render
2. **Padding** — transparent space inside the border
3. **Border** — the border itself (can have width, style, color)
4. **Margin** — transparent space outside the border (collapses with adjacent margins)

`box-sizing: content-box` (default): `width` = content width only. Padding and border add to total size. A 200px wide box with 20px padding is 240px total. **This is confusing.**

`box-sizing: border-box`: `width` = total size including padding and border. A 200px wide box with 20px padding has 160px of content space. **Always use this.** Add `*, *::before, *::after { box-sizing: border-box }` to every project.

**The Cascade**: when multiple CSS rules target the same element, the cascade determines which wins:
1. Specificity — more specific selector wins
2. Source order — later rule wins if specificity is equal
3. `!important` — overrides everything (avoid it)

**Specificity scoring**: `inline style (1000) > ID (100) > class/attribute/pseudo-class (10) > element (1)`. `.nav .link` scores 20. `#header` scores 100. `div p a` scores 3.

**CSS Custom Properties (variables)**:
```css
:root {
  --color-brand: #3B82F6;
  --spacing-md: 1rem;
}
.button { background: var(--color-brand); padding: var(--spacing-md); }
```
Custom properties cascade like any other property — you can override them at any scope. Tailwind is built on this same mechanism.

---

### Wednesday — Week 2 · CSS Flexbox + Grid + Responsive Design

| | |
|---|---|
| 🛠 **Technologies** | CSS Flexbox, CSS Grid, media queries, `clamp()` |
| 📖 **Concepts** | Flex container vs flex items, main axis vs cross axis, Grid template areas, auto-fill vs auto-fit, intrinsic vs extrinsic sizing, mobile-first design |
| 🎯 **You Build** | FleetPulse driver grid layout — 1 column on mobile, 2 on tablet, 3 on desktop. No media query hacks. |
| 🔗 **Why It Matters** | Flexbox and Grid replaced float-based and table-based layouts. Understanding them means you understand what Tailwind's `flex`, `grid`, `col-span` classes actually do. |

**Morning — Flexbox**

Flexbox solves one-dimensional layout: a row or column of items.

Key flex container properties:
- `display: flex` — creates a flex container. Direct children become flex items.
- `flex-direction: row | column` — main axis direction
- `justify-content` — alignment along the main axis: `flex-start`, `center`, `space-between`, `space-around`
- `align-items` — alignment along the cross axis: `flex-start`, `center`, `stretch`
- `gap` — space between items (no margin needed)
- `flex-wrap: wrap` — items wrap to next line when they overflow

Key flex item properties:
- `flex: 1` — shorthand for `flex-grow: 1; flex-shrink: 1; flex-basis: 0`. Items grow to fill available space equally.
- `flex: 0 0 200px` — fixed 200px width, no grow, no shrink

**CSS Grid**

Grid solves two-dimensional layout: rows AND columns simultaneously.

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}
```

This creates as many 300px-minimum columns as fit, stretching them to fill the row. No media queries needed. Tailwind's responsive grid classes compile to this.

**Responsive design with `clamp()`**:

```css
font-size: clamp(1rem, 2.5vw, 2rem);
```

Minimum 1rem, maximum 2rem, scales with viewport width. No breakpoints needed for typography.

---

### Thursday — Week 2 · CSS Animations + Transitions + Tailwind CSS

| | |
|---|---|
| 🛠 **Technologies** | CSS animations, `@keyframes`, CSS transitions, Tailwind CSS |
| 📖 **Concepts** | Transition properties, `transform` vs layout properties (GPU layer), `will-change`, `@keyframes`, animation compositing, Tailwind's utility-first model |
| 🎯 **You Build** | FleetPulse UI rebuilt with Tailwind. All custom CSS deleted. `cn()` and `cva()` utility for conditional classes. |
| 🔗 **Why It Matters** | Animating `transform` and `opacity` uses the GPU compositor — 60fps. Animating `top/left/width/height` causes reflow — janky. This is why Motion/Framer Motion only animates transform and opacity by default. |

**Morning — CSS Animations Done Right**

Only animate **transform** and **opacity** for smooth 60fps animations. These properties are handled by the GPU compositor and do not trigger layout or paint.

```css
/* ✅ GPU-accelerated — smooth */
.card:hover { transform: translateY(-4px); opacity: 0.9; transition: transform 0.2s, opacity 0.2s; }

/* ❌ Triggers reflow — janky */
.card:hover { top: -4px; margin-top: -4px; }
```

`will-change: transform` hints to the browser to promote the element to its own GPU layer before the animation starts. Use sparingly — too many GPU layers wastes VRAM.

**Tailwind CSS**

Tailwind generates utility classes from a design system. `flex items-center gap-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600` replaces 20 lines of CSS. You never name classes. You never context-switch between HTML and CSS files.

`cn()` for conditional classes:
```typescript
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
const cn = (...inputs) => twMerge(clsx(inputs));

<button className={cn('px-4 py-2 rounded', isActive && 'bg-blue-500', isDisabled && 'opacity-50 cursor-not-allowed')} />
```

`cva()` (Class Variance Authority) for component variants — defines all visual variants of a component in one place with TypeScript safety.

---

### Friday — Week 2 · Shadcn UI + Radix UI + Component Systems

| | |
|---|---|
| 🛠 **Technologies** | Shadcn UI, Radix UI, Tailwind |
| 📖 **Concepts** | Headless components, compound component pattern, controlled vs uncontrolled, accessibility built-in (keyboard navigation, ARIA), owning your component source |
| 🎯 **You Build** | FleetPulse UI uses Shadcn: DataTable for driver list, Dialog for trip detail, Command palette for search |
| 🔗 **Why It Matters** | Radix UI provides the accessibility and keyboard navigation logic. Tailwind provides the styling. Shadcn combines both and puts the code in your repo — you own it, you can modify it. |

**Morning — Headless Component Architecture**

A **headless component** provides behavior and accessibility with no opinion on visual appearance. Radix UI's `<Dialog.Root>`, `<Dialog.Overlay>`, `<Dialog.Content>` handle:
- Focus trap when dialog opens (keyboard users cannot tab outside)
- `Escape` key closes the dialog
- `aria-modal`, `role="dialog"`, `aria-labelledby` automatically set
- Click outside to close

Shadcn takes Radix primitives and wraps them in Tailwind-styled components. You run `npx shadcn-ui@latest add button` and the **source code is copied into your project** at `components/ui/button.tsx`. You own the code. You can modify every pixel without forking a library.

This is profoundly different from a component library like MUI — with Shadcn, there is no black box, no version lock-in, no `!important` fights.

### Weekend Capstone — Web Fundamentals Complete

All 5 platform landing pages have: semantic HTML (passes WAVE), Tailwind CSS with Shadcn components, Lighthouse 90+ score, deployed to Cloudflare Pages. DNS configured. Deploy script working.

---

## Week 3 — JavaScript Engine: Types, Scope, Closures, Prototypes, `this`

---

### Monday — Week 3 · JavaScript Types + Coercion + VS Code Setup

| | |
|---|---|
| 🛠 **Technologies** | Node.js 22 LTS, VS Code with ESLint + Prettier + Error Lens, TypeScript |
| 📖 **Concepts** | Primitive vs reference types, `typeof`, `===` vs `==`, truthy/falsy, `null` vs `undefined` vs `NaN`, type coercion rules |
| 🎯 **You Build** | `packages/utils/validate.ts` — GPS coordinate validator using strict type checks. 20 Vitest tests for edge cases. |
| 🔗 **Why It Matters** | Type coercion bugs are silent. `"5" == 5` is true. `[] == false` is true. `null == undefined` is true but `null === undefined` is false. These cause production bugs. |

**Morning — JavaScript Types in Depth**

JavaScript has 8 types. 7 are **primitives** (stored by value, immutable): `string`, `number`, `bigint`, `boolean`, `null`, `undefined`, `symbol`. 1 is a **reference type**: `object` (arrays, functions, and all objects are objects under the hood).

```javascript
typeof "hello"     // "string"
typeof 42          // "number"
typeof true        // "boolean"
typeof undefined   // "undefined"
typeof null        // "object" ← famous bug in the spec, never fixed for backwards compatibility
typeof []          // "object"
typeof function(){} // "function"
```

Truthy/falsy — values that evaluate to false in boolean context: `false`, `0`, `""`, `null`, `undefined`, `NaN`. Everything else is truthy. Surprise: `[]` is truthy. `{}` is truthy. `"0"` is truthy.

`NaN`: Not a Number. `typeof NaN === "number"` (another spec quirk). `NaN !== NaN` — NaN is not equal to itself. Use `Number.isNaN(x)` not `x === NaN` to check.

**ESLint + Prettier Setup**:
- ESLint catches real bugs: undefined variables, unused imports, unsafe coercions
- Prettier formats code (indentation, quotes, semicolons) consistently across the entire team
- Error Lens shows lint errors inline in VS Code without opening the Problems panel
- Configure `eslint` with TypeScript rules: `@typescript-eslint/no-explicit-any`, `@typescript-eslint/no-floating-promises`

---

### Tuesday — Week 3 · Scope + Closures + `var`/`let`/`const`

| | |
|---|---|
| 🛠 **Technologies** | Node.js, TypeScript, Vitest |
| 📖 **Concepts** | Lexical scope, closure mechanics, hoisting, Temporal Dead Zone, IIFE, module scope |
| 🎯 **You Build** | `packages/utils/retry.ts` — exponential backoff with jitter, closure over config. 8 Vitest tests. |
| 🔗 **Why It Matters** | Closures are used in every callback, every React hook, every module. The loop variable bug causes production bugs today in real codebases. |

**Morning — Closures Explained Once and For All**

**Lexical scope**: JavaScript determines scope at write time, not run time. A function can access variables from the scope where it was written, no matter where it is called from.

A **closure** is created every time a function is defined inside another function. The inner function holds a reference to the outer function's variables — even after the outer function has returned and its stack frame is gone.

```javascript
function makeCounter() {
  let count = 0; // this variable lives in the closure
  return {
    increment: () => ++count,
    get: () => count,
  };
}
const counter = makeCounter();
counter.increment(); // count is 1
counter.increment(); // count is 2
counter.get();       // 2
// count is not accessible from outside — it is "private"
```

The infamous loop bug:
```javascript
// Bug: all log "3" because var is function-scoped
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}

// Fix: let creates a new binding per iteration
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // logs 0, 1, 2
}
```

`var` vs `let` vs `const`:
- **`var`** — function-scoped, hoisted with value `undefined`, can be redeclared. Avoid in new code.
- **`let`** — block-scoped, in Temporal Dead Zone before declaration (accessing = `ReferenceError`)
- **`const`** — block-scoped, binding cannot be reassigned. The object it points to can still be mutated.

---

### Wednesday — Week 3 · Prototypes + `class` + the Four Rules of `this`

| | |
|---|---|
| 🛠 **Technologies** | Node.js, TypeScript, Vitest |
| 📖 **Concepts** | Prototype chain, `Object.create`, `class` as syntax sugar, the 4 steps of `new`, 4 rules of `this`, arrow functions and lexical `this` |
| 🎯 **You Build** | `packages/utils/emitter.ts` — EventEmitter from scratch using private fields, prototypes, explicit `this` binding |
| 🔗 **Why It Matters** | Node.js Streams, EventEmitter, and every browser API are built on prototypes. Understanding `this` prevents the most common JavaScript bug category. |

**Morning — JavaScript's Object System**

JavaScript does not have classes in the traditional sense. It has **prototypes**. `class` is syntax sugar — it compiles to the same prototype-based code.

The **prototype chain**: when you access a property on an object and it is not there, JavaScript looks at `object.__proto__`, then `object.__proto__.__proto__`, all the way to `null`. This is inheritance in JavaScript.

The 4 steps of `new Foo()`:
1. Create a new empty object `{}`
2. Set its `__proto__` to `Foo.prototype`
3. Call `Foo` with `this` pointing to the new object
4. Return `this` (or the explicitly returned object if it is an object)

**The 4 rules of `this`** — evaluated in order:

| Priority | Rule | Example |
|----------|------|---------|
| 1 (highest) | `new` binding | `new Foo()` → `this` = new object |
| 2 | Explicit binding | `fn.call(obj)` → `this` = `obj` |
| 3 | Implicit binding | `obj.fn()` → `this` = `obj` |
| 4 (lowest) | Default binding | `fn()` → `this` = `globalThis` (or `undefined` in strict mode) |

**Arrow functions** have no own `this`. They capture `this` from the lexical scope where they are written. This is why you can use `() => this.method()` inside a class without losing the instance reference.

---

### Thursday — Week 3 · Event Loop — The Most Important JavaScript Concept

| | |
|---|---|
| 🛠 **Technologies** | Node.js, Chrome DevTools Performance tab |
| 📖 **Concepts** | Call stack, Web APIs/libuv, macrotask queue, microtask queue, `process.nextTick`, `setImmediate` ordering |
| 🎯 **You Build** | `packages/utils/scheduler.ts` — priority task scheduler using min-heap. 20 execution-order puzzles predicted correctly. |
| 🔗 **Why It Matters** | Every performance bug, every mysterious callback ordering, every "why did my code run in the wrong order" question is an event loop question. |

**Morning — The Event Loop, Step by Step**

JavaScript is single-threaded: it executes one thing at a time. The event loop coordinates what runs next.

Three areas:

**Call Stack**: synchronous code. When you call a function, it is pushed. When it returns, it is popped. When the stack is empty, the event loop picks the next task.

**Web APIs / libuv**: async operations. `setTimeout(cb, 0)` registers `cb` with the timer API. When the timer fires, `cb` is placed in the macrotask queue. `fetch()` is handled by libuv. `fs.readFile` is handled by a thread pool.

**Queues**:
- **Microtask queue** — `Promise.then`, `queueMicrotask`, `MutationObserver`. **Drained completely before the next macrotask.**
- **Macrotask queue** — `setTimeout`, `setInterval`, I/O callbacks, `setImmediate`

**Node.js-specific**: `process.nextTick` fires before any microtasks. `setImmediate` fires in the Check phase (after I/O, before timers).

**Full execution order**: synchronous code → `process.nextTick` → Promise microtasks → macrotasks (one at a time) → repeat

Predict the output of these puzzles:
```javascript
// Puzzle 1
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');
// Output: A D C B

// Puzzle 2
process.nextTick(() => console.log('tick'));
Promise.resolve().then(() => console.log('promise'));
setImmediate(() => console.log('immediate'));
console.log('sync');
// Output: sync tick promise immediate
```

---

### Friday — Week 3 · Promises + `async/await` + Generators

| | |
|---|---|
| 🛠 **Technologies** | Node.js, TypeScript, Vitest |
| 📖 **Concepts** | Promise states, `.then`/`.catch`/`.finally`, `async/await` as syntax sugar, `Promise.all`/`allSettled`/`race`/`any`, generators, `Symbol.iterator` |
| 🎯 **You Build** | `packages/utils/concurrent.ts` — `ConcurrencyLimiter` class + reimplemented `Promise.all` from scratch. 10 tests. |
| 🔗 **Why It Matters** | Every database query, HTTP call, and file operation is a Promise. Misunderstanding them causes silent bugs and unhandled rejections that crash Node.js processes. |

**Morning — Promises Demystified**

A Promise is an object with 3 states: **pending** (in flight), **fulfilled** (has a value), **rejected** (has an error). Once settled, the state never changes.

`async/await` is pure syntax sugar: every `async` function returns a Promise. Every `await` expression calls `.then()` and suspends the function — but does NOT block the thread. Other microtasks and macrotasks continue running.

```javascript
// These are identical:
function fetchUser() {
  return getUser(id).then(user => user.name);
}
async function fetchUser() {
  const user = await getUser(id);
  return user.name;
}
```

Promise combinators:
- **`Promise.all`** — wait for all; fail fast on first rejection
- **`Promise.allSettled`** — wait for all; collect all results regardless of success/failure
- **`Promise.race`** — first to settle wins (use for timeouts)
- **`Promise.any`** — first to fulfill wins; only rejects if all reject

**Generators**: a `function*` can `yield` values one at a time. Execution pauses at `yield` and resumes when `.next()` is called. Used for: lazy infinite sequences, custom iterables, `for...of` loops over async data.

### Weekend Capstone — FleetPulse v0.1

All 5 utilities tested and benchmarked: `retry`, `memoize`, `emitter`, `scheduler`, `ConcurrencyLimiter`. FleetPulse raw HTTP server handles 500 concurrent requests. `packages/types` has all shared interfaces. CI green.

---

## Week 4 — JavaScript Applied: Modules, Functional Patterns, Immutability, TypeScript

---

### Monday — Week 4 · CommonJS vs ESM + Functional Patterns

| | |
|---|---|
| 🛠 **Technologies** | Node.js (`require`/`import`), TypeScript, Vitest |
| 📖 **Concepts** | CommonJS synchronous loading, ESM static analysis, tree shaking, circular dependency behavior, `map`/`filter`/`reduce`, `pipe`/`compose`, currying |
| 🎯 **You Build** | `packages/utils/fp.ts` — `pipe`, `compose`, `curry`, `partial`, `memoize` with proper TypeScript generics. 20 tests. |
| 🔗 **Why It Matters** | ESM's static analysis enables tree shaking — removing dead code at build time. Every modern bundler (Vite, esbuild, Rollup) requires ESM for this. |

**Morning — Module Systems**

**CommonJS** (`require`): synchronous — `require()` blocks until the file loads. Modules are cached after first load. Circular dependencies return a partially-constructed object (the part that ran before the cycle was hit).

**ESM** (`import`/`export`): static — the import graph is analyzed before any code runs. This enables tree shaking: if you import `{ formatDate }` from a utility library and `formatDate` has no side effects, the bundler can exclude all other exports from the bundle. Dynamic `import()` is asynchronous — it returns a Promise.

**Functional patterns** — implement from scratch, then use built-ins:
- `map` = transform each element (like a SELECT in SQL)
- `filter` = keep matching elements (like a WHERE in SQL)
- `reduce` = collapse to a value (like an aggregation in SQL)
- `pipe(f, g, h)(x)` = `h(g(f(x)))` — left to right
- `curry(add)(2)(3)` = `add(2, 3)` — enables partial application

---

### Tuesday — Week 4 · Immutability + Structural Sharing + WeakMap

| | |
|---|---|
| 🛠 **Technologies** | TypeScript, `structuredClone`, `WeakMap`, `Object.freeze`, Immer.js |
| 📖 **Concepts** | Shallow copy vs deep clone, structural sharing, referential equality, garbage collection, WeakMap for metadata without leaks |
| 🎯 **You Build** | Persistent (immutable) binary search tree where `insert` creates a new path, leaving old tree intact. Verify old versions unchanged after insert. |
| 🔗 **Why It Matters** | React's re-render check is `state === prevState`. Mutating in place skips re-renders silently. This is the #1 source of React bugs in large codebases. |

---

### Wednesday — Week 4 · TypeScript Deep — Generics + Conditional Types + Branded Types

| | |
|---|---|
| 🛠 **Technologies** | TypeScript compiler, `tsconfig.json` strict mode |
| 📖 **Concepts** | Generics with constraints, conditional types (`T extends U ? X : Y`), `infer`, mapped types, template literal types, branded/nominal types |
| 🎯 **You Build** | `packages/types` — all entity IDs become branded types. `ApiResponse<T>` conditional type. No `any` anywhere. |
| 🔗 **Why It Matters** | Branded types make it impossible to pass a `DriverId` where a `UserId` is expected — at compile time. This eliminates an entire bug category. |

**Branded types** pattern:
```typescript
type UserId  = string & { readonly _brand: 'UserId'  };
type DriverId = string & { readonly _brand: 'DriverId' };

function getUser(id: UserId) { /* ... */ }
const driverId = 'd-123' as DriverId;
getUser(driverId); // ✅ TypeScript error — wrong brand
```

Both are `string` at runtime. TypeScript treats them as incompatible at compile time. Zero runtime cost.

---

### Thursday — Week 4 · Zod — Runtime Validation + TypeScript Types from One Schema

| | |
|---|---|
| 🛠 **Technologies** | Zod, TypeScript |
| 📖 **Concepts** | One schema = runtime validation + TypeScript type, `z.infer`, `safeParse`, discriminated unions, recursive schemas, transforms, refinements |
| 🎯 **You Build** | `packages/schemas` — all schemas for all 5 platforms. Change one field → TypeScript errors propagate everywhere. |
| 🔗 **Why It Matters** | Without Zod, your TypeScript interface and your runtime validation logic can drift apart. With Zod, they are the same declaration by definition. |

---

### Friday — Week 4 · Motion (Framer Motion) + Browser APIs

| | |
|---|---|
| 🛠 **Technologies** | Motion/Framer Motion, `IntersectionObserver`, `ResizeObserver`, `AbortController`, Canvas |
| 📖 **Concepts** | `AnimatePresence` for mount/unmount animations, `layoutId` for shared element transitions, GPU-only animation, `IntersectionObserver` for lazy loading |
| 🎯 **You Build** | FleetPulse driver cards animate in/out with `AnimatePresence`. Map canvas redraws with `requestAnimationFrame`. Image lazy loading with `IntersectionObserver`. |
| 🔗 **Why It Matters** | Motion handles the GPU-only constraint for you — it only animates `transform` and `opacity` internally, ensuring 60fps animations regardless of element count. |

### Weekend Capstone — All 5 Platform Shells + All Utilities

All 5 platforms have raw HTTP servers. `packages/utils`, `packages/types`, `packages/schemas` are complete. HTML + CSS + Tailwind + Shadcn on all frontends. GitHub Actions CI green.

---

---

# MONTH 2 — JavaScript Deep + Node.js + TypeScript Mastery

> Month 1 was the foundation. Month 2 is production Node.js: the V8 internals, libuv, streams with backpressure, worker threads, crypto, and the complete TypeScript type system. By the end of this month you can write Node.js without tutorials.
>
> **Infraspec goal this month:** JWT RS256 auth and OAuth2 PKCE flow implemented. Webhook HMAC signing live on DungBeetle. `AsyncLocalStorage` for request-scoped context — the foundation of distributed tracing. TypeScript strict mode with zero `any` across all projects.
>
> **RFC this month:** "DungBeetle Job Queue Design — PostgreSQL SKIP LOCKED vs Redis BRPOP vs Kafka." One page. Three options. Recommendation with tradeoffs. This is exactly how Infraspec engineers communicate decisions to clients.
>
> **AI workflow:** Use Claude to generate the first RFC draft, then rewrite it completely in your own words. You must be able to defend every sentence. Claude drafts, you own.

---

## Week 5 — Node.js Internals: V8, libuv, Streams, `worker_threads`

---

### Monday — Week 5 · V8 Architecture — How Node.js Runs Your Code

| | |
|---|---|
| 🛠 **Technologies** | `node --inspect`, Chrome DevTools Memory/Performance tabs |
| 📖 **Concepts** | JIT pipeline (Ignition bytecode → TurboFan native code), hidden classes, inline caching, generational GC (young/old generation), GC pauses |
| 🎯 **You Build** | Flame graph analysis of two function versions — consistent vs inconsistent property order. Document the speedup from fixing hidden class deoptimization. |
| 🔗 **Why It Matters** | Hidden class deoptimization can silently make a function 10x slower. Knowing this lets you write high-performance object-heavy code. |

**Concepts — Inside V8**

V8's JIT pipeline:
1. **Parser** → source code → AST (Abstract Syntax Tree)
2. **Ignition** → AST → bytecode (fast to generate, interpreted immediately)
3. **TurboFan** → hot bytecode → optimized native machine code

**Hidden classes**: V8 assigns a hidden class to every object based on its shape (which properties exist, in what order). Objects with identical shapes share a hidden class, allowing V8 to generate optimized property access. Adding properties in different orders creates different hidden classes — V8 must deoptimize and fall back to slower dictionary-based access.

**Generational GC**: Objects are born in the **young generation** (nursery) — collected frequently with a fast scavenge algorithm. Objects that survive 2 collections are promoted to the **old generation** — collected with a slower mark-and-sweep that causes a "stop the world" pause. Allocating many short-lived objects in hot paths creates GC pressure — measure it with `v8.getHeapStatistics()`.

---

### Tuesday — Week 5 · Streams: Backpressure + `pipeline()`

| | |
|---|---|
| 🛠 **Technologies** | Node.js `stream/promises`, `Transform`, `Writable`, `Readable`, `bufio` |
| 📖 **Concepts** | Push vs pull mode, `highWaterMark`, `drain` event, backpressure, `pipeline()` error propagation, `stream.compose()` |
| 🎯 **You Build** | FleetPulse GPS log pipeline — 200MB file processed with 20MB constant RAM. Multi-stage: read → validate → enrich → batch-insert PostgreSQL. |
| 🔗 **Why It Matters** | Without backpressure handling, a fast readable overfills memory and crashes. Every data pipeline, every file import endpoint, every ETL process needs streams. |

**Concepts**

Without streams: `fs.readFile('200mb.jsonl', callback)` — 200MB allocated in memory before processing begins.

With streams: data flows in 64KB chunks by default. Each chunk is processed and garbage collected. Memory usage is constant.

**Backpressure mechanism**: `writable.write(chunk)` returns `false` when the internal buffer exceeds `highWaterMark`. This is the signal to stop reading. Resume on the `'drain'` event. `pipeline()` handles this automatically — it also destroys all streams in the chain when any one errors, preventing resource leaks.

Multi-stage pipeline for FleetPulse:
```javascript
await pipeline(
  fs.createReadStream('gps_events.jsonl'),
  new SplitLinesTransform(),       // chunk → lines
  new ValidateTransform(),          // parse + Zod validate
  new EnrichWithZoneTransform(),    // add zone data
  new PostgresBatchWritable(db, 500) // bulk insert every 500 rows
);
// memory stays < 25MB for any file size
```

---

### Wednesday — Week 5 · Event Loop Phases Deep + `worker_threads` + `cluster`

| | |
|---|---|
| 🛠 **Technologies** | Node.js `worker_threads`, `cluster`, `SharedArrayBuffer`, `Atomics` |
| 📖 **Concepts** | All 6 event loop phases in order, `process.nextTick` placement, `worker_threads` with `SharedArrayBuffer`, `cluster` module for multi-CPU |
| 🎯 **You Build** | Benchmark: bcrypt hashing single-thread vs 4 worker threads. 4x speedup documented. |
| 🔗 **Why It Matters** | Node.js is single-threaded for JS but can use all CPU cores. Knowing which to use (`worker_threads` for CPU-bound, `cluster` for I/O-bound) is a senior-level decision. |

**The Six Event Loop Phases (in order)**:

| Phase | What runs |
|-------|-----------|
| **Timers** | Expired `setTimeout` / `setInterval` callbacks |
| **Pending callbacks** | I/O error callbacks deferred from previous tick |
| **Idle / prepare** | Internal Node.js only |
| **Poll** | New I/O events. **Node.js waits here** if queue is empty and no timers pending. |
| **Check** | `setImmediate` callbacks |
| **Close callbacks** | `socket.on('close')` etc. |

`process.nextTick` runs **between every phase**, not just at the end. `Promise` microtasks also run between phases (after `nextTick`).

`worker_threads`: each worker has its own V8 instance and event loop — true parallelism. `SharedArrayBuffer` lets workers share memory. `Atomics` provides atomic operations for safe concurrent writes.

`cluster`: forks N copies of the process, each with its own event loop. Shares a port via the OS. Round-robin load balancing between workers. Used for I/O-heavy servers that need more than one Node.js event loop.

---

### Thursday — Week 5 · `crypto`, `net`, `AsyncLocalStorage`

| | |
|---|---|
| 🛠 **Technologies** | Node.js `crypto`, `net`, `AsyncLocalStorage` |
| 📖 **Concepts** | HMAC-SHA256 for webhook signing, raw TCP server, `AsyncLocalStorage` for request-scoped context, `Buffer` encodings |
| 🎯 **You Build** | DungBeetle webhook HMAC signer/verifier. Request-scoped logger that includes `requestId`/`traceId` with zero prop-drilling. |
| 🔗 **Why It Matters** | HMAC is how Stripe, GitHub, and every webhook provider signs payloads. AsyncLocalStorage is how OpenTelemetry propagates trace context without touching every function signature. |

**HMAC Webhook Signing**:
```javascript
const signature = crypto
  .createHmac('sha256', webhookSecret)
  .update(rawBody)
  .digest('hex');
// Send as header: X-Webhook-Signature: sha256=<signature>
// Receiver verifies: compute same signature, compare with timingSafeEqual
```

`crypto.timingSafeEqual`: compare two Buffers in constant time. Regular string comparison (`===`) short-circuits at the first mismatch — this leaks timing information that can be used to brute-force the signature. Always use `timingSafeEqual` for comparing secrets.

**`AsyncLocalStorage`**: stores request-scoped data that propagates through all `async/await` chains without being passed as a parameter.

---

### Friday — Week 5 · `perf_hooks`, `v8`, Memory Profiling, `clinic.js`

| | |
|---|---|
| 🛠 **Technologies** | `perf_hooks`, `v8` module, `clinic.js`, `autocannon` |
| 📖 **Concepts** | `performance.now()` precision, `PerformanceObserver`, heap statistics, GC monitoring, flame graph interpretation, HTTP load testing |
| 🎯 **You Build** | Profile GPS pipeline. Find top allocator (`JSON.parse`). Replace with streaming parser. Before/after: 40% allocation reduction per request. |
| 🔗 **Why It Matters** | Profiling is the difference between "I think this is fast" and "I proved this is fast." `clinic.js` is the tool the Node.js core team uses. |

---

## Week 6 — TypeScript Mastery + Shared Packages + DungBeetle Scaffold

---

### Monday–Tuesday — Week 6 · TypeScript Compiler API + Module Augmentation

| | |
|---|---|
| 🛠 **Technologies** | TypeScript, `tsc --noEmit`, `tsconfig.json` strict options |
| 📖 **Concepts** | `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, declaration merging, extending `process.env`, compile-time assertions |
| 🎯 **You Build** | Typed Express `Request` with `user` field via declaration merging. Typed `process.env` with required keys. Zero `any` across monorepo. |
| 🔗 **Why It Matters** | `noUncheckedIndexedAccess` makes `arr[i]` return `T | undefined`, forcing bounds checks. This catches a whole class of runtime crashes at compile time for free. |

---

### Wednesday — Week 6 · `packages/api` — Typed HTTP Client

| | |
|---|---|
| 🛠 **Technologies** | TypeScript, `fetch`, `AbortController`, Zod |
| 📖 **Concepts** | Generic typed fetch wrapper, request body validation, response Zod parsing, error type narrowing, abort signal propagation |
| 🎯 **You Build** | `packages/api` — typed HTTP client used by all 5 platforms. No untyped `fetch` calls anywhere in the monorepo. |
| 🔗 **Why It Matters** | The API boundary is where TypeScript safety breaks down. This package ensures full type safety from button click to server response. |

---

### Thursday–Friday — Week 6 · DungBeetle v0.1 + JWT Auth + RBAC

| | |
|---|---|
| 🛠 **Technologies** | Node.js, Express, PostgreSQL (`SELECT FOR UPDATE SKIP LOCKED`), Redis, JWT RS256 |
| 📖 **Concepts** | Concurrent job claiming with skip-locked, JWT RS256 asymmetric auth, refresh token rotation, RBAC middleware |
| 🎯 **You Build** | DungBeetle v0.1 in Node.js. `packages/auth` with JWT + RBAC shared across all platforms. |
| 🔗 **Why It Matters** | `SELECT FOR UPDATE SKIP LOCKED` is the correct atomic job claim pattern. RS256 means only the auth server can mint tokens — services can verify with the public key only. |

**`SELECT FOR UPDATE SKIP LOCKED`**: multiple workers query pending jobs simultaneously. Without locking, two workers claim the same job (race condition). With `SKIP LOCKED`, each worker atomically claims the next unlocked row — workers skip rows already being processed.

### Weekend Capstone — All 5 Platforms Full-Stack v1.0

All 5 platforms: React frontend ← Express API ← PostgreSQL + Redis + JWT with 3 roles. CI green. This ends Month 2.

---

---

# MONTH 3 — Go Mastery: Language, Concurrency, Stdlib, Benchmarking

> Go is the backend language for all 5 projects. One full month on the language before any project uses it in production. Every day ends with `go test -race ./...` passing and `goleak.VerifyNone(t)` confirming zero goroutine leaks.
>
> **Infraspec goal this month:** Go is your second backend language at production depth. gRPC service definitions + code generation mastered. By Month 3 end, you have two backend languages you can speak fluently — TypeScript/Node.js and Go. This directly satisfies Infraspec's "working knowledge of a second backend language" requirement.
>
> **RFC this month:** "DungBeetle v0.1 → Go Rewrite — Why Go over Node.js for the job worker." One page. Covers: goroutine-per-job model, `go test -race`, `goleak`, benchmark numbers before/after. Written as if presenting to an Infraspec client engineering team.
>
> **AI workflow:** Use GitHub Copilot for Go boilerplate (struct tags, error wrapping patterns). Use Claude to review your RFC and give feedback on clarity — then implement the feedback yourself.

---

## Week 7 — Go Language Core

---

### Monday — Week 7 · Module System + Types + Interfaces

| | |
|---|---|
| 🛠 **Technologies** | Go 1.22+, `go mod`, `gopls` |
| 📖 **Concepts** | `go.mod`, `go.sum`, `internal/` packages, zero values, type definitions vs aliases, implicit interface satisfaction, `io.Reader`/`io.Writer` pattern |
| 🎯 **You Build** | Go reimplementation of `packages/utils` — `retry`, `emitter`, `concurrent`. Note: explicit error returns vs JS `try/catch`. |
| 🔗 **Why It Matters** | Go's implicit interfaces enable loose coupling without annotation. Zero values mean you never have uninitialized memory — every type is safe to use before assignment. |

---

### Tuesday — Week 7 · Error Handling + Slices + Maps + Structs

| | |
|---|---|
| 🛠 **Technologies** | Go `errors` package, `fmt.Errorf` |
| 📖 **Concepts** | `%w` error wrapping, `errors.Is`/`errors.As`, sentinel errors, slice internals (pointer+len+cap), `append` reallocation, nil map panic |
| 🎯 **You Build** | FleetPulse zone lookup in Go — `map[string]Zone`, custom error types for different failure modes, 20 table-driven tests. |
| 🔗 **Why It Matters** | `fmt.Errorf("zone: %w", err)` wraps errors with context while preserving the original for `errors.Is` inspection. This is how production Go code provides useful error messages at every layer. |

---

### Wednesday — Week 7 · Closures + `defer` + `panic`/`recover`

| | |
|---|---|
| 🛠 **Technologies** | Go, `goleak` |
| 📖 **Concepts** | Go closures (same loop variable bug as JS, same fix), `defer` LIFO semantics, guaranteed cleanup via `defer`, `panic` for unrecoverable errors only |
| 🎯 **You Build** | Resource pool with deferred cleanup — `panic` inside critical section still releases the resource via `defer`. |
| 🔗 **Why It Matters** | `defer mu.Unlock()` immediately after `mu.Lock()` — they should never be separated. Defer guarantees the unlock even if the function panics or has 10 return paths. |

---

### Thursday — Week 7 · Build Tools + `golangci-lint` + Generics

| | |
|---|---|
| 🛠 **Technologies** | `go vet`, `golangci-lint`, `staticcheck`, `errcheck`, Go 1.22 type parameters |
| 📖 **Concepts** | Static analysis, `errcheck` (every error must be handled), generic type parameters, constraints (`comparable`, `~int`), when generics vs interfaces |
| 🎯 **You Build** | `golangci-lint` configured for the monorepo — every warning fixed. Generic `Set[T comparable]`, generic `Result[T]`. |
| 🔗 **Why It Matters** | `errcheck` catches every silently ignored error — the Go equivalent of `catch(e) {}` in JavaScript. Generics eliminate duplicated code for typed collections. |

---

### Friday — Week 7 · Testing + `pprof` Basics

| | |
|---|---|
| 🛠 **Technologies** | Go `testing`, `testify/assert`, `go test -bench`, `go test -race` |
| 📖 **Concepts** | Table-driven tests, `t.Run` subtests, `testing.B` benchmarks, `b.ResetTimer`, `b.RunParallel`, `go test -race` ThreadSanitizer |
| 🎯 **You Build** | `BENCHMARKS.md` for all Go utilities. Race detector passing on all tests. |
| 🔗 **Why It Matters** | `go test -race` instruments every memory access. Data races that appear once in a million runs are caught every time. It must pass before every commit. |

---

## Week 8 — Go Concurrency

---

### Monday — Week 8 · Goroutines + Go Scheduler (M:N Model)

| | |
|---|---|
| 🛠 **Technologies** | Go runtime, `runtime` package, `goleak` |
| 📖 **Concepts** | G (goroutine), M (OS thread), P (processor), GOMAXPROCS, work stealing, 2KB goroutine stack, async preemption (Go 1.14+) |
| 🎯 **You Build** | 10 programs demonstrating goroutine patterns. `goleak.VerifyNone(t)` in every test file. Find and fix every goroutine leak. |
| 🔗 **Why It Matters** | Go can run 100,000 goroutines on 8 cores because goroutines start at 2KB — not the 1MB an OS thread requires. Understanding work stealing explains why goroutine-heavy code auto-parallelizes. |

---

### Tuesday — Week 8 · Channels: Every Pattern

| | |
|---|---|
| 🛠 **Technologies** | Go channels, `sync.WaitGroup` |
| 📖 **Concepts** | Buffered vs unbuffered, `close()` semantics, range over channel, direction constraints (`chan<-`/`<-chan`), pipeline, fan-out, fan-in, semaphore, nil channel trick |
| 🎯 **You Build** | Full channel pattern library with race-free tests: pipeline, fan-out, fan-in, timeout with `time.After`, semaphore via buffered channel. |
| 🔗 **Why It Matters** | "Do not communicate by sharing memory; share memory by communicating." Channels are Go's answer to mutexes for coordinating goroutines. |

---

### Wednesday — Week 8 · `sync` Package: Every Tool

| | |
|---|---|
| 🛠 **Technologies** | Go `sync` package, `go test -bench` |
| 📖 **Concepts** | `Mutex` vs `RWMutex` (benchmark at 90% reads), `sync.Pool` GC pressure reduction, `sync.Once` singleton, `sync.Map` for concurrent access, sharded locks |
| 🎯 **You Build** | Concurrent LRU cache with `RWMutex`. Shard to 16 buckets. Before/after benchmark: 16x throughput improvement under contention. |
| 🔗 **Why It Matters** | Lock contention is a primary performance bottleneck in concurrent Go. Sharding reduces contention by reducing the probability that two goroutines want the same lock. |

---

### Thursday — Week 8 · `context` + `errgroup` + `singleflight`

| | |
|---|---|
| 🛠 **Technologies** | Go `context`, `golang.org/x/sync/errgroup`, `golang.org/x/sync/singleflight` |
| 📖 **Concepts** | Context propagation (always first arg, never in struct), `WithCancel`/`WithTimeout`/`WithDeadline`, `errgroup` parallel with error collection, `singleflight` thundering herd prevention |
| 🎯 **You Build** | FleetPulse `getDriverContext` — zone lookup + surge pricing + active driver count in parallel via `errgroup`. `singleflight` deduplicates geocoding calls. |
| 🔗 **Why It Matters** | Without `singleflight`, a cache miss on a popular key causes 100 concurrent goroutines to all query the database simultaneously. With it, one query happens and 100 goroutines share the result. |

---

### Friday — Week 8 · `atomic` + Race Detector Mastery

| | |
|---|---|
| 🛠 **Technologies** | Go `sync/atomic`, `go tool pprof` |
| 📖 **Concepts** | `atomic.Int64`, `atomic.Bool`, `atomic.Pointer[T]`, CAS (Compare-And-Swap), when to use atomic vs Mutex, pprof mutex contention profiling |
| 🎯 **You Build** | Replace one Mutex in the LRU cache with `atomic` operations where appropriate. Benchmark: atomics vs mutex for single-integer counter. |
| 🔗 **Why It Matters** | For single-value updates (counters, flags), `atomic` operations are faster than mutexes — no OS context switch. Pprof mutex contention shows you exactly which locks are bottlenecks. |

---

## Week 9 — Go Stdlib Deep

---

### Monday — Week 9 · `net/http` + `chi` Router + Middleware

| | |
|---|---|
| 🛠 **Technologies** | Go `net/http`, `chi` router |
| 📖 **Concepts** | `http.Handler` interface, middleware chain pattern (`func(http.Handler) http.Handler`), `ServeMux` Go 1.22 pattern matching, all server timeouts, `http.Transport` pooling |
| 🎯 **You Build** | FleetPulse Go API: `chi` router, middleware chain (logging, auth, request ID, recovery), server with all 4 timeouts set. |
| 🔗 **Why It Matters** | A server without `ReadTimeout` hangs forever on slow clients — eventually exhausting file descriptors. Every production Go HTTP server must have all 4 timeouts set. |

---

### Tuesday–Wednesday — Week 9 · `io`, `bufio`, `encoding/json`, `slog`

| | |
|---|---|
| 🛠 **Technologies** | Go `io`, `bufio`, `encoding/json`, `slog` (Go 1.21+) |
| 📖 **Concepts** | `io.Reader`/`Writer` composition, `io.TeeReader`, `io.LimitReader`, buffered I/O performance, streaming JSON decode, structured logging |
| 🎯 **You Build** | GPS file processor using `io.TeeReader` (validate + archive simultaneously). Structured logger with automatic request context. |
| 🔗 **Why It Matters** | `io.Reader` is Go's most composable interface — files, HTTP bodies, buffers, hashers, compressors all implement it. Compose them freely without copying data. |

---

### Thursday — Week 9 · `sqlc` + `pgx/v5` + `go-redis`

| | |
|---|---|
| 🛠 **Technologies** | `sqlc`, `pgx/v5`, `pgxpool`, `go-redis/v9` |
| 📖 **Concepts** | SQL → Go code generation, compile-time query validation, `pgxpool` connection pooling, `CopyFrom` bulk insert (10K rows in 10ms), Redis Lua scripts for atomicity |
| 🎯 **You Build** | FleetPulse complete database layer: `sqlc`-generated queries, `pgxpool` pool, Redis rate limiter with Lua atomic script. |
| 🔗 **Why It Matters** | `sqlc` catches SQL errors at compile time. Wrong column? Compile error. `CopyFrom` is 100x faster than individual INSERTs for bulk data. |

---

### Friday — Week 9 · `cobra` CLI + `goleak` Final

| | |
|---|---|
| 🛠 **Technologies** | `cobra`, `goleak`, `uber-go/goleak` |
| 📖 **Concepts** | Subcommands, persistent flags, `PersistentPreRunE` for shared validation, goroutine leak detection in tests |
| 🎯 **You Build** | `fleetctl` CLI: `fleetctl drivers list`, `fleetctl jobs retry`, `fleetctl workers status`. `goleak.VerifyNone` in every test file across the project. |
| 🔗 **Why It Matters** | Every production service needs an operational CLI. `cobra` is the standard — same pattern as `kubectl`, `docker`, `git`. |

---

## Week 10 — DungBeetle v0.1 in Go + Benchmarking Complete

---

### Monday–Wednesday — Week 10 · DungBeetle Rewrite: Clean Architecture

| | |
|---|---|
| 🛠 **Technologies** | Go, `chi`, `sqlc`, `pgx`, `go-redis`, `cobra` |
| 📖 **Concepts** | Clean architecture layers (handler → service → repository), dependency injection via interfaces, graceful shutdown with SIGTERM, structured error types |
| 🎯 **You Build** | DungBeetle v0.1 in Go: HTTP API, worker pool claiming jobs with `SKIP LOCKED`, status tracking via Redis, `cobra` CLI. |
| 🔗 **Why It Matters** | Graceful shutdown: when K8s sends SIGTERM, the server stops accepting new jobs, waits for in-flight jobs to complete, then exits. Without this, jobs are abandoned mid-execution. |

---

### Thursday–Friday — Week 10 · Full Benchmark Suite

| | |
|---|---|
| 🛠 **Technologies** | `go test -bench`, `pprof`, `go test -race` |
| 📖 **Concepts** | `b.ResetTimer`, `b.RunParallel`, CPU profile interpretation, mutex contention profiling, allocation per op |
| 🎯 **You Build** | `BENCHMARKS.md`: every data structure and algorithm benchmarked. Regressions caught by CI. |
| 🔗 **Why It Matters** | Performance claims without benchmarks are fiction. These numbers are what you cite in interviews. |

### Weekend Capstone — Go Mastery Complete

`go test -race ./...` passes everywhere. `goleak.VerifyNone` passes everywhere. DungBeetle v0.1 deployed. `BENCHMARKS.md` written. This ends Month 3.

---

---

# MONTH 4 — React + Frameworks + Testing + Dev Tools

> Frameworks make sense now because you understand vanilla JavaScript deeply. You know what React abstracts because you did it by hand. This month you build all 5 platform frontends properly.

---

## Week 11 — React Fundamentals + Tanstack Query + Zustand

---

### Monday — Week 11 · React: `UI = f(state)` + All Core Hooks

| | |
|---|---|
| 🛠 **Technologies** | React 18, ReactDOM, React DevTools Profiler |
| 📖 **Concepts** | Virtual DOM, reconciliation, fiber, `useState`, `useEffect`, `useRef`, `useCallback`, `useMemo`, `useContext`, `useReducer`, `React.memo` |
| 🎯 **You Build** | FleetPulse driver dashboard in React — replaces the vanilla JS version from Week 2. Profiler shows zero unnecessary re-renders. |
| 🔗 **Why It Matters** | Understanding reconciliation tells you when `React.memo` helps (when props are stable references) and when it hurts (when the memo comparison is more expensive than the render). |

React's model: `UI = f(state)`. Same state → same UI. State changes → React re-renders and diffs the new tree against the old (reconciliation). Only actual DOM differences are applied.

Hook reference:
- `useState` — local state; setter schedules re-render
- `useEffect(fn, deps)` — side effect after render; cleanup function on unmount and before next effect
- `useCallback(fn, deps)` — memoize function reference; prevents child re-renders when passing callbacks
- `useMemo(fn, deps)` — memoize computed value; only for genuinely expensive computations
- `useRef` — mutable value that does not trigger re-render; also for DOM references
- `useReducer(reducer, initialState)` — for complex state machines; `dispatch(action)` pattern
- `useContext` — consume context value; every consumer re-renders on any context change

---

### Tuesday — Week 11 · Tanstack Query (React Query)

| | |
|---|---|
| 🛠 **Technologies** | Tanstack Query v5, Zod |
| 📖 **Concepts** | `useQuery` lifecycle (loading/error/success), `staleTime` vs `gcTime`, background refetch, optimistic updates with rollback, `useMutation`, query invalidation |
| 🎯 **You Build** | RouteMaster order list with optimistic status updates — UI updates instantly, rolls back on API failure with zero flicker. |
| 🔗 **Why It Matters** | Manual `useEffect` + `useState` for data fetching creates: missing loading states, missing error states, stale data after mutations, race conditions on fast navigation. Tanstack Query solves all of these. |

---

### Wednesday — Week 11 · Zustand + Immer

| | |
|---|---|
| 🛠 **Technologies** | Zustand, Immer.js, Tailwind |
| 📖 **Concepts** | Store creation with `create<T>`, selective subscription (renders only when subscribed slice changes), Immer `produce` for safe mutations, devtools middleware |
| 🎯 **You Build** | FleetPulse: global driver state in Zustand. Map viewport in a separate store slice. Components subscribe only to their slice — no unnecessary re-renders. |
| 🔗 **Why It Matters** | React Context re-renders every consumer when any context value changes. Zustand's selective subscription re-renders only components that subscribed to the changed value. |

---

### Thursday — Week 11 · Next.js App Router + Server Components

| | |
|---|---|
| 🛠 **Technologies** | Next.js 14, React Server Components, `'use client'` directive |
| 📖 **Concepts** | Server Components (render on server, zero JS shipped), `'use client'` boundary, ISR (Incremental Static Regeneration), streaming Suspense, Server Actions |
| 🎯 **You Build** | RouteMaster customer app in Next.js — public listing is Server Component (0 KB JS), interactive order tracker is `'use client'`. |
| 🔗 **Why It Matters** | Server Components render to HTML on the server — zero JavaScript bundle for static content. This is how you get a 90+ Lighthouse performance score on content-heavy pages. |

---

### Friday — Week 11 · Tanstack Start + Svelte + Vue 3

| | |
|---|---|
| 🛠 **Technologies** | Tanstack Start, SvelteKit, Vue 3 + Nuxt, Pinia |
| 📖 **Concepts** | Tanstack Start type-safe routing, Svelte compiler model (no virtual DOM), reactive `$:`, Vue Composition API, `ref()`/`reactive()`/`computed()`, Pinia stores, Nuxt SSR |
| 🎯 **You Build** | BookWise seat map admin in Vue 3 + Nuxt. FleetPulse driver widget in Svelte (14KB bundle). |
| 🔗 **Why It Matters** | Svelte compiles reactive statements to imperative DOM mutations — no diffing overhead. Vue's `ref()` tracks dependencies automatically during rendering. Both are conceptually simpler than React for small UIs. |

---

## Week 12 — Testing: Vitest + Playwright + Puppeteer + Cypress

---

### Monday — Week 12 · Unit Testing + React Testing Library

| | |
|---|---|
| 🛠 **Technologies** | Vitest, `@testing-library/react`, `vi.mock`, `vi.spyOn` |
| 📖 **Concepts** | `getByRole` queries (behavior-driven), `userEvent` for realistic interactions, module mocking, 80%+ coverage on business logic |
| 🎯 **You Build** | Complete unit test suites for all 5 platform frontends. |
| 🔗 **Why It Matters** | `getByRole('button', { name: 'Submit' })` tests what a user sees. `getByTestId` tests implementation details that change on refactor. The former survives refactoring; the latter breaks constantly. |

---

### Tuesday–Wednesday — Week 12 · Playwright E2E

| | |
|---|---|
| 🛠 **Technologies** | Playwright, cross-browser (Chromium/Firefox/WebKit), network mocking |
| 📖 **Concepts** | Auto-wait (no `sleep()`), page object model, `page.route()` for network mocking, screenshot comparison, CI parallelization |
| 🎯 **You Build** | Full E2E test suite: login flow, create trip, track delivery, payment — on all 5 platforms, all 3 browsers. |
| 🔗 **Why It Matters** | Playwright auto-waits for elements to be visible, enabled, and stable before interacting. Tests with `sleep()` are fragile. Auto-wait tests are resilient to network variance. |

---

### Thursday — Week 12 · Puppeteer + Cypress + TestSprite

| | |
|---|---|
| 🛠 **Technologies** | Puppeteer, Cypress, TestSprite |
| 📖 **Concepts** | PDF generation with Puppeteer (headless Chrome), visual regression baselines, Cypress component testing in real browser, TestSprite AI-generated test review |
| 🎯 **You Build** | BookWise PDF booking confirmation generation with Puppeteer. Cypress component tests for Shadcn DataTable. TestSprite auto-generates E2E tests — review and fix each one. |
| 🔗 **Why It Matters** | PDF generation via headless Chrome is pixel-perfect and handles complex CSS that purpose-built PDF libraries cannot. TestSprite's AI tests often find edge cases humans miss. |

---

### Friday — Week 12 · Go Testing at Scale + `testcontainers`

| | |
|---|---|
| 🛠 **Technologies** | Go `testing`, `testify`, `testcontainers-go`, `httptest` |
| 📖 **Concepts** | `httptest.NewServer` for integration tests without real server, `testcontainers` for real PostgreSQL/Redis in tests, test coverage profiling, race-free concurrent tests |
| 🎯 **You Build** | All Go services at 80%+ test coverage. `testcontainers` spins up real PostgreSQL — tests run against the actual database engine. |
| 🔗 **Why It Matters** | Testing against a mock database misses SQL edge cases (index behavior, constraint violations, transaction isolation). `testcontainers` gives you the real thing in CI at the cost of ~3 seconds startup. |

### Weekend Capstone — All 5 Platforms Full-Stack with Tests

All 5 platforms: Next.js/React frontends, Go backends, PostgreSQL + Redis, JWT auth, full test suites (unit + E2E + Go integration). CI green. Lighthouse 90+ on all frontends.

---

---

# MONTH 5 — Databases + Caching + System Design Part 1

> This month goes deep on every database technology, caching architecture, and implements the first batch of system design projects. Every database pattern is implemented in a real project feature.

---

## Week 13 — Relational Databases Deep + PostgreSQL Mastery

---

### Monday — Week 13 · Relational Databases: ACID + Transactions + Isolation Levels

| | |
|---|---|
| 🛠 **Technologies** | PostgreSQL, `psql`, `EXPLAIN ANALYZE` |
| 📖 **Concepts** | ACID properties (Atomicity, Consistency, Isolation, Durability), all 4 isolation levels with live anomaly demos, `SELECT FOR UPDATE`, `ON CONFLICT DO UPDATE` (upsert) |
| 🎯 **You Build** | PayCore double-entry ledger — every financial movement creates two journal entries in a single transaction that are guaranteed to both commit or both roll back. |
| 🔗 **Why It Matters** | Without ACID transactions, a server crash mid-payment could debit one account without crediting the other. Understanding isolation levels prevents phantom reads and non-repeatable reads in analytics. |

**The 4 Isolation Levels and their anomalies**:

| Level | Dirty Read | Non-Repeatable Read | Phantom Read |
|-------|-----------|---------------------|--------------|
| Read Uncommitted | ✓ possible | ✓ possible | ✓ possible |
| Read Committed (PG default) | ✗ prevented | ✓ possible | ✓ possible |
| Repeatable Read | ✗ prevented | ✗ prevented | ✓ possible |
| Serializable | ✗ prevented | ✗ prevented | ✗ prevented |

**Demonstrate each anomaly live**:
- **Dirty read**: T1 reads uncommitted data from T2. T2 rolls back. T1 acted on data that never existed.
- **Non-repeatable read**: T1 reads a row. T2 updates it. T1 reads again — different value.
- **Phantom read**: T1 reads rows matching a condition. T2 inserts a row matching that condition. T1 reads again — new row appears.

`SELECT FOR UPDATE` — locks the selected rows so no other transaction can modify them until you commit. Used in DungBeetle for atomic job claiming and in PayCore for balance checks.

---

### Tuesday — Week 13 · PostgreSQL Internals: MVCC + WAL + Indexes

| | |
|---|---|
| 🛠 **Technologies** | PostgreSQL, `pg_stat_activity`, `pg_locks`, WAL settings |
| 📖 **Concepts** | MVCC (Multi-Version Concurrency Control) — no locks for reads, vacuum, bloat, WAL (Write-Ahead Log) for durability and replication |
| 🎯 **You Build** | All 5 platform schemas with proper indexes. `EXPLAIN ANALYZE` on every endpoint — no seq scans on tables > 10K rows. |
| 🔗 **Why It Matters** | MVCC is why PostgreSQL readers never block writers and writers never block readers. WAL is what makes point-in-time recovery possible. |

**MVCC**: when you update a row, PostgreSQL does not modify it in place. It writes a new version with a transaction ID and marks the old version as deleted. Readers see the version that was current when their transaction started — no matter how many updates happen concurrently. `VACUUM` reclaims space from old versions.

**Index types**:
- **B-tree** (default) — balanced tree, O(log N), used for `=`, `<`, `>`, `BETWEEN`, `ORDER BY`
- **GIN** — inverted index for array contains, full-text search (`tsvector`)
- **GiST** — generalized search tree for geometric types, PostGIS
- **BRIN** — block range index for naturally ordered data (timestamps in append-only tables) — tiny size
- **Partial index** — `CREATE INDEX ON trips(driver_id) WHERE status = 'active'` — tiny, fast for filtered queries
- **Covering index** — `CREATE INDEX ON orders(user_id) INCLUDE (total, status)` — query satisfied entirely from index

---

### Wednesday — Week 13 · Scaling Databases + MySQL Comparison

| | |
|---|---|
| 🛠 **Technologies** | PostgreSQL read replicas, PgBouncer, `pg_stat_statements` |
| 📖 **Concepts** | Read replicas with streaming replication, PgBouncer connection pooling (transaction mode vs session mode), `pg_stat_statements` for slow query analysis, replication lag monitoring |
| 🎯 **You Build** | FleetPulse with read replica: write GPS pings to primary, read aggregations from replica. PgBouncer in transaction mode. |
| 🔗 **Why It Matters** | A single PostgreSQL primary handles ~5,000 connections maximum. PgBouncer lets 100,000 app connections share a pool of 100 database connections. Read replicas distribute read-heavy queries. |

**MySQL vs PostgreSQL ADR**: write a one-page decision record comparing both. Key differences: MySQL uses InnoDB row-level locking vs PostgreSQL MVCC (no lock for reads), MySQL `ENUM` type vs PostgreSQL CHECK constraints, PostgreSQL supports `JSONB`, arrays, custom types. PostgreSQL chosen for this plan because of MVCC, `JSONB`, and better full-text search.

---

### Thursday — Week 13 · Sharding + Partitioning

| | |
|---|---|
| 🛠 **Technologies** | PostgreSQL partitioning, consistent hash router in Go |
| 📖 **Concepts** | Horizontal sharding (split rows across databases), vertical sharding (split columns/tables across databases), range vs hash vs list partitioning, partition pruning |
| 🎯 **You Build** | FleetPulse GPS pings table partitioned by month (range partitioning). Queries for "last 24 hours" only touch 1–2 partitions. |
| 🔗 **Why It Matters** | A 5-billion-row GPS pings table with monthly range partitioning makes `WHERE ping_time > NOW() - INTERVAL '24 hours'` access only 1 partition instead of all 5 billion rows. |

**Range partitioning**:
```sql
CREATE TABLE gps_pings (
  driver_id UUID, lat FLOAT, lng FLOAT, ping_time TIMESTAMPTZ
) PARTITION BY RANGE (ping_time);

CREATE TABLE gps_pings_2024_01 PARTITION OF gps_pings
  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

Old partitions can be moved to cold storage. New partitions auto-created by a monthly cron job in DungBeetle.

---

### Friday — Week 13 · Non-Relational Databases + Database Selection

| | |
|---|---|
| 🛠 **Technologies** | MongoDB, Cassandra overview, Redis, SQLite, Convex, PGVector |
| 📖 **Concepts** | Document model vs relational model, wide-column stores, eventual consistency, BASE vs ACID, picking the right database |
| 🎯 **You Build** | BookWise venue configurations in MongoDB (each venue has a wildly different seat layout schema). OpsAI with PGVector for semantic search. RouteMaster real-time tracking with Convex. |
| 🔗 **Why It Matters** | There is no best database. There is a best database for each access pattern. MongoDB for flexible schema, Cassandra for time-series writes at scale, Redis for sub-millisecond cache, PGVector for semantic similarity. |

**Database selection decision tree**:
- Need SQL + ACID? → PostgreSQL
- Need flexible schema with frequent writes? → MongoDB
- Need sub-millisecond reads/writes? → Redis
- Need semantic similarity search? → PGVector
- Need real-time reactive queries? → Convex
- Need embedded (no server)? → SQLite
- Need time-series at scale? → TimescaleDB or Cassandra

---

## Week 14 — Caching Architecture

---

### Monday — Week 14 · Understanding Caching + Cache Patterns

| | |
|---|---|
| 🛠 **Technologies** | Redis, Node.js, Go `go-redis` |
| 📖 **Concepts** | Cache-aside (lazy loading), read-through, write-through, write-behind (write-back), cache stampede, thundering herd, TTL jitter, cache warming |
| 🎯 **You Build** | FleetPulse driver profile cache using cache-aside pattern. Surge pricing cache with write-through. TTL jitter preventing stampede. |
| 🔗 **Why It Matters** | The wrong cache pattern causes stale data, double writes, or stampedes. Cache-aside is correct for most use cases. Write-through is correct when reads must always be fresh. |

**Cache patterns**:

**Cache-aside** (most common):
1. App checks cache → miss → app queries DB → app stores in cache → returns
2. On write: app updates DB, deletes cache entry (or updates it)

**Read-through**: cache sits in front of DB. App only ever talks to cache. Cache fetches from DB on miss.

**Write-through**: on write, app writes to cache AND DB simultaneously. Cache is always up to date.

**Write-behind**: on write, app writes to cache immediately. DB write is asynchronous. Higher performance, risk of data loss on crash.

**Cache stampede** (thundering herd): a popular key expires. 10,000 simultaneous requests all miss the cache and all query the DB simultaneously. Fix: TTL jitter (add random seconds to TTL so keys don't all expire at once), probabilistic early refresh, `singleflight` deduplication.

---

### Tuesday — Week 14 · Redis Deep Dive: All Data Structures

| | |
|---|---|
| 🛠 **Technologies** | Redis, `go-redis/v9`, Lua scripting |
| 📖 **Concepts** | String/Hash/List/Set/Sorted Set/Stream data structures with correct use cases, Lua scripts for atomicity, pipelining, pub/sub |
| 🎯 **You Build** | Redis-backed rate limiter (Sorted Set + Lua script). Driver online status (Hash). Job queue (List + BLPOP). Leaderboard (Sorted Set). |
| 🔗 **Why It Matters** | Using String for everything wastes memory. Using the right structure (Hash for objects, Sorted Set for ranked data) uses 10x less memory and is 10x faster. |

| Structure | Use Case | Time Complexity |
|-----------|----------|-----------------|
| String | Counters, cache values, SETNX locks | O(1) get/set |
| Hash | Objects: `HSET user:123 name Alice age 30` | O(1) per field |
| List | Queues: `LPUSH jobs X; BLPOP jobs 0` | O(1) push/pop from ends |
| Set | Membership, unique visitors: `SADD`, `SISMEMBER` | O(1) add/check |
| Sorted Set | Leaderboards, rate limiting: `ZADD score member` | O(log N) |
| Stream | Append log, consumer groups: `XADD`, `XREADGROUP` | O(log N) append |

**TTL jitter**: `EXPIRE key $(( base + RANDOM % jitter ))`. Without jitter, keys set by a batch job all expire at the same second — 100,000 simultaneous cache misses.

---

### Wednesday — Week 14 · Caching at Different Architecture Levels

| | |
|---|---|
| 🛠 **Technologies** | Cloudflare CDN, Nginx reverse proxy cache, Redis application cache, PostgreSQL query cache |
| 📖 **Concepts** | Browser cache (Cache-Control headers), CDN edge cache, reverse proxy cache (Nginx), application cache (Redis), database buffer pool, CPU L1/L2/L3 cache analogy |
| 🎯 **You Build** | FleetPulse: Cloudflare caches static assets at edge. Nginx caches API responses for 5 seconds. Redis caches DB query results for 60 seconds. `Cache-Control` headers correct on every response. |
| 🔗 **Why It Matters** | Each cache layer is 10–100x faster than the next. Browser cache: 0ms. CDN edge: ~5ms. Redis: ~1ms. PostgreSQL: ~10ms. Without layered caching, every user request hits the database. |

**`Cache-Control` headers**:
- `public, max-age=31536000, immutable` — for versioned static assets (hash in filename). Cache forever.
- `public, max-age=300, stale-while-revalidate=60` — for semi-static API responses. CDN caches for 5 minutes, serves stale for 1 minute while refreshing.
- `private, no-cache` — for user-specific data. Browser can cache but must revalidate.
- `no-store` — for sensitive data (auth tokens, banking pages). Never cache.

---

### Thursday–Friday — Week 14 · System Design: URL Shortener + API Rate Limiter

| | |
|---|---|
| 🛠 **Technologies** | Go, Redis, PostgreSQL, consistent hashing |
| 📖 **Concepts** | Hash collision handling, redirect caching, base62 encoding, token bucket algorithm, sliding window log, sliding window counter, Redis Lua atomic rate limiter |
| 🎯 **You Build** | Full URL shortener service (like bit.ly). Full API rate limiter service — used by all 5 platforms. Both implemented, tested, k6 benchmarked. |
| 🔗 **Why It Matters** | URL shorteners teach hash collision, caching, and analytics counters. Rate limiters teach atomic operations, sliding windows, and distributed coordination. These are two of the most common system design interview questions. |

**URL Shortener design**:
- Generate 7-character base62 code from a counter (not random — no collision)
- Store `{code → original_url}` in PostgreSQL + Redis cache
- Redirect: check Redis first (1ms), fall back to PostgreSQL (10ms), write to Redis
- Analytics: `INCR clicks:{code}` in Redis, batch-flush to PostgreSQL hourly

**Rate Limiter design**:
- Token bucket (Go): bucket fills at rate R tokens/second, max capacity B. Request costs 1 token. Burst-friendly.
- Sliding window (Redis Lua): `ZREMRANGEBYSCORE key 0 (now-window)`, `ZCARD key` check, `ZADD key now requestId`, `EXPIRE key window`. Atomic.

### Weekend Capstone — All Database Patterns Implemented

All 5 platforms using correct database choices. Caching layers configured. URL Shortener deployed. Rate Limiter protecting all APIs.

---

## Week 15 — Async Systems + Message Queues + Kafka

---

### Monday — Week 15 · Message Queues: DLQ + Retry Policies

| | |
|---|---|
| 🛠 **Technologies** | PostgreSQL (`SELECT FOR UPDATE SKIP LOCKED`), Redis List, DungBeetle |
| 📖 **Concepts** | At-least-once delivery, idempotency, dead letter queue (DLQ), exponential backoff with jitter, max retry count, poison pill handling |
| 🎯 **You Build** | DungBeetle v1.0: jobs automatically retry with exponential backoff. After max retries, moved to DLQ. DLQ dashboard in UI. |
| 🔗 **Why It Matters** | Without a DLQ, failed jobs that always fail block the queue forever. The DLQ lets you inspect, fix, and replay failed jobs without losing them. |

**Idempotency + retries**: if a job fails after starting (server crash), it will be retried. The job handler must be idempotent — running it twice produces the same result as running it once. Implement with idempotency keys: `INSERT INTO results (job_id, ...) ON CONFLICT (job_id) DO NOTHING`.

---

### Tuesday–Wednesday — Week 15 · Kafka Essentials

| | |
|---|---|
| 🛠 **Technologies** | Apache Kafka, MSK, Confluent Go Kafka client |
| 📖 **Concepts** | Topic → partition → offset model, consumer groups, partition key selection, idempotent producer, exactly-once semantics (EOS), consumer lag monitoring, outbox pattern |
| 🎯 **You Build** | FleetPulse GPS events via Kafka (not direct DB write). DungBeetle consuming from Kafka topic. PayCore payment events via Kafka for analytics. |
| 🔗 **Why It Matters** | Kafka decouples producers from consumers, buffers traffic spikes, enables event replay, and provides exactly-once delivery for financial operations. |

**Core Kafka concepts**:

- **Topic** — named log of events. Like a database table but append-only.
- **Partition** — a topic is split into N ordered partitions. Each partition is a separate ordered log. Partitions enable parallelism.
- **Offset** — each event in a partition has a monotonically increasing offset number. Consumers track their offset.
- **Consumer group** — N consumers sharing work. Each partition assigned to exactly one consumer in the group. Adding consumers redistributes partitions (rebalance).
- **Partition key** — determines which partition receives a message. Same key → same partition → ordering guaranteed for that key. Use `driverId` as key to ensure GPS pings for one driver are ordered.

**Outbox pattern** (critical for correctness):
```sql
-- In the same DB transaction as your business operation:
INSERT INTO orders (id, ...) VALUES (...);
INSERT INTO outbox (event_type, payload) VALUES ('order.created', '...');
COMMIT;
-- A separate outbox worker reads from outbox table and publishes to Kafka
-- This guarantees: if the DB commit succeeded, the event will eventually be published
```
Without the outbox: you commit to DB, then crash before publishing to Kafka. Event is lost. With the outbox: the event survives in the DB and will be published when the worker restarts.

---

### Thursday — Week 15 · Real-Time PubSub: Redis + WebSockets + SSE

| | |
|---|---|
| 🛠 **Technologies** | Redis pub/sub, WebSockets (`gorilla/websocket`), SSE (`text/event-stream`) |
| 📖 **Concepts** | Redis pub/sub for fan-out across replicas, WebSocket upgrade handshake, SSE one-way server push, connection registry in `sync.Map`, presence heartbeat protocol |
| 🎯 **You Build** | FleetPulse: driver GPS positions pushed to all dispatcher browsers via WebSocket. Analytics dashboard updates via SSE. Redis pub/sub fans out across 3 server replicas. |
| 🔗 **Why It Matters** | Without Redis pub/sub, a message sent to replica 1 is only seen by clients connected to replica 1. With pub/sub, all replicas receive it and broadcast to their connected clients. |

**WebSocket vs SSE**:
- **WebSocket** — full-duplex: client and server both send messages. Used for: chat, collaborative editing, driver GPS updates (bidirectional).
- **SSE** — server → client only. Simpler. Auto-reconnects. Uses regular HTTP. Used for: analytics dashboards, notification feeds, progress updates.

---

### Friday — Week 15 · System Design: Realtime Abuse Masker + Notifications at Scale

| | |
|---|---|
| 🛠 **Technologies** | Go, Kafka, Redis, PostgreSQL, APNs/FCM |
| 📖 **Concepts** | Streaming classifier, shadow banning, fan-out on write vs fan-out on read, APNs/FCM push delivery, deduplication, notification preferences |
| 🎯 **You Build** | RouteMaster notifications: order status pushed via APNs/FCM + WebSocket. Fan-out implemented. Deduplication via Redis SETNX. |
| 🔗 **Why It Matters** | Notification fan-out at scale: if a user has 10M followers, publishing a tweet must fan-out to 10M notification queues. Pre-compute (fan-out on write) vs lazy compute (fan-out on read) is the core tradeoff. |

### Weekend Capstone — All Async Systems Live

DungBeetle v1.0 with DLQ. Kafka powering FleetPulse + PayCore. WebSocket driver tracking live. Notifications working. System design implementations deployed.

---

---

# MONTH 6 — Infrastructure + Real-Time + Resiliency + System Design Part 2

---

## Week 16 — Docker + Kubernetes + Terraform + GitHub Actions

---

### Monday — Week 16 · Docker: Multi-Stage Builds + Security

| | |
|---|---|
| 🛠 **Technologies** | Docker, multi-stage `Dockerfile`, `trivy` |
| 📖 **Concepts** | Multi-stage builds (900MB → 85MB), layer caching, non-root user, health checks, `.dockerignore`, `trivy` CVE scanning |
| 🎯 **You Build** | All 5 services containerized. Every image < 100MB. Every image runs as non-root. Trivy scan shows no HIGH/CRITICAL CVEs. |
| 🔗 **Why It Matters** | Non-root containers: if the container is compromised, the attacker does not have root on the host. Multi-stage builds: build tools (Go compiler, npm) are not in the final image — smaller attack surface. |

---

### Tuesday — Week 16 · Kubernetes: Deployments + Services + Ingress + HPA

| | |
|---|---|
| 🛠 **Technologies** | Kubernetes, `kubectl`, `kind` (local K8s), Helm |
| 📖 **Concepts** | Pod → Deployment → Service → Ingress hierarchy, ConfigMap + Secret, resource limits/requests, HPA (Horizontal Pod Autoscaler), liveness + readiness probes |
| 🎯 **You Build** | All 5 services deployed to `kind`. HPA scales FleetPulse on CPU. Readiness probe prevents traffic before service is ready. |
| 🔗 **Why It Matters** | Readiness probe: K8s only sends traffic to pods that pass the probe. Without it, K8s sends traffic to pods that are still starting up — requests fail. HPA: adds pods when CPU > 70%, removes them when load drops. |

---

### Wednesday — Week 16 · Terraform + Pulumi: Infrastructure as Code

| | |
|---|---|
| 🛠 **Technologies** | Terraform, Pulumi (TypeScript), AWS (ECS Fargate/RDS/ElastiCache/MSK) |
| 📖 **Concepts** | HCL syntax, state file (S3 + DynamoDB lock), `plan → apply`, Terraform modules, Pulumi for dynamic IaC (loops + conditions HCL cannot express) |
| 🎯 **You Build** | Terraform: VPC, ECS Fargate for all 5 services, RDS Multi-AZ, ElastiCache Redis, MSK Kafka. Pulumi: dynamic per-environment resource naming. |
| 🔗 **Why It Matters** | IaC means your entire infrastructure is version-controlled, reviewed in PRs, and reproducible. A new environment (`staging`) is `terraform apply` — no clicking in the AWS console. |

---

### Thursday — Week 16 · GitHub Actions: CI/CD + Security Scanning

| | |
|---|---|
| 🛠 **Technologies** | GitHub Actions, `trivy`, `govulncheck`, branch protection rules |
| 📖 **Concepts** | Matrix builds for cross-platform testing, `paths` filter (only run Go tests when Go files change), Trivy container CVE scan, branch protection requiring CI to pass |
| 🎯 **You Build** | Complete CI pipeline: lint → test (unit + E2E) → build Docker image → Trivy scan → push to ECR → deploy to ECS. Branch protection: no merge without green CI. |
| 🔗 **Why It Matters** | Branch protection without CI means broken code merges to main. Trivy scan catches known vulnerabilities before they ship. `paths` filter saves 10 minutes of CI time on documentation changes. |

---

### Friday — Week 16 · Firecracker + S3 + Cloudflare + CDN + Edge

| | |
|---|---|
| 🛠 **Technologies** | Cloudflare Workers, Cloudflare R2, S3, CloudFront |
| 📖 **Concepts** | Firecracker microVM isolation (how Lambda/Fly.io work), S3 presigned URLs, multipart upload, lifecycle policies, CDN edge PoPs, Cloudflare Workers (edge computing), cold starts eliminated |
| 🎯 **You Build** | BookWise ticket PDF uploads via S3 presigned URLs (no server intermediary). Cloudflare Worker for geo-routing (route to nearest datacenter). CloudFront CDN in front of all static assets. |
| 🔗 **Why It Matters** | Presigned URLs let clients upload directly to S3 — the file never passes through your server. Cloudflare Workers run JavaScript at 300+ edge locations worldwide with zero cold starts. |

**Firecracker**: AWS's microVM technology. Each Lambda function runs in its own Firecracker microVM — provides hardware-level isolation in 125ms boot time. Fly.io and Railway use the same model. You don't deploy Firecracker directly but understanding it explains why serverless functions are slower than containers (cold start = boot a microVM).

---

## Week 17 — gRPC + SideCar + OpenTelemetry + Resiliency

---

### Monday — Week 17 · gRPC + Protocol Buffers

| | |
|---|---|
| 🛠 **Technologies** | gRPC, Protocol Buffers, `buf` CLI |
| 📖 **Concepts** | Proto3 syntax, service definitions, code generation, streaming RPCs (unary/server/client/bidirectional), gRPC vs REST tradeoffs, binary encoding (10x smaller than JSON) |
| 🎯 **You Build** | PayCore internal services communicating over gRPC. Proto definitions in shared `proto/` directory. All services auto-generate typed clients. |
| 🔗 **Why It Matters** | gRPC is binary (10x smaller payloads), has a strict schema contract (no accidental breaking changes), and supports streaming natively. Used for high-throughput internal service calls. |

---

### Tuesday — Week 17 · SideCar v1.0: Proxy + Circuit Breaker + mTLS

| | |
|---|---|
| 🛠 **Technologies** | Go `net/http` reverse proxy, `httputil.ReverseProxy`, x509 certificates |
| 📖 **Concepts** | Reverse proxy pattern, circuit breaker (closed/open/half-open states), mTLS certificate rotation, request/response modification hooks |
| 🎯 **You Build** | SideCar proxy deployed in front of all services. Circuit breaker protecting PayCore from downstream failures. mTLS between all services. |
| 🔗 **Why It Matters** | A circuit breaker trips after N failures and stops sending requests to the failing service — preventing a slow downstream from causing a cascade failure across your entire system. |

**Circuit breaker states**:
- **Closed** — requests flow through. On failure: increment counter. When counter hits threshold → trip to Open.
- **Open** — requests fail immediately (no downstream call). After timeout → move to Half-Open.
- **Half-Open** — allow one request through. If it succeeds → back to Closed. If it fails → back to Open.

---

### Wednesday — Week 17 · OpenTelemetry: Distributed Tracing + Metrics

| | |
|---|---|
| 🛠 **Technologies** | OpenTelemetry Go SDK, Jaeger, Prometheus, Grafana |
| 📖 **Concepts** | Trace context propagation (W3C TraceContext), spans + attributes, metrics (Counter/Histogram/Gauge), Prometheus scraping, p50/p95/p99 latency histograms |
| 🎯 **You Build** | Every service emitting traces to Jaeger. Latency histograms in Prometheus. Grafana dashboard showing p99 latency per endpoint. |
| 🔗 **Why It Matters** | In a microservices system, a single user request touches 5–10 services. Without distributed tracing, a 500ms latency spike is invisible — you cannot tell which service caused it. With traces, you see exactly which span took longest. |

---

### Thursday — Week 17 · Load Balancers + Data Redundancy + Recovery

| | |
|---|---|
| 🛠 **Technologies** | AWS ALB, Nginx, PostgreSQL PITR, WAL archiving |
| 📖 **Concepts** | Load balancer algorithms (round-robin, least-connections, consistent hash, IP hash for stickiness), health checks, PITR (Point-In-Time Recovery), WAL archiving, RTO vs RPO |
| 🎯 **You Build** | PITR drill: `DROP TABLE` on staging database. Restore to 30 seconds before the drop. RTO < 10 minutes. Document the runbook. |
| 🔗 **Why It Matters** | **RPO** (Recovery Point Objective): maximum data loss acceptable. With WAL archiving every 60 seconds, RPO = 60 seconds. **RTO** (Recovery Time Objective): maximum downtime acceptable. You cannot know your RTO without drilling it. |

---

### Friday — Week 17 · Leader Election + WebRTC + System Design: Web Crawler

| | |
|---|---|
| 🛠 **Technologies** | Redis (SETNX-based election), WebRTC (STUN/TURN), Go |
| 📖 **Concepts** | Redis leader election (SETNX + TTL + heartbeat), split-brain prevention, WebRTC peer-to-peer (STUN/TURN servers, signaling server pattern), web crawler design (BFS queue, Bloom filter dedup, politeness policy) |
| 🎯 **You Build** | DungBeetle leader election — only one worker runs cron jobs at a time. BookWise waitlist processor — only one instance processes waitlist assignments per venue. |
| 🔗 **Why It Matters** | Without leader election, every DungBeetle instance runs the same cron job simultaneously — duplicate emails, duplicate charges, duplicate operations. One leader ensures exactly-once cron execution. |

**Redis leader election**:
```go
// Try to become leader
acquired := redis.SetNX(ctx, "leader:lock", instanceId, 30*time.Second)
if acquired {
  go refreshLease(ctx) // renew TTL every 10 seconds
  runCronJobs()
}
// If SetNX returns false, another instance is leader — just watch and wait
```

**Web Crawler design** (built for RouteMaster — crawls restaurant menus):
- BFS queue: Redis List of URLs to crawl
- Bloom filter: probabilistic deduplication of already-crawled URLs (no DB lookup)
- Politeness: one goroutine per domain, with 1-second delay between requests
- Robots.txt: fetch and respect before crawling any domain
- Content storage: S3 for raw HTML, PostgreSQL for extracted structured data

### Weekend Capstone — All Infrastructure Live + Resiliency Patterns Implemented

All 5 services deployed to ECS Fargate. Terraform state in S3. GitHub Actions CI green. SideCar with circuit breaker deployed. Distributed tracing live. PITR drill executed.

---

## Week 17B — Full-Stack Observability: Traces + Metrics + Logs + Alerting + Production Debugging

> **Why a dedicated week?** Observability is not a feature — it is the ability to ask any question about your system's behaviour in production without deploying new code. The three pillars (traces, metrics, logs) are only useful when they are connected, queryable, and alerting on the right things. This week you build the complete observability stack for all 5 projects from scratch and learn to use it the way an on-call engineer does at 3am.
>
> **Infraspec relevance:** Infraspec's role explicitly requires "system observability and reliability practices." Every client engagement involves inheriting a system with unknown health. This week's skills are what let you walk into a new codebase and understand what is broken within hours, not days.

---

### Monday — Week 17B · The Three Pillars: What They Are and How They Connect

| | |
|---|---|
| 🛠 **Technologies** | OpenTelemetry Go SDK, OpenTelemetry JS SDK (`@opentelemetry/sdk-node`), Jaeger, Prometheus, Loki (or Elasticsearch), Grafana |
| 📖 **Concepts** | The three observability pillars — traces, metrics, logs — their distinct purposes, how they connect via trace IDs and exemplars, structured logging with `slog`, the difference between monitoring (known unknowns) and observability (unknown unknowns) |
| 🎯 **You Build** | All 5 projects emit all three signal types. A single HTTP request to FleetPulse produces: a Jaeger trace (where time was spent), a Prometheus histogram increment (request count + duration bucket), and a structured `slog` JSON log line — all sharing the same `trace_id` field. |
| 🔗 **Why It Matters** | Without all three connected, debugging a production issue means switching between three disconnected tools and manually correlating timestamps. With `trace_id` on every log line and Grafana exemplars linking metrics to traces, you click from a latency spike on a dashboard directly into the trace that caused it. |

**Morning — The Three Pillars Explained**

**Traces** answer: *what happened during this specific request?*
A trace is a tree of spans. Each span represents one unit of work: an HTTP handler, a database query, a Redis call, an external API call. Spans have a start time, duration, status (OK/ERROR), and key-value attributes. The trace shows you exactly where time was spent and where errors occurred — across every service the request touched.

```
Trace: POST /trips (FleetPulse) — 342ms total
  ├── auth middleware — 2ms
  ├── validate GPS coordinates — 1ms
  ├── PostgreSQL INSERT trips — 8ms
  ├── Redis ZADD h3:drivers:... — 1ms
  └── Kafka publish trip.created — 330ms ← the bottleneck is here
```

**Metrics** answer: *how is the system behaving right now and over time?*
Metrics are numerical measurements collected at regular intervals. They are cheap to store (one number per timestamp per label combination) and fast to query. Use them for dashboards, SLO tracking, and alerting.

The **RED method** — the three metrics every service needs:
- **Rate** — how many requests per second is this service handling?
- **Errors** — what percentage of requests are returning errors?
- **Duration** — how long are requests taking? (p50, p95, p99)

```promql
# Request rate per endpoint
rate(http_request_duration_seconds_count{service="fleetpulse"}[5m])

# Error rate
rate(http_requests_total{service="fleetpulse", status=~"5.."}[5m])
  / rate(http_requests_total{service="fleetpulse"}[5m])

# p99 latency
histogram_quantile(0.99, rate(http_request_duration_seconds_bucket{service="fleetpulse"}[5m]))
```

**Logs** answer: *what exactly happened at this moment?*
Structured logs (JSON) are machine-parseable. Every log line includes: timestamp, log level, service name, trace ID, span ID, and the message. Unstructured logs (`fmt.Println("error:", err)`) are useless at scale — you cannot query them reliably.

```json
{"time":"2024-01-15T14:23:01Z","level":"ERROR","service":"fleetpulse",
 "trace_id":"4bf92f3577b34da6","span_id":"00f067aa0ba902b7",
 "msg":"failed to publish trip event","error":"kafka: leader not available",
 "trip_id":"trip_123","driver_id":"drv_456","attempt":3}
```

**The connection — exemplars**: Prometheus histograms can embed a trace ID as an exemplar — a sample data point with metadata. In Grafana, when you see a p99 spike, you click "show exemplar" and jump directly into the Jaeger trace for that exact slow request. This is the most powerful debugging workflow in production.

**Evening — Instrument All 5 Projects**

Add OpenTelemetry SDK to every service that does not have it yet. Every service must emit:

1. **Traces to Jaeger** — HTTP spans auto-instrumented, database spans manual, Kafka produce/consume spans manual
2. **Metrics to Prometheus** — RED metrics per endpoint using `prometheus/client_golang`
3. **Structured logs** — `slog` in Go with JSON handler, trace_id + span_id injected via middleware

The shared middleware pattern (Go):
```go
func ObservabilityMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        // Start span from incoming trace context (W3C traceparent header)
        ctx, span := tracer.Start(r.Context(), r.URL.Path)
        defer span.End()

        // Inject trace IDs into logger — every log from this request carries them
        logger := slog.With(
            "trace_id", span.SpanContext().TraceID().String(),
            "span_id",  span.SpanContext().SpanID().String(),
            "service",  "fleetpulse",
            "method",   r.Method,
            "path",     r.URL.Path,
        )
        ctx = context.WithValue(ctx, loggerKey, logger)

        // Wrap response writer to capture status code
        rw := &responseWriter{ResponseWriter: w}
        next.ServeHTTP(rw, r.WithContext(ctx))

        // Record RED metrics
        httpRequestDuration.WithLabelValues(
            r.Method, r.URL.Path, strconv.Itoa(rw.statusCode),
        ).Observe(time.Since(start).Seconds())
    })
}
```

**DSA — Sliding Window for SLO Tracking**

Implement a sliding window counter (same as rate limiter) that tracks error rate over the last 5 minutes. When error rate > 1%, trigger an alert. This is the algorithm inside every SLO-based alerting system.

---

### Tuesday — Week 17B · OpenTelemetry Deep: Traces, Context Propagation, Span Attributes

| | |
|---|---|
| 🛠 **Technologies** | OpenTelemetry Go SDK, `otelhttp`, `otelgrpc`, `otelsql`, `@opentelemetry/sdk-node`, Jaeger |
| 📖 **Concepts** | Trace context propagation (W3C TraceContext header), span lifecycle, span kinds (SERVER/CLIENT/PRODUCER/CONSUMER), span attributes vs events vs links, baggage for cross-service values, sampling strategies |
| 🎯 **You Build** | Full distributed trace across FleetPulse → PayCore → DungBeetle — one user action visible as a single trace spanning all three services in Jaeger. |
| 🔗 **Why It Matters** | A request that touches 3 services creates 3 separate traces if context is not propagated. With W3C TraceContext propagation, all 3 services contribute spans to one trace. You see the entire journey in one view. |

**Morning — Context Propagation: How Traces Cross Service Boundaries**

When FleetPulse calls PayCore over HTTP, it injects the current trace context into the `traceparent` header:

```
traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
             ^^  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  ^^^^^^^^^^^^^^^^  ^^
             ver       trace ID (128-bit)           span ID (64-bit)  flags
```

PayCore extracts this header and creates a new child span under the same trace. The result: one trace ID, spans from multiple services, complete picture.

**Instrumentation levels:**

- **Auto-instrumentation** — `otelhttp.NewHandler` wraps your HTTP handler automatically. Every incoming request gets a SERVER span. Every outgoing `http.Client` request gets a CLIENT span. Zero code changes to handlers.
- **Manual instrumentation** — for business logic that matters:
```go
func (s *TripService) CreateTrip(ctx context.Context, req *CreateTripRequest) (*Trip, error) {
    ctx, span := tracer.Start(ctx, "TripService.CreateTrip",
        trace.WithAttributes(
            attribute.String("driver.id", req.DriverId),
            attribute.String("rider.id", req.RiderId),
            attribute.Float64("pickup.lat", req.PickupLat),
        ),
    )
    defer span.End()

    trip, err := s.repo.Insert(ctx, req)
    if err != nil {
        span.RecordError(err)
        span.SetStatus(codes.Error, err.Error())
        return nil, err
    }

    span.SetAttributes(attribute.String("trip.id", trip.ID))
    return trip, nil
}
```

**Sampling strategies:**
- **Always-on sampling** — every request traced. Use in development. Expensive at scale.
- **Head-based sampling** — decision made at the start of the trace (e.g., sample 10% of requests). Cheap. Misses rare slow requests.
- **Tail-based sampling** — decision made after the trace completes. Sample 100% of errors and 100% of requests > 500ms p99. Sample 1% of everything else. This is what production systems use. Jaeger and OpenTelemetry Collector both support this.

**Evening — Instrument Database + Kafka Spans**

Every PostgreSQL query, every Redis command, every Kafka message should create a span. This is where most latency hides.

```go
// Wrap pgx with OpenTelemetry — every query gets a span automatically
pool, _ := pgxpool.New(ctx, connStr)
pool.Config().ConnConfig.Tracer = otelpgx.NewTracer()

// Every query now appears in traces:
// db.query — INSERT INTO trips — 8ms
// db.query — SELECT * FROM drivers WHERE h3_cell = $1 — 2ms
```

Kafka spans using `otelkafkago`:
```go
// Producer span: SpanKind = PRODUCER
// Consumer span: SpanKind = CONSUMER
// These link producer and consumer traces — you see exactly how long a message waited in Kafka
```

---

### Wednesday — Week 17B · Prometheus Metrics: RED + USE + PromQL + Grafana Dashboards

| | |
|---|---|
| 🛠 **Technologies** | Prometheus, `prometheus/client_golang`, Grafana, PromQL |
| 📖 **Concepts** | Metric types (Counter/Gauge/Histogram/Summary), RED method (Rate/Errors/Duration), USE method (Utilization/Saturation/Errors) for infrastructure, PromQL query language, recording rules, Grafana panels |
| 🎯 **You Build** | Production-grade Grafana dashboard for every service: RED metrics per endpoint, Go runtime metrics (goroutine count, GC pause duration, heap usage), infrastructure metrics (CPU, memory, disk). |
| 🔗 **Why It Matters** | A dashboard without the right metrics is noise. The RED method tells you exactly which three numbers to display for any service. The USE method tells you exactly which three numbers to display for any infrastructure component. |

**Morning — Metric Types and When to Use Each**

**Counter** — a value that only goes up. Use for: request count, error count, bytes processed. Never use for: things that can decrease.
```go
requestsTotal := prometheus.NewCounterVec(prometheus.CounterOpts{
    Name: "http_requests_total",
    Help: "Total HTTP requests",
}, []string{"method", "path", "status"})
```

**Gauge** — a value that goes up and down. Use for: current goroutine count, current queue depth, current cache size, active connections.
```go
goroutinesActive := prometheus.NewGauge(prometheus.GaugeOpts{
    Name: "go_goroutines_active",
    Help: "Current number of goroutines",
})
// Update: goroutinesActive.Set(float64(runtime.NumGoroutine()))
```

**Histogram** — samples observations and counts them in configurable buckets. Use for: request duration, response size. Gives you p50/p95/p99 via PromQL.
```go
requestDuration := prometheus.NewHistogramVec(prometheus.HistogramOpts{
    Name:    "http_request_duration_seconds",
    Help:    "HTTP request duration in seconds",
    Buckets: []float64{.005, .01, .025, .05, .1, .25, .5, 1, 2.5, 5},
    // Buckets: 5ms, 10ms, 25ms, 50ms, 100ms, 250ms, 500ms, 1s, 2.5s, 5s
}, []string{"method", "path", "status"})
```

**PromQL — the five queries every engineer should know:**
```promql
# 1. Request rate (requests per second, 5-minute window)
rate(http_requests_total{service="fleetpulse"}[5m])

# 2. Error rate percentage
100 * rate(http_requests_total{service="fleetpulse",status=~"5.."}[5m])
    / rate(http_requests_total{service="fleetpulse"}[5m])

# 3. p99 latency
histogram_quantile(0.99,
  rate(http_request_duration_seconds_bucket{service="fleetpulse"}[5m]))

# 4. Goroutine leak detection — goroutine count trending up over time
deriv(go_goroutines_active{service="dungbeetle"}[10m]) > 0.5

# 5. Kafka consumer lag
sum(kafka_consumer_group_lag{group="trip-processor"}) by (topic)
```

**Evening — Build the Grafana Dashboard**

Build one dashboard per service with four rows:

**Row 1 — Service Health (RED)**
- Request rate (requests/sec)
- Error rate (%)
- p50/p95/p99 latency (overlaid on same chart)

**Row 2 — Go Runtime**
- Goroutine count over time (spike = leak, sustained high = normal concurrency)
- GC pause duration histogram (p99 GC pause > 50ms = problem)
- Heap in-use vs heap allocated (gap = GC pressure)

**Row 3 — Database**
- PostgreSQL: connections in-use vs pool size, query duration p99, slow query count
- Redis: command latency p99, keyspace hit rate, memory usage

**Row 4 — Business Metrics**
- FleetPulse: active trips, GPS pings/sec, match success rate
- PayCore: payments/sec, payment success rate, ledger write latency
- DungBeetle: job queue depth, job processing rate, DLQ depth

---

### Thursday — Week 17B · Alerting: Rules, Routing, Noise Reduction, On-Call Runbooks

| | |
|---|---|
| 🛠 **Technologies** | Prometheus Alertmanager, PagerDuty (or Slack webhook), Grafana alerting |
| 📖 **Concepts** | SLI/SLO/SLA definitions, error budget, Prometheus alert rules, Alertmanager routing + inhibition + silencing, alert severity levels, noise reduction (don't alert on transient spikes), on-call runbooks |
| 🎯 **You Build** | Complete alerting stack: SLO-based alert rules for all 5 projects, Alertmanager routing to PagerDuty (P1) and Slack (P2/P3), noise-reduced rules that don't fire on 1-second spikes, runbook linked from every alert. |
| 🔗 **Why It Matters** | Alert fatigue kills on-call effectiveness. An alert that fires 50 times per week and resolves without action trains engineers to ignore it — then it fires for a real incident and nobody responds. Every alert must be actionable and linked to a runbook. |

**Morning — SLIs, SLOs, and Error Budgets**

**SLI (Service Level Indicator)** — a specific measurement of service behaviour. Example: the percentage of HTTP requests that complete successfully in under 500ms.

**SLO (Service Level Objective)** — the target for an SLI. Example: 99.9% of requests complete successfully in under 500ms, measured over a rolling 30-day window.

**SLA (Service Level Agreement)** — the contractual commitment to users. Usually lower than your internal SLO. Example: 99.5% availability guaranteed.

**Error budget** — the amount of unreliability you are allowed. An SLO of 99.9% means 0.1% of requests can fail — that is 43.8 minutes of total downtime per month. When you deploy a bad release that burns 20 minutes of error budget, that is the signal to slow down, not to rush more releases.

```promql
# Error budget remaining (%)
100 - (
  100 * (
    sum(rate(http_requests_total{service="paycore",status=~"5.."}[30d]))
    / sum(rate(http_requests_total{service="paycore"}[30d]))
  ) / 0.001  -- 0.001 = 0.1% error budget
)
```

**Prometheus alert rules — the right way:**

```yaml
groups:
  - name: fleetpulse.slo
    rules:
      # P1: SLO breach — fires if error rate > 1% sustained for 5 minutes
      # "for: 5m" prevents false alerts from 30-second transient spikes
      - alert: FleetPulseHighErrorRate
        expr: |
          rate(http_requests_total{service="fleetpulse",status=~"5.."}[5m])
          / rate(http_requests_total{service="fleetpulse"}[5m]) > 0.01
        for: 5m
        labels:
          severity: critical
          team: platform
        annotations:
          summary: "FleetPulse error rate > 1% for 5 minutes"
          description: "Current error rate: {{ $value | humanizePercentage }}"
          runbook: "https://notion.so/runbooks/fleetpulse-high-error-rate"

      # P2: Latency degradation — p99 > 500ms for 10 minutes
      - alert: FleetPulseHighLatency
        expr: |
          histogram_quantile(0.99,
            rate(http_request_duration_seconds_bucket{service="fleetpulse"}[5m])
          ) > 0.5
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "FleetPulse p99 latency > 500ms"
          runbook: "https://notion.so/runbooks/fleetpulse-high-latency"

      # P1: DungBeetle DLQ growing — jobs failing permanently
      - alert: DungBeetleDLQGrowing
        expr: dungbeetle_dlq_depth > 100
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "DungBeetle DLQ depth > 100"
          runbook: "https://notion.so/runbooks/dungbeetle-dlq"

      # P2: Kafka consumer lag — falling behind
      - alert: KafkaConsumerLagHigh
        expr: kafka_consumer_group_lag{group="trip-processor"} > 10000
        for: 15m
        labels:
          severity: warning
        annotations:
          summary: "Kafka consumer lag > 10K messages for 15 minutes"
```

**Alertmanager routing — group, inhibit, silence:**

```yaml
route:
  group_by: ['service', 'severity']
  group_wait: 30s        # wait 30s before sending first alert in a group
  group_interval: 5m     # wait 5m before sending updated alerts for a group
  repeat_interval: 4h    # resend unresolved alerts every 4 hours

  routes:
    - matchers: [severity="critical"]
      receiver: pagerduty-p1

    - matchers: [severity="warning"]
      receiver: slack-p2

inhibit_rules:
  # Don't send warning if critical is already firing for the same service
  - source_matchers: [severity="critical"]
    target_matchers: [severity="warning"]
    equal: ['service']
```

**On-call runbooks** — every alert links to a runbook. A runbook is a step-by-step guide for the on-call engineer. It answers: what does this alert mean, what is the likely cause, what are the steps to diagnose, what are the steps to fix, who to escalate to.

**Evening — Write Runbooks for Every Alert**

Write a Notion/Markdown runbook for each alert you created. Minimum content:
1. What this alert means in plain English
2. How to query the relevant traces, logs, and metrics
3. Top 3 most likely causes with diagnosis steps
4. Fix for each cause
5. Rollback procedure if a fix makes it worse
6. Who to escalate to and when

This is exactly what Infraspec engineers do when taking over a client's production system.

---

### Friday — Week 17B · Production Debugging Workflow: Trace → Profile → Fix

| | |
|---|---|
| 🛠 **Technologies** | Jaeger, Grafana, `go tool pprof`, `EXPLAIN ANALYZE`, `go tool trace` |
| 📖 **Concepts** | The production debugging workflow: alert fires → Grafana dashboard → find anomaly → jump to Jaeger trace → find slow span → pprof the service → find hot function → fix → verify in Grafana |
| 🎯 **You Build** | Deliberately introduce 3 different production bugs into FleetPulse, diagnose each one using only observability data (no `fmt.Println`, no `console.log`), fix them, verify fix in Grafana. |
| 🔗 **Why It Matters** | This is the most valuable skill you will demonstrate to Infraspec. Every client engagement starts with: "our system is slow and we don't know why." You will know how to find out within 30 minutes. |

**Morning — The Production Debugging Workflow**

The golden rule: **you never add logging or print statements to debug production issues**. You use the observability data that is already there. If the data is not there, you add instrumentation — which is different from print debugging.

**The five-step workflow:**

**Step 1 — Alert fires or user reports an issue**
Open Grafana. Look at the RED dashboard. Which metric is anomalous? Is it rate (traffic spike?), errors (bad deploy?), or duration (slow dependency?)?

**Step 2 — Narrow the scope**
If p99 latency is high: which endpoint? Which time window? Filter by endpoint label in Grafana. If error rate is high: which status code? Which endpoint? Which downstream dependency?

**Step 3 — Find the representative trace**
In Grafana, click the exemplar on the latency spike — this jumps directly into the Jaeger trace for that specific slow request. Alternatively, search Jaeger by service + time range + minimum duration.

**Step 4 — Read the trace**
Look at the span tree. Which span is taking the most time? Is it a database query? A Redis call? A downstream HTTP call? A Kafka publish? The widest span in the waterfall is the bottleneck.

```
Trace: POST /trips — 8.2s (anomalous — normal is 50ms)
  ├── auth middleware — 2ms ✅
  ├── validate GPS — 1ms ✅
  ├── db.query: SELECT * FROM drivers... — 7.9s ❌ THIS IS THE PROBLEM
  │   └── attributes: query="SELECT * FROM drivers WHERE h3_cell = $1 AND status = 'active'"
  │                   rows_affected=45823
  └── redis.set — 1ms ✅
```

**Step 5 — Fix and verify**
`EXPLAIN ANALYZE` the slow query. No index on `(h3_cell, status)`. Add it. Verify: run the query again, p99 drops from 7.9s to 2ms. Check Grafana: p99 latency returns to normal within 5 minutes.

**Three bugs to introduce and diagnose today:**

**Bug 1 — Missing database index**
Remove the index on `(h3_cell, status)` from FleetPulse. Generate load. See p99 spike in Grafana. Find the trace. Run `EXPLAIN ANALYZE`. Add the index. Verify.

**Bug 2 — Goroutine leak**
Add a goroutine that starts but never stops (forgotten `ticker.Stop()`). Run FleetPulse for 10 minutes. See goroutine count trending up in Grafana. Trigger pprof goroutine dump:
```bash
curl http://localhost:6060/debug/pprof/goroutine?debug=2 > goroutines.txt
# Find the goroutine at the top of the stack — it shows exactly where it is stuck
```
Fix: add `defer ticker.Stop()`. Verify in Grafana: goroutine count flattens.

**Bug 3 — N+1 query**
Introduce an N+1: fetch 50 trips, then query driver name for each trip individually. See: Grafana shows latency spike. Trace shows 51 database spans instead of 2. Fix: use a JOIN. Verify: trace collapses to 2 spans.

**DSA — LRU Cache (connects to observability cache)**

Implement an LRU cache. Connect: the Prometheus metric cache for dashboards is an LRU cache. Understanding the eviction policy explains why Grafana dashboards sometimes show stale data.

---

### Weekend Capstone — Complete Observability Stack Live

By end of this weekend, every service has:

**Traces:** Every HTTP request, every DB query, every Redis command, every Kafka produce/consume is a span in Jaeger. Distributed traces cross service boundaries via `traceparent` header. Tail-based sampling configured: 100% of errors + slow requests, 5% of normal traffic.

**Metrics:** RED metrics (rate, errors, duration histograms) for every service. Go runtime metrics (goroutine count, GC pause, heap). Business metrics (trip creation rate, payment success rate, job queue depth). All scraped by Prometheus every 15 seconds.

**Logs:** Structured JSON from every service via `slog`. Every log line contains `trace_id` and `span_id`. Logs shipped to Loki (or Elasticsearch). Queryable by service, level, trace_id, or any field.

**Dashboards:** One Grafana dashboard per service. RED method top row. Runtime metrics second row. Database third row. Business metrics fourth row. Grafana exemplars link metric spikes to traces.

**Alerts:** SLO-based alert rules in Prometheus. Alertmanager routes P1 (critical) to PagerDuty, P2/P3 (warning) to Slack. Every alert has a runbook. `for: 5m` on every rule prevents false positives from transient spikes.

**Runbooks:** Markdown runbook for every alert, linked from the alert annotation. Covers: what it means, likely causes, diagnosis steps, fix steps, rollback, escalation.

---

## Week 18 — PayCore + Financial Systems + System Design Part 2

---

### Monday — Week 18 · PayCore: Double-Entry Ledger

| | |
|---|---|
| 🛠 **Technologies** | Go, PostgreSQL, `DECIMAL(19,4)` |
| 📖 **Concepts** | Double-entry bookkeeping, journal entries (debit + credit always sum to zero), ACID for financial operations, balance check + transfer as single transaction |
| 🎯 **You Build** | PayCore ledger: every financial movement creates exactly two journal entries in one transaction. Constraint: `SUM(debits) = SUM(credits)` enforced at DB level. |
| 🔗 **Why It Matters** | Every bank, payment processor, and accounting system uses double-entry. A bug that corrupts the ledger balance is a compliance failure, not just a bug. |

---

### Tuesday — Week 18 · Idempotency Keys + Outbox Pattern + Saga

| | |
|---|---|
| 🛠 **Technologies** | Go, PostgreSQL, Kafka, Redis |
| 📖 **Concepts** | Idempotency key pattern (`ON CONFLICT DO NOTHING`), outbox pattern (event in same transaction as business op), Saga (sequence of local transactions with compensating rollback) |
| 🎯 **You Build** | PayCore: zero double charges verified by test that sends same payment request 10 times. Outbox worker reliably publishing events. Fund transfer Saga with compensating transactions. |
| 🔗 **Why It Matters** | Without idempotency, a network timeout on a payment POST — retried by the client — causes a duplicate charge. The idempotency key (`X-Idempotency-Key: uuid`) ensures the second attempt returns the cached result of the first. |

---

### Wednesday–Thursday — Week 18 · Event Sourcing + CQRS

| | |
|---|---|
| 🛠 **Technologies** | Go, Kafka, PostgreSQL, read models |
| 📖 **Concepts** | Event Sourcing (store state changes as immutable events), CQRS (Command Query Responsibility Segregation), projections rebuilding read models, event replay for debugging |
| 🎯 **You Build** | PayCore v2.0: event-sourced ledger. Balance = replay of all Debit/Credit events. CQRS: read model projected from events for fast balance queries. |
| 🔗 **Why It Matters** | Event sourcing gives a complete, tamper-evident audit trail — required for financial compliance. Event replay lets you reconstruct any account state at any point in time for debugging or auditing. |

---

### Friday — Week 18 · System Design: Tinder Feed + Twitter Trends

| | |
|---|---|
| 🛠 **Technologies** | Go, Redis, PostgreSQL, Kafka, Count-Min Sketch |
| 📖 **Concepts** | Candidate generation (collaborative filtering for Tinder feed), scoring pipeline, swipe event stream, sliding window counters for trending, Top-K with Count-Min Sketch |
| 🎯 **You Build** | FleetPulse driver ranking (who to dispatch first) using scoring pipeline. RouteMaster trending orders by zone using Count-Min Sketch. |
| 🔗 **Why It Matters** | Top-K trending topics cannot be computed with an exact counter for every possible phrase — too much memory. Count-Min Sketch gives a probabilistic approximate count using O(k × m) space regardless of the number of distinct phrases. |

---

---

# MONTH 7 — Distributed Systems + Blob/CDN/Edge + System Design Part 3

---

## Week 19 — Bloom Filters + Consistent Hashing + Big Data Essentials

---

### Monday — Week 19 · Bloom Filters

| | |
|---|---|
| 🛠 **Technologies** | Go, Redis `BF.ADD`/`BF.EXISTS` |
| 📖 **Concepts** | Probabilistic membership, false positive rate, sizing formula (`m = -n*ln(p) / ln(2)²`), optimal hash count (`k = m/n * ln(2)`), no false negatives guarantee |
| 🎯 **You Build** | BookWise venue crawler Bloom filter: dedup crawled venue URLs in 1.2GB memory. False positive rate 0.1%. No DB lookup for seen URLs. |
| 🔗 **Why It Matters** | Checking if a URL was crawled before against a 1-billion-row DB table takes 50ms+. A Bloom filter checks in microseconds with 1.2GB RAM. The tradeoff: 0.1% of URLs are falsely flagged as seen (re-crawled less often). Acceptable for a crawler. |

---

### Tuesday — Week 19 · Consistent Hashing

| | |
|---|---|
| 🛠 **Technologies** | Go |
| 📖 **Concepts** | Hash ring, virtual nodes (vnodes), adding/removing nodes remaps only 1/N keys, ketama algorithm, load balancing implications |
| 🎯 **You Build** | Go consistent hash library used by DungBeetle worker routing. Adding a 4th worker remaps only 25% of in-flight jobs, not all of them. |
| 🔗 **Why It Matters** | Without consistent hashing, adding one Redis node to a cluster would invalidate every cached key (modular hashing). With it, only ~1/N keys move. Used by Redis Cluster, Cassandra, Memcached, DynamoDB. |

---

### Wednesday — Week 19 · Communication Protocols Deep

| | |
|---|---|
| 🛠 **Technologies** | `curl`, `wscat`, Wireshark |
| 📖 **Concepts** | HTTP/1.1 (pipelining, keep-alive), HTTP/2 (multiplexing, HPACK header compression, server push), HTTP/3 (QUIC, no head-of-line blocking), gRPC over HTTP/2, WebSocket over HTTP, SSE over HTTP |
| 🎯 **You Build** | Benchmark: HTTP/1.1 vs HTTP/2 for 100 parallel requests. Document multiplexing speedup. |
| 🔗 **Why It Matters** | HTTP/3 runs on UDP with QUIC — eliminates TCP head-of-line blocking. On lossy networks (mobile), HTTP/3 is significantly faster than HTTP/2. Understanding this affects your CDN configuration decisions. |

---

### Thursday–Friday — Week 19 · Big Data Basics + TimescaleDB + Column Stores

| | |
|---|---|
| 🛠 **Technologies** | TimescaleDB, PostgreSQL hypertables, `EXPLAIN ANALYZE` |
| 📖 **Concepts** | OLAP vs OLTP, columnar storage (why analytics are faster), MapReduce model conceptually, TimescaleDB hypertables with partition pruning, continuous aggregates |
| 🎯 **You Build** | FleetPulse GPS pings in TimescaleDB: monthly hypertables. `WHERE ping_time > NOW() - INTERVAL '24h'` touches 1 partition, not all 5 billion rows. Continuous aggregate for hourly driver stats. |
| 🔗 **Why It Matters** | TimescaleDB automatic partition pruning makes time-range queries 1000x faster on large tables. Continuous aggregates precompute hourly/daily summaries — dashboards load in milliseconds instead of seconds. |

---

## Week 20 — DungBeetle v3.0 + Blob Storage + S3 + Edge Computing

---

### Monday–Tuesday — Week 20 · DungBeetle v3.0: Kafka + Leader Election + Webhooks

| | |
|---|---|
| 🛠 **Technologies** | Go, Kafka, Redis, PostgreSQL, HMAC |
| 📖 **Concepts** | Kafka-backed job queue (vs PostgreSQL SKIP LOCKED), Redis leader election for cron jobs, HMAC-signed webhook delivery with exponential retry, exactly-once processing |
| 🎯 **You Build** | DungBeetle v3.0: Kafka replaces PostgreSQL for job queue. Leader election ensures one cron runner. Webhook manager with HMAC signing, retry with backoff, DLQ for failed deliveries. |
| 🔗 **Why It Matters** | Kafka provides ordering guarantees, consumer group scaling, and event replay that PostgreSQL SKIP LOCKED cannot. You can add 10 DungBeetle workers and Kafka automatically distributes partitions to them. |

---

### Wednesday — Week 20 · S3: Presigned URLs + Multipart + Lifecycle

| | |
|---|---|
| 🛠 **Technologies** | AWS S3, Cloudflare R2, Go AWS SDK |
| 📖 **Concepts** | Presigned URL generation (client uploads directly to S3, not through your server), multipart upload for large files, S3 lifecycle policies (transition to Glacier after 90 days), versioning, replication |
| 🎯 **You Build** | BookWise ticket PDF upload: browser gets presigned URL from server, uploads booking confirmation PDF directly to S3. Server is never the bottleneck. |
| 🔗 **Why It Matters** | Presigned URLs: the client uploads directly to S3. Your server only generates a signed URL (1ms operation). Without presigned URLs, every upload goes through your server — adding latency and consuming your server's bandwidth. |

---

### Thursday — Week 20 · Cloudflare Workers + Edge Computing

| | |
|---|---|
| 🛠 **Technologies** | Cloudflare Workers, Cloudflare KV, Cloudflare R2, Wrangler CLI |
| 📖 **Concepts** | V8 isolates (not microVMs — no cold starts), Workers KV (eventually consistent global key-value), R2 (S3-compatible, zero egress fees), Workers for A/B testing, geo-routing, auth at edge |
| 🎯 **You Build** | Cloudflare Worker: JWT verification at edge (zero latency auth), geo-routing to nearest datacenter, serving `robots.txt` and `sitemap.xml` without hitting origin. |
| 🔗 **Why It Matters** | Cloudflare Workers run at 300+ edge locations worldwide. Auth check at edge adds 0ms latency — vs 100ms round trip to your origin server. Workers use V8 isolates (not processes or microVMs) so there are no cold starts. |

---

### Friday — Week 20 · WebAssembly (Wasm) + Fraud Detection Engine

| | |
|---|---|
| 🛠 **Technologies** | WebAssembly, Go compiled to Wasm, `wasm-pack` |
| 📖 **Concepts** | Wasm binary format, linear memory model, JavaScript ↔ Wasm FFI, compiling Go/Rust to Wasm, running Wasm in browser vs server |
| 🎯 **You Build** | FleetPulse fraud detection: Go rules engine compiled to Wasm, runs in the browser at < 15ms p99. No server round-trip for fraud scoring. |
| 🔗 **Why It Matters** | Wasm runs native-speed code in the browser with a memory sandbox. A fraud detection model compiled to Wasm evaluates in < 1ms in the browser — vs 50ms+ for a server round-trip. This is also how Figma's rendering engine works. |

---

## Week 21 — System Design: GitHub Gists + Fraud Detection + Recommendation

---

### Monday–Tuesday — Week 21 · System Design: GitHub Gists + URL Shortener Deep

| | |
|---|---|
| 🛠 **Technologies** | Go, S3, PostgreSQL full-text search, Redis |
| 📖 **Concepts** | Presigned S3 upload for code files, full-text search with `tsvector`/`tsquery`, forking with Copy-on-Write semantics, version history with content-addressable storage |
| 🎯 **You Build** | BookWise "venue templates" feature — fork a maintenance procedure, edit it, keep version history. Full-text search across all procedures. |
| 🔗 **Why It Matters** | Content-addressable storage (like Git): store files by hash of their content. Two identical files = one stored object. Forking = copy the metadata pointer, not the file content. |

---

### Wednesday — Week 21 · System Design: Fraud Detection

| | |
|---|---|
| 🛠 **Technologies** | Go, Wasm, PostgreSQL, Redis, ONNX runtime |
| 📖 **Concepts** | Feature store (pre-computed features), rules engine (deterministic), ML scoring (probabilistic), fraud signal aggregation, < 15ms p99 requirement |
| 🎯 **You Build** | FleetPulse fraud detection: rules engine (Wasm in browser, < 1ms) + ML model scoring (server, < 10ms) + final decision. Verified by load test: p99 < 15ms at 1000 RPS. |
| 🔗 **Why It Matters** | Fraud detection is a layered system: fast rules first (is this IP on a blocklist?), then more expensive ML scoring. The rules engine runs in the browser for zero latency on obvious cases. |

---

### Thursday–Friday — Week 21 · System Design: Recommendation System + Designing e-Commerce

| | |
|---|---|
| 🛠 **Technologies** | Go, PGVector, PostgreSQL, Redis |
| 📖 **Concepts** | Collaborative filtering (users who liked X also liked Y), content-based filtering (item embedding similarity), hybrid approach, candidate generation → scoring → serving pipeline |
| 🎯 **You Build** | RouteMaster restaurant recommendations: collaborative filtering for "users like you ordered from X" + content-based using cuisine embeddings in PGVector. |
| 🔗 **Why It Matters** | Recommendation systems are two-stage: candidate generation (narrow 1M items to 1000 candidates efficiently) then scoring (rank 1000 candidates expensively). Doing expensive scoring on all 1M items is 1000x too slow. |

---

---

# MONTH 8 — AI Engineering + WebAssembly + Final Implementations

---

## Week 22 — AI Engineering: Embeddings + RAG + Tool Use

---

### Monday — Week 22 · Vector Embeddings + PGVector

| | |
|---|---|
| 🛠 **Technologies** | OpenAI embeddings API, `pgvector`, PostgreSQL |
| 📖 **Concepts** | Embeddings as semantic representations (similar meaning = close vectors), cosine similarity, dot product similarity, HNSW index for ANN (Approximate Nearest Neighbor), hybrid BM25 + vector search |
| 🎯 **You Build** | OpsAI semantic code search: "find functions that handle payment retries" returns relevant Go functions using embedding similarity, not keyword matching. |
| 🔗 **Why It Matters** | Keyword search misses synonyms and related concepts. Vector search finds "payment retry handler" when you search for "retry logic for transactions" — because both have similar embedding vectors. |

**Embeddings**: an embedding model converts text to a vector (array of 1536 floats for `text-embedding-ada-002`). Similar sentences have high cosine similarity. This is how semantic search works.

**HNSW index** in PGVector: hierarchical graph index for finding the K nearest vectors to a query vector. O(log N) search instead of O(N). With 1 million vectors, HNSW finds the 10 nearest in ~2ms.

---

### Tuesday — Week 22 · RAG: Retrieval-Augmented Generation

| | |
|---|---|
| 🛠 **Technologies** | Go, PGVector, OpenAI API, `pgvector` |
| 📖 **Concepts** | RAG pipeline: embed query → retrieve top-K similar chunks → inject into prompt → generate grounded answer. Chunking strategy, context window management, source citation. |
| 🎯 **You Build** | BookWise seat recommendation assistant: "Why does the Boeing 737 MAX require this procedure?" answers from the actual maintenance manuals, not from the LLM's training data. |
| 🔗 **Why It Matters** | Without RAG, the LLM hallucinates from training data (potentially outdated or wrong for your domain). With RAG, every answer is grounded in your actual documents — auditable and accurate. |

---

### Wednesday — Week 22 · AI SDK (Vercel) + Tool Use + Function Calling

| | |
|---|---|
| 🛠 **Technologies** | Vercel AI SDK, OpenAI function calling, Next.js |
| 📖 **Concepts** | `useChat` hook, `streamText`, tool definitions, the LLM deciding which tool to call, your code executing the tool, streaming responses to the client |
| 🎯 **You Build** | OpsAI chat interface using AI SDK: `useChat` streams the response token by token. Tools: `query_database`, `get_driver_status`, `check_kafka_lag`. LLM orchestrates all three. |
| 🔗 **Why It Matters** | AI SDK handles the streaming protocol between the server and browser. `streamText` streams the LLM response token by token — the user sees text appearing as it generates, not waiting for the full response. |

---

### Thursday–Friday — Week 22 · AI Agents + Multi-Agent Orchestration on DungBeetle

| | |
|---|---|
| 🛠 **Technologies** | Go, DungBeetle, OpenAI API |
| 📖 **Concepts** | Agent loop (LLM decides → execute tool → observe result → decide again), multi-agent (coordinator delegates to specialist agents), DungBeetle as the agent execution runtime |
| 🎯 **You Build** | OpsAI multi-agent system: coordinator agent breaks "investigate this production alert" into subtasks → anomaly detector agent + root cause agent + remediation suggester agent. Each runs as a DungBeetle AI job type. |
| 🔗 **Why It Matters** | A single LLM context window is limited (~128K tokens). Complex investigations require more context than fits. Multi-agent systems parallelize work and use specialist agents with focused context — the same pattern as a team of engineers. |

---

## Week 23 — Complete System Design Implementations

---

### Monday–Tuesday — Week 23 · Designing Twitter Trends + Notification System

| | |
|---|---|
| 🛠 **Technologies** | Go, Redis, Kafka, Count-Min Sketch, APNs/FCM |
| 📖 **Concepts** | Sliding window counters, Count-Min Sketch for Top-K approximation, fan-out on write vs fan-out on read, push vs pull delivery, notification deduplication, preference management |
| 🎯 **You Build** | RouteMaster trending restaurants by zone (Count-Min Sketch). Push notifications for order events via APNs/FCM + WebSocket fallback. |

---

### Wednesday — Week 23 · Designing Realtime Abuse Masker

| | |
|---|---|
| 🛠 **Technologies** | Go, Kafka streaming, Redis, PostgreSQL |
| 📖 **Concepts** | Streaming classifier (evaluate messages as they arrive), shadow banning (user thinks content is visible, others cannot see it), appeal workflow, false positive handling |
| 🎯 **You Build** | RouteMaster review abuse masker: reviews with toxic content are shadow-masked in real time. Driver can appeal. |

---

### Thursday–Friday — Week 23 · Designing API Rate Limiter (Production Grade)

| | |
|---|---|
| 🛠 **Technologies** | Go, Redis Lua, SideCar |
| 📖 **Concepts** | Token bucket, leaky bucket, sliding window log, sliding window counter, fixed window, distributed rate limiting across instances, rate limit response headers |
| 🎯 **You Build** | Adaptive rate limiter in SideCar: measures upstream p99 latency, adjusts rate limit dynamically to keep p99 < 100ms. k6 load test verified. |
| 🔗 **Why It Matters** | A fixed-threshold rate limiter either throttles too aggressively (rejecting valid traffic) or too leniently (passing traffic that overloads downstream). An adaptive rate limiter finds the maximum sustainable throughput automatically. |

---

## Week 24 — Performance + Polish + System Design Final Review

---

### Monday–Tuesday — Week 24 · k6 Load Testing + pprof Profiling

| | |
|---|---|
| 🛠 **Technologies** | k6, `go tool pprof`, `clinic.js` |
| 📖 **Concepts** | Virtual users, ramp-up patterns, p50/p95/p99 measurement, SLO validation, CPU flame graphs, heap allocation profiling, goroutine dump |
| 🎯 **You Build** | Every service load tested: p50/p95/p99 at target RPS documented in `BENCHMARKS.md`. Every hotspot found with pprof. |

---

### Wednesday — Week 24 · `EXPLAIN ANALYZE` on Every Query

| | |
|---|---|
| 🛠 **Technologies** | PostgreSQL, `pg_stat_statements`, `auto_explain` |
| 📖 **Concepts** | Sequential scan elimination, index coverage verification, join strategy (hash join vs nested loop vs merge join), `auto_explain` logging slow queries automatically |
| 🎯 **You Build** | Zero sequential scans on tables > 10K rows. Every slow query has an index or has been rewritten. |

---

### Thursday — Week 24 · Lighthouse 100 + TypeScript Strict + Final CI

| | |
|---|---|
| 🛠 **Technologies** | Lighthouse, TypeScript `tsc --noEmit`, `govulncheck`, `trivy` |
| 📖 **Concepts** | Core Web Vitals (LCP, CLS, FID/INP), TypeScript strict mode compliance, dependency vulnerability scanning |
| 🎯 **You Build** | All 5 platforms: Lighthouse 100/100/100/100. `tsc --noEmit` passes with `strict: true`. `govulncheck` passes. `trivy image` passes. |

---

### Friday — Week 24 · PITR Drill + ADRs + README Final

| | |
|---|---|
| 🛠 **Technologies** | PostgreSQL WAL archiving, pg_basebackup |
| 📖 **Concepts** | Point-In-Time Recovery procedure, RTO documentation, ADR format, README architecture diagrams (Mermaid), benchmark numbers in README |
| 🎯 **You Build** | PITR drill executed and RTO documented (< 10 minutes). ADR written for every major technology decision. Every README has: Mermaid architecture diagram, benchmark numbers, live demo link. |

### Weekend Capstone — All Systems Complete

Every concept in the master checklist is checked off. Every system design is implemented. Every project has: tests, benchmarks, ADRs, `EXPLAIN ANALYZE`, Lighthouse 100, k6 results.

---

---

# MONTH 9 — Performance + Polish + Hiring Sprint

> No new technology. 100% polish, performance, and presentation. Every project must be portfolio-worthy.

---

## Final Polish Checklist (Every Project)

- [ ] `go test -race ./...` passes — data races are silent production bugs
- [ ] `go test -bench` on every data structure — know your numbers
- [ ] `tsc --noEmit` passes — `strict: true`, no `any`, no `ts-ignore`
- [ ] Vitest 80%+ coverage on core business logic
- [ ] Playwright E2E in CI — branch protection enforced
- [ ] Lighthouse 100/100/100/100 on all 5 platform frontends
- [ ] `EXPLAIN ANALYZE` on every query — no seq scans on large tables
- [ ] k6 load test documented: p50/p95/p99 at target RPS
- [ ] Prometheus + Grafana dashboard live for every service — RED method, runtime, DB, business metrics
- [ ] All 5 services emitting traces to Jaeger — distributed traces cross service boundaries
- [ ] Structured `slog` JSON logs with `trace_id` on every line — queryable in Loki/Elasticsearch
- [ ] SLO-based alert rules in Prometheus — Alertmanager routes P1→PagerDuty, P2/P3→Slack
- [ ] On-call runbook written for every alert — linked from alert annotation
- [ ] Grafana exemplars configured — click a latency spike, jump directly into the trace
- [ ] PITR drill: DROP TABLE → restore → RTO < 10 min → runbook written
- [ ] `govulncheck` passes, `trivy image` passes (no HIGH/CRITICAL CVEs)
- [ ] ADR for every major technology decision
- [ ] README: Mermaid architecture diagram + benchmark numbers + live demo link
- [ ] CONTRIBUTING.md: how to run locally, test, deploy
- [ ] LinkedIn/X post every weekend: screenshot + benchmark + architecture diagram

---

## Non-Negotiable Rules (From Day 1)

| Rule | Why |
|------|-----|
| `go test -race ./...` before every commit | Data races are intermittent and impossible to debug in production |
| `tsc --noEmit` in CI — no `any` | TypeScript `any` silently disables all type checking for that value |
| Lighthouse 100/100/100/100 | Set Week 1, maintained all 9 months |
| `EXPLAIN ANALYZE` on every SQL query | Blind queries are time bombs |
| Idempotency key on every mutation that could be retried | Duplicate operations corrupt data |
| Outbox pattern for every Kafka publish that must be guaranteed | Events lost at publish time = silent data inconsistency |
| ADR for every major technology decision | Future you needs to know why |
| k6 load test before calling anything "production-ready" | Untested performance claims are fiction |
| `goleak.VerifyNone(t)` in every Go test file | Goroutine leaks accumulate and eventually crash production |
| Post benchmark numbers publicly every weekend | Building in public accelerates learning and is proof of work |
