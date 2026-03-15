# 10-Month Full-Stack Engineering Mastery Plan
## Targeting Rippling · Databricks · Stripe · NVIDIA / OpenAI
### "Change Your Life" Comp + Insane Learning — SaaS Infra + Data/AI Platform Track

---

## Why This Track

**Rippling** (India SDE bands: 40L–1Cr+) builds workforce infrastructure — every company on earth needs it. Their India teams own entire product surfaces: payroll, HRIS, identity, device management. Small teams, massive ownership, brutal engineering bar. Your portfolio must show: multi-tenant SaaS, RBAC, billing, API-first design, workflow engines.

**Databricks** (very high India bands) builds the world's data + AI infrastructure. Spark, Delta Lake, Unity Catalog, LLM fine-tuning pipelines. Deep distributed systems, exceptional peer group. Your portfolio must show: streaming data pipelines, columnar storage, Python + Go, distributed compute patterns.

**The engineer who gets both** understands: multi-tenant platform design, data pipelines, AI engineering, and the infrastructure that runs them. That's the exact combination both companies hire for at high bands.

---

## Philosophy: One Codebase. Everything Connected.

Every concept you learn exists because one of your four platforms *needs* it. Nothing is a tutorial project. Nothing is thrown away. Every mini-project is a named feature of a named platform.

**The thread that runs through everything:**
- The raw HTTP server you write on Day 1 becomes the multi-tenant API gateway in Week 4, the gRPC service mesh in Week 5, and the Python Spark job orchestrator in Month 3.
- The tenant schema you design in Week 4 is the same schema that gets row-level security in Month 2, usage-based billing in Month 3, and data lineage tracking in Month 5.
- Nothing is thrown away. Everything compounds.

---

## The 4 Platform Projects

These share a monorepo, shared TypeScript/Python types, shared infrastructure, and grow in parallel across all 10 months.

- 🏢 **WorkOS** — Multi-tenant workforce platform (mirrors Rippling: HRIS + payroll + identity + device management)
- 🔥 **SparkFlow** — Distributed data pipeline platform (mirrors Databricks: ingestion + transformation + serving)
- 💳 **PayCore** — Payment processing + billing engine (mirrors Stripe: API-first, webhooks, idempotency, usage billing)
- 🧠 **LakeAI** — AI/ML model serving + data catalog platform (mirrors Databricks Unity Catalog + MLflow)

**Monorepo structure (Week 1, used for all 10 months):**
```
/
├── apps/
│   ├── workos/          ← grows from HRIS shell → multi-tenant → RBAC → payroll engine → workflow automation
│   ├── sparkflow/       ← grows from pipeline UI → Spark job runner → Delta Lake → streaming
│   ├── paycore/         ← grows from billing form → Stripe-pattern API → webhooks → usage metering
│   └── lakeai/          ← grows from model registry → RAG → AI agents → data lineage
├── packages/
│   ├── types/           ← shared TypeScript + Python types (Week 1)
│   ├── schemas/         ← Zod + Pydantic schemas (Week 1)
│   ├── ui/              ← Shadcn components (Week 3)
│   └── sdk/             ← public-facing typed SDK (Week 5)
├── infrastructure/
│   ├── terraform/       ← AWS/GCP infra (Week 6)
│   └── k8s/             ← Kubernetes manifests (Week 6)
└── python/
    ├── pipelines/       ← PySpark jobs (Month 3)
    └── ml/              ← model training + serving (Month 5)
```

---

## Master Technology Checklist (All Implemented in the 4 Platforms)

### Fundamentals
- [ ] HTTP/HTTPS, DNS, Client/Server
- [ ] Multi-tenancy patterns (schema-per-tenant, row-level security, tenant isolation)
- [ ] RBAC (Role-Based Access Control) + ABAC
- [ ] API-first design (SDK-first, versioning, breaking change policy)

### Frontend
- [ ] HTML, CSS, JavaScript, TypeScript
- [ ] React, Next.js, Tanstack Start
- [ ] Tailwind, Shadcn UI, Radix UI, Motion
- [ ] Zustand, Immer, Tanstack Query, Zod, React Hook Form

### Backend
- [ ] Node.js (TypeScript), Python (FastAPI + Pydantic)
- [ ] Go (high-throughput services)
- [ ] gRPC (internal), REST (external), GraphQL, tRPC, Webhooks
- [ ] Streams, worker threads, async processing

### Databases
- [ ] PostgreSQL (multi-tenant: row-level security + schema isolation)
- [ ] Redis (cache, sessions, rate limiting, pub/sub)
- [ ] ClickHouse (OLAP analytics — Databricks-adjacent)
- [ ] Delta Lake / Apache Parquet (columnar storage)
- [ ] PGVector (embeddings, semantic search)
- [ ] Elasticsearch (full-text search across tenant data)
- [ ] SQLite (edge/offline)

### Data Engineering
- [ ] Apache Spark (PySpark) — distributed transformations
- [ ] Apache Kafka — event streaming, CDC
- [ ] dbt — SQL-based transformation layer
- [ ] Apache Airflow — workflow orchestration
- [ ] Delta Lake — ACID transactions on data lake
- [ ] Great Expectations — data quality validation
- [ ] Kafka Connect — CDC + sink connectors

### DevOps + Infra
- [ ] Docker, Kubernetes, Helm charts
- [ ] GitHub Actions (matrix CI/CD)
- [ ] Terraform + Pulumi
- [ ] AWS (EKS, RDS, ElastiCache, S3, Glue, Athena, EMR)
- [ ] GCP (GKE, Dataproc, BigQuery, Cloud Run)
- [ ] Cloudflare Workers + R2

### Real-Time + AI
- [ ] SSE, WebSockets, gRPC streaming
- [ ] Vercel AI SDK + LangChain
- [ ] RAG (embeddings + PGVector + hybrid search)
- [ ] AI Agents with tool use
- [ ] MLflow (experiment tracking, model registry)
- [ ] ONNX (model inference in Go)
- [ ] WebAssembly (AssemblyScript)

### SaaS Patterns (Rippling-critical)
- [ ] Multi-tenant data isolation
- [ ] Usage-based billing (metering + aggregation)
- [ ] Workflow engine (state machine, compensating transactions)
- [ ] Audit logging (append-only, regulatory)
- [ ] SSO / SAML / OIDC (WorkOS-style auth)
- [ ] Idempotency + distributed transactions

### System Design — 11 Case Studies (adapted for this track)
- [ ] Multi-Tenant SaaS Platform Design
- [ ] Usage-Based Billing at Scale
- [ ] Distributed Data Pipeline (Databricks-pattern)
- [ ] Real-Time Analytics Dashboard
- [ ] ML Model Serving at Scale
- [ ] Workflow Automation Engine
- [ ] Data Catalog + Lineage
- [ ] Rate Limiter (API-first SaaS)
- [ ] Fraud Detection (payments)
- [ ] Recommendation Engine (ML-based)
- [ ] Real-Time Abuse / Anomaly Detection

---

## How Every Day Works

**Morning (3h):** Learn the concept using one platform's real problem as context.
**Evening (2h):** Build a named feature of one of the 4 platforms using that concept.
**Weekend (12h):** Wire the week's features together — each platform takes a version step forward.

The evening build is never a tutorial. It is always: *"WorkOS needs X"* or *"SparkFlow needs X"*.

---

## MONTH 1: Full-Stack From Day One — All 4 Platforms Introduced

**Month 1 goal:** By end of Week 4, all four platforms exist front to back. The patterns introduced here — multi-tenancy, API-first design, typed SDKs — are the exact patterns Rippling and Stripe are built on. You don't learn them from a blog post. You design them by Day 1.

---

### Week 1: HTTP + HTML + CSS + Multi-Tenant Foundation

**The narrative this week:** You're building internal tooling for a workforce platform, a data pipeline tool, a billing engine, and an AI data catalog. Every platform must support multiple companies (tenants) from Day 1. That decision shapes every schema, every API, every cache key for all 10 months.

---

**MONDAY — HTTP + CLI + Git + Multi-Tenancy Mental Model**

**Morning (3h):**
- HTTP model, DNS, TLS, Client/Server, browser rendering pipeline — same depth as reference roadmap
- **Multi-tenancy decision:** schema-per-tenant (strong isolation, expensive) vs row-level-security (shared schema, `tenant_id` on every table, PostgreSQL RLS policies). Rippling uses RLS-style with extreme isolation guarantees
- **`X-Tenant-ID` header pattern:** every API request carries tenant context. Middleware extracts → attaches to `req.tenant`. Every DB query automatically scoped. This is Day 1 and it never changes
- CLI, VS Code, Git, ESLint, Prettier — same as reference

**Evening (2h): WorkOS Tenant-Scoped HTTP Server**
- Feature: **WorkOS needs a server that accepts employee event payloads and is tenant-scoped from Day 1**
- Raw Node.js HTTP server: reads `X-Tenant-ID` header, logs `[tenant:acme] employee.created payload`
- Tenant context stored in `AsyncLocalStorage` — no prop drilling through every function
- Test: `curl -H "X-Tenant-ID: acme" -X POST http://localhost:3000/events -d '{"type":"employee.created","employeeId":"E001"}'`
- This exact server becomes the WorkOS event ingestion API by Week 4

```javascript
// apps/workos/server/index.js — Day 1. Multi-tenant from the start.
const http = require('http');
const { AsyncLocalStorage } = require('async_hooks');

const tenantContext = new AsyncLocalStorage();

const server = http.createServer((req, res) => {
  const tenantId = req.headers['x-tenant-id'];
  if (!tenantId) { res.writeHead(400); res.end(JSON.stringify({ error: 'X-Tenant-ID required' })); return; }

  tenantContext.run({ tenantId }, () => {
    let body = '';
    req.on('data', c => (body += c));
    req.on('end', () => {
      const event = JSON.parse(body || '{}');
      console.log(`[tenant:${tenantId}] ${event.type}`, event);
      res.writeHead(202, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ queued: true, tenantId, event }));
    });
  });
});
server.listen(3000, () => console.log('WorkOS event receiver :3000'));
// AsyncLocalStorage: tenantId available anywhere in this request's call stack.
// No prop drilling. No global state. Correct under high concurrency.
```

---

**TUESDAY — HTML + Accessibility — WorkOS Employee Form + PayCore Billing Form**

*Same depth as reference roadmap HTML day, applied to SaaS-specific forms:*
- WorkOS employee onboarding form: `employeeId`, `department`, `startDate`, `role`, `manager` — semantic HTML, native validation, accessible
- PayCore subscription form: plan selection (radio group), billing cycle, payment method — same accessibility standards

---

**WEDNESDAY — CSS — All 4 Platforms Styled**

- `packages/tokens.css`: same design token system as reference, extended with SaaS-specific tokens: `--color-tenant-primary` (customizable per tenant), `--color-tier-free/pro/enterprise`
- WorkOS: employee table layout (CSS Grid), status badges, sidebar navigation
- SparkFlow: pipeline DAG layout (flex + grid, job status colors)
- PayCore: pricing table (CSS Grid, feature comparison columns)
- LakeAI: model registry table + experiment comparison charts

---

**THURSDAY — JavaScript — WorkOS Employee Directory + SparkFlow Job Monitor**

- WorkOS: fetch employee list from tenant-scoped server, filter by department/status, event delegation on rows
- SparkFlow: first HTML/CSS/JS shell — pipeline job monitor (job list + status badges, polling every 5s)
- Both: `X-Tenant-ID` header sent on every fetch from Day 1

---

**FRIDAY — TypeScript — packages/types + packages/schemas + Tenant-Scoped API Client**

- `packages/types`: `Tenant`, `Employee`, `Pipeline`, `PipelineJob`, `Invoice`, `BillingPlan`, `Model` — all interfaces
- `packages/schemas`: Zod schemas for all 4 platforms + Python Pydantic equivalents (same field names)
- `packages/sdk`: typed API client that auto-attaches `X-Tenant-ID` from session — this is the public SDK shape
- Tenant context type: `{ tenantId: string; plan: 'free' | 'pro' | 'enterprise'; featureFlags: Record<string, boolean> }`

---

**WEEKEND — All 4 Platforms v0.1 Deployed**

- WorkOS v0.1: employee form + directory + tenant-scoped server on Cloudflare Pages
- SparkFlow v0.1: pipeline job monitor shell
- PayCore v0.1: pricing page + subscription form
- LakeAI v0.1: model registry shell
- GitHub Actions: on push → `tsc --noEmit` → ESLint → deploy

---

### Week 2: React + State Management — All 4 Platforms in React

*Same React depth as reference roadmap (useState, useEffect, useRef, useCallback, useMemo, useContext, React.memo, RHF + Zod, Tanstack Query, Zustand + Immer) — applied to SaaS-specific features:*

- **WorkOS**: multi-step employee onboarding wizard (RHF + Zod, step validation before proceeding). Tenant-scoped employee directory (Tanstack Query with `queryKey: ['employees', tenantId]`)
- **SparkFlow**: pipeline DAG visualization (React + SVG, Zustand for selected node state)
- **PayCore**: plan comparison + checkout flow (RHF + Zod, credit card validation)
- **LakeAI**: experiment comparison table (Tanstack Query, sort/filter by metric)

**Key addition vs reference:** `TenantProvider` wraps all 4 apps — `useCurrentTenant()` hook returns `{ tenantId, plan, featureFlags }`. Feature flag gates: `if (tenant.featureFlags.advancedAnalytics) { ... }`. This pattern runs for all 10 months.

---

### Week 3: Tailwind + Shadcn + Next.js + Svelte + Vue + Testing

*Same framework depth as reference roadmap — applied to SaaS contexts:*

- **Next.js (WorkOS)**: `[tenantSlug]` dynamic segment. `app/[tenantSlug]/employees/page.tsx` — Server Component fetches tenant-specific data. Each tenant has their own Next.js layout with their brand colors (from Tailwind config seeded from tenant data)
- **Svelte**: SparkFlow pipeline status embeddable widget (embed in partner BI tools)
- **Vue**: PayCore billing portal (separate app, same REST API)
- **Testing**: Vitest (WorkOS RBAC logic, billing calculations, pipeline state machines), Playwright, TestSprite

---

### Week 4: Node.js + Express + All Databases — Multi-Tenant Backends

**MONDAY — Node.js Streams + WorkOS Event Pipeline**
- Feature: WorkOS emits employee lifecycle events (hire, promote, terminate) — streamed to downstream consumers
- Transform stream: validate event with Zod schema → enrich with tenant context → batch publish to Kafka

**TUESDAY — Express + Multi-Tenant REST API**
- Feature: All 4 platforms need tenant-scoped APIs. Every endpoint automatically filters by `tenantId`
- PostgreSQL Row-Level Security (RLS): `CREATE POLICY tenant_isolation ON employees USING (tenant_id = current_setting('app.tenant_id')::uuid)`. Set at connection time: `SET LOCAL app.tenant_id = $1`
- Schema-per-tenant for payroll (sensitive data — separate schema, separate connection pool per tenant)

**WEDNESDAY — PostgreSQL + Multi-Tenant Schema Design**
- WorkOS: `employees`, `departments`, `roles`, `role_assignments` — RLS on all
- SparkFlow: `pipelines`, `pipeline_jobs`, `pipeline_runs` — tenant-scoped
- PayCore: `tenants`, `billing_plans`, `subscriptions`, `invoices`, `usage_events` — billing core schema
- LakeAI: `models`, `experiments`, `datasets`, `lineage_edges` — data catalog schema

**THURSDAY — Redis + JWT + RBAC**
- Feature: WorkOS needs multi-role auth — HR Admin, Manager, Employee all see different data
- JWT payload: `{ sub, tenantId, roles: ['hr_admin', 'manager'], permissions: ['employees:read', 'payroll:write'] }`
- RBAC middleware: `requirePermission('payroll:write')` — checks JWT permissions, rejects with 403
- Attribute-based conditions: Manager can only read employees in their own department (`WHERE manager_id = req.user.id`)

**FRIDAY — ClickHouse + PGVector + Delta Lake Preview**
- **ClickHouse**: SparkFlow pipeline metrics (job duration, rows processed, errors) — OLAP queries on billions of rows in < 100ms. `INSERT INTO pipeline_metrics ... SETTINGS async_insert=1`
- **PGVector**: LakeAI semantic model search (`"find models trained on customer churn"` → embedding search)
- **Delta Lake preview**: Parquet files on S3 with ACID transactions (full implementation Month 3)

---

**WEEKEND — All 4 Platforms Full-Stack + Real Auth**

- WorkOS v0.4: React ← Express (multi-tenant RLS) ← PostgreSQL + Redis + JWT/RBAC
- SparkFlow v0.4: pipeline job monitor connected to real backend + ClickHouse metrics
- PayCore v0.4: subscription CRUD + invoice list from real DB
- LakeAI v0.4: model registry with PGVector semantic search

---

## MONTH 2: APIs + Real-Time + DevOps — All 4 Platforms in Production

### Week 5: gRPC + GraphQL + tRPC + Webhooks + SDK Design

**MONDAY — REST + Idempotency + SDK-First API Design**
- Feature: **PayCore needs to be API-first (like Stripe) — SDK generated from OpenAPI spec, versioning, idempotency**
- `POST /v1/charges` with `Idempotency-Key` — no duplicate charges on retry
- OpenAPI spec → generate TypeScript SDK (`packages/sdk`) + Python SDK (`python/sdk`)
- Semantic versioning: `/v1/` frozen, breaking changes → `/v2/`. Non-breaking changes backward compatible
- Webhook event catalog: `charge.succeeded`, `subscription.created`, `invoice.paid` — all signed HMAC-SHA256

**TUESDAY — gRPC — Internal SparkFlow Service Mesh**
- Feature: SparkFlow has multiple internal services (scheduler, executor, monitor) — gRPC for service-to-service
- `.proto`: `ScheduleJob (Unary)`, `StreamJobLogs (Server Stream)`, `BatchSubmitJobs (Client Stream)`
- SparkFlow UI streams job logs live via gRPC Server Stream → SSE to browser

**WEDNESDAY — GraphQL — WorkOS People Graph**
- Feature: WorkOS needs a flexible query API for reporting tools — org chart queries are naturally graph-shaped
- `Employee → manager (Employee) → reports (Employee[]) → department (Department)`
- DataLoader: batch all `managerId → manager` lookups
- Subscriptions: `employeeStatusChanged` → HR dashboard live updates

**THURSDAY — tRPC + Webhooks**
- WorkOS internal admin: tRPC (full TypeScript types, no codegen)
- PayCore webhooks: HMAC signed, retry + DLQ, merchant dashboard for failed deliveries

**FRIDAY — SSE + WebSockets + Real-Time**
- SparkFlow: SSE for live job log streaming (job runs → log lines appear as they execute)
- WorkOS: WebSocket for real-time org chart updates (employee added → all HR tabs update)
- Redis pub/sub bridges all SSE/WS connections across replicas

**WEEKEND — All 4 Platforms v0.5: All API Styles + Real-Time**

---

### Week 6: Docker + CI/CD + Kubernetes + Multi-Cloud

*Same depth as reference roadmap — applied to SaaS infra:*

- **WorkOS → AWS** (Terraform): EKS + RDS PostgreSQL (per-tenant schema isolation) + ElastiCache Redis + S3 (employee documents)
- **SparkFlow → GCP** (Pulumi): GKE + Dataproc (managed Spark) + BigQuery + GCS
- **PayCore → AWS**: ECS Fargate + RDS + ElastiCache + SQS (webhook queue)
- **LakeAI → Railway** (fast iteration)
- **OTel sidecar** (Go): distributed traces across all 4 platforms
- **Kubernetes Operator preview**: `WorkOSTenantProvisioner` CRD — auto-provisions DB schema + Redis keyspace + S3 bucket per tenant (full implementation Week 9)

---

## MONTH 3: Python + Spark + Kafka + Data Pipelines

**Month 3 goal:** SparkFlow and LakeAI get real data engineering internals. This is the Databricks-targeting month. You write PySpark jobs, build Delta Lake tables, wire Kafka CDC, and deploy Airflow DAGs — all as real features of SparkFlow.

---

### Week 7: Python + FastAPI + PySpark — SparkFlow Gets Its Engine

**MONDAY — Python Fundamentals + FastAPI**
- Python: types, dataclasses, Pydantic, async/await, context managers, decorators, generators
- FastAPI: type-annotated routes, Pydantic request/response models, dependency injection, async handlers
- Pydantic schemas = same field names as Zod schemas in `packages/schemas` — change field name → error in both

**Evening: SparkFlow Python Job Submission API**
- Feature: SparkFlow UI submits PySpark jobs via a Python FastAPI backend (Spark runs on Dataproc/EMR)
- `POST /api/jobs` → validate with Pydantic → enqueue to Kafka → return `{ jobId, status: 'queued' }`
- Same TypeScript `packages/types` shapes now have Python Pydantic equivalents

**TUESDAY — PySpark Foundations — SparkFlow First Real Pipeline**
- Feature: SparkFlow needs to process raw employee events (from WorkOS Kafka) into analytics-ready tables
- `SparkSession`, RDDs vs DataFrames, transformations (lazy) vs actions (eager)
- `df.filter().groupBy().agg()` — same query in SQL and PySpark
- SparkFlow: WorkOS employee events → PySpark → clean + aggregate → write Delta Lake

```python
# python/pipelines/workos_employee_pipeline.py
# Reads WorkOS employee events (from Kafka, Month 2)
# Writes to Delta Lake table (LakeAI will serve queries from here)

from pyspark.sql import SparkSession
from pyspark.sql.functions import col, to_timestamp, count, when
from delta import DeltaTable

spark = SparkSession.builder \
    .appName("WorkOS Employee Pipeline") \
    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension") \
    .getOrCreate()

# Read from Kafka (same topic WorkOS publishes to — Month 2)
raw = spark.readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", "kafka:9092") \
    .option("subscribe", "workos.employee.events") \
    .load()

# Parse + transform
events = raw.selectExpr("CAST(value AS STRING) as json") \
    .select(from_json(col("json"), employee_event_schema).alias("e")) \
    .select("e.*") \
    .withColumn("event_time", to_timestamp("e.timestamp"))

# Write to Delta Lake with MERGE (upsert — same employee updated, not duplicated)
query = events.writeStream \
    .format("delta") \
    .option("checkpointLocation", "s3://sparkflow/checkpoints/employees/") \
    .outputMode("append") \
    .start("s3://sparkflow/delta/employees/")
# LakeAI reads from this same Delta table in Month 5
```

**WEDNESDAY — Delta Lake — ACID on Object Storage**
- Feature: SparkFlow pipeline results need ACID transactions + time-travel + schema enforcement
- Delta Lake: `CREATE TABLE ... USING DELTA`, `MERGE INTO` (upsert), time travel (`VERSION AS OF 10`), `OPTIMIZE` + `ZORDER`
- Schema enforcement: reject writes that don't match schema. Schema evolution: `mergeSchema = true` for additive changes
- SparkFlow: every pipeline output table is Delta. LakeAI queries these tables with time-travel

**THURSDAY — Apache Airflow — SparkFlow Workflow Orchestration**
- Feature: SparkFlow needs scheduled pipeline runs, dependency management, retry logic
- Airflow DAG: `WorkOSEmployeePipeline` — runs every 6h, depends on `KafkaIngestJob`, retries 3× on failure
- DAG as code: Python functions with `@task` decorator. Sensor operators for dependencies
- SparkFlow UI shows: DAG graph, last run status, next scheduled run — reads from Airflow API

**FRIDAY — Kafka Streams + dbt + Great Expectations**
- Kafka Streams: real-time aggregations on SparkFlow job metrics (sliding window, per-tenant throughput)
- dbt: SQL transformation layer — WorkOS employee data modeled into `dim_employees`, `fact_headcount_changes`
- Great Expectations: data quality validation on every pipeline output — row count, null rate, referential integrity

**WEEKEND — SparkFlow v0.6: Full Data Engineering Stack**
- PySpark jobs scheduled via Airflow, writing to Delta Lake
- dbt models for WorkOS data
- Great Expectations validation on every run
- SparkFlow dashboard: pipeline runs, data quality scores, Delta table metadata — all live

---

### Week 8: Kafka + Saga + CDC + Database Scaling

*Same depth as reference roadmap — applied to SaaS/data contexts:*

- **WorkOS CDC** (WAL → Kafka): employee data changes → Kafka → SparkFlow consumes for analytics
- **PayCore Saga**: subscription lifecycle — `payment.reserved` → `subscription.activated` → `access.granted`. Compensating: `payment.reversed` + `subscription.cancelled`
- **Database scaling**: WorkOS tenant isolation: schema-per-tenant for payroll, RLS for HRIS. PgBouncer per-tenant connection pooling. Partitioned `audit_log` table (range partition by month)
- **ClickHouse scaling**: SparkFlow pipeline metrics — materialized views, `ReplicatedMergeTree`, per-tenant aggregate queries in < 50ms on billions of rows

---

## MONTH 4: Go Deep + Kubernetes Operator + AI Engineering

### Week 9: Go + WorkOS Tenant Provisioner Operator

**MONDAY-WEDNESDAY — Go Foundations + WorkOSTenantProvisioner CRD**
- Feature: When a new customer signs up for WorkOS, a Kubernetes Operator automatically provisions: PostgreSQL schema, Redis keyspace, S3 bucket, Kafka topics, all tenant-specific config
- `WorkOSTenantProvisioner` CRD: spec includes `tenantId`, `plan`, `region`
- Operator reconciles: creates DB schema, Redis prefix, S3 bucket, Kafka topic `workos.{tenantId}.events`
- This replaces all manual tenant provisioning — new customer → `kubectl apply -f tenant.yaml` → fully provisioned in 30s

```go
// apps/workos/operator/controllers/tenant_controller.go
func (r *TenantProvisionerReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
  var tenant workosv1.WorkOSTenantProvisioner
  if err := r.Get(ctx, req.NamespacedName, &tenant); err != nil {
    return ctrl.Result{}, client.IgnoreNotFound(err)
  }

  // 1. Provision PostgreSQL schema
  if err := r.provisionPostgresSchema(ctx, tenant.Spec.TenantID); err != nil {
    return ctrl.Result{}, err
  }
  // 2. Create Redis keyspace prefix + ACL
  if err := r.configureRedisACL(ctx, tenant.Spec.TenantID); err != nil {
    return ctrl.Result{}, err
  }
  // 3. Create S3 bucket with tenant isolation policy
  if err := r.provisionS3Bucket(ctx, tenant.Spec.TenantID, tenant.Spec.Region); err != nil {
    return ctrl.Result{}, err
  }
  // 4. Create Kafka topics
  if err := r.createKafkaTopics(ctx, tenant.Spec.TenantID); err != nil {
    return ctrl.Result{}, err
  }

  tenant.Status.Provisioned = true
  tenant.Status.ProvisionedAt = metav1.Now()
  return ctrl.Result{}, r.Status().Update(ctx, &tenant)
  // New Rippling customer? 30 seconds to full isolation. No manual steps.
}
```

**THURSDAY-FRIDAY — Go: SparkFlow Job Scheduler (high-throughput)**
- Go replaces Node.js for SparkFlow job scheduling (same pattern as GPS aggregator in reference)
- 1000 concurrent job submission goroutines, results channel, circuit breaker on Dataproc API calls
- `fleetctl`-equivalent: `sparkctl jobs list --tenant=acme`, `sparkctl jobs submit --pipeline=employee-etl`

---

### Week 10: Vercel AI SDK + RAG + AI Agents — LakeAI Full AI Layer

**MONDAY — LakeAI AI Assistant (AI SDK + streaming)**
- Feature: Data engineer asks "which pipelines failed last week and why?" → AI queries ClickHouse, reads Delta table metadata, finds root cause
- Tools: `queryClickHouse` (pipeline metrics), `readDeltaTableMetadata` (SparkFlow Delta tables), `searchPastIncidents` (PGVector), `triggerRerun` (calls SparkFlow API)
- Every tool call hits a real system built in Months 1-3

**TUESDAY — RAG — LakeAI Data Catalog Semantic Search**
- Feature: "find all datasets related to employee churn" → hybrid search over data catalog
- Embed: table names + column names + descriptions + sample queries
- PGVector: HNSW index, hybrid search (vector + keyword)
- Citations: response includes table name, schema, last updated, pipeline that produced it

**WEDNESDAY — AI Agents — LakeAI 3-Agent Pipeline Debugger**
- Detector Agent: monitors Airflow DAG failures + Great Expectations failures → fires on quality drop
- Analyst Agent: reads Delta table stats, compares current run vs historical baseline, identifies anomaly
- Fixer Agent: if known issue → auto-trigger corrective pipeline. If unknown → draft runbook + page on-call

**THURSDAY-FRIDAY — WebAssembly + MLflow + ONNX**
- **MLflow** (LakeAI): experiment tracking — `mlflow.log_param()`, `mlflow.log_metric()`. Model registry: promote experiment → staging → production
- **ONNX** (Go): embed ML model in Go binary for SparkFlow anomaly detection (< 10ms inference, no Python runtime)
- **Wasm** (AssemblyScript): WorkOS client-side data masking (PII fields — SSN, bank account) — masked before leaving browser

---

## MONTH 5: System Design Fundamentals — Built Into All 4 Platforms

### Week 11: Multi-Tenant Scale + Rate Limiting + Consistent Hashing

**MONDAY — Multi-Tenant Data Isolation at Scale**
- Feature: WorkOS needs to prove one tenant can never read another's data, even under failure
- Demo: RLS policy + connection pool segmentation + S3 bucket policy + Redis ACL — all layers together
- Chaos test: inject malformed `tenant_id` → verify 0 data leaks across 4 isolation layers

**TUESDAY — Fault Tolerance + Circuit Breaker + Bulkhead**
- Feature: SparkFlow calls Dataproc, GCS, BigQuery, Kafka — each must be isolated
- Go circuit breaker: same pattern as reference. Dataproc slow → open in 10s → half-open → auto-recover
- Bulkhead: separate semaphore pools for each downstream service

**WEDNESDAY — Rate Limiting (All 4 Algorithms) + Usage Metering**
- Feature: PayCore needs to rate-limit API calls AND meter usage for billing
- All 4 algorithms as Redis Lua scripts (same as reference) — Token Bucket for general API, Leaky Bucket for billing mutations
- **Usage metering**: every API call increments `ZINCRBY usage:${tenantId}:${month} 1 api_calls`. Billing aggregation job reads these counters → generates invoices

**THURSDAY — CAP Theorem + Leader Election + Distributed Coordination**
- Feature: SparkFlow job scheduler must ensure exactly 1 scheduler runs per tenant (no double-scheduling)
- Leader election: Redis SETNX per tenant — `SET leader:scheduler:{tenantId} {nodeId} NX EX 30`
- CAP demo: same pattern as reference, applied to SparkFlow job state (CP vs AP for job status)

**FRIDAY — Consistent Hashing + Bloom Filters + Big Data**
- WorkOS: consistent hash shard router — employee data sharded by `tenantId` across 4 PostgreSQL primaries
- Bloom Filters: SparkFlow pipeline dedup (same job never submitted twice) + LakeAI unknown model ID pre-screen
- Big Data: SparkFlow Kafka → S3 Parquet → Athena (same pattern as reference, now for pipeline telemetry)

**WEEKEND — All System Design Fundamentals Live + OpsAI-equivalent: LakeAI System Health Dashboard**
- LakeAI System Health Dashboard: shows circuit breaker states, rate limit status, cache hit rates, leader election status, tenant isolation health — across all 4 platforms

---

### Week 12: Usage-Based Billing + Notifications + Caching at Scale

**MONDAY-TUESDAY — Usage-Based Billing at Scale (PayCore Case Study 1)**
- Feature: PayCore charges per API call, per active employee, per pipeline run — like Stripe/Databricks
- Metering: Redis `ZINCRBY` per event, drained to PostgreSQL every hour by a Go worker
- Aggregation: monthly invoice calculation (sum usage × unit price per tier)
- Proration: mid-month plan change — calculate days × old_rate + days × new_rate
- Stripe Billing integration: PayCore wraps Stripe's billing API (same way Rippling wraps payment rails)

**WEDNESDAY — Notification System at Scale**
- WorkOS notifications: employee onboarding checklist, payroll run alerts, compliance deadlines
- Architecture: Kafka fan-out, APNs/email/Slack, Redis dedup (`SET notif:{idempotencyKey} NX EX 86400`)
- Per-tenant notification preferences: some tenants want email only, some want Slack only

**THURSDAY-FRIDAY — Redis Cluster + Cache Warm-Up + Multi-Tenant Caching**
- Multi-tenant caching: `cache:${tenantId}:employees` — cache keys always tenant-scoped
- Redis Cluster: 3 primaries. `MOVED` redirect transparent. Per-tenant keyspace ACL
- Cache warm-up on tenant provisioning: operator (Week 9) pre-warms top 100 employee records for new tenant

---

## MONTH 6: All 11 Case Studies — Built Into 4 Platforms

### Week 13: Multi-Tenant SaaS Design + Usage-Based Billing Deep Dive

**Monday-Wednesday: WorkOS Multi-Tenant Platform Design (Case Study 1)**
- Back-of-envelope: 10K tenants × 500 employees = 5M rows. 1000:1 read/write. What caches? What shards?
- Full architecture: RLS + schema isolation + connection pooling + S3 per tenant + Redis ACL
- k6: 10K tenants, 500 concurrent sessions each — p99 < 100ms with no cross-tenant data

**Thursday-Friday: PayCore Usage-Based Billing (Case Study 2)**
- Metering accuracy: Redis counters + PostgreSQL drain + reconciliation job (no lost events)
- Invoice generation: batch job, idempotent, handles failures gracefully
- Customer portal: current usage, projected invoice, plan comparison

---

### Week 14: Distributed Data Pipeline + Real-Time Analytics Dashboard

**Monday-Wednesday: SparkFlow Distributed Pipeline (Case Study 3 — Databricks pattern)**
- Architecture: Kafka → Spark Structured Streaming → Delta Lake → dbt → ClickHouse
- Fault tolerance: exactly-once semantics, checkpoint recovery, schema evolution
- k6: 1M events/sec sustained, < 5min end-to-end latency

**Thursday-Friday: LakeAI Real-Time Analytics Dashboard (Case Study 4)**
- Sub-second ClickHouse queries on 10B+ rows
- React + Tanstack Query: auto-refresh, streaming chart updates via SSE
- Per-tenant materialized views: each tenant's analytics isolated + pre-aggregated

---

### Week 15: ML Model Serving + Workflow Engine + Data Catalog

**Monday-Tuesday: LakeAI ML Model Serving at Scale (Case Study 5)**
- MLflow model registry → ONNX export → Go inference server (< 10ms, same ONNX pattern as reference)
- A/B test framework: 2 model versions, split traffic, measure prediction quality
- Model versioning: promote/rollback without downtime

**Wednesday-Thursday: WorkOS Workflow Engine (Case Study 6 — Rippling-critical)**
- Feature: employee onboarding triggers 20+ steps across systems: HRIS record → IT provisioning → Slack invite → payroll setup → benefits enrollment
- State machine: `pending → in_progress → completed | failed`. Each step: idempotent, retryable, compensatable
- Saga choreography (same pattern as reference Trip Booking Saga — applied to onboarding workflow)

**Friday: LakeAI Data Catalog + Lineage (Case Study 7)**
- Lineage graph: `raw_kafka_events → spark_pipeline → delta_table → dbt_model → dashboard`
- Every SparkFlow job registers its lineage edges in LakeAI
- React graph visualization: click any table → see upstream sources + downstream consumers

---

### Week 16: Rate Limiter + Fraud + Anomaly Detection + Recommendations

**Monday-Tuesday: PayCore API Rate Limiter (Case Study 8)**
- All 4 algorithms, per-tenant limits, burst allowance for enterprise tier
- Lua scripts (same as reference) + dashboard

**Wednesday-Thursday: PayCore Fraud Detection (Case Study 9)**
- Client-side Wasm pre-filter (AssemblyScript, same as reference)
- Rule engine (Go): velocity checks, amount anomaly, new account + high value
- ONNX inference: < 10ms, embedded in Go binary

**Friday: LakeAI Recommendation Engine (Case Study 10 + 11)**
- Collaborative filtering: which datasets/models do similar data engineers use together?
- Content-based: model description → PGVector cosine ANN
- Hybrid + A/B test (same architecture as reference)

**WEEKEND — All 11 Case Studies Deployed + Portfolio Site Live**

---

## MONTH 7: Hiring Sprint

### Weeks 17-18: Portfolio Polish + Open Source
- All 4 platform READMEs: architecture diagrams, benchmark numbers, ADRs
- CNCF contributions: `opentelemetry-go`, `delta-rs` (Rust/Python Delta Lake), `airflow` (Python DAG improvements)
- LFX application: `WorkOSTenantProvisioner` operator + CNCF PRs

### Weeks 19-20: Mock Interviews + Applications

**System design mocks (Rippling-specific):**
- Design a multi-tenant HRIS platform with strong data isolation
- Design a usage-based billing system that doesn't lose events
- Design an employee onboarding workflow engine

**System design mocks (Databricks-specific):**
- Design a distributed data pipeline for 1M events/sec
- Design a data catalog with lineage tracking
- Design an ML model serving platform

**Target applications:**
1. Rippling — WorkOS is your portfolio piece. It's their problem domain
2. Databricks — SparkFlow + LakeAI shows Spark + Delta Lake + MLflow in production
3. Stripe — PayCore is API-first, idempotent, Saga-based. Their vocabulary
4. NVIDIA / OpenAI / Anthropic — LakeAI AI agents + ONNX inference + RAG
5. Confluent — Kafka Streams + CDC + Schema Registry work throughout

**Cold email:**
```
Subject: [Role] — built WorkOS: multi-tenant HRIS platform, tenant provisioning in 30s via K8s Operator

I built WorkOS over 7 months — it mirrors Rippling's architecture.

Most relevant:
• Kubernetes Operator: new tenant → PostgreSQL schema + Redis ACL + S3 bucket + Kafka topics in 30s
• Multi-tenant isolation: RLS + schema separation + connection pooling (k6: 10K tenants, p99 < 100ms, zero cross-tenant leaks)
• Workflow engine: employee onboarding Saga (20 steps, Kafka choreography, compensating transactions)

[GitHub + Live demo + Architecture ADRs]
```

---

## Monthly Summary

| Month | New Concepts | Platform Feature |
|---|---|---|
| 1 | HTTP + multi-tenancy + TypeScript + PostgreSQL RLS + ClickHouse | All 4 shells deployed, tenant-scoped from Day 1 |
| 2 | gRPC + GraphQL + tRPC + SSE + WebSockets + Docker + K8s + Cloud | All 4 on real infra, SDK published |
| 3 | Python + FastAPI + PySpark + Delta Lake + Airflow + dbt + Kafka CDC | SparkFlow full data stack live |
| 4 | Go deep + K8s Operator + Vercel AI SDK + RAG + AI Agents + MLflow + ONNX | WorkOS tenant provisioner + LakeAI full AI |
| 5 | All system design fundamentals in SaaS context | Every pattern live in 4 platforms |
| 6 | All 11 case studies built as platform features | Full portfolio with ADRs + benchmarks |
| 7 | Mock interviews + CNCF + applications | Rippling + Databricks applications submitted |

---

## Interconnection Map

```
Week 1 WorkOS event server (raw Node.js, multi-tenant from Day 1)
  ↓ becomes Week 4 Express API with PostgreSQL RLS
  ↓ becomes Week 5 gRPC + Kafka publisher
  ↓ becomes Week 7 PySpark consumer (SparkFlow reads WorkOS events)
  ↓ becomes Week 9 K8s Operator target (operator provisions per-tenant resources)
  ↓ becomes Month 4 LakeAI data source (AI tools query WorkOS data)
  ↓ becomes Month 6 Workflow Engine (onboarding Saga)

Week 1 packages/types (TypeScript + Python Pydantic equivalents)
  ↓ used by all 4 TypeScript apps always
  ↓ Python Pydantic equivalents used by all PySpark jobs
  ↓ Change one field name → TypeScript + Python errors simultaneously

Week 1 packages/sdk
  ↓ PayCore public SDK (auto-attaches X-Tenant-ID)
  ↓ becomes the SDK shipped to PayCore "customers" in Month 2
  ↓ SDK clients used by SparkFlow to call PayCore billing in Month 3
```
