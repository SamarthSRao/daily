# Backend Engineering — Section 2: System Design
### 500 Questions | Rate Limiting · Caching · Auth · Pagination · Search · API Design · HLD
> Mapped to Backend 2026 Roadmap Stage 3 + Infraspec Project Work
> Tagged: [CONCEPT] [CODE] [DEBUG] [TRADEOFF] [DESIGN] [APPLY]
> Levels: {L1} must know · {L2} mid/senior · {L3} staff/architect

---

# PART A — Rate Limiting (Q1–Q80)

---

## Rate Limiting Algorithms (Q1–Q40)

1. `[CONCEPT]` `{L1}` What is rate limiting? What three things does it protect against: resource exhaustion, abuse, cost control?
2. `[CONCEPT]` `{L1}` What is the token bucket algorithm? What is the burst capacity? How does it differ from a strict fixed rate?
3. `[CONCEPT]` `{L1}` What is the leaky bucket algorithm? How does it smooth bursty traffic into a constant output rate?
4. `[CONCEPT]` `{L1}` What is fixed window rate limiting? What is the boundary spike problem? At what time boundary can a client send 2x the allowed rate?
5. `[CONCEPT]` `{L1}` What is sliding window rate limiting? How does it solve the boundary spike problem?
6. `[CONCEPT]` `{L2}` What is the sliding window counter algorithm? How does it approximate a sliding window using two fixed window counts with a fractional weight?
7. `[TRADEOFF]` `{L1}` Compare token bucket vs leaky bucket: which allows bursts? Which guarantees constant rate? When do you choose each?
8. `[TRADEOFF]` `{L2}` Compare fixed window vs sliding window: what is the accuracy tradeoff? What is the memory tradeoff?
9. `[CODE]` `{L1}` Implement a token bucket rate limiter in Go: refill goroutine adds tokens at rate R/sec, `TakeToken()` returns bool, `capacity` is the max bucket size.
10. `[CODE]` `{L1}` Implement a fixed window rate limiter in Go using a counter and timestamp. Reset the counter when the window expires.
11. `[CODE]` `{L2}` Implement a sliding window rate limiter in Redis: `ZADD key timestamp timestamp`, `ZREMRANGEBYSCORE key 0 (now-window)`, `ZCOUNT key (now-window) now`. All in a Lua script.
12. `[CODE]` `{L2}` Implement the sliding window counter algorithm: use two Redis keys for current and previous windows. Calculate `previous_count * (1 - elapsed/window) + current_count`.
13. `[CODE]` `{L2}` Implement a token bucket rate limiter in Redis using a Lua script: store `{tokens, last_refill_time}`, calculate tokens since last refill, clamp to capacity, decrement.
14. `[CONCEPT]` `{L2}` What is jitter in rate limiting? Why is adding `random(0, base*0.1)` to TTL important when thousands of clients hit the limit simultaneously?
15. `[CONCEPT]` `{L2}` What is rate limiting per user vs per IP vs per API key vs per endpoint? When would you combine multiple dimensions?
16. `[DESIGN]` `{L1}` Design OpenTrace's rate limiting: per-API-key (1000 spans/sec), per-tenant (10K spans/sec), global (1M spans/sec). What Redis data structures and what Lua script?
17. `[CODE]` `{L2}` Implement multi-dimensional rate limiting for OpenTrace: check API key limit first (cheapest), then tenant limit, then global limit. Short-circuit on first failure.
18. `[CONCEPT]` `{L2}` What HTTP headers communicate rate limit status to clients? `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, `Retry-After`.
19. `[CODE]` `{L2}` Return proper rate limit headers in OpenTrace: set all four headers on every response, not just on 429 responses.
20. `[CONCEPT]` `{L2}` What is a distributed rate limiter? Why does a local in-process counter fail when you have 10 instances of OpenTrace Collector?
21. `[DEBUG]` `{L2}` OpenTrace's rate limiter passes all local tests. In production with 8 Collector instances, clients can send 8x the allowed rate. What went wrong? How do you fix it?
22. `[CODE]` `{L2}` Implement a Redis-based distributed rate limiter with atomic Lua script for OpenTrace. Explain why atomicity is essential.
23. `[TRADEOFF]` `{L2}` Redis rate limiter vs API gateway rate limiter (Kong/nginx): what are the tradeoffs for a 10-service microservice system?
24. `[CONCEPT]` `{L2}` What is hard rate limiting (reject immediately) vs soft rate limiting (queue and delay)? When does OpenTrace use each?
25. `[CODE]` `{L2}` Implement soft rate limiting (queuing) for OpenTrace's batch span ingest: instead of rejecting, queue the request for up to 2 seconds, process when under limit.
26. `[DESIGN]` `{L2}` Design the OTP gateway's rate limiting: max 5 OTP requests per user per minute, max 3 OTP verification attempts per user per 5 minutes. What Redis keys and TTLs?
27. `[CODE]` `{L2}` Implement OTP rate limiting: `INCR otp:send:{userId}`, expire in 60s, reject if > 5. `INCR otp:verify:{userId}`, expire in 300s, reject if > 3.
28. `[DESIGN]` `{L2}` Design BookWise booking API rate limiting: 5 bookings/minute per user, 1000 bookings/minute per venue, 10K bookings/minute globally. Implement with Redis Lua.
29. `[CONCEPT]` `{L2}` What is a circuit breaker vs a rate limiter? Are they complementary or redundant? When does OpenTrace use each?
30. `[CODE]` `{L2}` Implement rate limiting for OpenTrace's webhook delivery: max 100 webhooks/sec per endpoint URL, 10K/sec per tenant. Track using Redis sorted sets.
31. `[DESIGN]` `{L2}` Design a tiered rate limit system for OpenTrace API: free tier (100 spans/sec), pro tier (10K spans/sec), enterprise tier (unlimited). Store tier in JWT claims.
32. `[CODE]` `{L2}` Implement tier-based rate limiting in OpenTrace: read tier from JWT, select Redis key with tier-specific limit, apply sliding window.
33. `[DEBUG]` `{L2}` OpenTrace's rate limiter rejects valid enterprise users during a traffic spike even though they're under their limit. What is the cause? (Hint: Lua script has a race between `now` and `ZREMRANGEBYSCORE`)
34. `[CONCEPT]` `{L3}` What is the "two buckets" approach to rate limiting that prevents the Lua race condition?
35. `[CODE]` `{L3}` Implement atomic rate limiting using Redis `TIME` command inside Lua to get consistent time without client-side `now` race.
36. `[DESIGN]` `{L2}` Design rate limiting for OpenTrace's export API: large exports can take 60s. How do you prevent export-hogging without penalizing short queries?
37. `[CONCEPT]` `{L2}` What is a quota vs a rate limit? Quota = total per period (e.g., 1M spans/month). Rate limit = throughput (e.g., 1K spans/sec). How does OpenTrace implement both?
38. `[CODE]` `{L2}` Implement monthly quota tracking for OpenTrace: daily Redis counter `quota:{tenantId}:{YYYY-MM-DD}`, expire after 32 days, sum last 30 days to check monthly total.
39. `[DESIGN]` `{L3}` Design rate limiting for OpenTrace that survives Redis downtime: fall back to in-process counter (approximate), never fully block on Redis unavailability.
40. `[CODE]` `{L3}` Implement Redis-with-fallback rate limiter: try Redis Lua script with 10ms timeout, on timeout/error use in-process token bucket as fallback. Log when fallback is used.

---

## Rate Limiting in Production (Q41–Q80)

41. `[DESIGN]` `{L2}` OpenTrace's Collector receives 10M spans/sec. The rate limiter runs for every span. What is the performance requirement? Can Redis handle this? What is the alternative?
42. `[TRADEOFF]` `{L2}` Per-span rate limiting vs per-batch rate limiting for OpenTrace: what is the throughput difference? What is the fairness difference?
43. `[CODE]` `{L2}` Implement per-batch rate limiting for OpenTrace: one Redis call per batch (up to 10K spans), rate limit in spans/sec. Calculate token cost per batch.
44. `[CONCEPT]` `{L2}` What is the "thundering herd" on rate limit reset? When 1000 clients all hit the limit at the same time window boundary, what happens when the window resets?
45. `[CODE]` `{L2}` Implement rate limit reset with jitter in OpenTrace: instead of all resets happening at :00, spread resets across 10-second intervals using `hash(apiKey) % 10` as offset.
46. `[CONCEPT]` `{L2}` What is rate limit bypass? What are the three common techniques: missing the `X-API-Key` header, using multiple API keys, using multiple IPs?
47. `[DEBUG]` `{L2}` A customer bypasses OpenTrace's rate limit by rotating through 5 API keys. How do you detect and fix this?
48. `[CODE]` `{L2}` Implement tenant-level rate limiting that aggregates all API keys belonging to the same tenant: `INCR rate:{tenantId}` instead of `INCR rate:{apiKey}`.
49. `[DESIGN]` `{L2}` Design rate limiting for OpenTrace's gRPC streaming: a single gRPC stream can send spans at unlimited speed. How do you rate limit a streaming RPC?
50. `[CODE]` `{L2}` Implement per-stream rate limiting for OpenTrace's gRPC `ExportTraces` streaming RPC: check token bucket every 100ms, pause stream if over limit using `time.Sleep`.
51. `[CONCEPT]` `{L2}` What is gRPC flow control as a natural rate limiting mechanism? How does HTTP/2 window backpressure prevent OpenTrace Collector from being overwhelmed?
52. `[DESIGN]` `{L2}` Design OpenTrace's rate limiting observability: what metrics do you export? What alerts? What does the Grafana dashboard show?
53. `[CODE]` `{L2}` Instrument OpenTrace's rate limiter: `rate_limit_checked_total{tier}` counter, `rate_limit_rejected_total{tier}` counter, `rate_limit_remaining{tier}` gauge, `rate_limit_check_duration_seconds` histogram.
54. `[DEBUG]` `{L2}` OpenTrace's rate limiter Redis calls are adding 8ms to every request. The rate limit itself is 5ms budget. How do you reduce Redis round-trip latency?
55. `[CODE]` `{L2}` Optimize OpenTrace's rate limiter with connection pooling: reuse Redis connections, use pipelining for multi-key limits, reduce round trips.
56. `[CONCEPT]` `{L3}` What is a local cache for rate limit tokens? How does a "gossip-based distributed counter" work for rate limiting across 100 nodes without a central Redis?
57. `[CODE]` `{L3}` Implement a gossip-based approximate rate limiter: each node keeps a local count, gossips counts to 2 random peers every 100ms, use sum of all counts as global estimate.
58. `[DESIGN]` `{L2}` Design BookWise seat booking rate limiting: prevent a user from making more than 5 seat hold attempts per minute across all venues. How do you enforce this at scale?
59. `[CODE]` `{L2}` Implement seat hold rate limiting in BookWise: `INCR holds:{userId}`, `EXPIRE holds:{userId} 60` on first increment, check before `SELECT FOR UPDATE SKIP LOCKED`.
60. `[CONCEPT]` `{L2}` What is a "leaky bucket queue" implementation? How does DungBeetle use it to process jobs at a maximum rate of 100/sec regardless of submission rate?
61. `[CODE]` `{L2}` Implement DungBeetle's job processing rate limiter: a Go ticker fires every 10ms (100/sec), each tick dequeues and processes one job from the PostgreSQL queue.
62. `[DESIGN]` `{L2}` Design rate limiting for PayCore's payment API: max 10 payments/second per user, max 1000/second per merchant, max 10K/second globally. What are the consequences of each limit being hit?
63. `[CODE]` `{L2}` Implement PayCore payment rate limiting with hierarchical check: user → merchant → global. Use separate Redis keys with appropriate TTLs.
64. `[CONCEPT]` `{L2}` What is adaptive rate limiting? How does OpenTrace automatically lower rate limits when ClickHouse is under load to prevent cascading failures?
65. `[CODE]` `{L2}` Implement adaptive rate limiting for OpenTrace: monitor ClickHouse query latency p99, if > 500ms, reduce accept rate by 50%, restore when p99 < 200ms.
66. `[TRADEOFF]` `{L2}` Token bucket vs sliding window for OpenTrace's span ingestion: token bucket allows bursts (SDK reconnect flood), sliding window is more fair. Which do you choose?
67. `[CODE]` `{L2}` Implement a global circuit breaker that disables all rate limiting checks if Redis latency exceeds 50ms for more than 10 consecutive requests. Log prominently when this occurs.
68. `[DESIGN]` `{L3}` Design rate limiting for OpenTrace's public API that works across 3 geographic regions (US, EU, APAC) without a central Redis: use Redis Cluster with regional shards.
69. `[CODE]` `{L3}` Implement geo-distributed rate limiting: hash API key to one of 3 Redis Cluster shards by region, accept slight inconsistency between regions (2x burst possible).
70. `[DEBUG]` `{L2}` After a Redis failover, OpenTrace's rate limiter returns errors and defaults to "allow all." How do you make the fallback safer: allow reduced rate vs allow all?
71. `[CONCEPT]` `{L2}` What is "shadow rate limiting"? How does OpenTrace test a new rate limiting algorithm by running it in parallel without enforcing it, comparing results to the existing algorithm?
72. `[CODE]` `{L2}` Implement shadow rate limiting for OpenTrace: run new algorithm in a goroutine, log `shadow_limit_exceeded=true` when new algo would block but current doesn't. Compare after 1 week.
73. `[DESIGN]` `{L2}` Design the rate limit bypass detection system for OpenTrace: detect when a tenant has multiple API keys all near their individual limits simultaneously. Alert the fraud team.
74. `[CODE]` `{L2}` Implement rate limit telemetry aggregation: every minute, aggregate `rate_limit_rejected_total` by tenant, sort by rejections, alert if any tenant exceeds 1000 rejections/minute.
75. `[CONCEPT]` `{L2}` What is the "credit" model for rate limiting? DungBeetle jobs have different "cost" (CPU-seconds). How do you rate limit based on job cost rather than job count?
76. `[CODE]` `{L2}` Implement cost-based rate limiting for DungBeetle: each job specifies `cost` (1-10), rate limit is in cost-units/sec (100/sec). Deduct `cost` tokens from bucket instead of 1.
77. `[DESIGN]` `{L3}` Design a rate limiting system for OpenTrace that supports "fair queuing": 10 tenants share a global 1M spans/sec, each gets fair share (100K/sec) but unused capacity is distributed to active tenants.
78. `[CODE]` `{L3}` Implement weighted fair queuing for OpenTrace rate limiting: track per-tenant tokens and a global token pool. Active tenants borrow from global pool when their allocation is exceeded.
79. `[CONCEPT]` `{L2}` What is a "token lottery" rate limiting algorithm? How does it provide probabilistic fairness without per-request Redis overhead?
80. `[APPLY]` `{L2}` Walk through the complete rate limiting decision for an OpenTrace Collector request: API key check → tenant check → global check → headers set → response. Include failure modes and fallbacks at each step.

---

# PART B — Caching (Q81–Q160)

---

## Caching Fundamentals (Q81–Q120)

81. `[CONCEPT]` `{L1}` What is a cache? Name five caching layers in a typical backend system from closest to farthest from the client.
82. `[CONCEPT]` `{L1}` What is cache-aside (lazy loading)? Draw the read path: check cache → miss → query DB → write to cache → return. Draw the write path.
83. `[CONCEPT]` `{L1}` What is write-through caching? What is write-behind (write-back)? Compare consistency and performance properties.
84. `[CONCEPT]` `{L1}` What is read-through caching? How does it differ from cache-aside in terms of who is responsible for loading the cache?
85. `[CONCEPT]` `{L1}` What is a cache hit? Cache miss? Cache eviction? Cache invalidation? Cache warming?
86. `[CONCEPT]` `{L1}` What is LRU (Least Recently Used) eviction? How is it implemented efficiently using a doubly linked list + hash map?
87. `[CONCEPT]` `{L2}` What is LFU (Least Frequently Used) eviction? When is it better than LRU? What is the implementation complexity?
88. `[CONCEPT]` `{L2}` What is cache stampede (dog-pile effect)? How do you prevent it with TTL jitter, mutex locking, or probabilistic early expiry?
89. `[CONCEPT]` `{L2}` What is the thundering herd in caching? When 1000 clients simultaneously miss the same key, what is the load on the DB and how do you prevent it?
90. `[CODE]` `{L2}` Implement LRU cache from scratch in Go: doubly linked list + hash map. `Get(key)` in O(1), `Put(key, value)` in O(1), evict LRU on capacity overflow.
91. `[CODE]` `{L2}` Implement `singleflight` to collapse concurrent cache misses for the same key: first goroutine queries DB, others wait and share the result.
92. `[CONCEPT]` `{L2}` What is stale-while-revalidate? How does OpenTrace serve a cached trace result while refreshing from ClickHouse in the background?
93. `[CODE]` `{L2}` Implement stale-while-revalidate in Go: return cached value immediately, start background goroutine to refresh, use `singleflight` to prevent refresh storms.
94. `[CONCEPT]` `{L2}` What is probabilistic early expiry? How does it preemptively refresh a cache entry before it expires to prevent synchronous cache misses?
95. `[CODE]` `{L2}` Implement probabilistic early expiry: `if TTL_remaining < TTL_total * 0.2 AND random() < 0.1: refresh_now()`. This spreads out refreshes.
96. `[CONCEPT]` `{L2}` What is cache warming? Why is it important when deploying a new OpenTrace Query Service instance?
97. `[CODE]` `{L2}` Implement cache warming for OpenTrace: on startup, query the top 1000 most-accessed trace IDs from PostgreSQL (access logs), pre-populate Redis cache before serving traffic.
98. `[CONCEPT]` `{L2}` What is a local in-process cache (L1) vs a shared Redis cache (L2)? What is the consistency tradeoff between them?
99. `[CODE]` `{L2}` Implement two-tier caching for OpenTrace: L1 = `sync.Map` with 5s TTL (per-process), L2 = Redis with 60s TTL. Read L1 first, miss → read L2, miss → query ClickHouse.
100. `[TRADEOFF]` `{L2}` L1 in-process cache vs L2 Redis cache for OpenTrace: what happens during a deployment when L1 caches are fresh but the code serving them changes? How do you handle cache version mismatch?
101. `[CODE]` `{L2}` Implement cache versioning for OpenTrace: prefix all cache keys with `v{version}:{key}`. When deploying a new version, the new code uses different keys, old cache is naturally abandoned.
102. `[CONCEPT]` `{L2}` What is cache poisoning? How does a malicious or buggy write of wrong data to the cache affect all subsequent reads? How do you detect and recover from it?
103. `[DEBUG]` `{L2}` OpenTrace serves incorrect trace data to 10% of users. All are reading from cache. The ClickHouse data is correct. What happened and how do you flush selectively?
104. `[CODE]` `{L2}` Implement selective cache invalidation for OpenTrace: `DEL cache:trace:{traceId}` when the Processor writes new spans for that trace. Use Kafka event to trigger invalidation.
105. `[CONCEPT]` `{L2}` What is a write-around cache strategy? When does OpenTrace write-around (skip the cache on write) to avoid polluting the cache with one-time data?
106. `[CODE]` `{L2}` Implement write-around for OpenTrace: bulk historical trace imports bypass the cache (not hot data), only on-demand reads populate the cache.
107. `[CONCEPT]` `{L2}` What is cache coherence in a multi-region setup? How does OpenTrace's US cache and EU cache stay consistent when a trace is updated?
108. `[DESIGN]` `{L2}` Design cache invalidation for OpenTrace's multi-region deployment: when trace data changes in us-east-1, how do you invalidate caches in eu-west-1 and ap-south-1?
109. `[CODE]` `{L2}` Implement cross-region cache invalidation for OpenTrace: publish invalidation message to a global Kafka topic (all regions consume), each region deletes from its local Redis.
110. `[CONCEPT]` `{L2}` What is a "cold start" problem for caches? How does OpenTrace's cache hit rate evolve from 0% to 90% during the first hour after a cold deployment?
111. `[CODE]` `{L2}` Implement gradual cache warming for OpenTrace: on startup, serve from cache where available, simultaneously queue a background job to pre-warm top 10K trace IDs over 10 minutes.
112. `[DEBUG]` `{L2}` OpenTrace's cache hit rate drops from 95% to 20% after a deployment. The cache was invalidated during the deployment. How do you prevent this in future deployments?
113. `[CODE]` `{L2}` Keep the cache live during OpenTrace deployments: use a separate cache invalidation service that only invalidates explicitly, not on pod restart. Rolling updates do not flush cache.
114. `[CONCEPT]` `{L2}` What is cache-key design? What makes a good cache key for OpenTrace's trace queries? What is the risk of including user-specific data in a shared cache key?
115. `[CODE]` `{L2}` Design cache keys for OpenTrace: `trace:{traceId}` (shared), `traces:service:{serviceName}:page:{cursor}` (shared), `user:{userId}:recent_traces` (per-user).
116. `[CONCEPT]` `{L2}` What is negative caching? How does OpenTrace cache "trace not found" results to avoid hammering ClickHouse for non-existent trace IDs?
117. `[CODE]` `{L2}` Implement negative caching in OpenTrace: cache `NOT_FOUND` sentinel for 5s for trace IDs that don't exist. Return 404 immediately on cache hit with sentinel.
118. `[CONCEPT]` `{L2}` What is a cache size estimation? For OpenTrace's trace cache: 1M active traces, average trace payload 50KB, how much Redis memory is needed? What is the LRU eviction policy at capacity?
119. `[CODE]` `{L2}` Calculate OpenTrace's Redis memory budget: 1M trace entries × 50KB = 50GB. Use `maxmemory 50gb` and `maxmemory-policy allkeys-lru`. What is the expected hit rate at 1M entries?
120. `[TRADEOFF]` `{L2}` Caching everything (high hit rate, high memory, stale risk) vs caching only hot data (lower hit rate, lower memory, fresh data): what is OpenTrace's strategy?

---

## Redis Caching Patterns (Q121–Q160)

121. `[CONCEPT]` `{L1}` What are Redis's 8 data structures? Which does OpenTrace use for: session storage (Hash), rate limiting (ZSet), leaderboards (ZSet), pub/sub (Pub/Sub), live tail (Streams)?
122. `[CODE]` `{L1}` Implement session storage in Redis: `HMSET session:{id} user_id val tenant_id val expires_at val`, `EXPIRE session:{id} 86400`, `HGETALL session:{id}` to retrieve.
123. `[CODE]` `{L2}` Implement a leaderboard for BookWise's most-booked venues: `ZADD leaderboard {bookingCount} {venueId}`, `ZREVRANGE leaderboard 0 9 WITHSCORES` for top 10.
124. `[CODE]` `{L2}` Implement a job queue using Redis List for DungBeetle: `LPUSH jobs:{queue} {jobJson}`, `BRPOPLPUSH jobs:{queue} jobs:processing 30` (atomic dequeue + move to processing list).
125. `[CODE]` `{L2}` Implement Redis pub/sub fan-out for BookWise seat availability: `PUBLISH seats:{venueId} {seatId}:{status}`, `SUBSCRIBE seats:{venueId}` in WebSocket server goroutine.
126. `[CONCEPT]` `{L2}` What is Redis pipelining? What throughput improvement does it provide? When does it fail to help (commands that depend on previous results)?
127. `[CODE]` `{L2}` Implement Redis pipelining for OpenTrace's batch cache write: after processing a batch of 1000 spans, pipeline 1000 `SET trace:{id} {data} EX 60` commands in one round trip.
128. `[CONCEPT]` `{L2}` What is Redis Lua scripting? Why does it run atomically? What is `EVALSHA` vs `EVAL`?
129. `[CODE]` `{L2}` Write a Redis Lua script for OpenTrace's atomic "check-and-set with version": `if GET version == expected then SET value == new AND INCR version`. Return 0 on conflict.
130. `[CONCEPT]` `{L2}` What is Redis TTL jitter? Why is `TTL = base + random(0, base*0.1)` important for cache expiry under load?
131. `[CODE]` `{L2}` Add TTL jitter to OpenTrace's trace cache writes: `ttl = 60 + rand.Intn(12)` seconds (±10%). This prevents cache expiry wave every 60s.
132. `[DEBUG]` `{L2}` Redis memory grows without bound. `INFO memory` shows `used_memory: 8GB`. The data should only be 2GB. What are the three most likely causes (no TTL set, memory fragmentation, large key count)?
133. `[CODE]` `{L2}` Audit OpenTrace's Redis keys for missing TTLs: `SCAN 0 MATCH cache:* COUNT 1000` and check TTL for each. Alert if any persistent cache key has no TTL.
134. `[CONCEPT]` `{L2}` What is Redis eviction policy? What is `allkeys-lru`? What is `volatile-lru`? What is `noeviction`? When does OpenTrace use each?
135. `[CONCEPT]` `{L2}` What is Redis persistence: RDB snapshots vs AOF (Append-Only File)? What is `appendfsync everysec`? What is the data loss risk of each?
136. `[CONCEPT]` `{L2}` What is Redis Replication vs Redis Sentinel vs Redis Cluster? When does OpenTrace need each?
137. `[CODE]` `{L2}` Configure Redis Sentinel for OpenTrace: 3 Sentinel nodes monitoring a primary + 2 replicas. Set `min-replicas-to-write 1` to require at least one in-sync replica for writes.
138. `[CONCEPT]` `{L2}` What is Redis Cluster's hash slot mechanism? How are 16384 slots distributed across nodes? What is the `{hash_tag}` syntax for co-locating keys on the same slot?
139. `[DEBUG]` `{L2}` A Redis Cluster operation in OpenTrace fails with `CROSSSLOT Keys in request don't hash to the same slot`. What is happening and how do you fix it with hash tags?
140. `[CODE]` `{L2}` Fix the CROSSSLOT error in OpenTrace's multi-key rate limiter: use hash tags `{tenantId}` to co-locate all keys for the same tenant on the same Redis Cluster slot.
141. `[CODE]` `{L2}` Implement Redis Streams consumer group for OpenTrace: `XREADGROUP GROUP processor instance-1 COUNT 100 STREAMS spans >`, `XACK spans processor {messageId}`.
142. `[DEBUG]` `{L2}` OpenTrace's Redis Stream has messages in `XPENDING` that are never acknowledged. What is the likely cause? How do you reclaim stale messages with `XCLAIM`?
143. `[CODE]` `{L2}` Implement Redis Stream DLQ for OpenTrace: after 3 delivery attempts (`XPENDING delivery_count > 3`), `XADD spans.dlq * {original message + error}`, `XACK spans processor {id}`.
144. `[CONCEPT]` `{L2}` What is Redis HyperLogLog? What cardinality problem does it solve? What is its space complexity (12KB) and error rate (0.81%)?
145. `[CODE]` `{L2}` Use Redis HyperLogLog to count unique trace IDs received per minute in OpenTrace: `PFADD unique_traces:{minute} {traceId}`, `PFCOUNT unique_traces:{minute}`.
146. `[CONCEPT]` `{L2}` What is `SCAN` vs `KEYS` in Redis? Why must you never use `KEYS *` in production Redis? What is the cursor-based iteration approach?
147. `[CODE]` `{L2}` Use Redis `SCAN` to safely iterate all `cache:trace:*` keys in OpenTrace without blocking: `SCAN cursor MATCH cache:trace:* COUNT 100` in a loop until cursor = 0.
148. `[CONCEPT]` `{L2}` What is Redis `WATCH`/`MULTI`/`EXEC` (optimistic transactions)? How does OpenTrace use it for atomic "read-modify-write" seat booking without a distributed lock?
149. `[CODE]` `{L2}` Implement optimistic locking for BookWise seat booking with Redis WATCH: `WATCH seat:{id}`, read current status, `MULTI`, `SET seat:{id} booked`, `EXEC`. Retry on `nil` (conflict).
150. `[DEBUG]` `{L2}` Redis latency spikes to 500ms during `BGSAVE` (RDB snapshot) in OpenTrace. What is causing it? How do you mitigate it (disable BGSAVE, use AOF-only, or schedule during off-hours)?
151. `[CODE]` `{L2}` Implement Redis connection health check in OpenTrace: background goroutine pings Redis every 30s with `PING`, logs warning if round-trip > 10ms, triggers circuit breaker if > 100ms.
152. `[CODE]` `{L2}` Implement Redis key expiry notification for BookWise: subscribe to `__keyevent@0__:expired`, when a booking reservation key expires, publish a seat-released event to Kafka.
153. `[CONCEPT]` `{L2}` What is `redis-cli --hotkeys`? How do you detect hot keys in OpenTrace's Redis cluster? What is a "hot key" problem?
154. `[DEBUG]` `{L2}` A single OpenTrace Redis key is hit 100K times/sec. The Redis instance's CPU is maxed. What is the hot key problem and what are the three solutions?
155. `[CODE]` `{L2}` Fix the hot key problem in OpenTrace: shard the hot key into 10 replicas (`cache:trace:{id}:{rand(0,10)}`), write to all 10, read from a random one.
156. `[CONCEPT]` `{L2}` What is Redis memory encoding optimization? What is `listpack` (ziplist) vs `hashtable` for Hash type? How does object size affect encoding choice?
157. `[CODE]` `{L2}` Configure Redis encoding thresholds for OpenTrace's span metadata hash: `hash-max-listpack-entries 128`, `hash-max-listpack-value 64`. Monitor memory savings.
158. `[CONCEPT]` `{L3}` What is RedisJSON? When would OpenTrace use it instead of storing JSON strings in regular Redis keys?
159. `[CODE]` `{L3}` Use RedisJSON to store OpenTrace trace objects: `JSON.SET trace:{id} $ {traceJson}`, `JSON.GET trace:{id} $.spans[0:10]` to retrieve partial data.
160. `[TRADEOFF]` `{L2}` Redis cache vs CDN cache vs PostgreSQL query cache vs application-level cache for OpenTrace: when does each layer make sense? What is the cache hierarchy for trace list queries?

---

# PART C — Authentication & Authorization (Q161–Q240)

---

## JWT & Session Auth (Q161–Q200)

161. `[CONCEPT]` `{L1}` What is JWT? What are the three Base64url-encoded parts: header, payload, signature?
162. `[CONCEPT]` `{L1}` What is the difference between JWT HS256 (HMAC symmetric) and RS256 (RSA asymmetric)? When does OpenTrace use RS256?
163. `[CONCEPT]` `{L1}` What JWT claims are standard: `iss`, `sub`, `aud`, `exp`, `nbf`, `iat`, `jti`? What custom claims does OpenTrace add: `tenant_id`, `role`, `api_key_id`?
164. `[CODE]` `{L1}` Implement JWT RS256 signing in Go: generate RSA keypair, sign claims with private key, verify signature with public key.
165. `[CODE]` `{L2}` Implement JWT middleware in Go chi: extract Bearer token, verify RS256, check `exp` and `nbf`, extract `tenant_id` and `role` claims, inject into context.
166. `[CONCEPT]` `{L1}` What is a refresh token? Why does it exist? How does token rotation work?
167. `[CODE]` `{L2}` Implement refresh token rotation for OpenTrace: issue 15-min access token + 7-day refresh token. On refresh: verify refresh token, issue new pair, revoke old refresh token in Redis.
168. `[CONCEPT]` `{L2}` What is refresh token revocation? How does OpenTrace store revoked refresh tokens in Redis with a TTL matching the token's remaining lifetime?
169. `[CODE]` `{L2}` Implement refresh token revocation: on logout, `SET revoked:{jti} 1 EX {remaining_ttl}`. In refresh endpoint, check `EXISTS revoked:{jti}` before issuing new tokens.
170. `[CONCEPT]` `{L2}` What is clock skew tolerance in JWT validation? What is the typical leeway (30s)? How does OpenTrace implement it?
171. `[CODE]` `{L2}` Add clock skew tolerance to OpenTrace's JWT validation: allow 30-second leeway for `exp` and `nbf` claims to account for clock differences between services.
172. `[CONCEPT]` `{L2}` What is JWT `aud` (audience) claim validation? How does OpenTrace validate that a token issued for the Query Service is not used on the Collector?
173. `[CODE]` `{L2}` Validate JWT audience in OpenTrace: each service accepts only tokens with `aud: "openTrace.{service}"`. Tokens without matching audience are rejected with 401.
174. `[CONCEPT]` `{L2}` What is a service token? How does OpenTrace's Processor use a service token (not user JWT) to authenticate internal gRPC calls to the Query Service?
175. `[CODE]` `{L2}` Implement service-to-service JWT auth for OpenTrace: Processor signs a short-lived JWT with `sub: "openTrace.processor"`, Query Service validates it has the `service` role.
176. `[CONCEPT]` `{L2}` What is OAuth2? What is the Authorization Code flow with PKCE? When does OpenTrace use it for third-party app authorization?
177. `[CODE]` `{L2}` Implement OAuth2 PKCE in TypeScript: generate `code_verifier`, SHA256 hash to `code_challenge`, redirect to auth server, exchange code + verifier for tokens.
178. `[CONCEPT]` `{L2}` What is OIDC (OpenID Connect)? What does it add to OAuth2? What is the `id_token`?
179. `[CODE]` `{L2}` Implement OIDC login for OpenTrace UI: redirect to Google OIDC, receive `id_token`, validate signature using Google's JWKS endpoint, extract user info, create session.
180. `[CONCEPT]` `{L2}` What is JWKS (JSON Web Key Set)? How does OpenTrace publish its public keys at `/.well-known/jwks.json` for other services to verify JWTs?
181. `[CODE]` `{L2}` Implement JWKS endpoint for OpenTrace's Auth Service: serve `{"keys": [{kid, kty, alg, n, e}]}` from the active RSA public key. Support key rotation.
182. `[CONCEPT]` `{L2}` What is JWT key rotation? How does OpenTrace rotate its RS256 signing key without invalidating existing valid tokens?
183. `[CODE]` `{L2}` Implement JWT key rotation for OpenTrace: sign new tokens with new key (kid=v2), keep old public key (kid=v1) in JWKS for 7 days to validate existing tokens.
184. `[CONCEPT]` `{L2}` What is session-based auth vs JWT auth? What are the stateful vs stateless tradeoffs for OpenTrace's multi-service architecture?
185. `[TRADEOFF]` `{L2}` Session tokens (stateful, Redis-backed) vs JWTs (stateless, cryptographic): when does OpenTrace use each? What is the revocation tradeoff?
186. `[CODE]` `{L2}` Implement session-based auth for OpenTrace's admin UI (internal, few users): `session_id` in Redis, `HGETALL session:{id}`, 30-minute idle timeout with `EXPIRE` renewal.
187. `[CONCEPT]` `{L2}` What is multi-factor authentication (MFA)? How does OpenTrace implement TOTP (Time-based One-Time Password) for admin accounts?
188. `[CODE]` `{L2}` Implement TOTP MFA for OpenTrace: generate secret (`base32` encoded), compute `TOTP = HMAC-SHA1(secret, floor(now/30))`, validate user input matches within 1 step (90s window).
189. `[CONCEPT]` `{L2}` What is SSO (Single Sign-On)? How would OpenTrace integrate with a corporate SAML IdP for enterprise customers?
190. `[CODE]` `{L2}` Sketch SAML SSO integration for OpenTrace: receive SAMLResponse from IdP, verify assertion signature, extract `NameID` and attributes, create local session, redirect to app.
191. `[CONCEPT]` `{L2}` What is API key authentication? How does OpenTrace store API keys (hashed with SHA256, not raw) and verify them without storing the plaintext?
192. `[CODE]` `{L2}` Implement API key creation for OpenTrace: generate 32 random bytes, encode as hex (64-char key), store `SHA256(key)` in DB, return raw key once to user. Verify: hash input and compare.
193. `[CONCEPT]` `{L2}` What is a machine token vs a user token? When does OpenTrace's SDK use a machine token (API key) vs when does a human use a JWT?
194. `[CODE]` `{L2}` Implement dual-token middleware for OpenTrace: if `Authorization: Bearer {jwt}` → validate JWT. If `X-API-Key: {key}` → hash and look up in DB. Inject unified `AuthContext` either way.
195. `[DEBUG]` `{L2}` OpenTrace users are getting logged out every 15 minutes even with "remember me" checked. The refresh token is issued correctly. What is happening with the token rotation?
196. `[CODE]` `{L2}` Fix race condition in OpenTrace token refresh: if two requests attempt refresh simultaneously, the second invalidates the first's new tokens. Use Redis SET NX to serialize refresh requests.
197. `[CONCEPT]` `{L2}` What is the `SameSite=Strict` cookie attribute? What CSRF attack does it prevent? What is the limitation for cross-origin API calls from the OpenTrace UI?
198. `[CODE]` `{L2}` Configure session cookie for OpenTrace: `SameSite=Strict` for maximum CSRF protection. For API calls from different subdomains, use `SameSite=Lax` and add CSRF token.
199. `[CONCEPT]` `{L3}` What is Passkeys (WebAuthn)? How would OpenTrace implement passwordless authentication using hardware security keys or biometrics?
200. `[APPLY]` `{L2}` Design the complete authentication flow for OpenTrace: new user signs up → email verification → API key creation → SDK initialization → first span sent → JWT issued for UI login.

---

## Authorization & RBAC (Q201–Q240)

201. `[CONCEPT]` `{L1}` What is the difference between authentication (who are you) and authorization (what can you do)?
202. `[CONCEPT]` `{L1}` What is RBAC (Role-Based Access Control)? What are OpenTrace's roles: admin, viewer, service? What can each do?
203. `[CODE]` `{L2}` Implement RBAC middleware in Go chi: extract `role` from JWT context, check against required role for the endpoint, return 403 with RFC 7807 on insufficient permissions.
204. `[CONCEPT]` `{L2}` What is ABAC (Attribute-Based Access Control)? When does OpenTrace need ABAC over RBAC? (Example: viewers can only see traces for their own services)
205. `[CODE]` `{L2}` Implement service-scoped access control for OpenTrace: `viewer` role can only query traces where `service_name IN jwt.allowed_services`. Inject filter into every ClickHouse query.
206. `[CONCEPT]` `{L2}` What is multi-tenant authorization? How does OpenTrace ensure tenant A cannot access tenant B's traces even with a valid JWT?
207. `[CODE]` `{L2}` Implement tenant isolation in OpenTrace: all DB queries automatically include `WHERE tenant_id = $ctx.tenant_id`. The tenant_id comes from the JWT, never from the request body.
208. `[CONCEPT]` `{L2}` What is Row-Level Security (RLS) in PostgreSQL? How does BookWise use it for tenant isolation at the database level?
209. `[CODE]` `{L2}` Implement PostgreSQL RLS for BookWise: `CREATE POLICY tenant_isolation ON bookings USING (tenant_id = current_setting('app.tenant_id')::uuid)`. Set tenant in connection: `SET app.tenant_id = $jwt.tenant_id`.
210. `[CONCEPT]` `{L2}` What is the principle of least privilege? How does OpenTrace's Service role (Collector, Processor) have minimal permissions vs the admin role?
211. `[CODE]` `{L2}` Define OpenTrace's role permissions matrix: admin (all), viewer (read traces/services/alerts, no delete), service (write spans only, no read). Implement as Go map lookup.
212. `[CONCEPT]` `{L2}` What is resource-based authorization? For OpenTrace, can a `viewer` in tenant A see a specific trace? The check is: `trace.tenant_id == jwt.tenant_id AND jwt.role >= viewer`.
213. `[CODE]` `{L2}` Implement resource authorization check for OpenTrace: `authorizeTraceAccess(ctx, traceId)` → fetch trace metadata from DB, verify `trace.tenant_id == ctx.tenant_id`, return 403 on mismatch.
214. `[CONCEPT]` `{L2}` What is authorization caching? How does OpenTrace cache permission checks for 60s to avoid repeated DB lookups for every request?
215. `[CODE]` `{L2}` Implement authorization decision caching in OpenTrace: `cache:authz:{userId}:{resource}:{action}` = allow/deny, TTL 60s. Invalidate on role change.
216. `[CONCEPT]` `{L2}` What is delegated authorization? How does DungBeetle allow a job creator to grant another user permission to cancel their job?
217. `[CODE]` `{L2}` Implement delegation in DungBeetle: `job_permissions(job_id, user_id, permission)` table. `authorizeJobAction(ctx, jobId, "cancel")` checks owner OR explicit permission grant.
218. `[CONCEPT]` `{L2}` What is audit logging for authorization decisions? How does OpenTrace log every denied access attempt with sufficient context for security investigations?
219. `[CODE]` `{L2}` Implement authorization audit log for OpenTrace: on every 403 response, log `{timestamp, user_id, tenant_id, resource, action, ip, trace_id}` to a separate Loki stream `openTrace-security`.
220. `[CONCEPT]` `{L2}` What is scope-based authorization (OAuth2 scopes)? How does OpenTrace define scopes: `traces:read`, `traces:write`, `alerts:read`, `admin`?
221. `[CODE]` `{L2}` Implement scope validation for OpenTrace: API key has associated scopes stored in DB. Middleware checks `requiredScope IN apiKey.scopes`. Return 403 with `insufficient_scope` error.
222. `[CONCEPT]` `{L2}` What is IP-based authorization? How does OpenTrace restrict admin API access to corporate IP ranges?
223. `[CODE]` `{L2}` Implement IP allowlist middleware for OpenTrace's admin endpoints: `allowedCIDRs = ["10.0.0.0/8", "172.16.0.0/12"]`. Check `r.RemoteAddr` or `X-Real-IP` against CIDR list, return 403 on mismatch.
224. `[DEBUG]` `{L2}` OpenTrace's admin endpoint is accessible from external IPs despite IP allowlist. How is this possible? (Hint: X-Forwarded-For spoofing when trusting user-supplied header)
225. `[CODE]` `{L2}` Fix IP spoofing in OpenTrace's admin auth: only use `X-Real-IP` if request comes through trusted nginx proxy (check `RemoteAddr` against proxy IP). Otherwise use `RemoteAddr` directly.
226. `[CONCEPT]` `{L2}` What is a permission boundary? How does OpenTrace prevent a `viewer` role from escalating to `admin` even if they can write their own JWT claims (they can't — RS256 prevents this)?
227. `[CODE]` `{L2}` Demonstrate why OpenTrace's RS256 JWT cannot be forged by a client: show that modifying the payload changes the signature, which verification rejects.
228. `[CONCEPT]` `{L2}` What is zero-trust architecture? How does OpenTrace implement it: every inter-service call requires a valid JWT (mTLS + JWT), no service is trusted by network location alone?
229. `[CODE]` `{L2}` Implement zero-trust for OpenTrace's Processor → Query Service call: Processor includes a service JWT in every gRPC call metadata. Query Service validates JWT before processing.
230. `[CONCEPT]` `{L2}` What is Zanzibar (Google's authorization system)? What is ReBAC (Relationship-Based Access Control)? When would OpenTrace use it for fine-grained trace sharing?
231. `[DESIGN]` `{L2}` Design fine-grained trace sharing for OpenTrace: user A can share trace T with user B. User B can view trace T but not other traces. Design the permissions data model.
232. `[CODE]` `{L2}` Implement trace sharing in OpenTrace: `trace_shares(trace_id, shared_with_user_id, permission, expires_at)` table. `authorizeTraceAccess` checks owner OR active share.
233. `[CONCEPT]` `{L2}` What is CSRF (Cross-Site Request Forgery)? How does OpenTrace prevent CSRF on its state-changing API endpoints?
234. `[CODE]` `{L2}` Implement CSRF protection for OpenTrace: double-submit cookie pattern — set `csrf_token` cookie, require matching `X-CSRF-Token` header on mutating requests. Verify they match.
235. `[CONCEPT]` `{L2}` What is a PKCE (Proof Key for Code Exchange)? Why does OpenTrace require it for its OAuth2 flows in SPAs and mobile apps?
236. `[CODE]` `{L2}` Implement PKCE validation in OpenTrace's Auth Service: store `code_challenge` with the auth code, verify `SHA256(code_verifier) == code_challenge` when exchanging for tokens.
237. `[CONCEPT]` `{L3}` What is a hardware security key (FIDO2/WebAuthn)? When would OpenTrace require it for admin access?
238. `[CONCEPT]` `{L2}` What is the `govulncheck` output for auth libraries? Which common Go auth vulnerabilities does OpenTrace's CI scan for?
239. `[APPLY]` `{L2}` Design the complete authorization architecture for OpenTrace: RBAC for role-based actions, tenant isolation via context injection, RLS in DB, JWT as the carrier. Draw the decision tree for `GET /traces/{id}`.
240. `[APPLY]` `{L2}` Walk through a security incident in OpenTrace: a viewer account is used to exfiltrate all traces. What audit logs reveal this? What rate limit or anomaly detection would have caught it earlier?

---

# PART D — Pagination, Search & API Design Patterns (Q241–Q360)

---

## Pagination (Q241–Q290)

241. `[CONCEPT]` `{L1}` What is pagination? Why is returning all records in one response dangerous for OpenTrace's trace list (millions of traces)?
242. `[CONCEPT]` `{L1}` What is offset-based pagination? What is the performance problem at large offsets? What is page drift?
243. `[CONCEPT]` `{L1}` What is cursor-based pagination? What is the cursor? How is it constructed for OpenTrace's trace list?
244. `[CONCEPT]` `{L2}` What is keyset pagination? How does it differ from cursor pagination? What index must exist for it to be O(log n)?
245. `[CONCEPT]` `{L2}` What is the "page drift" problem in offset pagination? Give an example with OpenTrace's trace list where a new trace inserted between page 1 and page 2 causes a trace to appear on both pages.
246. `[CODE]` `{L2}` Implement cursor-based pagination for OpenTrace's trace list: encode `{trace_id, start_time}` as base64 cursor, decode in next request, generate ClickHouse WHERE clause.
247. `[CODE]` `{L2}` Write the ClickHouse query for OpenTrace cursor pagination: `SELECT * FROM traces WHERE (start_time, trace_id) < ($cursor_time, $cursor_id) ORDER BY start_time DESC, trace_id DESC LIMIT 50`.
248. `[CONCEPT]` `{L2}` What index must exist for OpenTrace's cursor pagination query to be O(log n) instead of O(n)?
249. `[CODE]` `{L2}` Create the ClickHouse sort key for OpenTrace spans: `ORDER BY (trace_id, start_time)` enables cursor pagination by trace_id + start_time efficiently.
250. `[CONCEPT]` `{L2}` What is the difference between `total` count in pagination and has_next? Why does OpenTrace skip `total` for performance (COUNT(*) on 1B rows is slow)?
251. `[CODE]` `{L2}` Implement OpenTrace pagination without total count: query `LIMIT 51`, if 51 results returned then `has_next = true`, return 50. This avoids an expensive COUNT query.
252. `[CONCEPT]` `{L2}` What is cursor expiry? What happens when a user resumes pagination 7 days later and some rows have been deleted from OpenTrace's ClickHouse?
253. `[CODE]` `{L2}` Handle cursor expiry gracefully: if cursor decoding fails or the pointed row doesn't exist, return the first page with a `cursor_expired: true` flag in metadata.
254. `[CONCEPT]` `{L2}` What is bidirectional pagination? How does OpenTrace implement "previous page" with cursor-based pagination?
255. `[CODE]` `{L2}` Implement bidirectional cursor pagination for OpenTrace: encode `{prev_cursor, next_cursor}` in response. Previous page cursor reverses sort order in the query.
256. `[CONCEPT]` `{L2}` What is a multi-sort cursor? OpenTrace's trace list is sorted by `start_time DESC, trace_id DESC`. How does the cursor encode both fields to avoid duplicates at same timestamp?
257. `[CODE]` `{L2}` Implement multi-field cursor for OpenTrace: cursor = base64(`{start_time_unix_ns}:{trace_id}`). Query: `WHERE (start_time, trace_id) < ($t, $id)`.
258. `[CONCEPT]` `{L2}` What is search + pagination? How does OpenTrace paginate filtered results: `WHERE service_name = 'user-api' AND (start_time, trace_id) < cursor`?
259. `[CODE]` `{L2}` Implement paginated search for OpenTrace: combine filter conditions with cursor conditions correctly. Ensure cursor is tied to the filter context (different cursors for different filters).
260. `[CONCEPT]` `{L2}` What is page size optimization? Should OpenTrace return 10, 50, or 100 traces per page? What is the tradeoff between UI responsiveness and network overhead?
261. `[CODE]` `{L2}` Implement configurable page size for OpenTrace: `limit = min(requested_limit, 100)`. Return 400 if limit > 100. Default to 20 if not specified.
262. `[CONCEPT]` `{L2}` What is the "infinite scroll" vs "numbered pages" UX? How does the pagination strategy differ in the API design for each?
263. `[CODE]` `{L2}` Design OpenTrace's pagination API for infinite scroll: `GET /traces?after={cursor}` always returns the next page. No page numbers, no total count.
264. `[CONCEPT]` `{L2}` What is Relay-style cursor pagination (used by GitHub API)? What is a `PageInfo` object? What are `startCursor`, `endCursor`, `hasPreviousPage`, `hasNextPage`?
265. `[CODE]` `{L2}` Implement Relay-style pagination for OpenTrace: return `{"edges":[{"node":trace,"cursor":"..."}], "pageInfo":{"startCursor","endCursor","hasPreviousPage","hasNextPage"}}`.
266. `[TRADEOFF]` `{L2}` Offset vs cursor pagination for OpenTrace's admin export: admin needs to export ALL 1B traces. Can they use cursor pagination? What is the advantage?
267. `[CODE]` `{L2}` Implement cursor-based export for OpenTrace: export continues from where it left off if interrupted. Store cursor in S3 manifest, resume from last cursor on retry.
268. `[CONCEPT]` `{L2}` What is pagination for time-series data? How does OpenTrace paginate spans within a trace (which are ordered by `start_time ASC`)?
269. `[CODE]` `{L2}` Implement span-within-trace pagination for OpenTrace: cursor = `span_id`, query `WHERE trace_id = $1 AND span_id > $cursor ORDER BY start_time ASC LIMIT 1000`.
270. `[CONCEPT]` `{L2}` What is token-based pagination vs link-based pagination? What is the `Link: <url>; rel="next"` header (RFC 5988)? When does OpenTrace use it for download URLs?
271. `[CODE]` `{L2}` Add `Link` headers to OpenTrace's paginated API: `Link: </v1/traces?after=b64cursor>; rel="next", </v1/traces?before=b64cursor>; rel="prev"`.
272. `[CONCEPT]` `{L2}` What is a "stable cursor"? If an OpenTrace trace's start_time is updated, should the cursor encoding include start_time? What is the risk?
273. `[CODE]` `{L2}` Use trace_id-only cursor for OpenTrace when start_time is mutable: cursor = base64(trace_id), query `WHERE trace_id < $cursor ORDER BY trace_id DESC LIMIT 50`.
274. `[CONCEPT]` `{L2}` What is the Kafka consumer offset as pagination? How does DungBeetle's job processor use the Kafka offset as a "cursor" to resume after crash?
275. `[CODE]` `{L2}` Implement DungBeetle job resume: store last processed Kafka offset in PostgreSQL `consumer_offsets(partition, offset)`. On restart, seek to stored offset instead of latest.
276. `[DESIGN]` `{L2}` Design the pagination strategy for OpenTrace's search results (Elasticsearch-backed): use Elasticsearch's `search_after` parameter which is analogous to cursor pagination.
277. `[CODE]` `{L2}` Implement OpenTrace Elasticsearch cursor pagination using `search_after`: last hit's sort values become the cursor for the next page. Return 50 hits per page.
278. `[CONCEPT]` `{L2}` What is deep pagination? Why is `OFFSET 1000000 LIMIT 50` catastrophically slow even with an index? What is the O(OFFSET) scan problem?
279. `[CODE]` `{L2}` Demonstrate the OFFSET performance problem: add timing to OpenTrace queries at offset 0, 10K, 100K, 1M. Show exponential degradation. Switch to cursor, show constant time.
280. `[APPLY]` `{L2}` Design the complete pagination system for OpenTrace's trace list: cursor encoding, expiry handling, search integration, bidirectional navigation, Relay-style API contract, infinite scroll UI.

---

## Search (Q281–Q320)

281. `[CONCEPT]` `{L1}` What is full-text search? How does it differ from SQL `LIKE '%query%'`? What does an inverted index do?
282. `[CONCEPT]` `{L1}` What is an inverted index? How does it map terms to document IDs? How is it built for OpenTrace's span `operation_name` field?
283. `[CONCEPT]` `{L2}` What is TF-IDF? What is BM25? Why is BM25 preferred in modern search engines (Elasticsearch)?
284. `[CONCEPT]` `{L2}` What is tokenization? What is stemming? What is a stop word? Give examples for OpenTrace's span operation names.
285. `[CONCEPT]` `{L2}` What is an analyzer chain in Elasticsearch? What are character filters, tokenizer, and token filters? How does OpenTrace configure a custom analyzer for service names?
286. `[CODE]` `{L2}` Configure an Elasticsearch index for OpenTrace spans: mapping for `trace_id` (keyword), `service_name` (keyword), `operation_name` (text, english analyzer), `duration_ms` (long), `start_time` (date).
287. `[CODE]` `{L2}` Write an Elasticsearch query for OpenTrace: full-text match on `operation_name`, filter on `service_name`, date range on `start_time`, sort by `_score` + `start_time DESC`.
288. `[CONCEPT]` `{L2}` What is `filter` context vs `query` context in Elasticsearch? Why do filter queries not affect scoring and are cached?
289. `[CODE]` `{L2}` Optimize OpenTrace's Elasticsearch query: move `service_name` and `start_time` filters from `query` to `filter` context (boolean filter). This enables caching and improves performance.
290. `[CONCEPT]` `{L2}` What are Elasticsearch aggregations? What is a terms aggregation vs a date histogram aggregation? How does OpenTrace use them for the service overview?
291. `[CODE]` `{L2}` Write an Elasticsearch aggregation for OpenTrace's service overview: terms aggregation on `service_name`, sub-aggregation on `avg_duration`, cardinality on `trace_id`.
292. `[CONCEPT]` `{L2}` What is faceted search? How does OpenTrace implement faceted filtering: filter by service, status, duration range, time range simultaneously?
293. `[CODE]` `{L2}` Implement Elasticsearch faceted search for OpenTrace: `terms` aggregation for available `service_names` (with counts), `range` aggregation for duration buckets, `date_histogram` for time distribution.
294. `[CONCEPT]` `{L2}` What is `match` vs `match_phrase` vs `term` vs `terms` query in Elasticsearch? When does OpenTrace use each?
295. `[CODE]` `{L2}` Write an OpenTrace multi-field search: user query "user-api timeout" → `multi_match` across `operation_name`, `error_message`, `service_name` with `type: best_fields`.
296. `[CONCEPT]` `{L2}` What is typo tolerance (fuzzy matching) in Elasticsearch? When does OpenTrace enable it? What is `fuzziness: AUTO`?
297. `[CODE]` `{L2}` Enable fuzzy matching for OpenTrace's trace search: `{"match": {"operation_name": {"query": "timout", "fuzziness": "AUTO"}}}`. This matches "timeout" with edit distance 1.
298. `[CONCEPT]` `{L2}` What is highlighting in Elasticsearch? How does OpenTrace show which part of the span matched the user's search query?
299. `[CODE]` `{L2}` Add search highlighting to OpenTrace: `"highlight": {"fields": {"operation_name": {}, "error_message": {"pre_tags": ["<em>"], "post_tags": ["</em>"]}}}`.
300. `[CONCEPT]` `{L2}` What is the Elasticsearch write path? What is the difference between a document being indexed vs being searchable (1s refresh interval)?
301. `[CODE]` `{L2}` Configure Elasticsearch for OpenTrace's ingestion workload: `refresh_interval: 5s` (tradeoff: less fresh but higher indexing throughput). For real-time search: `?refresh=true` on critical index calls.
302. `[CONCEPT]` `{L2}` What is PostgreSQL full-text search? What is `tsvector`? What is `tsquery`? When does OpenTrace use PostgreSQL FTS vs Elasticsearch?
303. `[CODE]` `{L2}` Implement PostgreSQL full-text search for OpenTrace's small user dataset: `CREATE INDEX ON spans USING GIN(to_tsvector('english', operation_name))`, query with `to_tsquery('english', 'timeout')`.
304. `[TRADEOFF]` `{L2}` PostgreSQL FTS vs Elasticsearch vs Typesense for OpenTrace's search: compare indexing speed, query latency, memory requirements, operational complexity.
305. `[CONCEPT]` `{L2}` What is a search suggest/autocomplete? How does OpenTrace implement `GET /v1/services?q=use` to return matching service names starting with "use"?
306. `[CODE]` `{L2}` Implement autocomplete for OpenTrace's service name search: Redis sorted set `ZADD services 0 "user-api"`, `ZRANGEBYLEX services "[use" "[use\xFF" LIMIT 0 10`.
307. `[CONCEPT]` `{L2}` What is a search-as-you-type field in Elasticsearch? How does the `search_as_you_type` mapping enable prefix + infix matching for OpenTrace's autocomplete?
308. `[CODE]` `{L2}` Add `search_as_you_type` mapping for OpenTrace's service name field: supports "user" matching "user-api" AND "api-user" (infix). Query with `multi_match` on `.2gram`, `.3gram` sub-fields.
309. `[CONCEPT]` `{L2}` What is Elasticsearch index aliasing? How does OpenTrace use aliases for zero-downtime index schema changes?
310. `[CODE]` `{L2}` Implement zero-downtime Elasticsearch reindex for OpenTrace: create new index `spans-v2`, reindex from `spans-v1`, atomically swap alias `spans` from v1 to v2.
311. `[CONCEPT]` `{L2}` What is Elasticsearch data tiering (hot-warm-cold architecture)? How does OpenTrace use it to keep recent traces on fast SSDs (hot) and old traces on slower disks (warm)?
312. `[CODE]` `{L2}` Configure Elasticsearch ILM (Index Lifecycle Management) for OpenTrace: hot phase (7 days, rollover when > 50GB), warm phase (30 days), cold phase (90 days), delete phase.
313. `[CONCEPT]` `{L2}` What is Elasticsearch scroll API vs `search_after` for deep pagination? Why is `search_after` preferred for OpenTrace's large exports?
314. `[CODE]` `{L2}` Implement Elasticsearch `search_after` pagination for OpenTrace bulk export: use `[sort_values]` from last hit as the `search_after` parameter in the next request.
315. `[CONCEPT]` `{L3}` What is kNN (k-Nearest Neighbor) vector search in Elasticsearch? How does it enable semantic search for OpenTrace's span error messages using embeddings?
316. `[CODE]` `{L3}` Add vector search to OpenTrace: embed `error_message` text using an embedding model, store as `dense_vector`, query with `knn: {field: "error_vector", query_vector: [...], k: 10}`.
317. `[CONCEPT]` `{L2}` What is Elasticsearch index mapping explosion? What is `dynamic: strict`? When does OpenTrace enable it to prevent unbounded schema growth from user-defined span attributes?
318. `[CODE]` `{L2}` Configure `dynamic: strict` for OpenTrace's Elasticsearch index: reject documents with unknown fields, add new fields explicitly via index mapping updates.
319. `[DEBUG]` `{L2}` OpenTrace's Elasticsearch search relevance degrades after a data migration. The same query returns different results. What do you investigate first? (Hint: IDF changes when document count changes, re-normalize with `dfs_query_then_fetch`)
320. `[APPLY]` `{L2}` Design OpenTrace's complete search feature: Elasticsearch index design, analyzer chain, query types, aggregations, autocomplete, pagination, highlighting, and ranking. What is the query latency target?

---

## API Design Patterns (Q321–Q360)

321. `[CONCEPT]` `{L1}` What is idempotency? Which HTTP methods are idempotent? Why is it critical for OpenTrace's span submission to be idempotent on retry?
322. `[CONCEPT]` `{L2}` What is an idempotency key? How does PayCore use `X-Idempotency-Key` to prevent duplicate payment charges on retry?
323. `[CODE]` `{L2}` Implement idempotency for PayCore: `INSERT INTO payments (idempotency_key, amount, status) VALUES ($key, $amount, 'pending') ON CONFLICT (idempotency_key) DO NOTHING RETURNING *`. Return cached result on conflict.
324. `[CONCEPT]` `{L2}` What is the "optimistic concurrency" API pattern? How does OpenTrace use `If-Match: {etag}` to prevent lost updates when two clients edit the same alert configuration?
325. `[CODE]` `{L2}` Implement optimistic concurrency for OpenTrace alert config: `PUT /v1/alerts/{id}` requires `If-Match: {current_etag}` header, return 412 Precondition Failed if ETag doesn't match current version.
326. `[CONCEPT]` `{L2}` What is a "bulk API" pattern? Why does OpenTrace's span ingestion use bulk submissions (100-10K spans per request) instead of one-span-per-request?
327. `[CODE]` `{L2}` Design OpenTrace's bulk span API: `POST /v1/traces` accepts `{"resource_spans": [...]}` (OTLP format), returns `{"accepted": 9998, "failed": 2, "errors": [...]}`.
328. `[CONCEPT]` `{L2}` What is partial success response in bulk APIs? How does OpenTrace report that 9998/10000 spans were accepted and 2 failed validation?
329. `[CODE]` `{L2}` Implement partial success for OpenTrace: process all spans regardless of individual failures, accumulate errors, return 207 Multi-Status with per-span results if any failed.
330. `[CONCEPT]` `{L2}` What is API rate limit feedback? How does OpenTrace's 429 response help SDKs implement adaptive backoff?
331. `[CODE]` `{L2}` Design OpenTrace's 429 response with actionable retry info: `{"error": "rate_limited", "retry_after_ms": 500, "limit": 1000, "reset_at": "2024-01-01T12:00:00Z"}`.
332. `[CONCEPT]` `{L2}` What is an API deprecation strategy? How does OpenTrace communicate a breaking change with sufficient notice: `Deprecation`, `Sunset`, `Link` headers + email notification?
333. `[CODE]` `{L2}` Implement OpenTrace API deprecation: add `Deprecation: true; Sunset: "2025-03-01"` headers to v1 endpoints. Log deprecation warning for each call from a v1 client.
334. `[CONCEPT]` `{L2}` What is API observability? What request attributes should OpenTrace log for every API call to enable debugging?
335. `[CODE]` `{L2}` Implement API access logging for OpenTrace: log `{timestamp, method, path, status, latency_ms, trace_id, tenant_id, user_id, ip, user_agent, request_size, response_size}` as JSON.
336. `[CONCEPT]` `{L2}` What is API versioning sunset? How does OpenTrace enforce that v1 clients must migrate to v2 before the sunset date?
337. `[CODE]` `{L2}` Implement v1 sunset enforcement for OpenTrace: after the sunset date, return `410 Gone` with `{"error":"v1 deprecated","migrate_to":"/v2/","docs":"https://..."}`.
338. `[CONCEPT]` `{L2}` What is long-polling vs webhook for async results? How does DungBeetle notify clients when a long-running job completes?
339. `[CODE]` `{L2}` Implement job completion webhook for DungBeetle: on job completion, POST `{"job_id": "...", "status": "completed", "result": {...}}` to the configured webhook URL with HMAC signature.
340. `[CONCEPT]` `{L2}` What is the "request-response vs event" duality? When does OpenTrace return a synchronous response vs when does it use events (webhook/SSE)?
341. `[CONCEPT]` `{L2}` What is API discoverability? What is HATEOAS? How does OpenTrace include links to related resources in responses?
342. `[CODE]` `{L2}` Add HATEOAS links to OpenTrace's trace response: `{"trace_id":"...","_links":{"self":"/v1/traces/abc","spans":"/v1/traces/abc/spans","service":"/v1/services/user-api"}}`.
343. `[CONCEPT]` `{L2}` What is the "strangler fig" API migration pattern? How does OpenTrace migrate from v1 to v2 by keeping both running simultaneously for a transition period?
344. `[CODE]` `{L2}` Implement API migration shim for OpenTrace: v2 handler internally calls v1 logic for unchanged endpoints, only implements new behavior for changed endpoints. Gradually migrate v1 callers.
345. `[CONCEPT]` `{L2}` What is API schema validation? How does OpenTrace validate incoming JSON requests against a JSON Schema before processing?
346. `[CODE]` `{L2}` Implement JSON Schema validation for OpenTrace's span ingestion: validate `ExportTraceServiceRequest` against the OTLP JSON schema, return 400 with field-level errors on schema violations.
347. `[CONCEPT]` `{L2}` What is a "envelope" response format? How does OpenTrace wrap all API responses in `{"data": ..., "meta": ..., "errors": [...]}` for consistent client handling?
348. `[CODE]` `{L2}` Implement OpenTrace's response envelope in Go: `type APIResponse[T any] struct { Data T; Meta *PaginationMeta; Errors []APIError }`. Write the JSON marshaling.
349. `[CONCEPT]` `{L2}` What is content negotiation for API versioning? When does OpenTrace use `Accept: application/vnd.openTrace.v2+json` vs URL versioning?
350. `[CONCEPT]` `{L2}` What is the `OPTIONS` method in REST? What does `Allow` header contain? How does it help API clients discover supported methods?
351. `[CODE]` `{L2}` Add `OPTIONS` handler to OpenTrace's chi router: return `Allow: GET, POST, OPTIONS` for each route, enable CORS preflight handling.
352. `[CONCEPT]` `{L2}` What is `HEAD` method in REST? How does OpenTrace support `HEAD /v1/traces/{id}` to check if a trace exists without downloading the full payload?
353. `[CODE]` `{L2}` Implement `HEAD` method for OpenTrace trace lookup: check existence in ClickHouse, return 200/404 with Content-Length header but empty body.
354. `[CONCEPT]` `{L2}` What is the difference between `PUT` (replace) and `PATCH` (partial update)? When does OpenTrace use each for alert configuration?
355. `[CODE]` `{L2}` Implement `PATCH /v1/alerts/{id}` for OpenTrace: accept partial JSON, merge with existing alert config, validate merged result, update in PostgreSQL. Return full updated alert.
356. `[CONCEPT]` `{L2}` What is JSON Merge Patch (RFC 7396) vs JSON Patch (RFC 6902)? When does OpenTrace use each for alert configuration updates?
357. `[CODE]` `{L2}` Implement JSON Merge Patch for OpenTrace: `{"threshold": 500}` merges into existing alert config without changing other fields. `null` values delete fields.
358. `[CONCEPT]` `{L2}` What is an API Gateway pattern? What does Kong add over a simple nginx reverse proxy: JWT validation, rate limiting, request transformation, plugin ecosystem?
359. `[DESIGN]` `{L2}` Design the complete API lifecycle for OpenTrace: design → OpenAPI spec → code generation (sqlc, protoc) → implementation → versioning → deprecation → sunset. What tools at each stage?
360. `[APPLY]` `{L2}` Walk through the complete API design process for OpenTrace's new "alert" feature: user story → OpenAPI spec → endpoint design → request/response schema → idempotency strategy → rate limiting → versioning.

---

# PART E — High-Level Design Synthesis (Q361–Q500)

361. `[DESIGN]` `{L1}` Design a URL shortener (like bit.ly): URL storage, redirect logic, click analytics, high availability. What components? What DB? What is the redirect latency target?
362. `[DESIGN]` `{L1}` Design a rate limiter service: multi-tenant, multi-algorithm, Redis-backed, expose as REST API. What is the API contract? How do you handle Redis downtime?
363. `[DESIGN]` `{L1}` Design a key-value store API: `GET /keys/{key}`, `PUT /keys/{key}`, `DELETE /keys/{key}`, `GET /keys?prefix={prefix}`. What is the backend? How do you handle TTL?
364. `[DESIGN]` `{L2}` Design a distributed task queue (DungBeetle): job submission, priority scheduling, worker assignment, retry with backoff, DLQ, monitoring. Compare PostgreSQL vs Kafka vs Redis backends.
365. `[DESIGN]` `{L2}` Design a real-time seat booking system (BookWise): seat availability, concurrent booking prevention, waitlist, payment integration. What are the concurrency control mechanisms?
366. `[DESIGN]` `{L2}` Design a distributed tracing system (OpenTrace): OTLP ingestion, Kafka pipeline, ClickHouse storage, query API, live tail. What are the throughput constraints at each layer?
367. `[DESIGN]` `{L2}` Design a payments system (PayCore): account balances, transactions, idempotency, distributed ledger, fraud detection. What isolation level? What Saga pattern?
368. `[DESIGN]` `{L2}` Design a notification service: email/SMS/push delivery, retry with backoff, webhooks, per-channel rate limiting, delivery tracking. What database for state? What queue?
369. `[DESIGN]` `{L2}` Design a file storage service: upload to S3, metadata in PostgreSQL, CDN for downloads, virus scanning, per-user storage quotas. What is the upload flow?
370. `[DESIGN]` `{L2}` Design a real-time chat system: message delivery, ordering, read receipts, online presence, message history, search. What is the fan-out strategy at 1M concurrent users?
371. `[DESIGN]` `{L2}` Design a ride-sharing service (RouteMaster): driver GPS updates, nearest driver query, route optimization, dynamic pricing, trip lifecycle. What DB for location? What is the geospatial index?
372. `[DESIGN]` `{L2}` Design a news feed: personalized feed generation, fan-out on write vs read, infinite scroll, real-time updates. How does Twitter's approach differ from Facebook's at scale?
373. `[DESIGN]` `{L2}` Design an e-commerce search: product catalog, inverted index, faceted filters, spelling correction, ranking by relevance + sales + margin. What is the tech stack?
374. `[DESIGN]` `{L2}` Design a distributed cache layer: write-through, multi-region, cache invalidation via events, hot key handling, TTL jitter, cache warming. What is the consistency model?
375. `[DESIGN]` `{L2}` Design a job scheduler (cron-as-a-service): job definition, timezone handling, distributed execution, idempotent execution, missed job recovery, monitoring.
376. `[DESIGN]` `{L2}` Design a multi-tenant SaaS platform: per-tenant data isolation (schema vs row-level security), per-tenant rate limiting, per-tenant pricing, onboarding automation.
377. `[DESIGN]` `{L2}` Design an authentication service: JWT issuance, OAuth2, refresh tokens, API keys, SSO, MFA, audit logs. What is the key rotation strategy? What is the session store?
378. `[DESIGN]` `{L2}` Design a webhook delivery system: reliable delivery, at-least-once guarantee, retry with backoff, signature verification, DLQ, delivery analytics.
379. `[DESIGN]` `{L2}` Design a video transcoding pipeline: upload detection, job queue, parallel transcoding, progress tracking, CDN distribution. What queue? What storage? What format?
380. `[DESIGN]` `{L2}` Design a feature flag system: flag creation, percentage rollout, user targeting, A/B testing, kill switch, audit log. What is the latency requirement for flag evaluation?
381. `[DESIGN]` `{L2}` Design an analytics ingestion pipeline: 10M events/sec, 90-day retention, real-time aggregations, ad-hoc query support. Compare ClickHouse vs Druid vs BigQuery.
382. `[DESIGN]` `{L2}` Design a content moderation system: image/text moderation, ML model integration, human review queue, appeal process, audit trail.
383. `[DESIGN]` `{L2}` Design a data pipeline (ETL): extract from PostgreSQL, transform in Spark/Flink, load to data warehouse, incremental updates, failure recovery.
384. `[DESIGN]` `{L2}` Design a recommendation engine: collaborative filtering, real-time feature updates, model serving at low latency, A/B testing for model versions.
385. `[DESIGN]` `{L2}` Design a distributed configuration management system: key-value store, watch for changes, versioning, rollback, access control, multi-region sync.
386. `[DESIGN]` `{L2}` Design a health monitoring system: metric collection (Prometheus), log aggregation (Loki), distributed tracing (OpenTrace), alerting (Alertmanager), dashboards (Grafana).
387. `[DESIGN]` `{L2}` Design a globally distributed API with < 50ms latency for users worldwide: CDN, edge compute, regional databases, eventual consistency vs strong consistency tradeoffs.
388. `[DESIGN]` `{L2}` Design a time-series database for IoT: 10B measurements/day, last 30 days queryable, efficient compression, time-bucket aggregations. ClickHouse vs TimescaleDB vs InfluxDB.
389. `[DESIGN]` `{L2}` Design an email delivery service: SMTP relay, bounce handling, unsubscribe management, sending reputation, per-user engagement tracking, ISP rate limiting.
390. `[DESIGN]` `{L2}` Design a search autocomplete service: < 20ms latency, prefix matching, fuzzy matching, personalization by user history, A/B testing for ranking. Redis vs Elasticsearch vs Trie?
391. `[DESIGN]` `{L2}` Design a digital wallet: balance management, transfer between wallets, currency conversion, fraud detection, regulatory compliance (KYC/AML), audit trail.
392. `[DESIGN]` `{L2}` Design an event ticketing system: ticket inventory, concurrent purchase prevention, waitlist, resale prevention, QR code generation, mobile redemption.
393. `[DESIGN]` `{L2}` Design a real-time leaderboard: 10M players, score updates, top-k queries, rank queries, fair scoring, cheat detection. Redis Sorted Set vs PostgreSQL vs custom?
394. `[DESIGN]` `{L2}` Design a document collaboration system (Google Docs): real-time editing, conflict resolution (OT or CRDT), version history, offline support, access control.
395. `[DESIGN]` `{L2}` Design an API rate limiting service that is also a billing system: track API calls per tier, emit billing events, handle quota overage, enterprise pricing.
396. `[DESIGN]` `{L2}` Design a log aggregation system: structured log ingestion, full-text search, alerting on patterns, log retention policies, tenant isolation, compliance.
397. `[DESIGN]` `{L2}` Design a secrets management system (Vault-like): secret storage (encrypted at rest), access control, secret rotation, audit logging, dynamic secrets (DB credentials on-demand).
398. `[DESIGN]` `{L2}` Design a CDN: edge server cache, origin shield, cache invalidation, request routing, DDoS protection, performance monitoring. How does it interact with OpenTrace's static assets?
399. `[DESIGN]` `{L2}` Design a multi-cloud deployment strategy for OpenTrace: primary on AWS, failover to GCP, data replication, DNS-based routing, cost optimization.
400. `[APPLY]` `{L2}` System design interview framework: Clarify requirements → Estimate scale → High-level design → Deep dive → Tradeoffs → Monitoring. Apply this framework to OpenTrace in 45 minutes.
401. `[APPLY]` `{L2}` Scale estimation for OpenTrace: 10M spans/sec, 2KB/span = 20GB/sec inbound. Kafka 3 brokers × 2TB each = 6TB. ClickHouse: 1TB/day × 90 days = 90TB. What hardware?
402. `[APPLY]` `{L2}` Back-of-envelope for BookWise: 10K venues, 100 seats each = 1M seats total. 1K bookings/min peak = ~17/sec. PostgreSQL can handle this. No Kafka needed. Justify.
403. `[APPLY]` `{L2}` Back-of-envelope for PayCore: 100 payments/sec peak, each payment = 2 DB writes (debit + credit). 200 writes/sec is trivial for PostgreSQL with synchronous_commit=on.
404. `[APPLY]` `{L2}` Back-of-envelope for DungBeetle: 100K jobs/day = 1.15/sec average. PostgreSQL SELECT FOR UPDATE SKIP LOCKED handles 10K/sec easily. No distributed queue needed at this scale.
405. `[APPLY]` `{L2}` For OpenTrace: why did you choose Kafka over gRPC streaming from Collector to Processor? Discuss durability, replay, fan-out to multiple Processor instances, and backpressure.
406. `[APPLY]` `{L2}` For OpenTrace: why ClickHouse over TimescaleDB for span storage? Discuss columnar compression (8x), aggregation performance (10-100x faster for analytics), and the limitation for OLTP workloads.
407. `[APPLY]` `{L2}` For OpenTrace: why tail-based sampling over head-based? Discuss: head-based is simpler but wastes storage on uninteresting traces; tail-based sees complete trace context but requires buffering all spans.
408. `[APPLY]` `{L2}` For BookWise: why PostgreSQL advisory locks over Redis distributed locks for seat booking? Discuss: advisory locks are transactional (automatically released on commit/rollback), Redis requires explicit release + TTL handling.
409. `[APPLY]` `{L2}` For PayCore: why Saga pattern instead of 2PC for distributed payment? Discuss: 2PC requires coordinator, has blocking behavior, single point of failure; Saga uses compensating transactions, is async, scales better.
410. `[APPLY]` `{L2}` For DungBeetle: why PostgreSQL over Redis for the job queue? Discuss: PostgreSQL provides durability (WAL), transactional job creation (atomically create job + deduct credits), rich query capabilities for job analytics.
411. `[APPLY]` `{L2}` What is the "correct" answer for "design Twitter's timeline"? Compare push (fan-out on write) vs pull (fan-out on read) vs hybrid approach. What does Twitter actually use?
412. `[APPLY]` `{L2}` What is the "correct" answer for "design a distributed key-value store"? Compare: consistent hashing for routing, Raft for consensus, vector clocks for conflict detection, read repair for consistency.
413. `[APPLY]` `{L2}` What is the "correct" answer for "design YouTube"? Cover: video upload (chunked), transcoding pipeline, CDN distribution, recommendation engine, view counter (HyperLogLog), comment system.
414. `[APPLY]` `{L2}` What is the "correct" answer for "design a parking lot system"? Cover: sensor input, spot availability, payment, reservations, multi-floor support, pricing tiers. What database? What real-time update mechanism?
415. `[APPLY]` `{L2}` What is the "correct" answer for "design a distributed message queue"? Cover: partitioning, replication, producer acks, consumer groups, offset management, retention. Compare to Kafka's design choices.
416. `[APPLY]` `{L2}` What is the "correct" answer for "design Google Maps"? Cover: map tile storage (S3 + CDN), routing (Dijkstra/A*), real-time traffic (GPS telemetry), POI search, map rendering.
417. `[APPLY]` `{L2}` What is the "correct" answer for "design a stock exchange matching engine"? Cover: order book, price-time priority, order types, low-latency requirements, fault tolerance, market data distribution.
418. `[APPLY]` `{L2}` What is the "correct" answer for "design Instagram"? Cover: photo storage (S3), CDN, feed generation, like counter (Redis incr), follow graph (Neo4j or PostgreSQL), notifications.
419. `[APPLY]` `{L2}` What is the "correct" answer for "design Uber's surge pricing system"? Cover: supply/demand sensors, pricing algorithm, geographic zones, driver earnings, real-time price update, customer communication.
420. `[APPLY]` `{L2}` What is the "correct" answer for "design a real-time collaborative document editor"? Cover: CRDT vs OT, WebSocket for sync, persistent storage, version history, conflict resolution, offline support.
421. `[TRADEOFF]` `{L2}` Monolith vs microservices: when does each make sense for the 5 Infraspec projects? At what scale does a monolith become a microservices? What are the operational costs of each?
422. `[TRADEOFF]` `{L2}` Event-driven vs request-response: for OpenTrace's span ingestion, why is event-driven (Kafka) better? For BookWise's booking confirmation, why is request-response better?
423. `[TRADEOFF]` `{L2}` Strong consistency vs eventual consistency: for PayCore balances (strong), for OpenTrace span counts (eventual), for BookWise seat availability (strong). Justify each choice.
424. `[TRADEOFF]` `{L2}` SQL vs NoSQL: for PayCore (PostgreSQL — ACID transactions), for OpenTrace spans (ClickHouse — columnar analytics), for DungBeetle jobs (PostgreSQL — complex queries + FOR UPDATE). What criteria drive each choice?
425. `[TRADEOFF]` `{L2}` Push vs pull for notifications: for BookWise booking confirmations (push via email), for OpenTrace alerts (pull via webhook), for DungBeetle job status (push via SSE). What criteria determine push vs pull?
426. `[TRADEOFF]` `{L2}` Horizontal scaling vs vertical scaling: for OpenTrace Collector (horizontal — stateless, easy to scale), for OpenTrace ClickHouse (vertical first, then sharding — complex to horizontally scale). When does each apply?
427. `[TRADEOFF]` `{L2}` Cache-aside vs write-through for OpenTrace's trace cache: cache-aside is simpler but has "thundering herd" on first access; write-through ensures cache is always populated but adds write latency.
428. `[TRADEOFF]` `{L2}` Synchronous vs asynchronous processing for OpenTrace: span ingestion (async — decouple write speed from processing speed), booking confirmation (synchronous — user needs immediate feedback).
429. `[TRADEOFF]` `{L2}` Saga choreography vs orchestration for BookWise booking: choreography (each service reacts to events, decoupled) vs orchestration (central coordinator, explicit state machine). Which has simpler error handling?
430. `[TRADEOFF]` `{L2}` Optimistic vs pessimistic locking for BookWise: optimistic (version column, no lock held, conflict on save — good for low contention) vs pessimistic (SELECT FOR UPDATE — good for high contention like seat booking).
431. `[APPLY]` `{L2}` Given: "Design a system that can handle 1M requests/second." What are the first 5 questions you ask to clarify requirements before designing anything?
432. `[APPLY]` `{L2}` Given: "OpenTrace is slow at peak." What are the first 5 metrics you check? What is your investigation methodology?
433. `[APPLY]` `{L2}` Given: "BookWise has occasional duplicate bookings." Walk through the race condition scenarios and which fix (optimistic lock, pessimistic lock, idempotency key, advisory lock) applies to each.
434. `[APPLY]` `{L2}` Given: "DungBeetle jobs are processed twice sometimes." Walk through the at-least-once delivery guarantee and what idempotency pattern fixes double-processing.
435. `[APPLY]` `{L2}` Given: "PayCore payments are sometimes charged twice on retry." Walk through the idempotency key implementation and where exactly in the call chain the deduplication check happens.
436. `[APPLY]` `{L2}` Given: "OpenTrace spans are lost when the Collector crashes." Walk through the outbox pattern and how the WAL guarantees durability between the DB write and Kafka publish.
437. `[APPLY]` `{L2}` Given: "BookWise waitlist users aren't being notified when a seat becomes available." Walk through the event-driven notification design: cancellation → seat released → Redis keyspace expiry → Kafka event → notification service.
438. `[APPLY]` `{L2}` Given: "RouteMaster shows incorrect driver locations to riders." Walk through the caching issue: driver location cached at CDN edge, update propagation delay, when to bypass cache for location data.
439. `[APPLY]` `{L2}` Given: "OpenTrace's search returns stale results after deleting spans." Walk through the cache invalidation pipeline: ClickHouse delete → Kafka invalidation event → Search cache invalidation → Elasticsearch index update.
440. `[APPLY]` `{L2}` Given: "DungBeetle workers are starving — low-priority jobs get picked before high-priority." Walk through the PostgreSQL job queue design: `ORDER BY priority DESC, created_at ASC`, correct index, SKIP LOCKED behavior.
441. `[APPLY]` `{L2}` Design the data model for OpenTrace's billing system: track span volume per tenant per hour, aggregate daily/monthly, apply pricing tiers, generate invoices.
442. `[APPLY]` `{L2}` Design the data model for BookWise's seat map: hierarchical venue → section → row → seat. How do you efficiently query available seats in a section without loading all seats?
443. `[APPLY]` `{L2}` Design the data model for DungBeetle's job priority queue: jobs have priority (1-10), fairness group (tenant), retry count, deadline. How do you sort fairly?
444. `[APPLY]` `{L2}` Design the data model for PayCore's transaction ledger: immutable audit trail, balance derived from events (event sourcing), fraud detection queries.
445. `[APPLY]` `{L2}` Design OpenTrace's alerting system: user defines `alert_rule(service_name, metric, threshold, operator)`, evaluated every 60s by a cron job, fires when condition met.
446. `[APPLY]` `{L2}` Design OpenTrace's tenant onboarding: new tenant signs up → create DB tenant record → create Kafka tenant topic partition → create Redis namespace → issue first API key → send welcome email.
447. `[APPLY]` `{L2}` Design OpenTrace's audit log: every API mutation (create/update/delete trace, modify alert, manage API keys) is logged immutably. What schema? What storage? How long retained?
448. `[APPLY]` `{L2}` Design BookWise's dynamic pricing: price increases as seat availability decreases. How do you calculate real-time price without locking? What caching strategy?
449. `[APPLY]` `{L2}` Design DungBeetle's dead letter queue and retry system: after 3 failures, jobs go to DLQ. DLQ jobs can be retried manually or in bulk after fixing the bug.
450. `[APPLY]` `{L2}` Design PayCore's fraud detection: real-time scoring of payment risk (velocity check, unusual amount, new device, new location). What latency budget? What ML model serving?
451. `[APPLY]` `{L2}` OpenTrace Infraspec interview: "Walk me through how you designed the rate limiting in OpenTrace." Cover: token bucket per API key in Redis Lua, sliding window per tenant, adaptive limiting when ClickHouse is slow.
452. `[APPLY]` `{L2}` OpenTrace Infraspec interview: "How does OpenTrace handle concurrent span ingestion from 10K SDK instances?" Cover: stateless Collectors, Kafka for backpressure, ClickHouse batch insert.
453. `[APPLY]` `{L2}` OpenTrace Infraspec interview: "What happens in OpenTrace when Kafka is down for 5 minutes?" Cover: Collector circuit breaker opens, 503 returned, SDK buffers locally, reconnects, backpressure, potential span loss.
454. `[APPLY]` `{L2}` OpenTrace Infraspec interview: "How does OpenTrace ensure trace data is not lost during a Collector crash?" Cover: at-least-once delivery via Kafka acks=all, idempotency at ClickHouse INSERT via span_id.
455. `[APPLY]` `{L2}` OpenTrace Infraspec interview: "How would you add multi-region support to OpenTrace?" Cover: Kafka MirrorMaker for cross-region replication, ClickHouse distributed tables, DNS latency-based routing.
456. `[APPLY]` `{L2}` OpenTrace Infraspec interview: "Design the OpenTrace alerting feature." Cover: Prometheus rules, Alertmanager routing, PagerDuty/Slack integration, silence/inhibition, runbook links.
457. `[APPLY]` `{L2}` OpenTrace Infraspec interview: "How do you ensure only authorized tenants can query their own traces?" Cover: JWT tenant_id claim, query-level filtering, ClickHouse partition by tenant_id.
458. `[APPLY]` `{L2}` OpenTrace Infraspec interview: "How does OpenTrace's live tail work end-to-end?" Cover: WebSocket connection, Redis pub/sub fan-out, Processor publishes to channel, latency target < 1s.
459. `[APPLY]` `{L2}` OpenTrace Infraspec interview: "What is the SLO for OpenTrace and how do you monitor it?" Cover: 99.9% availability, p99 < 200ms, error budget, burn rate alerts, pprof profiling.
460. `[APPLY]` `{L2}` OpenTrace Infraspec interview: "How would you migrate OpenTrace from single-tenant to multi-tenant?" Cover: add tenant_id to all DB schemas, JWT claims, connection pooling per tenant, partition strategies.
461. `[APPLY]` `{L2}` Design the OpenTrace "service map" feature: show a graph of all services and their dependencies discovered from trace data. What ClickHouse query generates service → service edges?
462. `[APPLY]` `{L2}` Design OpenTrace's "error tracking" feature: detect new error patterns, group similar errors, trend analysis, assigned owner, resolution tracking. What is the error fingerprinting algorithm?
463. `[APPLY]` `{L2}` Design OpenTrace's "anomaly detection" feature: detect when a service's latency is 3 standard deviations above its 7-day baseline. What is the statistical approach? What is the alert precision vs recall tradeoff?
464. `[APPLY]` `{L2}` Design OpenTrace's "trace compare" feature: compare two traces side-by-side (same service, different time period) to diagnose regressions. What is the UI data model?
465. `[APPLY]` `{L2}` Design OpenTrace's "span dependency graph": for a given trace, compute the critical path (longest path through the trace). What graph algorithm? What ClickHouse query?
466. `[APPLY]` `{L2}` Design OpenTrace's SDK: Go SDK that automatically instruments HTTP client/server, gRPC client/server, PostgreSQL, Redis, Kafka with zero code changes (using middleware hooks).
467. `[APPLY]` `{L2}` Design OpenTrace's SDK configuration: `OTEL_EXPORTER_OTLP_ENDPOINT`, `OTEL_SERVICE_NAME`, sampling rate, batch size. What are the defaults? What is the risk of wrong defaults?
468. `[APPLY]` `{L2}` Design OpenTrace's SDK retry behavior: exponential backoff, max 3 retries, do not retry on 4xx (permanent failure), retry on 5xx and network errors (transient failure).
469. `[APPLY]` `{L2}` Design OpenTrace's SDK local buffering: buffer spans in memory when the Collector is unavailable, max 1M spans / 100MB, drop oldest on overflow. How does the SDK surface dropped span metrics?
470. `[APPLY]` `{L2}` Design the OpenTrace Collector's batching strategy: batch up to 10K spans or 500ms, whichever comes first. What is the memory footprint? What is the latency impact of batching?
471. `[APPLY]` `{L2}` Design OpenTrace's Processor scaling strategy: auto-scale based on Kafka consumer lag. What is the scale-up threshold (lag > 100K)? What is the scale-down delay (5 minutes of low lag)?
472. `[APPLY]` `{L2}` Design OpenTrace's ClickHouse retention policy: 30-day hot tier (NVMe SSD), 90-day warm tier (SAS HDD), 365-day cold tier (S3). What TTL expressions? How does data move between tiers?
473. `[APPLY]` `{L2}` Design OpenTrace's ClickHouse table partitioning: PARTITION BY toYYYYMM(start_time). What is the partition pruning query? How do you drop old partitions for TTL?
474. `[APPLY]` `{L2}` Design OpenTrace's backup strategy: daily ClickHouse backup to S3 (ClickHouse S3 backup command), PostgreSQL continuous WAL archiving, Redis RDB snapshot to S3. What is the RPO?
475. `[APPLY]` `{L2}` Design OpenTrace's disaster recovery drill: monthly drill where the team restores from backup to a staging environment, runs smoke tests, measures RTO. What RTO is acceptable?
476. `[APPLY]` `{L2}` Design OpenTrace's capacity planning process: monthly review of storage growth, ingestion rate, query latency trends. What metrics trigger capacity expansion? What is the lead time for ClickHouse storage expansion?
477. `[APPLY]` `{L2}` Design OpenTrace's cost optimization: data compression (ClickHouse LZ4), S3 intelligent tiering, Kafka retention reduction, right-sizing compute instances. What is the cost per GB/month for each tier?
478. `[APPLY]` `{L2}` Design OpenTrace's on-call rotation: P1 (Collector down) → page immediately, P2 (consumer lag growing) → page after 5 minutes, P3 (query p95 degraded) → ticket only. What defines P1 vs P2 vs P3?
479. `[APPLY]` `{L2}` Design OpenTrace's change management process: all production changes require a PR, code review, CI passing, and approval. Emergency changes: 2-person approval + immediate post-incident review.
480. `[APPLY]` `{L2}` Design the OpenTrace developer experience: local dev setup with Docker Compose (Kafka, ClickHouse, PostgreSQL, Redis), hot reload, pre-populated sample traces, test API key.
481. `[APPLY]` `{L2}` Design OpenTrace's documentation: auto-generated API docs from OpenAPI spec, architecture decision records (ADRs), runbooks, a "getting started in 5 minutes" guide for SDK integration.
482. `[APPLY]` `{L2}` Design the OpenTrace contributing guide: how to run tests locally, how to submit a PR, code style (go fmt + golangci-lint), commit message format (conventional commits), DCO sign-off.
483. `[APPLY]` `{L2}` Design the OpenTrace release process: semantic versioning, changelog from conventional commits, Docker image tagging (sha + semver), Kubernetes manifest version pinning, upgrade guide.
484. `[APPLY]` `{L2}` Design the OpenTrace security review process: `govulncheck` in CI, `trivy` container scanning, annual penetration test, responsible disclosure policy, CVE response SLA.
485. `[APPLY]` `{L2}` Design the OpenTrace compliance posture: GDPR (right to erasure — delete spans containing PII), SOC 2 Type II (access logs, encryption at rest, vulnerability management), what's the minimal viable compliance posture?
486. `[APPLY]` `{L2}` Design OpenTrace's encryption at rest: ClickHouse data encrypted using AES-256 (disk-level encryption via LUKS or S3 SSE), PostgreSQL TDE, Redis in-memory (no encryption needed), S3 SSE-S3.
487. `[APPLY]` `{L2}` Design OpenTrace's encryption in transit: all inter-service gRPC uses mTLS, all external HTTP uses TLS 1.3 minimum, Kafka uses TLS, PostgreSQL uses SSL, Redis uses TLS (stunnel or native).
488. `[APPLY]` `{L2}` Design OpenTrace's access control for infrastructure: least-privilege IAM roles for each service, no shared credentials, secrets rotation every 90 days, all access via Vault dynamic secrets.
489. `[APPLY]` `{L2}` Design the OpenTrace incident communication plan: internal Slack alerts (P1 within 2 min), status page update (within 5 min), customer email (within 30 min), post-incident report (within 3 days).
490. `[APPLY]` `{L2}` Design the OpenTrace chaos engineering plan: randomly kill one Collector pod (should failover in < 30s), simulate Kafka broker failure (consumer lag should recover in < 5 min), inject 500ms ClickHouse latency (should trigger adaptive rate limiting).
491. `[APPLY]` `{L2}` Design OpenTrace's load testing strategy: weekly automated k6 test in staging, monthly chaos experiment in staging, quarterly game day in staging with production traffic load.
492. `[APPLY]` `{L2}` Design the OpenTrace benchmark suite: what Go benchmark tests exist, what performance regression threshold triggers a build failure (+5% degradation), how are benchmarks run in CI.
493. `[APPLY]` `{L2}` Design OpenTrace's feature request process: GitHub issue → RFC (1-pager) → discussion (1 week) → ADR → implementation → documentation. How does OpenTrace prioritize between stability and new features?
494. `[APPLY]` `{L2}` Design the OpenTrace roadmap for Q1: (1) multi-region support, (2) Kafka authentication, (3) UI trace compare, (4) cost optimization (S3 cold tier). How do you sequence these?
495. `[APPLY]` `{L2}` Design OpenTrace's partnership with the OpenTelemetry community: contributions to OTel Go SDK (fixing bugs found while building OpenTrace), proposed improvements to OTLP protocol based on OpenTrace's experience.
496. `[APPLY]` `{L2}` Design OpenTrace's enterprise tier: dedicated ClickHouse cluster (no shared infra), custom retention (365 days), SAML SSO, audit logs export, SLA 99.99%, dedicated support.
497. `[APPLY]` `{L2}` Design OpenTrace's developer tier: free plan (1M spans/day, 7-day retention, shared infrastructure, email support), paid plan (10M spans/day, 30-day retention, dedicated resources, SLA).
498. `[APPLY]` `{L2}` Design the OpenTrace investor pitch: what problem does it solve (observability is expensive), what is the market size, what is the differentiation (10x cheaper than Datadog), what is the business model (SaaS + open source)?
499. `[APPLY]` `{L3}` Design OpenTrace v3: add profiles (continuous profiling), metrics (OpenMetrics), and logs (structured log ingestion). What new components are needed? What Kafka topics? What storage changes?
500. `[APPLY]` `{L1}` Final synthesis: You are presenting OpenTrace to Infraspec's technical hiring panel. In exactly 10 minutes, walk through: (1) what problem it solves, (2) the architecture of all 7 components, (3) the three hardest engineering decisions, (4) the performance numbers, and (5) what you would do differently. Practice this answer.
