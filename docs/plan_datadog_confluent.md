# Full-Stack Engineering Mastery Plan
## Targeting Datadog · Confluent · Snowflake · Kong · Okta / WorkOS
### Deep Infra + Observability + Data Platforms Track — Sequential Projects

---

## The Core Principle: One Project at a Time

You finish one project completely before starting the next. Each project is built deeply, deployed, benchmarked, and documented before you touch the next one. Every project is **specifically modelled on real internal tooling** at the target company — not a generic portfolio piece.

---

## The 4 Projects (Sequential — Complete One Before Starting the Next)

| Order | Project | Mirrors | Duration | What the Company Actually Uses This For |
|-------|---------|---------|----------|-----------------------------------------|
| **1st** | **ObserveFlow** | Datadog's internal collector + ingestion pipeline | Months 1–2 | The Datadog agent (written in Go) runs on every host, collects metrics/traces/logs via OTLP, and ships to the Datadog backend. ObserveFlow is that collector + backend + dashboard — built by you. |
| **2nd** | **VaultAuth** | Okta/WorkOS's internal identity infrastructure | Month 3 | Okta's engineers build the OIDC provider, SAML SP, MFA enrollment, API key management, and audit log that millions of companies depend on for auth. VaultAuth is that internal platform. |
| **3rd** | **StreamBridge** | Confluent's internal Kafka management platform | Months 4–5 | Confluent's engineers operate hundreds of Kafka clusters, enforce Schema Registry compatibility, manage consumer group lag, and build ksqlDB-style stream processing. StreamBridge is that internal tooling. |
| **4th** | **CrystalDB** | Snowflake's internal query engine + data sharing | Month 6 | Snowflake's engineers build the columnar query engine, partition pruning, result cache, and data sharing credential system. CrystalDB mirrors those internal systems. |

---

## Project 1: ObserveFlow — Observability Collector + Ingestion + Dashboard
### Months 1–2 · Mirrors Datadog's Agent + Backend Infrastructure

**What Datadog actually uses:** The Datadog agent is a Go binary that runs as a DaemonSet on every Kubernetes node. It collects metrics (system CPU, memory, disk), traces (from OTel SDKs), and logs (from container stdout). It speaks OTLP (OpenTelemetry Protocol) over gRPC. It ships to the Datadog backend which fans data into ClickHouse (for metrics/traces) and Elasticsearch (for logs). ObserveFlow is that entire system — agent to dashboard.

---

### Month 1, Week 1: HTTP + HTML + CSS + OpenTelemetry Mental Model

**Monday — HTTP + OTLP Protocol + mTLS + CLI Setup**

| | |
|---|---|
| 🛠 **Technologies** | Node.js 22, VS Code, pnpm, `curl`, `openssl`, `@opentelemetry/sdk-node` |
| 📖 **Concepts** | HTTP/HTTPS, DNS, TLS handshake, **mTLS** (both sides present certificates — used between ObserveFlow collector and backend), OTLP protocol (gRPC + HTTP/protobuf), OTel data model (trace/metric/log with shared `resource` + `attributes`) |
| 🎯 **You Build** | ObserveFlow raw Node.js OTLP/HTTP receiver: `POST /v1/traces`, `POST /v1/metrics`, `POST /v1/logs`. Configure a real Node.js app with `@opentelemetry/sdk-node` to send to `localhost:4318` — see your own traces arrive. |
| 🔗 **Why It Matters** | This is Datadog's exact ingestion endpoint design. The `POST /v1/traces` endpoint you build today becomes the full ClickHouse pipeline in Week 9. The mTLS pattern is how the Datadog agent authenticates to the backend — no API key, just a certificate. |

**Tuesday — HTML + CSS + ObserveFlow Dashboard Layout**

| | |
|---|---|
| 🛠 **Technologies** | HTML5, CSS, Tailwind, Shadcn, Recharts |
| 📖 **Concepts** | Semantic HTML, box model, flexbox, grid, Tailwind, `cva` for metric card variants, Recharts for time-series charts |
| 🎯 **You Build** | ObserveFlow dashboard HTML + CSS: metrics overview cards (CPU/memory/request rate), time-series line chart (Recharts), trace waterfall skeleton (D3.js will fill it in Week 9). Lighthouse 90+. |

**Wednesday — JavaScript Engine Deep**

| | |
|---|---|
| 🛠 **Technologies** | Node.js, TypeScript, Vitest |
| 📖 **Concepts** | Primitive vs reference types, closures, event loop (call stack, microtask, macrotask), `Promise.all`/`allSettled`, generators for lazy metric pagination |
| 🎯 **You Build** | `packages/utils/retry.ts` — used by ObserveFlow collector for failed OTLP deliveries. `packages/utils/concurrent.ts` — `ConcurrencyLimiter` for batching metric writes to ClickHouse. `packages/utils/emitter.ts` — alert state machine. |

**Thursday — TypeScript: Generics + Branded Types + Zod**

| | |
|---|---|
| 🛠 **Technologies** | TypeScript strict mode, Zod |
| 📖 **Concepts** | Branded types (`TraceId`, `SpanId`, `MetricName`, `ServiceName`), generics, `z.infer`, discriminated unions for OTel signal types |
| 🎯 **You Build** | `packages/types` — `TraceId`, `SpanId`, `MetricName` are branded. `packages/schemas` — `SpanSchema`, `MetricPointSchema`, `LogRecordSchema` validated through Zod before any storage write. |

**Friday — React + Tanstack Query + Zustand + Recharts**

| | |
|---|---|
| 🛠 **Technologies** | React 18, Tanstack Query, Zustand, Recharts, Nivo |
| 📖 **Concepts** | All hooks, optimistic updates, selective subscription, `useQuery` for metrics polling, Recharts `<LineChart>` with live data |
| 🎯 **You Build** | ObserveFlow metrics dashboard: Recharts time-series chart updates every 10s (Tanstack Query poll). Service selector (Zustand). Sparklines on metric cards. Animated transitions on chart updates (Motion). |

**Weekend — ObserveFlow Full-Stack Shell**

OTLP receiver + React dashboard + PostgreSQL metadata + JWT auth. Deployed. Lighthouse 90+.

---

### Month 1, Week 2–3: Node.js Internals + PostgreSQL + ClickHouse

**Week 2, Monday — V8 + Streams: High-Throughput OTLP Ingestion**

| | |
|---|---|
| 🛠 **Technologies** | Node.js `stream/promises`, `worker_threads`, `node --inspect` |
| 📖 **Concepts** | V8 JIT, hidden classes, GC pressure, streams backpressure, `worker_threads` for CPU-bound protobuf parsing |
| 🎯 **You Build** | ObserveFlow OTLP stream: incoming OTLP/HTTP protobuf → Transform stream (parse protobuf in `worker_threads`) → Writable (batch to ClickHouse 500 spans at a time). 200MB log file processed in constant memory. |
| 🔗 **Why It Matters** | Datadog's backend ingests 10M+ spans/sec. Parsing protobuf synchronously would block the event loop. Moving it to `worker_threads` is the same pattern Datadog uses for CPU-intensive deserialization. |

**Week 2, Tuesday — ClickHouse: Metrics + Traces Storage**

| | |
|---|---|
| 🛠 **Technologies** | ClickHouse, Go ClickHouse client |
| 📖 **Concepts** | MergeTree engine, partitioning by date, `ORDER BY (service, timestamp)` for fast per-service queries, sub-second aggregations on billions of rows, `EXPLAIN` on ClickHouse |
| 🎯 **You Build** | ObserveFlow ClickHouse schema: `spans` table (traceId, spanId, service, operation, duration, timestamp, attributes). `metrics` table (name, value, labels, timestamp). Query: `SELECT avg(duration) FROM spans WHERE service = 'payment' AND timestamp > now() - INTERVAL 1 HOUR` → < 100ms on 1B rows. |
| 🔗 **Why It Matters** | Datadog's metrics backend is ClickHouse. The same `SELECT p99(duration) FROM spans GROUP BY service` that takes 30 seconds in PostgreSQL takes 200ms in ClickHouse because of columnar storage and vectorized execution. You experience this difference yourself. |

**Week 2, Wednesday — Elasticsearch: Log Search**

| | |
|---|---|
| 🛠 **Technologies** | Elasticsearch, `@elastic/elasticsearch` Node.js client |
| 📖 **Concepts** | Inverted index for full-text log search, index lifecycle management (hot → warm → cold → delete), Grok patterns for log parsing, field extraction |
| 🎯 **You Build** | ObserveFlow log search: `POST /v1/logs` → parse with Grok → Elasticsearch index. `GET /logs/search?query=error+payment+timeout` → full-text search results in < 50ms. Index lifecycle: logs > 30 days moved to cold storage. |

**Week 2, Thursday — TimescaleDB: Rollup Metrics**

| | |
|---|---|
| 🛠 **Technologies** | TimescaleDB, PostgreSQL |
| 📖 **Concepts** | Hypertables with automatic time partitioning, continuous aggregates (precompute hourly/daily rollups), partition pruning for time-range queries |
| 🎯 **You Build** | ObserveFlow TimescaleDB: raw metrics stored in ClickHouse. Hourly rollups (p50/p95/p99/avg) materialized in TimescaleDB continuous aggregate. Dashboard queries hit TimescaleDB for fast historical views. |
| 🔗 **Why It Matters** | Datadog's metrics architecture is two-tier: raw high-resolution data in a fast column store, pre-aggregated rollups for dashboard queries. You implement both. |

**Week 2, Friday — All 4 Isolation Levels + Indexes + N+1**

| | |
|---|---|
| 🛠 **Technologies** | PostgreSQL, `sqlc`, `pgxpool` |
| 📖 **Concepts** | MVCC, all 4 isolation levels with live anomaly demos, B-tree/partial/GIN indexes, `EXPLAIN ANALYZE`, N+1 elimination |
| 🎯 **You Build** | ObserveFlow metadata: `services`, `monitors`, `alerts`, `dashboards` in PostgreSQL. Every query `EXPLAIN ANALYZE`'d. No seq scans. `SELECT FOR UPDATE` for alert state transitions. |

**Week 3: JWT Auth + RBAC + Redis + Webhook HMAC**

| | |
|---|---|
| 🛠 **Technologies** | JWT RS256, Redis, Node.js `crypto`, `AsyncLocalStorage` |
| 📖 **Concepts** | RS256 asymmetric JWT, 3-role RBAC, HMAC webhook signing, request-scoped logger via `AsyncLocalStorage` |
| 🎯 **You Build** | `packages/auth`: JWT RS256 auth for all projects. ObserveFlow alert webhooks signed with HMAC (`X-ObserveFlow-Signature`). Request-scoped logger: every log includes `serviceId`, `traceId`, `requestId`. |

---

### Month 2, Week 5–6: Go Collector Agent + K8s DaemonSet Operator

**Week 5: Go Language + Concurrency**

| | |
|---|---|
| 🛠 **Technologies** | Go 1.22, `golangci-lint`, `goleak`, `go test -race` |
| 📖 **Concepts** | Zero values, interfaces, error wrapping, goroutines + M:N scheduler, channels, `sync.RWMutex`, `errgroup`, `singleflight`, `atomic.Int64` |
| 🎯 **You Build** | ObserveFlow Go collector agent: gathers host metrics (CPU, memory, disk, network) every 10s using `gopsutil`. Reads container logs from Docker socket. Sends to ObserveFlow backend via OTLP/gRPC. Single static binary, 8MB. `go test -race` passes. `goleak.VerifyNone(t)` clean. |
| 🔗 **Why It Matters** | The Datadog agent is this exact system. It's a single Go binary that ships as a DaemonSet. It collects from the host's `cgroups`, reads Docker/containerd logs, and speaks OTLP. You build an equivalent. |

**Week 5, Thursday–Friday — gRPC OTLP Receiver**

| | |
|---|---|
| 🛠 **Technologies** | gRPC, Protocol Buffers, `buf` CLI, OTel proto definitions |
| 📖 **Concepts** | OTLP/gRPC receiver (implement the `TraceService`, `MetricsService`, `LogsService` protobuf services), mTLS between agent and backend, streaming RPCs for log tailing |
| 🎯 **You Build** | ObserveFlow backend gRPC receiver: `TraceService.Export`, `MetricsService.Export`, `LogsService.Export` — the same protobuf services that every OTel SDK speaks to. mTLS: agent presents cert, backend verifies. |

**Week 6: K8s DaemonSet Operator + Alert Engine**

| | |
|---|---|
| 🛠 **Technologies** | Go, `controller-runtime`, Kubernetes DaemonSet |
| 📖 **Concepts** | K8s Operator pattern, CRD (`ObserveFlowCollector`), DaemonSet management via Operator, Prometheus alert rules as CRDs |
| 🎯 **You Build** | ObserveFlow `CollectorOperator`: `ObserveFlowCollector` CRD → Operator deploys DaemonSet. Every new node gets an agent automatically. `kubectl apply -f collector.yaml` → agents running on all nodes in 30s. |
| 🔗 **Why It Matters** | Datadog's Kubernetes installation is a Helm chart that creates a DaemonSet. You build the Operator that manages that DaemonSet — the exact infrastructure Datadog's K8s engineering team maintains. |

**Week 6, Thursday–Friday — Alert Engine**

| | |
|---|---|
| 🛠 **Technologies** | Go, Kafka, Redis, ClickHouse |
| 📖 **Concepts** | Threshold alerts, anomaly detection (mean ± 3σ sliding window), composite alerts (AND/OR conditions), noise reduction (don't alert on 1-minute transient spike), alert grouping + dedup |
| 🎯 **You Build** | ObserveFlow alert engine: `(error_rate > 1%) AND (p99_latency > 500ms) FOR 5 MINUTES` → alert fires. Kafka fan-out to PagerDuty + Slack + email + WebSocket (live alert feed in dashboard). Alert dedup: same alert firing 100 times → 1 notification with count. |

**Weekend — ObserveFlow COMPLETE**

ObserveFlow finished. k6: 10M spans/sec ingest, ClickHouse query p99 < 200ms on 30-day data. Agent binary 8MB. DaemonSet deploys in 30s. Alert engine with noise reduction live. ADRs written. LinkedIn post. Now start VaultAuth.

---

## Project 2: VaultAuth — Identity + Auth Infrastructure
### Month 3 · Mirrors Okta/WorkOS's Internal Auth Platform

**What Okta actually uses:** Okta's engineers build and operate the OIDC provider (issuing ID/access/refresh tokens), the SAML 2.0 SP (accepting SAML assertions from enterprise IdPs), the MFA enrollment system (TOTP + WebAuthn), API key management (hash on store, last-used tracking, rotation), and the append-only audit log. VaultAuth is that internal platform.

**The key insight:** Every other project will authenticate via VaultAuth from Week 1 of each project. VaultAuth is the auth infrastructure that the other three platforms depend on — just like Okta is used by the companies that use Datadog, Confluent, and Snowflake.

---

### Month 3, Week 7: VaultAuth Foundation

**Monday — OIDC Provider: Token Issuance**

| | |
|---|---|
| 🛠 **Technologies** | Go, PostgreSQL, Redis, `golang-jwt/jwt` |
| 📖 **Concepts** | OIDC discovery (`/.well-known/openid-configuration`), authorization code flow (`/auth/authorize` → redirect → `/auth/token`), ID token vs access token vs refresh token, JWKS (`/.well-known/jwks.json`), RS256 token signing |
| 🎯 **You Build** | VaultAuth OIDC provider: full authorization code flow. ID token contains `sub`, `email`, `name`, `iat`, `exp`. Access token is short-lived (15min). Refresh token stored in Redis (7 days). JWKS endpoint serves public keys for verification. |
| 🔗 **Why It Matters** | Every company using Okta goes through this exact flow. When StreamBridge (Project 3) needs "Login with VaultAuth", it implements the authorization code flow against your OIDC endpoints — the same way Confluent Cloud authenticates with Okta. |

**Tuesday — SAML 2.0 Service Provider**

| | |
|---|---|
| 🛠 **Technologies** | Go, `crewjam/saml` library |
| 📖 **Concepts** | SAML 2.0 assertions, SP-initiated SSO, SAML metadata exchange, attribute mapping (SAML attributes → VaultAuth user properties) |
| 🎯 **You Build** | VaultAuth SAML SP: enterprise customers can configure their own IdP (Google Workspace, Azure AD, Ping). SP-initiated SSO: user visits VaultAuth → redirect to enterprise IdP → SAML assertion → VaultAuth creates/updates user → issues OIDC tokens. |
| 🔗 **Why It Matters** | Every enterprise Okta customer has SAML-based SSO with their corporate IdP. Building the SAML SP teaches you the exact protocol that Okta's enterprise product is built on. |

**Wednesday — MFA: TOTP + WebAuthn**

| | |
|---|---|
| 🛠 **Technologies** | Go, `pquerna/otp` (TOTP), WebAuthn Go library |
| 📖 **Concepts** | TOTP (RFC 6238): time-based OTP, `otpauth://` URI for QR codes, 30-second windows, drift tolerance. WebAuthn: passkeys, authenticator registration ceremony, assertion ceremony, CBOR-encoded credential |
| 🎯 **You Build** | VaultAuth MFA: enroll TOTP (QR code → Google Authenticator). Enroll WebAuthn (passkey → Touch ID / Face ID). MFA required on login. Step-up auth: sensitive action (delete org) requires MFA re-prompt even if already logged in. |

**Thursday — API Key Management**

| | |
|---|---|
| 🛠 **Technologies** | Go, PostgreSQL, Redis |
| 📖 **Concepts** | API key hashing (store only `SHA256(key)`, never the key), `last_used_at` tracking, key rotation (issue new key, old key still valid for 24h grace period), key scopes, rate limiting per key |
| 🎯 **You Build** | VaultAuth API keys: `POST /keys` returns the key once (never again). Stored as `SHA256(key)`. `last_used_at` updated on every authenticated request. Key rotation: new key issued, old key deactivated after 24h. Rate limit: 100 req/s per key (Sorted Set in Redis). |
| 🔗 **Why It Matters** | Stripe, Datadog, Confluent all use this exact pattern. You never store the raw API key. The user sees it once. You can verify it by hashing the incoming key and comparing against stored hashes. |

**Friday — Audit Log: Append-Only + Tamper-Evident**

| | |
|---|---|
| 🛠 **Technologies** | Go, PostgreSQL, Kafka, Elasticsearch |
| 📖 **Concepts** | Append-only table (no UPDATE/DELETE), tamper-evident hash chain (each row hashes previous row), Kafka CDC for audit log, Elasticsearch full-text search over audit events |
| 🎯 **You Build** | VaultAuth audit log: every auth event (login, logout, MFA enroll, key created, key used, permission changed) is an immutable row. Hash chain: `hash_of_row = SHA256(previous_row_hash + row_content)`. Verify chain integrity endpoint: `GET /audit/verify`. |

---

### Month 3, Week 8: VaultAuth Advanced + Testing

**Monday–Tuesday — Rate Limiting + Session Management + Device Trust**

| | |
|---|---|
| 🛠 **Technologies** | Redis Lua, Go |
| 📖 **Concepts** | All 4 rate limit algorithms, concurrent session limits (max 5 active sessions per user), device trust scoring (known device → lower friction, unknown → step-up auth) |
| 🎯 **You Build** | VaultAuth rate limiting: all 4 algorithms (token bucket on login, sliding window on MFA attempts, fixed window on key usage, leaky bucket on SAML assertions). Concurrent session enforcement: 6th session logs out oldest. Device fingerprinting: trust score based on browser fingerprint, IP reputation, user agent. |

**Wednesday — Next.js Frontend + WebAuthn UI**

| | |
|---|---|
| 🛠 **Technologies** | Next.js, React, Tanstack Query, Motion |
| 📖 **Concepts** | Server Components for public auth pages, `'use client'` for MFA flows, WebAuthn browser API (`navigator.credentials.create`/`get`) |
| 🎯 **You Build** | VaultAuth frontend: login page (Server Component, fast), MFA enrollment flow (TOTP QR code display, WebAuthn registration ceremony), admin portal (user management, key listing, audit log viewer). |

**Thursday–Friday — Full Test Suite + k6**

| | |
|---|---|
| 🛠 **Technologies** | `testcontainers`, Playwright, k6, Go `testing` |
| 📖 **Concepts** | Auth flow E2E testing (Playwright), `testcontainers` for real PostgreSQL + Redis in tests, k6 load test on token issuance |
| 🎯 **You Build** | VaultAuth: k6 at 10K token issuances/sec, p99 < 20ms. Playwright: full OIDC login flow. Full SAML SSO flow. `go test -race` passes. |

**Weekend — VaultAuth COMPLETE**

OIDC provider + SAML SP + TOTP + WebAuthn + API keys + audit log. k6: 10K tokens/sec, p99 < 20ms. ADRs: "Why hash API keys not encrypt", "Why WebAuthn over SMS OTP". LinkedIn post. Now start StreamBridge.

---

## Project 3: StreamBridge — Kafka Management + Stream Processing Platform
### Months 4–5 · Mirrors Confluent's Internal Kafka Operations Platform

**What Confluent actually uses:** Confluent's engineers operate Kafka clusters (now with KRaft — no Zookeeper), enforce Schema Registry compatibility (Avro/Protobuf/JSON Schema), manage consumer group lag, build Kafka Streams stateful processors, and provide a UI for data engineers to interact with all of this. StreamBridge is that internal operations platform.

---

### Month 4, Week 9: StreamBridge Foundation

**Monday — Kafka Broker Architecture + KRaft**

| | |
|---|---|
| 🛠 **Technologies** | Apache Kafka (KRaft mode), `kcat`, Go Confluent Kafka client |
| 📖 **Concepts** | KRaft (Kafka Raft — no Zookeeper), broker roles (controller vs broker vs combined), leader election within Raft quorum, ISR (In-Sync Replicas), partition assignment across brokers |
| 🎯 **You Build** | StreamBridge: local KRaft Kafka cluster (3 nodes). Create topics, inspect partition leaders, trigger leader election (kill broker, watch leader change). StreamBridge API: `GET /clusters/{clusterId}/brokers`, `GET /clusters/{clusterId}/topics`. |
| 🔗 **Why It Matters** | Confluent switched Kafka from Zookeeper to KRaft in Kafka 3.3. Understanding why (Zookeeper was the operational bottleneck for large clusters) and how it works is an explicit Confluent interview topic. |

**Tuesday — Schema Registry: Compatibility Enforcement**

| | |
|---|---|
| 🛠 **Technologies** | Confluent Schema Registry, Avro, Protobuf, JSON Schema |
| 📖 **Concepts** | Schema Registry REST API, compatibility modes (BACKWARD/FORWARD/FULL/NONE), schema evolution rules (BACKWARD: new reader can read old data), Avro schema fingerprint for deduplication |
| 🎯 **You Build** | StreamBridge Schema Registry UI: register schema, check compatibility before registering (`POST /compatibility`), view schema evolution history. Demonstrate: add nullable field (BACKWARD compatible ✓), remove required field (BACKWARD incompatible — blocked). |
| 🔗 **Why It Matters** | A single schema-incompatible deployment can cause all consumers on a topic to crash. Confluent's Schema Registry is the enforcement mechanism. You build the UI for it. |

**Wednesday — Consumer Group Lag Monitoring**

| | |
|---|---|
| 🛠 **Technologies** | Go, Kafka AdminClient, ClickHouse |
| 📖 **Concepts** | Consumer lag (log end offset − committed offset), lag alerting, partition rebalancing, assignment strategies (Range, RoundRobin, Sticky) |
| 🎯 **You Build** | StreamBridge consumer lag dashboard: poll all consumer groups every 30s via `AdminClient.ListConsumerGroupOffsets`. Store in ClickHouse (time-series). Recharts chart: consumer group lag over 24h. Alert: lag > 1000 for 5 minutes → PagerDuty via ObserveFlow (Project 1). |
| 🔗 **Why It Matters** | Consumer lag is the primary SLA metric for Kafka-based systems. When lag grows, events are being produced faster than consumed — the system is falling behind. Confluent's Cloud UI is exactly this dashboard. |

**Thursday — Exactly-Once Semantics**

| | |
|---|---|
| 🛠 **Technologies** | Go Confluent Kafka client, idempotent producer config |
| 📖 **Concepts** | Idempotent producer (`enable.idempotence=true`), producer epochs, sequence numbers, transactional API (`begin_transaction`, `commit_transaction`, `abort_transaction`), exactly-once semantics across topic-partition pairs |
| 🎯 **You Build** | StreamBridge exactly-once demo: producer sends 10K messages. Kill and restart mid-way. Verify: exactly 10K messages consumed, none duplicated, none lost. Compare with non-idempotent producer (duplicates visible). |
| 🔗 **Why It Matters** | This is the hardest concept in Kafka and a guaranteed Confluent interview topic. "Explain how Kafka achieves exactly-once semantics" — you have working code that demonstrates it. |

**Friday — Kafka Connect: CDC + Sink Connectors**

| | |
|---|---|
| 🛠 **Technologies** | Kafka Connect, Debezium (CDC source), Elasticsearch sink |
| 📖 **Concepts** | Kafka Connect distributed mode, source connector (Debezium: DB changes → Kafka), sink connector (Kafka → Elasticsearch), offset management, connector REST API |
| 🎯 **You Build** | StreamBridge: Debezium connector captures every change from VaultAuth's `audit_log` PostgreSQL table → Kafka topic → Elasticsearch sink. StreamBridge UI: manage connectors (`GET /connectors`, `POST /connectors`, `DELETE /connectors/{name}`). |

---

### Month 4, Week 10: Kafka Streams + ksqlDB UI + Go Deep

**Monday–Tuesday — Kafka Streams: Stateful Processing**

| | |
|---|---|
| 🛠 **Technologies** | Kafka Streams (Java), Go proxy, React |
| 📖 **Concepts** | Stateful stream processing, tumbling windows, sliding windows, session windows, `KTable` vs `KStream`, exactly-once in Kafka Streams, changelog topics |
| 🎯 **You Build** | StreamBridge stream processor: `SELECT COUNT(*), service_name FROM auth_events WINDOW TUMBLING (SIZE 5 MINUTES) GROUP BY service_name` — authentication rate per service. Kafka Streams handles the windowed aggregation. StreamBridge wraps with REST API + live React chart. |

**Wednesday — Go Language + Concurrency for StreamBridge**

| | |
|---|---|
| 🛠 **Technologies** | Go, `golangci-lint`, `goleak`, `go test -race` |
| 📖 **Concepts** | Go interfaces, error wrapping, goroutines, `errgroup` for parallel cluster health checks, `singleflight` for consumer group lag deduplication |
| 🎯 **You Build** | StreamBridge cluster health checker in Go: `errgroup` queries all 3 brokers in parallel. `singleflight`: 100 concurrent lag requests for same consumer group → 1 AdminClient call. `goleak.VerifyNone(t)` clean. |

**Thursday — `net/http` + `sqlc` + K8s Operator**

| | |
|---|---|
| 🛠 **Technologies** | Go `net/http`, `chi`, `sqlc`, `controller-runtime` |
| 📖 **Concepts** | `http.Handler` interface, all 4 server timeouts, `sqlc` compile-time SQL, K8s Operator for Kafka topic lifecycle |
| 🎯 **You Build** | StreamBridge `KafkaTopicOperator`: `KafkaTopic` CRD → Operator creates/updates/deletes Kafka topics. `kubectl apply -f topic.yaml` → topic created in 5s with correct partition count and replication factor. |

**Friday — VaultAuth Integration + ObserveFlow Integration**

| | |
|---|---|
| 🛠 **Technologies** | OIDC authorization code flow, OTel SDK |
| 📖 **Concepts** | OIDC login flow against VaultAuth, OTel instrumentation sending traces to ObserveFlow |
| 🎯 **You Build** | StreamBridge authenticates users via VaultAuth OIDC. All StreamBridge HTTP spans appear in ObserveFlow's trace viewer. Consumer group lag alerts route through ObserveFlow's alert engine → PagerDuty. The 3 projects are now wired together. |

---

### Month 5, Week 11–12: StreamBridge System Design + Polish

**System design implementations in StreamBridge:**
- **Caching** — Kafka broker metadata cached in Redis (cache-aside, 30s TTL). Schema Registry schemas cached (write-through — always fresh). Consumer lag metrics in ClickHouse for historical.
- **Database isolation levels** — all 4 levels demonstrated. StreamBridge uses `READ COMMITTED` for connector status reads, `SERIALIZABLE` for schema registration (prevent concurrent conflicting schema changes).
- **Consistent hashing** — StreamBridge workers use consistent hash ring for partition assignment routing.
- **Bloom filter** — CDC event deduplication (same Debezium event seen twice → Bloom filter catches it).
- **Kafka at scale** — 1M messages/sec sustained, consumer lag < 1s. k6 load test documented.

**Weekend — StreamBridge COMPLETE**

k6: 1M messages/sec produced, consumer lag < 1s. Schema Registry UI with compatibility enforcement. KRaft cluster management. Exactly-once demo. ADRs: "Why KRaft over Zookeeper", "Why exactly-once over at-least-once for audit events". LinkedIn post. Now start CrystalDB.

---

## Project 4: CrystalDB — Columnar Query Engine + Data Sharing Platform
### Month 6 · Mirrors Snowflake's Internal Query Infrastructure

**What Snowflake actually uses:** Snowflake's engineers build the columnar query engine (partition pruning, vectorized execution), the result cache (same query within 24h → cached result), the data sharing system (read-only credentials for specific S3 prefixes), and the time-travel feature (query any table as it was at a previous point in time). CrystalDB mirrors these internal systems.

---

### Month 6, Week 13: CrystalDB Foundation

**Monday — Columnar Storage: Parquet + S3 Architecture**

| | |
|---|---|
| 🛠 **Technologies** | Apache Parquet, S3, Go AWS SDK, `parquet-go` |
| 📖 **Concepts** | Columnar vs row storage (why `SELECT avg(salary) FROM employees` reads only 1 column in Parquet vs all columns in row storage), Parquet row groups, metadata footer, predicate pushdown, partition pruning |
| 🎯 **You Build** | CrystalDB storage layer: datasets stored as Parquet files on S3, partitioned by `(year, month)` directory structure. Metadata in PostgreSQL: dataset name, schema, partition list, row counts, S3 paths. |
| 🔗 **Why It Matters** | Snowflake stores data as Parquet (actually their own columnar format based on Parquet) on S3. The separation of compute from storage — S3 holds the data, the query engine reads it — is Snowflake's architectural breakthrough. |

**Tuesday — ClickHouse as Query Engine**

| | |
|---|---|
| 🛠 **Technologies** | ClickHouse, `clickhouse-go` |
| 📖 **Concepts** | External data (ClickHouse reads Parquet from S3 via S3 table engine), partition pruning (only read relevant Parquet files), result cache (same hash → return cached result), concurrent query isolation |
| 🎯 **You Build** | CrystalDB query execution: SQL query → parse partition filter → identify relevant Parquet files on S3 → ClickHouse `SELECT` via S3 table engine → result. `SELECT COUNT(*) FROM trips WHERE month = '2024-01'` reads only January Parquet files. 100TB dataset, query returns in < 10s. |

**Wednesday — Data Time-Travel**

| | |
|---|---|
| 🛠 **Technologies** | S3 versioning, Delta Lake (alternative approach), Go |
| 📖 **Concepts** | Time-travel queries (`AS OF TIMESTAMP` / `AS OF VERSION`), immutable snapshot files on S3, transaction log for tracking versions, rolling back to previous state |
| 🎯 **You Build** | CrystalDB time-travel: `SELECT * FROM trips AS OF TIMESTAMP '2024-01-15 10:00:00'` returns the table as it was at that timestamp. Implemented via: every write creates a new immutable Parquet file. Transaction log tracks which files were active at each timestamp. |
| 🔗 **Why It Matters** | Snowflake's Time Travel is one of their most-used enterprise features. Data engineers query "what did this table look like yesterday before the broken pipeline ran?" You build the mechanism. |

**Thursday — Data Sharing: Read-Only Credentials**

| | |
|---|---|
| 🛠 **Technologies** | AWS S3, IAM roles, Go |
| 📖 **Concepts** | Snowflake Data Sharing pattern: generate a read-only IAM role with access to specific S3 prefix, share credentials with external party, revoke by deleting IAM role |
| 🎯 **You Build** | CrystalDB data sharing: `POST /shares` → creates read-only AWS IAM role scoped to `s3://crystaldb/{datasetId}/`. Returns temporary credentials (24h TTL). External party uses credentials to query S3 directly. Revoke: `DELETE /shares/{shareId}` → IAM role deleted. |
| 🔗 **Why It Matters** | Snowflake Data Sharing is how Snowflake customers share data across organizations without copying it. The underlying mechanism is exactly S3 + IAM role scoping. |

**Friday — SQL Editor Frontend + Query History**

| | |
|---|---|
| 🛠 **Technologies** | Next.js, React, Monaco Editor (VS Code editor in browser), Tanstack Query |
| 📖 **Concepts** | Monaco Editor integration (SQL syntax highlighting, autocomplete), streaming query results (SSE from backend), query history, query execution timeline |
| 🎯 **You Build** | CrystalDB SQL editor: Monaco Editor with SQL syntax highlighting + column autocomplete. Submit query → SSE streams result rows as they arrive. Query history in sidebar. Execution timeline shows: parse → partition pruning → ClickHouse execution → result. |

---

### Month 6, Week 14: All System Design Cases Documented

**Monday — Observability Platform + Kafka at Scale (System Design 1 + 2)**

ObserveFlow and StreamBridge implement these. Write final architecture ADRs, Mermaid diagrams, k6 numbers.

**Tuesday — Columnar Query Engine + API Gateway (System Design 3 + 4)**

CrystalDB implements the columnar query engine. For the API gateway (Kong-pattern), implement a lightweight plugin-based gateway in Go: all 4 project APIs behind one gateway. JWT verification via VaultAuth JWKS endpoint, rate limiting, request transformation.

**Wednesday — Identity Provider + Alerting + Distributed Tracing (System Design 5 + 6 + 7)**

VaultAuth implements the identity provider (OIDC + SAML + MFA). ObserveFlow implements alerting (threshold + anomaly + composite) and distributed tracing (Jaeger-compatible trace waterfall with D3.js).

**Thursday–Friday — Log Aggregation + Data Catalog + Rate Limiter + Anomaly Detection (System Design 8–11)**

| | |
|---|---|
| 🛠 **Technologies** | Elasticsearch, PGVector, Redis Lua, Wasm (AssemblyScript), ONNX |
| 📖 **Concepts** | Elasticsearch index lifecycle management, semantic search over CrystalDB catalog, all 4 rate limit algorithms at gateway level, anomalous auth detection (Wasm + Go rules + ONNX) |
| 🎯 **You Build** | Log aggregation: Elasticsearch with index lifecycle (hot → warm → cold → delete after 90 days). CrystalDB data catalog: every Parquet dataset registered + PGVector semantic search. API gateway rate limiter: all 4 algorithms. VaultAuth anomaly detection: Wasm pre-screen (known malicious IP list) + Go rules (impossible travel: login from Mumbai then Tokyo in 1 hour) + ONNX ML score. |

**Weekend — CrystalDB COMPLETE. All 4 Projects COMPLETE.**

---

## Month 7: OTel + Polish + Hiring Sprint

### Week 15: Final Instrumentation + Benchmarks

Add OTel to all projects. All projects send traces to ObserveFlow (eating own cooking). k6 all endpoints. `pprof` all Go services. Fix regressions.

**Final k6 targets:**
- ObserveFlow: 10M spans/sec ingest, ClickHouse query p99 < 200ms
- VaultAuth: 10K token issuances/sec, p99 < 20ms
- StreamBridge: 1M messages/sec, consumer lag < 1s
- CrystalDB: 100TB partition-pruned query < 10s

### Week 16: Portfolio + Cold Outreach

**Cold Email — Datadog:**
```
Subject: [Datadog SDE] — built ObserveFlow: OTel OTLP collector + ClickHouse pipeline, 10M spans/sec

ObserveFlow mirrors Datadog's agent-to-dashboard architecture.

• Go collector agent: OTLP/gRPC (mTLS), gathers host + container metrics, 8MB static binary, K8s DaemonSet via Operator
• ClickHouse pipeline: 10M spans/sec ingest, p99 query < 200ms on 30-day window, TimescaleDB rollups
• Alert engine: threshold + anomaly (mean ± 3σ) + composite alerts, noise reduction, Kafka fan-out

Also built VaultAuth: OIDC provider, SAML SP, TOTP + WebAuthn, API keys (hashed), append-only audit log.
[GitHub] [k6 benchmarks] [architecture ADR]
```

**Cold Email — Confluent:**
```
Subject: [Confluent SDE] — built StreamBridge: Kafka cluster management + Schema Registry + exactly-once demo

StreamBridge mirrors Confluent's internal Kafka operations platform.

• KRaft cluster management: topic/partition/ISR monitoring, leader election visualization
• Schema Registry UI: BACKWARD/FORWARD/FULL compatibility enforcement before registration
• Exactly-once demo: idempotent producer + transactional API, 10K messages, verified zero duplicates

[GitHub] [exactly-once architecture ADR] [live demo]
```

---

## Monthly Summary

| Month | Project | Phase | Key Milestones |
|-------|---------|-------|----------------|
| 1 | ObserveFlow | Full-stack: OTLP receiver, ClickHouse, alerts | OTLP/HTTP receiver, ClickHouse storage, Elasticsearch logs |
| 2 | ObserveFlow | Go agent + K8s DaemonSet Operator | Go collector binary 8MB, mTLS, 10M spans/sec k6 |
| 3 | VaultAuth | Full build: OIDC, SAML, MFA, API keys, audit | OIDC provider, SAML SP, WebAuthn, hash chain audit log |
| 4 | StreamBridge | Foundation: KRaft, Schema Registry, Kafka Streams | Consumer lag UI, exactly-once demo, ksqlDB-style queries |
| 5 | StreamBridge | Advanced: CDC, Kafka Connect, system design | Debezium CDC, K8s Operator, all system design in platform |
| 6 | CrystalDB | Full build: columnar, time-travel, data sharing | Parquet + ClickHouse query engine, time-travel, sharing creds |
| 7 | All | OTel, k6, polish, hiring | All benchmarks, cold emails, portfolio live |

---

## Non-Negotiable Rules

| Rule | Why |
|------|-----|
| `go test -race ./...` before every commit | Race conditions in the collector agent cause metric loss |
| `EXPLAIN ANALYZE` on every PostgreSQL query | ObserveFlow metadata queries run millions of times/day |
| Kafka exactly-once semantics in StreamBridge | Duplicate audit events violate compliance requirements |
| VaultAuth API keys: hash on store, never the key | Raw key storage is a catastrophic security failure |
| VaultAuth audit log: append-only, no UPDATE/DELETE | Tamper-evident log is a compliance requirement |
| Schema Registry compatibility check before register | Schema incompatibility crashes all downstream consumers |
| `goleak.VerifyNone(t)` in every Go test file | Goroutine leaks in the collector accumulate to OOM |
| k6 before calling anything "production-ready" | ObserveFlow at 10M spans/sec behaves very differently from dev |
