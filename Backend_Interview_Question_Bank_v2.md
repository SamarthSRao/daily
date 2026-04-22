# Backend Engineering — Interview Question Bank v2
### 600 Questions Across 6 Core Topics
> Aligned with Backend 2026 Roadmap | Infraspec-Ready | Every question tagged with a real company incident

---

## How to Use This Bank
- **Green** → Answer cold, no hesitation
- **Yellow** → Know the concept but stumble on details
- **Red** → Build the thing, then come back

Each question has two tags:
- **Type tag**: `[CONCEPT]` `[DESIGN]` `[DEBUG]` `[TRADEOFF]`
- **Incident tag**: `{Company — Incident}` — a real production failure where this exact concept caused or solved the problem

---

## Incident Tag Legend

| Tag | What Happened |
|---|---|
| `{Facebook BGP 2021}` | Facebook's entire network vanished for 6 hours — BGP routes withdrawn, DNS unreachable |
| `{Cloudflare DNS 2020}` | A bad BGP route caused Cloudflare to drop 15% of global traffic |
| `{AWS us-east-1 2021}` | Kinesis failure cascaded to IAM, Cognito, Lambda — internal dependency on the broken service |
| `{AWS us-east-1 2012}` | EBS outage caused by a single config change, amplified by retry storms |
| `{GitHub 2012}` | MySQL failover caused split-brain, dirty reads served inconsistent data |
| `{Slack 2022}` | Cascading failures during startup after maintenance window — thundering herd |
| `{Cloudflare 2019}` | A WAF regex caused 100% CPU on every edge node globally |
| `{Stripe rate limit}` | Poorly designed rate limiter caused boundary spike, hammered downstream services |
| `{Twitter 2012}` | MySQL sharding migration caused data loss for some users |
| `{Discord 2020}` | Read replica lag served stale messages, users saw disappearing messages |
| `{Notion 2021}` | PostgreSQL table bloat caused query planner to choose wrong index, entire product slow |
| `{PagerDuty 2021}` | Goroutine leak accumulated over 3 days and caused OOM on all pods simultaneously |
| `{Shopify 2021}` | Flash sale caused stampede on Redis, cache miss rate hit 100% |
| `{Airbnb 2019}` | N+1 queries on search degraded to 40s response times under load |
| `{Dropbox 2014}` | Magic Pocket object storage migration — studied for distributed transaction patterns |
| `{LinkedIn 2011}` | Kafka invented here after MQ bottlenecks; partitioning strategy lessons |
| `{Uber 2016}` | Postgres replication lag triggered application-level data inconsistency |
| `{Netflix Chaos}` | Chaos Monkey origin — discovered missing circuit breakers bring down entire platform |
| `{Robinhood 2021}` | Margin call system caused cascading DB locks, trading halted |
| `{Zoom 2020}` | Routing all traffic through China due to misconfigured region selection |
| `{Google 2014}` | SSL certificate expiry caused gmail outage — TLS misconfiguration |
| `{Stack Overflow 2013}` | Single SQL query with missing index caused full table scan, 10M row table |
| `{Twitch 2015}` | WebSocket fan-out at scale caused memory exhaustion |
| `{Reddit 2012}` | Cassandra's eventual consistency surfaced as inconsistent vote counts |
| `{Etsy 2012}` | PHP deployment without feature flags caused instant rollout of broken code |
| `{PayPal 2015}` | Idempotency key missing, duplicate payments processed during network retry |
| `{Monzo 2019}` | Cassandra JVM GC pause caused 2-minute outage in a banking app |
| `{Heroku 2017}` | mmap and page cache interaction caused intermittent DB corruption under high write load |
| `{Pinterest 2012}` | MySQL single-master became write bottleneck at scale — sharding lessons |
| `{Cloudflare QUIC}` | HTTP/3 vs HTTP/2 head-of-line blocking fix — studied for protocol tradeoffs |

---

# SECTION 1 — Web Request Lifecycle (Browser → Service → DB → Back)
> "Walk me through what happens when a user hits your API"

---

### DNS & Network Layer (Q1–Q20)

1. `[CONCEPT]` `{Facebook BGP 2021}` What happens between the moment a user types a URL and the moment your server receives a TCP packet? Name every step.
2. `[CONCEPT]` `{Facebook BGP 2021}` What is a DNS resolver, and what is the difference between recursive and authoritative resolution?
3. `[CONCEPT]` `{Cloudflare DNS 2020}` What are A, CNAME, MX, TXT, and NS records? When would you use a CNAME vs an A record?
4. `[CONCEPT]` `{Facebook BGP 2021}` What is DNS TTL? What happens during a deployment if your TTL is set to 86400?
5. `[CONCEPT]` `{Zoom 2020}` What is split-horizon DNS? Give a real use case.
6. `[CONCEPT]` `{AWS us-east-1 2012}` Explain the TCP three-way handshake. What state is the server in between SYN and SYN-ACK?
7. `[DEBUG]` `{AWS us-east-1 2012}` What is TIME_WAIT in TCP? Why does it exist and how can it cause problems under high traffic?
8. `[CONCEPT]` `{Cloudflare QUIC}` What is Nagle's algorithm? When would you disable it with `TCP_NODELAY`?
9. `[CONCEPT]` `{Cloudflare QUIC}` What is TCP window scaling? How does it affect throughput over high-latency links?
10. `[CONCEPT]` `{AWS us-east-1 2021}` What is the difference between L4 and L7 load balancing? Give concrete examples of when you'd use each.
11. `[CONCEPT]` `{Cloudflare 2019}` What is `SO_REUSEPORT`? Why do high-performance web servers use it?
12. `[CONCEPT]` `{Google 2014}` What is TLS? Describe the TLS 1.3 handshake steps.
13. `[CONCEPT]` `{Google 2014}` What is SNI (Server Name Indication) and why is it needed?
14. `[CONCEPT]` `{Google 2014}` What is HSTS and how does it protect against downgrade attacks?
15. `[CONCEPT]` `{Cloudflare DNS 2020}` What is a CDN and how does it reduce latency for your API?
16. `[DEBUG]` `{Facebook BGP 2021}` A user reports intermittent "connection refused" errors. What are the five most likely causes?
17. `[DEBUG]` `{AWS us-east-1 2012}` Your service has thousands of sockets in TIME_WAIT. What caused this, and what are your options?
18. `[TRADEOFF]` `{Cloudflare QUIC}` UDP vs TCP — give three specific cases where you'd choose UDP for a backend system.
19. `[TRADEOFF]` `{Cloudflare QUIC}` HTTP/1.1 vs HTTP/2 vs HTTP/3 — what problem does each version solve that the previous didn't?
20. `[DESIGN]` `{Twitch 2015}` You need to handle 100k concurrent WebSocket connections on a single server. What are the OS-level constraints and how do you work around them?

---

### HTTP Layer (Q21–Q40)

21. `[CONCEPT]` `{Cloudflare QUIC}` What is HTTP keep-alive? How does it differ from HTTP/2 multiplexing?
22. `[CONCEPT]` `{Cloudflare QUIC}` What is the difference between HTTP/2 multiplexing and HTTP/1.1 pipelining? Why did pipelining fail in practice?
23. `[CONCEPT]` `{Cloudflare 2019}` Explain every field in an HTTP request: method, path, version, headers, body. Which are mandatory?
24. `[CONCEPT]` `{Cloudflare 2019}` What is content negotiation in HTTP? Explain `Accept`, `Content-Type`, `Accept-Encoding`.
25. `[CONCEPT]` `{AWS us-east-1 2021}` What is CORS? Why does the browser enforce it but not the server? Explain preflight requests.
26. `[CONCEPT]` `{Cloudflare DNS 2020}` What is the difference between `301`, `302`, `307`, and `308` redirects?
27. `[CONCEPT]` `{Stripe rate limit}` What HTTP status codes should a well-designed REST API use for: success, validation error, auth failure, not found, server error, rate limit exceeded?
28. `[CONCEPT]` `{PayPal 2015}` What is idempotency? Which HTTP methods are idempotent and why? Is `DELETE` idempotent?
29. `[CONCEPT]` `{Twitch 2015}` What is chunked transfer encoding and when is it used?
30. `[CONCEPT]` `{Shopify 2021}` What is HTTP caching? Explain `Cache-Control`, `ETag`, `Last-Modified`, and `If-None-Match`.
31. `[CONCEPT]` `{Shopify 2021}` What is the `Vary` header and when would you use it?
32. `[CONCEPT]` `{Cloudflare 2019}` What is gzip/Brotli compression in HTTP? At what point in the request lifecycle does it happen?
33. `[CONCEPT]` `{Cloudflare DNS 2020}` What is a reverse proxy? How is it different from a forward proxy?
34. `[CONCEPT]` `{Zoom 2020}` What does `X-Forwarded-For` contain and why can you not blindly trust it?
35. `[DESIGN]` `{AWS us-east-1 2021}` Design a health check endpoint for a production service. What should it check? What should it not check?
36. `[DESIGN]` `{Stripe rate limit}` Your REST API needs to support versioning. Describe three approaches and their tradeoffs.
37. `[DEBUG]` `{Cloudflare 2019}` An HTTP request is returning 200 but with an empty body. Where do you look first?
38. `[DEBUG]` `{PayPal 2015}` Users report that a POST request is being executed twice. Walk through every layer where deduplication could fail.
39. `[TRADEOFF]` `{Dropbox 2014}` REST vs gRPC — when would you choose gRPC for an internal service over REST?
40. `[TRADEOFF]` `{Dropbox 2014}` JSON vs Protobuf vs MessagePack — compare serialization size, speed, and schema evolution.

---

### Request Handling in Your Service (Q41–Q60)

41. `[CONCEPT]` `{Cloudflare 2019}` What happens inside your Go/Node.js process from the moment a socket receives bytes to the moment your handler function is called?
42. `[CONCEPT]` `{Twitch 2015}` What is an event loop? How does Node.js handle 10k concurrent connections with a single thread?
43. `[CONCEPT]` `{PagerDuty 2021}` What is the difference between concurrency and parallelism? Give a Go example of each.
44. `[CONCEPT]` `{PagerDuty 2021}` What is `GOMAXPROCS`? What is the right value and why?
45. `[CONCEPT]` `{PagerDuty 2021}` What is a goroutine leak? How do you detect it? What does `goleak` do?
46. `[CONCEPT]` `{PagerDuty 2021}` What is context propagation in Go? How does `context.WithCancel` prevent resource leaks?
47. `[CONCEPT]` `{Cloudflare 2019}` What is middleware in an HTTP framework? Give three examples of cross-cutting concerns handled by middleware.
48. `[CONCEPT]` `{AWS us-east-1 2021}` What is graceful shutdown? What happens to in-flight requests if you don't implement it?
49. `[CONCEPT]` `{AWS us-east-1 2012}` What is backpressure? How does a slow DB cause cascading failures upstream?
50. `[CONCEPT]` `{Netflix Chaos}` What is a circuit breaker pattern? What states does it have and when does it transition?
51. `[DESIGN]` `{AWS us-east-1 2021}` Design a request ID / trace ID system that flows through every service and appears in every log line.
52. `[DESIGN]` `{Netflix Chaos}` Your handler calls three downstream services. How do you handle partial failure — two succeed, one fails?
53. `[DESIGN]` `{AWS us-east-1 2021}` How do you implement timeouts correctly in a chain of service calls? What's wrong with a single global timeout?
54. `[DESIGN]` `{AWS us-east-1 2012}` Describe how you'd implement retry with exponential backoff and jitter. Why is jitter important?
55. `[DEBUG]` `{Notion 2021}` p99 latency suddenly spikes from 20ms to 2000ms. Walk through your investigation step by step.
56. `[DEBUG]` `{PagerDuty 2021}` Memory of your service grows by 50MB per hour and never drops. How do you find the leak?
57. `[DEBUG]` `{Cloudflare 2019}` One pod in your Kubernetes deployment has 10x more CPU than the others. Why might this happen?
58. `[TRADEOFF]` `{LinkedIn 2011}` Synchronous HTTP calls vs async messaging for inter-service communication — when to use each?
59. `[TRADEOFF]` `{Airbnb 2019}` Connection pooling vs connection per request — why does every production service use pooling?
60. `[CONCEPT]` `{Cloudflare QUIC}` What is head-of-line blocking? Where does it appear in HTTP/1.1, databases, and message queues?

---

### DB Round-Trip & Response (Q61–Q80)

61. `[CONCEPT]` `{Airbnb 2019}` What is a connection pool? Why is opening a new DB connection for every request catastrophic?
62. `[CONCEPT]` `{Uber 2016}` What is PgBouncer? What is the difference between session mode, transaction mode, and statement mode?
63. `[CONCEPT]` `{Stack Overflow 2013}` What is a prepared statement? How does it prevent SQL injection and improve performance?
64. `[CONCEPT]` `{Airbnb 2019}` What is the N+1 query problem? Give a concrete ORM example and how to fix it.
65. `[CONCEPT]` `{Stack Overflow 2013}` What is query parameterization? Why is `fmt.Sprintf` in SQL a security and correctness bug?
66. `[CONCEPT]` `{Notion 2021}` What is `EXPLAIN ANALYZE` in PostgreSQL? What is the difference between estimated and actual rows?
67. `[CONCEPT]` `{Notion 2021}` What is a sequential scan vs an index scan? When is a sequential scan actually faster?
68. `[CONCEPT]` `{Cloudflare 2019}` What is serialization of a response? What is the performance cost of JSON marshaling for 10k objects?
69. `[DESIGN]` `{Airbnb 2019}` You need to return a large result set (1M rows) from an API. How do you design this without crashing either the DB or the client?
70. `[DEBUG]` `{Stack Overflow 2013}` A query that returns 100 rows takes 7 seconds. Walk through how you diagnose and fix it.
71. `[DEBUG]` `{Airbnb 2019}` Your DB connection pool is exhausted. What are the three most likely root causes?
72. `[DESIGN]` `{Stripe rate limit}` How do you return structured errors from your API — errors that a client can act on programmatically?
73. `[CONCEPT]` `{Cloudflare 2019}` What is response compression? At what response size does it start to help vs hurt?
74. `[DESIGN]` `{Stripe rate limit}` How do you ensure your API returns consistent error shapes across all endpoints?
75. `[TRADEOFF]` `{Airbnb 2019}` Returning all data in one request vs pagination — what are the tradeoffs for mobile clients vs dashboards?
76. `[CONCEPT]` `{Twitch 2015}` What is an HTTP trailer? When would you use it?
77. `[CONCEPT]` `{Twitch 2015}` What is server-sent events (SSE)? How does it differ from WebSockets for push notifications?
78. `[DESIGN]` `{AWS us-east-1 2021}` A user's dashboard loads 8 different API endpoints in parallel. How do you design this for lowest perceived latency?
79. `[TRADEOFF]` `{Dropbox 2014}` GraphQL vs REST for a mobile client with variable bandwidth — what are the real tradeoffs?
80. `[DEBUG]` `{Discord 2020}` Your API is correct but a client reports they're seeing stale data. Walk through every caching layer that could be responsible.

---

### End-to-End Design (Q81–Q100)

81. `[DESIGN]` `{Robinhood 2021}` Design the complete request lifecycle for a money transfer API: browser → load balancer → service → DB → response. Include every layer and failure mode.
82. `[DESIGN]` `{PayPal 2015}` How do you implement idempotency keys for a payment API? Where is the key stored and checked?
83. `[DESIGN]` `{Cloudflare DNS 2020}` Design a URL shortener. Walk through every component from DNS to the redirect response.
84. `[DESIGN]` `{AWS us-east-1 2021}` How does a session cookie flow from login through to authenticated requests? Where can it be stolen?
85. `[DESIGN]` `{Dropbox 2014}` Design a file upload API that accepts 100MB files without blocking your web server threads.
86. `[DESIGN]` `{PayPal 2015}` How do you implement request deduplication at the API gateway level?
87. `[DESIGN]` `{AWS us-east-1 2021}` Design the observability for a single API request — what metrics, traces, and logs should exist?
88. `[DESIGN]` `{AWS us-east-1 2021}` How does a distributed trace work? What is a trace ID, span ID, and parent span ID?
89. `[DESIGN]` `{Notion 2021}` You need your API to respond in under 100ms at p99. What are the layers you optimize, in order?
90. `[DESIGN]` `{Stack Overflow 2013}` How do you handle a database that is the bottleneck for your API's latency?
91. `[TRADEOFF]` `{Etsy 2012}` Monolith vs microservices — a startup with 3 engineers. What do you recommend and why?
92. `[TRADEOFF]` `{LinkedIn 2011}` Synchronous request-response vs event-driven for an order processing system. Compare failure modes.
93. `[DEBUG]` `{Stack Overflow 2013}` A user's request is slow only when they have a large account (many rows). What is happening at the DB layer?
94. `[DEBUG]` `{AWS us-east-1 2021}` Your service is healthy but clients see 502s. Where is the fault most likely to be?
95. `[DEBUG]` `{Etsy 2012}` A deployment causes a 30-second latency spike, then it recovers. What are the likely causes?
96. `[CONCEPT]` `{Slack 2022}` What is a thundering herd? Give two scenarios where it occurs in backend systems.
97. `[CONCEPT]` `{AWS us-east-1 2012}` What is slow start in TCP? How does it affect the first request from a new connection?
98. `[DESIGN]` `{Etsy 2012}` How do you zero-downtime deploy a service that holds WebSocket connections?
99. `[DESIGN]` `{PayPal 2015}` Design a webhook delivery system. How do you guarantee at-least-once delivery?
100. `[CONCEPT]` `{AWS us-east-1 2021}` What is the difference between a proxy, sidecar, and service mesh? When does a service mesh add value?

---

# SECTION 2 — System Design (Rate Limiting, Caching, Pagination, Search, Auth)

---

### Rate Limiting (Q101–Q120)

101. `[CONCEPT]` `{Stripe rate limit}` What is rate limiting? What are the three things it protects against?
102. `[CONCEPT]` `{Stripe rate limit}` Explain the Token Bucket algorithm. What is the burst capacity and how does it differ from a strict rate?
103. `[CONCEPT]` `{Stripe rate limit}` Explain the Leaky Bucket algorithm. How does it differ from Token Bucket in behavior?
104. `[CONCEPT]` `{Stripe rate limit}` Explain Fixed Window rate limiting. What is the boundary spike problem?
105. `[CONCEPT]` `{Stripe rate limit}` Explain Sliding Window rate limiting. How does it solve the boundary spike?
106. `[CONCEPT]` `{Stripe rate limit}` Explain the Sliding Window Counter algorithm — how does it approximate sliding window using fixed window counts?
107. `[CONCEPT]` `{Cloudflare 2019}` What is the difference between rate limiting per user, per IP, per API key, and per endpoint?
108. `[DESIGN]` `{Shopify 2021}` Design a distributed rate limiter using Redis. What Redis data structure do you use and why?
109. `[DESIGN]` `{Shopify 2021}` Implement sliding window rate limiting in Redis using a sorted set. Walk through the exact Redis commands.
110. `[DESIGN]` `{Shopify 2021}` How do you implement atomic rate limit check-and-increment in Redis without a race condition?
111. `[DESIGN]` `{Shopify 2021}` Your rate limiter sits behind a load balancer with 10 instances. Each instance has a local counter. What is wrong?
112. `[DESIGN]` `{Cloudflare 2019}` How do you rate limit at the API gateway level vs at the service level? What are the tradeoffs?
113. `[DESIGN]` `{Stripe rate limit}` How do you communicate a rate limit rejection to the client? What headers should you include?
114. `[DESIGN]` `{Stripe rate limit}` Design a tiered rate limit system: free users get 100 req/min, pro users get 10k req/min.
115. `[DESIGN]` `{PayPal 2015}` How do you handle rate limiting for webhook senders?
116. `[DEBUG]` `{Shopify 2021}` Your rate limiter is rejecting valid users during a traffic spike. How do you redesign to allow bursting?
117. `[TRADEOFF]` `{Shopify 2021}` Rate limiting in Redis vs in-memory local counter — what are the consistency tradeoffs?
118. `[TRADEOFF]` `{Stripe rate limit}` Hard rate limiting (reject) vs soft rate limiting (queue/delay) — when would you choose each?
119. `[CONCEPT]` `{Netflix Chaos}` What is a circuit breaker vs a rate limiter? Are they complementary or redundant?
120. `[DESIGN]` `{Stripe rate limit}` Design rate limiting for a public API that is monetized — how do you track usage for billing?

---

### Caching (Q121–Q150)

121. `[CONCEPT]` `{Shopify 2021}` What is a cache? Name five different caching layers in a typical backend system.
122. `[CONCEPT]` `{Shopify 2021}` What is cache-aside (lazy loading)? Draw the read and write paths.
123. `[CONCEPT]` `{Discord 2020}` What is write-through caching? What is write-behind (write-back)? Compare their consistency and performance.
124. `[CONCEPT]` `{Shopify 2021}` What is read-through caching? How does it differ from cache-aside?
125. `[CONCEPT]` `{Shopify 2021}` What is a cache hit? Cache miss? Cache eviction? Cache invalidation?
126. `[CONCEPT]` `{Shopify 2021}` What is LRU eviction? How is it implemented efficiently?
127. `[CONCEPT]` `{Shopify 2021}` What is LFU eviction? When is it better than LRU?
128. `[CONCEPT]` `{Discord 2020}` What is a TTL in a cache? What are the risks of setting it too high vs too low?
129. `[CONCEPT]` `{Shopify 2021}` What is cache stampede (dog-pile effect)? How do you prevent it?
130. `[CONCEPT]` `{Slack 2022}` What is a thundering herd in the context of caching? How does probabilistic early expiry prevent it?
131. `[TRADEOFF]` `{Discord 2020}` What is the difference between Redis and Memcached? When would you choose one over the other?
132. `[CONCEPT]` `{Discord 2020}` What Redis data structures exist and what are their use cases?
133. `[CONCEPT]` `{Monzo 2019}` What is Redis persistence? Explain RDB snapshots vs AOF. What are the tradeoffs?
134. `[CONCEPT]` `{Monzo 2019}` What is Redis replication vs Redis Cluster vs Redis Sentinel? When do you need each?
135. `[CONCEPT]` `{Shopify 2021}` What is a Bloom filter? What can it tell you with certainty vs probabilistically?
136. `[DESIGN]` `{Discord 2020}` Design a caching layer for a user profile that is read 10k times per second but updated rarely.
137. `[DESIGN]` `{Reddit 2012}` Design a cache for a leaderboard that shows the top 100 scores.
138. `[DESIGN]` `{AWS us-east-1 2021}` Design a distributed session store using Redis. How do you handle session expiry?
139. `[DESIGN]` `{Shopify 2021}` Your product page has 20 data elements, each with a different TTL. How do you design the caching strategy?
140. `[DESIGN]` `{Discord 2020}` Design a cache invalidation strategy for a social media feed where a deleted post must disappear within 5 seconds.
141. `[DESIGN]` `{Airbnb 2019}` How do you cache database query results when the query has many possible parameter combinations?
142. `[DEBUG]` `{Shopify 2021}` Cache hit rate drops from 95% to 40% overnight. Walk through your investigation.
143. `[DEBUG]` `{Discord 2020}` Users are seeing stale data even after you purged the cache. Name five places data could still be cached.
144. `[DEBUG]` `{Monzo 2019}` Redis memory usage grows linearly and never drops. What are the two most likely causes?
145. `[TRADEOFF]` `{Shopify 2021}` Application-level cache vs database query cache vs HTTP cache — when does each layer make sense?
146. `[TRADEOFF]` `{Discord 2020}` Cache-aside vs write-through for a high-write, high-read system. Which do you choose?
147. `[TRADEOFF]` `{Shopify 2021}` Local in-memory cache (per pod) vs shared Redis cache — consistency and performance tradeoffs.
148. `[CONCEPT]` `{Slack 2022}` What is cache warming? Why is it important during deployments?
149. `[DESIGN]` `{Discord 2020}` How do you implement "stale-while-revalidate" caching behavior at the application level?
150. `[DESIGN]` `{Shopify 2021}` Design a multi-tier caching strategy: L1 = in-process, L2 = Redis, L3 = DB.

---

### Pagination (Q151–Q170)

151. `[CONCEPT]` `{Airbnb 2019}` What is pagination? Why is returning all records in a single response dangerous?
152. `[CONCEPT]` `{Airbnb 2019}` Explain offset-based pagination. What are its performance and correctness problems at large offsets?
153. `[CONCEPT]` `{Airbnb 2019}` What is the "page drift" problem in offset pagination? Give a concrete example.
154. `[CONCEPT]` `{Airbnb 2019}` Explain cursor-based pagination. What is the cursor and how is it constructed?
155. `[CONCEPT]` `{Airbnb 2019}` What is keyset pagination? How does it differ from cursor pagination?
156. `[CONCEPT]` `{Airbnb 2019}` What index must exist for keyset pagination to be efficient? Why?
157. `[DESIGN]` `{Airbnb 2019}` Design cursor-based pagination for a feed sorted by `created_at DESC`.
158. `[DESIGN]` `{Airbnb 2019}` How do you encode a cursor so it's opaque to the client but contains the necessary seek values?
159. `[DESIGN]` `{Stack Overflow 2013}` Design pagination for a search result that must support jumping to page 50.
160. `[DESIGN]` `{Airbnb 2019}` Your feed has secondary sort: `created_at DESC, id DESC`. How does your cursor encode both fields?
161. `[DESIGN]` `{Airbnb 2019}` How do you handle cursor expiry? What happens when a user resumes pagination 7 days later?
162. `[DESIGN]` `{Stripe rate limit}` Design a paginated admin API that also supports filtering by date range, user ID, and status.
163. `[TRADEOFF]` `{Stack Overflow 2013}` Offset vs cursor pagination — you're building a Google-style search. Which do you use and why?
164. `[TRADEOFF]` `{Airbnb 2019}` Client-side pagination vs server-side pagination — when does client-side pagination make sense?
165. `[CONCEPT]` `{Stack Overflow 2013}` What is the difference between `LIMIT/OFFSET` and a seek query at the database execution level?
166. `[DEBUG]` `{Discord 2020}` Users report seeing duplicate results when paginating. What are the three most common causes?
167. `[DESIGN]` `{Airbnb 2019}` How do you implement infinite scroll vs numbered pages — how does the pagination strategy differ?
168. `[DESIGN]` `{LinkedIn 2011}` Design a cursor for a paginated Kafka consumer.
169. `[CONCEPT]` `{Dropbox 2014}` What is a `next_page_token` in Google API style? How do you implement it?
170. `[DESIGN]` `{Airbnb 2019}` Design pagination for a time-series data endpoint returning sensor readings for a 30-day window.

---

### Search (Q171–Q185)

171. `[CONCEPT]` `{Stack Overflow 2013}` What is full-text search? How is it different from a SQL `LIKE '%query%'` query?
172. `[CONCEPT]` `{Stack Overflow 2013}` What is an inverted index? Explain how it maps terms to documents.
173. `[CONCEPT]` `{Stack Overflow 2013}` What is TF-IDF? How does it score document relevance?
174. `[CONCEPT]` `{Stack Overflow 2013}` What is BM25? Why is it preferred over TF-IDF in modern search engines?
175. `[CONCEPT]` `{Stack Overflow 2013}` What is tokenization and stemming? Give examples of both.
176. `[CONCEPT]` `{Stack Overflow 2013}` What are n-grams? When do you use them for search?
177. `[CONCEPT]` `{Airbnb 2019}` What is Elasticsearch? What problem does it solve that PostgreSQL full-text search doesn't?
178. `[DESIGN]` `{Airbnb 2019}` Design a product search: keyword matching, faceting, sorting by relevance, pagination.
179. `[DESIGN]` `{Airbnb 2019}` How do you sync data between PostgreSQL and Elasticsearch? What are the consistency tradeoffs?
180. `[DESIGN]` `{Airbnb 2019}` How do you implement autocomplete/typeahead search with sub-50ms response time?
181. `[DESIGN]` `{Stack Overflow 2013}` Design a search that supports fuzzy matching. What is edit distance?
182. `[TRADEOFF]` `{Stack Overflow 2013}` PostgreSQL full-text search vs Elasticsearch vs Typesense — when is each appropriate?
183. `[DEBUG]` `{Airbnb 2019}` Search relevance degrades after a data migration. What do you investigate?
184. `[DESIGN]` `{Airbnb 2019}` How do you implement multi-tenant search where each user only sees their own data?
185. `[CONCEPT]` `{Stack Overflow 2013}` What is a search analyzer? What is the difference between the index analyzer and the query analyzer?

---

### Auth (Q186–Q200)

186. `[CONCEPT]` `{AWS us-east-1 2021}` What is the difference between authentication and authorization?
187. `[CONCEPT]` `{AWS us-east-1 2021}` What is a JWT? What are the three parts? What is in the payload?
188. `[CONCEPT]` `{AWS us-east-1 2021}` What is the difference between JWT HS256 (HMAC) and RS256 (RSA)? When do you use each?
189. `[CONCEPT]` `{AWS us-east-1 2021}` Where should a JWT be stored: localStorage, sessionStorage, or an HttpOnly cookie?
190. `[CONCEPT]` `{AWS us-east-1 2021}` What is a refresh token? Why does it exist? How do you implement token rotation?
191. `[CONCEPT]` `{AWS us-east-1 2021}` What is OAuth 2.0? Explain the Authorization Code flow step by step.
192. `[CONCEPT]` `{AWS us-east-1 2021}` What is PKCE and why is it required for mobile/SPA OAuth flows?
193. `[CONCEPT]` `{AWS us-east-1 2021}` What is the difference between OAuth 2.0 and OIDC?
194. `[CONCEPT]` `{AWS us-east-1 2021}` What is RBAC? What is ABAC? Give an example where ABAC is required.
195. `[CONCEPT]` `{AWS us-east-1 2021}` What is a CSRF attack? How does `SameSite=Strict` mitigate it?
196. `[DESIGN]` `{AWS us-east-1 2021}` Design a JWT authentication middleware in Go. What do you validate and in what order?
197. `[DESIGN]` `{Stripe rate limit}` How do you implement API key authentication for a developer API? Where is the key stored and how is it hashed?
198. `[DESIGN]` `{Robinhood 2021}` How do you implement multi-tenant authorization — ensuring tenant A cannot access tenant B's data?
199. `[DEBUG]` `{AWS us-east-1 2021}` A JWT is being rejected with "signature invalid" in production but works locally. What are the three most likely causes?
200. `[TRADEOFF]` `{AWS us-east-1 2021}` Session-based auth vs JWT — what are the tradeoffs for a stateless microservice architecture?

---

# SECTION 3 — Operating Systems (Threads, Processes, Memory, I/O)

---

### Processes (Q201–Q220)

201. `[CONCEPT]` `{Cloudflare 2019}` What is a process? What state does the kernel store for each process (PCB)?
202. `[CONCEPT]` `{Cloudflare 2019}` What is `fork()`? What is copied and what is shared between parent and child?
203. `[CONCEPT]` `{Cloudflare 2019}` What is copy-on-write (COW) in the context of `fork()`? Why does it make `fork()` efficient?
204. `[CONCEPT]` `{Cloudflare 2019}` What is `exec()`? How does `fork()` + `exec()` create a new program?
205. `[CONCEPT]` `{PagerDuty 2021}` What are zombie processes? What causes them and how do you prevent them?
206. `[CONCEPT]` `{PagerDuty 2021}` What are orphan processes? What happens to them on Linux?
207. `[CONCEPT]` `{AWS us-east-1 2021}` What is a process group and session? How does `SIGHUP` relate to terminal disconnection?
208. `[CONCEPT]` `{Monzo 2019}` What is context switching? What state is saved and restored?
209. `[CONCEPT]` `{Monzo 2019}` What is the cost of a context switch? Why does it matter for high-throughput services?
210. `[CONCEPT]` `{Cloudflare 2019}` What is a process address space? What are the segments: text, data, BSS, heap, stack?
211. `[CONCEPT]` `{AWS us-east-1 2021}` What are signals? List `SIGTERM`, `SIGKILL`, `SIGINT`, `SIGPIPE`, `SIGUSR1`. Which can be caught?
212. `[CONCEPT]` `{AWS us-east-1 2021}` What is `SIGPIPE`? When does a backend service receive it and why must it not crash the process?
213. `[DESIGN]` `{AWS us-east-1 2021}` How does a Go process handle `SIGTERM` for graceful shutdown? Write the signal handler pattern.
214. `[CONCEPT]` `{PagerDuty 2021}` What is `/proc/<pid>/status`? Name five useful fields you can read from it.
215. `[CONCEPT]` `{Cloudflare 2019}` What is `strace`? Give three debugging scenarios where `strace -p <pid>` would be useful.
216. `[CONCEPT]` `{Twitch 2015}` What is a file descriptor? What is the default file descriptor limit and why does it matter for servers?
217. `[CONCEPT]` `{Twitch 2015}` What is `ulimit`? What happens when a process hits the file descriptor limit?
218. `[CONCEPT]` `{LinkedIn 2011}` What are pipes? What is the difference between named pipes and anonymous pipes?
219. `[CONCEPT]` `{LinkedIn 2011}` What are Unix domain sockets? When would you use them instead of TCP sockets for IPC?
220. `[DEBUG]` `{Cloudflare 2019}` A process is consuming 100% CPU but doing nothing useful. How do you identify the cause?

---

### Threads & Concurrency (Q221–Q250)

221. `[CONCEPT]` `{Monzo 2019}` What is a thread? How does it differ from a process in terms of shared state?
222. `[CONCEPT]` `{Monzo 2019}` What is a kernel thread vs a user-space thread (green thread)?
223. `[CONCEPT]` `{PagerDuty 2021}` What is the M:N threading model? How does Go implement it with goroutines?
224. `[CONCEPT]` `{PagerDuty 2021}` Why do Go goroutines start at ~2KB of stack instead of the OS thread default of 1-8MB?
225. `[CONCEPT]` `{Robinhood 2021}` What is a race condition? Give a concrete example with two goroutines and a shared counter.
226. `[CONCEPT]` `{Robinhood 2021}` What is a mutex? What is the difference between `sync.Mutex` and `sync.RWMutex`?
227. `[CONCEPT]` `{Robinhood 2021}` What is a deadlock? Give the four Coffman conditions required for deadlock.
228. `[CONCEPT]` `{Robinhood 2021}` What is a livelock? How is it different from a deadlock?
229. `[CONCEPT]` `{Monzo 2019}` What is starvation in the context of thread scheduling?
230. `[CONCEPT]` `{Monzo 2019}` What is a semaphore? How is it different from a mutex?
231. `[CONCEPT]` `{Monzo 2019}` What is a condition variable? When would you use one instead of a mutex?
232. `[CONCEPT]` `{Robinhood 2021}` What is an atomic operation? How does `sync/atomic` in Go avoid locking overhead?
233. `[CONCEPT]` `{PagerDuty 2021}` What is the Go memory model? What guarantee does a channel send provide about memory ordering?
234. `[CONCEPT]` `{PagerDuty 2021}` What is `sync.WaitGroup`? Write the pattern for waiting for N goroutines to complete.
235. `[CONCEPT]` `{PagerDuty 2021}` What is `sync.Once`? Give a use case for lazy singleton initialization.
236. `[CONCEPT]` `{PagerDuty 2021}` What is a worker pool pattern in Go? Why is it better than spawning a goroutine per request?
237. `[CONCEPT]` `{PagerDuty 2021}` What is a goroutine leak? List five common patterns that cause goroutine leaks.
238. `[CONCEPT]` `{PagerDuty 2021}` What is `select` in Go? How does it handle multiple channel operations?
239. `[CONCEPT]` `{LinkedIn 2011}` What is a buffered channel vs an unbuffered channel? When is each appropriate?
240. `[CONCEPT]` `{PagerDuty 2021}` What is Go's scheduler? Explain work stealing and why it improves CPU utilization.
241. `[CONCEPT]` `{PagerDuty 2021}` What is `GOMAXPROCS`? What happens if you set it to 1?
242. `[CONCEPT]` `{PagerDuty 2021}` What is the difference between parallelism and concurrency in Go's model?
243. `[DESIGN]` `{Robinhood 2021}` Implement a concurrent cache with read-write locks. Write the Get and Set methods.
244. `[DESIGN]` `{LinkedIn 2011}` Design a pipeline of goroutines: ingest → validate → enrich → persist. How do you handle backpressure?
245. `[DEBUG]` `{Robinhood 2021}` `go test -race` reports a data race. Explain what the race detector does.
246. `[DEBUG]` `{Robinhood 2021}` Your service is deadlocked. How do you get a goroutine dump? What are you looking for?
247. `[TRADEOFF]` `{Twitch 2015}` Goroutines vs OS threads for I/O-bound work — why does Go's model win?
248. `[TRADEOFF]` `{PagerDuty 2021}` Mutex vs channel for sharing state — what is the Go philosophy and when do you violate it?
249. `[CONCEPT]` `{Monzo 2019}` What is false sharing in CPU caches? How can it degrade performance?
250. `[DESIGN]` `{Stripe rate limit}` Implement a rate limiter using goroutines and a ticker channel — no Redis, pure Go.

---

### Memory Management (Q251–Q270)

251. `[CONCEPT]` `{Cloudflare 2019}` What is virtual memory? Why does every process think it has the entire address space?
252. `[CONCEPT]` `{Cloudflare 2019}` What is a page and a page table? What is a TLB and what happens on a TLB miss?
253. `[CONCEPT]` `{Cloudflare 2019}` What is a page fault? What is the difference between a minor and a major page fault?
254. `[CONCEPT]` `{Cloudflare 2019}` What is demand paging? How does the OS defer allocating physical memory?
255. `[CONCEPT]` `{Heroku 2017}` What is `mmap()`? How do databases use it to map data files into memory?
256. `[CONCEPT]` `{Heroku 2017}` What is the page cache? How does Linux use free RAM for I/O performance?
257. `[CONCEPT]` `{Heroku 2017}` What is `mlock()`? Why does a database use it to prevent its buffer pool from being swapped?
258. `[CONCEPT]` `{PagerDuty 2021}` What is the difference between the heap and the stack for memory allocation?
259. `[CONCEPT]` `{Monzo 2019}` What is garbage collection? Describe Go's garbage collector.
260. `[CONCEPT]` `{Monzo 2019}` What are GC pauses? How does Go's GC minimize stop-the-world pauses?
261. `[CONCEPT]` `{Monzo 2019}` What is `GOGC`? What is `runtime/debug.SetMemoryLimit`? When would you tune these?
262. `[CONCEPT]` `{PagerDuty 2021}` What is escape analysis in Go? Why does a variable sometimes escape to the heap?
263. `[CONCEPT]` `{PagerDuty 2021}` What is a memory leak in a garbage-collected language? Give three Go-specific patterns.
264. `[CONCEPT]` `{PagerDuty 2021}` What is OOM killer in Linux? How does it choose which process to kill?
265. `[CONCEPT]` `{PagerDuty 2021}` What is RSS vs VSZ? Which matters for alerting?
266. `[DEBUG]` `{PagerDuty 2021}` RSS of your service grows by 100MB/hour. How do you take a heap profile with `pprof`?
267. `[DEBUG]` `{PagerDuty 2021}` A slice grows indefinitely even after you stop appending to it. What is the Go slice retention pattern?
268. `[CONCEPT]` `{Cloudflare 2019}` What is string interning? Does Go intern strings?
269. `[TRADEOFF]` `{Monzo 2019}` Manual memory management vs GC vs ownership model (Rust) — runtime performance tradeoffs.
270. `[DESIGN]` `{LinkedIn 2011}` You're building a high-throughput event processor in Go. How do you minimize GC pressure through object reuse?

---

### File System & I/O (Q271–Q300)

271. `[CONCEPT]` `{Heroku 2017}` What is an inode? What does it store?
272. `[CONCEPT]` `{Heroku 2017}` What is the difference between a hard link and a symbolic link?
273. `[CONCEPT]` `{Heroku 2017}` What is `fsync()`? Why does a database call it after writing to the WAL?
274. `[CONCEPT]` `{Heroku 2017}` What is `fdatasync()`? How does it differ from `fsync()`?
275. `[CONCEPT]` `{Heroku 2017}` What is `O_DIRECT`? Why do databases sometimes bypass the page cache?
276. `[CONCEPT]` `{Dropbox 2014}` What is sequential I/O vs random I/O? Why is sequential I/O 100x faster on HDDs?
277. `[CONCEPT]` `{Dropbox 2014}` What is write amplification? How does it affect SSDs and LSM-trees?
278. `[CONCEPT]` `{Dropbox 2014}` What is read amplification? How does it affect B-trees vs LSM-trees?
279. `[CONCEPT]` `{Notion 2021}` What is `iostat`? Name five metrics you'd look at during a DB performance issue.
280. `[CONCEPT]` `{Twitch 2015}` What is `epoll`? How does it enable a single thread to handle 10k concurrent connections?
281. `[CONCEPT]` `{Twitch 2015}` What is the difference between blocking I/O, non-blocking I/O, and async I/O?
282. `[CONCEPT]` `{Twitch 2015}` What is `io_uring`? How does it improve on `epoll` for high-throughput I/O?
283. `[CONCEPT]` `{Heroku 2017}` What is buffered I/O vs unbuffered I/O? Why does the OS buffer writes?
284. `[CONCEPT]` `{Heroku 2017}` What is a write-back vs write-through page cache policy?
285. `[CONCEPT]` `{Heroku 2017}` What is dirty page writeback? How does it affect database crash recovery?
286. `[CONCEPT]` `{Cloudflare 2019}` What is `sendfile()`? Why does nginx use it for serving static files?
287. `[DESIGN]` `{Dropbox 2014}` Your service reads a 1GB config file at startup. How do you do this without reading it all into RAM?
288. `[DEBUG]` `{Heroku 2017}` `iostat` shows 100% disk utilization but low throughput. What is causing this?
289. `[CONCEPT]` `{Heroku 2017}` What is a journaling filesystem? How does it prevent corruption on power loss?
290. `[CONCEPT]` `{Cloudflare 2019}` What is a tmpfs? When would you mount `/tmp` as tmpfs in a production container?
291. `[CONCEPT]` `{Heroku 2017}` What is the difference between block devices and character devices?
292. `[CONCEPT]` `{PagerDuty 2021}` What is `lsof`? Give two production debugging scenarios where you'd use it.
293. `[CONCEPT]` `{Robinhood 2021}` What is a file lock? What is the difference between advisory and mandatory locking?
294. `[CONCEPT]` `{Dropbox 2014}` What is copy-on-write in filesystems? How does it relate to ZFS/Btrfs snapshots?
295. `[CONCEPT]` `{Heroku 2017}` What is `dmesg`? Give three cases where you'd check it on a production server.
296. `[DESIGN]` `{Heroku 2017}` Design a write-ahead log (WAL) from scratch. What does each record contain and why?
297. `[TRADEOFF]` `{Dropbox 2014}` Storing files on local disk vs object storage (S3) — operational and scalability tradeoffs.
298. `[CONCEPT]` `{Heroku 2017}` What is `fallocate()`? Why might a database pre-allocate disk space?
299. `[DEBUG]` `{Notion 2021}` Your service suddenly has very high `iowait`. Walk through your diagnosis.
300. `[CONCEPT]` `{Cloudflare 2019}` What is a file descriptor table? How is it inherited across `fork()`?

---

# SECTION 4 — Databases (Indexes, Transactions, Internals)

---

### Indexes (Q301–Q340)

301. `[CONCEPT]` `{Stack Overflow 2013}` What is a database index? What problem does it solve?
302. `[CONCEPT]` `{Notion 2021}` What is a B-tree index? Describe the structure — root, internal nodes, leaf nodes.
303. `[CONCEPT]` `{Notion 2021}` What is the time complexity of a B-tree search, insert, and delete?
304. `[CONCEPT]` `{Notion 2021}` What is a B+ tree? How does it differ from a B-tree and why do databases use B+ trees?
305. `[CONCEPT]` `{Twitter 2012}` What is a clustered index vs a non-clustered (secondary) index?
306. `[CONCEPT]` `{Notion 2021}` What is an index scan vs a heap fetch? What is an index-only scan?
307. `[CONCEPT]` `{Stack Overflow 2013}` What is a composite index? What is the left-prefix rule?
308. `[CONCEPT]` `{Notion 2021}` What is index cardinality? Why does an index on a boolean column rarely help?
309. `[CONCEPT]` `{Airbnb 2019}` What is a partial index? Give a use case.
310. `[CONCEPT]` `{Stack Overflow 2013}` What is a covering index? How does it avoid a heap fetch?
311. `[CONCEPT]` `{Dropbox 2014}` What is a hash index? When is it faster than a B-tree index?
312. `[CONCEPT]` `{Airbnb 2019}` What is a GIN index in PostgreSQL? When do you use it vs a B-tree?
313. `[CONCEPT]` `{Dropbox 2014}` What is a BRIN index? What table structure makes it efficient?
314. `[CONCEPT]` `{Dropbox 2014}` What is an LSM-tree? How does it differ from a B-tree for write-heavy workloads?
315. `[CONCEPT]` `{Dropbox 2014}` What is a Bloom filter in the context of LSM-tree (RocksDB)?
316. `[CONCEPT]` `{Dropbox 2014}` What is compaction in an LSM-tree? What are size-tiered vs leveled compaction strategies?
317. `[CONCEPT]` `{Notion 2021}` What is index bloat in PostgreSQL? What causes it and how do you fix it?
318. `[CONCEPT]` `{Notion 2021}` What is a dead tuple in PostgreSQL? What is VACUUM and why is autovacuum critical?
319. `[CONCEPT]` `{Notion 2021}` What is fill factor in a PostgreSQL index? When would you set it below 100?
320. `[DESIGN]` `{Stack Overflow 2013}` Design the optimal index for: `SELECT * FROM orders WHERE user_id = ? AND status = 'pending' ORDER BY created_at DESC LIMIT 20`.
321. `[DESIGN]` `{Notion 2021}` You add an index but the planner still does a sequential scan. Name five reasons why.
322. `[DESIGN]` `{Airbnb 2019}` Design indexes for a multi-tenant SaaS table where every query filters by `tenant_id`.
323. `[DESIGN]` `{Notion 2021}` A table has 100 columns and 20 query patterns. What is the cost of too many indexes?
324. `[DESIGN]` `{LinkedIn 2011}` Your ClickHouse table receives 10M rows/sec. Design the partition key and sorting key.
325. `[DEBUG]` `{Notion 2021}` `EXPLAIN ANALYZE` shows actual rows = 1,200,000 but estimated rows = 12. What is wrong?
326. `[DEBUG]` `{Notion 2021}` A query was fast last week and is slow today. The query hasn't changed. What do you investigate?
327. `[CONCEPT]` `{Notion 2021}` What is index selectivity? How does the query planner use statistics to choose an index?
328. `[CONCEPT]` `{Notion 2021}` What is `ANALYZE` in PostgreSQL? What does it collect?
329. `[CONCEPT]` `{Notion 2021}` What is `pg_stat_user_indexes`? What metric tells you an index is unused?
330. `[CONCEPT]` `{Airbnb 2019}` What is an expression index in PostgreSQL? Give a use case with `LOWER(email)`.
331. `[CONCEPT]` `{Twitter 2012}` What is a foreign key constraint and does it automatically create an index in PostgreSQL?
332. `[TRADEOFF]` `{Stack Overflow 2013}` Index on `(a, b)` vs separate indexes on `(a)` and `(b)` — when does the planner prefer the composite?
333. `[CONCEPT]` `{Notion 2021}` What is index intersection in PostgreSQL? How does the planner use two indexes in one query?
334. `[DESIGN]` `{Stack Overflow 2013}` Design a full-text search index in PostgreSQL using `tsvector` and `tsquery`.
335. `[CONCEPT]` `{Twitter 2012}` What is the write overhead of an index? How does having 10 indexes affect INSERT throughput?
336. `[CONCEPT]` `{GitHub 2012}` What is MVCC and how does it interact with indexes? Does an UPDATE create a new index entry?
337. `[DEBUG]` `{Notion 2021}` Index size on disk is 10x the expected size. What are the causes?
338. `[CONCEPT]` `{Stack Overflow 2013}` What is `pg_trgm`? How does it enable fast fuzzy search with an index?
339. `[DESIGN]` `{Uber 2016}` Design a geospatial index for a query: "find all drivers within 5km of this point."
340. `[CONCEPT]` `{Dropbox 2014}` What is a sparse index vs a dense index?

---

### Transactions (Q341–Q380)

341. `[CONCEPT]` `{Robinhood 2021}` What are ACID properties? Define each one with a concrete example.
342. `[CONCEPT]` `{Robinhood 2021}` What is atomicity? What mechanism does PostgreSQL use to guarantee it?
343. `[CONCEPT]` `{Heroku 2017}` What is durability? What role does the WAL play?
344. `[CONCEPT]` `{Heroku 2017}` What is the WAL? What does a WAL record contain? Why must it be written before the data page?
345. `[CONCEPT]` `{Robinhood 2021}` What is consistency in ACID? Is it a database property or an application property?
346. `[CONCEPT]` `{GitHub 2012}` What is isolation? What are the four standard isolation levels?
347. `[CONCEPT]` `{GitHub 2012}` What is a dirty read? At which isolation level is it possible?
348. `[CONCEPT]` `{GitHub 2012}` What is a non-repeatable read? Give a concrete multi-step example.
349. `[CONCEPT]` `{GitHub 2012}` What is a phantom read? What isolation level prevents it?
350. `[CONCEPT]` `{Robinhood 2021}` What is a serialization anomaly? Give the classic write skew example.
351. `[CONCEPT]` `{GitHub 2012}` What is MVCC? How does PostgreSQL use it to avoid read locks?
352. `[CONCEPT]` `{GitHub 2012}` What is a transaction ID (xid) in PostgreSQL? What is xmin and xmax on a tuple?
353. `[CONCEPT]` `{GitHub 2012}` What is a snapshot in PostgreSQL's MVCC? What does it capture?
354. `[CONCEPT]` `{Notion 2021}` What is xid wraparound in PostgreSQL? Why is it a production emergency?
355. `[CONCEPT]` `{Robinhood 2021}` What is a lock in a database? Row lock vs page lock vs table lock?
356. `[CONCEPT]` `{Robinhood 2021}` What is a shared lock vs an exclusive lock? Which operations acquire each?
357. `[CONCEPT]` `{Robinhood 2021}` What is a deadlock in a database? How does PostgreSQL detect and resolve it?
358. `[CONCEPT]` `{Robinhood 2021}` What is `SELECT FOR UPDATE`? What is `SELECT FOR UPDATE SKIP LOCKED`?
359. `[CONCEPT]` `{Robinhood 2021}` What is optimistic locking? How do you implement it without a database lock?
360. `[CONCEPT]` `{Dropbox 2014}` What is a two-phase commit (2PC)? What problem does it solve in distributed transactions?
361. `[CONCEPT]` `{PayPal 2015}` What is the Saga pattern? How does it handle distributed transactions without 2PC?
362. `[CONCEPT]` `{PayPal 2015}` What is a compensating transaction in the Saga pattern? Give an example for a payment flow.
363. `[CONCEPT]` `{PayPal 2015}` What is choreography vs orchestration in Saga? Compare the failure modes of each.
364. `[CONCEPT]` `{LinkedIn 2011}` What is an outbox pattern? Why does it solve the dual-write problem?
365. `[DESIGN]` `{PayPal 2015}` Design the Saga pattern for: order → reserve inventory → charge payment → confirm. What compensating transactions exist?
366. `[DESIGN]` `{Robinhood 2021}` Implement optimistic locking for a bank account balance update. What SQL do you write?
367. `[DESIGN]` `{LinkedIn 2011}` Design a transactional outbox for publishing Kafka events atomically with a DB write.
368. `[DEBUG]` `{Robinhood 2021}` A long-running transaction is blocking all other writes to a table. How do you find it and what do you do?
369. `[DEBUG]` `{GitHub 2012}` Two services simultaneously update the same row. You get an incorrect final balance. What is the isolation level and how do you fix it?
370. `[DEBUG]` `{Notion 2021}` Autovacuum is not running fast enough and transaction ID wraparound is approaching. What do you do?
371. `[CONCEPT]` `{Heroku 2017}` What is PITR in PostgreSQL? How does it use the WAL?
372. `[CONCEPT]` `{Heroku 2017}` What is a checkpoint in PostgreSQL? What happens during a checkpoint?
373. `[CONCEPT]` `{Heroku 2017}` What is `synchronous_commit`? What are the durability tradeoffs of setting it to `off`?
374. `[CONCEPT]` `{Notion 2021}` What is a long transaction in PostgreSQL? Why does it prevent VACUUM from cleaning dead tuples?
375. `[CONCEPT]` `{GitHub 2012}` What is statement-level vs transaction-level snapshot in PostgreSQL?
376. `[TRADEOFF]` `{Robinhood 2021}` `READ COMMITTED` vs `REPEATABLE READ` vs `SERIALIZABLE` — how do you choose for a financial ledger vs a user feed?
377. `[DESIGN]` `{PayPal 2015}` Design an idempotent payment processing system. How do you prevent double charges on retry?
378. `[CONCEPT]` `{Robinhood 2021}` What is advisory locking in PostgreSQL (`pg_advisory_lock`)? When is it useful?
379. `[DEBUG]` `{Robinhood 2021}` `pg_locks` shows a lock wait chain of 5 transactions. Walk through how you resolve it.
380. `[DESIGN]` `{Robinhood 2021}` Design a distributed lock using PostgreSQL advisory locks. How does it compare to Redis-based locking?

---

### DB Internals & Architecture (Q381–Q400)

381. `[CONCEPT]` `{Notion 2021}` What is a database page (block)? What is the default page size in PostgreSQL?
382. `[CONCEPT]` `{Notion 2021}` What is a buffer pool / shared buffer? How does it reduce disk I/O?
383. `[CONCEPT]` `{Uber 2016}` What is the difference between a hot standby and a warm standby in PostgreSQL replication?
384. `[CONCEPT]` `{Uber 2016}` What is streaming replication in PostgreSQL? What is WAL shipping?
385. `[CONCEPT]` `{Uber 2016}` What is replication lag? How do you detect and alert on it?
386. `[CONCEPT]` `{Uber 2016}` What is logical replication vs physical replication in PostgreSQL?
387. `[CONCEPT]` `{Pinterest 2012}` What is sharding? What are the tradeoffs vs vertical scaling?
388. `[CONCEPT]` `{Pinterest 2012}` What is consistent hashing? How does it minimize data movement when adding/removing shards?
389. `[CONCEPT]` `{Pinterest 2012}` What is the difference between vertical partitioning and horizontal partitioning (sharding)?
390. `[CONCEPT]` `{Discord 2020}` What is a read replica? What workloads should be routed to it?
391. `[DESIGN]` `{Zoom 2020}` Design a multi-region PostgreSQL setup for a globally distributed product. How do you handle write latency?
392. `[DESIGN]` `{LinkedIn 2011}` Design the schema and indexing strategy for a time-series event table receiving 100k inserts/sec.
393. `[CONCEPT]` `{LinkedIn 2011}` What is ClickHouse? What workload is it optimized for and why?
394. `[CONCEPT]` `{LinkedIn 2011}` What is a column-oriented storage format? Why is it faster for analytics than row-oriented?
395. `[CONCEPT]` `{LinkedIn 2011}` What is data compression in a columnar database? Why does columnar storage compress better?
396. `[CONCEPT]` `{LinkedIn 2011}` What is partition pruning? How does it make a ClickHouse query 30x faster?
397. `[TRADEOFF]` `{Twitter 2012}` PostgreSQL vs MongoDB for a product catalog — what are the real tradeoffs?
398. `[CONCEPT]` `{Reddit 2012}` What is the CAP theorem? Give a concrete example of a CP system and an AP system.
399. `[CONCEPT]` `{Reddit 2012}` What is eventual consistency? Give a concrete example where it causes a user-visible problem.
400. `[DESIGN]` `{Twitter 2012}` Design a schema migration strategy for a 500M row table with zero downtime.

---

# SECTION 5 — Message Queues & Distributed Systems

---

### Kafka & Message Queues (Q401–Q450)

401. `[CONCEPT]` `{LinkedIn 2011}` What is a message queue? What problem does it solve that a direct HTTP call doesn't?
402. `[CONCEPT]` `{LinkedIn 2011}` What is Kafka? How does it differ from traditional message queues like RabbitMQ?
403. `[CONCEPT]` `{LinkedIn 2011}` What is a Kafka topic? What is a partition?
404. `[CONCEPT]` `{LinkedIn 2011}` What is a Kafka offset? What does "committing an offset" mean?
405. `[CONCEPT]` `{LinkedIn 2011}` What is a consumer group? How do Kafka partitions get assigned to consumers?
406. `[CONCEPT]` `{LinkedIn 2011}` What happens when a consumer in a group crashes? What is rebalancing?
407. `[CONCEPT]` `{LinkedIn 2011}` What is a Kafka producer acknowledgment (acks=0, acks=1, acks=all)? Durability tradeoffs?
408. `[CONCEPT]` `{LinkedIn 2011}` What is `min.insync.replicas`? How does it interact with `acks=all`?
409. `[CONCEPT]` `{LinkedIn 2011}` What is a Kafka ISR (in-sync replica)? What happens when the ISR shrinks to 1?
410. `[CONCEPT]` `{PayPal 2015}` What is at-most-once, at-least-once, and exactly-once delivery? Which is the default in Kafka?
411. `[CONCEPT]` `{PayPal 2015}` How does Kafka achieve exactly-once semantics? What is an idempotent producer?
412. `[CONCEPT]` `{LinkedIn 2011}` What is a Kafka consumer lag? How do you monitor it?
413. `[CONCEPT]` `{LinkedIn 2011}` What is a Kafka retention policy? What happens to messages after the retention period?
414. `[CONCEPT]` `{LinkedIn 2011}` What is a compacted topic in Kafka? How does it differ from a regular topic?
415. `[CONCEPT]` `{LinkedIn 2011}` What is the role of ZooKeeper in old Kafka? What replaced it in KRaft mode?
416. `[DESIGN]` `{Uber 2016}` Design a Kafka partitioning strategy for an order processing system. How do you ensure per-user ordering?
417. `[DESIGN]` `{PayPal 2015}` Design a transactional outbox pattern with Kafka. Walk through the exact sequence of operations.
418. `[DESIGN]` `{LinkedIn 2011}` How do you implement dead letter queues (DLQ) in Kafka?
419. `[DESIGN]` `{Robinhood 2021}` Design a Kafka consumer that processes payments. How do you handle a message that keeps failing?
420. `[DESIGN]` `{LinkedIn 2011}` How do you replay Kafka messages from a specific offset? What are the use cases?
421. `[DEBUG]` `{LinkedIn 2011}` Consumer lag is growing at 10k messages/second. What are the first five things you check?
422. `[DEBUG]` `{LinkedIn 2011}` A Kafka consumer is processing messages out of order. What causes this?
423. `[DEBUG]` `{PayPal 2015}` Messages are being processed twice even though you have at-least-once configured. What is happening?
424. `[TRADEOFF]` `{LinkedIn 2011}` Kafka vs RabbitMQ vs SQS — when would you choose each for a new project?
425. `[CONCEPT]` `{LinkedIn 2011}` What is tail-based sampling in distributed tracing? How does Kafka enable it?
426. `[DESIGN]` `{LinkedIn 2011}` Design a Kafka-based event sourcing system. What is the event log and how is state reconstructed?
427. `[CONCEPT]` `{LinkedIn 2011}` What is backpressure in a Kafka pipeline? How does consumer processing speed affect the producer?
428. `[DESIGN]` `{Twitch 2015}` How do you implement a fan-out notification system (one event → notify 1M users) using Kafka?
429. `[CONCEPT]` `{LinkedIn 2011}` What is a Kafka stream vs a Kafka table? What is a KStream and a KTable?
430. `[DESIGN]` `{Robinhood 2021}` Design a real-time fraud detection pipeline using Kafka. What are the latency constraints?
431. `[CONCEPT]` `{LinkedIn 2011}` What is message ordering in Kafka? Is ordering guaranteed across partitions?
432. `[CONCEPT]` `{Dropbox 2014}` What is a schema registry? Why is it important for a Kafka-based system?
433. `[DESIGN]` `{Dropbox 2014}` How do you handle schema evolution in Kafka messages — adding, removing, and renaming fields?
434. `[CONCEPT]` `{LinkedIn 2011}` What is Kafka Connect? When would you use it instead of a custom consumer?
435. `[TRADEOFF]` `{LinkedIn 2011}` Kafka vs a database table as an event log — operational and scalability differences.
436. `[DESIGN]` `{PayPal 2015}` Design a Kafka consumer that writes to PostgreSQL transactionally — how do you prevent duplicate DB writes?
437. `[CONCEPT]` `{LinkedIn 2011}` What is `auto.offset.reset` = `earliest` vs `latest`? What is the risk of each?
438. `[DEBUG]` `{LinkedIn 2011}` A Kafka topic has 8 partitions but only 3 consumers are active. What is the throughput bottleneck?
439. `[CONCEPT]` `{LinkedIn 2011}` What is sticky partitioning in Kafka producers? Why does it improve batching?
440. `[DESIGN]` `{Robinhood 2021}` Design a Kafka-based job scheduler that ensures each job runs exactly once.
441. `[CONCEPT]` `{LinkedIn 2011}` What is a Kafka broker? What happens when a broker goes down?
442. `[CONCEPT]` `{LinkedIn 2011}` What is the log compaction mechanism in Kafka? What guarantees does it provide?
443. `[DESIGN]` `{PayPal 2015}` How do you implement a Saga using Kafka? Compare choreography vs orchestration.
444. `[CONCEPT]` `{LinkedIn 2011}` What is `linger.ms` and `batch.size` in a Kafka producer? How do they affect throughput vs latency?
445. `[DEBUG]` `{LinkedIn 2011}` Kafka producer is getting `RecordTooLargeException`. What is the fix and what caused it?
446. `[CONCEPT]` `{LinkedIn 2011}` What is KSQL / Flink? When would you use stream processing vs batch processing?
447. `[DESIGN]` `{LinkedIn 2011}` Design a Kafka-based audit log that is tamper-evident.
448. `[TRADEOFF]` `{LinkedIn 2011}` Push-based messaging vs pull-based — Kafka uses pull. Why?
449. `[DESIGN]` `{Airbnb 2019}` Design a multi-tenant Kafka setup. One topic per tenant vs shared topic with filtering?
450. `[CONCEPT]` `{LinkedIn 2011}` What is `fetch.min.bytes` and `fetch.max.wait.ms`? How do they affect consumer latency?

---

### Distributed Systems Concepts (Q451–Q500)

451. `[CONCEPT]` `{Facebook BGP 2021}` What is a distributed system? What are the three problems introduced that don't exist on a single machine?
452. `[CONCEPT]` `{Reddit 2012}` What is the CAP theorem? Can you have all three? What does "partition tolerance" actually mean?
453. `[CONCEPT]` `{Reddit 2012}` What is the PACELC theorem? How does it extend CAP?
454. `[CONCEPT]` `{Reddit 2012}` What is the difference between strong, sequential, causal, and eventual consistency?
455. `[CONCEPT]` `{Facebook BGP 2021}` What is a network partition? How does your system behave during one?
456. `[CONCEPT]` `{Facebook BGP 2021}` What are the fallacies of distributed computing? Name all eight.
457. `[CONCEPT]` `{Robinhood 2021}` What is a distributed lock? Why is a single-node mutex insufficient?
458. `[DESIGN]` `{Robinhood 2021}` Design a distributed lock using Redis (Redlock algorithm). What are the known weaknesses?
459. `[DESIGN]` `{Robinhood 2021}` Design a distributed lock using PostgreSQL advisory locks. How does it handle lock expiry?
460. `[CONCEPT]` `{Robinhood 2021}` What is a fencing token? Why is it necessary even with a correct distributed lock?
461. `[CONCEPT]` `{LinkedIn 2011}` What is leader election? Why is it needed in a distributed system?
462. `[CONCEPT]` `{LinkedIn 2011}` What is the Raft consensus algorithm? What are the three roles a node can have?
463. `[CONCEPT]` `{LinkedIn 2011}` What is a split-brain scenario? How does Raft prevent it?
464. `[CONCEPT]` `{LinkedIn 2011}` What is a heartbeat in a distributed system? What happens when a leader misses N heartbeats?
465. `[CONCEPT]` `{Pinterest 2012}` What is consistent hashing? How many keys are remapped when you add a node?
466. `[CONCEPT]` `{Pinterest 2012}` What is a virtual node (vnode) in consistent hashing? Why does it improve load distribution?
467. `[CONCEPT]` `{Facebook BGP 2021}` What is the Gossip protocol? How does it propagate state in a cluster?
468. `[CONCEPT]` `{Reddit 2012}` What is a vector clock? What problem does it solve that timestamps don't?
469. `[CONCEPT]` `{PayPal 2015}` What is the two generals problem? Why is exactly-once delivery over unreliable networks theoretically impossible?
470. `[CONCEPT]` `{PayPal 2015}` What is idempotency in distributed systems? How do you implement an idempotent API endpoint?
471. `[DESIGN]` `{Shopify 2021}` Design a distributed rate limiter that works across 100 service instances without a central Redis.
472. `[DESIGN]` `{AWS us-east-1 2021}` Design a distributed session management system. How do you handle node failure?
473. `[CONCEPT]` `{LinkedIn 2011}` What is event sourcing? What are the benefits for an audit-heavy system?
474. `[CONCEPT]` `{LinkedIn 2011}` What is CQRS (Command Query Responsibility Segregation)? When does it make sense?
475. `[CONCEPT]` `{LinkedIn 2011}` What is the difference between event-driven architecture and request-response architecture?
476. `[DESIGN]` `{Reddit 2012}` Design a distributed counter (like a view count) that handles millions of increments per second.
477. `[CONCEPT]` `{Reddit 2012}` What is a CRDT (Conflict-free Replicated Data Type)? Give a concrete example.
478. `[CONCEPT]` `{Twitter 2012}` What is the birthday paradox and why does it matter for distributed ID generation?
479. `[DESIGN]` `{Twitter 2012}` Design a globally unique ID generator (Snowflake-style). What are the components of the ID?
480. `[DESIGN]` `{Robinhood 2021}` Design a distributed job scheduler that guarantees each job runs exactly once.
481. `[CONCEPT]` `{AWS us-east-1 2021}` What is service discovery? Compare Consul, etcd, and DNS-based discovery.
482. `[CONCEPT]` `{AWS us-east-1 2021}` What is a health check in a distributed system? Liveness vs readiness?
483. `[CONCEPT]` `{Netflix Chaos}` What is bulkhead isolation? How does it prevent a failing dependency from taking down your service?
484. `[CONCEPT]` `{Netflix Chaos}` What is a timeout cascade? How do you prevent it with careful timeout budgeting?
485. `[CONCEPT]` `{AWS us-east-1 2021}` What is the difference between RTO and RPO?
486. `[DESIGN]` `{Uber 2016}` Design the failover mechanism for a distributed PostgreSQL cluster. What is your RTO target?
487. `[CONCEPT]` `{Pinterest 2012}` What is the difference between horizontal and vertical scaling? When does horizontal scaling require application changes?
488. `[DESIGN]` `{PayPal 2015}` Design a system that processes 10M events per day with exactly-once guarantee.
489. `[CONCEPT]` `{Heroku 2017}` What is a write-ahead log (WAL) in distributed systems vs in a single-node database?
490. `[CONCEPT]` `{Dropbox 2014}` What is a two-phase commit (2PC) and why is it considered an anti-pattern at large scale?
491. `[TRADEOFF]` `{Reddit 2012}` Strong consistency vs eventual consistency for a social media like count — what do you choose?
492. `[TRADEOFF]` `{Etsy 2012}` Microservices vs monolith for a team of 5 engineers — what are the operational costs each creates?
493. `[DESIGN]` `{AWS us-east-1 2021}` Design the observability stack for a distributed system: metrics, traces, logs.
494. `[CONCEPT]` `{AWS us-east-1 2021}` What is OpenTelemetry? What are the three signals it standardizes?
495. `[CONCEPT]` `{Notion 2021}` What is a flame graph? What does the x-axis represent and what does a wide bar mean?
496. `[CONCEPT]` `{Notion 2021}` What is p99 latency? Why is the average a dangerous metric for backend systems?
497. `[DESIGN]` `{AWS us-east-1 2021}` Design an SLO-based alerting system. What are SLI, SLO, and SLA?
498. `[CONCEPT]` `{Etsy 2012}` What is a blue-green deployment? How does it differ from a canary deployment?
499. `[DESIGN]` `{Netflix Chaos}` Design a chaos engineering test plan for a payments service. What failures would you inject?
500. `[TRADEOFF]` `{Etsy 2012}` When does a distributed system become harder to operate than a well-designed monolith?

---

# SECTION 6 — Computer Networks (Deep Dive)
> Full TCP/IP stack, socket programming, protocols, debugging tools — Backend 2026 Roadmap Block 2

---

### TCP/IP Stack & Fundamentals (Q501–Q520)

501. `[CONCEPT]` `{Facebook BGP 2021}` What are the four layers of the TCP/IP model? Give a real protocol at each layer.
502. `[CONCEPT]` `{Facebook BGP 2021}` What is the difference between the OSI 7-layer model and the TCP/IP 4-layer model? Which do engineers actually use and why?
503. `[CONCEPT]` `{Facebook BGP 2021}` What is BGP (Border Gateway Protocol)? Why did Facebook disappear from the internet in October 2021?
504. `[CONCEPT]` `{Cloudflare DNS 2020}` What is an autonomous system (AS)? What is an AS number?
505. `[CONCEPT]` `{Facebook BGP 2021}` What is route advertisement and route withdrawal in BGP? What happens when routes are withdrawn?
506. `[CONCEPT]` `{Facebook BGP 2021}` What is a BGP route leak? How can a single misconfigured router take down a major network?
507. `[CONCEPT]` `{Cloudflare DNS 2020}` What is RPKI (Resource Public Key Infrastructure)? How does it prevent BGP hijacking?
508. `[CONCEPT]` `{AWS us-east-1 2012}` What is an IP address? What is the difference between IPv4 and IPv6?
509. `[CONCEPT]` `{AWS us-east-1 2012}` What is CIDR notation? What does `10.0.0.0/24` mean in terms of hosts?
510. `[CONCEPT]` `{Zoom 2020}` What is NAT (Network Address Translation)? Why does it exist and how does it affect backend services?
511. `[CONCEPT]` `{AWS us-east-1 2012}` What is a subnet? What is the difference between a public and private subnet in AWS VPC?
512. `[CONCEPT]` `{AWS us-east-1 2021}` What is a VPC (Virtual Private Cloud)? What is a security group vs a network ACL?
513. `[CONCEPT]` `{Facebook BGP 2021}` What is the difference between unicast, multicast, and broadcast?
514. `[CONCEPT]` `{AWS us-east-1 2012}` What is ARP (Address Resolution Protocol)? How does a machine find the MAC address for an IP?
515. `[CONCEPT]` `{AWS us-east-1 2012}` What is ICMP? What does `ping` actually send and receive?
516. `[CONCEPT]` `{Cloudflare DNS 2020}` What is traceroute? What does each line represent?
517. `[CONCEPT]` `{AWS us-east-1 2012}` What is a default gateway? What happens when a packet is destined for a different subnet?
518. `[CONCEPT]` `{Facebook BGP 2021}` What is TTL in an IP packet? How does it prevent packets from looping forever?
519. `[CONCEPT]` `{AWS us-east-1 2012}` What is IP fragmentation? Why do databases and services try to avoid it?
520. `[DESIGN]` `{Zoom 2020}` Your service is deployed in a private subnet and needs to call an external API. Walk through the network path: private IP → NAT gateway → internet → response back.

---

### TCP Deep Dive (Q521–Q545)

521. `[CONCEPT]` `{AWS us-east-1 2012}` Draw the TCP three-way handshake: SYN, SYN-ACK, ACK. What state does each side enter?
522. `[CONCEPT]` `{AWS us-east-1 2012}` Draw the TCP four-way teardown: FIN, ACK, FIN, ACK. Why are there four steps instead of three?
523. `[CONCEPT]` `{AWS us-east-1 2012}` What is the TIME_WAIT state? How long does it last and why?
524. `[CONCEPT]` `{Cloudflare QUIC}` What is TCP's sliding window? How does it implement flow control?
525. `[CONCEPT]` `{Cloudflare QUIC}` What is TCP congestion control? Name the four phases: slow start, congestion avoidance, fast retransmit, fast recovery.
526. `[CONCEPT]` `{Cloudflare QUIC}` What is CUBIC TCP congestion control? Why did it replace Reno?
527. `[CONCEPT]` `{Cloudflare QUIC}` What is BBR congestion control? Why does Google use it for YouTube?
528. `[CONCEPT]` `{AWS us-east-1 2012}` What is a TCP SYN flood attack? What is SYN cookies and how do they mitigate it?
529. `[CONCEPT]` `{Cloudflare QUIC}` What is TCP head-of-line blocking? How does QUIC solve it at the transport layer?
530. `[CONCEPT]` `{AWS us-east-1 2012}` What is the Nagle algorithm in detail? When does it delay sends and why is it harmful for latency-sensitive apps?
531. `[CONCEPT]` `{Twitch 2015}` What is `TCP_NODELAY`? What socket option disables Nagle and when do you set it?
532. `[CONCEPT]` `{Twitch 2015}` What is `SO_REUSEADDR` vs `SO_REUSEPORT`? When does each matter?
533. `[CONCEPT]` `{Twitch 2015}` What is `SO_KEEPALIVE`? How do `tcp_keepalive_time`, `tcp_keepalive_intvl`, and `tcp_keepalive_probes` work?
534. `[CONCEPT]` `{AWS us-east-1 2012}` What is `TCP_BACKLOG`? What happens when the accept queue is full?
535. `[CONCEPT]` `{Twitch 2015}` What is `SO_LINGER`? When would you set it to 0 and what happens to undelivered data?
536. `[CONCEPT]` `{AWS us-east-1 2012}` What is a half-open TCP connection? How does it occur and how do you detect it?
537. `[CONCEPT]` `{AWS us-east-1 2012}` What is the maximum segment size (MSS)? How does it relate to MTU?
538. `[CONCEPT]` `{AWS us-east-1 2012}` What is path MTU discovery? What happens when a large packet cannot be fragmented?
539. `[DEBUG]` `{AWS us-east-1 2012}` `ss -tlnp` shows a port in LISTEN state but connection attempts fail. What are the possible causes?
540. `[DEBUG]` `{AWS us-east-1 2012}` Your service has 50,000 sockets in TIME_WAIT. How do you reduce this without breaking correctness?
541. `[DESIGN]` `{Twitch 2015}` Write the socket programming sequence for a TCP server in pseudocode: socket() → bind() → listen() → accept() → read/write → close().
542. `[DESIGN]` `{Twitch 2015}` Write the socket programming sequence for a TCP client: socket() → connect() → write/read → close().
543. `[DEBUG]` `{AWS us-east-1 2012}` A TCP connection is established but no data flows. What tool do you use and what do you look for?
544. `[TRADEOFF]` `{Cloudflare QUIC}` TCP vs QUIC — what concrete problems does QUIC solve at the transport layer?
545. `[CONCEPT]` `{AWS us-east-1 2012}` What is TCP segmentation offload (TSO)? How does it improve throughput on modern NICs?

---

### DNS Protocol Deep Dive (Q546–Q555)

546. `[CONCEPT]` `{Facebook BGP 2021}` Describe the DNS resolution path for `api.example.com` in full: stub resolver → recursive resolver → root → TLD → authoritative.
547. `[CONCEPT]` `{Facebook BGP 2021}` What is a DNS zone? What is the difference between a zone file and a DNS record?
548. `[CONCEPT]` `{Facebook BGP 2021}` What is a DNS SOA (Start of Authority) record? What fields does it contain?
549. `[CONCEPT]` `{Cloudflare DNS 2020}` What is DNS over HTTPS (DoH)? What is DNS over TLS (DoT)? Why do they exist?
550. `[CONCEPT]` `{Facebook BGP 2021}` What is negative caching in DNS (NXDOMAIN TTL)? How can a high negative TTL cause problems during incident recovery?
551. `[CONCEPT]` `{Facebook BGP 2021}` What is DNSSEC? What problem does it solve and what is the performance cost?
552. `[CONCEPT]` `{Cloudflare DNS 2020}` What is Anycast DNS? How does Cloudflare use it to serve DNS from 300+ PoPs?
553. `[DEBUG]` `{Facebook BGP 2021}` `dig api.example.com` returns SERVFAIL. Walk through your diagnosis step by step.
554. `[DEBUG]` `{Facebook BGP 2021}` DNS resolution works from your laptop but not from your production container. What are the differences you investigate?
555. `[DESIGN]` `{Facebook BGP 2021}` Design the DNS strategy for a zero-downtime migration from one cloud provider to another. How do TTLs affect your plan?

---

### HTTP & Application Protocols (Q556–Q570)

556. `[CONCEPT]` `{Cloudflare QUIC}` What is QUIC? What layer of the stack is it on? What does it borrow from TCP and what is new?
557. `[CONCEPT]` `{Cloudflare QUIC}` What is HTTP/3? How does it use QUIC as its transport? What is eliminated compared to HTTP/2?
558. `[CONCEPT]` `{Cloudflare QUIC}` What is 0-RTT connection establishment in QUIC? What security tradeoff does it make?
559. `[CONCEPT]` `{Cloudflare 2019}` What is WebSocket? Walk through the HTTP upgrade handshake at the protocol level.
560. `[CONCEPT]` `{Twitch 2015}` What is the WebSocket framing format? What is a control frame vs a data frame?
561. `[CONCEPT]` `{Cloudflare 2019}` What is gRPC at the wire level? What does an HTTP/2 frame carrying a gRPC call look like?
562. `[CONCEPT]` `{Dropbox 2014}` What is SMTP at the protocol level? Describe EHLO, MAIL FROM, RCPT TO, DATA, QUIT.
563. `[CONCEPT]` `{Cloudflare DNS 2020}` What is the difference between TCP and UDP in DNS? When does DNS fall back to TCP?
564. `[CONCEPT]` `{Cloudflare QUIC}` What is server push in HTTP/2? Why was it largely abandoned in practice?
565. `[CONCEPT]` `{Cloudflare 2019}` What is a connection: upgrade header? How does HTTP/1.1 upgrade to WebSocket?
566. `[DESIGN]` `{Twitch 2015}` Design a WebSocket server that handles 100k concurrent connections. What are the memory and CPU constraints per connection?
567. `[DESIGN]` `{Dropbox 2014}` Design a protocol for efficient binary file sync — describe how you'd design it if HTTP was too slow.
568. `[TRADEOFF]` `{Cloudflare QUIC}` HTTP/2 vs HTTP/3 for a mobile app with lossy connectivity — which performs better and why?
569. `[DEBUG]` `{Cloudflare 2019}` A gRPC call returns status code 14 (UNAVAILABLE). What are the top 5 network-layer causes?
570. `[CONCEPT]` `{Cloudflare 2019}` What is HTTP/2 HPACK header compression? Why is it stateful and what are the security implications?

---

### Network Debugging & Tools (Q571–Q585)

571. `[CONCEPT]` `{Facebook BGP 2021}` What does `ss -tlnp` show? What is the difference between `ss` and `netstat`?
572. `[CONCEPT]` `{Cloudflare DNS 2020}` What is `tcpdump`? Write the command to capture all HTTP traffic on port 80 and save to a file.
573. `[CONCEPT]` `{Facebook BGP 2021}` What is `mtr`? How is it better than `traceroute` for diagnosing packet loss?
574. `[CONCEPT]` `{AWS us-east-1 2012}` What is Wireshark? When would you use it instead of `tcpdump`?
575. `[CONCEPT]` `{Cloudflare DNS 2020}` What is `nmap`? Give three legitimate production uses.
576. `[CONCEPT]` `{Cloudflare DNS 2020}` What is `dig`? Write the command to trace DNS resolution from the root servers.
577. `[CONCEPT]` `{Facebook BGP 2021}` What is `curl -v`? Walk through the output of a HTTPS request — what does each line tell you?
578. `[CONCEPT]` `{AWS us-east-1 2012}` What is `iperf3`? When would you use it in a cloud environment?
579. `[CONCEPT]` `{AWS us-east-1 2012}` What is `ethtool`? What NIC statistics would you inspect during a network performance issue?
580. `[DEBUG]` `{Facebook BGP 2021}` Packets between two pods in Kubernetes are dropping intermittently. Walk through your network debugging approach.
581. `[DEBUG]` `{Cloudflare DNS 2020}` A service can connect to external IPs but DNS resolution fails inside the container. What do you check?
582. `[DEBUG]` `{AWS us-east-1 2012}` `tcpdump` shows packets leaving your host but the remote never responds. What does this tell you?
583. `[DEBUG]` `{Cloudflare 2019}` Your TLS handshake takes 300ms but the certificate chain is only 2 certs. Where is the time going?
584. `[DESIGN]` `{Facebook BGP 2021}` Design the network monitoring stack for a globally distributed service. What metrics do you collect at the packet level?
585. `[DEBUG]` `{Cloudflare DNS 2020}` A CDN returns the wrong origin IP to some users. What is the most likely cause and how do you diagnose it?

---

### Load Balancing & Service Mesh (Q586–Q600)

586. `[CONCEPT]` `{AWS us-east-1 2021}` What is a load balancer? Describe the full packet path through an L4 vs L7 load balancer.
587. `[CONCEPT]` `{AWS us-east-1 2021}` What is DSR (Direct Server Return)? Why does it improve throughput for L4 load balancers?
588. `[CONCEPT]` `{Shopify 2021}` What is consistent hashing in load balancing? How does HAProxy implement it?
589. `[CONCEPT]` `{Shopify 2021}` What load balancing algorithms exist: round-robin, least connections, IP hash, random, weighted? When is each appropriate?
590. `[CONCEPT]` `{AWS us-east-1 2021}` What is connection draining in a load balancer? Why is it necessary before removing a backend?
591. `[CONCEPT]` `{AWS us-east-1 2021}` What is a health check in a load balancer? What is the difference between active and passive health checks?
592. `[CONCEPT]` `{AWS us-east-1 2021}` What is a sticky session (session affinity)? When does it help and when does it create problems?
593. `[CONCEPT]` `{AWS us-east-1 2021}` What is a service mesh? Name two implementations. What problems do they solve?
594. `[CONCEPT]` `{AWS us-east-1 2021}` What is a sidecar proxy? How does Envoy implement mTLS between services?
595. `[CONCEPT]` `{AWS us-east-1 2021}` What is mTLS (mutual TLS)? How is it different from regular TLS and why does a service mesh use it?
596. `[DESIGN]` `{Shopify 2021}` Design the load balancing strategy for a flash sale: 100x normal traffic for 60 seconds. What do you configure before the event?
597. `[DESIGN]` `{AWS us-east-1 2021}` Design the network path for a zero-trust architecture: how does every service-to-service call get authenticated?
598. `[DEBUG]` `{AWS us-east-1 2021}` The load balancer health check passes but end users see errors on one backend. What is happening?
599. `[TRADEOFF]` `{AWS us-east-1 2021}` Service mesh vs library-level networking (e.g. go-micro) — what are the operational tradeoffs?
600. `[DESIGN]` `{Facebook BGP 2021}` Design the network resilience strategy for a service that must survive a full availability zone failure. What BGP, DNS, and load balancer configurations are required?

---

## Quick-Reference Index

| Section | Questions | Core Topics |
|---|---|---|
| Web Request Lifecycle | 1–100 | DNS, TCP, HTTP, Service Internals, DB Round-trip |
| System Design | 101–200 | Rate Limiting, Caching, Pagination, Search, Auth |
| Operating Systems | 201–300 | Processes, Threads, Memory, File I/O |
| Databases | 301–400 | Indexes, Transactions, MVCC, Internals |
| Queues & Distributed Systems | 401–500 | Kafka, Locks, Consensus, Observability |
| **Computer Networks** | **501–600** | **TCP/IP, DNS, HTTP protocols, debugging tools, LB** |

---

## Company Incident → Question Mapping

| Incident | Questions | Core Lesson |
|---|---|---|
| Facebook BGP 2021 | 1, 2, 4, 16, 451, 455, 456, 503–506, 513, 518, 546–555, 571, 573, 577, 580, 584, 600 | BGP, DNS, network partition |
| Cloudflare DNS 2020 | 3, 15, 26, 33, 503, 504, 507, 515–516, 549, 552, 563, 572, 575–576, 581, 585 | DNS, BGP, CDN |
| Cloudflare 2019 | 11, 23–24, 32, 37, 41, 47, 57, 68, 73, 107, 112, 201–204, 210, 215, 220, 251–253, 268, 286, 290, 300, 559, 561, 565, 569–570, 583 | WAF CPU, regex, process model |
| Cloudflare QUIC | 8–9, 18–19, 21–22, 60, 524–531, 544, 556–558, 568 | HTTP/3, QUIC, HOL blocking |
| AWS us-east-1 2021 | 10, 25, 35, 48, 51, 53, 78, 84, 87–88, 94, 100, 138, 186–200, 207, 211–213, 472, 481–482, 485, 493–494, 497, 512, 520, 586–592, 595–600 | Cascade failure, IAM, auth |
| AWS us-east-1 2012 | 6–7, 17, 49, 54, 97, 508–511, 514–519, 521–523, 528–530, 534–543, 545, 571–572, 574, 578–579, 582 | Retry storm, TIME_WAIT, TCP |
| GitHub 2012 | 336, 346–349, 351–353, 369, 375 | Split-brain, dirty reads, MVCC |
| Slack 2022 | 96, 130, 148 | Thundering herd, cache warm |
| Stripe rate limit | 27, 36, 72, 74, 101–106, 108–115, 118, 120, 162, 197, 250 | Rate limiting design |
| Twitter 2012 | 305, 331, 335, 397, 400, 478–479 | Sharding, ID generation |
| Discord 2020 | 80, 123, 128, 131–132, 136, 140, 143, 146, 149, 166, 390 | Cache staleness, replicas |
| Notion 2021 | 55, 66–67, 89, 279, 299, 302–303, 306, 308, 317–318, 321, 323–329, 333, 337, 354, 370, 374, 381–382, 495–496 | Index bloat, planner stats |
| PagerDuty 2021 | 43–46, 56, 205–206, 214, 223–224, 233–237, 240–242, 258, 262–267, 292 | Goroutine leak, OOM |
| Shopify 2021 | 30–31, 108–117, 121–122, 124–129, 135, 139, 142, 144–145, 147, 150, 471, 588–589, 596 | Cache stampede, rate limiting |
| Airbnb 2019 | 59, 61, 64, 69, 71, 75, 141, 151–165, 167, 170, 177–180, 183–184, 309, 312, 322, 330, 449 | N+1, pagination, indexing |
| Dropbox 2014 | 39–40, 79, 85, 169, 276–278, 287, 294, 297, 311, 313–316, 340, 360, 432–433, 490, 567 | Protocol design, storage, LSM |
| LinkedIn 2011 | 58, 92, 168, 218–219, 239, 244, 270, 324, 364, 367, 392–396, 401–415, 420–422, 424–432, 434–435, 437–439, 441–442, 444–448, 450, 461–464, 473–475 | Kafka origin, event systems |
| Uber 2016 | 62, 339, 383–386, 416, 486 | Replication lag, geo |
| Netflix Chaos | 50, 52, 119, 483–484, 499 | Circuit breaker, chaos eng |
| Robinhood 2021 | 81, 198, 225–228, 232, 243, 245–246, 293, 341–342, 345, 350, 355–359, 366, 368–369, 376–380, 419, 430, 440, 457–460, 480 | Deadlock, transactions |
| Zoom 2020 | 5, 34, 391, 510, 520 | Routing, NAT, multi-region |
| Google 2014 | 12–14 | TLS, cert expiry |
| Stack Overflow 2013 | 63, 65, 70, 90, 93, 159, 163, 165, 171–176, 181–182, 185, 301, 307, 310, 320, 332, 334, 338 | Query plans, full-text search |
| PayPal 2015 | 28, 38, 82, 86, 99, 115, 361–362, 365, 377, 410–411, 417, 423, 436, 443, 469–470, 488 | Idempotency, Saga, exactly-once |
| Monzo 2019 | 133–134, 144, 208–209, 221–222, 229–231, 249, 259–261, 269 | GC pauses, Redis, JVM |
| Heroku 2017 | 255–257, 271–275, 283–285, 288–289, 291, 295–296, 298, 343–344, 371–373, 489 | mmap, page cache, WAL |
| Pinterest 2012 | 387–389, 465–466, 487 | Sharding, consistent hashing |
| Reddit 2012 | 137, 398–399, 452–454, 468, 476–477, 491 | Eventual consistency, CRDT |
| Etsy 2012 | 91, 95, 98, 492, 498, 500 | Deploys, feature flags |
| Twitch 2015 | 20, 29, 42, 76–77, 216–217, 247, 280–282, 428, 531–533, 535, 541–542, 559–560, 566 | WebSocket, fd limits, epoll |

---

## Priority Tiers for Infraspec Interview Prep

**Tier 1 — Answer these cold:**
Q1–Q15, Q21–Q30, Q61–Q70, Q101–Q110, Q121–Q135, Q186–Q200, Q221–Q240, Q301–Q320, Q341–Q360, Q401–Q415, Q501–Q525

**Tier 2 — Answer with one prompt:**
Q16–Q20, Q31–Q60, Q71–Q100, Q111–Q120, Q136–Q185, Q201–Q220, Q241–Q300, Q321–Q400, Q416–Q450, Q526–Q570

**Tier 3 — Design questions (whiteboard-ready):**
Q81–Q100, Q136–Q150, Q157–Q170, Q178–Q185, Q280–Q300, Q365–Q380, Q416–Q450, Q471–Q500, Q541–Q545, Q555, Q566–Q567, Q584, Q596–Q600

---

*Backend Engineering Mastery Plan 2026 | Total: 600 questions | 6 sections | Every question tagged with a real company incident*
