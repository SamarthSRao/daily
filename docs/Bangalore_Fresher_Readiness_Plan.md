# Bangalore Backend Fresher Readiness Plan — 2025/2026
### Adobe · Uber · Rippling · DoorDash · Amazon · Google · Swiggy · Zomato
*Built on the Backend Engineering Mastery Plan — 2026 Edition*

---

## 1. What the Bangalore Market Actually Wants

The 2025/2026 hiring reports from Adobe, Uber, Rippling, DoorDash, Amazon, Google, Swiggy, and Zomato show a clear and consistent picture. The entry bar has risen sharply: these companies no longer treat freshers as support engineers. You are expected to own mission-critical systems from Week 1.

### 1.1 The Four Non-Negotiable Pillars

| Pillar | What Companies Demand | How Your Plan Covers It |
|---|---|---|
| CS Fundamentals + DSA | Medium–hard LeetCode in OA rounds. Swiggy & Zomato: 2–3 problems, time/space complexity must be optimal. | Document_from_Sam covers 205 problems across Levels 1–4. Stages 1–2 cover OS, Networks, Data Structures. |
| Distributed Systems | Uber: 99.99% availability. Rippling: Kafka + Flink. DoorDash: monolith → microservices. All companies test this in system design rounds. | Stages 7–8–14: Kafka, Saga, leader election, distributed locks, consistent hashing — all built in running code. |
| Databases — Deep | Zomato: query optimisation on multi-table joins. All companies: PostgreSQL, Redis, at least one NoSQL. ClickHouse/Elasticsearch at Uber/Rippling. | Stage 5 (DBMS Deep) — MVCC, WAL, B-trees, EXPLAIN ANALYZE, isolation levels, PgBouncer. |
| AI-Augmented Development | Adobe + DoorDash explicitly name Cursor.ai + GitHub Copilot in JDs. All companies expect "AI-Native" engineers by 2026. | Stage 13 + GitHub Copilot from Day 1 + Claude for RFC drafting. OpenTrace demonstrated with OTel AI stack. |

### 1.2 Company-by-Company Skill Requirements

| Company | Core Tech Required | Their Bonus Points | Your Plan Coverage |
|---|---|---|---|
| Adobe | Java/Spring Boot, REST, AWS/Azure, React.js, SQL | Docker/K8s, OAuth/JWT, Grafana/Splunk, CI/CD, Cursor.ai | Stages 4+9+11+13; JWT RS256 in PayCore; Grafana dashboards all projects |
| Uber | Go, Java, Scala, SQL, Distributed Systems, Linux | Kafka, Flink, Hadoop/Hive, Fintech/Payments, 99.99% uptime | Stage 4 (Go mastery); Stage 14 (dist. systems); PayCore (payments); all projects benchmarked |
| Rippling | Python, Go, Django, TypeScript, DSA, Distributed Systems | Open source contributions, competitive coding, Tier-1 background | Stages 4+14; DungBeetle (tasks+approvals pattern); LFX open source track in Month 9 |
| DoorDash | Go, Python, Kotlin, SQL, NoSQL (Postgres+Redis), REST | Spark/Airflow, Bazel, DevContainers, K8s, AI dev tools | Stage 5 (Postgres+Redis deep); Stage 11 (K8s); Stage 13 (AI); DungBeetle (job platform = DevEx) |
| Amazon | Full SDLC ownership, cloud-native, elegant code, best practices | Systems design depth, on-call ownership mindset | All 5 projects: full lifecycle from RFC to k6 benchmark; on-call runbooks for every alert |
| Google | C/C++/Java/Python, scalability, AI/ML contributions, CS depth | Research background, ML system design | Stages 1–3 (CS fundamentals); Stage 13 (LLM/RAG/vectors); OpenTrace (CNCF-grade open source) |
| Swiggy | DSA/Algo depth, API integration, high-scale architectures | End-to-end system design ownership, experiment mindset | Document_from_Sam 205 problems; RouteMaster (fan-out at scale); all ADRs demonstrate ownership |
| Zomato | Go/Java/Python, CS fundamentals, first-principles problem solving | Query performance optimisation, concurrent traffic handling | Stage 5 (EXPLAIN ANALYZE mastery); BookWise (10K concurrent users); Golang primary language |

---

## 2. The Interview Gauntlet — What You Will Face

### Stage 1 — Online Assessment (DSA + CS MCQs)

Platform: HackerRank or LeetCode. Duration: 90 minutes. Format: 2–3 medium/hard problems + CS MCQs on DBMS, OS, and Networks.

> **Your weapon:** Document_from_Sam's 205-problem taxonomy, sorted by cognitive load. Work Level 1 (Foundation) first to eliminate simple mistakes, then Level 2 (Synthesis) for BFS/DFS/Binary Search — the most common Zomato/Swiggy OA patterns.

Critical OA patterns by frequency at Indian product companies:
- **Arrays + Hashing (Levels 1–2):** Group Anagrams, Subarray Sum, Find All Anagrams — problems 109–142
- **BFS/DFS on Graphs and Trees (Level 2):** Number of Islands, Rotting Oranges, LCA — problems 3, 11, 55
- **Binary Search on Answer (Level 2–3):** Ship Package Capacity, Koko Eating Bananas — problems 194–195
- **Dynamic Programming (Level 3):** 0/1 Knapsack, Coin Change, LIS — problems 161–166, 178
- **Heap patterns (Level 2–3):** Top K Frequent, Merge K Sorted Lists, Median from Stream — problems 104, 111, 105

### Stage 2A — DSA Deep Dive (Technical Round 1)

This is where Swiggy and Zomato probe time/space complexity, not just correctness. You must explain WHY your solution is optimal, not just that it works.

> **The Gatekeeper Test:** The constraint table in Document_from_Sam is your primary weapon. n ≤ 10⁵ → O(n log n). n ≤ 10⁶ → O(n). Interviewers at Swiggy will reject a correct solution if your complexity is wrong.

Level 3 topics that appear even for freshers:
- Segment Trees / BIT — Range Sum Query (Mutable), Range Frequency (problems 56, 150)
- Monotonic Stack — Trapping Rain Water, Largest Rectangle (problems 128–129)
- Advanced DP — Matrix Chain, Burst Balloons, Interval DP (problems 184–185)
- Level 4 Architecture (201–205) — Paxos vs Raft, Vector Clocks, Gossip — appear in Uber system design rounds

### Stage 2B — Low-Level Design / Machine Coding

Zomato and Swiggy ask you to design systems like a Food Ordering System or a Real-Time Tracking System in 60–90 minutes using OOP, interfaces, and design patterns.

Your projects ARE the preparation:
- **BookWise** → distributed seat reservation = the classic booking system LLD problem
- **DungBeetle** → background job system = the task scheduler / worker pool LLD problem
- **RouteMaster** → real-time tracking = the location tracking + fan-out LLD problem
- **PayCore** → payment gateway = the transaction + ledger LLD problem

> **Key advice:** In machine coding rounds, interviewers value extensibility over cleverness. Show that adding a new job type to DungBeetle requires zero changes to the worker core — only a new handler registration.

### Stage 2C — System Design

| Common Question | Your Project That Answers It | Key Points to Hit |
|---|---|---|
| Design a notification system | RouteMaster fan-out pipeline | Kafka, fan-out-on-write vs read, APNs/FCM, Redis dedup SETNX |
| Design a booking system | BookWise | Distributed lock + fencing tokens, SELECT FOR UPDATE SKIP LOCKED, Saga |
| Design a job queue | DungBeetle | Leader election SETNX, exactly-once cron, DLQ + exponential backoff |
| Design a payment system | PayCore | Double-entry bookkeeping, idempotency keys, Saga, event sourcing |
| Design an observability system | OpenTrace | OTLP protocol, ClickHouse storage, Kafka sampling pipeline, gRPC query |
| Design a search system | RouteMaster + Elasticsearch | Inverted index, BM25, faceted aggregations, hybrid BM25 + vector search |

### Stage 3 — Hiring Manager / Bar Raiser

Your strongest answers:
- *"I built OpenTrace — a complete distributed tracing system — as my final year project. It instruments itself. Here are the benchmark numbers."*
- *"Every architecture decision across my 5 projects is documented in an ADR. I can walk you through why I chose ClickHouse over Elasticsearch for span storage."*
- *"DungBeetle started as a Node.js monolith. I wrote the RFC documenting why I migrated it to Go, with before/after benchmark numbers."*

---

## 3. The 9-Month Execution Plan

### Month 1 — Fundamentals + OS + Networks

| What You Build | What Market Gap It Closes |
|---|---|
| HTTP/DNS/TCP deep understanding; raw gRPC echo server; OpenTrace scaffold | Adobe/Amazon: HTTP fluency is assumed. Uber: Linux/Unix platform knowledge required. |
| OS: processes, threads, virtual memory, file systems, disk I/O, IPC | All companies: OS MCQs in OA. Uber: Linux proficiency is a core requirement. |
| Networks: TCP/IP stack, socket programming, HTTP/1.1 vs HTTP/2 vs HTTP/3 | DoorDash/Uber: debugging tools (ss, tcpdump, netstat) appear in production incident rounds. |
| Document_from_Sam Level 1 problems (problems 61–179): Foundation tier | Zomato/Swiggy OA: these are the warm-up problems you must solve in under 10 minutes. |

> By end of Month 1 you can pass Zomato and Swiggy's OA warm-up tier without hesitation.

### Month 2 — Node.js Internals + TypeScript + OpenTrace Collector

| What You Build | What Market Gap It Closes |
|---|---|
| OpenTrace Collector v0.1: OTLP/gRPC + HTTP receiver, Kafka producer | DoorDash/Rippling: gRPC + Kafka from first principles. Adobe: TypeScript + API design. |
| PayCore: auth layer (JWT RS256) + webhook design (HMAC) | Adobe: OAuth/JWT listed as bonus. All companies: API security is tested in rounds 2–3. |
| V8 JIT, libuv event loop, streams, AsyncLocalStorage, worker_threads | Adobe: Node.js is their runtime for Creative Cloud services. TypeScript strict mode. |
| Document_from_Sam Level 2 start: BFS/DFS tier (problems 3, 11, 44–68) | Swiggy/Zomato OA: BFS/DFS on graphs and trees is the most common pattern. |

### Month 3 — Go Mastery + Concurrency + Pipeline Processor

| What You Build | What Market Gap It Closes |
|---|---|
| Go: goroutines, channels, errgroup, singleflight, context, pprof, go test -race | Uber/Zomato/DoorDash: Go is primary language. Rippling: Go listed as core requirement. |
| OpenTrace Pipeline Processor: Kafka consumer, tail-based sampling, ClickHouse bulk insert | Uber: Kafka knowledge listed as bonus. ClickHouse = Uber's internal OLAP database. |
| DungBeetle v0.1 in Go: job queue, worker pool, panic recovery | DoorDash: Backend DevEx team builds exactly this. Rippling: Tasks Inbox is DungBeetle. |
| Biweekly Project 3: Clustered WebSocket server with Redis pub/sub fan-out | Swiggy/Zomato: real-time tracking system is a standard LLD question. |
| Document_from_Sam Level 2 complete: BST, Heap, Sliding Window (problems 82–195) | All companies: Heap + Sliding Window appear in 60% of Bangalore OA rounds. |

### Month 4 — React + Next.js + Testing + Dev Tools

| What You Build | What Market Gap It Closes |
|---|---|
| All 5 projects: Next.js frontends, JWT auth, Vitest 80%+, Playwright E2E | Adobe: React.js + full-stack awareness explicitly required. All: unit testing required. |
| OpenTrace UI v0.1: trace list, trace detail, D3.js waterfall (virtualised) | Rippling: "design polished interfaces" + "ship filtering/search features" in JD. |
| GitHub Actions CI/CD for all 5 repos: lint → test → build → trivy → deploy | Adobe/DoorDash: CI/CD listed as bonus. Amazon: "define engineering best practices". |
| TestSprite AI-generated E2E tests, TestContainers integration tests | DoorDash DevEx: "AI-native developer tooling for code generation and debugging". |

### Month 5 — DBMS Deep (The Most Important Month for Bangalore Interviews)

> This is the month that separates candidates at Zomato, Swiggy, Uber, and DoorDash. Database knowledge is tested directly in rounds 2 and 3 at every company.

| What You Build | What Market Gap It Closes |
|---|---|
| PostgreSQL: MVCC, WAL, B-tree index internals, query planner, EXPLAIN ANALYZE mastery | Zomato: "improve query performance on multi-table joins for concurrent traffic" — this is exactly EXPLAIN ANALYZE. |
| All 4 isolation levels with live anomaly demos: dirty read, phantom read triggered in psql | Uber/Rippling: isolation levels are a standard technical interview topic. Most freshers cannot demo a phantom read live. |
| OpenTrace ClickHouse storage: MergeTree, partition pruning, TTL, bulk insert benchmark | Uber: ClickHouse is their internal OLAP DB. DoorDash: big data infra is listed as bonus. |
| Redis: all data structures + Lua scripts + distributed locks + rate limiting patterns | All companies: Redis caching is a core requirement. Rippling: Redis rate limiter. |
| MongoDB, Elasticsearch: aggregation pipelines, inverted index, BM25, faceted search | DoorDash/Swiggy: NoSQL listed as required. Elasticsearch = RouteMaster's search engine. |
| Biweekly: WAL from scratch (Project 1), LSM-tree from scratch (Project 8) | Uber/Rippling: "understanding of complex architectural trade-offs" — WAL/LSM-tree is what they mean. |
| Document_from_Sam Level 3 start: Trie, Segment Tree, DP advanced (problems 1–50) | Google/Rippling: Level 3 problems appear in all Google rounds and Rippling's technical screens. |

> **Interview reality:** Zomato's technical round directly asks: *"We have a query joining orders + restaurants + delivery_agents with 10M rows each, running at 500 QPS. It's taking 4 seconds. Fix it."* Your EXPLAIN ANALYZE practice in Month 5 is the exact preparation for this question.

### Month 6 — Infrastructure + Kubernetes + Observability

| What You Build | What Market Gap It Closes |
|---|---|
| Docker multi-stage builds, K8s: Pod/Deployment/Service/Ingress/HPA, Terraform | Uber/DoorDash: K8s required from day one. Adobe: Docker/K8s listed as bonus requirement. |
| OpenTrace Query Service + API Gateway: gRPC streaming, service dependency graph | All companies: gRPC is a core protocol. Uber: "service-mesh architecture with Envoy". |
| Prometheus + Grafana: RED method, PromQL, SLO alerts, Alertmanager → PagerDuty | Adobe: "Monitoring/Logging frameworks (Grafana, Splunk)" listed as bonus. Uber: 99.99% SLA. |
| OpenTelemetry: all 5 projects self-instrumented with traces, metrics, structured logs | DoorDash/Uber: observability is production responsibility from Week 1. On-call requires this. |
| AWS: ECS Fargate, RDS Multi-AZ, ElastiCache, MSK, S3, CloudFront | Adobe/Amazon/DoorDash: cloud platform proficiency — AWS is the most common platform. |

### Month 7 — Distributed Systems Deep

> This is the month that distinguishes you at Uber and Rippling specifically. Uber tests distributed systems architecture in both the coding and system design rounds.

| What You Build | What Market Gap It Closes |
|---|---|
| Leader election (Redis SETNX + TTL + heartbeat): DungBeetle cron scheduler | Uber: "design large-scale distributed systems" — leader election is always the first question. |
| Distributed locks with fencing tokens: BookWise seat reservation | Rippling: workflow steps require exactly-once execution = fencing tokens. |
| Consistent hashing + Bloom filters: implemented in Go with benchmarks | Google/Uber: these appear in system design rounds as component-level questions. |
| Saga pattern + event sourcing: PayCore payment flows with compensation | All fintech-adjacent companies (Rippling/Uber/Zomato): Saga is the expected answer for distributed transactions. |
| OpenTrace UI v2: service map, live tail WebSocket, auto-instrumentation SDK | DoorDash DevEx: building developer tooling (SDK + UI) = exactly what DevEx team does. |
| Raft consensus basics: why etcd/CockroachDB use it (read, not build) | Uber/Google: Raft appears in senior-level system design. Freshers who understand it stand out. |

### Month 8 — Performance Engineering + AI-Native Stack

| What You Build | What Market Gap It Closes |
|---|---|
| pprof CPU flame graphs, heap profiles, goroutine dumps on all 5 projects | Uber: "advanced profiling and debugging tools" explicitly in JD. On-call requires flame graph reading. |
| k6 load tests: p50/p95/p99 documented for every project in BENCHMARKS.md | All companies: "demonstrated track record" = numbers. Benchmarks are the only way to show scale. |
| RAG pipeline: embed → PGVector store → retrieve top-K → inject → generate | Rippling/DoorDash/Google: "Vector Databases and RAG" listed as emerging 2026 requirement. |
| LLM function calling + AI agents: DungBeetle AI job orchestration | DoorDash: "AI-native developer tooling". Rippling: LLM-backed workflow automation. |
| OpenTrace production hardening: K8s Operator, OTel compatibility, 10M spans/sec test | All companies: "production systems" + benchmarks. OpenTrace 10M spans/sec is the headline number. |
| PITR drill: DROP TABLE → restore → RTO < 10 minutes → runbook written | Uber/DoorDash: on-call rotation requires knowing PITR. Most freshers have never done this. |

### Month 9 — Polish + LFX + Cold Emails

| What You Build | What Market Gap It Closes |
|---|---|
| LFX Mentorship application: Jaeger ClickHouse plugin, ≥2 PRs merged | Rippling: "Open Source contributions" listed as bonus. Google: CNCF contributions = research signal. |
| Cold emails to Infraspec, Swiggy, Zomato, DoorDash with benchmark numbers | All: your GitHub + benchmarks do the talking. Numbers in the subject line get replies. |
| All 5 READMEs: Mermaid architecture diagram + benchmark table + live demo link | Rippling/Google/Uber: "project deep dive" round requires you to explain every architectural choice. |
| Document_from_Sam Level 3 complete + Level 4 review (all 205 problems covered) | Google/Rippling: Level 3 problems are their standard bar. Level 4 = Uber architecture rounds. |

---

## 4. DSA Strategy — 205 Problems Mapped to Interview Rounds

| Level | Problems | When to Complete | Unlocks at Companies |
|---|---|---|---|
| Level 1 — Foundation | 18 problems (61–179) | Month 1 | Zomato/Swiggy OA warm-up tier. Solve in < 10 min each. |
| Level 2 — Synthesis | 75 problems | Months 2–3 | All OA rounds. BFS/DFS, Binary Search, BST, Heaps, Sliding Window. |
| Level 3 — Optimization | 112 problems | Months 5–8 | Google/Rippling technical rounds. DP, Segment Trees, Monotonic Stack, Tries. |
| Level 4 — Expert Architecture | 5 problems (201–205) | Month 9 | Uber/Google system design rounds. Paxos, Raft, Vector Clocks, Gossip. |

### The Constraint Gatekeeper

| If n = | You immediately know | Correct approach |
|---|---|---|
| n ≤ 12 | O(n!) is acceptable | Permutations, brute-force |
| n ≤ 25 | O(2ⁿ) is acceptable | Backtracking, bitmask DP |
| n ≤ 5,000 | O(n²) is acceptable | Standard DP, nested loops fine |
| n ≤ 10⁵ | Must be O(n log n) | Sorting, Binary Search, Segment Tree, Heap |
| n ≤ 10⁶ | Must be O(n) | Two Pointers, Sliding Window, Prefix Sum |

> **The single most valuable OA skill:** State your time complexity BEFORE you write a line of code. Swiggy interviewers have reported rejecting candidates who produced correct O(n²) solutions when O(n) was expected for n = 10⁶.

---

## 5. Skill Gap Analysis

### Programming Languages

| Skill | Companies Requiring It | Coverage | Status |
|---|---|---|---|
| Go (Golang) | Uber, Zomato, DoorDash, Rippling, Swiggy | Month 3: Go mastery. All 5 projects: primary language. | ✓ FULL |
| Java / Spring Boot | Adobe, Amazon | Not primary — Go covers all same concepts. ADR written comparing Go vs Java. | ⊕ Add 1-week Java sprint if targeting Adobe specifically |
| Python | Rippling, Google, DoorDash | Demonstrated via AI stack (Month 8 RAG pipeline in Python). | ⊕ Add FastAPI weekend project for Rippling |
| TypeScript / Node.js | Rippling, Adobe, DoorDash, all frontends | Month 2: Node.js internals. All 5 projects: Next.js frontends. OpenTrace UI: TypeScript strict. | ✓ FULL |
| C++ / Scala | Google, Uber (Scala) | Not covered — but Go is accepted as equivalent at all listed companies except Google. | ⊕ 1-week C++ DSA sprint for Google specifically |

### Distributed Systems & Infrastructure

| Skill | Companies Requiring It | Coverage | Status |
|---|---|---|---|
| Kafka / message queues | Uber, Rippling, DoorDash, Swiggy, Zomato | Stage 7 + all 5 projects: Kafka producer/consumer, outbox, EOS, Saga choreography. | ✓ FULL |
| Kubernetes + Docker | Uber, DoorDash, Adobe (bonus) | Stage 11: multi-stage Docker builds, K8s full stack, K8s Operator for OpenTrace. | ✓ FULL |
| AWS (ECS, RDS, S3, MSK) | Adobe, Amazon, DoorDash | Stage 11: ECS Fargate, RDS Multi-AZ, ElastiCache, MSK, S3, CloudFront. | ✓ FULL |
| Flink (stream processing) | Rippling (bonus) | Not covered — Kafka consumer groups + stateful processing covers the concept. | ⊕ 1-day Flink overview reading if targeting Rippling |
| Envoy / Service mesh | Uber | Not explicitly built — K8s Ingress + load balancer internals cover the principles. | ⊕ Add Istio/Envoy 1-day overview for Uber prep |
| Terraform / IaC | Adobe, DoorDash (implied) | Stage 11: Terraform HCL, state, plan/apply, modules. | ✓ FULL |

### Databases

| Skill | Companies Requiring It | Coverage | Status |
|---|---|---|---|
| PostgreSQL (deep) | Zomato, DoorDash, Rippling, Swiggy | Stage 5: MVCC, WAL, B-tree, EXPLAIN ANALYZE, isolation levels, PgBouncer, PITR. | ✓ FULL |
| Redis (deep) | All companies | Stage 5 + all 5 projects: all data structures, Lua scripts, distributed locks, rate limiting. | ✓ FULL |
| MongoDB | DoorDash, Swiggy | Stage 5: document model, $lookup, indexes, when NOT to use. | ✓ FULL |
| Elasticsearch | DoorDash, Swiggy | Stage 5 + RouteMaster: inverted index, BM25, faceted search, hybrid vector search. | ✓ FULL |
| ClickHouse / OLAP | Uber (internal), OpenTrace | Stage 5 + OpenTrace: MergeTree, partition pruning, bulk insert, TTL, EXPLAIN. | ✓ FULL |
| Cassandra / DynamoDB | Amazon, Uber (bonus) | Stage 5: conceptual coverage, wide-column model, partition key design. | ⊕ Add DynamoDB hands-on for Amazon SDE-I specifically |

### AI-Native Stack

| Skill | Companies Requiring It | Coverage | Status |
|---|---|---|---|
| GitHub Copilot / Cursor.ai | Adobe, DoorDash (explicit), all 2026 | Built-in from Day 1. Copilot open always. Claude drafts RFCs. | ✓ FULL |
| RAG / Vector Databases | Google, Rippling, DoorDash | Stage 13 + Month 8: PGVector, HNSW index, hybrid BM25+vector, AWS S3 Vector. | ✓ FULL |
| LLM function calling / agents | DoorDash DevEx, Rippling | Stage 13: tool use, AI agent loop, DungBeetle AI job orchestration. | ✓ FULL |
| LLM Orchestration frameworks | Google, DoorDash | Stage 13: AI SDK (Vercel), streamText, useChat, tool definitions. | ✓ FULL |

---

## 6. Compensation Targets

| Company | Fresher CTC Range | What Gets You the Top of That Range |
|---|---|---|
| Rippling | ₹40L – ₹78L | Open source PRs merged. LFX mentorship accepted. Founders mindset demonstrated via ADRs. |
| Google | ₹20L – ₹35L | C++ proficiency + ML system understanding + strong Level 3–4 DSA. CNCF signal helps. |
| Zomato | ₹26L – ₹29L | Strong Go + PostgreSQL depth. EXPLAIN ANALYZE mastery. Benchmarks visible on GitHub. |
| Swiggy | ₹20L – ₹22.5L | End-to-end system ownership + DSA Level 2–3 depth. RouteMaster fan-out numbers. |
| DoorDash | ₹18L – ₹22L | Go + K8s + DevEx tooling experience. OpenTrace SDK is what their DevEx team builds. |
| Uber | ₹15L – ₹25L (est.) | Go concurrency depth. Distributed systems in running code. 99th-percentile benchmarks. |
| Amazon | ₹9L – ₹15L | Full SDLC ownership. ADRs + runbooks + PITR drill. On-call mindset in documentation. |
| Adobe | ₹8L – ₹14L | Java/Spring Boot (add 1-week sprint). Cursor.ai demonstrated. JWT RS256 + OAuth in PayCore. |

> **The Rippling prize:** Rippling's L5 range (₹40L–₹78L) for freshers is the highest in the market. What gets you there: open source contributions (LFX Month 9), strong DSA (Level 3 complete), and the "founders mindset" — having shipped systems that required hard architecture decisions under uncertainty. Your 5 projects with ADRs demonstrate exactly this.

---

## 7. Weekly Execution Rhythm

| Day | Activity | Interview Evidence Produced |
|---|---|---|
| Monday–Tuesday | Learn the concept by reading source code. Break things intentionally. Run EXPLAIN ANALYZE on every query. | Deep technical answers in rounds 2–3. *"I triggered a phantom read in psql and here is what I observed."* |
| Wednesday–Thursday | Build a named feature of a named project. Ship it. Run `go test -race ./...` and `goleak`. | GitHub commit history with real dates. Project deep-dive round material. |
| Friday | One Document_from_Sam problem from the current level. Write up the time/space complexity analysis. | OA round preparation. Constraint → complexity → approach, second nature. |
| Saturday | One biweekly project milestone. Benchmark it. Add numbers to BENCHMARKS.md. | Cold email subject line material: *"10M spans/sec"* / *"10K concurrent, 0 double-books"*. |
| Sunday | Write one ADR. Update one README. Post one benchmark publicly (GitHub/LinkedIn). | Bar raiser round material. Demonstrates communication, ownership, and "builds in public" credibility. |

---

## 8. The Application — What to Send and When

### Subject Line Formula

```
Backend Engineer — built [PROJECT]: [ONE HEADLINE NUMBER] — applying for [ROLE] at [COMPANY]
```

Examples:
- *"Backend Engineer — built OpenTrace: distributed tracing system in Go, 10M spans/sec — applying for SDE-1 at Zomato"*
- *"Backend Engineer — built BookWise: 10K concurrent users, 0 double-bookings — applying for SE-1 at Rippling"*
- *"Backend Engineer — built PayCore: Saga-based payment system, 5K TPS — applying for Software Engineer at Uber"*

### Application Timing

| Month | Apply to These Companies | Why This Timing |
|---|---|---|
| Month 4 end | Swiggy (Associate SDE), Zomato (SDE-1) | DSA Level 1–2 solid. All 5 projects exist with frontends. Swiggy/Zomato OA is passable. |
| Month 6 end | Adobe, Amazon SDE-1, DoorDash | K8s deployed, observability live, CI/CD running. System design answers are concrete. |
| Month 8 end | Uber SE-1, Rippling SE-1 (L5) | Full distributed systems depth. Go concurrency benchmarked. AI stack demonstrated. |
| Month 9 | Google Graduate SWE, LFX Mentorship | LFX PRs merged, CNCF-grade open source visible. Google requires this signal. |

---

## 9. One-Page Summary — What You Need to Endure

### DSA (Document_from_Sam — All 205 Problems)

- **Level 1 (18 problems):** Foundation — arrays, hashing, recursion. Month 1. Non-negotiable for any OA.
- **Level 2 (75 problems):** Synthesis — BFS, DFS, Binary Search, BST, Heaps, Sliding Window. Months 2–3. This is 80% of Bangalore OAs.
- **Level 3 (112 problems):** Optimization — DP, Segment Trees, Monotonic Stack, Tries, Advanced Graph. Months 5–8. Required for Google and Rippling.
- **Level 4 (5 problems):** Expert — Paxos, Raft, Vector Clocks, Gossip, Distributed Locking. Month 9. Uber/Google architecture rounds.

### Backend Depth (Your Mastery Plan Stages 1–15)

- **Fundamentals:** HTTP, DNS, TCP, OS, Linux. Month 1. All companies test this in MCQs.
- **Go:** goroutines, channels, race detector, pprof. Month 3. Primary language for Uber/Zomato/DoorDash.
- **DBMS Deep:** PostgreSQL MVCC + EXPLAIN ANALYZE + isolation levels + PgBouncer. Month 5. The most tested area in Zomato/Swiggy rounds.
- **Distributed Systems:** Leader election, Saga, Fencing tokens, Consistent hashing, Bloom filters. Month 7. Uber/Rippling require this built in code.
- **Observability:** OTel traces + Prometheus + Grafana + pprof flame graphs. Month 6. Uber/DoorDash: on-call requires this from Week 1.
- **AI-Native Stack:** RAG, PGVector, function calling, Cursor.ai/Copilot daily. Month 8. 2026 requirement at every company.

### Projects (5 Repos + 8 Biweeklies)

- **OpenTrace** — distributed tracing system. 10M spans/sec. Self-instrumented. LFX application fodder.
- **PayCore** — financial ledger. Idempotency + double-entry + Saga. 5K TPS.
- **DungBeetle** — job platform. Leader election + exactly-once cron + monolith→event-driven.
- **BookWise** — seat reservation. 10K concurrent, 0 double-bookings. Fencing tokens.
- **RouteMaster** — logistics + notifications. Fan-out at scale + Elasticsearch + Bloom filter crawler.
- **8 Biweekly projects:** WAL, LSM-tree, TCP pool, WebSocket server, DNS resolver, SMTP server, OTP gateway, distributed lock service.

### Documentation (What Interviewers Actually Read)

- ADR for every major architecture decision across all 5 projects — linked from README.
- `BENCHMARKS.md` in every repo — p50/p95/p99 at target RPS, documented and dated.
- PITR runbook — DROP TABLE → restore → RTO < 10 min. Demonstrates production mindset.
- RFC for DungBeetle Node.js→Go migration — demonstrates communication is engineering.
- LFX cover letter + project proposal (ClickHouse plugin for Jaeger) — Month 9 deliverable.

---

> **The honest answer:** You are not missing anything from the Bangalore market requirements. Your Backend Mastery Plan covers every skill listed across all 8 companies. The only additions are company-specific sprints: 1 week of Java/Spring Boot for Adobe, 1 day of Flink overview for Rippling, 1 week of C++ DSA for Google. Everything else is already in the plan — you just need to execute it.
