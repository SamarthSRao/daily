# Biweekly Project 3 — Clustered WebSocket Server
## Real-Time Chat with Redis Pub/Sub Fan-Out

**Timeline:** Weeks 5–6  
**Language:** Go  
**What it mirrors:** Slack real-time messaging · Uber driver tracking · RouteMaster live tracking  

---

## 1. What This Teaches

How to scale WebSocket servers horizontally using Redis pub/sub as the message bus between nodes. A single WebSocket server is trivial. A clustered one — where a message sent to Node A is delivered to a client connected to Node B — is a real distributed systems problem that appears in every real-time product.

---

## 2. The Problem It Solves

WebSocket connections are stateful and sticky — a connected client lives on one specific server node. When the sender is on Node A and the recipient is on Node B, Node A must somehow deliver the message to Node B, which then pushes it to the connected client. Redis pub/sub is the correct solution: every node subscribes to a shared channel and fans out locally.

---

## 3. What You Build

### 3.1 Architecture

```
Client A ──WS──→ Node 1 ──PUBLISH──→ Redis ──SUBSCRIBE──→ Node 2 ──WS──→ Client B
                                        │
                                        └─────SUBSCRIBE──→ Node 3 ──WS──→ Client C
```

### 3.2 Components

| Component | Responsibility |
|---|---|
| WebSocket Server | Accepts WS upgrades, manages connection registry, handles ping/pong keepalive |
| Connection Registry | `sync.Map` of `userID → *websocket.Conn` — thread-safe, no global lock |
| Redis Publisher | On message received from client: `PUBLISH channel:roomID message` |
| Redis Subscriber | On startup: `SUBSCRIBE channel:*` — receive messages from other nodes, fan out locally |
| Presence Service | Redis `HSET presence:{userID} nodeID TTL:60s` — tracks which node each user is on |
| Heartbeat | Client sends ping every 30s. Server responds with pong. Dead connections removed after 2 missed pings. |

### 3.3 Message Flow

```
1. Client A sends: { to: "userB", text: "hello" }
2. Node 1 receives on WebSocket
3. Node 1 checks local registry: is userB connected here?
   - YES → deliver directly
   - NO  → PUBLISH to Redis channel "room:general"
4. All nodes receive the PUBLISH via SUBSCRIBE
5. Node 2 checks local registry: is userB connected here?
   - YES → deliver via WebSocket
   - NO  → discard (userB not on this node)
```

### 3.4 Distributed Presence

```go
// On connect: register presence
redis.HSet(ctx, "presence:"+userID, map[string]interface{}{
    "nodeID":    os.Getenv("NODE_ID"),
    "connectedAt": time.Now().Unix(),
})
redis.Expire(ctx, "presence:"+userID, 60*time.Second)

// Heartbeat: renew TTL every 30s
// On disconnect: delete presence key
redis.Del(ctx, "presence:"+userID)
```

---

## 4. Key Concepts Demonstrated

- **WebSocket upgrade handshake** — HTTP → WS upgrade via `Upgrade: websocket` + `Connection: Upgrade` headers. The `gorilla/websocket` package handles this, but you must understand the handshake.
- **Ping/pong keepalive** — TCP connections can silently die (NAT timeout, mobile network switch). Ping every 30s, close connection after 2 missed pongs. Without this, your registry fills with dead connections.
- **sync.Map for the connection registry** — regular `map` with a mutex causes lock contention at thousands of concurrent connections. `sync.Map` is optimised for write-once-read-many patterns.
- **Redis pub/sub semantics** — fire-and-forget (no persistence, no guaranteed delivery). If a node is down when the message is published, it misses it. This is acceptable for chat; for guaranteed delivery, use Kafka.
- **Fan-out efficiency** — one Redis PUBLISH reaches all N nodes with one network call. Each node then delivers locally. O(1) Redis calls regardless of subscriber count.

---

## 5. Implementation Checklist

- [ ] WebSocket server on port 8080 with `/ws` upgrade endpoint
- [ ] Connection registry: `sync.Map[string, *websocket.Conn]`
- [ ] Ping/pong handler: 30s write deadline, close on failure
- [ ] Redis PUBLISH on message receive
- [ ] Redis SUBSCRIBE goroutine: reads messages, fans out to local connections
- [ ] Presence: HSET on connect, Expire every 30s heartbeat, DEL on disconnect
- [ ] Run 2 server instances locally, verify cross-node message delivery
- [ ] Benchmark: sub-10ms delivery p99 at 1000 concurrent connections
- [ ] `go test -race ./...` passes — connection registry access is the race hotspot
- [ ] `goleak.VerifyNone(t)` — subscriber goroutine must shut down cleanly

---

## 6. Benchmarks to Document

| Metric | Target |
|---|---|
| Message delivery latency p99 (same node) | < 5ms |
| Message delivery latency p99 (cross-node via Redis) | < 10ms |
| Concurrent connections per node | 5,000 |
| Memory per idle connection | < 10KB |
| Dead connection detection time | < 60s (2 × 30s ping interval) |

---

## 7. Interview Value

- **Swiggy / Zomato LLD round:** *"Design a real-time order tracking system"* → This is the implementation.
- **RouteMaster:** Live order tracking uses exactly this architecture — driver → WebSocket → Redis pub/sub → customer browser.
- **Uber:** *"How does your driver location update reach every connected rider on a different server?"* → Redis pub/sub fan-out.
- **DoorDash:** *"How do you scale WebSocket connections across multiple backend instances?"* → Sticky sessions are wrong; Redis pub/sub is right.

---

## 8. ADR to Write

**"WebSocket fan-out: Redis pub/sub vs Kafka vs direct node-to-node"**  
Decision: Redis pub/sub for low-latency chat fan-out.  
Kafka alternative: better for guaranteed delivery and replay, but adds 50–200ms latency — unacceptable for chat.  
Node-to-node alternative: requires service discovery and N×N connections — operationally complex.  
Tradeoff: Redis pub/sub has no delivery guarantee (fire-and-forget). Acceptable for chat; not for financial events.
