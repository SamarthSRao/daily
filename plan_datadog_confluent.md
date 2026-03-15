# 10-Month Full-Stack Engineering Mastery Plan
## Targeting Datadog · Confluent · Snowflake · Kong · Okta / WorkOS / FusionAuth
### Deep Infra + Observability + Data Platforms Track

---

## Why This Track

**Datadog** — you learn observability: metrics, traces, logs, dashboards, alerts. The skills compound everywhere — every production engineer needs them. India bands are strong and the technical bar is genuinely high.

**Confluent** — you learn Kafka from the inside. Confluent builds the managed Kafka platform, Schema Registry, Kafka Connect, ksqlDB. If you can contribute to Confluent's ecosystem, Kafka jobs open everywhere.

**Snowflake / ThoughtSpot** — you learn OLAP, columnar storage, query optimization, data sharing. Deep data engineering work with excellent pay.

**Kong** — API gateway engineering. Every company needs one. You learn: plugin systems, rate limiting at the gateway layer, service mesh, credential management. Skills that compound across every backend role.

**Okta / WorkOS / FusionAuth** — identity and auth infrastructure. OIDC, SAML, MFA, device trust. Once you build auth infrastructure, you understand the piece every app depends on but no one owns well.

**The engineer who gets this track** can build and operate the infrastructure that other engineers depend on. Observability, auth, API gateways, data pipelines — these are the "plumbing of the internet" and they age extremely well.

---

## The 4 Platform Projects

- 🔭 **ObserveFlow** — Observability platform (mirrors Datadog: metrics ingest, trace pipeline, log aggregation, dashboards, alerting)
- 🌊 **StreamBridge** — Kafka management + stream processing platform (mirrors Confluent: cluster management, Schema Registry, ksqlDB-style queries, connector UI)
- ❄️ **CrystalDB** — Analytical data platform (mirrors Snowflake: columnar storage, query engine, data sharing, time-travel)
- 🔑 **VaultAuth** — Identity + auth infrastructure (mirrors Okta/WorkOS: OIDC, SAML, MFA, API keys, audit log)

**Monorepo structure:**
```
/
├── apps/
│   ├── observeflow/     ← metrics dashboard shell → OTel ingest → trace viewer → alert engine
│   ├── streambridge/    ← Kafka UI shell → cluster monitor → schema registry → stream processor
│   ├── crystaldb/       ← SQL editor shell → ClickHouse query → columnar storage → data sharing
│   └── vaultauth/       ← login form → OIDC provider → SAML → API keys → audit log
├── packages/
│   ├── types/           ← shared TypeScript types (metrics, traces, events, auth)
│   ├── schemas/         ← Zod schemas (Week 1, used forever)
│   ├── ui/              ← Shadcn components
│   └── sdk/             ← ObserveFlow JS SDK + VaultAuth JS SDK (published Week 5)
├── infrastructure/
│   ├── terraform/       ← AWS infra
│   └── k8s/             ← manifests + operators
└── agents/
    ← ObserveFlow collector agents (Go, Week 7)
```

---

## Master Technology Checklist

### Fundamentals
- [ ] HTTP/HTTPS, DNS, TLS (deep — cert rotation, mTLS between services)
- [ ] OpenTelemetry: traces, metrics, logs, exemplars
- [ ] OIDC / OAuth2 / SAML / JWT deep knowledge
- [ ] API Gateway patterns (plugin architecture, rate limiting, auth at gateway)

### Frontend
- [ ] HTML, CSS, JavaScript, TypeScript, React, Next.js
- [ ] Recharts / Nivo (metrics visualization), D3.js (trace waterfall)
- [ ] Tailwind, Shadcn, Zustand, Tanstack Query, Zod, RHF
- [ ] Real-time chart updates (SSE + canvas rendering)

### Backend
- [ ] Node.js + Go (agent/collector written in Go)
- [ ] Python (ksqlDB-style query engine prototype)
- [ ] gRPC (OTel OTLP protocol), REST, WebSockets, SSE

### Databases + Storage
- [ ] PostgreSQL (metadata, config, audit log)
- [ ] ClickHouse (metrics + traces — billions of rows, fast aggregations)
- [ ] Apache Parquet + Delta Lake (columnar storage for CrystalDB)
- [ ] Redis (caching, rate limiting, pub/sub for live metrics)
- [ ] Elasticsearch (log search + full-text)
- [ ] TimescaleDB (time-series metrics — PostgreSQL extension)

### Observability Stack (build it, not just use it)
- [ ] OpenTelemetry SDK (traces, metrics, logs) — build integration for Node.js + Go
- [ ] OTLP (OpenTelemetry Protocol) — gRPC + HTTP/protobuf receiver
- [ ] Prometheus metrics exposition format
- [ ] Jaeger trace format compatibility
- [ ] PromQL (query language for Prometheus-compatible metrics)
- [ ] Alerting: threshold, anomaly detection, composite alerts

### Kafka Internals (Confluent-level)
- [ ] Kafka broker architecture, KRaft (no Zookeeper)
- [ ] Replication, ISR, leader election
- [ ] Consumer group rebalancing, partition assignment strategies
- [ ] Exactly-once semantics (idempotent producer + transactional API)
- [ ] Schema Registry (Avro, Protobuf, JSON Schema + compatibility rules)
- [ ] Kafka Connect (source + sink connectors)
- [ ] Kafka Streams (stateful processing, windowing)
- [ ] ksqlDB concepts

### Auth Infrastructure (Okta/WorkOS-level)
- [ ] OIDC provider (issue ID tokens, access tokens, refresh tokens)
- [ ] SAML 2.0 SP + IdP
- [ ] MFA: TOTP, WebAuthn, SMS fallback
- [ ] API key management (hash on store, last-used tracking, rotation)
- [ ] Audit log (append-only, tamper-evident)
- [ ] Rate limiting per client credential
- [ ] Session management (device sessions, concurrent session limits)

### System Design — 11 Case Studies
- [ ] Observability Platform Design (metrics + traces + logs at Datadog scale)
- [ ] Kafka at Scale (Confluent pattern — replication, exactly-once, Schema Registry)
- [ ] Columnar Query Engine (Snowflake pattern — partition pruning, result cache)
- [ ] API Gateway Design (Kong pattern — plugin system, rate limiting, auth)
- [ ] Identity Provider Design (Okta pattern — OIDC, SAML, MFA)
- [ ] Real-Time Alerting Engine (threshold + anomaly detection)
- [ ] Distributed Tracing System
- [ ] Log Aggregation at Scale
- [ ] Data Catalog + Lineage (Snowflake-pattern sharing)
- [ ] Rate Limiter (all 4 algorithms — gateway level)
- [ ] Fraud / Anomaly Detection (observability-driven)

---

## MONTH 1: Full-Stack From Day One — All 4 Platforms Introduced

### Week 1: HTTP + HTML + CSS + OpenTelemetry Mental Model

**The narrative this week:** You're building the observability platform other engineers will depend on, a Kafka management console, a SQL analytics platform, and an auth provider. Every platform you build has something critical in common: they all produce or consume structured events — metrics, traces, logs, or auth events. The data model you design this week for how those events flow through ObserveFlow is the architecture you're hiring for.

---

**MONDAY — HTTP + OpenTelemetry Protocol + CLI + Git**

**Morning (3h):**
- Full HTTP/HTTPS/DNS/TLS depth. Plus: **mTLS** — mutual TLS where both sides present certificates. Used between ObserveFlow collector and ObserveFlow backend (same pattern Datadog agent → Datadog backend uses)
- **OpenTelemetry (OTel):** trace (request journey across services), metric (numerical measurement over time), log (structured event). All share `resource` (what produced it) + `attributes` (key-value metadata)
- **OTLP:** OpenTelemetry Protocol. gRPC + HTTP/protobuf. What every OTel SDK speaks to send data
- **ObserveFlow mental model:** application → OTel SDK → OTLP → ObserveFlow Collector (Go) → storage (ClickHouse + Elasticsearch) → query API → dashboard (React)
- CLI, VS Code, Git, ESLint, Prettier — same as reference

**Evening (2h): ObserveFlow Raw OTLP Receiver**
- Feature: **ObserveFlow needs a server that receives OTLP/HTTP telemetry from applications**
- Raw Node.js HTTP server: `POST /v1/traces` + `POST /v1/metrics` + `POST /v1/logs` (OTLP/HTTP endpoints)
- Parse protobuf body → extract span count, metric count → log structured summary
- Test: configure a simple Node.js app with `@opentelemetry/sdk-node` to send to `localhost:4318` — see your own traces arrive
- This exact server becomes the full ObserveFlow ingestion pipeline in Week 9

```javascript
// apps/observeflow/server/index.js — Day 1. OTLP receiver.
const http = require('http');

const server = http.createServer((req, res) => {
  const signal = req.url.split('/').pop(); // 'traces' | 'metrics' | 'logs'
  const chunks = [];
  req.on('data', c => chunks.push(c));
  req.on('end', () => {
    const body = Buffer.concat(chunks);
    // OTLP/HTTP sends protobuf. For now, log the raw size.
    console.log(`[ObserveFlow] received ${signal}: ${body.length} bytes`);
    // Week 4: this becomes full protobuf parsing + ClickHouse insert
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ partialSuccess: {} }));
  });
});

server.listen(4318, () => console.log('ObserveFlow OTLP/HTTP receiver :4318'));
// Configure any Node.js app with OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
// Your traces arrive here.
```

**X Post:**
```
Day 1: ObserveFlow OTLP receiver live.

Set OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318 on any Node.js app.
Traces, metrics, logs arrive at my server.

This is exactly how Datadog Agent works:
SDK → OTLP → Collector → Storage → Dashboard

Building ObserveFlow from Day 1.
Same server becomes full trace + metric ingestion pipeline by Week 9.

[screenshot: OTel spans arriving + size logged]
```

---

**TUESDAY — HTML — ObserveFlow Dashboard Shell + VaultAuth Login Form**

- ObserveFlow dashboard: semantic HTML — navigation (`<nav>` with `<ul>`), main metrics area (`<main>`), sidebar with chart list (`<aside>`). Chart placeholders as `<figure>` elements
- VaultAuth login form: email + password + TOTP field (`inputmode="numeric"`, `maxlength="6"`, `autocomplete="one-time-code"`). `<fieldset>` for MFA step. Native validation on every field
- Both: skip nav links, `aria-live` regions for auth errors and metric updates

---

**WEDNESDAY — CSS — All 4 Platforms Styled**

- `packages/tokens.css`: infra/observability design tokens — `--color-metric-good: #22c55e`, `--color-metric-warn: #f59e0b`, `--color-metric-critical: #ef4444`, `--color-trace-http: #3b82f6`, `--color-trace-db: #a855f7`
- ObserveFlow: dark-by-default (observability tools are dark — Datadog, Grafana). Chart grid layout. Metric value + delta display
- StreamBridge: Kafka partition heat map (CSS Grid), consumer lag bars
- CrystalDB: SQL editor layout (sidebar table list + main editor + results pane)
- VaultAuth: clean, minimal auth form. Trust indicators (lock icon, HTTPS badge)

---

**THURSDAY — JavaScript — ObserveFlow Live Metric Chart + CrystalDB SQL Editor**

- ObserveFlow: fetch metric time-series from server, render as `<canvas>` chart (raw Canvas 2D API — understand what Recharts wraps), auto-refresh every 10s
- CrystalDB: SQL editor with `<textarea>` (syntax-highlight preview, CodeMirror would come later in React week), query history in `localStorage`
- Both: `X-Correlation-ID` header sent on every fetch (from Day 1 — same request ID in frontend and backend logs)

---

**FRIDAY — TypeScript — packages/types + packages/schemas + packages/sdk**

- `packages/types`: `Span`, `Metric`, `LogRecord`, `KafkaCluster`, `KafkaTopic`, `Column`, `QueryResult`, `AuthUser`, `ApiKey`, `AuditEvent`
- `packages/schemas`: Zod schemas for all 4 platforms
- `packages/sdk`: ObserveFlow JS SDK (tiny wrapper over OTel SDK — `ObserveFlow.init({ apiKey, endpoint })`). VaultAuth JS SDK (`VaultAuth.authorize()`, `VaultAuth.getUser()`). Both published as npm packages Week 5

---

**WEEKEND — All 4 Platforms v0.1 Deployed**

---

### Week 2: React — All 4 Platforms in React

*Same React depth (useState, useEffect, hooks, RHF+Zod, TQ, Zustand+Immer) — applied to:*

- **ObserveFlow**: `<MetricChart>` (Recharts LineChart, real-time updates via useQuery). `<TraceList>` (latency waterfall, D3.js). Zustand: `selectedTimeRange`, `selectedService`, `filterQuery`
- **StreamBridge**: Kafka cluster topology (SVG + React, broker nodes, partition replicas). Consumer lag chart
- **CrystalDB**: SQL editor with CodeMirror (React), query result table (virtual scroll for large results), schema browser (Tanstack Query for table list)
- **VaultAuth**: multi-step auth flow (RHF + Zod: email → password → MFA), user management table

**Key addition:** `useMetrics(queryString, timeRange)` hook — all ObserveFlow dashboards use it. `useAuth()` — all 4 apps authenticate via VaultAuth from Week 2. Auth infrastructure feeds itself.

---

### Week 3: Tailwind + Next.js + Svelte + Vue + Testing

- **Next.js (ObserveFlow)**: `app/dashboards/[id]/page.tsx` Server Component (dashboard config from DB, metric data from ClickHouse). SSR for dashboards ensures no layout shift on load
- **Svelte**: ObserveFlow status badge embed (customers embed `<script src="status.observeflow.io/widget.js">` — public status page widget, 6KB)
- **Vue**: CrystalDB notebook interface (data scientists prefer Vue for this)
- **Testing**: Vitest (alert threshold logic, SQL parser, OIDC token validation), Playwright (full auth flow E2E), TestSprite

---

### Week 4: Node.js + Express + ClickHouse + All Databases

**MONDAY — Node.js Streams + ObserveFlow Trace Ingestion**
- Feature: OTLP trace spans arrive in batches — stream them through: parse protobuf → validate → enrich → batch insert to ClickHouse
- Same stream pipeline pattern as reference, applied to telemetry ingest (not GPS pings)

**TUESDAY — Express + REST APIs + OTLP gRPC**
- ObserveFlow: `POST /v1/traces` + `POST /v1/metrics` + `POST /v1/logs` (OTLP/HTTP). Also `GET /api/metrics/query?q=...&from=...&to=...`
- VaultAuth: `POST /auth/token`, `GET /auth/userinfo`, `POST /auth/introspect`, `POST /auth/revoke` — OIDC-compliant endpoints
- All: Zod validation middleware, structured logging

**WEDNESDAY — ClickHouse + PostgreSQL Schema**
- **ClickHouse (ObserveFlow)**: `traces` table — `(service_name, trace_id, span_id, duration_ns, status_code, attributes)`. `ReplicatedMergeTree`. Sub-100ms aggregations on 10B+ spans: `SELECT service_name, quantile(0.99)(duration_ns) FROM traces WHERE timestamp > now() - INTERVAL 1 HOUR GROUP BY service_name`
- **ClickHouse (CrystalDB)**: query execution telemetry — query time, rows scanned, bytes processed per query per user
- **PostgreSQL**: ObserveFlow dashboard configs, alert rules, user settings. VaultAuth users, sessions, API keys, SAML configs
- **TimescaleDB**: ObserveFlow metrics (PostgreSQL extension for time-series — hypertables, continuous aggregates)

**THURSDAY — Redis + VaultAuth JWT + API Key Management**
- VaultAuth: issue OIDC `id_token` (user identity) + `access_token` (authorization). Refresh token in Redis (7 days)
- API key management: generate `sk_live_...` key → hash (SHA-256, never store plaintext) → PostgreSQL. On request: hash header value → compare. `last_used_at` updated in Redis, drained to PostgreSQL hourly
- All 4 apps authenticate via VaultAuth from this week forward

**FRIDAY — Elasticsearch + TimescaleDB + Parquet**
- **Elasticsearch (ObserveFlow)**: log full-text search. `GET /api/logs/search?q=error+timeout&service=payrail&from=...`
- **TimescaleDB**: continuous aggregates for metrics (pre-compute 1-min, 5-min, 1-hour rollups — dashboard queries hit rollups, not raw data)
- **Delta Lake / Parquet (CrystalDB)**: CrystalDB stores analytical datasets as Parquet on S3. Query engine reads them with partition pruning

---

**WEEKEND — All 4 Platforms Full-Stack + Real Observability**

CrystalDB SQL queries hitting real ClickHouse. ObserveFlow receiving real OTel spans from other 3 platforms. VaultAuth issuing real JWTs that all 3 platforms verify.

---

## MONTH 2: APIs + Real-Time + DevOps

### Week 5: gRPC + OTLP gRPC + SDK Publishing + WebSockets

**MONDAY — OTLP/gRPC Receiver — ObserveFlow**
- Feature: ObserveFlow must accept both OTLP/HTTP and OTLP/gRPC (Datadog agent uses gRPC)
- `opentelemetry/proto` — implement gRPC receiver in Node.js
- `packages/sdk`: ObserveFlow JS SDK published to local npm registry. Any app can `npm install @observeflow/sdk` → `ObserveFlow.init({ apiKey })` → auto-instruments everything

**TUESDAY-WEDNESDAY — StreamBridge: Kafka Management API + Schema Registry**
- Feature: StreamBridge needs to manage Kafka clusters via API (create topics, list consumer groups, get consumer lag)
- Kafka Admin API (kafkajs): `admin.listTopics()`, `admin.describeGroups()`, `admin.fetchTopicOffsets()`
- **Schema Registry**: POST/GET Avro + Protobuf schemas. Compatibility check: BACKWARD (can new schema read old data?), FORWARD (can old schema read new data?), FULL (both)
- StreamBridge UI: schema editor (React + Monaco), compatibility check on save

**THURSDAY — VaultAuth OIDC Provider + SAML SP**
- Feature: VaultAuth needs to work as an OIDC provider (like Okta) — issue ID tokens that third-party apps can verify
- OIDC: `/.well-known/openid-configuration` endpoint, `/auth/authorize`, `/auth/token`, JWKS endpoint (`/.well-known/jwks.json`)
- SAML 2.0 SP: receive SAML assertion from enterprise IdP → create VaultAuth session. XML signature validation
- All 4 platforms now support SSO via VaultAuth SAML

**FRIDAY — SSE + WebSockets — Live Metrics + Live Kafka**
- ObserveFlow: SSE live metric stream → chart auto-updates without polling. `GET /api/metrics/stream?q=...` → `data: {timestamp, value}\n\n`
- StreamBridge: WebSocket → live consumer group lag (updates every second during Kafka rebalance)
- Redis pub/sub bridges all SSE connections across replicas

---

### Week 6: Docker + GitHub Actions + K8s + Terraform

*Same infra depth as reference — applied to observability stack:*

- **ObserveFlow → AWS**: EKS + ClickHouse (self-hosted on EKS) + TimescaleDB RDS + Elasticsearch Service + ElastiCache + S3 (archived traces)
- **StreamBridge → GCP**: GKE + managed Kafka (Confluent Cloud or MSK) + Bigtable for stream state
- **CrystalDB → AWS**: S3 (Parquet files) + Athena (serverless query fallback) + EKS (query engine pods)
- **VaultAuth → Railway** (fast iteration for auth infra)
- **OTel sidecar** (Go): zero-code instrumentation — deployed as K8s sidecar, auto-instruments every pod

---

## MONTH 3: Go + ClickHouse Deep + Kafka Internals

### Week 7: Go — ObserveFlow Collector Agent

**The narrative this week:** Datadog's agent is written in Go. You build ObserveFlow's collector agent — the piece that runs on every server and ships data to ObserveFlow. This is the deepest Go work of the roadmap.

**MONDAY — Go Foundations (same depth as reference) + Why Go for Agents**
- Go compilation to single static binary: easy distribution, no runtime dependency
- Low memory footprint: agent must not consume the resources it's measuring
- `sync.Pool` for span object reuse — agent allocates millions of span objects, GC must be minimal

**TUESDAY-WEDNESDAY — ObserveFlow Go Collector Agent**
- Feature: ObserveFlow needs a lightweight agent that runs on servers and ships metrics + logs to ObserveFlow backend
- Metric collection: `gopsutil` — CPU, memory, disk, network. Configurable collection interval
- Log tail: `fsnotify` — watch `/var/log/**` → tail new lines → ship as OTLP/gRPC
- OTLP/gRPC client: generates protobuf, sends to ObserveFlow backend
- Process metrics: `ps aux`-equivalent in Go — PID, CPU%, MEM%, process name
- Binary: `GOOS=linux GOARCH=amd64 go build -ldflags="-s -w"` → 8MB static binary
- Install: `curl -fsSL https://install.observeflow.io | bash` (Shell script that downloads the binary)

```go
// agents/collector/main.go — Go OTel collector agent
// Deployed on any server. Ships metrics + logs to ObserveFlow.

func main() {
  ctx, cancel := signal.NotifyContext(context.Background(), syscall.SIGTERM, syscall.SIGINT)
  defer cancel()

  conn, _ := grpc.NewClient(cfg.OTLPEndpoint,
    grpc.WithTransportCredentials(credentials.NewTLS(&tls.Config{})),
  )
  client := otlpmetricgrpc.NewClient(otlpmetricgrpc.WithGRPCConn(conn))
  exporter, _ := otlpmetricgrpc.New(ctx, client)

  mp := metric.NewMeterProvider(
    metric.WithReader(metric.NewPeriodicReader(exporter, metric.WithInterval(10*time.Second))),
    metric.WithResource(resource.NewWithAttributes(semconv.SchemaURL,
      semconv.ServiceNameKey.String(cfg.ServiceName),
    )),
  )
  meter := mp.Meter("observeflow.agent")

  cpuGauge, _ := meter.Float64ObservableGauge("system.cpu.utilization")
  meter.RegisterCallback(func(ctx context.Context, o metric.Observer) error {
    cpu, _ := gopsutil.Percent(0, false)
    o.ObserveFloat64(cpuGauge, cpu[0]/100)
    return nil
  }, cpuGauge)

  <-ctx.Done()  // Graceful shutdown on SIGTERM
}
// Install on any server: metrics arrive in ObserveFlow in 10 seconds.
```

**THURSDAY — Go: VaultAuth Token Validation Middleware**
- Feature: VaultAuth ships a Go middleware library — any Go service can protect routes with `vaultauth.Require("read:metrics")`
- `packages/vaultauth-go`: fetch JWKS from VaultAuth, validate JWT locally (no round-trip), cache JWKS with TTL
- ObserveFlow's Go collector agent uses this to authenticate with ObserveFlow backend

**FRIDAY — Go: CrystalDB Query Optimizer**
- Feature: CrystalDB needs a Go service that optimizes SQL before sending to ClickHouse
- Partition pruning: detect `WHERE date BETWEEN '2025-01-01' AND '2025-01-31'` → only scan Jan partitions
- Query plan cache: same query + same params → return cached result (Redis, 5min TTL)

---

### Week 8: Kafka Internals + CDC + ObserveFlow Trace Pipeline

**MONDAY — Kafka Deep: Replication + ISR + Exactly-Once**
- Replication factor, ISR (In-Sync Replicas), leader election on broker failure
- `min.insync.replicas`: ensures acks=all means durable
- Exactly-once: idempotent producer (`enable.idempotence=true`) + transactional API
- Schema Registry compatibility rules: BACKWARD vs FORWARD vs FULL — when to use each

**TUESDAY — StreamBridge: Full Kafka Cluster Management**
- Feature: StreamBridge can create/delete topics, change partition count, view consumer group lag, trigger rebalance
- Kafka Admin API + Schema Registry HTTP API + ksqlDB HTTP API
- StreamBridge UI: topology map (broker → partition → replica heat map), consumer lag chart

**WEDNESDAY — CDC: ObserveFlow Audit Log Pipeline**
- Feature: VaultAuth needs an append-only audit log for every auth event (login, logout, token issue, permission change)
- PostgreSQL WAL → Kafka `vaultauth.audit.events` → ObserveFlow (audit events are telemetry)
- Audit log: append-only, `PARTITION BY HASH (user_id)` + `CLUSTER INDEX (user_id, created_at)`, never deletes

**THURSDAY-FRIDAY — Database Scaling: ClickHouse at Datadog Scale**
- ObserveFlow ClickHouse: `ReplicatedMergeTree`, materialized views for pre-aggregation, `TTL created_at + INTERVAL 30 DAY DELETE` (auto-delete old traces)
- Tiered storage: hot (local SSD, 7 days) → cold (S3, 90 days) → archive (Glacier, 1 year)
- Query optimization: `ORDER BY (service_name, timestamp)` — almost all queries filter by service + time range

---

## MONTH 4: Go Deep + K8s Operator + AI Engineering

### Week 9: Go Deep + ObserveFlowCollector Kubernetes Operator

**MONDAY-WEDNESDAY — Go + ObserveFlowCollector CRD**
- Feature: Deploy the Go collector agent as a Kubernetes DaemonSet (1 pod per node) automatically
- CRD: `ObserveFlowCollector` — spec: `otlpEndpoint`, `collectionInterval`, `logPaths`, `apiKey` (ref to Secret)
- Operator: watches CRD → creates DaemonSet with collector agent + correct env vars
- Auto-upgrade: when `ObserveFlowCollector.spec.version` changes → rolling DaemonSet update
- This is the exact pattern Datadog Operator uses

```go
// apps/observeflow/operator/controllers/collector_controller.go
func (r *CollectorReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
  var collector observev1.ObserveFlowCollector
  if err := r.Get(ctx, req.NamespacedName, &collector); err != nil {
    return ctrl.Result{}, client.IgnoreNotFound(err)
  }

  // Build DaemonSet spec: collector agent + env from CRD spec
  ds := r.buildDaemonSet(&collector)
  if err := r.ensureDaemonSet(ctx, ds); err != nil {
    return ctrl.Result{}, err
  }

  // Count healthy pods
  var pods corev1.PodList
  r.List(ctx, &pods, client.MatchingLabels{"app": "observeflow-collector"})
  healthy := countHealthyPods(pods.Items)

  collector.Status.HealthyCollectors = int32(healthy)
  collector.Status.TotalNodes = int32(len(pods.Items))
  return ctrl.Result{RequeueAfter: 60 * time.Second}, r.Status().Update(ctx, &collector)
  // kubectl apply -f observeflow-collector.yaml
  // → DaemonSet created → collector agent on every node → metrics flowing in 30s
}
```

**THURSDAY — CNCF Contribution: opentelemetry-go**
- Contribute to `opentelemetry-go` — this is directly relevant to ObserveFlow's collector agent
- Target: instrumentation library improvement, test coverage, documentation

**FRIDAY — CrystalDB: Go Columnar Query Engine**
- Feature: CrystalDB's query engine prototype (reads Parquet files from S3, executes simple SELECT + WHERE + GROUP BY)
- Go: read Parquet with `github.com/xitongsys/parquet-go`, partition pruning, parallel reads with goroutines
- Benchmark: full scan vs partition-pruned scan — show 10× speedup with pruning

---

### Week 10: AI Engineering — ObserveFlow + VaultAuth

**MONDAY — ObserveFlow AI Alert Assistant**
- Feature: "Why did p99 latency spike at 14:32?" → AI queries ClickHouse for spans around that time, checks deployment events, finds root cause
- Tools: `queryMetrics` (ClickHouse), `searchTraces` (Elasticsearch), `listDeployments` (K8s events), `checkAlertHistory` (PostgreSQL)
- Every tool calls a real system built in Months 1-3

**TUESDAY — RAG — ObserveFlow Runbook Assistant**
- Feature: When an alert fires, AI finds the relevant runbook and summarizes the fix steps
- Ingest: team runbooks (Markdown files in Git) → chunk → PGVector
- On alert: embed alert name + affected service → PGVector search → top 3 runbooks → generate summary
- Citations: response includes runbook file name + section

**WEDNESDAY — AI Agents — 3-Agent Alert Response**
- Detector Agent: monitors ObserveFlow alert stream (Kafka `observeflow.alerts`)
- Analyst Agent: given alert → queries metrics, traces, logs → diagnoses root cause
- Action Agent: known issue → auto-create GitHub issue + link runbook. Unknown → page on-call + draft incident

**THURSDAY — VaultAuth: AI-Powered Anomalous Auth Detection**
- Feature: VaultAuth detects anomalous login patterns (new country, new device, abnormal hour) and requires step-up auth
- ONNX model: `[hour_of_day, country_code, device_fingerprint_hash, past_30d_login_count]` → risk score
- Low risk: allow. Medium: require TOTP. High: block + alert security team

**FRIDAY — WebAssembly: ObserveFlow Client-Side Metric Computation**
- Feature: CrystalDB lets users run SQL transformations client-side on small datasets (no server round-trip for exploratory analysis)
- AssemblyScript: `computePercentile(values: Float64Array, p: f64): f64` → `.wasm`
- ObserveFlow: Wasm for client-side chart data downsampling (LTTB algorithm)

---

## MONTH 5: System Design Fundamentals

### Week 11: Observability at Scale + Rate Limiting + CAP

**MONDAY — Observability Platform Design (Case Study 1 preview)**
- Problem: ObserveFlow ingests 10M spans/sec, 100M metrics/sec, 1B logs/day
- Architecture decisions: ClickHouse (metrics + traces) vs Elasticsearch (logs). Separate pipelines
- Ingest: Kafka buffer between collectors and storage. Never drop data under load

**TUESDAY — Fault Tolerance: Collector Agent Resilience**
- ObserveFlow collector: if ObserveFlow backend is down → buffer to local disk (`/var/lib/observeflow/buffer/`) → replay when reconnected
- Max buffer: 1GB. Oldest data dropped if buffer full. Always ship or buffer, never drop silently

**WEDNESDAY — Rate Limiting: VaultAuth API Keys**
- All 4 algorithms (same as reference) — applied to auth infrastructure:
- Token Bucket: general API key requests (100/min per key, burst to 200)
- Leaky Bucket: `/auth/token` endpoint (10/sec strict — prevent credential stuffing)
- Sliding Window Log: audit log queries (exact count, compliance requirement)

**THURSDAY — CAP: VaultAuth Auth Decisions**
- VaultAuth is CP for auth decisions: "is this token valid?" must always return consistent answer
- AP acceptable for: audit log writes (slightly delayed writes OK), metric reporting
- Demo: primary DB down → VaultAuth switches to read replica with `REPEATABLE READ` (stale by < 1s for non-critical reads, refuses writes)

**FRIDAY — Leader Election + Consistent Hashing**
- ObserveFlow alert engine: exactly 1 alert evaluator per alert rule (Redis SETNX). No duplicate alerts
- CrystalDB: consistent hash ring distributes queries across query engine pods by `query_hash`

---

### Week 12: Kafka Streams + Big Data + Notifications

**MONDAY-TUESDAY — StreamBridge: Kafka Streams Real-Time Processing**
- Feature: StreamBridge can run ksqlDB-style streaming SQL directly on Kafka topics
- `SELECT COUNT(*) FROM auth_events GROUP BY user_id, window_start WINDOW TUMBLING (SIZE 5 MINUTES)`
- Kafka Streams Java → StreamBridge wraps with a REST API → React UI shows stream output live

**WEDNESDAY — Big Data: CrystalDB S3 Parquet Architecture**
- CrystalDB stores results in Parquet. External access: presigned S3 URLs + Athena for ad-hoc queries
- Data sharing: CrystalDB share → generates read-only credential for specific S3 prefix (Snowflake Data Sharing pattern)

**THURSDAY-FRIDAY — ObserveFlow Alert Engine**
- Threshold alerts: `metric > value for 5 minutes`
- Anomaly detection: `value > mean + 3*stddev over last 1 hour` (simple statistical)
- Composite: `(error_rate > 1%) AND (p99_latency > 500ms)` — AND/OR conditions
- Notification: alert → Kafka → fan-out to PagerDuty, Slack, email, WebSocket (live alert feed in dashboard)

---

## MONTH 6: All 11 Case Studies

### Week 13: Observability Platform + Kafka at Scale

**Monday-Wednesday: ObserveFlow Observability Platform (Case Study 1 — Datadog pattern)**
- Problem: 10M spans/sec, 100M metrics/sec, p99 query < 500ms on 30-day window
- Full architecture: OTLP → Kafka buffer → ClickHouse (metrics + traces) + Elasticsearch (logs). Read: TimescaleDB rollups for fast dashboards
- k6: 10M span/sec ingest, ClickHouse query p99 < 200ms on 30-day data

**Thursday-Friday: StreamBridge Kafka at Scale (Case Study 2 — Confluent pattern)**
- Problem: 100 brokers, 10K topics, 1M partitions, exactly-once across 50 consumer groups
- Full architecture: KRaft (no Zookeeper), Schema Registry (compatibility enforcement), Kafka Connect (CDC source + Elasticsearch sink)
- Load test: produce 1M messages/sec, consumer lag < 1s

---

### Week 14: Columnar Query Engine + API Gateway Design

**Monday-Wednesday: CrystalDB Columnar Query Engine (Case Study 3 — Snowflake pattern)**
- Problem: SQL queries on 100TB of Parquet data in S3, < 10s for most queries
- Partition pruning, result caching (same query → Redis cache 5min), concurrent query execution
- Data sharing: read-only credential grants → Snowflake-style sharing

**Thursday-Friday: Kong-Pattern API Gateway (Case Study 4)**
- Feature: ObserveFlow API gateway (Kong-style) — all 4 platform APIs behind one gateway
- Plugin system: rate limiting, auth (JWT verify via VaultAuth JWKS), request transformation, circuit breaker
- Admin API: `POST /plugins`, `GET /routes`, `GET /consumers` — same structure as Kong Admin API

---

### Week 15: Identity Provider + Alerting + Distributed Tracing

**Monday-Tuesday: VaultAuth Identity Provider (Case Study 5 — Okta pattern)**
- Full OIDC provider: `/.well-known/openid-configuration`, `/auth/authorize`, `/auth/token`, JWKS
- SAML 2.0 SP + optional IdP
- MFA: TOTP + WebAuthn (passkeys). Device trust scoring

**Wednesday-Thursday: ObserveFlow Alerting Engine (Case Study 6)**
- Threshold + anomaly + composite alerts. Noise reduction: don't alert on transient 1-minute spike
- Alert fatigue prevention: alert grouping, acknowledgment, auto-resolve

**Friday: Distributed Tracing System (Case Study 7)**
- Trace storage in ClickHouse. Waterfall visualization (D3.js)
- Trace sampling: tail-based sampling (only keep traces with errors or high latency)

---

### Week 16: Log Aggregation + Data Catalog + Rate Limiter + Fraud

**Monday: Log Aggregation at Scale (Case Study 8)**: Elasticsearch at scale, index lifecycle management, log parsing (Grok patterns), field extraction

**Tuesday: Data Catalog + Lineage (Case Study 9)**: CrystalDB — every Parquet file registered, lineage tracked (producer → dataset → consumer), semantic search via PGVector

**Wednesday: Rate Limiter at API Gateway Level (Case Study 10)**: all 4 algorithms at Kong-pattern gateway. Per-consumer, per-route, global cluster-level limits

**Thursday-Friday: VaultAuth Anomalous Auth + Fraud (Case Study 11)**: Wasm pre-screen + Go rules + ONNX ML. Full anomalous login detection deployed.

**WEEKEND — All 11 Case Studies Deployed + Portfolio Site Live**

---

## MONTH 7: Hiring Sprint

### Week 17-18: Portfolio Polish + Open Source

- All 4 platform READMEs with architecture diagrams, benchmark numbers, ADRs
- CNCF contributions: `opentelemetry-go` (collector improvements), `opentelemetry-collector-contrib` (new receiver), `cert-manager` (Go)
- LFX application: ObserveFlowCollector operator + CNCF PRs

### Week 19-20: Mock Interviews + Applications

**System design mocks (Datadog-specific):**
- Design a distributed metrics pipeline ingesting 100M metrics/sec
- Design an alerting engine with noise reduction
- Design a distributed tracing system with tail-based sampling

**System design mocks (Confluent-specific):**
- Design a Kafka cluster management platform
- Design Schema Registry with compatibility enforcement
- Design exactly-once Kafka consumer

**System design mocks (Okta-specific):**
- Design an OIDC provider at scale
- Design an API key management system with rotation
- Design anomalous auth detection

**Target applications:**
1. Datadog — ObserveFlow mirrors their product. Go collector agent + ClickHouse + K8s Operator
2. Confluent — StreamBridge shows Kafka internals + Schema Registry + exactly-once
3. Snowflake / ThoughtSpot — CrystalDB shows columnar query, partition pruning, data sharing
4. Kong — API gateway plugin system, rate limiting, auth at gateway layer
5. Okta / WorkOS / FusionAuth — VaultAuth: OIDC provider + SAML + MFA + audit log
6. Replit — ObserveFlow collector (Go) + K8s operator shows infra depth

**Cold email:**
```
Subject: [Role] — built ObserveFlow: OTel collector + ClickHouse pipeline, 10M spans/sec

I built ObserveFlow — it mirrors Datadog's architecture from agent to dashboard.

Most relevant:
• Go collector agent: OTLP/gRPC, ships metrics + logs, 8MB static binary, K8s DaemonSet via Operator
• ClickHouse pipeline: 10M spans/sec ingest, p99 query < 200ms on 30-day window
• Alert engine: threshold + anomaly + composite, Kafka fan-out, noise reduction

Also built VaultAuth: OIDC provider, SAML SP, TOTP MFA, API keys (hashed), audit log.

[GitHub + Live demo + k6 benchmarks + CNCF PRs]
```

---

## Interconnection Map

```
Week 1 ObserveFlow OTLP receiver
  ↓ becomes Week 4 Express API + ClickHouse insert
  ↓ becomes Week 5 OTLP/gRPC receiver
  ↓ becomes Week 7 Go collector agent (ships data here)
  ↓ becomes Week 9 K8s Operator deploys the agent
  ↓ becomes Month 4 AI tools query it for alert root cause

Week 1 VaultAuth login form
  ↓ gets React + RHF Week 2
  ↓ gets OIDC token issuance Week 4
  ↓ gets SAML Week 5
  ↓ gets MFA + API keys Week 4-5
  ↓ ALL 4 PLATFORMS authenticate via VaultAuth from Week 2
  ↓ VaultAuth's own auth events appear in ObserveFlow (eats own cooking)
  ↓ becomes Identity Provider case study Month 6

Week 4 VaultAuth audit log
  ↓ PostgreSQL WAL → Kafka (Week 8 CDC)
  ↓ ObserveFlow ingests audit events as log records
  ↓ AI anomalous auth detection reads from ObserveFlow (Month 4)
  Three platforms: VaultAuth produces events, ObserveFlow stores them, AI reads them.

Week 4 ClickHouse (ObserveFlow)
  ↓ all 3 other platforms instrumented with OTel SDK (ship spans to ObserveFlow)
  ↓ Month 4 AI tools query it for root cause
  ↓ Month 6 case studies benchmark against it
  ObserveFlow is the nervous system of the entire monorepo.
```
