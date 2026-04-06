# Biweekly Project 8 — LSM-Tree Storage Engine
## RocksDB / LevelDB / Cassandra Write Path from Scratch

**Timeline:** Weeks 15–16  
**Language:** Go  
**What it mirrors:** RocksDB · LevelDB · Apache Cassandra · ScyllaDB write path  

---

## 1. What This Teaches

The Log-Structured Merge-Tree (LSM-tree) — the storage engine architecture used by RocksDB, LevelDB, Cassandra, and ClickHouse's MergeTree. Understanding the LSM-tree explains why these databases are optimised for write-heavy workloads and why reads require checking multiple files. After this project, you understand why Cassandra is fast for writes but slow for arbitrary reads, and what write amplification means.

---

## 2. The Problem It Solves

B-tree databases (PostgreSQL, MySQL) update data in-place — they find the page containing the row and overwrite it. This requires random disk I/O, which is slow. LSM-trees convert random writes into sequential writes by buffering all writes in memory first (MemTable), then flushing them to disk in sorted order (SSTable). Sequential disk writes are 10–100x faster than random writes.

---

## 3. How LSM-Trees Work

```
Write path:
  1. Write to WAL (durability guarantee)
  2. Write to MemTable (in-memory sorted map, e.g. red-black tree)
  3. When MemTable is full: flush to SSTable file on disk (sorted, immutable)
  4. Background: merge (compact) SSTable files to reduce file count

Read path:
  1. Check MemTable (newest data)
  2. Check each SSTable from newest to oldest (check Bloom filter first to skip misses)
  3. Return first match found (newest version wins)

                    ┌─────────────────────────────────────┐
  Writes ──────────→│  WAL (append-only, crash recovery)  │
                    └─────────────────────────────────────┘
                    ┌─────────────────────────────────────┐
  Writes ──────────→│  MemTable (in-memory sorted map)    │
                    └──────────────┬──────────────────────┘
                    (when full)    │ flush
                                   ↓
                    ┌─────────────────────────────────────┐
                    │  SSTable L0 (newest, unsorted)      │
                    │  SSTable L0                         │
                    └──────────────┬──────────────────────┘
                    (compaction)   │
                                   ↓
                    ┌─────────────────────────────────────┐
                    │  SSTable L1 (sorted, no overlaps)   │
                    └──────────────┬──────────────────────┘
                                   ↓ (size-tiered compaction)
                    ┌─────────────────────────────────────┐
                    │  SSTable L2 (larger, sorted)        │
                    └─────────────────────────────────────┘
```

---

## 4. What You Build

### 4.1 Components

| Component | Responsibility |
|---|---|
| WAL | Append-only log for crash recovery (same as Biweekly Project 1, reused here) |
| MemTable | In-memory sorted map (`btree` or red-black tree). All writes go here first. |
| SSTable | Immutable sorted file on disk. Written when MemTable exceeds size threshold. |
| Bloom Filter | Per-SSTable probabilistic set. Before reading an SSTable, check: "does this key exist here?" — skips 99%+ of unnecessary reads. |
| Compaction Worker | Background goroutine: merges multiple L0 SSTables into sorted L1 SSTables. |
| Storage Engine | Top-level API: `Get(key)`, `Put(key, value)`, `Delete(key)`, `Scan(start, end)` |

### 4.2 SSTable File Format

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

### 4.3 Bloom Filter Implementation

```go
type BloomFilter struct {
    bits    []byte
    numHash int
    size    int
}

func (bf *BloomFilter) Add(key []byte) {
    for i := 0; i < bf.numHash; i++ {
        h := hash(key, uint32(i)) % uint32(bf.size)
        bf.bits[h/8] |= 1 << (h % 8)
    }
}

func (bf *BloomFilter) MayContain(key []byte) bool {
    for i := 0; i < bf.numHash; i++ {
        h := hash(key, uint32(i)) % uint32(bf.size)
        if bf.bits[h/8]&(1<<(h%8)) == 0 {
            return false  // Definitely not present
        }
    }
    return true  // Probably present (false positive possible)
}

// Optimal parameters:
// m (bits per element) = -n * ln(p) / (ln(2))²
// k (hash functions)   = (m/n) * ln(2)
// For p=0.01 (1% false positive rate): m ≈ 10 bits/element, k ≈ 7
```

### 4.4 Compaction Strategy (Size-Tiered)

```
L0: SSTables written directly from MemTable flushes (may overlap in key range)
L1: Created by compacting L0 files. No key range overlaps within L1.
L2: Created by compacting L1 files. Larger files.

Trigger: when L0 has ≥ 4 SSTables, compact them into L1.
Process:
  1. Read all L0 SSTables (sorted within each file)
  2. k-way merge (like Merge K Sorted Lists — problem 111 in Document_from_Sam)
  3. Write result as new L1 SSTable(s) (split if > max size)
  4. Delete old L0 SSTables
```

---

## 5. Key Concepts Demonstrated

- **Sequential writes win** — MemTable converts random writes into a single sequential flush. On SSDs, sequential writes are still faster and cause less write amplification. On HDDs, the difference is 100x.
- **Write amplification** — each byte written by the user is written multiple times (WAL + MemTable flush + compaction). RocksDB's write amplification is typically 10–30x. This is the fundamental LSM-tree tradeoff vs B-trees.
- **Read amplification** — to read one key, you may check MemTable + L0 SSTable 1 + L0 SSTable 2 + L1 SSTable + ... Bloom filters reduce this by skipping SSTables that don't contain the key.
- **Bloom filter false positives** — a Bloom filter can say "key is present" when it isn't (false positive), but never says "key is absent" when it is (no false negatives). False positives cause unnecessary disk reads; false negatives would cause data loss.
- **Tombstones** — deletes in an LSM-tree write a "tombstone" marker rather than removing data immediately. The actual data is removed during compaction. This is why data is not immediately gone after deletion.

---

## 6. Implementation Checklist

- [ ] MemTable: sorted map with `Get`, `Put`, `Delete`, `Scan`, size tracking
- [ ] WAL integration: write to WAL before MemTable (reuse Project 1)
- [ ] SSTable writer: sorts MemTable, writes data block + index block + Bloom filter + footer
- [ ] SSTable reader: binary search on index block, Bloom filter check before data read
- [ ] Bloom filter: `Add`, `MayContain`, serialise/deserialise to bytes
- [ ] Storage engine: `Get` checks MemTable then SSTables newest-first
- [ ] Compaction worker: k-way merge of L0 SSTables → L1
- [ ] Tombstone handling: `Delete` writes tombstone, compaction removes tombstoned keys
- [ ] Crash recovery: replay WAL into fresh MemTable on startup
- [ ] Benchmark: 1M write throughput, read latency with/without Bloom filter
- [ ] `go test -race ./...` passes
- [ ] `goleak.VerifyNone(t)` — compaction goroutine terminates cleanly

---

## 7. Benchmarks to Document

| Metric | Target |
|---|---|
| Write throughput (1M keys) | > 500K writes/sec |
| Read latency p99 (hot key, MemTable) | < 1ms |
| Read latency p99 (cold key, 4 SSTables) | < 10ms |
| Read latency p99 with Bloom filter | < 2ms (skips 99% of SSTable reads) |
| Bloom filter false positive rate | < 1% (at default parameters) |
| Compaction throughput | > 100MB/sec |
| Write amplification factor | Measure and document |

---

## 8. Interview Value

- **Uber / Google system design:** *"Why does Cassandra have fast writes but slow range reads?"* → LSM-tree: sequential writes to MemTable + SSTable, but reads check multiple files. Bloom filters mitigate read amplification for point lookups.
- **Rippling / DoorDash:** *"What is write amplification?"* → Each user write is written N times due to WAL + compaction. LSM-trees have higher write amplification than B-trees but better raw write throughput.
- **OpenTrace:** ClickHouse's MergeTree engine is an LSM-tree variant. Understanding LSM-trees explains why `PARTITION BY toYYYYMM` + `ORDER BY` leads to fast analytical queries on OpenTrace's span data.
- **All companies (depth signal):** Building an LSM-tree from scratch is a strong signal that you understand storage engines at implementation depth — not just "Cassandra is eventually consistent."

---

## 9. ADR to Write

**"LSM-tree vs B-tree for OpenTrace span storage"**  
Decision: ClickHouse (MergeTree = LSM variant) for span storage.  
B-tree alternative (PostgreSQL): excellent for transactional workloads with mixed reads and writes. Too slow for 10M spans/sec write throughput.  
LSM-tree (ClickHouse): optimised for append-only time-series data. Sequential writes, columnar compression, partition pruning. The right tool for spans.  
Key insight: spans are never updated after insertion. Cassandra/RocksDB/ClickHouse are all optimised for exactly this access pattern.
