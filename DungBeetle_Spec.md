# DungBeetle — Project Specification
## Background Job Processing Platform · Go-Heavy

**Primary Language:** Go (started as Node.js monolith — migration is the lesson)
**Stack:** Go · Kafka · PostgreSQL · Redis · gRPC · Next.js (frontend only) · Vercel AI SDK (frontend AI UI)
**Building Blocks:** `herald` (job failure alerts) · `vault` (job dedup) · `pgpool` (PG proxy) · `relay` (live job status) · `switchboard` (API gateway)

---

## 1. What It Is

A production-grade background job processing platform — the monolith-to-event-driven migration story. DungBeetle starts as a Node.js monolith (Month 1), gets rewritten in Go (Month 3), and evolves through exactly-once cron, leader election, Kafka-backed queues, and AI job orchestration. The migration RFC is a first-class deliverable. Every distributed systems pattern in the plan — leader election, exactly-once semantics, outbox, DLQ — gets built here.

**Why Go here:** Worker pools that spawn goroutines per job, `go test -race` for concurrent dispatch safety, `pprof` flame graphs for hot-loop optimisation, `goleak` for goroutine leak detection. The job queue's correctness depends on Go's memory model being respected — `sync.Mutex`, channels, and the race detector enforce this.

---

## 2. Stack Breakdown

| Layer | Technology | Depth Point |
|---|---|---|
| Backend API | Go + `chi` + `cobra` + `slog` | Signal handling, graceful drain, structured shutdown |
| Job workers | Go goroutines + `errgroup` + `semaphore` | Goroutine-per-job model, panic recovery, concurrency limits |
| Database | PostgreSQL + `sqlc` + `pgx/v5` | `SELECT FOR UPDATE SKIP LOCKED` job queue pattern |
| Kafka | `sarama` (Go) | Exactly-once job events, outbox pattern, consumer group |
| Leader election | Redis `SET NX EX` + Lua renewal | Only one node runs cron at a time |
| Cron | Go `robfig/cron` + distributed lock | Exactly-once cron — multiple nodes, single execution |
| DLQ | PostgreSQL `dlq` table | Failed jobs surfaced in dashboard, one-click retry |
| AI orchestration | Go backend + Vercel AI SDK (Next.js) | LLM-powered job classification and routing |
| Frontend | Next.js 15 (TypeScript) | Job dashboard, DLQ viewer, AI chat interface |
| Testing | `testing` + `testify` + `testcontainers-go` + `go test -race` | Correctness under concurrent dispatch |
| Observability | OTel Go SDK + `pprof` + Prometheus | Job latency histogram, DLQ depth gauge, goroutine count |
| CI | GitHub Actions | `go test -race` → `goleak` → `govulncheck` → benchmark → deploy |

---

## 3. Go Depth — Key Implementations

### Goroutine-Per-Job Worker Pool
```go
type WorkerPool struct {
    sem     chan struct{}  // semaphore: max concurrent jobs
    wg      sync.WaitGroup
    metrics *Metrics
}

func (p *WorkerPool) Dispatch(ctx context.Context, job Job) {
    p.sem <- struct{}{}  // acquire slot (blocks if pool full)
    p.wg.Add(1)
    go func() {
        defer func() {
            <-p.sem  // release slot
            p.wg.Done()
            if r := recover(); r != nil {
                p.metrics.panicTotal.Inc()
                moveToFailed(ctx, job, fmt.Sprintf("panic: %v", r))
            }
        }()
        if err := executeJob(ctx, job); err != nil {
            p.handleFailure(ctx, job, err)
        }
    }()
}

func (p *WorkerPool) GracefulShutdown(ctx context.Context) {
    // Stop accepting new jobs, wait for in-flight to complete
    done := make(chan struct{})
    go func() { p.wg.Wait(); close(done) }()
    select {
    case <-done:    // clean
    case <-ctx.Done(): log.Warn("shutdown timed out — some jobs may be requeued")
    }
}
```

### SELECT FOR UPDATE SKIP LOCKED (Job Queue)
```go
// Multiple workers competing for jobs — SKIP LOCKED means no blocking
const pickJobSQL = `
    UPDATE jobs
    SET    status = 'RUNNING', started_at = NOW(), worker_id = $1
    WHERE  id = (
        SELECT id FROM jobs
        WHERE  status = 'PENDING'
          AND  run_at <= NOW()
        ORDER BY priority DESC, run_at ASC
        FOR UPDATE SKIP LOCKED
        LIMIT 1
    )
    RETURNING id, type, payload
`
```

### Leader Election — Redis SETNX + Lua Renewal
```go
func (w *Node) TryBecomeLeader(ctx context.Context) bool {
    acquired, _ := w.redis.SetNX(ctx, "cron:leader", w.nodeID, 30*time.Second).Result()
    if !acquired { return false }

    go w.renewLease(ctx)
    return true
}

func (w *Node) renewLease(ctx context.Context) {
    // Atomic renewal: verify we still hold the lock before extending TTL
    renewScript := redis.NewScript(`
        if redis.call("get", KEYS[1]) == ARGV[1] then
            return redis.call("expire", KEYS[1], ARGV[2])
        end
        return 0
    `)
    ticker := time.NewTicker(10 * time.Second)
    defer ticker.Stop()
    for {
        select {
        case <-ticker.C:
            result, _ := renewScript.Run(ctx, w.redis, []string{"cron:leader"}, w.nodeID, "30").Int()
            if result == 0 { return }  // lost lock — another node took over
        case <-ctx.Done():
            return
        }
    }
}
```

### Exactly-Once Cron with Distributed Lock
```go
func (s *Scheduler) RunCron(ctx context.Context, jobName string, fn func(context.Context) error) {
    if !s.node.TryBecomeLeader(ctx) { return }  // only leader runs cron

    s.cron.AddFunc("@hourly", func() {
        // Distributed lock on the job name prevents duplicate runs
        // even if leader changes between cron ticks
        lockKey := fmt.Sprintf("cron:lock:%s:%s", jobName, time.Now().Format("2006-01-02-15"))
        acquired, _ := s.redis.SetNX(ctx, lockKey, s.node.nodeID, 2*time.Hour).Result()
        if !acquired { return }  // already ran this hour

        ctx, span := tracer.Start(ctx, "cron."+jobName)
        defer span.End()
        if err := fn(ctx); err != nil {
            span.RecordError(err)
        }
    })
}
```

### Exponential Backoff with Jitter (DLQ)
```go
func (w *Worker) handleFailure(ctx context.Context, job Job, err error) {
    attempts := job.Attempts + 1
    if attempts >= job.MaxAttempts {
        moveToDLQ(ctx, job, err)  // exhausted retries → DLQ
        herald.Notify(ctx, job.OwnerID, "job_failed", job)  // alert via herald building block
        return
    }

    // Exponential backoff: 1s, 2s, 4s, 8s... cap at 30s
    base := time.Duration(1<<uint(attempts)) * time.Second
    base = min(base, 30*time.Second)
    jitter := time.Duration(rand.Int63n(int64(base / 4)))  // ±25% jitter

    updateJobRetry(ctx, job.ID, attempts, time.Now().Add(base+jitter))
}
```

### Kafka Outbox (Exactly-Once Job Events)
```go
func (s *Store) EnqueueJob(ctx context.Context, job Job) error {
    return s.db.WithTx(ctx, func(tx *Queries) error {
        if err := tx.InsertJob(ctx, job); err != nil { return err }
        // Write to outbox in same transaction — Kafka publish guaranteed
        return tx.InsertOutbox(ctx, OutboxRow{
            Topic:   "jobs.enqueued",
            Payload: mustMarshal(JobEnqueuedEvent{JobID: job.ID, Type: job.Type}),
        })
    })
}
```

---

## 4. AI Job Orchestration (Month 8)

```go
// Go backend: AI job router — classifies and routes jobs using LLM
type AIJobRouter struct {
    client *openai.Client
    routes map[string]JobHandler
}

func (r *AIJobRouter) Route(ctx context.Context, job Job) error {
    // Ask LLM to classify the job based on payload
    resp, _ := r.client.CreateChatCompletion(ctx, openai.ChatCompletionRequest{
        Model: "gpt-4o-mini",
        Messages: []openai.ChatCompletionMessage{{
            Role: "user", Content: fmt.Sprintf("Classify this job: %s\nPayload: %s", job.Type, job.Payload),
        }},
        Tools: jobClassificationTools,
    })
    classification := parseToolCall(resp)
    return r.routes[classification.Handler].Execute(ctx, job)
}
```

```typescript
// Next.js AI chat interface — Vercel AI SDK for streaming LLM responses
'use client';
import { useChat } from 'ai/react';

export function JobCopilot() {
  const { messages, input, handleSubmit } = useChat({ api: '/api/copilot' });
  // "Why is job X failing?" → LLM reads job logs + DLQ, explains root cause
}
```

---

## 5. Monolith → Event-Driven Migration (The RFC)

The migration RFC is a first-class deliverable. It documents:
- DungBeetle v0.1: Node.js monolith, synchronous job dispatch, PostgreSQL queue
- DungBeetle v1.0: Go rewrite, goroutine-per-job, `go test -race` passing
- DungBeetle v2.0: Kafka-backed queue replaces PostgreSQL polling
- DungBeetle v3.0: Leader election, exactly-once cron, distributed across N nodes

Each version is a branch in the repo with its own `BENCHMARKS.md` — before/after numbers for every migration step.

---

## 6. Features by Month

| Month | Feature | Concept |
|---|---|---|
| 1 | Node.js monolith — HTTP job queue, PostgreSQL backing | Node.js, `SELECT FOR UPDATE SKIP LOCKED` |
| 2 | HMAC webhook delivery, `AsyncLocalStorage` context | Webhook security, Node.js context |
| 3 | Go rewrite — goroutine-per-job, `go test -race`, RFC written | Go concurrency, migration ADR |
| 4 | Next.js dashboard — job list, DLQ viewer, live status via `relay` | React, Shadcn DataTable |
| 5 | Kafka queue replaces DB polling, outbox pattern | Exactly-once, Kafka |
| 6 | Leader election, exactly-once cron | Redis SETNX, split-brain test |
| 7 | Consistent hashing for job routing, Bloom filter dedup | Distributed systems |
| 8 | AI job orchestration (Go router + Next.js copilot UI) | LLM tool use, Vercel AI SDK |

---

## 7. Non-Negotiable Rules

- `go test -race ./...` — concurrent job dispatch to same job must be detected
- `goleak.VerifyNone(t)` — worker goroutines must exit on graceful shutdown
- Leader election split-brain test: pause renewal `TTL+1s`, verify new leader wins
- Exactly-once cron verified: N nodes running, single execution per interval
- Outbox crash test: kill between DB write and Kafka publish, verify recovery
- Migration RFC written before v1.0 tag — documents why Go over Node.js with numbers

---

## 8. Benchmarks

| Metric | Target |
|---|---|
| Job throughput | 50K jobs/min |
| Worker pick-up latency p99 | < 50ms |
| Leader election after failure | < 30s (1 TTL window) |
| Cron exactly-once across 5 nodes | 1 execution per interval, verified |
| Kafka consumer lag at peak | < 500 messages |
