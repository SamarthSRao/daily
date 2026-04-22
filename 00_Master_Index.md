# Backend Engineering Mastery Plan — Master Index
## Language Split · Building Block Map · Coverage Tracker

---

## The Language Split

### Main Projects (5 repos)

| Project | Primary Language | Secondary | Backend Type | What It Demonstrates |
|---|---|---|---|---|
| **OpenTrace** | TypeScript + Go | — | Hybrid (TS API Gateway + UI, Go internals) | Distributed tracing, OTLP, ClickHouse, Kafka, gRPC, Next.js waterfall |
| **RouteMaster** | TypeScript (Node.js) | Go (crawler only) | TS-heavy backend | Fan-out notifications, Elasticsearch, SSE, REST, Kafka consumer, real-time tracking |
| **BookWise** | TypeScript (Node.js + Next.js) | — | TS-heavy full-stack | Distributed booking, Saga, waitlist state machine, Stripe webhooks, SSE seat map |
| **PayCore** | Go | — | Go-heavy backend | Double-entry ledger, idempotency, event sourcing, Saga, gRPC, Kafka |
| **DungBeetle** | Go | — | Go-heavy backend | Leader election, exactly-once cron, monolith→event-driven, Kafka, AI orchestration |

**3 TypeScript-heavy · 2 Go-heavy** — both languages at production depth, different problem domains.

---

### Biweekly Building Blocks (8 repos)

| # | Name | Primary Language | Interface | What It Teaches |
|---|---|---|---|---|
| 01 | **`vault`** | Go | REST | WAL, crash recovery, log compaction, fsync |
| 02 | **`pgpool`** | Go | TCP (pgwire proxy) | pgwire protocol, connection multiplexing, pool sizing |
| 03 | **`relay`** | Go | WebSocket + REST `/publish` | Redis pub/sub fan-out, distributed presence, clustered WS |
| 04 | **`resolver`** | Go | UDP DNS + REST `/resolve` | Binary protocol parsing, DNS delegation chain, TTL cache |
| 05 | **`lsm`** | Go | Go package (embedded lib) | MemTable, SSTable, Bloom filter, compaction, write amplification |
| 06 | **`herald`** | TypeScript (Node.js) | REST | Multi-channel delivery, outbox, idempotency, HMAC webhooks |
| 07 | **`gatekeeper`** | TypeScript (Node.js) | REST | OTP lifecycle, `crypto.randomInt`, Redis TTL, rate limiting, multi-tenancy |
| 08 | **`switchboard`** | TypeScript (Node.js) | REST + SSE | API gateway, JWT RS256, rate limiting, circuit breaker, SSE proxy |

**5 Go-heavy · 3 TypeScript-heavy**

---

## Plan Concept Coverage Map

Every concept from the Backend 2026 Roadmap Master Checklist is implemented in at least one project or biweekly block below.

### Stage 1 — Fundamentals
| Concept | Covered By |
|---|---|
| HTTP/HTTPS, methods, status codes, TLS handshake | All projects — `curl -v` on every endpoint |
| REST resource design, idempotency | BookWise, RouteMaster, herald, gatekeeper |
| DNS — A, CNAME, MX, TTL, `dig +trace` | resolver (built from scratch) |
| TCP/UDP, three-way handshake | pgpool (TCP proxy), resolver (UDP) |
| JSON vs Protobuf vs MessagePack | OpenTrace (Protobuf OTLP), PayCore (gRPC), RouteMaster (JSON) |

### Stage 2 — OS + Computer Networks
| Concept | Covered By |
|---|---|
| Processes, `fork/exec`, process lifecycle | DungBeetle (worker process management) |
| Threads vs goroutines, M:N scheduler | PayCore, DungBeetle, pgpool, relay |
| File system internals, `fsync`, `O_DIRECT` | vault (WAL + fsync), lsm (SSTable files) |
| Disk I/O — sequential vs random, write amplification | lsm (LSM-tree write path) |
| Socket programming, `net.Listen → Accept → Read/Write` | pgpool (TCP), resolver (UDP) |
| TCP in depth — TIME_WAIT, Nagle, `SO_REUSEPORT` | pgpool (pgwire proxy) |
| DNS protocol — wire format, label compression | resolver (binary DNS from scratch) |
| Load balancer internals — L4 vs L7 | switchboard (L7 routing) |

### Stage 3 — Frontend
| Concept | Covered By |
|---|---|
| TypeScript strict mode, branded types, `tsc --noEmit` | BookWise, RouteMaster, herald, gatekeeper, switchboard |
| React hooks, reconciliation, `React.memo` | OpenTrace UI, BookWise seat map, RouteMaster tracking UI |
| Next.js App Router, Server Components, ISR, streaming Suspense | OpenTrace UI, BookWise, RouteMaster |
| Zod — runtime validation + TypeScript type | herald, gatekeeper, switchboard, BookWise, RouteMaster |
| Tanstack Query — optimistic updates, `staleTime` | BookWise booking flow, RouteMaster order tracker |
| Shadcn UI — DataTable, Dialog, Command palette | OpenTrace UI, BookWise, RouteMaster |
| D3.js — data visualisation | OpenTrace trace waterfall |
| SSE — `text/event-stream`, auto-reconnect | BookWise live seat map, RouteMaster tracking, switchboard |

### Stage 4 — Backend Languages Deep
| Concept | Covered By |
|---|---|
| Node.js — V8 JIT, libuv event loop, `AsyncLocalStorage` | herald, gatekeeper, switchboard, RouteMaster, BookWise backends |
| Node.js streams — backpressure, `pipeline()`, `highWaterMark` | herald (delivery pipeline), RouteMaster (CSV/log streaming) |
| Go — goroutines, channels, M:N scheduler, work stealing | PayCore, DungBeetle, pgpool, relay, vault, lsm |
| Go — `errgroup`, `singleflight`, `sync.RWMutex/Pool/Once` | PayCore, DungBeetle, relay |
| Go — `context`, `pprof`, `go test -race`, `goleak` | All Go projects — enforced by CI |
| Go — `sqlc`, `chi`, `cobra`, `slog` | PayCore, DungBeetle |

### Stage 5 — DBMS Deep Internals
| Concept | Covered By |
|---|---|
| PostgreSQL MVCC, WAL, B-tree internals | vault (WAL from scratch), PayCore, DungBeetle |
| All 4 isolation levels with live anomaly demos | PayCore (dirty read, phantom read scripts in `/scripts`) |
| `EXPLAIN ANALYZE` mastery — seq scan → index scan | All 5 projects — zero seq scans rule |
| `SELECT FOR UPDATE SKIP LOCKED` | DungBeetle (job queue), herald (notification queue) |
| PgBouncer transaction mode vs session mode | pgpool (built from scratch) |
| Read replicas, streaming replication, replication lag | PayCore (analytics read replica) |
| Sharding, consistent hashing | DungBeetle (job routing), OpenTrace (trace routing) |
| Redis — all data structures, Lua scripts, pub/sub | relay, gatekeeper, BookWise, RouteMaster |
| MongoDB — document model, `$lookup`, indexes | RouteMaster (shipment documents) |
| Elasticsearch — inverted index, BM25, faceted search | RouteMaster (shipment search) |
| ClickHouse — MergeTree, columnar, partition pruning | OpenTrace (span storage) |
| LSM-tree from scratch — MemTable, SSTable, Bloom filter | lsm (built from scratch) |
| TCP connection pool from scratch — pgwire | pgpool (built from scratch) |

### Stage 6 — Object Storage
| Concept | Covered By |
|---|---|
| S3 presigned URLs, multipart upload, lifecycle policies | RouteMaster (shipment documents), OpenTrace (trace archive) |
| Cloudflare R2 vs S3 egress cost | RouteMaster ADR |

### Stage 7 — Queues + Message Brokers
| Concept | Covered By |
|---|---|
| Kafka — topic/partition/offset, consumer groups, exactly-once | PayCore, DungBeetle, OpenTrace |
| Kafka outbox pattern | PayCore (payment events), DungBeetle (job events), OpenTrace (span pipeline) |
| Database-backed queues, `SELECT FOR UPDATE SKIP LOCKED` | herald (notification queue), DungBeetle v1 |
| Event sourcing, CQRS | PayCore (account state from events) |
| Saga choreography | PayCore (payment Saga), BookWise (booking + payment Saga) |

### Stage 8 — Real-Time Systems
| Concept | Covered By |
|---|---|
| WebSocket — upgrade, `gorilla/websocket`, ping/pong, fan-out | relay (clustered WS from scratch) |
| SSE — `text/event-stream`, auto-reconnect, `Last-Event-ID` | BookWise (live seat map), RouteMaster (order tracker), switchboard |
| Distributed presence — heartbeat, TTL-based expiry | relay (Redis HSET + 60s TTL) |

### Stage 9 — Security
| Concept | Covered By |
|---|---|
| JWT RS256 asymmetric, refresh token rotation, Redis revocation | switchboard (gateway auth), BookWise, RouteMaster |
| HMAC webhook signatures, `timingSafeEqual` | herald (delivery webhooks), PayCore (Stripe callbacks) |
| `crypto.randomInt` vs `Math.random` for secrets | gatekeeper |
| Rate limiting per client — token bucket, sliding window | switchboard (gateway), gatekeeper, herald |
| Input validation — Zod, `http.MaxBytesReader` | All TS projects (Zod), all Go projects (`http.MaxBytesReader`) |
| Container hardening — non-root, `trivy image`, `govulncheck` | All 8 biweekly blocks + all 5 main projects |
| OTP lifecycle — generate, hash, verify, expire | gatekeeper |
| OAuth2 PKCE flow | switchboard (gateway), BookWise |

### Stage 10 — Testing
| Concept | Covered By |
|---|---|
| Vitest + `@testing-library/react`, 80%+ coverage | BookWise, RouteMaster, herald, gatekeeper, switchboard |
| Go `testing` + `testify`, table-driven tests | PayCore, DungBeetle, vault, pgpool, relay, resolver, lsm |
| `testcontainers-go` — real PostgreSQL/Redis/Kafka in tests | PayCore, DungBeetle |
| Playwright E2E | OpenTrace UI, BookWise, RouteMaster |
| `go test -race ./...` | All Go projects — enforced before every commit |
| `goleak.VerifyNone(t)` | All Go projects — goroutine leak detection |

### Stage 11 — Infrastructure + DevOps
| Concept | Covered By |
|---|---|
| Docker multi-stage builds, non-root user, `trivy` | All 13 repos |
| Kubernetes — Pod/Deployment/Service/Ingress/HPA | OpenTrace (K8s Operator), all 5 projects |
| Terraform — HCL, state, modules | All 5 projects (ECS Fargate + RDS) |
| GitHub Actions — lint → test → race → trivy → deploy | All 13 repos |
| AWS — ECS Fargate, RDS Multi-AZ, ElastiCache, MSK, S3 | All 5 main projects |
| Cloudflare — DNS, CDN, Workers, R2 | RouteMaster, switchboard |

### Stage 12 — Observability + Performance Engineering
| Concept | Covered By |
|---|---|
| OTel traces — auto-instrumentation, `traceparent`, manual spans | All 5 main projects + switchboard |
| Prometheus + Grafana — RED method, PromQL, SLO alerts | All 5 main projects + all biweekly blocks |
| Structured `slog` JSON logs, `trace_id` on every line | All Go projects |
| `pprof` — CPU flame graph, heap, goroutine dump | PayCore, DungBeetle (Month 8) |
| k6 load testing — p50/p95/p99, `BENCHMARKS.md` | All 5 main projects |
| `EXPLAIN ANALYZE` mastery, `auto_explain` | All 5 main projects |

### Stage 13 — AI-Native Stack
| Concept | Covered By |
|---|---|
| LLM fundamentals, RAG pipeline | DungBeetle (AI job orchestration), RouteMaster (AI search) |
| PGVector — HNSW index, cosine distance | BookWise (seat recommendations), RouteMaster |
| Vercel AI SDK — `useChat`, `streamText`, tool use | DungBeetle (AI job UI), RouteMaster (smart search) |
| AI agents — tool use, agent loop | DungBeetle (AI-powered job routing) |

### Stage 14 — Distributed Systems Deep
| Concept | Covered By |
|---|---|
| Leader election — Redis SETNX + TTL + heartbeat | DungBeetle (cron leader), distributed locking logic |
| Distributed locks with fencing tokens | BookWise (seat lock), PayCore (idempotency), lsm (compaction lock) |
| Consistent hashing + virtual nodes | DungBeetle (job routing), OpenTrace (trace routing), RouteMaster (driver assignment) |
| Bloom filters — false positive rate, Redis BF | RouteMaster (web crawler dedup), lsm (per-SSTable) |
| CAP theorem — CP vs AP tradeoffs | All ADRs |
| Saga pattern — choreography + compensating transactions | PayCore, BookWise |
| Event sourcing — state = replay of events | PayCore |
| Exactly-once semantics — idempotent producer, outbox | PayCore, DungBeetle, OpenTrace |
| Raft consensus basics | DungBeetle (read, not build) |

### Stage 15 — Engineering Practices
| Concept | Covered By |
|---|---|
| RFC writing — problem → options → decision → tradeoffs | All 5 main projects (1 RFC each per month) |
| ADRs — one-page, every major decision | All 13 repos |
| API versioning, breaking change policy | switchboard (gateway versioning), all projects |
| Feature flags + progressive rollouts | DungBeetle (LaunchDarkly), switchboard |
| Monolith → event-driven migration | DungBeetle (Node.js monolith → Go event-driven) |
| Circuit breakers, bulkhead isolation | switchboard (gateway), PayCore |
| gRPC service definitions, webhook HMAC | PayCore (gRPC), herald (HMAC webhooks) |

---

## Building Block Dependency Graph

```
switchboard ──JWT verify (RS256)──→ BookWise, RouteMaster frontends
     │
     └──rate limit──→ gatekeeper (OTP)
     └──route──→     herald (notifications)
     └──circuit breaker──→ All Upstreams

herald ──delivery──→ BookWise (waitlist), RouteMaster (shipment), PayCore (payment confirm)
  │
  └──sends OTP via──→ gatekeeper

gatekeeper ──2FA──→ PayCore (wire transfer), BookWise (confirm booking), RouteMaster (driver verification)

relay ──WebSocket──→ BookWise (seat hold), RouteMaster (driver location), OpenTrace (live tail)
  │
  └──/publish called by──→ BookWise API, RouteMaster API, OpenTrace Processor

vault ──WAL engine──→ DungBeetle (job dedup), PayCore (idempotency), lsm (WAL recovery)

pgpool ──PG proxy──→ PayCore, DungBeetle, BookWise backend, RouteMaster backend

resolver ──DNS──→ All services in Docker network (debug DNS lookups)

lsm ──Go package──→ imported by OpenTrace (span storage), DungBeetle (job metadata)
```
