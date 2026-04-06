# Full-Stack Engineering Mastery Plan
## Targeting Rippling · Databricks · Stripe · NVIDIA / OpenAI
### SaaS Infra + Data/AI Platform Track — Sequential Projects

---

## The Core Principle: One Project at a Time

You finish one project completely before starting the next. No juggling four codebases at once. Each project is built deeply, deployed, benchmarked, and documented before you touch the next one. Every project is **specifically modelled on real internal tooling** at the target company — not a generic portfolio piece.

---

## Why This Track

**Rippling** builds workforce infrastructure. Their India teams own entire surfaces: payroll, HRIS, identity, device management. Their engineering bar requires: multi-tenant SaaS, RBAC, billing, API-first design, workflow engines — the exact vocabulary of their internal platform.

**Databricks** builds the world's data + AI infrastructure: Spark, Delta Lake, Unity Catalog, LLM fine-tuning pipelines. They need engineers who understand streaming data pipelines, columnar storage, distributed compute — things you learn by building, not watching.

**Stripe** is API-first to its core. Their internal tools are extensions of the API-first philosophy. Idempotency, webhook delivery guarantees, usage-based metering — these are not aspirational features, they are correctness requirements.

---

## The 4 Projects (Sequential — Complete One Before Starting the Next)

| Order | Project | Mirrors | Duration | What Rippling / Databricks Actually Uses This For |
|-------|---------|---------|----------|--------------------------------------------------|
| **1st** | **WorkOS** | Rippling's internal HRIS + identity platform | Months 1–2 | The multi-tenant workforce platform every Rippling customer interacts with. Rippling's India team owns HRIS record management, employee provisioning workflows, and cross-product identity. |
| **2nd** | **PayCore** | Stripe's payment + metering infrastructure | Month 3 | Stripe's internal billing engine, webhook delivery system, and usage metering — the infrastructure their own product teams build on. Databricks also uses Stripe's metering model for DBU billing. |
| **3rd** | **SparkFlow** | Databricks' internal pipeline + job management UI | Months 4–5 | Databricks engineers build and manage Spark job pipelines, Delta Lake tables, and dbt transformations through internal tooling very similar to what you build here. |
| **4th** | **LakeAI** | Databricks Unity Catalog + MLflow internal platform | Month 6 | Unity Catalog is Databricks' internal data governance layer. MLflow is their ML experiment tracking system. LakeAI mirrors both. |

---

## Project 1: WorkOS — Multi-Tenant Workforce Platform
### Months 1–2 · Mirrors Rippling's HRIS + Identity Infrastructure

**What Rippling actually uses:** Rippling's core product is a multi-tenant platform where each company (tenant) has employees, departments, roles, devices, and payroll. Their engineering challenge is: every DB query must be tenant-scoped, provisioning a new tenant must be fully automated, and employee onboarding must trigger cross-system workflows without manual steps. WorkOS mirrors this exactly.

**The one rule for WorkOS:** Multi-tenancy is decided on Day 1 and never revisited. Every table has `tenant_id`. Every API request carries `X-Tenant-ID`. Every cache key is `tenant:{tenantId}:...`. This decision is baked into the monorepo scaffold from hour one — just like Rippling's real codebase.

---

### Month 1, Week 1: HTTP + HTML + CSS + Multi-Tenant Foundation

**Monday — HTTP + CLI + Multi-Tenancy Mental Model**

| | |
|---|---|
| 🛠 **Technologies** | Node.js 22, VS Code, pnpm workspaces, `curl`, `dig`, ESLint, Prettier |
| 📖 **Concepts** | HTTP/HTTPS model, DNS, TLS handshake, `curl -v` anatomy, multi-tenancy decision (schema-per-tenant vs RLS), `X-Tenant-ID` header pattern |
| 🎯 **You Build** | WorkOS raw Node.js server — `POST /events` requires `X-Tenant-ID` header. Missing header → 400. Valid header → tenant context attached to request. |
| 🔗 **Why It Matters** | Rippling's entire backend runs this pattern. The middleware that extracts tenant context from headers and scopes every downstream call is the most important piece of infrastructure in the codebase. |

Multi-tenancy decision you make today and never undo:
- **Schema-per-tenant** — each tenant gets their own PostgreSQL schema (`tenant_abc.employees`). Strong isolation. Expensive at 10K+ tenants.
- **Row-level security (RLS)** — single schema, `tenant_id` on every row, PostgreSQL RLS policies auto-filter. Scales to 100K tenants. Rippling uses this pattern.

**The WorkOS rule**: every table created from this day forward has `tenant_id UUID NOT NULL`. Every query has `WHERE tenant_id = $1`. Middleware attaches `req.tenantId` from the `X-Tenant-ID` header. A DB query without tenant scope is a CI lint failure.

**Tuesday — HTML + Semantic Markup + WorkOS Employee List Page**

| | |
|---|---|
| 🛠 **Technologies** | HTML5, WAVE accessibility checker, `curl` |
| 📖 **Concepts** | Semantic HTML, ARIA attributes, accessibility tree, `<form>` with native validation, `<head>` structure for SaaS apps |
| 🎯 **You Build** | WorkOS employee directory HTML — semantic structure, accessible table, ARIA roles. Passes WAVE audit before any CSS is written. |
| 🔗 **Why It Matters** | Rippling's product must meet WCAG 2.1 AA for enterprise contracts with large companies that have accessibility requirements. |

**Wednesday — CSS + Tailwind + WorkOS Dashboard Layout**

| | |
|---|---|
| 🛠 **Technologies** | CSS, Tailwind CSS, `cn()`, `cva()` |
| 📖 **Concepts** | Box model, flexbox, grid, `box-sizing: border-box`, CSS custom properties, Tailwind utility-first model, `cva` for component variants |
| 🎯 **You Build** | WorkOS sidebar + main content layout. Employee table with status badges (active/offboarded/on-leave). Fully responsive. All custom CSS deleted. |
| 🔗 **Why It Matters** | Rippling's frontend design system is utility-first. Every component has 3–4 visual states. `cva` is the pattern that makes variant management maintainable at scale. |

**Thursday — Shadcn UI + Radix UI + WorkOS Component System**

| | |
|---|---|
| 🛠 **Technologies** | Shadcn UI, Radix UI, Tailwind |
| 📖 **Concepts** | Headless component architecture, keyboard accessibility built-in, compound component pattern, owning component source |
| 🎯 **You Build** | WorkOS uses Shadcn: `DataTable` for employee list (sortable, filterable, paginated), `Dialog` for employee detail, `Command` palette for global search. |
| 🔗 **Why It Matters** | Enterprise SaaS requires keyboard-accessible, screen-reader-compatible components. Shadcn + Radix provides this without a black box. |

**Friday — Browser DevTools + Performance + CLI Mastery**

| | |
|---|---|
| 🛠 **Technologies** | Chrome DevTools, Lighthouse, Bash, `grep`, `sed`, `awk`, `cron` |
| 📖 **Concepts** | Rendering pipeline, Lighthouse 100, CLI file/process management, shell scripting, deploy scripts |
| 🎯 **You Build** | WorkOS Lighthouse 100 on landing page. Deploy script: health check → pull → test → restart → verify. |

**Weekend — WorkOS Shell Deployed**

WorkOS has: semantic HTML, Tailwind + Shadcn UI, Node.js raw HTTP server with tenant middleware, `X-Tenant-ID` required on all endpoints. Deployed. Lighthouse 90+.

---

### Month 1, Week 2: JavaScript Engine Deep

**Monday — JS Types + Coercion + VS Code Setup**

| | |
|---|---|
| 🛠 **Technologies** | Node.js, TypeScript, ESLint, Prettier, Error Lens |
| 📖 **Concepts** | Primitive vs reference types, `===` vs `==`, truthy/falsy, `typeof` gotchas, TDZ |
| 🎯 **You Build** | `packages/utils/validate.ts` — tenant ID validator, employee data sanitizer. 20 Vitest edge-case tests. |

**Tuesday — Scope + Closures + The Loop Variable Bug**

| | |
|---|---|
| 🛠 **Technologies** | Node.js, TypeScript, Vitest |
| 📖 **Concepts** | Lexical scope, closure over config, `var`/`let`/`const`, hoisting, TDZ |
| 🎯 **You Build** | `packages/utils/retry.ts` — exponential backoff with jitter used by WorkOS webhook delivery. Closure seals configuration. 8 tests. |

**Wednesday — Prototypes + `class` + EventEmitter**

| | |
|---|---|
| 🛠 **Technologies** | Node.js, TypeScript, Vitest |
| 📖 **Concepts** | Prototype chain, `class` as syntax sugar, 4 rules of `this`, arrow functions and lexical `this` |
| 🎯 **You Build** | `packages/utils/emitter.ts` — WorkOS internal event bus. Employee state changes emit `employee.updated`, `employee.offboarded`. |

**Thursday — Event Loop Deep**

| | |
|---|---|
| 🛠 **Technologies** | Node.js, `process.nextTick`, `setImmediate` |
| 📖 **Concepts** | Call stack, microtask queue, macrotask queue, 6 Node.js event loop phases, `process.nextTick` before microtasks |
| 🎯 **You Build** | Predict 20 execution-order puzzles correctly. `packages/utils/scheduler.ts` — priority task scheduler using min-heap. |

**Friday — Promises + async/await + Generators**

| | |
|---|---|
| 🛠 **Technologies** | Node.js, TypeScript, Vitest |
| 📖 **Concepts** | Promise states, `async/await` as sugar, `Promise.all`/`allSettled`/`race`/`any`, generators for lazy pagination |
| 🎯 **You Build** | `packages/utils/concurrent.ts` — `ConcurrencyLimiter` (WorkOS uses this when provisioning tenants: max 5 concurrent Kafka topic creations). `Promise.all` reimplemented. 10 tests. |

---

### Month 1, Week 3: Node.js Internals + TypeScript + WorkOS API

**Monday — V8 Architecture + Hidden Classes**

| | |
|---|---|
| 🛠 **Technologies** | `node --inspect`, Chrome DevTools Memory tab |
| 📖 **Concepts** | JIT pipeline (Ignition → TurboFan), hidden classes, GC generational model, GC pause impact |
| 🎯 **You Build** | Profile WorkOS employee serialization. Find hidden class deoptimization. Fix. Document speedup. |

**Tuesday — Streams + Backpressure + pipeline()**

| | |
|---|---|
| 🛠 **Technologies** | Node.js `stream/promises`, `Transform`, `Writable` |
| 📖 **Concepts** | Push vs pull, `highWaterMark`, `drain` event, backpressure, `pipeline()` error propagation |
| 🎯 **You Build** | WorkOS employee bulk import pipeline: CSV → validate → enrich → PostgreSQL batch insert. 100MB file in 20MB constant RAM. |
| 🔗 **Why It Matters** | Rippling's customer onboarding involves bulk importing employee data from HRIS files. Streaming is the only correct approach — loading 100K employee rows into memory crashes. |

**Wednesday — TypeScript Deep: Generics + Branded Types**

| | |
|---|---|
| 🛠 **Technologies** | TypeScript compiler, `tsconfig.json` strict mode |
| 📖 **Concepts** | Generic type parameters, conditional types, `infer`, mapped types, branded types |
| 🎯 **You Build** | `packages/types` — `TenantId`, `EmployeeId`, `DepartmentId` are all branded types. You cannot pass a `DepartmentId` where a `TenantId` is expected. Zero `any`. |
| 🔗 **Why It Matters** | At Rippling's scale, mixing up tenant IDs and employee IDs causes cross-tenant data leaks — a catastrophic security failure. Branded types prevent this at compile time. |

**Thursday — Zod + `packages/schemas`**

| | |
|---|---|
| 🛠 **Technologies** | Zod, TypeScript |
| 📖 **Concepts** | One schema = runtime validation + TypeScript type, `z.infer`, `safeParse`, discriminated unions, transforms |
| 🎯 **You Build** | `packages/schemas` — `EmployeeSchema`, `TenantSchema`, `WorkflowStepSchema`. All WorkOS API requests validated through Zod before touching the DB. |

**Friday — JWT RS256 Auth + RBAC + PostgreSQL First Contact**

| | |
|---|---|
| 🛠 **Technologies** | JWT RS256, Redis, Express, PostgreSQL, `node-postgres` |
| 📖 **Concepts** | Asymmetric JWT (RS256), access/refresh token rotation, RBAC middleware (admin/manager/employee), PostgreSQL RLS policies, `EXPLAIN ANALYZE` |
| 🎯 **You Build** | WorkOS auth: JWT RS256 (`packages/auth` shared). 3-role RBAC. PostgreSQL schema with RLS — every `SELECT` automatically filtered by tenant. |
| 🔗 **Why It Matters** | Rippling's RBAC is their most critical security layer. An admin from company A must never see data from company B. RLS enforces this at the database level — even a buggy query cannot leak. |

---

### Month 1, Week 4: WorkOS Full-Stack — React + PostgreSQL + Redis + APIs

**Monday–Tuesday — React + Tanstack Query + Zustand**

| | |
|---|---|
| 🛠 **Technologies** | React 18, Tanstack Query, Zustand, Immer, Motion |
| 📖 **Concepts** | `UI = f(state)`, reconciliation, all hooks, optimistic updates, selective subscription, `AnimatePresence` |
| 🎯 **You Build** | WorkOS employee dashboard in React: live employee list (Tanstack Query), global filter state (Zustand), optimistic status toggle, animated onboarding progress. |

**Wednesday — Next.js App Router + Server Components**

| | |
|---|---|
| 🛠 **Technologies** | Next.js 14, React Server Components, `'use client'` |
| 📖 **Concepts** | Server Components (zero JS for static content), ISR for public pages, streaming Suspense, Server Actions |
| 🎯 **You Build** | WorkOS public marketing page (Server Component, 0 KB JS). WorkOS admin dashboard (`'use client'`, interactive). |

**Thursday — PostgreSQL Deep: MVCC + Indexes + Isolation Levels**

| | |
|---|---|
| 🛠 **Technologies** | PostgreSQL, `sqlc`, `pgx/v5`, `pgxpool` |
| 📖 **Concepts** | MVCC, B-tree/partial/GIN indexes, all 4 isolation levels, `SELECT FOR UPDATE`, `EXPLAIN ANALYZE`, N+1 elimination |
| 🎯 **You Build** | WorkOS PostgreSQL schema: `tenants`, `employees`, `departments`, `roles`. RLS policies on all tables. Every query `EXPLAIN ANALYZE`'d. No seq scans. |

**Friday — Redis: All Data Structures for WorkOS**

| | |
|---|---|
| 🛠 **Technologies** | Redis, `go-redis`, Lua scripts |
| 📖 **Concepts** | String/Hash/List/Set/Sorted Set/Stream with real use cases, TTL jitter, Lua atomicity, tenant-scoped cache keys |
| 🎯 **You Build** | WorkOS Redis: employee profile cache (`Hash`, key: `tenant:{id}:emp:{id}`), online sessions (`Set`), audit event stream (`Stream`), per-tenant rate limit (`Sorted Set`). |

**Weekend — WorkOS v1.0 Complete**

Full-stack WorkOS: Next.js frontend, Express API, PostgreSQL with RLS, Redis tenant-scoped caching, JWT RS256 auth, 3-role RBAC. Deployed. CI green. Lighthouse 90+.

---

### Month 2, Week 5: Node.js Stdlib Deep + WorkOS Advanced Features

**Monday — Raw TCP + HTTP Internals + `net` Module**

| | |
|---|---|
| 🛠 **Technologies** | Node.js `net`, `http`, `AsyncLocalStorage` |
| 📖 **Concepts** | TCP connection lifecycle, HTTP/1.1 parsing, `http.Agent` connection pooling, request-scoped context without prop-drilling |
| 🎯 **You Build** | WorkOS request-scoped logger: every log line automatically includes `tenantId`, `requestId`, `userId` with zero prop-drilling. Uses `AsyncLocalStorage`. |
| 🔗 **Why It Matters** | Rippling's observability must show which tenant generated which log line. `AsyncLocalStorage` propagates tenant context through the entire async call chain. |

**Tuesday — `worker_threads` + `crypto` + HMAC Webhook Signing**

| | |
|---|---|
| 🛠 **Technologies** | Node.js `worker_threads`, `crypto`, `SharedArrayBuffer` |
| 📖 **Concepts** | True CPU parallelism with `worker_threads`, HMAC-SHA256 signing, `timingSafeEqual`, shell injection prevention |
| 🎯 **You Build** | WorkOS webhook delivery: signs every outgoing webhook payload with HMAC-SHA256 (`X-WorkOS-Signature` header). Customers verify signatures the same way Stripe customers do. |
| 🔗 **Why It Matters** | Rippling sends webhooks to third-party integrations (Slack, Okta, GSuite). Without HMAC signing, any attacker can forge a webhook and trigger automated provisioning actions. |

**Wednesday–Thursday — WorkOS Workflow Engine: Employee Onboarding Saga**

| | |
|---|---|
| 🛠 **Technologies** | Node.js, PostgreSQL, Redis, Kafka |
| 📖 **Concepts** | Saga pattern (sequence of local transactions with compensating rollbacks), state machine (pending → in_progress → completed/failed), idempotent step execution |
| 🎯 **You Build** | WorkOS employee onboarding workflow: hire employee → trigger 8 sequential steps: HRIS record → IT provisioning task → Slack invite → payroll setup → benefits enrollment → device assignment → access review → compliance training. Each step is idempotent, retryable, compensatable. |
| 🔗 **Why It Matters** | This is Rippling's core product feature. When a company hires someone on Rippling, this exact workflow runs. The saga pattern ensures partial failures don't leave the employee in an inconsistent state (e.g., added to Slack but not given laptop access). |

**Friday — TypeScript Compiler API + Module Augmentation**

| | |
|---|---|
| 🛠 **Technologies** | TypeScript, `tsc --noEmit`, strict options |
| 📖 **Concepts** | `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, declaration merging, Express `Request` augmentation |
| 🎯 **You Build** | Typed Express `Request` with `tenant: Tenant`, `user: AuthUser` via declaration merging. `tsc --noEmit` in CI — zero `any`. |

---

### Month 2, Week 6: Go + gRPC + WorkOS Internal Services

**Monday–Tuesday — Go Language Core**

| | |
|---|---|
| 🛠 **Technologies** | Go 1.22, `go mod`, `golangci-lint`, `goleak` |
| 📖 **Concepts** | Zero values, implicit interface satisfaction, `%w` error wrapping, `defer` + cleanup, `go test -race` |
| 🎯 **You Build** | WorkOS tenant provisioner in Go: creates PostgreSQL schema + Redis ACL + S3 bucket + Kafka topics for a new tenant. Takes 30 seconds. `go test -race` passes. |
| 🔗 **Why It Matters** | Rippling onboards enterprise customers daily. Tenant provisioning must be automated, fast, and idempotent — running it twice for the same tenant must be safe. |

**Wednesday — Go Concurrency: Goroutines + Channels + `sync`**

| | |
|---|---|
| 🛠 **Technologies** | Go goroutines, channels, `sync.WaitGroup`, `errgroup`, `singleflight` |
| 📖 **Concepts** | M:N scheduler, work stealing, `errgroup` for parallel provisioning steps, `singleflight` deduplication |
| 🎯 **You Build** | WorkOS tenant provisioner refactored: all 4 provisioning steps (PostgreSQL + Redis + S3 + Kafka) run in parallel via `errgroup`. Total time: 8s → 2s. `goleak.VerifyNone(t)` confirms zero goroutine leaks. |

**Thursday — gRPC + Protobuf**

| | |
|---|---|
| 🛠 **Technologies** | gRPC, Protocol Buffers, `buf` CLI |
| 📖 **Concepts** | Proto3 syntax, service definitions, code generation, streaming RPCs, gRPC vs REST tradeoffs |
| 🎯 **You Build** | WorkOS internal gRPC service: `EmployeeService.GetEmployee`, `EmployeeService.UpdateStatus`, `EmployeeService.ListByTenant`. Used internally. REST stays external-facing. |
| 🔗 **Why It Matters** | Rippling's internal services communicate over gRPC. The binary encoding is 10x smaller than JSON and the schema contract prevents accidental breaking changes between services. |

**Friday — WorkOS Kubernetes Operator + Deployment**

| | |
|---|---|
| 🛠 **Technologies** | Go, `controller-runtime`, Kubernetes |
| 📖 **Concepts** | Kubernetes Operator pattern, CRD (Custom Resource Definition), reconcile loop, watch + react |
| 🎯 **You Build** | WorkOS `TenantProvisioner` Kubernetes Operator: new `Tenant` CRD created → operator automatically runs all provisioning steps. `kubectl apply -f tenant.yaml` → tenant live in 30s. |
| 🔗 **Why It Matters** | This is the portfolio piece for Rippling. Automated tenant provisioning via K8s Operator shows platform engineering depth. |

**Weekend — WorkOS COMPLETE**

WorkOS is finished, deployed, benchmarked, documented. ADRs written. README with architecture diagram, k6 benchmarks (10K tenants, p99 < 100ms, zero cross-tenant data). LinkedIn post. Now start PayCore.

---

## Project 2: PayCore — Payment Processing + Usage Metering
### Month 3 · Mirrors Stripe's Internal Billing + Webhook Infrastructure

**What Stripe actually uses:** Stripe's internal billing engine meters API calls, card transactions, and webhook events per customer. The webhook delivery system guarantees at-least-once delivery with exponential backoff. The idempotency layer ensures a payment request retried 100 times creates exactly 1 charge. PayCore mirrors these exact systems — not a generic payments tutorial.

---

### Month 3, Week 7: PayCore Foundation — Double-Entry Ledger + API-First Design

**Monday — Double-Entry Ledger + ACID Transactions**

| | |
|---|---|
| 🛠 **Technologies** | PostgreSQL, `DECIMAL(19,4)`, Go |
| 📖 **Concepts** | Double-entry bookkeeping (debit + credit always sum to zero), ACID transactions, isolation level `SERIALIZABLE` for ledger ops, `CONSTRAINT SUM(debits) = SUM(credits)` |
| 🎯 **You Build** | PayCore ledger: `journal_entries` table. Every financial movement creates two rows in a single transaction. DB-level constraint ensures no single-entry writes ever succeed. |
| 🔗 **Why It Matters** | Stripe's ledger uses double-entry. A bug that creates a debit without a matching credit is not a bug — it's a compliance failure. The constraint is the enforcement mechanism. |

**Tuesday — Idempotency Keys**

| | |
|---|---|
| 🛠 **Technologies** | Go, PostgreSQL (`ON CONFLICT DO NOTHING`), Redis |
| 📖 **Concepts** | Idempotency key pattern, `INSERT ... ON CONFLICT (idempotency_key) DO NOTHING`, exactly-once semantics for payments |
| 🎯 **You Build** | PayCore payment endpoint: send same `X-Idempotency-Key` 10 times → 1 charge, 9 cached responses. Verified by test. |
| 🔗 **Why It Matters** | Network timeouts cause clients to retry. Without idempotency, a retry causes a double charge. Stripe's entire API is built around this guarantee. |

**Wednesday — Outbox Pattern + Kafka**

| | |
|---|---|
| 🛠 **Technologies** | Go, PostgreSQL, Kafka |
| 📖 **Concepts** | Outbox pattern (write event in same DB transaction as business op), exactly-once Kafka publishing, transactional outbox worker |
| 🎯 **You Build** | PayCore: `payment.success` event written to `outbox` table in same transaction as ledger update. Outbox worker reads and publishes to Kafka. Crash between DB write and Kafka publish → event still delivered. |
| 🔗 **Why It Matters** | Without the outbox, Stripe could commit a charge to the DB but fail before publishing the `charge.succeeded` event — customer never notified. This is a production incident waiting to happen. |

**Thursday — Webhook Delivery System**

| | |
|---|---|
| 🛠 **Technologies** | Go, PostgreSQL, Redis, Kafka |
| 📖 **Concepts** | Webhook delivery guarantees (at-least-once), exponential backoff retry, DLQ (dead letter queue), HMAC signature verification, delivery log |
| 🎯 **You Build** | PayCore webhook delivery: retry up to 3 days with exponential backoff. HMAC-SHA256 signature on every payload. Delivery log per webhook event. Failed deliveries → DLQ with manual retry UI. |
| 🔗 **Why It Matters** | This is Stripe's webhook infrastructure. Every webhook retry policy, signature header, and delivery log you see in Stripe's dashboard is backed by exactly this architecture. |

**Friday — Usage-Based Metering**

| | |
|---|---|
| 🛠 **Technologies** | Redis `ZINCRBY`, Go, PostgreSQL |
| 📖 **Concepts** | Metering (Redis counters per event type), aggregation (drain to PostgreSQL hourly), proration (mid-month plan change), invoice generation |
| 🎯 **You Build** | PayCore metering: every API call increments `ZINCRBY metrics:{customerId}:{month} 1 api_calls`. Hourly drain job: sum Redis → PostgreSQL. Monthly invoice: sum × unit price per tier. Mid-month plan change: prorate. |
| 🔗 **Why It Matters** | Databricks charges by DBU (Databricks Unit) per job run. Stripe charges per transaction. Both use this exact metering → aggregation → invoice architecture. |

---

### Month 3, Week 8: PayCore Advanced — Saga + Event Sourcing + SDK

**Monday–Tuesday — Saga Pattern: Fund Transfer**

| | |
|---|---|
| 🛠 **Technologies** | Go, Kafka, PostgreSQL |
| 📖 **Concepts** | Saga (distributed transaction via local transactions + compensating rollbacks), choreography vs orchestration, at-least-once delivery, saga state tracking |
| 🎯 **You Build** | PayCore fund transfer Saga: debit source → credit destination → confirm. Each step compensatable. Crash at step 2 → step 1 reversed by compensating transaction. |

**Wednesday — Event Sourcing + CQRS**

| | |
|---|---|
| 🛠 **Technologies** | Go, Kafka, PostgreSQL read models |
| 📖 **Concepts** | Event Sourcing (current state = replay of events), CQRS (separate read/write models), projection rebuilding, event replay for debugging |
| 🎯 **You Build** | PayCore v2: payment state is derived by replaying `PaymentInitiated → PaymentAuthorized → PaymentCaptured` events. Balance = sum of all `Debit`/`Credit` events. |
| 🔗 **Why It Matters** | Stripe's ledger is event-sourced. Every account balance is computable from the event log — essential for regulatory audit trails. |

**Thursday — PayCore Go Service + `sqlc` + `chi`**

| | |
|---|---|
| 🛠 **Technologies** | Go, `chi`, `sqlc`, `pgx`, `go-redis`, `cobra` |
| 📖 **Concepts** | Clean architecture (handler → service → repository), `sqlc` compile-time query validation, graceful shutdown, `CopyFrom` bulk insert |
| 🎯 **You Build** | PayCore rewritten in Go: `chi` router, `sqlc`-generated DB layer, `cobra` CLI for ops (`payrail reconcile`, `payrail invoices generate`). |

**Friday — Testing + k6 Benchmarks**

| | |
|---|---|
| 🛠 **Technologies** | Go `testing`, `testcontainers`, Vitest, Playwright, k6 |
| 📖 **Concepts** | `testcontainers` for real PostgreSQL/Kafka in tests, table-driven tests, E2E payment flow test, k6 load test |
| 🎯 **You Build** | PayCore: 10K TPS sustained on k6. Zero double charges verified (dedup check post-load). `go test -race` passes. |

**Weekend — PayCore COMPLETE**

PayCore finished, deployed, benchmarked. k6 results: 10K TPS, p99 < 50ms, zero double charges. ADRs written. README with architecture diagram. LinkedIn post. Now start SparkFlow.

---

## Project 3: SparkFlow — Distributed Data Pipeline Platform
### Months 4–5 · Mirrors Databricks' Internal Job Management + Delta Lake UI

**What Databricks actually uses:** Databricks engineers work with Spark jobs, Delta Lake tables, and dbt transformations through internal tooling. The job management UI shows run history, retry status, data quality gates. The Delta Lake layer handles ACID transactions on S3 data. SparkFlow is that internal tooling — built by you.

---

### Month 4, Week 9: Go Deep + SparkFlow Foundation

**Monday — Go Stdlib Deep: `net/http` + Middleware**

| | |
|---|---|
| 🛠 **Technologies** | Go `net/http`, `chi`, `slog`, `sqlc` |
| 📖 **Concepts** | `http.Handler` interface, middleware chain, server timeouts (all 4), `slog` structured logging, `pgxpool` connection pool |
| 🎯 **You Build** | SparkFlow Go API: pipeline definition CRUD, job submission, run history. All 4 server timeouts set. Structured logs with `pipelineId`, `tenantId`, `runId`. |

**Tuesday — SparkFlow Pipeline Definition + Spark Job Runner**

| | |
|---|---|
| 🛠 **Technologies** | Go, Python (PySpark via subprocess), Kafka |
| 📖 **Concepts** | Spark job lifecycle, driver vs executor, DAG execution, job submission via `spark-submit`, job status polling |
| 🎯 **You Build** | SparkFlow: define a pipeline (YAML: input source, PySpark transform, output sink). Submit via Go API → spawns `spark-submit`. Status polling every 5s. Run history stored in PostgreSQL. |
| 🔗 **Why It Matters** | Databricks' workflow UI submits Spark jobs to clusters. This is that system — minus the cluster management (Databricks handles that at infra level, your focus is the orchestration layer). |

**Wednesday–Thursday — Delta Lake + ACID on S3**

| | |
|---|---|
| 🛠 **Technologies** | Delta Lake (`delta-rs` Python), Apache Parquet, S3, dbt |
| 📖 **Concepts** | Delta Lake transaction log (JSON files alongside Parquet), ACID on object storage, time-travel queries (`VERSION AS OF`), schema evolution, `OPTIMIZE` + `ZORDER` |
| 🎯 **You Build** | SparkFlow pipeline output writes to Delta Lake table on S3. `SELECT * FROM pipeline_output VERSION AS OF 3` works. Schema evolution: add a column without breaking downstream consumers. |
| 🔗 **Why It Matters** | Delta Lake is Databricks' most important product contribution to open source. Understanding its transaction log mechanism (optimistic concurrency on S3) is a key differentiator for Databricks interviews. |

**Friday — dbt + Data Quality: Great Expectations**

| | |
|---|---|
| 🛠 **Technologies** | dbt, Great Expectations, Kafka |
| 📖 **Concepts** | dbt model DAG (SQL → materialized view/table), `ref()` for dependency tracking, Great Expectations validation suites, blocking pipeline on failed quality gate |
| 🎯 **You Build** | SparkFlow: after each pipeline run, Great Expectations validates the output (no nulls in required columns, value ranges, row count thresholds). Failed gate → pipeline fails, PagerDuty alert, Delta time-travel rollback. |

---

### Month 4, Week 10: SparkFlow Real-Time + Airflow + Kafka CDC

**Monday–Tuesday — Kafka Essentials + CDC**

| | |
|---|---|
| 🛠 **Technologies** | Apache Kafka, Kafka Connect, Debezium (CDC) |
| 📖 **Concepts** | Topic → partition → offset, consumer groups, idempotent producer, exactly-once semantics, Kafka Connect CDC: every PostgreSQL row change → Kafka topic |
| 🎯 **You Build** | SparkFlow: every change to the PayCore `payments` table (from Project 2) is CDC'd into Kafka. SparkFlow pipeline subscribes and processes payment events in near real-time. |
| 🔗 **Why It Matters** | Databricks' Unity Catalog integrates with operational databases via CDC. You don't batch-copy data — you stream changes as they happen. |

**Wednesday — Apache Airflow Pipeline Scheduling**

| | |
|---|---|
| 🛠 **Technologies** | Apache Airflow, Python DAGs, Kafka |
| 📖 **Concepts** | DAG (Directed Acyclic Graph), task dependencies, retries, SLA monitoring, XCom for inter-task data |
| 🎯 **You Build** | SparkFlow pipeline scheduling via Airflow: `daily_payment_aggregation` DAG runs at 2am, runs dbt models, validates with Great Expectations, sends Slack notification on success/failure. |

**Thursday — ClickHouse: OLAP Analytics for SparkFlow Dashboard**

| | |
|---|---|
| 🛠 **Technologies** | ClickHouse, Go ClickHouse client |
| 📖 **Concepts** | Columnar storage, MergeTree engine, partitioning, `EXPLAIN` on ClickHouse, sub-second aggregations on billions of rows |
| 🎯 **You Build** | SparkFlow analytics dashboard: pipeline run counts, data volumes processed, error rates — queried from ClickHouse in < 100ms. |
| 🔗 **Why It Matters** | Databricks' internal analytics use ClickHouse-style columnar storage. Understanding why `SELECT COUNT(*) FROM runs WHERE date > '2024-01-01'` is 1000x faster in ClickHouse than PostgreSQL is essential knowledge. |

**Friday — Kubernetes + Terraform + CI/CD for SparkFlow**

| | |
|---|---|
| 🛠 **Technologies** | Docker multi-stage, Kubernetes, Terraform, GitHub Actions |
| 📖 **Concepts** | Multi-stage builds (900MB → 85MB), K8s HPA, Terraform state (S3 + DynamoDB lock), GitHub Actions matrix CI |
| 🎯 **You Build** | SparkFlow deployed to EKS. Terraform provisions: EKS cluster, RDS, ElastiCache, S3 buckets, MSK Kafka. GitHub Actions: lint → test → build → trivy scan → deploy. |

---

### Month 5, Week 11: SparkFlow System Design + Testing + Polish

**Monday — Database Design: Sharding + Isolation Levels**

| | |
|---|---|
| 🛠 **Technologies** | PostgreSQL, TimescaleDB |
| 📖 **Concepts** | All 4 isolation levels with live anomaly demos, range partitioning for pipeline runs, `EXPLAIN ANALYZE` on every query |
| 🎯 **You Build** | SparkFlow `pipeline_runs` table partitioned by month. Queries for "last 24h" touch 1 partition. TimescaleDB hypertable for metrics. |

**Tuesday — Caching Architecture**

| | |
|---|---|
| 🛠 **Technologies** | Redis, Cloudflare CDN |
| 📖 **Concepts** | Cache-aside, write-through, stampede prevention, TTL jitter, caching at browser/CDN/Redis/DB levels |
| 🎯 **You Build** | SparkFlow: pipeline definition cache (Redis, cache-aside), dashboard metrics cache (Redis, 30s TTL with jitter), static assets (CloudFront, immutable). |

**Wednesday — Resiliency: Circuit Breakers + Load Balancers**

| | |
|---|---|
| 🛠 **Technologies** | Go circuit breaker, AWS ALB |
| 📖 **Concepts** | Circuit breaker states (closed/open/half-open), load balancer algorithms, PITR drill |
| 🎯 **You Build** | SparkFlow circuit breaker: Spark cluster slow → breaker trips → jobs queue instead of overwhelming cluster. PITR drill: restore SparkFlow DB to 30s before a DROP TABLE. RTO < 10 minutes documented. |

**Thursday–Friday — Bloom Filters + Consistent Hashing + System Design**

| | |
|---|---|
| 🛠 **Technologies** | Go, Redis |
| 📖 **Concepts** | Bloom filter for pipeline dedup, consistent hashing for job worker routing, URL shortener design, rate limiter design |
| 🎯 **You Build** | SparkFlow job router using consistent hashing — adding a 4th worker remaps only 25% of jobs. Bloom filter deduplicates CDC events (same event processed twice is a no-op). |

**Weekend — SparkFlow COMPLETE**

SparkFlow finished, deployed, benchmarked. k6 results. All system design concepts implemented. ADRs written. Now start LakeAI.

---

## Project 4: LakeAI — AI/ML Data Catalog + Model Registry
### Month 6 · Mirrors Databricks Unity Catalog + MLflow

**What Databricks actually uses:** Unity Catalog is Databricks' data governance layer — every table, column, and dataset registered with lineage, ownership, and access control. MLflow tracks ML experiments, model versions, and deployment status. LakeAI is the internal tooling that mirrors both — built for the engineers who use Databricks to manage their data and models.

---

### Month 6, Week 13: LakeAI Foundation — Data Catalog + Lineage

**Monday — Data Catalog: Every Dataset Registered**

| | |
|---|---|
| 🛠 **Technologies** | Go, PostgreSQL, Elasticsearch, PGVector |
| 📖 **Concepts** | Data catalog schema (dataset → table → column), metadata management, full-text search across datasets, semantic search via PGVector |
| 🎯 **You Build** | LakeAI data catalog: every SparkFlow pipeline output auto-registers in LakeAI. Search "payment transactions last 30 days" returns the correct dataset via Elasticsearch + PGVector hybrid search. |
| 🔗 **Why It Matters** | Unity Catalog is Databricks' most important enterprise feature. Data engineers spend hours finding the right dataset. LakeAI makes that instant. |

**Tuesday — Data Lineage Graph**

| | |
|---|---|
| 🛠 **Technologies** | Go, PostgreSQL, React (graph visualization) |
| 📖 **Concepts** | Lineage graph (DAG of: raw source → pipeline → Delta table → dbt model → dashboard), lineage recording at pipeline run time, impact analysis |
| 🎯 **You Build** | LakeAI lineage: every SparkFlow job records its inputs and outputs in LakeAI. Click any dataset → see all upstream sources and all downstream consumers. "What breaks if I change this column?" — lineage answers it. |

**Wednesday — MLflow Integration: Experiment Tracking**

| | |
|---|---|
| 🛠 **Technologies** | MLflow, Python, Go proxy |
| 📖 **Concepts** | MLflow experiment runs (parameters, metrics, artifacts), model registry (staging → production), A/B test framework, model versioning |
| 🎯 **You Build** | LakeAI ML registry: train model → MLflow logs parameters + metrics. LakeAI UI shows all experiments. Promote model to production: `POST /models/{id}/promote`. A/B test: split traffic 80/20 between v1 and v2. |
| 🔗 **Why It Matters** | MLflow is open-sourced by Databricks and is the de facto ML experiment tracking standard. Knowing how to build the UI and promotion workflow on top of it is directly relevant to Databricks interviews. |

**Thursday — ONNX Model Inference in Go**

| | |
|---|---|
| 🛠 **Technologies** | ONNX, Go ONNX runtime, Python (model training) |
| 📖 **Concepts** | ONNX model export (sklearn/PyTorch → ONNX), Go inference server (< 10ms), model hot-reload, A/B test via feature flag |
| 🎯 **You Build** | LakeAI recommendation: train dataset recommendation model in Python (collaborative filtering), export to ONNX, serve from Go at < 10ms p99. Recommend "datasets similar engineers use" based on query history. |

**Friday — RAG + AI Agents + Vercel AI SDK**

| | |
|---|---|
| 🛠 **Technologies** | Vercel AI SDK, OpenAI, PGVector, Go |
| 📖 **Concepts** | RAG pipeline (embed → store → retrieve → generate), tool use (LLM decides which tool to call), agent loop, `streamText` for streaming responses |
| 🎯 **You Build** | LakeAI AI assistant: "What datasets contain payment data from Q4?" → RAG over catalog. "Run a data quality check on `payments_2024`" → tool use (calls SparkFlow API). Streams response token by token via AI SDK. |

---

### Month 6, Week 14: All System Design Cases Implemented

**Monday–Tuesday — Multi-Tenant SaaS + Usage-Based Billing (System Design 1 + 2)**

WorkOS already demonstrates multi-tenant design at k6 scale. PayCore already demonstrates usage-based metering. This week: write the architecture ADRs, create architecture diagrams, run k6 to document final numbers, write the case study write-up for the portfolio.

**Wednesday — Distributed Data Pipeline + Real-Time Analytics (System Design 3 + 4)**

SparkFlow already implements the Databricks-pattern pipeline. LakeAI already has the analytics dashboard. Document: architecture, throughput benchmarks, fault tolerance design, time-travel rollback procedure.

**Thursday — ML Model Serving + Workflow Engine + Data Catalog (System Design 5 + 6 + 7)**

LakeAI has model serving (ONNX + MLflow). WorkOS has the workflow engine (onboarding Saga). LakeAI has the data catalog with lineage. Document all three with benchmarks.

**Friday — Rate Limiter + Fraud Detection + Recommendation (System Design 8 + 9 + 10 + 11)**

| | |
|---|---|
| 🛠 **Technologies** | Redis Lua, Wasm (AssemblyScript), ONNX Go, PGVector |
| 📖 **Concepts** | All 4 rate limit algorithms, Wasm pre-filter for fraud, 3-layer fraud detection, collaborative + content-based recommendation hybrid |
| 🎯 **You Build** | PayCore rate limiter: all 4 algorithms, per-tenant limits. LakeAI fraud detection on API usage (Wasm + Go rules + ONNX). LakeAI recommendation: collaborative filtering + PGVector cosine ANN. |

**Weekend — LakeAI COMPLETE. All 4 Projects COMPLETE.**

---

## Month 7: Observability + Polish + Hiring Sprint

### Week 15: OpenTelemetry + Distributed Tracing

**Monday–Tuesday — OTel SDK + Prometheus + Grafana**

Add OpenTelemetry instrumentation to all 4 projects. Every service emits traces to Jaeger. Latency histograms in Prometheus. Grafana dashboard with p50/p95/p99 per endpoint per project.

**Wednesday–Thursday — k6 Load Tests + pprof**

Run k6 on all 4 projects. Profile every Go service with `pprof`. Document every benchmark number. Fix any regression found.

**Friday — Lighthouse + TypeScript Strict + Security**

All 4 project frontends: Lighthouse 100/100/100/100. `tsc --noEmit` with `strict: true`. `govulncheck` passes. `trivy image` passes.

---

### Week 16: Portfolio Polish + Cold Outreach

**README for every project:**
- Mermaid architecture diagram
- k6 benchmark numbers (p50/p95/p99 at target RPS)
- Key ADRs linked (why RLS over schema-per-tenant, why Delta Lake over raw Parquet)
- Live demo link

**Cold Email Templates:**

```
Subject: [Rippling SDE] — built WorkOS: K8s Operator provisions tenant in 30s, 10K tenants p99 < 100ms

WorkOS mirrors Rippling's HRIS + identity platform.

Key highlights:
• K8s Operator: new tenant → PostgreSQL RLS policies + Redis ACL + S3 bucket + Kafka topics in 30s
• Employee onboarding Saga: 8-step workflow, each step idempotent + compensatable (Rippling's core product)
• k6: 10K tenants × 500 sessions, p99 < 100ms, zero cross-tenant data leaks verified

Also built PayCore (Stripe-pattern): double-entry ledger, idempotency, webhook delivery, usage metering.
[GitHub] [Live demo] [Architecture ADRs]
```

```
Subject: [Databricks SDE] — built SparkFlow + LakeAI: Spark job orchestration + Unity Catalog mirror

SparkFlow mirrors Databricks' job management infrastructure.
LakeAI mirrors Unity Catalog + MLflow.

Key highlights:
• SparkFlow: pipeline definition → Delta Lake output → dbt transform → Great Expectations gate → Airflow schedule
• LakeAI: every pipeline output registered in catalog with full lineage graph (source → pipeline → model → dashboard)
• ONNX Go inference: dataset recommendation model at < 10ms p99

[GitHub] [Live demo] [Delta Lake architecture ADR]
```

---

## Monthly Summary

| Month | Project | Phase | Key Milestones |
|-------|---------|-------|----------------|
| 1 | WorkOS | Foundation: multi-tenant shell, JS deep, TypeScript | RLS schema, HTML/CSS/Tailwind, all utility packages |
| 2 | WorkOS | Advanced: Go, gRPC, K8s Operator, Saga | Tenant provisioner, onboarding workflow, K8s Operator deployed |
| 3 | PayCore | Full build: double-entry, idempotency, webhooks, Saga | 10K TPS k6, zero double charges, metering live |
| 4 | SparkFlow | Foundation: Go API, Spark jobs, Delta Lake, CDC | Pipeline runs, Delta time-travel, Airflow DAGs |
| 5 | SparkFlow | Advanced: system design, caching, resiliency | Bloom filter, consistent hashing, circuit breaker, PITR drill |
| 6 | LakeAI | Full build: catalog, lineage, MLflow, ONNX, RAG | All 11 system design cases documented and deployed |
| 7 | All | Polish + hiring sprint | OTel, k6 all projects, Lighthouse 100, cold emails sent |

---

## Non-Negotiable Rules

| Rule | Why |
|------|-----|
| `go test -race ./...` before every commit | Data races are silent production bugs |
| `tsc --noEmit` passes — no `any` | TypeScript `any` silently disables all type checking |
| `EXPLAIN ANALYZE` on every SQL query | Blind queries are time bombs |
| Idempotency key on every mutation that could be retried | Duplicate operations corrupt data |
| Outbox pattern for every Kafka publish that must be guaranteed | Events lost at publish time = silent inconsistency |
| ADR for every major technology decision | Future you needs to know why |
| k6 load test before calling anything "production-ready" | Untested performance claims are fiction |
| `goleak.VerifyNone(t)` in every Go test file | Goroutine leaks accumulate and eventually crash production |
| Tenant-scoped cache keys everywhere in WorkOS | `cache:{tenantId}:...` — never just `cache:employees` |
| Post benchmark numbers publicly every weekend | Building in public is proof of work |
