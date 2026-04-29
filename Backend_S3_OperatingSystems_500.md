# Backend Engineering — Section 3: Operating Systems
### 500 Questions | Processes · Threads · Memory · File I/O · Linux Internals · Go Runtime
> Mapped to Backend 2026 Roadmap Stage 4 | Infraspec Target
> Tagged: [CONCEPT] [CODE] [DEBUG] [TRADEOFF] [APPLY]
> Levels: {L1} must know · {L2} mid/senior · {L3} staff/kernel

---

# PART A — Processes (Q1–Q80)

---

## Process Fundamentals (Q1–Q40)

1. `[CONCEPT]` `{L1}` What is a process? What is the difference between a program (static binary) and a process (running instance)?
2. `[CONCEPT]` `{L1}` What is a PCB (Process Control Block)? What information does the kernel store for each process?
3. `[CONCEPT]` `{L1}` What are process states: running, ready, blocked, zombie, stopped? What transitions exist between them?
4. `[CONCEPT]` `{L1}` What is `fork()`? What is copied and what is shared between parent and child after a fork?
5. `[CONCEPT]` `{L2}` What is copy-on-write (COW) in the context of `fork()`? Why does it make `fork()` fast for large processes?
6. `[CONCEPT]` `{L1}` What is `exec()`? What does `fork() + exec()` accomplish? What happens to the process's address space?
7. `[CONCEPT]` `{L1}` What is a zombie process? What causes it? How do you prevent zombie accumulation in a Go parent process?
8. `[CONCEPT]` `{L1}` What is an orphan process? What happens to orphans on Linux (adopted by init/systemd)?
9. `[CODE]` `{L2}` Write a Go program that forks a child process using `os/exec`, waits for it to complete, and correctly reaps it. What happens if you don't call `Wait()`?
10. `[CONCEPT]` `{L2}` What is a process group? What is a session? How does `SIGHUP` relate to terminal disconnection?
11. `[CONCEPT]` `{L1}` What is context switching? What state is saved and restored? What is the typical CPU cost of a context switch?
12. `[CONCEPT]` `{L2}` What is the cost of context switching in microseconds on a modern Linux kernel? How does this affect OpenTrace Collector's performance with 10K concurrent goroutines?
13. `[CONCEPT]` `{L2}` What is a process address space? What are the segments: text (code), data, BSS, heap, stack?
14. `[CONCEPT]` `{L2}` What is the difference between the kernel address space and the user address space? What is the kernel/user mode boundary?
15. `[CONCEPT]` `{L1}` What are signals? Name 10 important signals: SIGTERM, SIGKILL, SIGINT, SIGPIPE, SIGSEGV, SIGCHLD, SIGHUP, SIGUSR1, SIGUSR2, SIGALRM. Which cannot be caught?
16. `[CONCEPT]` `{L1}` What is `SIGPIPE`? When does OpenTrace Collector receive it? What is the default handler? Why must backend services ignore it?
17. `[CODE]` `{L1}` Implement graceful shutdown in Go: `signal.Notify(sigCh, syscall.SIGTERM, syscall.SIGINT)`, wait for signal, drain in-flight spans, close Kafka producer, exit 0.
18. `[CONCEPT]` `{L2}` What is `SIGTERM` vs `SIGKILL`? What is the difference in how Kubernetes uses them during pod termination?
19. `[CODE]` `{L2}` Add SIGTERM handler to OpenTrace Collector: stop accepting new gRPC connections, set a 30s deadline for draining, log remaining in-flight count every 5s, then exit.
20. `[CONCEPT]` `{L2}` What is `SIGUSR1` and `SIGUSR2`? How does OpenTrace use `SIGUSR1` to trigger a live configuration reload without restart?
21. `[CODE]` `{L2}` Implement live config reload in OpenTrace using `SIGUSR1`: `signal.Notify(sigCh, syscall.SIGUSR1)`, on receipt reload config file, apply new rate limits atomically.
22. `[CONCEPT]` `{L2}` What is a signal mask? What is signal blocking? How does Go's runtime handle signals internally?
23. `[CONCEPT]` `{L2}` What is `/proc/<pid>/status`? Name 8 useful fields: VmRSS, VmSize, Threads, State, PPid, Uid, voluntary_ctxt_switches, nonvoluntary_ctxt_switches.
24. `[CODE]` `{L2}` Read OpenTrace Collector's `/proc/self/status` in Go: parse VmRSS, Threads, voluntary context switches. Export as Prometheus gauge metrics.
25. `[CONCEPT]` `{L2}` What is `strace`? How do you use `strace -p <pid>` to see what system calls OpenTrace Collector is making during a slow period?
26. `[CODE]` `{L2}` Use `strace -p $(pgrep openTrace-collector) -e trace=network -c` to count network syscalls. What does `epoll_wait` count tell you about I/O patterns?
27. `[CONCEPT]` `{L2}` What is `ltrace`? How does it differ from `strace`? When would you use it for OpenTrace debugging?
28. `[CONCEPT]` `{L2}` What is a file descriptor? What is the default file descriptor limit (ulimit -n)? What happens when OpenTrace Collector hits the limit?
29. `[CONCEPT]` `{L1}` What does `ulimit -n` control? How do you increase it for OpenTrace Collector to support 100K concurrent WebSocket connections?
30. `[CODE]` `{L2}` Configure file descriptor limits for OpenTrace in Kubernetes: set `ulimit -n 1048576` via container `securityContext.sysctls` or `/proc/sys/fs/nr_open`.
31. `[CONCEPT]` `{L2}` What is `/proc/<pid>/fd/`? How do you see all file descriptors held by OpenTrace Collector, including TCP sockets and Kafka connections?
32. `[CODE]` `{L2}` Use `ls -la /proc/$(pgrep openTrace-collector)/fd | wc -l` to count OpenTrace's open file descriptors. What values are normal vs alarming?
33. `[CONCEPT]` `{L2}` What is `lsof`? Give three production debugging scenarios where `lsof -p <pid>` helps diagnose OpenTrace issues.
34. `[DEBUG]` `{L2}` OpenTrace Collector starts failing to open new connections with `too many open files`. How do you diagnose: `lsof -p <pid> | wc -l`, `ulimit -n`, `/proc/<pid>/limits`. What are the causes?
35. `[CONCEPT]` `{L2}` What is a process namespace in Linux? How does Docker use namespaces (PID, NET, MNT, UTS, IPC, USER) to isolate containers?
36. `[CONCEPT]` `{L2}` What is a cgroup (control group)? How does Kubernetes use cgroups to enforce CPU and memory limits on OpenTrace Collector pods?
37. `[CONCEPT]` `{L2}` What is OOM (Out of Memory) killer? How does the kernel choose which process to kill? How does the `oom_score_adj` setting affect OpenTrace's kill priority?
38. `[CODE]` `{L2}` Set OpenTrace Collector's OOM score to -500: `echo -500 > /proc/$(pgrep openTrace-collector)/oom_score_adj`. This protects it from being killed during memory pressure.
39. `[CONCEPT]` `{L2}` What is `dmesg`? Give three scenarios where you'd check it for OpenTrace: OOM kills, network errors, disk I/O errors.
40. `[CODE]` `{L2}` Run `dmesg | grep -E "OOM|oom|killed"` to find if OpenTrace has been OOM killed. What is the `oom-kill-event` format? What is the `task->mm->rss`?

---

## Advanced Process Topics (Q41–Q80)

41. `[CONCEPT]` `{L2}` What is an environment variable? How does OpenTrace read its configuration from environment variables (`os.Getenv`)? What is the security risk of putting secrets in env vars?
42. `[CODE]` `{L2}` Implement structured config loading for OpenTrace: read from env vars first, fallback to config file, validate required fields, fail fast with descriptive error on missing required config.
43. `[CONCEPT]` `{L2}` What is `/proc/self/cmdline`? What is `/proc/self/exe`? How do you read the running process's own binary path in Go?
44. `[CODE]` `{L2}` Read OpenTrace Collector's command line arguments from `/proc/self/cmdline`: split on null bytes, log on startup for debugging.
45. `[CONCEPT]` `{L2}` What is `ptrace`? How does `gdb` use it to attach to a running process? How does `strace` use it to intercept syscalls?
46. `[CONCEPT]` `{L2}` What is process affinity (CPU affinity)? How do you pin OpenTrace Collector to specific CPU cores using `taskset` to reduce cache misses?
47. `[CODE]` `{L2}` Use `taskset -c 0-3 openTrace-collector` to pin OpenTrace to cores 0-3. When is CPU affinity beneficial vs harmful for Go programs?
48. `[CONCEPT]` `{L2}` What is NUMA (Non-Uniform Memory Access)? How does NUMA topology affect OpenTrace Collector's memory allocation on a dual-socket server?
49. `[CONCEPT]` `{L2}` What is `nice` and `renice`? How do you lower OpenTrace's background batch export process priority to avoid competing with the real-time span ingestion?
50. `[CODE]` `{L2}` Start OpenTrace's background export with lower priority: `nice -n 10 openTrace-export-batch`. How does `ionice` complement this for I/O priority?
51. `[CONCEPT]` `{L2}` What is a daemon process? How does OpenTrace Collector run as a daemon in Kubernetes (no daemonization needed, Kubernetes manages it)?
52. `[CONCEPT]` `{L2}` What is `systemd`? How would you write a systemd service unit for OpenTrace Collector on a bare-metal deployment?
53. `[CODE]` `{L2}` Write a systemd service file for OpenTrace Collector: `[Service] ExecStart=/usr/bin/openTrace-collector serve`, `Restart=always`, `RestartSec=5`, `LimitNOFILE=1048576`, `EnvironmentFile=/etc/openTrace/env`.
54. `[CONCEPT]` `{L2}` What is `journalctl`? How do you follow OpenTrace Collector's logs in real-time: `journalctl -u openTrace-collector -f`?
55. `[CONCEPT]` `{L2}` What is process isolation? How does Kubernetes's `securityContext` with `runAsNonRoot: true`, `readOnlyRootFilesystem: true`, `allowPrivilegeEscalation: false` harden OpenTrace?
56. `[CODE]` `{L2}` Add security context to OpenTrace's Kubernetes pod spec: `runAsUser: 65534`, `runAsNonRoot: true`, `readOnlyRootFilesystem: true`, `allowPrivilegeEscalation: false`, `capabilities: drop: [ALL]`.
57. `[CONCEPT]` `{L3}` What is seccomp (Secure Computing Mode)? How does it restrict which syscalls OpenTrace Collector can make? What is the Docker default seccomp profile?
58. `[CODE]` `{L3}` Create a minimal seccomp profile for OpenTrace Collector: allow only `read, write, open, close, stat, epoll_wait, accept4, sendto, recvfrom, clock_gettime, futex, mmap, munmap, exit`. Deny everything else.
59. `[CONCEPT]` `{L3}` What is AppArmor? How does it profile OpenTrace Collector's allowed file paths, network operations, and capabilities?
60. `[CONCEPT]` `{L2}` What is a capability in Linux? How does `CAP_NET_BIND_SERVICE` allow OpenTrace Collector to bind to port 443 without running as root?
61. `[CODE]` `{L2}` Grant OpenTrace Collector `CAP_NET_BIND_SERVICE` only: `setcap cap_net_bind_service=+ep /usr/bin/openTrace-collector`. Verify with `getcap`.
62. `[CONCEPT]` `{L2}` What is `/proc/loadavg`? What does the 1/5/15-minute load average represent? What is a "good" load average for OpenTrace's 8-core server?
63. `[CODE]` `{L2}` Read and expose `/proc/loadavg` as a Prometheus metric in OpenTrace's system health exporter. Alert if 5-minute load average > number of CPU cores × 2.
64. `[CONCEPT]` `{L2}` What is `/proc/stat`? What are the CPU time fields: user, nice, system, idle, iowait, irq, softirq, steal? How do you calculate CPU usage percentage?
65. `[CODE]` `{L2}` Calculate OpenTrace host CPU usage from `/proc/stat`: read two samples 1 second apart, compute `(total - idle) / total × 100`. Export as Prometheus gauge.
66. `[CONCEPT]` `{L2}` What is `/proc/meminfo`? What are MemTotal, MemFree, MemAvailable, Buffers, Cached, SwapTotal, SwapFree?
67. `[CODE]` `{L2}` Parse `/proc/meminfo` in Go: read MemAvailable, compare to MemTotal, alert if available < 10% of total. This is more accurate than MemFree + Buffers + Cached.
68. `[CONCEPT]` `{L2}` What is the difference between MemFree and MemAvailable in `/proc/meminfo`? Why does Kubernetes use MemAvailable for eviction decisions?
69. `[CONCEPT]` `{L3}` What is a process scheduler? What scheduling algorithms does Linux use: CFS (Completely Fair Scheduler), SCHED_FIFO, SCHED_RR? What is vruntime?
70. `[CONCEPT]` `{L3}` What is CFS (Completely Fair Scheduler)? How does it use a red-black tree of vruntime values to select the next process to run?
71. `[CONCEPT]` `{L2}` What is CPU throttling in Kubernetes? When does a pod get throttled (CPU usage exceeds `cpu.limits`)? How does it affect OpenTrace Collector's p99 latency?
72. `[DEBUG]` `{L2}` OpenTrace Collector has good average CPU usage (30%) but high p99 latency (500ms). Kubernetes metrics show CPU throttling. What is the fix? (Raise cpu.limits or remove them)
73. `[CONCEPT]` `{L2}` What is `perf` tool? How do you use `perf top` to find the hottest functions in OpenTrace Collector in real-time?
74. `[CODE]` `{L2}` Run `perf stat -p $(pgrep openTrace-collector) sleep 10` to get OpenTrace's hardware performance counters: instructions, cache-misses, branch-misses. What is the cache miss rate?
75. `[CONCEPT]` `{L3}` What is `perf record + perf report`? How do you generate a kernel-level flame graph of OpenTrace Collector to find CPU hotspots invisible to `pprof`?
76. `[CONCEPT]` `{L2}` What is `/proc/<pid>/maps`? How do you see all memory-mapped regions (code, heap, stack, mmap'd files) for OpenTrace Collector?
77. `[CODE]` `{L2}` Parse `/proc/self/maps` in Go to find all memory-mapped regions. Calculate total heap size from `[heap]` region. Alert if heap > 800MB.
78. `[CONCEPT]` `{L2}` What is `vsz` vs `rss` in `ps aux`? Which is more meaningful for OpenTrace's memory monitoring? What does `SHR` (shared memory) represent?
79. `[CODE]` `{L2}` Export OpenTrace Collector's RSS and VSZ as Prometheus metrics by parsing `/proc/self/statm`. Alert if RSS > 900MB (near Kubernetes memory limit of 1GB).
80. `[DEBUG]` `{L2}` OpenTrace Collector is using 900MB RSS but should use < 400MB. How do you investigate: Go pprof heap profile, `/proc/<pid>/smaps` for detailed memory breakdown, goroutine stack analysis?

---

# PART B — Threads, Goroutines & Concurrency (Q81–Q180)

---

## OS Threads vs Goroutines (Q81–Q120)

81. `[CONCEPT]` `{L1}` What is a thread? How does it differ from a process (shares address space, file descriptors, heap)?
82. `[CONCEPT]` `{L1}` What is a kernel thread vs a user-space thread (green thread)? What is the M:N threading model?
83. `[CONCEPT]` `{L1}` What is Go's goroutine? Why does it start with ~2KB stack vs OS thread's 1-8MB? How does stack growth work (contiguous stack doubling)?
84. `[CONCEPT]` `{L2}` What is `GOMAXPROCS`? What is its default value in Go 1.21+? What happens if you set it to 1 in OpenTrace Collector?
85. `[CONCEPT]` `{L2}` What is Go's work-stealing scheduler? How does it balance goroutines across GOMAXPROCS OS threads?
86. `[CONCEPT]` `{L2}` What is a P (logical processor) in Go's scheduler? What is an M (OS thread)? What is a G (goroutine)? Describe the M:P:G relationship.
87. `[CONCEPT]` `{L2}` What is goroutine preemption? When does Go preempt a goroutine? What is asynchronous preemption (Go 1.14+)?
88. `[CONCEPT]` `{L2}` What is a goroutine leak? Name 5 common patterns that cause goroutine leaks in OpenTrace Collector.
89. `[CODE]` `{L1}` Find and fix the goroutine leak:
    ```go
    ch := make(chan Result)
    go func() { ch <- expensiveOp() }()
    select {
    case <-ctx.Done(): return
    case r := <-ch: use(r)
    }
    ```
90. `[CODE]` `{L2}` Add `goleak.VerifyNone(t)` to all OpenTrace tests. What does the output look like when a goroutine is leaked in test teardown?
91. `[CONCEPT]` `{L2}` What is a goroutine dump? How do you get one from a running OpenTrace Collector: `GET /debug/pprof/goroutine?debug=2`? What do you look for?
92. `[CODE]` `{L2}` Parse a goroutine dump from OpenTrace Collector to find all goroutines blocked in `epoll_wait` (idle I/O), `channel receive` (waiting for work), and `sync.Mutex.Lock` (contention).
93. `[CONCEPT]` `{L2}` What is a `runtime.NumGoroutine()` metric? What is a healthy goroutine count for OpenTrace Collector serving 10K concurrent connections?
94. `[CODE]` `{L2}` Export `runtime.NumGoroutine()` as a Prometheus gauge in OpenTrace. Alert if goroutine count exceeds 50K (likely leak).
95. `[CONCEPT]` `{L2}` What is a `sync.WaitGroup`? What is the common mistake of calling `Add()` inside the goroutine instead of before launching it?
96. `[CODE]` `{L2}` Fix this WaitGroup bug:
    ```go
    var wg sync.WaitGroup
    for _, item := range items {
        go func(x Item) {
            wg.Add(1) // BUG: race with wg.Wait()
            defer wg.Done()
            process(x)
        }(item)
    }
    wg.Wait()
    ```
97. `[CONCEPT]` `{L2}` What is `errgroup.Group`? What does it add over `sync.WaitGroup`? How does OpenTrace use it for parallel startup of gRPC, HTTP, and Kafka components?
98. `[CODE]` `{L2}` Implement OpenTrace Collector startup with `errgroup`: start 3 goroutines (gRPC server, HTTP server, Kafka producer), if any fails cancel all others, return first error.
99. `[CONCEPT]` `{L2}` What is `sync.Once`? How does OpenTrace use it for lazy initialization of the Redis connection pool (only on first use)?
100. `[CODE]` `{L2}` Implement lazy Redis pool initialization for OpenTrace using `sync.Once`: the pool is created on first call to `getPool()`, subsequent calls reuse it without locking.
101. `[CONCEPT]` `{L2}` What is `sync.Pool`? What does it guarantee about object lifetime? How does OpenTrace use it to reuse Protobuf decoding buffers?
102. `[CODE]` `{L2}` Implement `sync.Pool` for span Protobuf buffers in OpenTrace: `pool.Get()` returns a `*proto.Span`, `pool.Put(span)` returns it. Reset state before `Put()`. Measure alloc reduction.
103. `[CONCEPT]` `{L2}` What is a Go channel? What is the difference between buffered and unbuffered channels? What is the "happens-before" guarantee?
104. `[CONCEPT]` `{L2}` What is a goroutine's stack frame? What is stack growth? What is stack copying (contiguous stack) in Go? How does it differ from segmented stacks?
105. `[CONCEPT]` `{L2}` What is `runtime.Gosched()`? When would you call it in OpenTrace to yield the CPU voluntarily to prevent one goroutine from starving others?
106. `[CODE]` `{L2}` Implement a CPU-bound goroutine in OpenTrace that calls `runtime.Gosched()` every 1000 iterations to allow other goroutines to run.
107. `[CONCEPT]` `{L2}` What is `runtime.LockOSThread()`? When does OpenTrace use it? (Example: CGO calls that require thread affinity for GPU or SIMD operations)
108. `[CONCEPT]` `{L3}` What is goroutine parking? What is goroutine unparking? How does Go's runtime efficiently wake a goroutine waiting on a channel without busy-spinning?
109. `[CONCEPT]` `{L3}` What is the Go runtime's timer implementation? What is `time.Sleep` doing at the OS level? How do 1M simultaneous `time.Sleep` calls in goroutines perform?
110. `[CODE]` `{L2}` Implement a rate limiter in OpenTrace using a ticker goroutine: `ticker := time.NewTicker(time.Second / rate)`, each span send waits for a tick. Test with 1000 goroutines.
111. `[CONCEPT]` `{L2}` What is a Go select statement? How does it handle multiple ready channels simultaneously? Is the selection random or deterministic?
112. `[CODE]` `{L2}` Implement a goroutine that handles: new span (work channel), heartbeat (ticker), shutdown (context done), and error (error channel) using `select`. Ensure all cases are properly handled.
113. `[CONCEPT]` `{L2}` What is the "fan-out, fan-in" pattern? How does OpenTrace's Processor use it to distribute span processing across 8 worker goroutines and collect results?
114. `[CODE]` `{L2}` Implement fan-out fan-in for OpenTrace: one input channel, 8 worker goroutines each reading from it, results collected into one output channel using `sync.WaitGroup`.
115. `[CONCEPT]` `{L2}` What is a pipeline pattern in Go? How does OpenTrace's processing pipeline: receive → validate → enrich → batch → flush use channels between stages?
116. `[CODE]` `{L2}` Implement a 4-stage pipeline for OpenTrace: `receive(ctx) <-chan *Span`, `validate(<-chan *Span) <-chan *Span`, `enrich(<-chan *Span) <-chan *Span`, `flush(<-chan *Span)`. Handle context cancellation.
117. `[CONCEPT]` `{L2}` What is the "done channel" pattern vs `context.Context` for cancellation? When does OpenTrace prefer context over done channels?
118. `[CODE]` `{L2}` Refactor OpenTrace's pipeline to use `context.Context` for cancellation: each stage checks `ctx.Done()` and propagates cancellation downstream.
119. `[CONCEPT]` `{L2}` What is backpressure in a Go channel pipeline? What happens when a downstream stage is slower than upstream (channel fills up)?
120. `[CODE]` `{L2}` Implement backpressure in OpenTrace's pipeline: when the batch channel is full (capacity 1000), apply a `select` with `default: drop()` in the validate stage. Expose drop rate as a metric.

---

## Synchronization Primitives (Q121–Q180)

121. `[CONCEPT]` `{L1}` What is a race condition? Give a concrete example with two goroutines incrementing a shared counter. What does the Go race detector catch?
122. `[CODE]` `{L1}` Write a simple race condition in Go:
    ```go
    count := 0
    go func() { count++ }()
    go func() { count++ }()
    ```
    Show what `go test -race` reports. Fix it.
123. `[CONCEPT]` `{L1}` What is a `sync.Mutex`? What is `sync.RWMutex`? When should you use each?
124. `[CODE]` `{L1}` Implement a thread-safe counter using `sync.Mutex`. Then implement it using `sync/atomic`. Compare the performance in a benchmark.
125. `[CODE]` `{L2}` Implement OpenTrace's connection registry using `sync.RWMutex`: many goroutines `RLock()` to fan-out spans, rarely `Lock()` when a connection is added/removed.
126. `[CONCEPT]` `{L2}` What is a deadlock? What are the four Coffman conditions? Give a concrete Go example with two goroutines and two mutexes.
127. `[CODE]` `{L2}` Create a deadlock in Go:
    ```go
    var mu1, mu2 sync.Mutex
    go func() { mu1.Lock(); mu2.Lock(); ... }()
    go func() { mu2.Lock(); mu1.Lock(); ... }()
    ```
    Fix it by establishing a consistent lock ordering.
128. `[CONCEPT]` `{L2}` What is a livelock? How does it differ from a deadlock? Give an example where two goroutines keep retrying and blocking each other.
129. `[CONCEPT]` `{L2}` What is starvation? How does Go's `sync.Mutex` prevent starvation since Go 1.9 (starvation mode)?
130. `[CONCEPT]` `{L2}` What is `sync/atomic`? What operations does it support: `AddInt64`, `CompareAndSwap`, `Load`, `Store`, `Swap`? When is it faster than a mutex?
131. `[CODE]` `{L2}` Use `atomic.Int64` for OpenTrace's span counter: increment on each received span, load for metrics scraping. Verify no race with `go test -race`.
132. `[CONCEPT]` `{L2}` What is false sharing in CPU caches? How does padding adjacent struct fields prevent it in OpenTrace's per-CPU counters?
133. `[CODE]` `{L3}` Implement a cache-line padded per-CPU counter for OpenTrace to eliminate false sharing:
    ```go
    type paddedCounter struct {
        sync.Mutex
        count int64
        _pad  [56]byte // pad to 64 bytes (cache line)
    }
    ```
134. `[CONCEPT]` `{L2}` What is `sync.Cond`? When is it appropriate vs using a channel? Give a use case in OpenTrace (wait until the Kafka producer buffer is drained).
135. `[CODE]` `{L2}` Implement a barrier using `sync.Cond` in OpenTrace: all goroutines wait at a barrier until the leader signals all-clear (e.g., Kafka partition assignment complete before starting consumption).
136. `[CONCEPT]` `{L2}` What is the Go memory model? What does "happens-before" mean? What are the synchronization guarantees of channels, mutexes, and sync/atomic?
137. `[CONCEPT]` `{L2}` What is a data race according to the Go memory model? Is a data race always a bug? (Yes — even benign-looking races are undefined behavior)
138. `[CODE]` `{L2}` Run `go test -race -count=100 ./...` on OpenTrace. Explain what `-count=100` adds vs `-count=1` for finding intermittent races.
139. `[CONCEPT]` `{L2}` What is `sync.Map`? When is it better than `map + sync.RWMutex`? When is it worse?
140. `[CODE]` `{L2}` Use `sync.Map` for OpenTrace's trace watcher registry: key = trace_id (string), value = `[]chan *Span`. Benchmark vs `map + sync.RWMutex` for the read-heavy access pattern.
141. `[CONCEPT]` `{L2}` What is the `singleflight` package? How does it collapse concurrent identical function calls into one execution?
142. `[CODE]` `{L2}` Implement `singleflight` for OpenTrace's trace query: `group.Do(traceId, func() (interface{}, error) { return queryClickHouse(traceId) })`. Multiple callers for same traceId share one query.
143. `[CONCEPT]` `{L2}` What is a `semaphore`? How do you implement it in Go using a buffered channel? When does OpenTrace use a semaphore to limit concurrent ClickHouse queries?
144. `[CODE]` `{L2}` Implement a semaphore for OpenTrace's ClickHouse query concurrency limit: `sem := make(chan struct{}, 50)`, `sem <- struct{}{}` to acquire, `<-sem` to release.
145. `[CONCEPT]` `{L2}` What is a `context.Context`? What are `WithCancel`, `WithTimeout`, `WithDeadline`? How does context cancellation prevent goroutine leaks in OpenTrace?
146. `[CODE]` `{L2}` Implement context propagation in OpenTrace: `ctx = context.WithValue(ctx, traceIDKey, traceID)`. Access in downstream: `ctx.Value(traceIDKey).(string)`. Pass to all DB and Kafka calls.
147. `[CONCEPT]` `{L2}` What is context cancellation propagation? If a parent context is cancelled, how does it cascade to child contexts in OpenTrace's call chain?
148. `[CODE]` `{L2}` Implement a cancellable ClickHouse query in OpenTrace: `query.QueryContext(ctx, sql)`. Verify that cancelling `ctx` sends a cancel command to ClickHouse over the wire.
149. `[CONCEPT]` `{L2}` What is `context.WithoutCancel` (Go 1.21)? When does OpenTrace use it to start a background goroutine that outlives the request context?
150. `[CODE]` `{L2}` Use `context.WithoutCancel` in OpenTrace to start a background cache refresh: the request context is cancelled when the client disconnects, but the cache refresh must complete.
151. `[CONCEPT]` `{L2}` What is the "context key type" pattern? Why should you use a private type as a context key instead of a string?
152. `[CODE]` `{L2}` Define context keys for OpenTrace as private types:
    ```go
    type contextKey string
    const traceIDKey contextKey = "trace_id"
    ```
    This prevents key collisions across packages.
153. `[CONCEPT]` `{L2}` What is the `golang.org/x/sync/errgroup` package? How does it differ from `sync.WaitGroup` for concurrent error handling?
154. `[CODE]` `{L2}` Use `errgroup.WithContext` for OpenTrace's parallel data fetch: query ClickHouse AND PostgreSQL concurrently, return first error, cancel the other on error.
155. `[CONCEPT]` `{L2}` What is a "happens-before" guarantee for Go channels? A send on a channel happens-before the corresponding receive from that channel completes.
156. `[CODE]` `{L2}` Demonstrate the channel synchronization guarantee: sending an initial value (setup) on a channel before receiving (use) ensures the receiver sees the correct state.
157. `[CONCEPT]` `{L2}` What is a `time.Ticker`? What is `time.Timer`? What is the common mistake with `time.After` in a `select` loop (creating a new timer every iteration, GC pressure)?
158. `[CODE]` `{L2}` Fix the `time.After` leak in OpenTrace's heartbeat loop:
    ```go
    // BAD: creates new timer every iteration
    select {
    case <-time.After(30 * time.Second):
    case <-ctx.Done():
    }
    // GOOD: reuse ticker
    ticker := time.NewTicker(30 * time.Second)
    defer ticker.Stop()
    ```
159. `[CONCEPT]` `{L2}` What is a worker pool pattern? How does OpenTrace's Span Processor use a fixed pool of 8 workers to control ClickHouse concurrency?
160. `[CODE]` `{L2}` Implement a worker pool for OpenTrace: `N = 8` workers, each reading from a shared `spanCh chan *Span`, processing and writing to ClickHouse. Bounded by N concurrent DB connections.
161. `[CONCEPT]` `{L2}` What is a lock-free data structure? Why is lock-free preferred in OpenTrace's hot path? What are the tradeoffs (complexity, ABA problem)?
162. `[CODE]` `{L2}` Implement a lock-free span counter using `atomic.Int64` in OpenTrace. Compare performance vs `sync.Mutex` counter using `go test -bench -benchmem`.
163. `[CONCEPT]` `{L2}` What is the ABA problem in lock-free programming? How does Go's `atomic.CompareAndSwap` have this problem and when does it matter?
164. `[CONCEPT]` `{L3}` What is a memory barrier? What is `atomic.StoreInt32` vs a normal store? How does the Go runtime use memory barriers to implement channel operations?
165. `[CONCEPT]` `{L3}` What is the MESI cache coherence protocol? How does it ensure that after an `atomic.Store` on CPU 0, CPU 1 sees the new value on the next `atomic.Load`?
166. `[CONCEPT]` `{L2}` What is the `unsafe` package in Go? When does OpenTrace use it for performance (zero-copy string to bytes conversion)?
167. `[CODE]` `{L2}` Implement zero-copy `string` to `[]byte` conversion in Go using `unsafe.Slice` and `unsafe.StringData`. Verify correctness and measure allocation savings.
168. `[CONCEPT]` `{L2}` What is the `internal` package in Go? How does OpenTrace use it to expose types shared between subpackages without making them part of the public API?
169. `[CONCEPT]` `{L2}` What is the `go:linkname` directive? When is it used? Why is it dangerous?
170. `[CONCEPT]` `{L3}` What is goroutine local storage in Go? (It doesn't exist — why was this a deliberate design decision?) What does `context.Context` provide instead?
171. `[CONCEPT]` `{L2}` What is `runtime.GOMAXPROCS(0)` (read-only)? How does OpenTrace Collector automatically tune itself to use all available CPUs?
172. `[CODE]` `{L2}` Log OpenTrace Collector's GOMAXPROCS on startup: `log.Info("runtime", "GOMAXPROCS", runtime.GOMAXPROCS(0), "NumCPU", runtime.NumCPU())`. They should match.
173. `[CONCEPT]` `{L2}` What is a goroutine's stack trace? How do you get individual goroutine stack traces from `GET /debug/pprof/goroutine?debug=1` in OpenTrace?
174. `[CODE]` `{L2}` Parse the goroutine dump from OpenTrace to count goroutines by state: running, IO wait, chan send, chan receive, select, Mutex.Lock. Use regex on the `debug=2` output.
175. `[CONCEPT]` `{L2}` What is `runtime.Stack(buf, all)`? How does OpenTrace use it to log all goroutine stacks when it receives SIGUSR2 (for live debugging without pprof endpoint)?
176. `[CODE]` `{L2}` Add SIGUSR2 handler to OpenTrace: dump all goroutine stacks to a file `/tmp/goroutines-$(date).txt` when the signal is received. Useful for debugging deadlocks in production.
177. `[CONCEPT]` `{L2}` What is `runtime.ReadMemStats`? What are HeapAlloc, HeapIdle, HeapInuse, HeapReleased, StackInuse, NumGC, PauseNs? Which does OpenTrace export as metrics?
178. `[CODE]` `{L2}` Export Go runtime memory stats as Prometheus metrics in OpenTrace: use `prometheus/go_collector` which handles `runtime.ReadMemStats` automatically. List 10 key metrics it provides.
179. `[CONCEPT]` `{L2}` What is the difference between `heap inuse` and `heap alloc` in Go's memory stats? `HeapInuse` includes objects waiting to be reused (not yet GC'd), `HeapAlloc` is live objects only.
180. `[DEBUG]` `{L2}` OpenTrace Collector's `HeapInuse` is 2GB but `HeapAlloc` is only 200MB. What does this indicate? How do you force GC to reclaim idle heap spans with `runtime.GC()` or `debug.FreeOSMemory()`?

---

# PART C — Memory Management (Q181–Q280)

---

## Virtual Memory & Memory Layout (Q181–Q220)

181. `[CONCEPT]` `{L1}` What is virtual memory? Why does every process think it has the entire address space?
182. `[CONCEPT]` `{L1}` What is a page? What is the default page size on Linux (4KB)? What is a huge page (2MB, 1GB)?
183. `[CONCEPT]` `{L2}` What is a page table? What is a TLB (Translation Lookaside Buffer)? What happens on a TLB miss?
184. `[CONCEPT]` `{L2}` What is a page fault? What is a minor page fault vs a major page fault? Which is more expensive?
185. `[CONCEPT]` `{L2}` What is demand paging? How does the OS defer allocating physical memory until the process actually touches the page?
186. `[CONCEPT]` `{L2}` What is `mmap()`? How do databases and ClickHouse use it to map data files into memory? What are the benefits vs read()?
187. `[CONCEPT]` `{L2}` What is the page cache in Linux? How does it allow sequential file reads to be served from RAM after the first access?
188. `[CONCEPT]` `{L2}` What is `mlock()`? Why do databases like PostgreSQL use it to prevent the buffer pool from being swapped out to disk?
189. `[CONCEPT]` `{L2}` What is swapping? What is swap space? Why do production Kubernetes nodes disable swap (`swapoff -a`)?
190. `[CONCEPT]` `{L2}` What is `vm.swappiness`? What value should it be set to for OpenTrace's ClickHouse node (0-10, minimize swapping, keep data in RAM)?
191. `[CONCEPT]` `{L2}` What is `transparent huge pages (THP)`? Why does ClickHouse recommend disabling THP (`echo never > /sys/kernel/mm/transparent_hugepage/enabled`)?
192. `[CODE]` `{L2}` Add to OpenTrace's startup script: check `cat /sys/kernel/mm/transparent_hugepage/enabled` and warn if THP is not set to `never` for ClickHouse nodes.
193. `[CONCEPT]` `{L2}` What is the RSS (Resident Set Size) vs VSZ (Virtual Set Size) of a process? Which is more meaningful for alerting on OpenTrace Collector's memory usage?
194. `[CODE]` `{L2}` Read OpenTrace Collector's RSS from `/proc/self/statm` in Go: `statm_resident × 4096 = RSS in bytes`. Compare to Kubernetes memory limit and alert at 90%.
195. `[CONCEPT]` `{L2}` What is `OOM score`? How does the kernel calculate which process to kill when memory is exhausted? What is `/proc/<pid>/oom_score`?
196. `[CONCEPT]` `{L3}` What is the kernel's buddy allocator? What is the slab allocator? How do they manage physical page allocation and object caching in the kernel?
197. `[CONCEPT]` `{L2}` What is `malloc`? What is `brk()` vs `mmap()` for heap allocation? When does the C runtime use each?
198. `[CONCEPT]` `{L2}` What is a memory fragmentation? What is internal vs external fragmentation? How does Go's GC handle fragmentation in the heap?
199. `[CONCEPT]` `{L2}` What is huge page support for Go programs? How does `GOMAXPROCS` interact with huge pages? When does enabling huge pages help OpenTrace?
200. `[CONCEPT]` `{L3}` What is a segmentation fault (SIGSEGV)? What causes it (null pointer dereference, buffer overflow, use-after-free)? How does Go recover from it (it doesn't — it panics)?
201. `[CONCEPT]` `{L2}` What is `valgrind`? What does it detect (memory leaks, use-after-free, buffer overflows)? Does it work on Go programs? (Partially — better to use pprof and ASan)
202. `[CONCEPT]` `{L3}` What is AddressSanitizer (ASan)? How does it detect memory bugs at runtime? Does Go support it?
203. `[CONCEPT]` `{L2}` What is a stack overflow? How does Go detect goroutine stack overflows (`runtime: goroutine stack exceeds 1000000000-byte limit`)? What causes infinite recursion?
204. `[CODE]` `{L2}` Write a recursive function in Go that overflows the goroutine stack. Show what the panic message looks like and how to fix with iterative or tail-recursive approach.
205. `[CONCEPT]` `{L2}` What is `runtime/debug.SetMaxStack(n)`? When would you lower the maximum goroutine stack size to detect runaway recursion earlier?
206. `[CONCEPT]` `{L2}` What is an ArrayBuffer in terms of OS memory? How does it relate to a raw memory allocation with no GC overhead?
207. `[CONCEPT]` `{L2}` What is cgo? What is the performance cost of calling C from Go? How does OpenTrace avoid cgo in the hot path?
208. `[CONCEPT]` `{L2}` What is `runtime.GC()`? When would you call it manually in OpenTrace? (After processing a large batch: force GC to reclaim memory before the next batch)
209. `[CODE]` `{L2}` Add a memory pressure check to OpenTrace: after processing each batch of 10K spans, if `HeapAlloc > 500MB`, call `runtime.GC()` and log GC duration.
210. `[CONCEPT]` `{L2}` What is `debug.FreeOSMemory()`? What does it do that `runtime.GC()` does not? (Returns idle heap pages to the OS immediately, vs waiting for MADV_FREE)
211. `[CONCEPT]` `{L2}` What is `MADV_FREE` vs `MADV_DONTNEED` for returning memory to the OS? How does Go's runtime use `madvise` to return idle heap pages?
212. `[CONCEPT]` `{L2}` What is `runtime/debug.SetMemoryLimit(n)` (Go 1.19)? How does OpenTrace set it to 90% of container memory limit to prevent OOMKill?
213. `[CODE]` `{L2}` Set memory limit for OpenTrace: `debug.SetMemoryLimit(int64(containerMemoryLimit * 0.9))` on startup. Read container limit from `/sys/fs/cgroup/memory/memory.limit_in_bytes`.
214. `[CONCEPT]` `{L2}` What is `GOGC`? What is the default GC target percentage (100)? When would you lower it to 50 for OpenTrace to reduce heap growth at the cost of more frequent GC?
215. `[CODE]` `{L2}` Tune GOGC for OpenTrace: set `GOGC=80` to trigger GC when heap grows by 80% of live data (vs default 100%). Monitor GC frequency increase and GC pause impact.
216. `[CONCEPT]` `{L2}` What is escape analysis in Go? How does `go build -gcflags="-m"` show which variables escape to the heap vs stay on the stack?
217. `[CODE]` `{L2}` Run `go build -gcflags="-m=2" ./collector/...` on OpenTrace. Find 3 variables escaping to heap in the span processing hot path. Change function signatures to eliminate escapes.
218. `[CONCEPT]` `{L2}` What is a memory allocation in the Go hot path? Why does `make([]byte, n)` in a hot loop cause excessive GC pressure in OpenTrace's 10M spans/sec path?
219. `[CODE]` `{L2}` Eliminate hot-path allocations in OpenTrace's span deserialization: pre-allocate a `[]*Span` slice once, reset length to 0 between batches (not make a new slice each time).
220. `[CONCEPT]` `{L3}` What is stack allocation in Go? What is heap allocation? How does the compiler decide? (Escape analysis: if an object's lifetime exceeds its allocating function's stack frame, it escapes to heap)

---

## Go Garbage Collector (Q221–Q260)

221. `[CONCEPT]` `{L1}` What is garbage collection? What algorithm does Go's GC use: tri-color mark-and-sweep with concurrent marking?
222. `[CONCEPT]` `{L2}` What is the tri-color invariant in Go's GC? What are white (unreachable), gray (to be scanned), and black (reachable, scanned) objects?
223. `[CONCEPT]` `{L2}` What is a stop-the-world (STW) pause in Go's GC? When does Go pause all goroutines? How long are typical STW pauses in Go 1.21?
224. `[CONCEPT]` `{L2}` What is a write barrier in Go's GC? How does it ensure the GC doesn't miss objects that are moved after marking starts?
225. `[CONCEPT]` `{L2}` What is generational garbage collection? Why doesn't Go use it (as of Go 1.21)? What is the "generational hypothesis" and why does Go's workload often violate it?
226. `[CONCEPT]` `{L3}` What is Go 1.22's experimental generational GC (`GOEXPERIMENT=rangefunc`)? What is the expected improvement in GC pause times?
227. `[CONCEPT]` `{L2}` What is GC pace? How does the Go GC scheduler decide when to start the next GC cycle?
228. `[CODE]` `{L2}` Instrument OpenTrace to measure GC pauses: use `runtime.ReadMemStats().PauseNs` or subscribe to GC notifications via `runtime/trace`. Alert if p99 pause > 5ms.
229. `[CONCEPT]` `{L2}` What is a GC assist? When does an allocating goroutine help with GC marking? How does this affect OpenTrace's span ingestion latency?
230. `[CODE]` `{L2}` Observe GC assists in OpenTrace using `runtime/trace`: `trace.Start(f)`, `defer trace.Stop()`. Open with `go tool trace`. Look for "GC assist" events in the goroutine view.
231. `[CONCEPT]` `{L2}` What is the Go heap scavenger? How does it return idle heap memory to the OS? What is `GOGC=off` combined with `GOMEMLIMIT` for?
232. `[CODE]` `{L2}` Configure OpenTrace for minimal GC overhead in the span ingest hot path: `GOGC=off`, `GOMEMLIMIT=900MiB`. GC only triggers when approaching the memory limit. Trade: higher memory usage for lower latency variance.
233. `[CONCEPT]` `{L2}` What is a `runtime.MemStats.GCCPUFraction`? What fraction of CPU time does OpenTrace's GC consume? Alert if > 5%.
234. `[CODE]` `{L2}` Export `runtime.ReadMemStats().GCCPUFraction` as a Prometheus gauge in OpenTrace. This shows the fraction of CPU time spent in GC (0.0-1.0).
235. `[CONCEPT]` `{L2}` What is an off-heap allocation in Go? Why would OpenTrace allocate span data outside the GC heap using `unsafe` + `mmap`? What are the risks?
236. `[CODE]` `{L3}` Implement an off-heap ring buffer for OpenTrace's span ingest using `mmap`: no GC pressure, but manual memory management. Show allocation and deallocation.
237. `[CONCEPT]` `{L2}` What is `go:noescape` directive? What does it prevent? How does the Go runtime use it to avoid certain heap allocations?
238. `[CONCEPT]` `{L2}` What is a `go:nosplit` function? What does it prevent (stack growth check)? When is it used in Go runtime code?
239. `[CONCEPT]` `{L2}` What is `go:noinline`? When does OpenTrace use it to prevent the compiler from inlining a function that should be visible in profiles?
240. `[CODE]` `{L2}` Add `//go:noinline` to OpenTrace's `processSpan()` function to make it appear clearly in CPU profiles. Compare pprof output with and without the directive.
241. `[CONCEPT]` `{L2}` What is the GC "finalizer" in Go? How is it set with `runtime.SetFinalizer`? What are the caveats (non-deterministic, can delay GC)?
242. `[CODE]` `{L2}` Use `runtime.SetFinalizer` in OpenTrace to log when a Kafka producer object is GC'd (to detect premature GC of a still-needed producer). Why is this a code smell?
243. `[CONCEPT]` `{L2}` What is `runtime.KeepAlive(v)`? When does OpenTrace use it to prevent the GC from collecting an object before a `defer` has a chance to reference it?
244. `[CONCEPT]` `{L2}` What is `WeakReference` (Go 1.24)? How does it differ from a regular pointer for GC purposes? When would OpenTrace use it?
245. `[CONCEPT]` `{L2}` What is the difference between a memory leak in a GC language vs a memory leak in C? In Go, a "leak" means long-lived references preventing GC, not unmapped memory.
246. `[CODE]` `{L2}` Create a Go memory leak in OpenTrace and find it: a map grows unboundedly because entries are never deleted. Show the pprof heap profile before and after adding deletion.
247. `[CONCEPT]` `{L2}` What is a goroutine stack memory? How is goroutine stack memory counted in `StackInuse`? Why doesn't it show up in `HeapAlloc`?
248. `[CODE]` `{L2}` Calculate OpenTrace's total goroutine stack memory: `runtime.ReadMemStats().StackInuse`. At 10K goroutines × ~4KB average stack = ~40MB. Compare to HeapInuse.
249. `[CONCEPT]` `{L2}` What is `pprof` heap profiling? What is the difference between `heap` (in-use) vs `allocs` (all-time allocations) profiles?
250. `[CODE]` `{L2}` Capture an OpenTrace heap profile: `curl http://localhost:6060/debug/pprof/heap > heap.prof`, `go tool pprof -top heap.prof`. Show the top 5 allocation sites.
251. `[CONCEPT]` `{L2}` What is `pprof` allocation profiling? How does `pprof -alloc_objects` show allocation count vs `-alloc_space` showing allocation bytes?
252. `[CODE]` `{L2}` Use `go test -bench=. -memprofile=mem.prof -benchmem` for OpenTrace's span processing benchmark. Analyze `mem.prof` to reduce allocs/op.
253. `[CONCEPT]` `{L2}` What is a `benchmark` in Go? What does `B.ReportAllocs()` do? How do you use it to measure OpenTrace's per-span allocation count?
254. `[CODE]` `{L2}` Write a Go benchmark for OpenTrace's Protobuf span unmarshal: `b.ReportAllocs()`, `b.SetBytes(int64(len(spanBytes)))`. Target: < 1000 ns/op, 0 allocs/op (using sync.Pool).
255. `[CONCEPT]` `{L2}` What is escape analysis failure? What are common reasons a value escapes when it shouldn't: returned as interface, taken address stored in heap, closed over by goroutine?
256. `[CODE]` `{L2}` Find an escape analysis failure in OpenTrace: `func processSpan(s *Span) error { return fmt.Errorf("invalid: %v", s) }`. The `*Span` escapes via the error interface. Fix with a dedicated error type.
257. `[CONCEPT]` `{L2}` What is a bump allocator? How do arenas (Go 1.21) provide bump allocation semantics for groups of objects that are freed together?
258. `[CODE]` `{L3}` Use `arena.New()` (Go 1.21 experiment) in OpenTrace's batch processor: allocate all spans for a batch from one arena, free the entire batch atomically. Measure latency improvement.
259. `[CONCEPT]` `{L2}` What is `debug/buildinfo`? How does OpenTrace embed its version, Go version, and build time in the binary for `version` subcommand output?
260. `[CODE]` `{L2}` Add build info to OpenTrace: `go build -ldflags="-X main.version=$(git describe --tags) -X main.buildTime=$(date -u +%Y-%m-%dT%H:%M:%SZ)"`. Read with `debug.ReadBuildInfo()`.

---

# PART D — File I/O & Storage (Q261–Q360)

---

## File System Fundamentals (Q261–Q300)

261. `[CONCEPT]` `{L1}` What is an inode? What information does it store? What does it NOT store (filename)?
262. `[CONCEPT]` `{L1}` What is the difference between a hard link and a symbolic link? How do file descriptors relate to inodes?
263. `[CONCEPT]` `{L1}` What is `fsync()`? Why does PostgreSQL call `fsync()` after writing to the WAL? What would happen without it?
264. `[CONCEPT]` `{L2}` What is `fdatasync()`? How does it differ from `fsync()`? Which does PostgreSQL use for WAL records?
265. `[CONCEPT]` `{L2}` What is `O_DIRECT`? Why do databases like ClickHouse sometimes bypass the page cache using `O_DIRECT`?
266. `[CONCEPT]` `{L2}` What is `O_SYNC` vs `O_DSYNC`? What is the equivalent of `fdatasync` as an `open()` flag?
267. `[CONCEPT]` `{L1}` What is sequential I/O vs random I/O? Why is sequential I/O 100x faster on HDDs? Is this still true for SSDs (NVMe)?
268. `[CONCEPT]` `{L2}` What is write amplification? How does it affect SSDs and LSM-tree databases like ClickHouse?
269. `[CONCEPT]` `{L2}` What is read amplification? Why does an LSM-tree have higher read amplification than a B-tree?
270. `[CONCEPT]` `{L2}` What is `iostat`? What are the key metrics: `%util`, `r/s`, `w/s`, `await`, `svctm`, `rkB/s`, `wkB/s`? What does `%util = 100%` mean?
271. `[CODE]` `{L2}` Run `iostat -xz 1` during an OpenTrace ClickHouse bulk insert. Identify the I/O bottleneck: `%util` for utilization, `await` for I/O latency.
272. `[CONCEPT]` `{L2}` What is `iowait`? What is `%iowait` in `top`? When does OpenTrace's host show high iowait? (ClickHouse writing large batches)
273. `[DEBUG]` `{L2}` OpenTrace's host shows 90% iowait. The CPU is mostly idle. What is the investigation: `iostat -xz 1`, `iotop -o`, `lsof | grep ClickHouse`. What are the remediation options?
274. `[CONCEPT]` `{L2}` What is `iotop`? How do you find which process is causing the high I/O on OpenTrace's host?
275. `[CODE]` `{L2}` Use `iotop -o -p $(pgrep clickhouse)` to monitor ClickHouse's real-time disk read/write throughput during OpenTrace span ingestion.
276. `[CONCEPT]` `{L2}` What is `fio` (flexible I/O tester)? How do you benchmark OpenTrace's ClickHouse storage volume's sequential write throughput before deploying?
277. `[CODE]` `{L2}` Run `fio --name=seqwrite --rw=write --bs=1M --size=10G --direct=1 --numjobs=4 --output-format=json` on OpenTrace's ClickHouse disk. What is the expected throughput for NVMe vs gp3 EBS?
278. `[CONCEPT]` `{L2}` What is `fallocate()`? Why does ClickHouse pre-allocate disk space for data files? How does it reduce fragmentation and improve write performance?
279. `[CONCEPT]` `{L2}` What is `sendfile()`? How does nginx use it to serve OpenTrace's static UI assets directly from disk to network socket without a user-space copy?
280. `[CONCEPT]` `{L2}` What is zero-copy I/O? What is the difference between `read() + write()` (2 copies) vs `sendfile()` (0 copies) vs `io_uring` (0 copies + async)?
281. `[CONCEPT]` `{L2}` What is a journaling filesystem? How does ext4 journaling prevent corruption on power loss? How does it relate to PostgreSQL's WAL?
282. `[CONCEPT]` `{L2}` What is `tmpfs`? When would you mount `/tmp` as tmpfs for OpenTrace? What is the risk?
283. `[CONCEPT]` `{L2}` What is an NFS (Network File System) mount? What are the performance and reliability implications for OpenTrace's Kafka log directory on NFS?
284. `[CONCEPT]` `{L2}` What is inode exhaustion? How does a filesystem run out of inodes before disk space? How would OpenTrace detect this?
285. `[CODE]` `{L2}` Check inode usage for OpenTrace's ClickHouse directory: `df -i /var/lib/clickhouse`. Alert if inode usage > 80%.
286. `[CONCEPT]` `{L2}` What is `xfs_info`? What are the key XFS filesystem parameters for ClickHouse's high-write workload (allocation groups, log size)?
287. `[CONCEPT]` `{L2}` What is a copy-on-write (COW) filesystem (Btrfs, ZFS)? How does COW enable atomic writes and snapshots? What is the write overhead?
288. `[CONCEPT]` `{L2}` What is ZFS? What is the ZFS ARC (Adaptive Replacement Cache)? How does it compete with the Linux page cache?
289. `[CONCEPT]` `{L3}` What is `io_uring`? How does it use shared memory ring buffers between user space and kernel to achieve async I/O with zero syscall overhead per operation?
290. `[CONCEPT]` `{L3}` What is the difference between `epoll` and `io_uring` for network I/O? How does `io_uring` reduce the number of context switches for OpenTrace's span ingestion?
291. `[CONCEPT]` `{L2}` What is `splice()`? How does it move data between two file descriptors without copying to user space? When would OpenTrace use it?
292. `[CONCEPT]` `{L2}` What is `pread()` vs `read()` for concurrent I/O? How does ClickHouse use `pread()` to read from multiple parts simultaneously without seeking?
293. `[CONCEPT]` `{L2}` What is buffered I/O vs unbuffered I/O? What is `O_DIRECT` and why does it bypass the kernel page cache?
294. `[CONCEPT]` `{L2}` What is a write-back vs write-through page cache policy? How does Linux's write-back policy affect data durability for OpenTrace's WAL writes?
295. `[CONCEPT]` `{L2}` What is dirty page writeback? What is `vm.dirty_ratio` and `vm.dirty_background_ratio`? How do they affect OpenTrace's ClickHouse write latency?
296. `[CODE]` `{L2}` Tune dirty page writeback for OpenTrace's ClickHouse host: `echo 10 > /proc/sys/vm/dirty_ratio`, `echo 5 > /proc/sys/vm/dirty_background_ratio`. What do these values mean?
297. `[CONCEPT]` `{L2}` What is `sync` command? How does `echo 3 > /proc/sys/vm/drop_caches` flush the page cache? When would you do this on OpenTrace's ClickHouse host?
298. `[DEBUG]` `{L2}` OpenTrace's ClickHouse query performance degrades after a large write burst. The page cache is exhausted by write-back data. How do you diagnose with `/proc/meminfo` (Dirty, Writeback fields)?
299. `[CONCEPT]` `{L2}` What is `perf trace` for I/O analysis? How do you trace every `read()` and `write()` syscall made by OpenTrace Collector using `perf trace -p <pid>`?
300. `[APPLY]` `{L2}` Design OpenTrace's disk layout for optimal I/O: ClickHouse data on NVMe SSD (random I/O for reads, sequential for writes), Kafka logs on separate NVMe (sequential write), WAL on SSD, OS on HDD.

---

## Go File I/O & OS Interface (Q301–Q340)

301. `[CONCEPT]` `{L1}` What is `os.File` in Go? How does it wrap a file descriptor? What is `os.ReadFile` vs `os.Open + io.ReadAll`?
302. `[CODE]` `{L1}` Open a config file in OpenTrace with error handling: `f, err := os.Open("/etc/openTrace/config.yaml")`, use `defer f.Close()`, read with `io.ReadAll(f)`.
303. `[CONCEPT]` `{L1}` What is `defer f.Close()`? Why must you always defer file close? What is the risk of not closing files in OpenTrace's config reload loop?
304. `[CODE]` `{L2}` Fix the file descriptor leak in OpenTrace's config reload:
    ```go
    // BAD: f.Close() not called on error path
    f, _ := os.Open(path)
    data, _ := io.ReadAll(f)
    // GOOD:
    f, err := os.Open(path)
    if err != nil { return err }
    defer f.Close()
    ```
305. `[CONCEPT]` `{L2}` What is `bufio.Reader` in Go? Why does buffering reduce syscalls for file I/O? When does OpenTrace use `bufio.Scanner` for log parsing?
306. `[CODE]` `{L2}` Implement a large file reader for OpenTrace's span archive import: use `bufio.NewReaderSize(f, 4*1024*1024)` (4MB buffer) to read 100GB archive efficiently.
307. `[CONCEPT]` `{L2}` What is `io.Reader`? What is the `io.ReadFull` vs `io.ReadAll` vs `io.Copy` difference? When does OpenTrace use each?
308. `[CODE]` `{L2}` Stream OpenTrace's span export from ClickHouse to S3 without loading into memory: `io.Copy(s3Writer, clickhouseReader)` with gzip compression via `io.Pipe`.
309. `[CONCEPT]` `{L2}` What is `os.Stat` vs `os.Lstat`? When does OpenTrace use each (Lstat for symlink check, Stat follows symlinks)?
310. `[CODE]` `{L2}` Implement file existence check in OpenTrace's WAL recovery: `if _, err := os.Stat(walPath); errors.Is(err, os.ErrNotExist) { startFresh() }`.
311. `[CONCEPT]` `{L2}` What is `os.Rename` (atomic on Linux within same filesystem)? How does OpenTrace's WAL writer use atomic rename to replace old segment files?
312. `[CODE]` `{L2}` Implement atomic WAL segment rotation in OpenTrace: write to temp file, `fsync()`, then `os.Rename(tmpPath, finalPath)`. This prevents partial writes being visible.
313. `[CONCEPT]` `{L2}` What is `os.MkdirAll` vs `os.Mkdir`? What is the race condition when two goroutines both call `os.Mkdir` simultaneously?
314. `[CODE]` `{L2}` Create directories safely in OpenTrace: `os.MkdirAll(path, 0755)` is idempotent. Don't use `os.Mkdir` in concurrent code without checking for `os.ErrExist`.
315. `[CONCEPT]` `{L2}` What is file locking in Go? How does `flock()` provide advisory file locking? When does OpenTrace use it to prevent multiple Collectors from using the same WAL file?
316. `[CODE]` `{L2}` Implement file-based lock for OpenTrace's single-instance WAL: `syscall.Flock(fd, syscall.LOCK_EX | syscall.LOCK_NB)`. Return error if another instance holds the lock.
317. `[CONCEPT]` `{L2}` What is `os.Getwd()`? How does OpenTrace's test suite use it to find testdata files regardless of the working directory when tests run?
318. `[CODE]` `{L2}` Use `runtime.Caller(0)` to find the current source file's directory in OpenTrace's tests: `_, filename, _, _ := runtime.Caller(0); dir := filepath.Dir(filename)`.
319. `[CONCEPT]` `{L2}` What is `filepath.Walk` vs `filepath.WalkDir`? What is the difference in API and performance? When does OpenTrace use it to scan WAL segment files?
320. `[CODE]` `{L2}` Implement WAL segment scanner in OpenTrace: `filepath.WalkDir(walDir, func(path string, d fs.DirEntry, err error) error { if !d.IsDir() && strings.HasSuffix(path, ".wal") { segments = append(segments, path) } })`.
321. `[CONCEPT]` `{L2}` What is `inotify` on Linux? How does OpenTrace use it to watch the config file for changes using `fsnotify` Go library?
322. `[CODE]` `{L2}` Implement config file watcher for OpenTrace using `fsnotify`: `watcher.Add("/etc/openTrace/config.yaml")`, on `WRITE` event reload config, on `REMOVE` log warning.
323. `[CONCEPT]` `{L2}` What is `os.ReadDir` in Go? How does OpenTrace's WAL recovery list and sort all segment files in the WAL directory?
324. `[CODE]` `{L2}` Read and sort WAL segments in OpenTrace: `entries, _ := os.ReadDir(walDir)`, filter by `.wal` suffix, sort by filename (which encodes sequence number), return sorted list.
325. `[CONCEPT]` `{L2}` What is `os.CreateTemp` (formerly `ioutil.TempFile`)? How does OpenTrace use it for safe temporary file creation during span export?
326. `[CODE]` `{L2}` Create a temporary file for OpenTrace's span export: `tmp, _ := os.CreateTemp(exportDir, "spans-*.json.gz")`. Write to temp, then `os.Rename` to final path atomically.
327. `[CONCEPT]` `{L2}` What is `os.Truncate`? When does OpenTrace use it to pre-allocate WAL segment files at creation?
328. `[CODE]` `{L2}` Pre-allocate WAL segment in OpenTrace: `os.Truncate(walPath, segmentSize)` to reserve disk space upfront, preventing fragmentation during write.
329. `[CONCEPT]` `{L2}` What is a memory-mapped file (`mmap`) in Go? How does OpenTrace's LSM-tree storage engine use `mmap` via `golang.org/x/sys/unix.Mmap` to map SSTable files into memory?
330. `[CODE]` `{L2}` Implement mmap read for OpenTrace's SSTable: `unix.Mmap(int(f.Fd()), 0, int(size), unix.PROT_READ, unix.MAP_SHARED)`. Access bytes directly. `unix.Munmap(data)` to release.
331. `[CONCEPT]` `{L3}` What is `madvise(MADV_SEQUENTIAL)` vs `madvise(MADV_RANDOM)` for memory-mapped files? How does OpenTrace hint to the kernel the access pattern for SSTable reads?
332. `[CODE]` `{L3}` Add `madvise` hints to OpenTrace's SSTable mmap: `unix.Madvise(data, unix.MADV_SEQUENTIAL)` for sequential scan, `unix.MADV_RANDOM` for random access. Measure read latency difference.
333. `[CONCEPT]` `{L2}` What is a file descriptor table in the kernel? How is it shared (or not) after `fork()`? Why must OpenTrace close inherited file descriptors after `exec()`?
334. `[CONCEPT]` `{L2}` What is `os.Pipe()` in Go? How does OpenTrace use pipes for IPC between the Collector and a child process for span transformation?
335. `[CODE]` `{L2}` Implement inter-process communication using pipes in OpenTrace: `r, w, _ := os.Pipe()`. Parent writes spans to `w`, child reads from `r`. Set `cmd.Stdin = r`.
336. `[CONCEPT]` `{L2}` What is Unix domain socket? When does OpenTrace use Unix domain sockets instead of TCP for IPC (lower latency, no network stack overhead)?
337. `[CODE]` `{L2}` Implement Unix domain socket listener in Go for OpenTrace's local agent: `net.Listen("unix", "/var/run/openTrace.sock")`. Why is this faster than TCP loopback?
338. `[CONCEPT]` `{L2}` What is `SO_SNDBUF` and `SO_RCVBUF`? How does OpenTrace configure larger socket buffers for its Kafka connection to improve throughput?
339. `[CODE]` `{L2}` Set socket buffer sizes for OpenTrace's Kafka connection: `unix.SetsockoptInt(fd, unix.SOL_SOCKET, unix.SO_SNDBUF, 1*1024*1024)` (1MB send buffer). Verify with `ss -tm`.
340. `[APPLY]` `{L2}` Design OpenTrace's file I/O for the WAL biweekly project: segment file naming, pre-allocation, fsync strategy, atomic rotation, crash recovery procedure.

---

# PART E — Networking, Performance & Production (Q341–Q500)

---

## Linux Networking Internals (Q341–Q380)

341. `[CONCEPT]` `{L1}` What is the Linux networking stack? What happens to a packet from NIC to application: DMA → ring buffer → interrupt → softirq → protocol processing → socket buffer → recv()?
342. `[CONCEPT]` `{L2}` What is NAPI (New API) in Linux networking? How does it reduce interrupt overhead for high-packet-rate scenarios like OpenTrace's gRPC ingestion?
343. `[CONCEPT]` `{L2}` What is a socket send/receive buffer? What is `SO_SNDBUF` and `SO_RCVBUF`? What does TCP buffer bloat mean?
344. `[CONCEPT]` `{L2}` What is TCP socket state machine: LISTEN, SYN_SENT, SYN_RCVD, ESTABLISHED, FIN_WAIT_1, FIN_WAIT_2, TIME_WAIT, CLOSE_WAIT, LAST_ACK, CLOSED?
345. `[CODE]` `{L2}` Use `ss -tan` to see all TCP connections by state for OpenTrace Collector. What does a large TIME_WAIT count indicate? What does a large CLOSE_WAIT count indicate?
346. `[CONCEPT]` `{L2}` What is `net.ipv4.tcp_max_syn_backlog`? What is `net.core.somaxconn`? How do these affect OpenTrace Collector's ability to accept connections during traffic spikes?
347. `[CODE]` `{L2}` Tune Linux kernel parameters for OpenTrace Collector: `sysctl -w net.core.somaxconn=65535`, `sysctl -w net.ipv4.tcp_max_syn_backlog=65535`, `sysctl -w net.core.netdev_max_backlog=65535`.
348. `[CONCEPT]` `{L2}` What is `net.ipv4.tcp_fin_timeout`? What is the default (60s)? How do you reduce it to decrease TIME_WAIT duration for OpenTrace's outbound connections?
349. `[CODE]` `{L2}` Configure TCP timeout tuning for OpenTrace: `sysctl -w net.ipv4.tcp_fin_timeout=15`, `sysctl -w net.ipv4.tcp_tw_reuse=1`. What do these reduce and what are the risks?
350. `[CONCEPT]` `{L2}` What is `net.core.rmem_max` and `net.core.wmem_max`? How do you tune them for OpenTrace's high-throughput Kafka connections?
351. `[CODE]` `{L2}` Tune socket buffer sizes for OpenTrace's Kafka producer: `sysctl -w net.core.rmem_max=134217728`, `net.core.wmem_max=134217728` (128MB each).
352. `[CONCEPT]` `{L2}` What is `ethtool`? How do you check and set NIC ring buffer size and interrupt coalescing for OpenTrace's high-throughput network interface?
353. `[CODE]` `{L2}` Use `ethtool -g eth0` to check OpenTrace host's NIC ring buffer size. Use `ethtool -G eth0 rx 4096 tx 4096` to increase ring buffers for high-packet-rate ingestion.
354. `[CONCEPT]` `{L2}` What is RSS (Receive Side Scaling)? How does it distribute network interrupts across CPU cores for OpenTrace's multi-CPU host?
355. `[CONCEPT]` `{L2}` What is XDP (eXpress Data Path)? How does it process packets before they enter the Linux network stack? How could OpenTrace use XDP for ultra-low-latency span ingestion?
356. `[CONCEPT]` `{L3}` What is DPDK? How does it bypass the Linux kernel entirely for packet processing? What is the `poll mode driver`?
357. `[CONCEPT]` `{L2}` What is TCP_CORK? How does it batch small writes into larger TCP segments? When would OpenTrace use it for HTTP/2 response writes?
358. `[CONCEPT]` `{L2}` What is `TCP_QUICKACK`? How does it affect delayed ACK behavior? When would OpenTrace set it for latency-sensitive gRPC connections?
359. `[CODE]` `{L2}` Set `TCP_NODELAY` and disable `TCP_CORK` for OpenTrace's gRPC connections in Go: configure via `net.Conn` after `net.Dial` using `syscall.SetsockoptInt`.
360. `[CONCEPT]` `{L3}` What is `tcpDump` BPF filter? How do you capture only OpenTrace's gRPC traffic using a BPF filter: `tcpdump -i eth0 'tcp port 4317 and host 10.0.0.5'`?

---

## Performance Analysis & Tuning (Q361–Q420)

361. `[CONCEPT]` `{L1}` What is `top` vs `htop` vs `atop`? What are the key columns for OpenTrace debugging: PID, %CPU, %MEM, VSZ, RSS, S (state), TIME+?
362. `[CODE]` `{L2}` Use `htop` to identify if OpenTrace Collector is CPU-bound or I/O-bound. What is the difference in the process state column (R=running, S=sleeping, D=disk wait)?
363. `[CONCEPT]` `{L2}` What is `vmstat`? What are key fields: r (run queue), b (blocked), si/so (swap in/out), bi/bo (block I/O), us/sy/id/wa (CPU breakdown)?
364. `[CODE]` `{L2}` Run `vmstat 1 10` on OpenTrace's host during a load test. Interpret: high `wa` (iowait) means disk bottleneck, high `si/so` means memory pressure and swapping.
365. `[CONCEPT]` `{L2}` What is `sar`? How do you use it to review historical OpenTrace host performance (CPU, memory, I/O, network) from `/var/log/sa/`?
366. `[CONCEPT]` `{L2}` What is `perf stat`? What hardware performance counters does it measure: instructions, cache-misses, branch-mispredictions, cycles?
367. `[CODE]` `{L2}` Run `perf stat -p $(pgrep openTrace-collector) sleep 30` during span ingestion. Calculate IPC (instructions per cycle). < 1 IPC indicates memory-bound workload.
368. `[CONCEPT]` `{L2}` What is CPU cache hierarchy: L1 (4-cycle), L2 (12-cycle), L3 (40-cycle), RAM (200-cycle)? How does cache-unfriendly code affect OpenTrace's span processing?
369. `[CODE]` `{L2}` Profile OpenTrace's cache miss rate: `perf stat -e cache-misses,cache-references -p $(pgrep openTrace-collector) sleep 10`. Cache miss rate > 10% indicates poor locality.
370. `[CONCEPT]` `{L2}` What is NUMA-aware memory allocation? How does `numactl --membind 0` ensure OpenTrace Collector on NUMA node 0 allocates memory from the local NUMA node?
371. `[CONCEPT]` `{L2}` What is CPU frequency scaling? What is `performance` vs `powersave` governor? Why does OpenTrace need `performance` governor for predictable low latency?
372. `[CODE]` `{L2}` Set CPU frequency governor for OpenTrace's host: `echo performance > /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor`. Verify with `cpupower frequency-info`.
373. `[CONCEPT]` `{L2}` What is CPU idle state (C-state) latency? How do deeper C-states (C6, C7) affect OpenTrace's tail latency by adding wakeup delay?
374. `[CODE]` `{L2}` Disable deep CPU idle states for OpenTrace: `cpupower idle-set -D 1` to limit to C1 state. This trades power efficiency for consistent low latency.
375. `[CONCEPT]` `{L2}` What is `schedtool`? How do you set OpenTrace Collector to `SCHED_FIFO` real-time scheduling priority for guaranteed CPU time?
376. `[CONCEPT]` `{L3}` What is `isolcpus` kernel boot parameter? How do you dedicate CPU cores 4-7 exclusively to OpenTrace's gRPC handler goroutines?
377. `[CONCEPT]` `{L2}` What is `numactl`? How does `numactl --cpunodebind=0 --membind=0 openTrace-collector` pin OpenTrace to NUMA node 0 for maximum cache locality?
378. `[CONCEPT]` `{L2}` What is flamegraph for performance analysis? What tools generate them from Go pprof: `go tool pprof -http=:8080 cpu.prof`?
379. `[CODE]` `{L2}` Generate a CPU flamegraph for OpenTrace: `curl http://localhost:6060/debug/pprof/profile?seconds=30 > cpu.prof`, `go tool pprof -http=:8080 cpu.prof`. Open "Flame Graph" view.
380. `[CODE]` `{L2}` Generate an off-CPU flamegraph for OpenTrace using `perf`: `perf record -g -p $(pgrep openTrace-collector) sleep 30`, `perf script > out.perf`, `FlameGraph/stackcollapse-perf.pl out.perf | FlameGraph/flamegraph.pl > flamegraph.svg`.
381. `[CONCEPT]` `{L2}` What is the difference between CPU flamegraph (where time is spent) and memory flamegraph (where allocations happen)? When does OpenTrace need each?
382. `[CODE]` `{L2}` Generate a memory flamegraph for OpenTrace: `curl http://localhost:6060/debug/pprof/allocs > allocs.prof`, `go tool pprof -http=:8080 allocs.prof`. Open "Flame Graph" view.
383. `[CONCEPT]` `{L2}` What is `go test -cpuprofile=cpu.prof`? How do you generate a CPU profile from unit tests to catch performance regressions in OpenTrace's span processing?
384. `[CODE]` `{L2}` Add a performance regression test to OpenTrace CI: `go test -bench=BenchmarkProcessSpan -cpuprofile=cpu.prof ./processor/...`. Compare ns/op to baseline; fail if > 10% regression.
385. `[CONCEPT]` `{L2}` What is `pprof -diff_base`? How do you compare two pprof profiles to find what caused OpenTrace's performance regression between commits?
386. `[CODE]` `{L2}` Diff two OpenTrace heap profiles: `go tool pprof -diff_base=base.prof new.prof`. Shows allocations that increased. Find the new allocation site causing the regression.
387. `[CONCEPT]` `{L2}` What is `go build -o openTrace-collector ./cmd/collector && size openTrace-collector`? What does binary size tell you about OpenTrace's dependencies?
388. `[CODE]` `{L2}` Reduce OpenTrace's binary size: `go build -ldflags="-s -w"` (strip debug info), `upx --best openTrace-collector` (compress). Compare compressed Docker image size.
389. `[CONCEPT]` `{L2}` What is `go tool nm openTrace-collector | sort -k2 -rn | head -20`? How do you find the largest symbols in OpenTrace's binary?
390. `[CONCEPT]` `{L2}` What is `go mod tidy` vs `go mod vendor`? When does OpenTrace use vendor mode for reproducible builds in CI without network access?
391. `[CONCEPT]` `{L2}` What is `go test -shuffle=on`? How does it randomize test execution order to detect order-dependent tests in OpenTrace's test suite?
392. `[CODE]` `{L2}` Run `go test -shuffle=on -count=5 ./...` on OpenTrace. Identify tests that fail when order changes (they likely share global state).
393. `[CONCEPT]` `{L2}` What is `go test -timeout 30s`? Why does OpenTrace set a strict test timeout to catch infinite loops or deadlocks in tests?
394. `[CODE]` `{L2}` Set test timeouts in OpenTrace's Makefile: `go test -timeout 60s -race -count=1 ./...`. The 60s timeout catches goroutine leaks that would otherwise run forever.
395. `[CONCEPT]` `{L2}` What is `go tool cover -html=coverage.out`? How do you visualize OpenTrace's test coverage and identify untested code paths?
396. `[CODE]` `{L2}` Add coverage reporting to OpenTrace's CI: `go test -coverprofile=coverage.out ./...`, `go tool cover -func=coverage.out | tail -1`. Fail CI if total coverage < 80%.
397. `[CONCEPT]` `{L2}` What is `staticcheck`? What is `golangci-lint`? What linting rules does OpenTrace enforce in CI?
398. `[CODE]` `{L2}` Configure `golangci-lint` for OpenTrace: enable `errcheck` (check error returns), `staticcheck` (static analysis), `govet` (vet issues), `exhaustive` (switch exhaustiveness). Add `.golangci.yaml`.
399. `[CONCEPT]` `{L2}` What is `gosec`? What security issues does it detect in OpenTrace: hardcoded credentials, SQL injection, weak randomness, path traversal?
400. `[CODE]` `{L2}` Run `gosec ./...` on OpenTrace. What findings would you expect? Show how to suppress a false positive with `// #nosec G304` and when suppression is acceptable.

---

## Production Operations & Debugging (Q401–Q500)

401. `[CONCEPT]` `{L1}` What is `kubectl exec -it pod -- sh`? How do you get a shell into a running OpenTrace Collector pod for live debugging?
402. `[CODE]` `{L2}` Debug a running OpenTrace pod: `kubectl exec -it openTrace-collector-xyz -- sh`, then `cat /proc/self/status`, `ls /proc/self/fd | wc -l`, `kill -SIGUSR1 1` (config reload).
403. `[CONCEPT]` `{L2}` What is `kubectl debug`? How do you add a debugging sidecar to a running OpenTrace pod without restarting it?
404. `[CODE]` `{L2}` Use `kubectl debug -it pod/openTrace-collector-xyz --image=busybox --target=openTrace-collector` to add a debugging sidecar sharing the process namespace.
405. `[CONCEPT]` `{L2}` What is `nsenter`? How do you enter a Kubernetes container's network namespace to run `ss`, `tcpdump` from the host?
406. `[CODE]` `{L2}` Use `nsenter -t $(docker inspect --format '{{.State.Pid}}' container_id) -n ss -tlnp` to see OpenTrace Collector's listening sockets from the host network namespace.
407. `[CONCEPT]` `{L2}` What is `crictl`? How does it differ from `docker` CLI for debugging Kubernetes CRI-O or containerd-based pods?
408. `[CONCEPT]` `{L2}` What is `/proc/<pid>/net/sockstat`? How do you monitor TCP connection counts for OpenTrace Collector from within the pod?
409. `[CODE]` `{L2}` Add a `GET /debug/sockstat` endpoint to OpenTrace Collector: read `/proc/self/net/sockstat`, parse TCP sockets (inuse, orphan, tw, alloc), return as JSON for dashboards.
410. `[CONCEPT]` `{L2}` What is `ss -tip` (TCP with process info)? How do you find which goroutine is holding each TCP connection in OpenTrace?
411. `[CONCEPT]` `{L2}` What is `/proc/<pid>/net/tcp`? How do you parse it to see all TCP connections (including non-ESTABLISHED) for OpenTrace Collector?
412. `[CODE]` `{L2}` Parse `/proc/self/net/tcp6` in Go for OpenTrace's connection inspector endpoint: decode hex local/remote addresses and port, map to human-readable form.
413. `[CONCEPT]` `{L2}` What is the `/sys/fs/cgroup/memory/` filesystem? How do you read OpenTrace pod's current memory usage vs its limit from within the container?
414. `[CODE]` `{L2}` Read container memory limit in Go for OpenTrace's adaptive memory management: `os.ReadFile("/sys/fs/cgroup/memory/memory.limit_in_bytes")`. Use this to set `debug.SetMemoryLimit`.
415. `[CONCEPT]` `{L2}` What is `/sys/fs/cgroup/cpu/cpu.shares`? What is `/sys/fs/cgroup/cpu/cpu.quota_us` and `cpu.period_us`? How do they enforce Kubernetes CPU limits?
416. `[CODE]` `{L2}` Read container CPU quota in OpenTrace: `quota / period = max CPU cores`. Use this to set `runtime.GOMAXPROCS(int(math.Ceil(cpuQuota)))` for optimal goroutine scheduling.
417. `[CONCEPT]` `{L2}` What is `GOMAXPROCS` and the Kubernetes CPU limit interaction? If the container has `limits.cpu: 0.5`, what should GOMAXPROCS be? (1, not 0 — minimum 1 P)
418. `[CODE]` `{L2}` Use `uber-go/automaxprocs` library in OpenTrace: `import _ "go.uber.org/automaxprocs"` auto-sets GOMAXPROCS based on container CPU quota. No manual tuning needed.
419. `[CONCEPT]` `{L2}` What is `GOPROXY`? What is `GONOSUMCHECK`? How does OpenTrace's CI use a private GOPROXY for faster dependency resolution?
420. `[CODE]` `{L2}` Configure OpenTrace's CI to use Artifactory as GOPROXY: `GOPROXY=https://artifactory.company.com/go,direct GONOSUMCHECK=*.internal.com go build ./...`.
421. `[CONCEPT]` `{L2}` What is `go mod download`? What is the module cache at `$GOPATH/pkg/mod`? How does OpenTrace's Docker build cache it?
422. `[CODE]` `{L2}` Cache Go module downloads in OpenTrace's GitHub Actions CI: `uses: actions/cache@v3 with: path: ~/go/pkg/mod key: ${{ hashFiles('**/go.sum') }}`.
423. `[CONCEPT]` `{L2}` What is `go work` (Go workspaces)? How does OpenTrace use workspaces for multi-module development in a monorepo?
424. `[CODE]` `{L2}` Create a Go workspace for OpenTrace: `go work init ./collector ./processor ./query`. Run `go work use ./pkg/storage` to add the storage library.
425. `[CONCEPT]` `{L2}` What is `go generate`? How does OpenTrace use it to regenerate Protobuf Go code: `go generate ./...` runs `protoc --go_out=.` automatically?
426. `[CODE]` `{L2}` Add `go generate` directive to OpenTrace's span proto file: `//go:generate protoc --go_out=. --go-grpc_out=. span.proto`. Run `make generate` in CI to ensure generated code is up to date.
427. `[CONCEPT]` `{L2}` What is `Makefile` in Go projects? What are the standard targets: `make build`, `make test`, `make lint`, `make generate`, `make docker`, `make deploy`?
428. `[CODE]` `{L2}` Write OpenTrace's Makefile: `build: go build -o bin/collector ./cmd/collector`. `test: go test -race -count=1 ./...`. `lint: golangci-lint run`. `generate: go generate ./...`.
429. `[CONCEPT]` `{L2}` What is `goreleaser`? How does OpenTrace use it to build multi-platform binaries (linux/amd64, linux/arm64) and Docker images in CI?
430. `[CODE]` `{L2}` Write OpenTrace's `.goreleaser.yaml`: `builds: [{goos: [linux], goarch: [amd64, arm64], ldflags: ["-s -w -X main.version={{.Version}}"]}]`. `dockers: [{image_templates: ["ghcr.io/org/openTrace:{{.Tag}}"]}]`.
431. `[CONCEPT]` `{L2}` What is `go tool pprof` vs `go tool trace`? What does each analyze? When does OpenTrace need each?
432. `[CODE]` `{L2}` Capture an execution trace for OpenTrace during a 5-second load test: `curl http://localhost:6060/debug/pprof/trace?seconds=5 > trace.out`. Open with `go tool trace trace.out`.
433. `[CONCEPT]` `{L2}` What is the `go tool trace` goroutine view? What is the "Goroutines" tab? How do you find all goroutines blocked on `channel receive` in OpenTrace's trace?
434. `[CONCEPT]` `{L2}` What is a `go tool trace` GC view? How do you measure GC pause duration from the trace? What is acceptable for OpenTrace (< 1ms p99)?
435. `[CODE]` `{L2}` Analyze OpenTrace's GC pauses from `go tool trace`: look at "GC" events in the timeline view, measure `STW mark termination` duration, ensure < 1ms.
436. `[CONCEPT]` `{L2}` What is `go tool compile -S main.go`? How do you inspect the assembly output of OpenTrace's hot span processing function to verify it's not making unexpected function calls?
437. `[CODE]` `{L2}` Inspect OpenTrace's `processSpan` assembly: `go tool compile -S processor/span.go | grep processSpan`. Look for unexpected `runtime.morestack` calls (stack growth) in the hot path.
438. `[CONCEPT]` `{L2}` What is `go tool link`? What does `go build -v` output tell you about which packages are being compiled?
439. `[CODE]` `{L2}` Use `go build -v ./cmd/collector 2>&1 | grep -v "^#"` to see all packages compiled in OpenTrace. Unexpected third-party packages inflating binary size will appear here.
440. `[CONCEPT]` `{L2}` What is `go build -trimpath`? How does it remove local file system paths from OpenTrace's binary for reproducible builds and security (no dev machine paths in production binary)?
441. `[CONCEPT]` `{L2}` What is `GOFLAGS`? How does OpenTrace's CI set global Go build flags: `GOFLAGS=-trimpath`?
442. `[CONCEPT]` `{L2}` What is `go env`? How do you inspect OpenTrace's build environment: `GOPATH`, `GOROOT`, `GOOS`, `GOARCH`, `CGO_ENABLED`, `GOPROXY`?
443. `[CODE]` `{L2}` Run `go env -json` in OpenTrace's CI and parse the JSON to verify `CGO_ENABLED=0` (fully static binary) and `GOARCH=amd64` (correct architecture for Docker image).
444. `[CONCEPT]` `{L2}` What is `CGO_ENABLED=0`? How does it produce a fully static binary for OpenTrace? What C libraries does this prevent linking (libc, libpthread)?
445. `[CODE]` `{L2}` Build a fully static OpenTrace binary: `CGO_ENABLED=0 GOOS=linux go build -a -o openTrace-collector ./cmd/collector`. Verify with `file openTrace-collector` (should show "statically linked").
446. `[CONCEPT]` `{L2}` What is `go vet`? What does it check that `golangci-lint` doesn't? How does OpenTrace's CI run `go vet ./...`?
447. `[CONCEPT]` `{L2}` What is `go tool covdata`? How does OpenTrace collect coverage data from integration tests running against a live binary (not `go test -cover`)?
448. `[CODE]` `{L2}` Instrument OpenTrace's collector binary with coverage: `go build -cover -o openTrace-collector ./cmd/collector`. Set `GOCOVERDIR=/tmp/coverage`. Merge after test: `go tool covdata merge`.
449. `[CONCEPT]` `{L2}` What is `go fuzz`? How does OpenTrace use fuzzing to find panics in the span proto unmarshaling code by generating random inputs?
450. `[CODE]` `{L2}` Write a Go fuzz test for OpenTrace's span unmarshaling: `func FuzzUnmarshalSpan(f *testing.F) { f.Fuzz(func(t *testing.T, data []byte) { proto.Unmarshal(data, &Span{}) }) }`. Run with `go test -fuzz=FuzzUnmarshalSpan`.
451. `[CONCEPT]` `{L2}` What is `go tool pprof -svg`? How do you generate a SVG call graph from OpenTrace's CPU profile for sharing in a PR?
452. `[CODE]` `{L2}` Generate an SVG call graph for OpenTrace: `go tool pprof -svg cpu.prof > callgraph.svg`. Attach to the GitHub PR when submitting a performance optimization.
453. `[CONCEPT]` `{L2}` What is continuous benchmarking? How does `benchstat` compare two sets of benchmark results for OpenTrace?
454. `[CODE]` `{L2}` Use `benchstat` for OpenTrace: `go test -bench=. -count=10 ./... > before.txt` on main, same on PR branch `> after.txt`, then `benchstat before.txt after.txt` to see regressions.
455. `[CONCEPT]` `{L2}` What is `go tool link -X`? How does OpenTrace inject build metadata: `go build -ldflags="-X github.com/org/openTrace/version.Build=$(git rev-parse HEAD)"`?
456. `[APPLY]` `{L2}` Walk through the investigation for "OpenTrace Collector using 2x expected memory": pprof heap profile, goroutine dump, `/proc/self/status`, `runtime.ReadMemStats`. What is the diagnosis process?
457. `[APPLY]` `{L2}` Walk through the investigation for "OpenTrace Collector p99 latency suddenly 100ms (was 5ms)": CPU profile (new hot path?), goroutine dump (lock contention?), iostat (disk bottleneck?), metrics (Kafka lag? GC?).
458. `[APPLY]` `{L2}` Walk through the investigation for "OpenTrace Collector crashes with SIGSEGV": this should not happen in pure Go. Check for cgo, `unsafe` misuse, kernel bug, or a Go compiler bug. What is the investigation?
459. `[APPLY]` `{L2}` Walk through the investigation for "OpenTrace Collector has 100K goroutines (expected < 1K)": goroutine dump to find stuck goroutines, find the code path creating them, add leak test with `goleak`.
460. `[APPLY]` `{L2}` Design the complete observability stack for OpenTrace's OS-level metrics: Prometheus `node_exporter` for CPU/memory/disk/network, Go runtime metrics via `go_collector`, custom `/metrics` for application metrics.
461. `[APPLY]` `{L2}` Design the OpenTrace Collector's startup sequence: read config → validate config → connect Kafka (retry 3×, fail if unavailable) → connect PostgreSQL → start HTTP server → start gRPC server → emit "ready" log.
462. `[APPLY]` `{L2}` Design the OpenTrace Collector's shutdown sequence: receive SIGTERM → log "shutting down" → stop accepting new connections → wait for in-flight gRPC calls (max 30s) → flush Kafka (max 30s) → close DB connections → exit 0.
463. `[APPLY]` `{L2}` Design the memory allocation strategy for OpenTrace's hot path: what objects can be pooled (sync.Pool), what can be pre-allocated (slices with known max size), what must be heap-allocated (spans with variable lifetime)?
464. `[APPLY]` `{L2}` Design the CPU affinity strategy for OpenTrace's Kubernetes deployment: Guaranteed QoS class with integer CPU request = limit, enable `cpuManagerPolicy: static` on the node, pin goroutines to exclusive CPU cores.
465. `[APPLY]` `{L2}` Design the file I/O strategy for OpenTrace's LSM-tree biweekly project: MemTable flushes sequentially, SSTable reads are random (mmap), compaction is sequential write. What `O_*` flags and `madvise` hints?
466. `[APPLY]` `{L2}` Design the signal handling for OpenTrace Collector: SIGTERM → graceful shutdown (30s), SIGINT → immediate shutdown (5s), SIGHUP → config reload, SIGUSR1 → flush metrics, SIGUSR2 → goroutine dump.
467. `[APPLY]` `{L2}` Design the OpenTrace Collector's process monitoring: systemd with `Restart=on-failure`, `RestartSec=5`, `StartLimitIntervalSec=300`, `StartLimitBurst=5` (max 5 restarts in 5 minutes before systemd gives up).
468. `[APPLY]` `{L2}` Design the inode usage monitoring for OpenTrace's ClickHouse: ClickHouse creates one directory per data part. Alert if inode usage exceeds 50% to prevent inode exhaustion before disk exhaustion.
469. `[APPLY]` `{L2}` Design the file descriptor monitoring for OpenTrace: `proc_self_fd_count = len(ls /proc/self/fd)`, alert if > 80% of `ulimit -n`. Each Kafka partition consumer, DB connection, and HTTP connection uses one FD.
470. `[APPLY]` `{L2}` Design the OpenTrace Collector's resource limits in Kubernetes: CPU request=100m limit=500m (allows burst), memory request=256Mi limit=1Gi (OOMKill if exceeded), GOMEMLIMIT=900Mi (GC before OOMKill).
471. `[CONCEPT]` `{L2}` What is the Go `expvar` package? How does it expose internal variables (counters, rates) from OpenTrace Collector at `GET /debug/vars`?
472. `[CODE]` `{L2}` Add `expvar` counters to OpenTrace Collector: `spansReceived = expvar.NewInt("spans_received_total")`, increment in span handler, visible at `/debug/vars`.
473. `[CONCEPT]` `{L2}` What is `net/http/pprof`? What endpoints does it provide: `/debug/pprof/`, `/debug/pprof/heap`, `/debug/pprof/goroutine`, `/debug/pprof/profile`, `/debug/pprof/trace`?
474. `[CODE]` `{L2}` Secure OpenTrace's pprof endpoint: expose only on a separate port bound to localhost (`127.0.0.1:6060`). Never expose pprof on the public port. Use `kubectl port-forward` for remote access.
475. `[CONCEPT]` `{L2}` What is `runtime/debug.PrintStack()`? How does OpenTrace use it to log a stack trace when an unexpected error occurs in production?
476. `[CODE]` `{L2}` Add stack trace logging to OpenTrace's panic recovery middleware: `debug.Stack()` returns the full stack trace as bytes. Log it with `slog.Error("panic", "stack", string(debug.Stack()))`.
477. `[CONCEPT]` `{L2}` What is `go tool objdump`? How do you disassemble OpenTrace's `processSpan` function to verify it compiles to efficient machine code?
478. `[CODE]` `{L2}` Disassemble OpenTrace's hot function: `go tool objdump -s 'processSpan' openTrace-collector | head -50`. Look for unnecessary memory loads, function call overhead, branch mispredictions.
479. `[CONCEPT]` `{L2}` What is `bounds check elimination (BCE)` in Go? How do you use `//go:nosplit` and `//go:nocheckptr` hints to eliminate safety checks in OpenTrace's hot path?
480. `[CONCEPT]` `{L2}` What is `go:linkname`? When is it the ONLY option? (Accessing unexported runtime internals). Why is it dangerous for OpenTrace's long-term maintenance?
481. `[APPLY]` `{L2}` Walk through OpenTrace Biweekly Project 1 (TCP Connection Pool): describe the OS-level components — `net.Listener`, `net.Conn`, `SetDeadline`, buffer pool, pgwire parsing, graceful shutdown with `sync.WaitGroup`.
482. `[APPLY]` `{L2}` Walk through OpenTrace Biweekly Project 4 (DNS Resolver): describe the OS-level components — `net.ListenPacket("udp")`, DNS wire format parsing, label encoding, CNAME resolution, TTL-based caching.
483. `[APPLY]` `{L2}` Walk through OpenTrace Biweekly Project 7 (Distributed Lock Service): describe the OS-level components — HTTP server, Redis connection via TCP, Lua script for atomic operations, goroutine for TTL watchdog.
484. `[APPLY]` `{L2}` Walk through OpenTrace Biweekly Project 10 (LSM-tree Storage Engine): describe the OS-level components — `sync.Mutex` for MemTable, `os.File` for WAL, `mmap` for SSTable, goroutine for compaction.
485. `[APPLY]` `{L2}` Describe the OS interactions when OpenTrace Collector starts: create `net.Listener` (bind + listen syscalls), spawn goroutines (no OS thread fork), connect to Kafka (TCP connect), mmap config file, register signal handlers.
486. `[APPLY]` `{L2}` Describe what happens at the OS level when OpenTrace receives a gRPC span batch: `accept()` → goroutine wakes from `epoll_wait` → `read()` → Protobuf unmarshal → Kafka `write()` → `write()` response.
487. `[APPLY]` `{L2}` Describe the OS-level impact of 10K concurrent WebSocket connections on OpenTrace: 10K file descriptors open, 10K goroutines (2KB each = 20MB stack), epoll monitoring all sockets, `write()` for each message.
488. `[APPLY]` `{L2}` Design the optimal Linux kernel configuration for OpenTrace's production host: sysctl parameters (net, vm, fs), CPU governor, NUMA settings, huge pages, cgroup v2, ulimits, kernel version.
489. `[APPLY]` `{L2}` Design OpenTrace's cgroup v2 configuration: set `cpu.max` for CPU throttling protection, `memory.max` for hard memory limit, `memory.swap.max=0` to disable swap, `io.max` to prevent ClickHouse from monopolizing I/O.
490. `[APPLY]` `{L2}` Design the complete crash analysis procedure for an OpenTrace Collector pod crash: collect core dump (if enabled), analyze with `go tool pprof`, check dmesg for OOMKill, check logs for panic message, add test to reproduce.
491. `[APPLY]` `{L2}` Design the OpenTrace Collector's thread model: GOMAXPROCS=8 (8 P's), 10K goroutines multiplexed on 8 OS threads, epoll thread for network I/O, background goroutines for Kafka flush and metrics export.
492. `[APPLY]` `{L2}` Design the memory layout of OpenTrace Collector's process: code segment (binary, ~20MB), data segment (global variables), heap (Go GC managed, ~500MB), goroutine stacks (~20MB for 10K goroutines × 2KB), mmap (SSTable files).
493. `[APPLY]` `{L2}` Describe the execution flow of a single span through OpenTrace from OS perspective: gRPC `recv()` syscall → goroutine wakeup from `epoll_wait` → heap allocation for Span proto → Kafka `write()` → goroutine parks on channel send → scheduler runs next goroutine.
494. `[APPLY]` `{L2}` Design the OpenTrace Collector's performance SLO: p99 gRPC handler latency < 5ms, GC STW pause < 1ms, goroutine count < 20K, RSS < 800MB, CPU utilization < 70% (30% headroom for spikes).
495. `[APPLY]` `{L2}` Design the OpenTrace capacity test: measure maximum spans/sec the Collector handles before: (a) CPU saturation, (b) memory OOMKill, (c) goroutine count explosion, (d) file descriptor exhaustion. Document results in BENCHMARKS.md.
496. `[APPLY]` `{L2}` Design the performance regression detection system for OpenTrace: weekly automated benchmarks on dedicated hardware, compare to rolling 4-week baseline, alert on >5% regression, create GitHub issue automatically.
497. `[APPLY]` `{L2}` Design the OpenTrace hot-path optimization checklist: (1) zero allocations in processSpan, (2) sync.Pool for proto buffers, (3) no reflection, (4) no fmt.Sprintf in hot path, (5) pre-sized slices, (6) profile before and after.
498. `[APPLY]` `{L2}` Walk through how you would identify and fix a GC pressure problem in OpenTrace that is causing 50ms p99 latency spikes: pprof allocs profile, find allocation site, add sync.Pool, re-benchmark, verify GC pause reduction.
499. `[APPLY]` `{L2}` Walk through the OS-level implications of OpenTrace's graceful shutdown: stop `net.Listener.Accept()` → drain in-flight gRPC calls via `WaitGroup` → `Flush()` Kafka producer (waits for broker ack) → `db.Close()` releases all FDs → process exits 0.
500. `[APPLY]` `{L1}` Final synthesis: A developer joins the OpenTrace team. Explain, from first principles, what happens at the OS level when OpenTrace Collector processes one span: from the network packet arriving at the NIC, through every OS subsystem (interrupt, softirq, TCP stack, socket buffer, epoll, goroutine scheduler, memory allocator, GC, disk I/O for WAL), to the acknowledgement sent back to the SDK.
