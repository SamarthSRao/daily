# Biweekly Project 7 — Distributed Lock Service
## Leader Election + Fencing Tokens

**Timeline:** Weeks 13–14  
**Language:** Go  
**What it mirrors:** etcd distributed locks · Redlock · DungBeetle leader election · BookWise seat locks  

---

## 1. What This Teaches

Why TTL-based distributed locks are not safe without fencing tokens, how to implement leader election correctly, and what split-brain means and how to test for it. This is the most nuanced distributed systems concept in the plan — most engineers implement locks incorrectly because they do not understand the fencing token problem.

---

## 2. The Problem It Solves

You need a lock service that guarantees mutual exclusion across multiple processes — even when the process holding the lock pauses (GC, network partition, slow disk) and its TTL expires before it finishes. Without fencing tokens, an expired lock holder can corrupt shared state by writing after a new owner has taken the lock.

---

## 3. The Fencing Token Problem (Why TTL Alone Is Not Enough)

```
Timeline without fencing tokens (INCORRECT):

t=0:  Process A acquires lock. TTL = 10s.
t=9:  Process A is paused (GC, slow disk, network).
t=10: Lock TTL expires.
t=11: Process B acquires lock. Starts writing to shared state.
t=12: Process A resumes. Still thinks it holds the lock.
      Process A writes to shared state. CORRUPTS Process B's work.

Timeline with fencing tokens (CORRECT):

t=0:  Process A acquires lock. Token = 1. TTL = 10s.
t=11: Process B acquires lock. Token = 2.
t=12: Process A resumes. Tries to write with token=1.
      Storage backend: "current token is 2, reject token=1". SAFE.
```

---

## 4. What You Build

### 4.1 Components

| Component | Responsibility |
|---|---|
| Lock Service API | gRPC: `Acquire(name, TTL) → (token, expiry)`, `Release(name, token)`, `Renew(name, token, TTL)` |
| Token Generator | Monotonically increasing counter stored in Redis. Every `Acquire` increments the counter. |
| Lock Store | Redis: `lock:{name}` → `{holder, token, expiry}`. Set with `SET NX EX`. |
| Fencing Verifier | Before any protected write: `VerifyToken(name, token)` — rejects if token < current. |
| Leader Election | Built on top of the lock service: one node acquires `lock:leader`, renews every `TTL/3` seconds. |
| Heartbeat Monitor | If leader fails to renew, TTL expires, new leader elected within one TTL window. |

### 4.2 Lock Acquisition (Lua Script — Atomic)

```lua
-- SET NX with token, atomic check-and-set
local current = redis.call('GET', KEYS[1])
if current == false then
    redis.call('SET', KEYS[1], ARGV[1], 'EX', ARGV[2])
    return 1  -- acquired
else
    return 0  -- already held
end
```

### 4.3 Lock Release (Lua Script — Atomic)

```lua
-- Only release if the token matches (prevent releasing someone else's lock)
local current = redis.call('GET', KEYS[1])
if current == ARGV[1] then
    redis.call('DEL', KEYS[1])
    return 1  -- released
else
    return 0  -- not your lock
end
```

### 4.4 Leader Election Pattern

```go
func (n *Node) RunLeaderElection(ctx context.Context) {
    for {
        token, err := lockSvc.Acquire("lock:leader", 30*time.Second)
        if err != nil {
            // Another node is leader. Wait and retry.
            time.Sleep(5 * time.Second)
            continue
        }
        
        // This node is now leader
        n.becomeLeader(token)
        
        // Renew every TTL/3 = 10s to stay leader
        ticker := time.NewTicker(10 * time.Second)
        for {
            select {
            case <-ticker.C:
                if err := lockSvc.Renew("lock:leader", token, 30*time.Second); err != nil {
                    n.stepDown()
                    break
                }
            case <-ctx.Done():
                lockSvc.Release("lock:leader", token)
                return
            }
        }
    }
}
```

### 4.5 Fencing Token Storage Verification

```go
// In the storage layer (PostgreSQL, S3, etc.):
func WriteWithFencing(name string, token int64, data []byte) error {
    var currentToken int64
    err := db.QueryRow(
        "SELECT fencing_token FROM resource_locks WHERE name = $1", name,
    ).Scan(&currentToken)
    
    if token < currentToken {
        return ErrStaleLock  // Expired lock holder — reject
    }
    
    // Update token and write data atomically
    _, err = db.Exec(
        "UPDATE resources SET data = $1, fencing_token = $2 WHERE name = $3 AND fencing_token <= $2",
        data, token, name,
    )
    return err
}
```

---

## 5. Key Concepts Demonstrated

- **SET NX EX** — `SET key value NX EX ttl`: atomic set-if-not-exists with expiry. This is the foundation of Redis-based distributed locks. `NX` prevents overwriting existing locks. `EX` auto-expires the lock if the holder dies.
- **Lua scripts for atomicity** — Redis is single-threaded, so a Lua script executes atomically. Without Lua, a GET + conditional SET has a race condition between the two commands.
- **Fencing tokens are monotonically increasing** — they must never decrease. Redis `INCR` provides an atomic, monotonically increasing counter.
- **TTL/3 renewal interval** — renew at 1/3 of TTL to tolerate one missed renewal (network blip) without losing the lock prematurely.
- **Split-brain** — when network partitions cause two nodes to both believe they are leader. Test by simulating a partition: pause the renewal goroutine for TTL+1 seconds, verify a new leader is elected, then resume the original leader and verify it correctly detects it is no longer leader.

---

## 6. Implementation Checklist

- [ ] gRPC lock service: `Acquire`, `Release`, `Renew` RPCs
- [ ] Redis token counter: `INCR lock:token:{name}` on every Acquire
- [ ] Lua script for atomic Acquire: SET NX EX with token
- [ ] Lua script for atomic Release: verify token before DEL
- [ ] Leader election loop with TTL/3 renewal
- [ ] Heartbeat failure test: pause renewal, verify new leader elected within TTL window
- [ ] Fencing token verifier: PostgreSQL CHECK in storage layer
- [ ] Split-brain test: two nodes, simulate network partition, verify one leader wins
- [ ] Correctness test: 10,000 goroutines acquire same lock, verify exactly one succeeds at any time
- [ ] `go test -race ./...` passes
- [ ] `goleak.VerifyNone(t)` — leader election goroutines must terminate cleanly

---

## 7. Benchmarks to Document

| Metric | Target |
|---|---|
| Lock acquisition latency p99 | < 5ms (Redis RTT) |
| Leader election time after failure | < TTL (30s) |
| Throughput: concurrent lock acquisitions | 10,000/sec |
| Fencing token rejection rate under correct usage | 0% |
| Split-brain test: time to resolve | < TTL window |

---

## 8. Interview Value

- **Uber / Rippling system design:** *"How do you prevent two cron workers from running the same job simultaneously?"* → Distributed lock with Redis SETNX. This is DungBeetle's exact implementation.
- **BookWise:** *"How do you prevent double-booking a seat?"* → Distributed lock with fencing tokens.
- **Google / Uber senior rounds:** *"What's wrong with using a distributed lock with just a TTL?"* → Fencing token problem. Most candidates can't answer this. You can.
- **All companies:** *"How does leader election work in etcd?"* → Raft-based, but the Redis SETNX pattern is the interview-level answer for custom implementations.

---

## 9. ADR to Write

**"Distributed lock implementation: Redis SETNX vs etcd vs ZooKeeper"**  
Decision: Redis SETNX with fencing tokens for locks that don't require Raft-level consistency guarantees.  
etcd/ZooKeeper: use for locks where correctness is more important than latency (e.g., cluster membership). Adds operational complexity.  
Key insight: Redis SETNX is not technically safe in a Redis cluster during a network partition (Redlock debate). For production, document this limitation and the mitigation (single Redis primary with Sentinel, not cluster mode, for locks).
