# Biweekly 05 — `lsm` · LSM-Tree Storage Engine · Go
## RocksDB / LevelDB / Cassandra Write Path from Scratch

**Timeline:** Weeks 9–10  
**Language:** Go  
**Interface:** Go package (embedded library)
**Consumed by:** OpenTrace (span storage education), interview depth signal
**Teaches:** MemTable, SSTable, Bloom filter, compaction, write amplification — the storage engine architecture used by RocksDB, LevelDB, and ClickHouse.

---

## 1. What It Is
An embeddable Go package implementing a Log-Structured Merge-tree (LSM-tree). Unlike other biweekly projects that are services, this is a library you `import`. Understanding the LSM-tree explains why systems like ClickHouse and Cassandra are optimized for write-heavy analytical workloads.

---

## 2. Stack Detail
| Layer | Tech | Why |
|---|---|---|
| Language | Go 1.23+ | `fsync`, `os.File`, `encoding/binary` — systems control |
| MemTable | B-Tree / SkipList | Sorted in-memory map for fast writes and ordered flushes |
| WAL | Reuses `vault` logic | Crash safety: append-only with CRC32 checksums |
| Bloom Filter | Bit array + `hash/fnv` | Skips 99% of unnecessary disk reads on misses |
| SSTable | Binary format | Immutable sorted files: data blocks + sparse index + footer |
| Compaction | k-way merge | Merges multiple L0 files into a single sorted L1 file |

---

## 3. Core Architecture & Write Path
1. **Write**: `Put(key, val)` → Write to WAL (durability) → Write to MemTable (sorted in-memory).
2. **Flush**: When MemTable exceeds size (e.g., 4MB), flush to an **SSTable** file on disk.
3. **Read**: `Get(key)` checks MemTable (newest) → then SSTables newest-to-oldest (using Bloom filter to skip).
4. **Compaction**: Background goroutine merges multiple SSTables to reduce read amplification and remove deleted keys (tombstones).

---

## 4. SSTable File Format
```
┌────────────────────────────────────────────────────┐
│  Data Block (sorted key-value pairs)               │
│    key_len(4) | key(n) | val_len(4) | val(m) | ... │
├────────────────────────────────────────────────────┤
│  Index Block (key → offset in data block)          │
│    Every 16th key: key_len(4) | key(n) | offset(8) │
├────────────────────────────────────────────────────┤
│  Bloom Filter Block (serialised bit array)         │
├────────────────────────────────────────────────────┤
│  Footer (offsets of index + bloom filter blocks)   │
└────────────────────────────────────────────────────┘
```

---

## 5. Checklist
- [ ] **MemTable**: Implementation of a sorted map with `Get`, `Put`, `Scan`.
- [ ] **WAL**: Append-only log integration for crash recovery (reuse `vault`).
- [ ] **SSTable Writer**: Flush MemTable to disk with sparse index and Bloom filter.
- [ ] **SSTable Reader**: Footer → Index → Binary Search → Data Block.
- [ ] **Bloom Filter**: `Add`, `MayContain` logic (1% false positive target).
- [ ] **Compaction**: k-way merge worker (Min-heap) for L0 → L1 merging.
- [ ] **Tombstones**: `Delete` writes a marker; compaction removes the data.
- [ ] **Crash Test**: 1M writes, `kill -9`, restart, verify data integrity.

---

## 6. Benchmarks
| Metric | Target |
|---|---|
| Write throughput (1M keys) | > 500K writes/sec |
| Read p99 — MemTable hit | < 1ms |
| Read p99 — SSTable + Bloom | < 3ms |
| Read p99 — SSTable No Bloom | < 20ms |
| Write amplification factor | Measure and document (Target < 20x) |

---

## 7. The ClickHouse Connection
ClickHouse's `MergeTree` is an LSM variant. Building `lsm` makes ClickHouse concepts like **Parts**, **Merging**, and **Primary Index** immediately legible. It also explains why `ORDER BY` is critical for query performance in OpenTrace.

