# Biweekly 02 — `pgpool` · TCP Connection Pool · Go
**Stack:** Go · `net` TCP stdlib · pgwire binary protocol · Docker
**Interface:** TCP proxy on `:5433` — drop-in PostgreSQL replacement (point `DATABASE_URL` at `pgpool:5433`)
**Consumed by:** All 5 main projects — set `DATABASE_URL=postgres://user:pass@pgpool:5433/db`
**Teaches:** pgwire protocol parsing, connection multiplexing, why PgBouncer exists, pool sizing formula

## What It Is
A transparent TCP proxy that multiplexes thousands of app connections onto a small fixed pool of real PostgreSQL connections. Zero changes needed in calling code — `pgpool` is invisible to Go's `pgx`, Node.js's `pg`, and Prisma.

## Stack Detail
| Layer | Tech | Why |
|---|---|---|
| Language | Go 1.23+ | `net.Listener`, goroutine per client, `sync.Mutex` |
| Protocol | pgwire binary (from spec) | Parse just enough to detect transaction boundaries |
| Pool | Buffered `chan *net.Conn` | `Acquire()` blocks when empty; `Release()` sends back |
| Health check | `SELECT 1` every 30s | Remove dead backends before clients hit errors |
| Metrics | Prometheus on `:9090/metrics` | `pgpool_active_connections`, `pgpool_wait_duration_seconds` |
| Config | Env vars: `PGPOOL_BACKEND`, `PGPOOL_SIZE`, `PGPOOL_MODE` | `transaction` or `session` mode |

## Protocol Knowledge Required
```
Startup:  [length:4][version:4]["user\0name\0database\0db\0\0"]
Query:    ['Q'][length:4][sql\0]
Ready:    ['Z'][length:4][status:1]   'I'=idle 'T'=in-tx 'E'=error
Complete: ['C'][length:4][tag\0]      "INSERT 0 1\0"
Transaction mode: release backend on ReadyForQuery with 'I' status
```

## Pool Sizing Formula
```
pool_size = (num_CPUs × 2) + spindle_count
4-CPU RDS: pool_size = 9
Result: 10,000 app connections → 9 PostgreSQL connections
```

## Checklist
- [ ] TCP listener `:5433`, goroutine per accepted connection
- [ ] pgwire startup message parser: extract `user`, `database`
- [ ] Pool: `chan *net.Conn`, blocking `Acquire`, non-blocking `Release`
- [ ] Transaction mode: watch for `COMMIT`/`ROLLBACK` → release backend
- [ ] Session mode: release on client disconnect
- [ ] Health checker goroutine: `SELECT 1` every 30s, replace dead connections
- [ ] Prometheus metrics exported
- [ ] Benchmark: 1000 raw PG connections vs `pgpool` 10 backends — memory + throughput
- [ ] `go test -race ./...` and `goleak.VerifyNone(t)` pass

## Benchmarks
| Metric | Raw PG (1000 conns) | pgpool (10 backends) |
|---|---|---|
| PostgreSQL process count | 1000 | 10 |
| Connection setup p99 | ~50ms | ~1ms (reused) |
| RSS memory (PostgreSQL) | ~8GB | ~80MB |
