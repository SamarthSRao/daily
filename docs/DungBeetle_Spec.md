# DungBeetle — Project Specification
## Background Job Processing Platform

**Role:** Background Job Processing Platform  
**Stack:** Go · Kafka · PostgreSQL · Redis · gRPC · Next.js

---

## 1. Project Overview

DungBeetle is a production-grade background job processing platform built in Go, demonstrating leader election, exactly-once distributed cron, monolith-to-event-driven migration, and Kafka-backed job queues at scale. It begins as a Node.js monolith and is rewritten in Go — the RFC documenting the migration decision is a key deliverable. DungBeetle independently consumes job payloads from PayCore, RouteMaster, and BookWise.

---

## 2. Key Demonstrations

- Leader election via Redis SET NX — only one node runs cron at a time
- Exactly-once cron — distributed lock prevents duplicate job scheduling
- Monolith → event-driven migration with written ADR and benchmark comparison
- Kafka-backed job queues with DLQ and exponential backoff
- Retry-with-DLQ pattern — failed jobs surfaced in UI dashboard
- AI job orchestration — LLM-powered job classification and routing

---

## 3. Architecture

| Component | Technology | Responsibility |
|---|---|---|
| Job API | Go + chi + gRPC | Job submission, status queries, webhook callbacks |
| Worker Pool | Go goroutines + Kafka | Job execution, concurrency control, panic recovery |
| Scheduler | Go + Redis SETNX | Exactly-once cron, distributed leader election |
| DLQ Manager | Go + PostgreSQL | Dead-letter queue, retry policies, failure dashboard |
| Event Bus | Kafka + Outbox | Job lifecycle events, inter-service job dispatch |
| Frontend | Next.js + Shadcn UI | Job dashboard, DLQ viewer, live status feed |

---

## 4. Technical Depth

### Leader Election — Redis SETNX

Only one DungBeetle node should schedule cron jobs at any moment. Leader election uses `Redis SET NX EX`: the node that wins the SET becomes leader and holds the lock for 30 seconds. All nodes attempt renewal every 10 seconds. If the leader dies, the lock expires and a new leader is elected within one TTL window. Split-brain scenario tested: both nodes simultaneously try to become leader — only one wins.

### Exactly-Once Cron

A distributed lock on the cron job ID prevents duplicate scheduling across cluster nodes. When the cron fires, the scheduler atomically checks-and-sets a Redis key with the scheduled run ID. If the key already exists (another node fired first), the schedule is skipped. The result: exactly one execution per scheduled interval, even with N running nodes.

### Monolith to Event-Driven Migration

DungBeetle v0.1 is a Node.js monolith. The v1.0 Go rewrite extracts the job worker into a separate Kafka consumer. The migration RFC documents: why Go over Node.js for CPU-bound workers, goroutine-per-job model vs thread pool, `go test -race` coverage, benchmark comparison before/after. The migration demonstrates understanding of when and why to move from a monolith to event-driven.

### Retry Policy with Dead-Letter Queue

Failed jobs retry with exponential backoff: 1s, 2s, 4s, 8s, up to `max_retries` (configurable per job type). After max retries, the job moves to the DLQ table with the last error payload and full retry history. The UI dashboard surfaces all DLQ entries with one-click re-queue.

---

## 5. Data Model

- `jobs (id, type, payload JSONB, status, priority, run_at, attempts, max_attempts, created_at)`
- `job_events (id, job_id, event_type, metadata JSONB, created_at)`
- `dlq (id, job_id, error, retry_history JSONB, moved_at)`
- `cron_schedules (id, name, cron_expr, last_run, next_run, lock_key)`
- `outbox (id, topic, payload, published_at)`

---

## 6. Benchmarks

| Metric | Result |
|---|---|
| Job throughput | 50,000 jobs/min (k6, 100 concurrent submitters) |
| Worker pick-up latency p99 | < 50ms from enqueue to execution start |
| Leader election time | < 30s (one TTL window after leader failure) |
| DLQ move latency | < 5ms after max retries exceeded |
| Cron scheduling precision | ± 1s of scheduled time |

---

## 7. Non-Negotiable Rules

- `go test -race ./...` passes — concurrent job dispatch must be safe
- `goleak.VerifyNone(t)` — goroutine leaks in the worker pool accumulate over days
- Leader election split-brain scenario tested and verified
- Cron exactly-once semantics verified: N nodes, single execution per interval
- DLQ: crash between enqueue and Kafka publish tested, recovery verified
- Migration RFC written: Node.js monolith → Go event-driven, with benchmark numbers

---

## 8. Infraspec Requirement Mapping

| Infraspec Requirement | How This Project Delivers It |
|---|---|
| Event-driven architecture | Kafka-backed queues, outbox pattern, Saga choreography |
| Distributed systems depth | Leader election, distributed cron, fencing tokens |
| Monolith vs microservices | Written ADR with benchmark comparison |
| AI tools for development | AI job classification and routing built in |
| RFCs and decision documents | Migration RFC + every architecture decision documented |
