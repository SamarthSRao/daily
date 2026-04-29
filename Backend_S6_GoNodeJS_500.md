# Backend Engineering — Section 6: Go & Node.js Language Deep
### 500 Questions | Go Internals · Node.js V8 · TypeScript · Streams · Concurrency · Testing
> Mapped to Backend 2026 Roadmap Stage 4 | Infraspec Target
> Tagged: [CONCEPT] [CODE] [DEBUG] [TRADEOFF] [OUTPUT] [APPLY]
> Levels: {L1} must know · {L2} mid/senior · {L3} staff/specialist

---

# PART A — Go: Language Foundations (Q1–Q100)

---

## Types, Interfaces & Error Handling (Q1–Q40)

1. `[CONCEPT]` `{L1}` What are Go's zero values? What does each type default to: int, float64, bool, string, pointer, slice, map, channel, interface?
2. `[OUTPUT]` `{L1}` What prints?
    ```go
    var s []int
    var m map[string]int
    fmt.Println(s == nil, len(s), m == nil, len(m))
    ```
3. `[CONCEPT]` `{L1}` What is the difference between `nil` slice and empty slice in Go? When does each matter?
4. `[CODE]` `{L1}` Write a function that appends to a nil slice and an empty slice. Are the results identical?
5. `[CONCEPT]` `{L1}` What is a Go interface? What is implicit interface satisfaction? How does Go's duck typing work?
6. `[CODE]` `{L1}` Define a `SpanExporter` interface for OpenTrace with `Export(ctx, spans) error`. Implement it for ClickHouse and a no-op test double.
7. `[CONCEPT]` `{L1}` What is an empty interface (`interface{}` / `any`)? When would you use it vs a generic type parameter?
8. `[CONCEPT]` `{L2}` What is an interface with a nil pointer value vs a nil interface? What is the "nil interface gotcha"?
9. `[OUTPUT]` `{L2}` What prints and why?
    ```go
    var p *int = nil
    var i interface{} = p
    fmt.Println(i == nil)   // ?
    fmt.Println(p == nil)   // ?
    ```
10. `[CONCEPT]` `{L1}` What is type assertion in Go? What is the one-value vs two-value form? What panics?
11. `[CODE]` `{L1}` Write a type switch for OpenTrace's span attribute value: handle string, int64, float64, bool, []byte.
12. `[CONCEPT]` `{L1}` What is error handling in Go? Why does Go not use exceptions?
13. `[CODE]` `{L1}` Wrap an error with `fmt.Errorf("query spans: %w", err)`. Unwrap with `errors.Is` and `errors.As`.
14. `[CONCEPT]` `{L1}` What is `errors.Is` vs `errors.As`? When do you use each?
15. `[CODE]` `{L2}` Define a custom error type `SpanValidationError` for OpenTrace with `Field`, `Message`, and `Code` fields. Implement `error` interface.
16. `[CODE]` `{L2}` Create an error chain: `pgError → dbError → queryError`. Show unwrapping with `errors.As(err, &pgError)`.
17. `[CONCEPT]` `{L2}` What is `errors.Join` (Go 1.20)? When is it useful for returning multiple errors from a batch operation?
18. `[CODE]` `{L2}` Use `errors.Join` in OpenTrace's batch span validator: collect all span validation errors, return as one joined error at the end.
19. `[CONCEPT]` `{L2}` What is the `sentinel error` pattern? How does OpenTrace use `var ErrTraceNotFound = errors.New("trace not found")` for known error types?
20. `[CODE]` `{L2}` Implement error codes in OpenTrace: use `fmt.Errorf("%w: trace_id %s", ErrTraceNotFound, traceID)`. Check with `errors.Is(err, ErrTraceNotFound)`.
21. `[CONCEPT]` `{L1}` What is a Go `struct`? What is embedding? How does embedding differ from composition with a named field?
22. `[CODE]` `{L2}` Embed a `BaseSpan` struct in OpenTrace's `HttpSpan` and `GrpcSpan`. Show that embedded methods are promoted.
23. `[CONCEPT]` `{L2}` What is method set in Go? Which methods does `T` have vs `*T`? When does this matter for interface satisfaction?
24. `[OUTPUT]` `{L2}` What happens?
    ```go
    type Writer interface { Write([]byte) }
    type S struct{}
    func (s *S) Write([]byte) {}
    var w Writer = S{} // compile error?
    ```
25. `[CONCEPT]` `{L1}` What is a named return value in Go? What is naked return? When is it a bad pattern?
26. `[CODE]` `{L2}` Refactor a function using named returns in OpenTrace to avoid the naked return antipattern.
27. `[CONCEPT]` `{L1}` What is `defer` in Go? What is LIFO order? What is the `defer` and loop antipattern?
28. `[OUTPUT]` `{L1}` What prints?
    ```go
    func f() {
        for i := 0; i < 3; i++ {
            defer fmt.Println(i)
        }
    }
    f()
    ```
29. `[CODE]` `{L2}` Use `defer` for cleanup in OpenTrace: open WAL file, defer close, defer unlock mutex. Show LIFO order matters.
30. `[CONCEPT]` `{L2}` What is `recover()` in Go? How does it work with `panic` and `defer`? When does OpenTrace use it in HTTP middleware?
31. `[CODE]` `{L2}` Write a panic recovery middleware for OpenTrace: `defer func() { if r := recover(); r != nil { log.Error("panic", "err", r, "stack", debug.Stack()); w.WriteHeader(500) } }()`.
32. `[CONCEPT]` `{L1}` What is a Go slice header? What are length, capacity, and underlying array?
33. `[OUTPUT]` `{L2}` What prints?
    ```go
    a := []int{1, 2, 3}
    b := a[1:3]
    b[0] = 99
    fmt.Println(a) // ?
    ```
34. `[CODE]` `{L2}` Implement `slices.Clone` (deep copy) for OpenTrace's span slice to avoid the slice aliasing trap.
35. `[CONCEPT]` `{L2}` What is `append` behavior when capacity is exceeded? What is the "append gotcha" with shared backing arrays?
36. `[CODE]` `{L2}` Demonstrate the append gotcha: two slices share backing array, append to one modifies the other.
37. `[CONCEPT]` `{L2}` What is `copy` vs `append` in Go? When do you use each for slice duplication?
38. `[CONCEPT]` `{L2}` What is `make([]T, len, cap)` vs `make([]T, len)`? When does pre-allocating with known capacity improve performance?
39. `[CODE]` `{L2}` Pre-allocate span slice in OpenTrace: `spans := make([]*Span, 0, expectedCount)`. Show memory allocation reduction in benchmark.
40. `[CONCEPT]` `{L2}` What is `strings.Builder` vs `bytes.Buffer` vs `+` concatenation for string building? When does OpenTrace use each?

---

## Go Generics (Q41–Q60)

41. `[CONCEPT]` `{L2}` What are Go generics? What is a type parameter? What is a constraint?
42. `[CODE]` `{L2}` Write a generic `Map[T, R](slice []T, fn func(T) R) []R` function. Use it in OpenTrace to convert `[]*Span` to `[]string` (trace IDs).
43. `[CODE]` `{L2}` Write a generic `Filter[T](slice []T, fn func(T) bool) []T`. Use it in OpenTrace to filter spans by service name.
44. `[CODE]` `{L2}` Write a generic `Reduce[T, R](slice []T, initial R, fn func(R, T) R) R`. Use it to sum span durations.
45. `[CONCEPT]` `{L2}` What is the `comparable` constraint? When does OpenTrace use it for generic map operations?
46. `[CODE]` `{L2}` Write a generic `Set[T comparable]` type with `Add`, `Has`, `Delete`. Use it in OpenTrace to deduplicate trace IDs.
47. `[CODE]` `{L2}` Write a generic `Result[T any]` type: `{Value T, Err error}`. Use it in OpenTrace's async span processing pipeline.
48. `[CONCEPT]` `{L2}` What is a union constraint in Go generics? Write `type Number interface { int | int64 | float64 }`.
49. `[CODE]` `{L2}` Write a generic `Min[T constraints.Ordered](a, b T) T`. Use it in OpenTrace to find the earliest span start time.
50. `[CONCEPT]` `{L2}` What are the limitations of Go generics: no parameterized methods, no variance, no higher-kinded types?
51. `[CODE]` `{L2}` Write a generic batch processor for OpenTrace: `Process[T, R any](ctx context.Context, items []T, fn func(context.Context, T) (R, error)) ([]R, error)`.
52. `[CODE]` `{L2}` Write a generic `Cache[K comparable, V any]` with `Get`, `Set`, `TTL` expiry. Use for OpenTrace's trace cache.
53. `[CODE]` `{L2}` Write a generic `Pool[T any]` wrapping `sync.Pool` with proper typing. Use in OpenTrace's Protobuf buffer pool.
54. `[CONCEPT]` `{L2}` When are generics better than `interface{}` in Go? When does using generics reduce allocations?
55. `[CODE]` `{L2}` Write a generic `Optional[T any]` type: `{value T, present bool}`. Compare to pointer `*T` for expressing "value or nothing".
56. `[CODE]` `{L2}` Write a generic concurrent map `SafeMap[K comparable, V any]` using `sync.RWMutex`. Use in OpenTrace's service registry.
57. `[CODE]` `{L2}` Write a generic `Chan[T any]` wrapper that adds context-aware send/receive with timeout. Use in OpenTrace's span pipeline.
58. `[CONCEPT]` `{L2}` What is type inference in Go generics? When can you omit the type parameter?
59. `[CODE]` `{L2}` Use `slices.SortFunc`, `slices.GroupBy` (from `golang.org/x/exp`) in OpenTrace's span sorting. Compare to manual sorting.
60. `[CONCEPT]` `{L2}` What is the performance overhead of Go generics vs code duplication vs `interface{}`? Measure with a benchmark.

---

## Go Concurrency Patterns (Q61–Q100)

61. `[CONCEPT]` `{L1}` What is the Go proverb "Do not communicate by sharing memory; instead, share memory by communicating"? Give an OpenTrace example.
62. `[CODE]` `{L1}` Implement a producer-consumer pipeline for OpenTrace: producer goroutine writes spans to channel, consumer goroutine reads and processes.
63. `[CODE]` `{L2}` Implement the fan-out pattern for OpenTrace: one input channel, 8 worker goroutines each reading from the same channel.
64. `[CODE]` `{L2}` Implement the fan-in pattern for OpenTrace: 8 worker goroutines each writing to their own channel, merge all into one output channel.
65. `[CODE]` `{L2}` Implement a pipeline with cancellation: each stage propagates `ctx.Done()` to immediately drain and exit cleanly.
66. `[CODE]` `{L2}` Implement a semaphore to limit concurrent ClickHouse queries in OpenTrace: `sem := make(chan struct{}, 50)`.
67. `[CODE]` `{L2}` Implement a rate-limited worker pool: process at most N spans/sec using a `time.Ticker`.
68. `[CODE]` `{L2}` Implement the "or-done" pattern: read from a channel but respect context cancellation without goroutine leak.
69. `[CODE]` `{L2}` Implement a "tee" channel: send each span to two downstream channels simultaneously.
70. `[CODE]` `{L2}` Implement a "bridge" channel: flatten a channel of channels into a single output channel.
71. `[CODE]` `{L2}` Implement a "done" channel timeout: if no value arrives within 5 seconds, send a timeout signal.
72. `[CODE]` `{L2}` Implement `errgroup.WithContext` for OpenTrace's 3-service parallel startup. If gRPC server fails, cancel HTTP and Kafka.
73. `[CODE]` `{L2}` Implement a `singleflight` wrapper for OpenTrace's trace query: deduplicate concurrent identical requests.
74. `[CODE]` `{L2}` Implement a worker pool with dynamic sizing: scale workers up/down based on queue depth.
75. `[CODE]` `{L2}` Implement a graceful-draining queue: stop accepting after context cancel, process remaining items before exit.
76. `[CONCEPT]` `{L2}` What is the "select default" pattern vs blocking select? When does OpenTrace use non-blocking channel operations?
77. `[CODE]` `{L2}` Implement non-blocking span send in OpenTrace: `select { case ch <- span: default: drop() }`. Expose drop rate as metric.
78. `[CONCEPT]` `{L2}` What is the "heartbeat" goroutine pattern? How does OpenTrace's watchdog goroutine renew a distributed lock?
79. `[CODE]` `{L2}` Implement a heartbeat goroutine for OpenTrace's distributed lock: renew Redis lock TTL every 1/3 of TTL, stop when lock holder goroutine signals done.
80. `[CONCEPT]` `{L2}` What is the "context propagation" pattern? How do you ensure every goroutine in OpenTrace's pipeline is cancellable?
81. `[CODE]` `{L2}` Implement context propagation through OpenTrace's full pipeline: from HTTP request context → Kafka produce → async worker → ClickHouse write. All cancel together.
82. `[CODE]` `{L2}` Implement a "retry with backoff" goroutine: retry a function with exponential backoff and jitter, respect context cancellation.
83. `[CODE]` `{L2}` Implement the "poison pill" shutdown pattern: send a special value to signal workers to exit cleanly.
84. `[CONCEPT]` `{L2}` What is goroutine leak detection with `goleak`? What patterns does it catch that `go test -race` does not?
85. `[CODE]` `{L2}` Add `goleak.VerifyNone(t)` to all OpenTrace tests. Fix the leak:
    ```go
    func TestSpanProcessor(t *testing.T) {
        defer goleak.VerifyNone(t)
        p := NewProcessor()
        p.Start() // starts goroutine
        // BUG: p.Stop() never called
    }
    ```
86. `[CODE]` `{L2}` Implement the "context-aware ticker" pattern: a ticker that automatically stops when context is cancelled, no manual `ticker.Stop()` required.
87. `[CODE]` `{L2}` Implement a bounded concurrent batch processor: collect spans for 500ms OR until 10K spans, whichever comes first, then flush.
88. `[CONCEPT]` `{L2}` What is the `once.Do` pattern for lazy initialization? When does OpenTrace use it for the Redis pool?
89. `[CODE]` `{L2}` Implement a lazy-initialized ClickHouse client in OpenTrace with `sync.Once`. First call creates connection pool, subsequent calls reuse it.
90. `[CONCEPT]` `{L2}` What is channel direction typing (`chan<-` vs `<-chan`)? How does it enforce correctness in OpenTrace's pipeline?
91. `[CODE]` `{L2}` Use directional channels to enforce pipeline contracts:
    ```go
    func produce(ctx context.Context) <-chan *Span
    func process(ctx context.Context, in <-chan *Span) <-chan *ProcessedSpan
    func flush(ctx context.Context, in <-chan *ProcessedSpan)
    ```
92. `[DEBUG]` `{L2}` Find the deadlock:
    ```go
    ch := make(chan int)
    ch <- 1   // goroutine 1
    <-ch      // goroutine 2 (never reached)
    ```
    Fix with a goroutine or buffer.
93. `[CONCEPT]` `{L2}` What is the Go memory model guarantee for goroutine creation? When does the spawning goroutine "happen-before" the spawned?
94. `[CODE]` `{L2}` Demonstrate a data race that Go's memory model shows is unsafe:
    ```go
    x := 0
    go func() { x = 1 }()
    fmt.Println(x) // data race — x may be 0 or 1
    ```
95. `[CODE]` `{L2}` Fix the data race using a channel synchronization instead of a sleep:
    ```go
    done := make(chan struct{})
    go func() { x = 1; close(done) }()
    <-done
    ```
96. `[CONCEPT]` `{L2}` What is `runtime.NumGoroutine()`? How does OpenTrace monitor goroutine count in production Prometheus metrics?
97. `[CODE]` `{L2}` Implement a goroutine count gauge in OpenTrace: `prometheus.NewGaugeFunc(opts, func() float64 { return float64(runtime.NumGoroutine()) })`.
98. `[CONCEPT]` `{L2}` What is `go:linkname`? What runtime functions does `sync.Pool` expose? Why should you not use `go:linkname` in OpenTrace?
99. `[TRADEOFF]` `{L2}` Mutex-based shared state vs channel-based message passing: when does OpenTrace use each? Give three examples of each from the codebase.
100. `[APPLY]` `{L2}` Walk through OpenTrace Collector's concurrency model: gRPC handler goroutines (per request) → buffered channel → worker pool goroutines → Kafka producer goroutines → flush goroutines. Count goroutines at 10K concurrent connections.

---

# PART B — Go: Runtime, Performance & Tooling (Q101–Q180)

---

## Go Runtime Deep (Q101–Q140)

101. `[CONCEPT]` `{L1}` What is the Go M:N goroutine scheduler? What are M (OS thread), P (logical processor), G (goroutine)?
102. `[CONCEPT]` `{L2}` What is work-stealing in Go's scheduler? How does an idle P steal goroutines from another P's local run queue?
103. `[CONCEPT]` `{L2}` What is goroutine preemption in Go? What is asynchronous preemption (Go 1.14)? How does it prevent a CPU-bound goroutine from starving others?
104. `[CONCEPT]` `{L2}` What is a "system call" goroutine handoff? When a goroutine makes a blocking syscall, what happens to its P?
105. `[CODE]` `{L2}` Set `GOMAXPROCS` correctly for OpenTrace in Kubernetes: use `uber-go/automaxprocs` to auto-detect container CPU quota.
106. `[CONCEPT]` `{L2}` What is `GODEBUG=schedtrace=1000`? How do you use it to observe OpenTrace's goroutine scheduling?
107. `[CONCEPT]` `{L2}` What is `GODEBUG=gccheckmark=1`? What is `GODEBUG=madvise=0`? When would you use each?
108. `[CODE]` `{L2}` Enable scheduler tracing for OpenTrace: `GODEBUG=schedtrace=1000,scheddetail=1 ./openTrace-collector`. Observe goroutine distribution across Ps.
109. `[CONCEPT]` `{L2}` What is `runtime.Gosched()`? When does OpenTrace call it in a tight computation loop to allow other goroutines to run?
110. `[CONCEPT]` `{L2}` What is the goroutine stack size policy: start 2KB, grow by copying to a larger contiguous block. What is the maximum stack size (default 1GB)?
111. `[CODE]` `{L2}` Set a lower max stack size for OpenTrace to catch runaway recursion early: `debug.SetMaxStack(128 * 1024 * 1024)` (128MB instead of 1GB).
112. `[CONCEPT]` `{L2}` What is `runtime.GC()` vs `runtime/debug.FreeOSMemory()`? When does OpenTrace call each after a large batch export?
113. `[CONCEPT]` `{L2}` What is `GOGC` vs `GOMEMLIMIT`? How do they interact? Which takes precedence?
114. `[CODE]` `{L2}` Configure OpenTrace Collector for minimal GC latency: `GOGC=off GOMEMLIMIT=900MiB`. GC only triggers near the memory limit.
115. `[CONCEPT]` `{L2}` What is `runtime.ReadMemStats`? What are `NumGC`, `PauseNs`, `GCCPUFraction`? Which does OpenTrace monitor for SLO alerts?
116. `[CODE]` `{L2}` Export GC metrics from OpenTrace: scrape `runtime.ReadMemStats` every 15s, expose `go_gc_duration_seconds` histogram and `go_gc_cpu_fraction` gauge.
117. `[CONCEPT]` `{L2}` What is the `go tool trace` execution tracer? How does it differ from `pprof` CPU profiling?
118. `[CODE]` `{L2}` Generate a 5-second execution trace for OpenTrace under load. Open with `go tool trace`. Identify GC pauses and goroutine scheduling delays.
119. `[CONCEPT]` `{L2}` What is `GOTRACEBACK=all`? How does it dump all goroutine stacks on crash for OpenTrace's post-mortem analysis?
120. `[CODE]` `{L2}` Set `GOTRACEBACK=all` in OpenTrace's Kubernetes pod via env var. This ensures goroutine dump on panic is written to stderr and captured by Loki.
121. `[CONCEPT]` `{L2}` What is `runtime/debug.SetGCPercent(-1)`? When would you use it to disable GC entirely in OpenTrace's hot span processing loop?
122. `[CODE]` `{L2}` Implement a GC-free span processing window in OpenTrace: `debug.SetGCPercent(-1)` before batch, process 10K spans, `debug.SetGCPercent(100)` after. Measure latency improvement.
123. `[CONCEPT]` `{L3}` What is Go's arena allocator (experimental, Go 1.21)? How does it enable bulk allocation with a single free for OpenTrace's request-scoped objects?
124. `[CONCEPT]` `{L2}` What is escape analysis? What is `//go:noescape`? How does OpenTrace use `go build -gcflags="-m"` to find unexpected escapes?
125. `[CODE]` `{L2}` Run `go build -gcflags="-m" ./collector` on OpenTrace. Find 3 allocations in the span ingestion hot path that can be eliminated.
126. `[CONCEPT]` `{L2}` What is `unsafe.Sizeof`, `unsafe.Alignof`, `unsafe.Offsetof`? How does OpenTrace use them to verify struct layout?
127. `[CODE]` `{L2}` Verify OpenTrace's `Span` struct is 64-byte aligned using `unsafe.Sizeof`. Add padding if needed to avoid false sharing.
128. `[CONCEPT]` `{L2}` What is inlining in Go? What is `//go:noinline`? How does inlining affect OpenTrace's profiling accuracy?
129. `[CODE]` `{L2}` Add `//go:noinline` to OpenTrace's `processSpan()` for accurate pprof attribution. Compare profile before/after.
130. `[CONCEPT]` `{L3}` What is link-time optimization (LTO) in Go? What does `go build -gcflags=all=-dwarf=0` do?
131. `[CONCEPT]` `{L2}` What is `go build -tags prod`? How does OpenTrace use build tags to exclude debug endpoints from production builds?
132. `[CODE]` `{L2}` Add build tags to OpenTrace: `//go:build !prod` on the pprof endpoint registration. Build with `-tags prod` for production images.
133. `[CONCEPT]` `{L2}` What is `go test -count=N`? Why does OpenTrace's CI run `go test -count=1` (disable test cache)?
134. `[CODE]` `{L2}` Write a benchmark that forces the compiler to not optimize away results in OpenTrace: use `b.ReportAllocs()` and prevent dead code elimination with `runtime.KeepAlive(result)`.
135. `[CONCEPT]` `{L2}` What is `benchstat` for statistical analysis of benchmarks? How does OpenTrace use it to detect performance regressions?
136. `[CODE]` `{L2}` Automate benchmark regression detection in OpenTrace CI: run benchmarks on both base branch and PR, compare with `benchstat base.txt pr.txt`, fail if any metric degrades > 5%.
137. `[CONCEPT]` `{L2}` What is `go test -fuzz`? How does fuzz testing work in Go? What has it caught in OpenTrace's span unmarshaling?
138. `[CODE]` `{L2}` Write a fuzz test for OpenTrace's span proto unmarshaler: `func FuzzUnmarshal(f *testing.F) { f.Fuzz(func(t *testing.T, data []byte) { proto.Unmarshal(data, &Span{}) }) }`.
139. `[CONCEPT]` `{L2}` What is `go tool pprof -diff_base`? How does OpenTrace compare heap profiles between two commits to find the regression?
140. `[CODE]` `{L2}` Integrate benchmark profiles into OpenTrace's CI: save base branch CPU profile, compare PR branch profile with `pprof -diff_base`. Upload diff as PR artifact.

---

## Go Testing & Project Structure (Q141–Q180)

141. `[CONCEPT]` `{L1}` What is table-driven testing in Go? What are the advantages over individual test functions?
142. `[CODE]` `{L1}` Write a table-driven test for OpenTrace's span duration calculator:
    ```go
    tests := []struct{ name string; start, end int64; want int64 }{ ... }
    for _, tt := range tests { t.Run(tt.name, func(t *testing.T) { ... }) }
    ```
143. `[CONCEPT]` `{L1}` What is `testify/assert` vs `testify/require`? When does each stop the test on failure?
144. `[CODE]` `{L1}` Use `testify/assert` for soft assertions and `testify/require` for hard assertions in OpenTrace's span store test.
145. `[CONCEPT]` `{L2}` What is `testcontainers-go`? How does OpenTrace use it for integration tests with real ClickHouse?
146. `[CODE]` `{L2}` Write an integration test for OpenTrace's span store: start ClickHouse via testcontainers, insert 100 spans, query by trace_id, assert results.
147. `[CONCEPT]` `{L2}` What is a test fixture? How does OpenTrace's test suite manage shared ClickHouse container across tests using `TestMain`?
148. `[CODE]` `{L2}` Implement `TestMain` for OpenTrace's integration tests: start containers once, run all tests, stop containers. Share client via package-level variable.
149. `[CONCEPT]` `{L2}` What is `testing.Short()`? How does OpenTrace skip integration tests when `go test -short` is passed in CI for quick unit test runs?
150. `[CODE]` `{L2}` Add short-mode skip to OpenTrace's ClickHouse integration tests:
    ```go
    if testing.Short() { t.Skip("skipping integration test in short mode") }
    ```
151. `[CONCEPT]` `{L2}` What is `t.Parallel()`? How does OpenTrace parallelize independent unit tests to reduce test suite runtime?
152. `[CODE]` `{L2}` Add `t.Parallel()` to all independent OpenTrace unit tests. Verify no shared state causes flakiness.
153. `[CONCEPT]` `{L2}` What is `t.Helper()`? When should test helper functions call `t.Helper()` in OpenTrace?
154. `[CODE]` `{L2}` Write an `assertSpanEqual(t testing.TB, got, want *Span)` helper for OpenTrace. Call `t.Helper()` to make failure lines point to the caller.
155. `[CONCEPT]` `{L2}` What is `testing.T.Cleanup`? How does OpenTrace register cleanup functions for temp files and test containers?
156. `[CODE]` `{L2}` Use `t.Cleanup` in OpenTrace: `t.Cleanup(func() { container.Terminate(ctx) })`. This runs even if the test panics.
157. `[CONCEPT]` `{L2}` What is `go test -coverprofile`? What is the difference between statement coverage, branch coverage, and function coverage?
158. `[CODE]` `{L2}` Generate and view OpenTrace's test coverage: `go test -coverprofile=c.out ./...`, `go tool cover -html=c.out`. Identify uncovered code paths in the span processor.
159. `[CONCEPT]` `{L2}` What is a mock vs stub vs fake in testing? When does OpenTrace use each?
160. `[CODE]` `{L2}` Write a fake `SpanStore` for OpenTrace unit tests: in-memory map implementation satisfying the `SpanStorer` interface. No external dependencies.
161. `[CODE]` `{L2}` Write a mock `KafkaProducer` for OpenTrace unit tests: record all produced messages, verify in assertions.
162. `[CONCEPT]` `{L2}` What is `testing/iotest`? What is `httptest.NewRecorder`? When does OpenTrace use `httptest` to test HTTP handlers without a real server?
163. `[CODE]` `{L2}` Test OpenTrace's span ingestion HTTP handler using `httptest`:
    ```go
    req := httptest.NewRequest("POST", "/v1/traces", body)
    rec := httptest.NewRecorder()
    handler.ServeHTTP(rec, req)
    assert.Equal(t, 200, rec.Code)
    ```
164. `[CONCEPT]` `{L2}` What is `net/http/httptest.NewServer`? How does OpenTrace test its gRPC client against a fake server?
165. `[CODE]` `{L2}` Write an OpenTrace gRPC server test using `google.golang.org/grpc/test/bufconn`: in-process gRPC connection with no network overhead.
166. `[CONCEPT]` `{L2}` What is golden file testing? How does OpenTrace use `testdata/*.golden` files to verify JSON API responses?
167. `[CODE]` `{L2}` Implement golden file testing for OpenTrace's trace API: `testdata/trace_response.golden`. Use `-update` flag to regenerate. Compare with `assert.JSONEq`.
168. `[CONCEPT]` `{L2}` What is `go test -run TestFoo/bar`? How do you run a specific table-driven test case in OpenTrace?
169. `[CODE]` `{L2}` Implement a `TestMain` for OpenTrace that: starts test containers, seeds test data, runs all tests, cleans up. Log total setup/teardown time.
170. `[CONCEPT]` `{L2}` What is `go test -v -json`? How does OpenTrace's CI parse test output with `gotestsum` for better reporting?
171. `[CODE]` `{L2}` Configure `gotestsum` in OpenTrace's CI: `gotestsum --format testdox --junitfile results.xml -- -race -count=1 ./...`. Upload JUnit XML as GitHub Actions artifact.
172. `[CONCEPT]` `{L2}` What is the Go `internal` package? How does OpenTrace use it to keep implementation packages private?
173. `[CONCEPT]` `{L2}` What is Go module path? What is `go.mod` and `go.sum`? How does OpenTrace's `go.mod` define its module path?
174. `[CODE]` `{L2}` Write OpenTrace's `go.mod`: `module github.com/org/openTrace`, `go 1.23`, required dependencies with versions. Run `go mod tidy`.
175. `[CONCEPT]` `{L2}` What is `go work` (workspaces)? How does OpenTrace's monorepo use workspaces for local development across multiple modules?
176. `[CODE]` `{L2}` Create a `go.work` for OpenTrace: `go work init ./collector ./processor ./query ./pkg/proto`. Run `go work sync`.
177. `[CONCEPT]` `{L2}` What is `go:embed`? How does OpenTrace embed the ClickHouse migration SQL files into the binary?
178. `[CODE]` `{L2}` Embed OpenTrace's migration files: `//go:embed migrations/*.sql` → `var migrationsFS embed.FS`. Apply on startup with `golang-migrate`.
179. `[CONCEPT]` `{L2}` What is `cobra` in Go? How does OpenTrace structure its CLI: `collector serve --port=4317`?
180. `[CODE]` `{L2}` Write OpenTrace's cobra CLI: root command with `serve` and `validate-config` subcommands. `PersistentPreRunE` loads config. `RunE` starts the server.

---

# PART C — Node.js Deep (Q181–Q280)

---

## V8 Engine & Event Loop (Q181–Q220)

181. `[CONCEPT]` `{L1}` What is the Node.js event loop? What are the 6 phases: timers, pending callbacks, idle/prepare, poll, check, close callbacks?
182. `[CONCEPT]` `{L1}` What is `libuv`? How does it implement async I/O on top of different OS mechanisms (epoll/kqueue/IOCP)?
183. `[CONCEPT]` `{L1}` What is the difference between `setImmediate` and `process.nextTick`? Which runs first?
184. `[OUTPUT]` `{L1}` What is the output order?
    ```js
    setImmediate(() => console.log('setImmediate'))
    process.nextTick(() => console.log('nextTick'))
    Promise.resolve().then(() => console.log('promise'))
    console.log('sync')
    ```
185. `[CONCEPT]` `{L2}` What is the V8 JIT compilation pipeline: Ignition (interpreter) → Sparkplug → Maglev → TurboFan (optimizing compiler)?
186. `[CONCEPT]` `{L2}` What are V8 hidden classes (shapes)? How does property insertion order affect object shape and JIT optimization in DungBeetle?
187. `[DEBUG]` `{L2}` Adding a property to an object in different code paths causes a hidden class transition. How does this affect DungBeetle's job object performance?
188. `[CODE]` `{L2}` Fix the hidden class pollution in DungBeetle: always initialize job objects with all properties in the same order in the constructor.
189. `[CONCEPT]` `{L2}` What is V8 inline caching (IC)? What is monomorphic, polymorphic, and megamorphic IC? How does polymorphic property access slow down DungBeetle?
190. `[CONCEPT]` `{L2}` What is V8 deoptimization? What code patterns cause it: type changes, `arguments` object, `eval`, `try/catch` in hot loops?
191. `[CODE]` `{L2}` Avoid deoptimization in DungBeetle's job processor: replace `arguments` with rest params, avoid `try/catch` inside tight loops.
192. `[CONCEPT]` `{L2}` What is generational GC in Node.js? What is the young generation (new space) vs old generation (old space)? What is scavenging?
193. `[CONCEPT]` `{L2}` What is `--max-old-space-size` in Node.js? What is the default (depends on platform)? What happens when the V8 heap is exhausted?
194. `[CODE]` `{L2}` Set memory limit for DungBeetle's Node.js process: `NODE_OPTIONS=--max-old-space-size=2048`. Monitor heap with `process.memoryUsage()`.
195. `[CONCEPT]` `{L2}` What is `--expose-gc` in Node.js? How does DungBeetle use it in tests to force GC and verify memory release?
196. `[CONCEPT]` `{L2}` What is `v8.getHeapStatistics()`? What does `heapUsed`, `heapTotal`, `external`, `arrayBuffers` represent?
197. `[CODE]` `{L2}` Export V8 heap stats from DungBeetle as Prometheus metrics: poll `v8.getHeapStatistics()` every 15s, expose as gauges.
198. `[CONCEPT]` `{L2}` What is `--perf-basic-prof` and `--prof` in Node.js for CPU profiling? How do you generate a flame graph?
199. `[CODE]` `{L2}` Profile DungBeetle's job processor: `node --prof app.js`, run load test, `node --prof-process isolate-*.log > processed.txt`. Find the hottest function.
200. `[CONCEPT]` `{L2}` What is `clinic.js`? What are `clinic flame`, `clinic bubbleprof`, `clinic heapprofiler`? When does DungBeetle use each?
201. `[CODE]` `{L2}` Run `clinic flame -- node app.js` on DungBeetle's API server. Identify the bottleneck function consuming the most CPU time.
202. `[CONCEPT]` `{L2}` What is `async_hooks` in Node.js? What does `AsyncLocalStorage` add? How does DungBeetle use it for trace context propagation?
203. `[CODE]` `{L2}` Implement trace context propagation in DungBeetle using `AsyncLocalStorage`: wrap every HTTP request handler, store `trace_id`, read in any downstream logger.
204. `[CONCEPT]` `{L2}` What is `node:worker_threads`? How does it differ from the main event loop? How does DungBeetle offload CPU-heavy job parsing?
205. `[CODE]` `{L2}` Implement a worker thread for DungBeetle's CSV job parser: `new Worker('./parser.js', {workerData: buffer})`, receive result via `worker.on('message')`.
206. `[CONCEPT]` `{L2}` What is `SharedArrayBuffer` in Node.js? How does it enable zero-copy data sharing between worker threads in DungBeetle?
207. `[CODE]` `{L2}` Use `SharedArrayBuffer` to pass a large job payload from main thread to worker in DungBeetle without copying.
208. `[CONCEPT]` `{L2}` What is `node:cluster`? How does DungBeetle use `cluster.fork()` to distribute HTTP requests across CPU cores?
209. `[CODE]` `{L2}` Implement DungBeetle's cluster setup: `os.cpus().length` workers, IPC for graceful shutdown, primary coordinates restart on worker crash.
210. `[CONCEPT]` `{L2}` What is `node:child_process.spawn` vs `exec` vs `fork`? When does DungBeetle use each for subprocess job execution?
211. `[CODE]` `{L2}` Implement job sandboxing in DungBeetle: spawn user code as a child process with `child_process.fork`, enforce timeout, kill on timeout.
212. `[CONCEPT]` `{L2}` What is `unhandledRejection` event? What is `uncaughtException`? How does DungBeetle log these for observability?
213. `[CODE]` `{L2}` Add global error handlers to DungBeetle: `process.on('unhandledRejection', ...)` and `process.on('uncaughtException', ...)`. Log error + stack, emit metric, exit with code 1.
214. `[CONCEPT]` `{L2}` What is `process.on('SIGTERM')` in Node.js? How does DungBeetle implement graceful shutdown for Kubernetes?
215. `[CODE]` `{L2}` Implement graceful shutdown for DungBeetle: on SIGTERM, stop accepting requests, drain the job queue, wait max 30s, then `process.exit(0)`.
216. `[CONCEPT]` `{L2}` What is `node:perf_hooks` `performance.now()` vs `Date.now()`? When does DungBeetle use `performance.now()` for accurate microsecond timing?
217. `[CODE]` `{L2}` Measure DungBeetle's job processing latency with `performance.now()`: `const start = performance.now(); processJob(job); const dur = performance.now() - start;`.
218. `[CONCEPT]` `{L2}` What is `node:diagnostics_channel`? How does DungBeetle emit custom instrumentation events without adding OpenTelemetry to every module?
219. `[CODE]` `{L2}` Implement diagnostics channel instrumentation for DungBeetle's job processor: `channel.publish({job_id, duration_ms, status})` on every job completion.
220. `[CONCEPT]` `{L2}` What is `--inspect` and `--inspect-brk` in Node.js? How do you connect Chrome DevTools to a running DungBeetle process for live debugging?

---

## Node.js Streams & Async Patterns (Q221–Q260)

221. `[CONCEPT]` `{L1}` What are Node.js streams? What are the 4 types: Readable, Writable, Duplex, Transform?
222. `[CONCEPT]` `{L1}` What is backpressure in Node.js streams? What is `highWaterMark`? What happens when the write buffer fills?
223. `[CONCEPT]` `{L1}` What is the `drain` event? What is the return value of `writable.write()`? When does DungBeetle check it?
224. `[CODE]` `{L1}` Implement a CSV import stream in DungBeetle: `fs.createReadStream` → `csv.parse()` Transform → `validateJob()` Transform → `insertJob()` Writable. Handle backpressure.
225. `[CONCEPT]` `{L2}` What is `stream.pipeline()`? How does it handle errors better than piping manually? Why does DungBeetle always use `pipeline` not `pipe`?
226. `[CODE]` `{L2}` Implement DungBeetle's 200MB CSV import using `pipeline`: constant ~20MB memory usage via backpressure.
227. `[CONCEPT]` `{L2}` What is `stream.compose()`? How does it create a composite stream from multiple transforms?
228. `[CODE]` `{L2}` Implement a composable processing pipeline for DungBeetle: `compose(gunzip(), csvParse(), validate(), enrich())`.
229. `[CONCEPT]` `{L2}` What is `stream.Readable.from(iterable)`? How does DungBeetle create a Readable from an async generator?
230. `[CODE]` `{L2}` Create a paginated database Readable for DungBeetle: async generator that fetches 1000 rows at a time from PostgreSQL and yields them.
231. `[CONCEPT]` `{L2}` What is `objectMode` in streams? When does DungBeetle use it for passing structured job objects instead of Buffers?
232. `[CODE]` `{L2}` Implement an object-mode Transform stream for DungBeetle: validate a job object, add timestamps, push to output.
233. `[CONCEPT]` `{L2}` What is `readableHighWaterMark` vs `writableHighWaterMark`? How do you tune them for DungBeetle's batch job import?
234. `[CODE]` `{L2}` Tune buffer sizes for DungBeetle's import: `{ readableHighWaterMark: 1000, writableHighWaterMark: 100 }` (1000 objects read-ahead, 100 objects write buffer).
235. `[CONCEPT]` `{L2}` What is `async_iterator` protocol? How does DungBeetle use `for await...of` to consume a Readable stream?
236. `[CODE]` `{L2}` Use `for await...of` to consume DungBeetle's job export stream:
    ```js
    for await (const job of jobStream) {
        await writeToS3(job)
    }
    ```
237. `[CONCEPT]` `{L2}` What is `AbortSignal` for streams? How does DungBeetle cancel a long-running stream operation when the HTTP client disconnects?
238. `[CODE]` `{L2}` Pass `AbortSignal` to DungBeetle's stream: `pipeline(readStream, transformStream, writeStream, { signal: abortController.signal })`.
239. `[CONCEPT]` `{L2}` What is a `PassThrough` stream? When does DungBeetle use it for stream metrics (counting bytes, measuring throughput)?
240. `[CODE]` `{L2}` Implement a metrics PassThrough for DungBeetle: count bytes and objects passing through, emit metrics every 5 seconds.
241. `[CONCEPT]` `{L2}` What is Node.js `EventEmitter`? What is the memory leak risk of adding too many listeners?
242. `[CODE]` `{L2}` Fix the EventEmitter leak in DungBeetle: `emitter.setMaxListeners(50)` or use `once()` instead of `on()` for one-time events.
243. `[CONCEPT]` `{L2}` What is the "callback hell" antipattern? How did Promises solve it? How did async/await solve it?
244. `[CODE]` `{L2}` Refactor DungBeetle's nested callback job processing to async/await. Show the before and after.
245. `[CONCEPT]` `{L2}` What is `Promise.all` vs `Promise.allSettled` vs `Promise.race` vs `Promise.any`? When does DungBeetle use each?
246. `[CODE]` `{L2}` Use `Promise.allSettled` in DungBeetle's batch job trigger: attempt all 100 jobs, collect successes and failures, report stats.
247. `[CONCEPT]` `{L2}` What is `async_iterator` vs `Promise.all` for concurrency? How does DungBeetle process jobs with bounded concurrency (10 at a time)?
248. `[CODE]` `{L2}` Implement bounded concurrency in DungBeetle using `p-limit`:
    ```js
    const limit = pLimit(10)
    await Promise.all(jobs.map(job => limit(() => processJob(job))))
    ```
249. `[CONCEPT]` `{L2}` What is a `WeakRef` in Node.js? How does DungBeetle use it in its job cache to avoid memory leaks for completed jobs?
250. `[CODE]` `{L2}` Implement a weak-reference job cache in DungBeetle: `new WeakRef(jobResult)`, deref before use, regenerate if GC'd.
251. `[CONCEPT]` `{L2}` What is `FinalizationRegistry` in Node.js? How does DungBeetle use it to log when a large job result is garbage collected?
252. `[CODE]` `{L2}` Use `FinalizationRegistry` in DungBeetle to detect premature GC: register a callback that logs when a job object is collected before it should be.
253. `[CONCEPT]` `{L2}` What is the Node.js `net` module? How does DungBeetle implement a raw TCP server for a custom job submission protocol?
254. `[CODE]` `{L2}` Implement a DungBeetle TCP server: `net.createServer(socket => { socket.on('data', ...) })`. Read 4-byte length prefix, then body. Write response.
255. `[CONCEPT]` `{L2}` What is `node:crypto`? How does DungBeetle use it for HMAC webhook signature and secure random token generation?
256. `[CODE]` `{L2}` Generate a webhook HMAC signature in DungBeetle: `crypto.createHmac('sha256', secret).update(body).digest('hex')`.
257. `[CODE]` `{L2}` Generate a cryptographically secure random job ID in DungBeetle: `crypto.randomUUID()` or `crypto.randomBytes(16).toString('hex')`.
258. `[CONCEPT]` `{L2}` What is `node:tls`? How does DungBeetle connect to PostgreSQL with TLS verification?
259. `[CODE]` `{L2}` Configure DungBeetle's PostgreSQL connection with TLS: `{ ssl: { ca: fs.readFileSync('ca.crt'), rejectUnauthorized: true } }`.
260. `[CONCEPT]` `{L2}` What is `node:http2`? How does DungBeetle use HTTP/2 for multiplexed API calls to the job monitoring service?

---

## TypeScript Deep (Q261–Q300)

261. `[CONCEPT]` `{L1}` What is TypeScript's type system? What is structural typing ("duck typing")? How does it differ from nominal typing?
262. `[CONCEPT]` `{L1}` What is `strict: true` in `tsconfig.json`? What does it enable: `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`?
263. `[CODE]` `{L1}` Enable TypeScript strict mode in DungBeetle. Fix the first 10 type errors that `strict: true` reveals.
264. `[CONCEPT]` `{L2}` What are TypeScript utility types: `Partial<T>`, `Required<T>`, `Readonly<T>`, `Pick<T, K>`, `Omit<T, K>`, `Record<K, V>`, `Exclude<T, U>`, `Extract<T, U>`?
265. `[CODE]` `{L2}` Use TypeScript utility types in DungBeetle: `Partial<JobConfig>` for update payloads, `Readonly<Job>` for immutable job objects, `Pick<Job, 'id' | 'status'>` for list responses.
266. `[CONCEPT]` `{L2}` What is a branded type in TypeScript? How does DungBeetle use `type JobId = string & { readonly _brand: 'JobId' }` to prevent mixing up job IDs and user IDs?
267. `[CODE]` `{L2}` Define branded types for DungBeetle: `JobId`, `TenantId`, `WorkerId`. Write `brandJobId(s: string): JobId`. Show a compile error when mixing types.
268. `[CONCEPT]` `{L2}` What is a discriminated union in TypeScript? How does DungBeetle use it for job status modeling?
269. `[CODE]` `{L2}` Model DungBeetle's job status as a discriminated union:
    ```ts
    type Job =
      | { status: 'pending'; queuedAt: Date }
      | { status: 'running'; startedAt: Date; workerId: WorkerId }
      | { status: 'completed'; result: unknown; finishedAt: Date }
      | { status: 'failed'; error: string; failedAt: Date }
    ```
270. `[CONCEPT]` `{L2}` What is `never` in TypeScript? How does DungBeetle use exhaustiveness checking with `never` in switch statements?
271. `[CODE]` `{L2}` Implement exhaustiveness checking in DungBeetle's job status handler:
    ```ts
    function handleJob(job: Job): void {
        switch (job.status) {
            case 'pending': ...; break
            case 'running': ...; break
            default: const _exhaustive: never = job; // compile error if case missed
        }
    }
    ```
272. `[CONCEPT]` `{L2}` What is a conditional type in TypeScript? Write `NonNullable<T>` as a conditional type.
273. `[CODE]` `{L2}` Write a `DeepReadonly<T>` conditional type for DungBeetle's immutable configuration objects.
274. `[CONCEPT]` `{L2}` What is `infer` in TypeScript conditional types? Write `ReturnType<T>` and `Parameters<T>` from scratch.
275. `[CODE]` `{L2}` Write a `Awaited<T>` type that unwraps nested Promises for DungBeetle's async job result types.
276. `[CONCEPT]` `{L2}` What is a mapped type in TypeScript? Write `Nullable<T>` that makes all properties `T[K] | null`.
277. `[CODE]` `{L2}` Write a `DeepPartial<T>` mapped type for DungBeetle's nested configuration update type.
278. `[CONCEPT]` `{L2}` What is template literal type in TypeScript? Write `EventName = 'job:${JobStatus}'` for DungBeetle's typed event emitter.
279. `[CODE]` `{L2}` Implement a typed EventEmitter for DungBeetle using template literal types:
    ```ts
    type Events = { 'job:completed': Job; 'job:failed': Job & { error: string } }
    class TypedEmitter extends EventEmitter { emit<K extends keyof Events>(event: K, data: Events[K]): boolean }
    ```
280. `[CONCEPT]` `{L2}` What is `satisfies` operator in TypeScript (4.9)? How does DungBeetle use it to validate config objects without widening the type?
281. `[CODE]` `{L2}` Use `satisfies` in DungBeetle's config: `const config = { port: 3000, db: {...} } satisfies Config`. Preserves literal types while validating structure.
282. `[CONCEPT]` `{L2}` What is declaration merging in TypeScript? How does DungBeetle merge `Express.Request` to add `tenantId` to the request object?
283. `[CODE]` `{L2}` Merge Express types in DungBeetle:
    ```ts
    declare global { namespace Express { interface Request { tenantId: TenantId; userId: UserId } } }
    ```
284. `[CONCEPT]` `{L2}` What is `as const` in TypeScript? How does DungBeetle use it to create immutable tuple literals and enum-like string unions?
285. `[CODE]` `{L2}` Define DungBeetle's job priorities as const: `const JOB_PRIORITIES = ['low', 'medium', 'high', 'critical'] as const`. Derive type: `type Priority = (typeof JOB_PRIORITIES)[number]`.
286. `[CONCEPT]` `{L2}` What is `tsc --noEmit`? How does DungBeetle use it in CI for type checking without generating JavaScript?
287. `[CODE]` `{L2}` Add type checking to DungBeetle's CI: `tsc --noEmit`, fail build on any type error. Run before tests.
288. `[CONCEPT]` `{L2}` What is `tsx` vs `ts-node` vs compiling to JS? When does DungBeetle use `tsx` for fast development iteration?
289. `[CONCEPT]` `{L2}` What is `@ts-expect-error` vs `@ts-ignore`? When is each appropriate in DungBeetle?
290. `[CODE]` `{L2}` Use `@ts-expect-error` in DungBeetle's type tests: verify that a function DOES NOT accept wrong types:
    ```ts
    // @ts-expect-error: JobId cannot be assigned to WorkerId
    const w: WorkerId = 'job-123' as JobId
    ```
291. `[CONCEPT]` `{L2}` What is Zod in TypeScript? How does one Zod schema generate both runtime validation and TypeScript types?
292. `[CODE]` `{L2}` Write a Zod schema for DungBeetle's `CreateJobRequest`: name (string, max 100), payload (object), priority, maxRetries (number, 0-10). Generate the TypeScript type.
293. `[CODE]` `{L2}` Add Zod validation middleware to DungBeetle's job creation endpoint: parse with `schema.safeParse(req.body)`, return 400 with Zod error details on failure.
294. `[CONCEPT]` `{L2}` What is Vitest vs Jest? Why does DungBeetle use Vitest for its TypeScript tests?
295. `[CODE]` `{L2}` Write a Vitest test for DungBeetle's job priority queue: create jobs with different priorities, verify dequeue order.
296. `[CODE]` `{L2}` Write a Vitest integration test for DungBeetle using testcontainers: start PostgreSQL, create job table, insert job, run worker, assert job status is `completed`.
297. `[CONCEPT]` `{L2}` What is Playwright? How does DungBeetle use it for E2E tests: submit a job via UI, monitor progress, verify completion?
298. `[CODE]` `{L2}` Write a Playwright test for DungBeetle's job submission UI:
    ```ts
    await page.goto('/jobs/new')
    await page.fill('[name=jobName]', 'test-job')
    await page.click('[type=submit]')
    await expect(page.locator('[data-testid=job-status]')).toHaveText('pending')
    ```
299. `[CONCEPT]` `{L2}` What is `eslint` with TypeScript? What rules does DungBeetle enforce: `@typescript-eslint/no-floating-promises`, `@typescript-eslint/await-thenable`?
300. `[APPLY]` `{L2}` Walk through DungBeetle's complete TypeScript stack: `tsconfig.json` (strict), Zod for validation, Prisma for DB, Vitest for testing, `tsc --noEmit` in CI, Playwright for E2E.

---

# PART D — Frontend: React, Next.js & Performance (Q301–Q400)

---

## React Deep (Q301–Q340)

301. `[CONCEPT]` `{L1}` What is the React virtual DOM? What is reconciliation? What is the diffing algorithm's time complexity?
302. `[CONCEPT]` `{L1}` What are the React hooks? Name 10: useState, useEffect, useContext, useRef, useMemo, useCallback, useReducer, useLayoutEffect, useId, useTransition.
303. `[CONCEPT]` `{L1}` What is the `useState` update batching behavior in React 18? What changed from React 17?
304. `[OUTPUT]` `{L2}` What renders? How many times?
    ```jsx
    function Counter() {
        const [a, setA] = useState(0)
        const [b, setB] = useState(0)
        useEffect(() => { setA(1); setB(1) }, [])
        return <div>{a + b}</div>
    }
    ```
305. `[CONCEPT]` `{L2}` What is `useEffect` dependency array? What happens with an empty array `[]` vs no array vs `[dep]`?
306. `[DEBUG]` `{L1}` Fix the infinite loop:
    ```jsx
    useEffect(() => {
        setCount(count + 1) // missing dep → triggers re-render → triggers effect → infinite loop
    }, [count])
    ```
307. `[CONCEPT]` `{L2}` What is `useMemo` vs `useCallback`? When does OpenTrace UI use `useMemo` for expensive trace tree computation?
308. `[CODE]` `{L2}` Use `useMemo` in OpenTrace UI to compute the critical path of a trace only when the trace data changes:
    ```jsx
    const criticalPath = useMemo(() => computeCriticalPath(spans), [spans])
    ```
309. `[CONCEPT]` `{L2}` What is `React.memo`? When does OpenTrace UI wrap the `SpanRow` component in `React.memo` to prevent 10K re-renders?
310. `[CODE]` `{L2}` Wrap OpenTrace's `SpanRow` in `React.memo` with a custom comparison: `React.memo(SpanRow, (prev, next) => prev.span.id === next.span.id && prev.span.status === next.span.status)`.
311. `[CONCEPT]` `{L2}` What is `useRef`? What are its two use cases: DOM reference and mutable value that doesn't trigger re-render?
312. `[CODE]` `{L2}` Use `useRef` in OpenTrace UI for: (1) DOM reference to scroll to selected span, (2) mutable WebSocket ref that doesn't trigger re-render.
313. `[CONCEPT]` `{L2}` What is `useReducer`? When does OpenTrace UI prefer it over `useState` for complex trace filter state?
314. `[CODE]` `{L2}` Implement `useReducer` for OpenTrace UI's trace filter state: actions `SET_SERVICE`, `SET_TIME_RANGE`, `SET_DURATION`, `RESET`. Show the reducer function.
315. `[CONCEPT]` `{L2}` What is `useContext`? What is the performance problem with context? When does OpenTrace UI use Zustand instead?
316. `[CODE]` `{L2}` Implement a Zustand store for OpenTrace UI: `useTraceStore` with `selectedTraceId`, `filters`, `setFilters`, `selectTrace`. No prop drilling.
317. `[CONCEPT]` `{L2}` What is `useTransition`? What is `startTransition`? How does OpenTrace UI use it to keep the search input responsive while loading results?
318. `[CODE]` `{L2}` Use `useTransition` in OpenTrace UI's search: `startTransition(() => setSearchResults(results))`. Input stays responsive while results load.
319. `[CONCEPT]` `{L2}` What is `Suspense`? What is `React.lazy`? How does OpenTrace UI lazy-load the trace detail panel?
320. `[CODE]` `{L2}` Lazy-load OpenTrace UI's trace detail: `const TraceDetail = React.lazy(() => import('./TraceDetail'))`. Wrap in `<Suspense fallback={<Spinner />}>`.
321. `[CONCEPT]` `{L2}` What is `useId` hook? How does OpenTrace UI generate accessible form labels?
322. `[CONCEPT]` `{L2}` What is `useLayoutEffect`? When does OpenTrace UI use it for measuring DOM element positions before paint?
323. `[CODE]` `{L2}` Use `useLayoutEffect` in OpenTrace UI's trace waterfall: measure container width after DOM paint, set virtual scroller size.
324. `[CONCEPT]` `{L2}` What is React's key prop? Why does OpenTrace UI use `span.id` not index for span row keys?
325. `[DEBUG]` `{L2}` OpenTrace UI updates span status but the wrong row re-renders. What is the key prop bug? How do you fix it?
326. `[CONCEPT]` `{L2}` What is `react-window` for virtual scrolling? How does OpenTrace UI render 10K spans with 50 DOM nodes?
327. `[CODE]` `{L2}` Implement virtual scrolling for OpenTrace UI's trace waterfall using `react-window` `FixedSizeList`:
    ```jsx
    <FixedSizeList height={600} itemCount={spans.length} itemSize={40} width="100%">
        {({ index, style }) => <SpanRow style={style} span={spans[index]} />}
    </FixedSizeList>
    ```
328. `[CONCEPT]` `{L2}` What is React DevTools Profiler? How does OpenTrace UI use it to find which components re-render during span updates?
329. `[CODE]` `{L2}` Profile OpenTrace UI's span update performance in React DevTools: enable "Record why each component rendered", identify unnecessary re-renders, add `React.memo`.
330. `[CONCEPT]` `{L2}` What is React 18's `useDeferredValue`? How does OpenTrace UI use it to defer heavy span list re-rendering?
331. `[CODE]` `{L2}` Use `useDeferredValue` in OpenTrace UI: defer the expensive span list rendering while the filter input stays responsive:
    ```jsx
    const deferredFilters = useDeferredValue(filters)
    const filteredSpans = useMemo(() => applyFilters(spans, deferredFilters), [spans, deferredFilters])
    ```
332. `[CONCEPT]` `{L2}` What is `useOptimistic` hook in React 19? How does BookWise UI use it for immediate seat booking feedback?
333. `[CODE]` `{L2}` Use `useOptimistic` in BookWise UI: immediately show seat as "booked" on click, revert if the API call fails.
334. `[CONCEPT]` `{L2}` What is React Query (`@tanstack/react-query`)? What is `staleTime` vs `gcTime`?
335. `[CODE]` `{L2}` Implement trace fetching in OpenTrace UI with React Query: `useQuery({ queryKey: ['trace', traceId], queryFn: fetchTrace, staleTime: 5000 })`. Show cache behavior.
336. `[CODE]` `{L2}` Implement optimistic mutation in BookWise UI with `useMutation`:
    ```jsx
    const mutation = useMutation({ mutationFn: bookSeat, onMutate: () => optimisticallyUpdateUI() })
    ```
337. `[CONCEPT]` `{L2}` What is React Query's background refetching? How does OpenTrace UI show "fresh" data while serving cached?
338. `[CODE]` `{L2}` Configure React Query for OpenTrace UI: set `refetchOnWindowFocus: true` and `staleTime: 30000` for trace list, `staleTime: 0` for live tail.
339. `[CONCEPT]` `{L2}` What is `useQuery` error handling? How does OpenTrace UI show a graceful error state when the trace query API is down?
340. `[CODE]` `{L2}` Add error boundary + React Query error handling to OpenTrace UI: `isError` → show `ErrorFallback` component with retry button that calls `refetch()`.

---

## Next.js & Full-Stack Patterns (Q341–Q400)

341. `[CONCEPT]` `{L1}` What is Next.js App Router? How does it differ from the Pages Router?
342. `[CONCEPT]` `{L1}` What are Server Components in Next.js? What can they do that Client Components cannot (and vice versa)?
343. `[CONCEPT]` `{L1}` What is the `'use client'` directive? When does OpenTrace UI add it to a component?
344. `[CODE]` `{L2}` Structure OpenTrace UI's trace list page as a Server Component (fetches data server-side) with a Client Component child (`TraceFilter` with interactive state).
345. `[CONCEPT]` `{L2}` What is SSG (Static Site Generation) vs SSR (Server-Side Rendering) vs ISR (Incremental Static Regeneration) in Next.js?
346. `[CODE]` `{L2}` Implement ISR for OpenTrace UI's service list page: `{ revalidate: 60 }` — regenerate every minute.
347. `[CONCEPT]` `{L2}` What is Streaming Suspense in Next.js App Router? How does OpenTrace UI stream the trace detail page?
348. `[CODE]` `{L2}` Stream OpenTrace UI's trace detail: wrap slow components in `<Suspense fallback={<Skeleton/>}>`. Fast components render first, slow span list streams in.
349. `[CONCEPT]` `{L2}` What is a Server Action in Next.js? How does BookWise UI use it for seat booking without an API route?
350. `[CODE]` `{L2}` Implement a BookWise Server Action: `'use server'; async function bookSeat(seatId: string): Promise<{success: boolean}>`. Call from a form with `action={bookSeat}`.
351. `[CONCEPT]` `{L2}` What is the Next.js `cache()` function? How does OpenTrace UI deduplicate identical server-side data fetches?
352. `[CODE]` `{L2}` Use `cache()` in OpenTrace UI's server components: `const getTrace = cache(async (id: string) => fetchTrace(id))`. Multiple components call it, only one fetch.
353. `[CONCEPT]` `{L2}` What is `revalidatePath` and `revalidateTag` in Next.js? How does BookWise invalidate the seat map cache after a booking?
354. `[CODE]` `{L2}` Implement cache invalidation in BookWise Server Action: after booking, `revalidatePath('/events/[id]', 'page')` to clear the seat map cache.
355. `[CONCEPT]` `{L2}` What is Next.js Middleware? How does OpenTrace UI use it to verify JWT before serving any page?
356. `[CODE]` `{L2}` Implement auth middleware in Next.js for OpenTrace UI: check `Authorization` cookie, verify JWT, redirect to `/login` if invalid.
357. `[CONCEPT]` `{L2}` What is `next/image`? What optimizations does it provide: lazy loading, responsive sizes, WebP conversion, LQIP?
358. `[CODE]` `{L2}` Optimize OpenTrace UI's service logo images with `next/image`: `<Image src={logo} width={48} height={48} priority={false} alt={serviceName} />`.
359. `[CONCEPT]` `{L2}` What is `next/font`? How does OpenTrace UI optimize font loading to eliminate layout shift?
360. `[CODE]` `{L2}` Configure `next/font` for OpenTrace UI: `import { Inter } from 'next/font/google'; const inter = Inter({ subsets: ['latin'], display: 'swap' })`.
361. `[CONCEPT]` `{L2}` What is `next/script`? When does OpenTrace UI load third-party scripts with `strategy="lazyOnload"`?
362. `[CONCEPT]` `{L2}` What is the Next.js `generateMetadata` function? How does OpenTrace UI set dynamic `<title>` and OpenGraph tags per trace?
363. `[CODE]` `{L2}` Implement dynamic metadata for OpenTrace UI's trace page:
    ```ts
    export async function generateMetadata({ params }): Promise<Metadata> {
        const trace = await fetchTrace(params.traceId)
        return { title: `Trace ${trace.id} - ${trace.rootService}` }
    }
    ```
364. `[CONCEPT]` `{L2}` What is `generateStaticParams` in Next.js? When does OpenTrace UI pre-generate popular trace pages at build time?
365. `[CONCEPT]` `{L2}` What is `not-found.tsx` and `error.tsx` in Next.js App Router? How does OpenTrace UI handle 404 traces and query errors?
366. `[CODE]` `{L2}` Implement OpenTrace UI's error page: `error.tsx` with `'use client'`, retry button using `reset()` prop, show error message.
367. `[CONCEPT]` `{L2}` What is the Next.js route handler (`route.ts`)? When does OpenTrace UI use it vs a separate API server?
368. `[CODE]` `{L2}` Implement an OpenTrace UI route handler that proxies to the Go Query Service: `app/api/traces/[id]/route.ts` → `fetch(QUERY_SERVICE_URL + '/traces/' + id)`.
369. `[CONCEPT]` `{L2}` What is `next.config.js` `rewrites`? How does OpenTrace UI proxy API calls to avoid CORS issues in development?
370. `[CODE]` `{L2}` Add Next.js rewrites for OpenTrace UI: `rewrites: [{ source: '/api/:path*', destination: 'http://localhost:4318/:path*' }]`.
371. `[CONCEPT]` `{L2}` What is Turbopack in Next.js? How does it improve OpenTrace UI's development HMR speed vs Webpack?
372. `[CONCEPT]` `{L2}` What is Tailwind CSS? How does OpenTrace UI use utility classes for responsive trace waterfall layout?
373. `[CODE]` `{L2}` Implement OpenTrace UI's span duration bar using Tailwind: `<div className="h-2 bg-blue-500 rounded" style={{ width: `${(duration / maxDuration) * 100}%` }} />`.
374. `[CONCEPT]` `{L2}` What is Shadcn UI? How does OpenTrace UI use it for data tables and command palette?
375. `[CODE]` `{L2}` Implement OpenTrace UI's trace search using Shadcn's `Command` component: keyboard-accessible search with keyboard shortcuts `⌘K`.
376. `[CONCEPT]` `{L2}` What is `Lighthouse`? What score does OpenTrace UI target? What are the four categories?
377. `[CODE]` `{L2}` Run Lighthouse on OpenTrace UI: identify the top 3 performance improvements. Expected issues: unoptimized images, render-blocking scripts, large JS bundles.
378. `[CONCEPT]` `{L2}` What is Core Web Vitals? What are LCP, CLS, INP? What targets does OpenTrace UI set?
379. `[CODE]` `{L2}` Measure Core Web Vitals for OpenTrace UI using `web-vitals` library: report LCP, CLS, INP to analytics on every page load.
380. `[CONCEPT]` `{L2}` What is `next/bundle-analyzer`? How does OpenTrace UI find and eliminate large JavaScript bundle contributors?
381. `[CODE]` `{L2}` Analyze OpenTrace UI's JavaScript bundle: `ANALYZE=true next build`. Identify the largest dependency (likely a charting library) and replace with a lighter alternative.
382. `[CONCEPT]` `{L2}` What is code splitting in Next.js? How does `React.lazy` + dynamic `import()` split the trace waterfall into a separate chunk?
383. `[CONCEPT]` `{L2}` What is tree shaking in Next.js? How does ESM enable unused code elimination from OpenTrace UI's bundle?
384. `[CODE]` `{L2}` Eliminate dead code from OpenTrace UI: import only used Lucide icons: `import { Search, Filter } from 'lucide-react'` not `import * as Icons from 'lucide-react'`.
385. `[CONCEPT]` `{L2}` What is `prefetch` in Next.js `<Link>`? How does OpenTrace UI preload the trace detail page when hovering over a trace list item?
386. `[CODE]` `{L2}` Enable prefetching in OpenTrace UI: `<Link href={`/traces/${trace.id}`} prefetch={true}>`. Show network waterfall improvement.
387. `[CONCEPT]` `{L2}` What is React Query's `prefetchQuery`? How does OpenTrace UI server-side prefetch trace data to avoid client waterfall?
388. `[CODE]` `{L2}` Implement query prefetching in OpenTrace UI's trace list page: `await queryClient.prefetchQuery({ queryKey: ['trace', id], queryFn: fetchTrace })`. Dehydrate state.
389. `[CONCEPT]` `{L2}` What is `Suspense` boundary strategy? How does OpenTrace UI structure Suspense boundaries for optimal streaming?
390. `[CODE]` `{L2}` Structure OpenTrace UI's trace page with multiple Suspense boundaries: header (no Suspense), service map (Suspense), span list (Suspense with skeleton), logs (Suspense).
391. `[CONCEPT]` `{L2}` What is `useFormState` hook (React 19 form actions)? How does BookWise UI handle form submission errors from Server Actions?
392. `[CODE]` `{L2}` Use `useFormState` in BookWise's seat booking form: Server Action returns `{ success, error }`, `useFormState` displays the error without a full re-render.
393. `[CONCEPT]` `{L2}` What is `useFormStatus` hook? How does BookWise UI disable the "Book Seat" button while the Server Action is running?
394. `[CODE]` `{L2}` Use `useFormStatus` to show a loading state: `const { pending } = useFormStatus(); <button disabled={pending}>{pending ? 'Booking...' : 'Book Seat'}</button>`.
395. `[CONCEPT]` `{L2}` What is Progressive Enhancement in Next.js? How does BookWise's booking form work without JavaScript using Server Actions?
396. `[CONCEPT]` `{L2}` What is the Next.js `after()` function (15.x)? How does OpenTrace UI use it to send analytics after a response is sent?
397. `[CONCEPT]` `{L2}` What is Partial Prerendering (PPR) in Next.js? How does OpenTrace UI combine static shell with dynamic trace data?
398. `[CODE]` `{L2}` Enable PPR for OpenTrace UI: static header + sidebar (cached), dynamic trace list (streamed). Show `<Suspense>` placement that enables PPR.
399. `[CONCEPT]` `{L2}` What is `experimental_ppr` in Next.js config? What is the "static shell" + "dynamic holes" mental model?
400. `[APPLY]` `{L2}` Walk through the OpenTrace UI page load: DNS → CDN (static assets) → Next.js SSR (trace list) → React Query hydration → WebSocket connection for live updates. Name every latency source.

---

# PART E — Full-Stack Integration & Project Synthesis (Q401–Q500)

---

## API Integration & Data Flow (Q401–Q440)

401. `[CONCEPT]` `{L1}` What is the frontend-backend contract? How do OpenTrace's Go Query Service and TypeScript UI agree on API types?
402. `[CODE]` `{L2}` Generate TypeScript types from OpenTrace's Go API using OpenAPI spec: `openapi-typescript openTrace.yaml -o api.types.ts`. Use in React Query fetchers.
403. `[CODE]` `{L2}` Generate TypeScript types from OpenTrace's Protobuf definitions: `protoc --ts_out=./ span.proto`. Compare to OpenAPI approach.
404. `[CONCEPT]` `{L2}` What is `trpc`? How does DungBeetle use it for end-to-end type safety between Next.js frontend and Node.js backend?
405. `[CODE]` `{L2}` Set up tRPC in DungBeetle: define `jobRouter`, expose as `appRouter`, create tRPC client in Next.js UI. Show type-safe job creation call.
406. `[CONCEPT]` `{L2}` What is SWR vs React Query? When does OpenTrace UI use SWR for simple trace metadata fetching?
407. `[CODE]` `{L2}` Implement trace search with SWR in OpenTrace UI: `useSWR(['/api/traces', filters], fetcher, { dedupingInterval: 2000 })`.
408. `[CONCEPT]` `{L2}` What is `fetch` in Next.js server components? What is the request deduplication behavior?
409. `[CODE]` `{L2}` Fetch trace data in OpenTrace UI's Server Component: `const trace = await fetch(QUERY_SERVICE + '/traces/' + id, { next: { revalidate: 60 } })`. Show cache behavior.
410. `[CONCEPT]` `{L2}` What is OpenTrace UI's WebSocket integration? How does it handle reconnection on network loss?
411. `[CODE]` `{L2}` Implement WebSocket hook for OpenTrace UI's live tail:
    ```ts
    function useLiveTail(traceId: string) {
        const [spans, setSpans] = useState<Span[]>([])
        useEffect(() => {
            const ws = new WebSocket(`ws://api/live?trace_id=${traceId}`)
            ws.onmessage = (e) => setSpans(prev => [...prev, JSON.parse(e.data)])
            return () => ws.close()
        }, [traceId])
        return spans
    }
    ```
412. `[CONCEPT]` `{L2}` What is optimistic UI? How does BookWise UI update seat status immediately before the API confirms?
413. `[CODE]` `{L2}` Implement optimistic seat booking in BookWise UI: on click, immediately mark seat as `booking`, revert to `available` if API returns error.
414. `[CONCEPT]` `{L2}` What is the "stale-while-revalidate" pattern in the UI? How does OpenTrace UI show cached trace data while loading fresh data?
415. `[CODE]` `{L2}` Configure React Query's stale-while-revalidate for OpenTrace UI: `staleTime: 5000, gcTime: 60000`. UI shows stale data immediately, refreshes in background.
416. `[CONCEPT]` `{L2}` What is infinite query in React Query? How does OpenTrace UI implement infinite scroll for the trace list?
417. `[CODE]` `{L2}` Implement infinite scroll for OpenTrace UI using `useInfiniteQuery`:
    ```ts
    const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ['traces', filters],
        queryFn: ({ pageParam }) => fetchTraces({ cursor: pageParam }),
        getNextPageParam: (last) => last.meta.next_cursor
    })
    ```
418. `[CONCEPT]` `{L2}` What is React Query `invalidateQueries`? How does BookWise UI refresh the seat map after a successful booking?
419. `[CODE]` `{L2}` Invalidate queries after BookWise booking: `await queryClient.invalidateQueries({ queryKey: ['event', eventId, 'seats'] })`.
420. `[CONCEPT]` `{L2}` What is `QueryBoundary` (error + loading boundaries for React Query)? How does OpenTrace UI compose them?
421. `[CODE]` `{L2}` Implement a `TraceQueryBoundary` for OpenTrace UI: suspense boundary for loading, error boundary for errors, retry button.
422. `[CONCEPT]` `{L2}` What is `useNetworkState`? How does OpenTrace UI detect offline mode and show a banner?
423. `[CODE]` `{L2}` Implement an offline banner in OpenTrace UI: `window.addEventListener('offline', ...)`, show `<OfflineBanner />` that pauses live tail WebSocket.
424. `[CONCEPT]` `{L2}` What is `navigator.serviceWorker`? How would OpenTrace UI cache trace data for offline viewing?
425. `[CODE]` `{L2}` Register a Service Worker for OpenTrace UI: cache static assets and last-viewed traces. Show offline trace viewing capability.
426. `[CONCEPT]` `{L2}` What is `indexedDB`? How does BookWise UI cache seat map data in the browser for fast repeated access?
427. `[CODE]` `{L2}` Use `idb` (IndexedDB wrapper) in BookWise UI: cache event seat maps with 5-minute expiry. Serve from cache, refresh in background.
428. `[CONCEPT]` `{L2}` What is `localStorage` vs `sessionStorage` vs `cookies` for frontend state? When does OpenTrace UI use each?
429. `[CODE]` `{L2}` Store OpenTrace UI preferences (theme, default time range, favorite services) in `localStorage`. Sync across tabs using `storage` event.
430. `[CONCEPT]` `{L2}` What is `URLSearchParams`? How does OpenTrace UI sync filter state to the URL for shareable links?
431. `[CODE]` `{L2}` Sync OpenTrace UI's trace filters to URL params: `useSearchParams` (Next.js), update URL on filter change with `router.push('?' + params.toString())`. Enable deep-linking.
432. `[CONCEPT]` `{L2}` What is `nuqs` library? How does it simplify URL state management in Next.js App Router?
433. `[CODE]` `{L2}` Use `nuqs` for OpenTrace UI's search state: `useQueryState('service', parseAsString.withDefault('all'))`. URL updates on filter change, state persists on navigation.
434. `[CONCEPT]` `{L2}` What is `date-fns` vs `dayjs` vs `luxon` for date handling? When does OpenTrace UI use `date-fns` for timezone-aware span timestamps?
435. `[CODE]` `{L2}` Display OpenTrace span timestamps in the user's local timezone: `format(new Date(span.start_time / 1000), 'HH:mm:ss.SSS', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })`.
436. `[CONCEPT]` `{L2}` What is `recharts` vs `d3` vs `victory` for charting? When does OpenTrace UI use each for service latency graphs?
437. `[CODE]` `{L2}` Implement OpenTrace UI's service latency over time chart using `recharts`: `<LineChart data={metrics}><XAxis dataKey="time" /><YAxis /><Line dataKey="p99" /></LineChart>`.
438. `[CONCEPT]` `{L2}` What is the Canvas API vs SVG for trace waterfall visualization? Which does OpenTrace UI use for 10K spans?
439. `[CODE]` `{L2}` Implement OpenTrace UI's minimap overview using Canvas API: render all spans as colored rectangles, viewport indicator, click to jump to span.
440. `[CONCEPT]` `{L2}` What is `IntersectionObserver`? How does OpenTrace UI use it to lazy-load span details when they scroll into view?

---

## Project Synthesis: OpenTrace, DungBeetle, BookWise (Q441–Q500)

441. `[APPLY]` `{L2}` Walk through the OpenTrace Go SDK: auto-instrumentation of HTTP client/server, gRPC, PostgreSQL, Redis, Kafka. How does it inject middleware without code changes?
442. `[APPLY]` `{L2}` Walk through the OpenTrace TypeScript SDK: auto-instrumentation for Express/Fastify, Prisma, Redis, Kafka. How does it use Node.js `diagnostics_channel`?
443. `[APPLY]` `{L2}` Explain OpenTrace's end-to-end type safety: Protobuf defines the schema → `protoc` generates Go + TypeScript types → both compile-time checked → no JSON drift.
444. `[APPLY]` `{L2}` Walk through DungBeetle's monolith-to-event-driven migration: start as Express + PostgreSQL monolith, extract email notifications to a separate consumer, then job execution to a worker service.
445. `[APPLY]` `{L2}` Walk through DungBeetle's job lifecycle in code: TypeScript API creates job → PostgreSQL insert → Kafka publish → Go worker consumes → executes → updates status → SSE update → TypeScript UI.
446. `[APPLY]` `{L2}` Walk through BookWise's seat booking flow in code: Next.js Server Action → Go API → PostgreSQL advisory lock → payment Saga → Kafka event → SSE seat update → cache invalidation.
447. `[APPLY]` `{L2}` Walk through PayCore's payment flow: TypeScript API receives payment request → idempotency check (Redis) → Go Payment Service → PostgreSQL transaction (debit + credit) → Kafka event → notification.
448. `[APPLY]` `{L2}` Walk through RouteMaster's driver tracking: Go driver service receives GPS → Redis HSET with TTL → Kafka publish → WebSocket fan-out to active rider → Next.js UI map update.
449. `[APPLY]` `{L2}` Walk through OpenTrace's self-instrumentation: a span arrives at the Collector → OTel SDK creates a root span → Collector processes it → creates child spans for Kafka, validation, storage → these spans go into OpenTrace itself.
450. `[APPLY]` `{L2}` Explain OpenTrace's data flow during a tail-based sampling decision: all spans collected for 60s → sampling decision made → 5% of traces kept → kept spans permanently stored → 95% metadata-only stored.
451. `[CONCEPT]` `{L2}` What is the Go standard library's `net/http` vs using `chi` vs using `echo` vs using `gin`? Why does OpenTrace use `chi`?
452. `[CODE]` `{L2}` Show OpenTrace's `chi` router setup: middleware chain, route groups, sub-routers, custom 404/405 handlers.
453. `[CONCEPT]` `{L2}` What is `sqlc` in Go? How does OpenTrace use it to generate type-safe SQL functions from `.sql` query files?
454. `[CODE]` `{L2}` Write a `sqlc` query for OpenTrace: `-- name: GetSpansByTrace :many SELECT * FROM spans WHERE trace_id = $1 ORDER BY start_time ASC`. Show generated Go code.
455. `[CONCEPT]` `{L2}` What is `ent` vs `gorm` vs `sqlc` vs raw SQL for Go database access? When does OpenTrace use `sqlc`?
456. `[CODE]` `{L2}` Show why OpenTrace prefers `sqlc` over GORM: type safety, no reflection, SQL visible in code, GORM's "magic" behavior hidden.
457. `[CONCEPT]` `{L2}` What is `golang-migrate`? How does OpenTrace manage database migrations? What is the lock mechanism?
458. `[CODE]` `{L2}` Write OpenTrace's first migration: `000001_create_spans.up.sql` creates the spans table. `000001_create_spans.down.sql` drops it. Run in CI with `golang-migrate`.
459. `[CONCEPT]` `{L2}` What is `viper` in Go? How does OpenTrace use it to merge config from env vars, config files, and CLI flags?
460. `[CODE]` `{L2}` Configure `viper` for OpenTrace: load from `config.yaml`, override with `OPENTRARE_*` env vars, override with CLI flags. Unmarshal into strongly-typed `Config` struct.
461. `[CONCEPT]` `{L2}` What is `zerolog` vs `zap` vs `slog` for logging in Go? Why does OpenTrace use `slog` (standard library)?
462. `[CODE]` `{L2}` Configure `slog` for OpenTrace: JSON format, base fields `service=openTrace-collector`, `env=production`. Add `trace_id` from context via middleware.
463. `[CONCEPT]` `{L2}` What is `testify/mock` for Go? How does OpenTrace use it to mock the ClickHouse client in unit tests?
464. `[CODE]` `{L2}` Write a testify mock for OpenTrace's `SpanStorer` interface: `mockStore.On("StoreSpans", ctx, spans).Return(nil)`. Verify in test: `mockStore.AssertExpectations(t)`.
465. `[CONCEPT]` `{L2}` What is `golangci-lint`? What linters does OpenTrace enable: `errcheck`, `staticcheck`, `govet`, `exhaustive`, `bodyclose`, `sqlclosecheck`?
466. `[CODE]` `{L2}` Write OpenTrace's `.golangci.yaml`: enable errcheck (unchecked errors), bodyclose (HTTP body not closed), sqlclosecheck (SQL rows not closed). These are the most common production bugs.
467. `[CONCEPT]` `{L2}` What is `govulncheck`? What does it scan? How does OpenTrace's CI block deploys with known CVEs?
468. `[CODE]` `{L2}` Add `govulncheck ./...` to OpenTrace's CI: `if govulncheck ./... | grep -q CRITICAL; then exit 1; fi`.
469. `[CONCEPT]` `{L2}` What is the Go `embed` package? What is `go:embed`? How does OpenTrace embed the UI's `dist/` directory into the binary?
470. `[CODE]` `{L2}` Embed OpenTrace UI's static files: `//go:embed ui/dist/*` → `var uiFS embed.FS`. Serve with `http.FS(uiFS)`. Single binary deployment.
471. `[CONCEPT]` `{L2}` What is Prisma ORM? How does DungBeetle use it for type-safe database access in TypeScript?
472. `[CODE]` `{L2}` Write DungBeetle's Prisma schema: `Job` model with id, name, status, priority, tenantId, createdAt, startedAt, finishedAt, error. Generate TypeScript types.
473. `[CODE]` `{L2}` Use Prisma in DungBeetle's job worker: `const job = await prisma.job.findFirst({ where: { status: 'pending' }, orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }] })`.
474. `[CONCEPT]` `{L2}` What is Prisma Migrate? How does DungBeetle run database migrations in CI?
475. `[CODE]` `{L2}` Run Prisma migrations in DungBeetle's CI: `npx prisma migrate deploy`. Verify migration applied: `npx prisma migrate status`.
476. `[CONCEPT]` `{L2}` What is `fastify` vs `express` for Node.js? Why does DungBeetle's worker service use `fastify` for its status API?
477. `[CODE]` `{L2}` Implement DungBeetle's worker status API with Fastify: `fastify.get('/health', async () => ({ status: 'ok', activeJobs: workerPool.size }))`.
478. `[CONCEPT]` `{L2}` What is `bullmq` for job queues in Node.js? How does it compare to DungBeetle's custom PostgreSQL-backed queue?
479. `[TRADEOFF]` `{L2}` DungBeetle custom PostgreSQL queue vs BullMQ (Redis) vs Kafka: compare durability, exactly-once semantics, visibility into job state, operational complexity.
480. `[CONCEPT]` `{L2}` What is `ioredis` vs `node-redis` for Redis in Node.js? How does DungBeetle connect to Redis for session storage?
481. `[CODE]` `{L2}` Configure DungBeetle's Redis connection with `ioredis`: `new Redis({ host, port, password, tls: {}, retryStrategy: times => Math.min(times * 50, 2000) })`.
482. `[CONCEPT]` `{L2}` What is `pg` vs `postgres.js` vs `Knex` for PostgreSQL in Node.js? Why does DungBeetle use `postgres.js`?
483. `[CODE]` `{L2}` Implement DungBeetle's job queue worker with `postgres.js`: `SELECT FOR UPDATE SKIP LOCKED WHERE status='pending' ORDER BY priority DESC LIMIT 1`.
484. `[CONCEPT]` `{L2}` What is `pino` logger in Node.js? How does DungBeetle configure it for structured JSON logging with trace_id?
485. `[CODE]` `{L2}` Configure pino for DungBeetle: `pino({ level: 'info', base: { service: 'dung-beetle', env: process.env.NODE_ENV } })`. Add `trace_id` via `AsyncLocalStorage`.
486. `[CONCEPT]` `{L2}` What is `opentelemetry-js`? How does DungBeetle auto-instrument Express, Prisma, and Redis with zero code changes?
487. `[CODE]` `{L2}` Bootstrap OpenTelemetry in DungBeetle: `sdk.start()` before any imports, configure OTLP exporter to OpenTrace Collector, enable auto-instrumentation packages.
488. `[CONCEPT]` `{L2}` What is `helmet` in Express/Fastify? What security headers does DungBeetle set automatically?
489. `[CODE]` `{L2}` Add `helmet` to DungBeetle's Express server: `app.use(helmet())`. Verify `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security` are set.
490. `[CONCEPT]` `{L2}` What is `compression` middleware in Express? When does DungBeetle enable gzip compression for API responses?
491. `[CODE]` `{L2}` Add response compression to DungBeetle: `app.use(compression({ threshold: 1024 }))`. Only compress responses > 1KB.
492. `[CONCEPT]` `{L2}` What is `express-rate-limit`? How does DungBeetle implement basic rate limiting without Redis?
493. `[CODE]` `{L2}` Add rate limiting to DungBeetle's API: `rateLimit({ windowMs: 60000, max: 100, standardHeaders: true })`. The basic version without Redis.
494. `[CONCEPT]` `{L2}` What is `morgan` vs `pino-http` for HTTP access logging in Node.js? Why does DungBeetle use `pino-http`?
495. `[CODE]` `{L2}` Add pino-http to DungBeetle: `app.use(pinoHttp({ logger, serializers: { req: (req) => ({ method: req.method, url: req.url, traceId: req.headers['x-trace-id'] }) } }))`.
496. `[CONCEPT]` `{L2}` What is `dotenv` vs environment variables vs Kubernetes Secrets for configuration? Why does DungBeetle use `dotenv` only in development?
497. `[CODE]` `{L2}` Configure DungBeetle's environment: `dotenv.config()` in development, Kubernetes Secrets via env vars in production. Use `zod.parse(process.env)` to validate required env vars.
498. `[CONCEPT]` `{L2}` What is `pkg` vs `nexe` vs compiling to native binary for Node.js distribution? When would DungBeetle ship as a single binary?
499. `[CONCEPT]` `{L2}` What is `turborepo` for monorepo management? How does the 5-project Infraspec portfolio use Turborepo for shared packages and parallel builds?
500. `[APPLY]` `{L1}` Final synthesis: You are at the Infraspec technical interview. Walk through OpenTrace's technology stack in 5 minutes: Go (Collector, Processor, Query, Storage), TypeScript (API Gateway, UI, SDK), Next.js App Router (UI), React Query (data fetching), Tailwind + Shadcn (design system), WebSocket (live tail), PostgreSQL + ClickHouse + Redis (storage), Kafka (pipeline), Kubernetes (deployment). Justify every choice.
