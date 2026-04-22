# Biweekly 01 — `vault` · WAL-Backed KV Store · Go
**Stack:** Go · `encoding/binary` · `hash/crc32` · `net/http` stdlib · Docker
**Interface:** REST `PUT/GET/DELETE /v1/keys/{key}`
**Consumed by:** DungBeetle (job dedup), PayCore (idempotency key cache), OpenTrace (span dedup)
**Teaches:** WAL design, crash recovery, log compaction, `fsync` — how PostgreSQL/SQLite/RocksDB guarantee durability

## What It Is
A crash-safe sidecar KV store. Any service needing durable local state (without PostgreSQL overhead) drops `vault` in and calls its REST API. The building block nature: one `vault` instance per service, each independently crash-safe.

## Stack Detail
| Layer | Tech | Why |
|---|---|---|
| Language | Go 1.23+ | `fsync`, `os.File`, `encoding/binary` — systems control |
| In-memory | `sync.Map` | Lock-free concurrent reads |
| Durability | `file.Sync()` | fsync before returning OK — the D in ACID |
| Checksum | `hash/crc32` | Detect partial writes on recovery |
| API | `net/http` stdlib | Zero dependencies |
| Testing | `testing` + `testify` + `goleak` | `go test -race`, crash simulation test |

## WAL Entry Format
```
[ op:1B ][ key_len:4B ][ val_len:4B ][ key:nB ][ value:mB ][ crc32:4B ]
op: 0x01=SET  0x02=DEL
crc32: over all preceding bytes — mismatch = partial write = stop replay
```

## Core Algorithm
```go
// Write: WAL first, memory second
func (s *Store) Set(key, value string) error {
    if err := s.wal.Append(Entry{Op: SET, Key: key, Value: value}); err != nil { return err }
    s.mem.Store(key, value)
    return nil
}
// Recovery: replay WAL from last snapshot
// Compaction: snapshot mem → atomic rename → delete old WAL segments
```

## Checklist
- [ ] WAL writer: encode + CRC32 + `file.Sync()`
- [ ] WAL reader: verify CRC32 per entry, stop at first mismatch
- [ ] Snapshot: atomic write (`os.Rename`) + record LSN
- [ ] Compaction: snapshot → delete WAL before snapshot LSN
- [ ] Crash test: 100K writes, `kill -9` at 50K, restart, verify all 50K present
- [ ] `go test -race ./...` and `goleak.VerifyNone(t)` pass

## Benchmarks
| Metric | Target |
|---|---|
| Write throughput — fsync ON | document the number |
| Write throughput — fsync OFF | 10–100x faster — document the tradeoff |
| Recovery — 1M entries | < 5s |
| Crash test | 0 partial writes on recovery |
