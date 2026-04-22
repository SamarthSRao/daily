# Biweekly 03 — `relay` · Clustered WebSocket Server · Go
**Stack:** Go · `gorilla/websocket` · Redis pub/sub · Redis Streams · Docker
**Interface:** WebSocket `ws://relay/ws?room={id}&token={jwt}` · REST `POST /publish`
**Consumed by:** OpenTrace (live tail), RouteMaster (driver tracking), BookWise (seat hold countdown)
**Teaches:** Redis pub/sub fan-out, horizontal WebSocket scaling, distributed presence, the split-brain problem in real-time systems

## What It Is
A clustered WebSocket server. Any service needing to push real-time events to browser clients calls `POST /publish` on any `relay` node. Redis pub/sub ensures every node receives the message and fans it out to locally-connected clients. Completely transparent to callers — they never know how many nodes are running.

## Stack Detail
| Layer | Tech | Why |
|---|---|---|
| Language | Go 1.23+ | `gorilla/websocket`, `sync.Map` registry, goroutine per connection |
| Fan-out bus | Redis pub/sub (`go-redis/v9`) | O(1) PUBLISH reaches all nodes — fire-and-forget |
| Message history | Redis Streams `XADD`/`XRANGE` | New clients get last 50 messages on join |
| Presence | Redis `HSET presence:{userID}` TTL 60s | Cross-node presence without coordination |
| Auth | JWT validation (`golang-jwt/jwt`) | Validate `token` param on WS upgrade |
| Metrics | Prometheus | `relay_connections_active`, `relay_messages_published_total` |

## Architecture
```
Service ──POST /publish {"room":"order:123","event":"location","data":{...}}──→ relay-node-1
                                                ──PUBLISH room:order:123──→ Redis
relay-node-1 ←── receives ──┐
relay-node-2 ←── receives ──┘  (both fan out to their locally connected clients)
```

## Checklist
- [ ] WS upgrade on `GET /ws?room=X&token=Y` — reject invalid JWT
- [ ] Connection registry: `sync.Map[roomID]map[connID]*websocket.Conn`
- [ ] Ping/pong: 30s deadline, deregister on failure
- [ ] Redis SUBSCRIBE goroutine per active room → fan out locally
- [ ] `POST /publish` → `redis.Publish("room:"+roomID, payload)`
- [ ] Redis Stream: `XADD` on publish, `XRANGE COUNT 50` on join (history)
- [ ] Presence: HSET on connect, EXPIRE on ping, DEL on disconnect
- [ ] Load test: 5000 concurrent WS connections, p99 cross-node delivery < 10ms
- [ ] `go test -race ./...` — connection map is the race hotspot
- [ ] `goleak.VerifyNone(t)` — subscriber goroutines exit when room empties

## Benchmarks
| Metric | Target |
|---|---|
| Same-node delivery p99 | < 5ms |
| Cross-node delivery (via Redis) p99 | < 10ms |
| Concurrent connections per node | 5,000 |
| Dead connection detection | < 60s |
