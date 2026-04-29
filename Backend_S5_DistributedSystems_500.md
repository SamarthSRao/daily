# Backend Engineering — Section 5: Distributed Systems
### 500 Questions | Kafka · Sagas · Locks · Consensus · Event Sourcing · CQRS · Consistency
> Mapped to Backend 2026 Roadmap Stages 7–8 | Infraspec Target
> Tagged: [CONCEPT] [CODE] [DEBUG] [TRADEOFF] [DESIGN] [APPLY]
> Levels: {L1} must know · {L2} mid/senior · {L3} staff/architect

---

# PART A — Kafka & Message Queues (Q1–Q120)

---

## Kafka Fundamentals (Q1–Q50)

1. `[CONCEPT]` `{L1}` What is Kafka? What problem does it solve that a direct HTTP call between services doesn't?
2. `[CONCEPT]` `{L1}` What is a Kafka topic? What is a partition? What is an offset? How do they relate?
3. `[CONCEPT]` `{L1}` What is a Kafka broker? What is a Kafka cluster? What is the role of ZooKeeper vs KRaft?
4. `[CONCEPT]` `{L1}` What is a consumer group? How do partitions get assigned to consumers within a group?
5. `[CONCEPT]` `{L1}` What is the relationship between the number of partitions and the maximum parallelism of consumers in a group?
6. `[CONCEPT]` `{L1}` What happens when you add a 4th consumer to a consumer group that only has 3 partitions?
7. `[CONCEPT]` `{L1}` What is committing an offset? What is the difference between automatic and manual offset commit?
8. `[DEBUG]` `{L2}` A consumer group has `auto.commit.enable = true`. A consumer processes a message, the process crashes before the next auto-commit. Is the message reprocessed? Why?
9. `[CONCEPT]` `{L1}` What are the three delivery guarantees in Kafka: at-most-once, at-least-once, exactly-once? Which is the default?
10. `[CONCEPT]` `{L2}` What is `acks=0`, `acks=1`, `acks=all`? What are the durability and throughput tradeoffs of each?
11. `[CONCEPT]` `{L2}` What is `min.insync.replicas`? How does it interact with `acks=all`? What happens when ISR shrinks below this value?
12. `[CONCEPT]` `{L2}` What is the ISR (In-Sync Replica) set? What does it mean for a replica to fall out of the ISR?
13. `[DEBUG]` `{L2}` A Kafka topic has `replication.factor=3` and `min.insync.replicas=2`. Two brokers go down. What happens to produces and consumes?
14. `[CONCEPT]` `{L2}` What is an idempotent producer (`enable.idempotence = true`)? What does it prevent? What is the sequence number mechanism?
15. `[CONCEPT]` `{L2}` What is the Kafka transactional API? How does it achieve exactly-once semantics across multiple partitions?
16. `[CODE]` `{L2}` Write Go code to produce a Kafka message with an idempotent producer and handle transient errors.
17. `[CONCEPT]` `{L2}` What is a Kafka transaction? What is `initTransactions()`, `beginTransaction()`, `commitTransaction()`, `abortTransaction()`?
18. `[CONCEPT]` `{L2}` What is `isolation.level = read_committed`? Why must consumers set this when reading from transactional topics?
19. `[CONCEPT]` `{L1}` What is consumer lag? How do you measure it? What does high consumer lag indicate?
20. `[CODE]` `{L2}` Write the shell command to check consumer group lag using `kafka-consumer-groups.sh`.
21. `[CONCEPT]` `{L1}` What is a Kafka retention policy? What are the two types: time-based and size-based?
22. `[CONCEPT]` `{L2}` What is a Kafka log compacted topic? How does it work? What is the difference from a regular topic?
23. `[APPLY]` `{L2}` When would you use a compacted topic vs a regular topic? Give three examples.
24. `[CONCEPT]` `{L2}` What is the partition key in Kafka? How is it used to determine which partition a message goes to?
25. `[DESIGN]` `{L2}` Design the Kafka partitioning strategy for OpenTrace: what is the partition key for spans? Why trace_id and not service_name?
26. `[CONCEPT]` `{L2}` What is a Kafka consumer rebalance? What triggers it? What is the impact on processing during rebalance?
27. `[CONCEPT]` `{L2}` What is a cooperative rebalance (incremental rebalance)? How does it improve on eager rebalance?
28. `[CONCEPT]` `{L2}` What is `session.timeout.ms` vs `heartbeat.interval.ms`? What ratio should they maintain?
29. `[DEBUG]` `{L2}` A Kafka consumer is constantly rebalancing. `heartbeat.interval.ms = 3000`, `session.timeout.ms = 10000`. Processing takes 15 seconds per message. What is the problem and fix?
30. `[CONCEPT]` `{L2}` What is `max.poll.interval.ms`? What happens when processing exceeds it?
31. `[CODE]` `{L2}` Write a Kafka consumer in Go using `confluent-kafka-go` or `franz-go` that processes messages, commits offsets manually, and handles rebalance correctly.
32. `[CONCEPT]` `{L2}` What is `linger.ms` and `batch.size` in a Kafka producer? How do they affect throughput vs latency?
33. `[CONCEPT]` `{L2}` What is sticky partitioning in Kafka producers? How does it improve batching efficiency?
34. `[CONCEPT]` `{L2}` What is `compression.type` in Kafka? Compare `gzip`, `snappy`, `lz4`, `zstd`. Which does OpenTrace use for spans?
35. `[CONCEPT]` `{L2}` What is `fetch.min.bytes` and `fetch.max.wait.ms` in a consumer? How do they affect polling latency?
36. `[DEBUG]` `{L2}` Kafka consumer throughput is 100 msg/sec but the topic receives 10K msg/sec. Consumer lag is growing. What are the investigation steps?
37. `[DESIGN]` `{L2}` OpenTrace receives 10M spans/sec. Each span is ~2KB. Design the Kafka topic: how many partitions, what replication factor, what retention?
38. `[CONCEPT]` `{L2}` What is the `__consumer_offsets` topic? What is stored in it? What happens if it becomes a bottleneck?
39. `[CONCEPT]` `{L2}` What is a Kafka Connect connector? What is a source connector vs sink connector? When do you use Kafka Connect vs writing a custom consumer?
40. `[CONCEPT]` `{L2}` What is Debezium? How does it use PostgreSQL logical replication to produce CDC events to Kafka?
41. `[CODE]` `{L2}` Configure a Debezium connector for the PayCore `transactions` table: publish every INSERT/UPDATE/DELETE as a Kafka event.
42. `[CONCEPT]` `{L2}` What is the schema registry? Why is it important for Kafka-based systems with multiple producers/consumers?
43. `[CONCEPT]` `{L2}` What is Avro vs Protobuf vs JSON for Kafka message serialization? What are the tradeoffs?
44. `[DESIGN]` `{L2}` Design the OpenTrace Kafka topic schema: OTLP Span proto format. How do you handle schema evolution when new span fields are added?
45. `[CONCEPT]` `{L2}` What is a dead letter queue (DLQ) in Kafka? How do you implement it when a consumer fails to process a message after N retries?
46. `[CODE]` `{L2}` Implement a DLQ pattern in Go: after 3 failed attempts, publish the message to a `{topic}.dlq` topic with error metadata.
47. `[CONCEPT]` `{L2}` What is `auto.offset.reset = earliest vs latest`? What is the risk of each when a new consumer group starts?
48. `[APPLY]` `{L2}` How do you replay Kafka messages from a specific offset? What are the two approaches: reset consumer group offset or create a new consumer group?
49. `[CONCEPT]` `{L3}` What is Kafka Streams? What is a KStream vs a KTable? When do you use Kafka Streams vs a regular consumer?
50. `[TRADEOFF]` `{L2}` Kafka vs RabbitMQ vs AWS SQS vs Redis Streams: compare throughput, ordering guarantees, replay capability, operational complexity.

---

## Kafka in the OpenTrace Architecture (Q51–Q80)

51. `[DESIGN]` `{L2}` Draw the OpenTrace message flow: Collector → Kafka → Processor → ClickHouse. What topic? What partition key? What consumer group?
52. `[CODE]` `{L2}` Implement the OpenTrace Collector Kafka producer: batch spans for 500ms, compress with zstd, produce with `acks=all`, handle retries.
53. `[CODE]` `{L2}` Implement the OpenTrace Processor Kafka consumer: consume spans, validate, write to ClickHouse in batches of 10K.
54. `[DEBUG]` `{L2}` OpenTrace Processor's consumer lag is growing at 5K messages/sec. The ClickHouse insert takes 200ms per batch. How do you scale?
55. `[DESIGN]` `{L2}` OpenTrace needs tail-based sampling: decide whether to keep a trace only after all its spans arrive. How do you implement this with Kafka given spans arrive on different partitions?
56. `[CONCEPT]` `{L2}` What is tail-based sampling vs head-based sampling? What is the fundamental challenge of tail-based sampling with Kafka?
57. `[CODE]` `{L2}` Implement the OpenTrace outbox pattern: spans are written to PostgreSQL outbox, a poller publishes to Kafka atomically.
58. `[DEBUG]` `{L2}` OpenTrace loses spans during a Collector crash. The spans were received via gRPC but not yet published to Kafka. What pattern fixes this?
59. `[DESIGN]` `{L2}` OpenTrace multi-tenant isolation: spans from different customers must not mix. How do you achieve this in Kafka: one topic per tenant vs shared topic with filtering?
60. `[APPLY]` `{L2}` Implement exactly-once span ingestion in OpenTrace: a span received twice (retry) must be stored exactly once in ClickHouse.
61. `[DESIGN]` `{L2}` OpenTrace live tail: stream new spans in real-time to WebSocket clients. How does the Processor forward spans to the WebSocket Server via Kafka?
62. `[CODE]` `{L2}` Implement the live tail Kafka consumer: consume from a `spans.realtime` topic, filter by trace_id, forward to WebSocket via Redis pub/sub.
63. `[DEBUG]` `{L3}` OpenTrace Processor is behind by 10M messages. Adding more consumer instances doesn't help. `kafka-consumer-groups.sh` shows all partitions are already assigned. What is wrong?
64. `[DESIGN]` `{L3}` OpenTrace Processor needs to aggregate spans into traces. How do you join spans belonging to the same trace_id if they arrive in different Kafka partitions?
65. `[CONCEPT]` `{L2}` What is the "at-least-once" delivery guarantee when using the outbox pattern? Under what failure scenarios does a span get delivered twice to Kafka?
66. `[CODE]` `{L2}` Implement idempotency at the Kafka consumer level: use span_id as the idempotency key, `INSERT ... ON CONFLICT DO NOTHING` in ClickHouse.
67. `[DEBUG]` `{L2}` OpenTrace Kafka topic has 32 partitions but only 8 consumers. How do you increase parallelism without adding new consumer instances?
68. `[DESIGN]` `{L2}` OpenTrace needs to emit a metric for "spans received per service per minute." Design this using a Kafka consumer that aggregates and writes to Prometheus/ClickHouse.
69. `[CONCEPT]` `{L3}` What is Kafka's log end offset vs high water mark? What does a consumer see relative to each?
70. `[DEBUG]` `{L3}` OpenTrace consumer reads messages but sees lag of 0 on `kafka-consumer-groups.sh`. Yet the Grafana dashboard shows spans missing. What is the discrepancy? (Hint: committed offset vs processed offset)
71. `[DESIGN]` `{L2}` Design the OpenTrace Kafka consumer error handling: transient errors (network timeout) vs permanent errors (invalid span format). How does each route to the DLQ?
72. `[CODE]` `{L2}` Implement circuit breaker pattern in the OpenTrace Processor: if ClickHouse is down, stop consuming from Kafka (let lag build) rather than dropping spans.
73. `[CONCEPT]` `{L2}` Why is "stop consuming from Kafka when downstream is down" the correct approach? Why not use a local buffer?
74. `[DESIGN]` `{L3}` Design the OpenTrace Kafka monitoring: what consumer group metrics do you export? What alerts? What thresholds?
75. `[CODE]` `{L2}` Write a Prometheus exporter in Go that reads Kafka consumer group lag using the Kafka Admin API and exposes it as a gauge metric.
76. `[DESIGN]` `{L2}` OpenTrace spans topic retains data for 7 days. The DLQ retains for 30 days. Design the replay workflow: after fixing a processing bug, replay all spans from last 24 hours.
77. `[CONCEPT]` `{L2}` What is a Kafka consumer group "reset"? What commands do you run to reset offsets to earliest? To a specific timestamp?
78. `[CODE]` `{L2}` Write the kafka-consumer-groups.sh command to reset a consumer group offset to a timestamp (2024-01-15 12:00:00 UTC).
79. `[DEBUG]` `{L3}` After Kafka broker restarts, the OpenTrace Processor takes 5 minutes to recover full throughput. What is the leader election and partition rebalance sequence causing this?
80. `[CONCEPT]` `{L3}` What is "unclean leader election" in Kafka? What is the risk? When would you enable `unclean.leader.election.enable = true`?

---

## Event-Driven Architecture Patterns (Q81–Q120)

81. `[CONCEPT]` `{L1}` What is event-driven architecture? How does it differ from request-response architecture?
82. `[CONCEPT]` `{L1}` What is the outbox pattern? What dual-write problem does it solve?
83. `[CODE]` `{L2}` Implement the transactional outbox for PayCore: within a `BEGIN` transaction, insert into `transactions` AND `outbox_events` tables. A polling worker reads outbox and publishes to Kafka.
84. `[CONCEPT]` `{L2}` What is the polling interval tradeoff for the outbox poller? What is the Debezium CDC alternative? Compare latency and operational complexity.
85. `[CODE]` `{L2}` Implement the outbox poller in Go: `SELECT FOR UPDATE SKIP LOCKED` from outbox, publish to Kafka, DELETE from outbox on success.
86. `[CONCEPT]` `{L1}` What is the Saga pattern? What is a compensating transaction?
87. `[CODE]` `{L2}` Implement the BookWise booking Saga: reserve seat → charge payment → confirm booking. Write compensating transactions for each step.
88. `[CONCEPT]` `{L2}` What is Saga choreography vs orchestration? Draw the sequence for BookWise booking using each approach.
89. `[CODE]` `{L2}` Implement a Saga orchestrator in Go: a state machine with explicit `steps[]`, `compensations[]`, `currentStep int`, and retry logic for each step.
90. `[DEBUG]` `{L2}` A BookWise booking Saga charges the payment but fails to confirm the booking. The compensating transaction also fails. What is the state? How do you handle "stuck" Sagas?
91. `[CONCEPT]` `{L2}` What is event sourcing? What is the event store? How do you reconstruct current state from events?
92. `[CODE]` `{L2}` Implement event sourcing for BookWise bookings: events are `SeatReserved`, `PaymentCharged`, `BookingConfirmed`, `BookingCancelled`. Show the event store schema and state reconstruction.
93. `[CONCEPT]` `{L2}` What is a CQRS (Command Query Responsibility Segregation) architecture? How does it separate the write model from the read model?
94. `[CODE]` `{L2}` Implement CQRS for DungBeetle: write model (PostgreSQL jobs table), read model (Elasticsearch index for job search). Show how events sync the read model.
95. `[CONCEPT]` `{L2}` What is eventual consistency? In a CQRS system, how long does the read model lag behind the write model? What user experience problems does this cause?
96. `[TRADEOFF]` `{L2}` Event sourcing + CQRS vs traditional CRUD: what are the benefits for audit trails? What are the operational costs?
97. `[CONCEPT]` `{L2}` What is an event schema registry? How do you version events in an event-sourced system?
98. `[CODE]` `{L2}` Add a new field `priority` to the `JobCreated` event. Show how you handle old events that don't have this field during replay.
99. `[CONCEPT]` `{L2}` What is an event snapshot? When do you take one? How does it speed up state reconstruction?
100. `[CODE]` `{L2}` Implement event snapshots for DungBeetle jobs: after every 100 events, create a snapshot of the job state. On read, start from the latest snapshot, not event 0.
101. `[CONCEPT]` `{L2}` What is the "at least once" delivery guarantee in an event-driven system? How do you make event handlers idempotent?
102. `[CODE]` `{L2}` Make the BookWise payment charge handler idempotent: use the `booking_id + event_id` as an idempotency key, `INSERT ... ON CONFLICT DO NOTHING` into `processed_events`.
103. `[CONCEPT]` `{L2}` What is a domain event vs an integration event? What is the difference in who consumes them?
104. `[DESIGN]` `{L2}` Design the event schema for OpenTrace: what events does the Collector emit? What does the Processor emit? What does the UI subscribe to?
105. `[CONCEPT]` `{L2}` What is pub/sub messaging? How does Redis pub/sub differ from Kafka for fan-out? What are the tradeoffs?
106. `[CODE]` `{L2}` Implement Redis pub/sub fan-out for BookWise: when a seat becomes available (cancellation), notify all waitlisted users.
107. `[CONCEPT]` `{L2}` What is the fan-out problem? How does Kafka fan-out (multiple consumer groups) differ from Redis pub/sub fan-out?
108. `[DESIGN]` `{L2}` RouteMaster: 100K drivers send GPS updates every 5 seconds. 10K riders are watching their driver's location. Design the fan-out architecture for real-time location updates.
109. `[CONCEPT]` `{L2}` What is SSE (Server-Sent Events)? What is WebSocket? When do you use each for real-time updates?
110. `[CODE]` `{L2}` Implement SSE endpoint in Go: stream BookWise seat availability updates as `text/event-stream`. Handle client reconnect with `Last-Event-ID`.
111. `[CONCEPT]` `{L2}` What is a message ordering guarantee? How does Kafka guarantee ordering within a partition? What breaks ordering?
112. `[DEBUG]` `{L2}` PayCore payment events arrive out of order in the consumer. `debit` arrives after `credit`. What causes this and how do you fix it?
113. `[DESIGN]` `{L2}` DungBeetle job lifecycle events must arrive in order: `created → assigned → started → completed`. Design the Kafka partitioning and consumer group to guarantee ordering.
114. `[CONCEPT]` `{L2}` What is a competing consumers pattern? How does `SELECT FOR UPDATE SKIP LOCKED` implement it in PostgreSQL?
115. `[CODE]` `{L2}` Implement a PostgreSQL-backed job queue for DungBeetle: `SELECT FOR UPDATE SKIP LOCKED WHERE status='pending' ORDER BY priority DESC, created_at ASC LIMIT 1`.
116. `[CONCEPT]` `{L2}` What is exponential backoff with jitter for retry? Implement `base * 2^attempt + random(0, base)`. What is the purpose of jitter?
117. `[CODE]` `{L2}` Write a Go `retry` function with exponential backoff, jitter, max attempts, and context cancellation.
118. `[CONCEPT]` `{L2}` What is the circuit breaker pattern? What states does it have: closed, open, half-open? What triggers each transition?
119. `[CODE]` `{L2}` Implement a circuit breaker in Go that wraps a function call. After 5 consecutive failures, open the circuit for 30 seconds.
120. `[TRADEOFF]` `{L2}` Circuit breaker vs retry: when does a circuit breaker prevent a retry storm? Give the OpenTrace Processor → ClickHouse failure scenario.

---

# PART B — Distributed Locks, Consensus & Leader Election (Q121–Q220)

---

## Distributed Locks (Q121–Q160)

121. `[CONCEPT]` `{L1}` What is a distributed lock? Why is a single-node mutex insufficient in a distributed system?
122. `[CONCEPT]` `{L1}` What are the three properties a correct distributed lock must have: safety (mutual exclusion), liveness (no deadlock), fault tolerance?
123. `[CODE]` `{L1}` Implement a Redis distributed lock in Go: `SET lock:{resource} {token} NX PX {ttlMs}`. Return the token on success, error on failure.
124. `[CODE]` `{L1}` Implement the Lua script for atomic lock release: verify token matches, then DEL. Explain why atomicity is essential.
125. `[DEBUG]` `{L2}` A process holds a distributed lock. The GC pauses the process for 2 seconds. The lock TTL is 1 second. The lock expires. Another process acquires the lock. The GC-paused process wakes up and proceeds. What went wrong?
126. `[CONCEPT]` `{L2}` What is a fencing token? How does it prevent the "expired lock, stale operation" problem?
127. `[CODE]` `{L2}` Implement fencing tokens in the BookWise distributed lock service: `INCR lock:fence:{resource}` returns the token. The booking DB checks that the token > last_seen_token before writing.
128. `[CODE]` `{L2}` Implement the BookWise booking with fencing: lock → get token → attempt booking with token in SQL → DB rejects if token is stale.
129. `[CONCEPT]` `{L2}` What is lock renewal (watchdog)? How does the DungBeetle lock service implement automatic TTL extension while the job is running?
130. `[CODE]` `{L2}` Implement a watchdog goroutine in Go: renew the lock TTL every 1/3 of the TTL period, stop automatically if the lock holder goroutine finishes.
131. `[CONCEPT]` `{L2}` What is Redlock? What is the algorithm? What does it solve vs single-Redis locking?
132. `[CONCEPT]` `{L2}` What are the known weaknesses of Redlock (as critiqued by Martin Kleppmann)? What does the "async network model" problem mean?
133. `[TRADEOFF]` `{L2}` Redis distributed lock vs PostgreSQL advisory lock vs ZooKeeper lock: compare failure modes, correctness guarantees, and operational overhead.
134. `[CODE]` `{L2}` Implement a PostgreSQL advisory lock: `pg_advisory_xact_lock(hashtext('booking:' || seat_id))`. When does it release? What is the advantage over Redis for this use case?
135. `[DEBUG]` `{L2}` The distributed lock service from Biweekly Project 7 is experiencing lock starvation: one process keeps acquiring the lock before others can. What is the cause and fix?
136. `[DESIGN]` `{L2}` Design the BookWise distributed lock service API: `POST /locks/{resource}` (acquire), `DELETE /locks/{resource}` (release), `PATCH /locks/{resource}` (renew). What HTTP status codes?
137. `[CODE]` `{L2}` Implement the `PATCH /locks/{resource}` renewal endpoint: verify the caller's token matches, extend TTL, return 404 if lock expired.
138. `[CONCEPT]` `{L2}` What is lock timeout vs lock TTL? What is the difference between how long you wait to acquire vs how long you hold it?
139. `[DEBUG]` `{L2}` BookWise has a deadlock: two processes each hold a lock and wait for the other's lock. How do you detect and resolve it?
140. `[DESIGN]` `{L2}` Design a lock hierarchy for BookWise: to book a multi-seat package, you must lock seat A and seat B. How do you prevent deadlocks?
141. `[CONCEPT]` `{L3}` What is the CRDT (Conflict-free Replicated Data Type) alternative to distributed locks? When can you use CRDTs to avoid locks entirely?
142. `[CODE]` `{L2}` Implement a test for the distributed lock service: spawn 100 goroutines, each tries to acquire the same lock, assert exactly 1 succeeds at a time.
143. `[CONCEPT]` `{L2}` What is a deadlock detection algorithm? How does PostgreSQL detect deadlocks? How does the DungBeetle lock service detect them?
144. `[DEBUG]` `{L3}` The distributed lock service has a `DELETE /locks/{resource}` endpoint. A process crashes without releasing the lock. The TTL will eventually expire. But the next process waits unnecessarily. How do you reduce wait time with a heartbeat mechanism?
145. `[DESIGN]` `{L2}` DungBeetle leader election: only one instance should run the partition assignment scheduler at a time. How do you implement leader election using the distributed lock service?
146. `[CODE]` `{L2}` Implement DungBeetle leader election: `try_acquire_leader_lock()` every 5 seconds. If acquired, run the scheduler. If lost (lock expires), step down.
147. `[CONCEPT]` `{L2}` What is split-brain in distributed leader election? How do you test for it? What is the "two generals problem" relevance?
148. `[CODE]` `{L2}` Write a test for split-brain: pause the leader process, verify a new leader is elected, resume the old leader, verify it does NOT act as leader.
149. `[TRADEOFF]` `{L2}` Redis-based leader election vs etcd vs ZooKeeper vs Consul: compare consensus guarantees, operational complexity, and latency.
150. `[CONCEPT]` `{L3}` Why does Redis-based leader election NOT provide the same correctness guarantee as etcd/ZooKeeper (which use Raft consensus)? What failure scenario does Redis not handle?
151. `[DESIGN]` `{L2}` OpenTrace has 3 instances of the Collector. Only one should run the TTL-based span eviction job at a time. Implement leader election using the distributed lock service.
152. `[CONCEPT]` `{L2}` What is the "thundering herd" problem for distributed locks? 1000 processes waiting for a lock release. When it releases, all 1000 try to acquire simultaneously. How do you mitigate?
153. `[CODE]` `{L3}` Implement lock acquisition with random jitter backoff: instead of all retrying immediately, add `random(0, 100ms)` delay to spread retries.
154. `[CONCEPT]` `{L2}` What is a fair lock (FIFO ordering)? Can Redis `SET NX` implement a fair lock? How would you implement it with a Redis List?
155. `[CODE]` `{L3}` Implement a fair distributed lock using Redis List: `RPUSH lock:queue {token}`, poll `LINDEX lock:queue 0` to check if you're first.
156. `[CONCEPT]` `{L2}` What is a shared lock (read lock) vs exclusive lock (write lock) in distributed systems? How does BookWise use read locks for availability queries?
157. `[TRADEOFF]` `{L3}` Optimistic locking (version number) vs pessimistic locking (distributed lock): when does each win for BookWise seat booking under different concurrency levels?
158. `[DESIGN]` `{L3}` Design a lock-free seat booking system using PostgreSQL's atomic `UPDATE ... WHERE count > 0 RETURNING count`. When does this outperform distributed locks?
159. `[CODE]` `{L2}` Implement the atomic seat decrement pattern: `UPDATE seats SET available = available - 1 WHERE id = $1 AND available > 0`. Handle the 0-rows-updated case.
160. `[CONCEPT]` `{L2}` What is the fencing token invariant: "a resource must reject writes with a token older than the last accepted token." Write the SQL that enforces this.

---

## Consensus & Leader Election (Q161–Q200)

161. `[CONCEPT]` `{L1}` What is the consensus problem in distributed systems? Why is it hard?
162. `[CONCEPT]` `{L1}` What is the CAP theorem? Can you have all three: Consistency, Availability, Partition Tolerance?
163. `[CONCEPT]` `{L2}` Give a concrete example of a CP system and an AP system. How do their behaviors differ during a network partition?
164. `[CONCEPT]` `{L2}` What is the PACELC theorem? How does it extend CAP to include latency tradeoffs?
165. `[CONCEPT]` `{L2}` What is the Raft consensus algorithm? What problem does it solve? What are the three roles a node can have?
166. `[CONCEPT]` `{L2}` Describe the Raft leader election process: what triggers an election, how does voting work, what is a term?
167. `[CONCEPT]` `{L2}` What is a split-brain in Raft? How does the majority quorum prevent two leaders?
168. `[CONCEPT]` `{L2}` What is Raft log replication? How does a leader ensure its log is replicated before committing an entry?
169. `[CONCEPT]` `{L2}` What is the difference between a committed entry and an applied entry in Raft?
170. `[CONCEPT]` `{L3}` What is Raft log compaction (snapshots)? Why is it necessary? How does it interact with log replay?
171. `[CONCEPT]` `{L2}` What is etcd? What problem does it solve? What is its data model?
172. `[CODE]` `{L2}` Implement leader election using etcd: use `etcd.Grant(TTL)`, `etcd.Campaign(key, value)`, watch for leader changes.
173. `[CONCEPT]` `{L2}` What is ZooKeeper? What is a znode? What is an ephemeral znode? How is it used for leader election?
174. `[CONCEPT]` `{L2}` What is the gossip protocol? How does Consul use it for cluster membership? How does it propagate state?
175. `[CONCEPT]` `{L2}` What is Patroni? How does it use etcd/Consul for automatic PostgreSQL failover?
176. `[CODE]` `{L2}` Describe the DungBeetle leader election Patroni-style: one instance holds the `/dung-beetle/leader` key in etcd with a 15s TTL, renews every 5s, others watch for changes.
177. `[CONCEPT]` `{L2}` What is a heartbeat in distributed systems? What is the relationship between heartbeat interval and failure detection time?
178. `[DESIGN]` `{L2}` DungBeetle has 5 scheduler instances. Leader election via etcd. The leader crashes. How long until a new leader is elected? Walk through the exact sequence.
179. `[CONCEPT]` `{L2}` What is the "split-brain" scenario for PostgreSQL primary-replica? How does Patroni prevent it using a fencing mechanism?
180. `[CONCEPT]` `{L2}` What is STONITH (Shoot The Other Node In The Head)? Why is it used in HA clusters?
181. `[CONCEPT]` `{L3}` What is Paxos? How does it compare to Raft? Why is Raft considered easier to implement correctly?
182. `[CONCEPT]` `{L2}` What is vector clocks? What problem do they solve that wall-clock timestamps don't?
183. `[CONCEPT]` `{L2}` What is a Lamport timestamp? How does it establish "happens-before" ordering across distributed systems?
184. `[CONCEPT]` `{L2}` What is a network partition? How does your system behave when the partition heals? What is reconciliation?
185. `[CONCEPT]` `{L2}` What is the two generals problem? Why does it prove that perfectly reliable communication over unreliable networks is impossible?
186. `[CONCEPT]` `{L2}` What are the "fallacies of distributed computing"? List all eight.
187. `[CONCEPT]` `{L2}` What is the difference between a fail-stop failure and a Byzantine failure? Which does Raft handle?
188. `[CONCEPT]` `{L2}` What is a quorum? For a cluster of N nodes, what is the minimum quorum size for availability vs consistency guarantees?
189. `[DESIGN]` `{L2}` OpenTrace has 3 Collector instances behind a load balancer. The load balancer crashes. What happens to span ingestion? What is the SPOF?
190. `[CONCEPT]` `{L2}` What is an "epoch" in distributed systems? How do Kafka partition leaders and etcd terms use epochs to prevent stale leaders?
191. `[CONCEPT]` `{L3}` What is the PBFT (Practical Byzantine Fault Tolerance) algorithm? When is it used vs Raft?
192. `[DESIGN]` `{L2}` DungBeetle needs partition assignment: assign job partitions to worker groups. How do you implement distributed partition assignment without a central coordinator?
193. `[CONCEPT]` `{L3}` What is a distributed snapshot (Chandy-Lamport algorithm)? When is it needed?
194. `[CONCEPT]` `{L2}` What is a distributed transaction (2PC)? What is the coordinator failure problem? Why is it considered an anti-pattern at scale?
195. `[TRADEOFF]` `{L2}` 2PC vs Saga for distributed transactions: compare consistency guarantees, failure handling, and operational complexity. When does Saga replace 2PC?
196. `[CONCEPT]` `{L2}` What is "eventual consistency"? What user-visible problems does it cause? When is it acceptable?
197. `[CONCEPT]` `{L2}` What is strong consistency? What is read-your-writes consistency? What is monotonic read consistency? Which does your PostgreSQL setup provide?
198. `[CONCEPT]` `{L2}` What is a distributed ID generator? What is Twitter Snowflake? What are the 64 bits: timestamp, machine ID, sequence?
199. `[CODE]` `{L2}` Implement a Snowflake ID generator in Go: 41 bits timestamp, 10 bits machine ID, 12 bits sequence. Handle clock drift.
200. `[APPLY]` `{L2}` OpenTrace uses UUID v7 for trace IDs (time-ordered). DungBeetle uses Snowflake IDs for job IDs. BookWise uses sequential PostgreSQL SERIAL. Justify each choice.

---

## Consistent Hashing & Distributed Routing (Q201–Q240)

201. `[CONCEPT]` `{L1}` What is consistent hashing? What problem does it solve vs simple modulo hashing?
202. `[CONCEPT]` `{L1}` When you add a node to a consistent hash ring, what fraction of keys are remapped? Compare to modulo hashing.
203. `[CONCEPT]` `{L2}` What is a virtual node (vnode) in consistent hashing? How does it improve load distribution?
204. `[CODE]` `{L2}` Implement consistent hashing in Go: a ring with `Add(node)`, `Remove(node)`, `GetNode(key)`. Use virtual nodes.
205. `[CONCEPT]` `{L2}` What is the "rendezvous hashing" alternative to consistent hashing? When is it simpler to implement?
206. `[APPLY]` `{L2}` DungBeetle uses consistent hashing to route jobs to worker groups. Add a new worker group. What fraction of jobs reroute?
207. `[DESIGN]` `{L2}` RouteMaster has 10 map tile servers. Cache requests are routed by consistent hashing on tile_key. How do you handle a server going down?
208. `[CONCEPT]` `{L2}` What is a hot spot in consistent hashing? Why does it happen even with virtual nodes? How does skewed key distribution cause it?
209. `[DESIGN]` `{L2}` OpenTrace Kafka has 32 partitions. The Processor scales from 4 to 8 instances. How does Kafka's partition rebalance relate to consistent hashing?
210. `[CONCEPT]` `{L2}` What is DynamoDB's consistent hashing implementation? How does it differ from Cassandra's Vnodes approach?
211. `[TRADEOFF]` `{L2}` Consistent hashing vs range-based sharding: what queries are easier with range-based? What is the hot spot risk with each?
212. `[CODE]` `{L2}` Test your consistent hashing implementation: add 3 nodes, hash 10K keys, remove 1 node, verify that only ~33% of keys reroute.
213. `[CONCEPT]` `{L2}` What is "chord" DHT? How does it enable O(log n) routing in a peer-to-peer network?
214. `[DESIGN]` `{L2}` Design DungBeetle's consistent hashing-based job routing: tenant_id → shard → worker group. How do you handle worker group failures?
215. `[CONCEPT]` `{L2}` What is a sticky session vs stateless routing? When does consistent hashing implement sticky sessions?
216. `[APPLY]` `{L2}` BookWise has 8 cache shards. A user repeatedly requests the same venue's availability. Consistent hashing routes all requests for that venue to the same cache shard. What is the benefit vs round-robin?
217. `[DEBUG]` `{L2}` Consistent hashing is used for caching. A new cache node is added. A 10-minute thundering herd occurs as cache misses spike. How do you prevent this?
218. `[CONCEPT]` `{L3}` What is geospatial consistent hashing? How does RouteMaster route driver GPS updates to the nearest processing node?
219. `[CODE]` `{L2}` Implement a consistent hash router for OpenTrace: route trace_id to one of 8 processor instances. Verify that all spans for the same trace go to the same processor.
220. `[DESIGN]` `{L3}` Design a zero-downtime resharding strategy: increase OpenTrace's Kafka partitions from 32 to 64. What is the impact on consumer groups? Is it possible without downtime?

---

## Bloom Filters, Probabilistic Structures & Rate Limiting (Q221–Q260)

221. `[CONCEPT]` `{L1}` What is a Bloom filter? What two operations does it support? What type of false answers can it give?
222. `[CONCEPT]` `{L1}` What is the false positive rate of a Bloom filter? What parameters affect it: m (bits), n (elements), k (hash functions)?
223. `[CODE]` `{L2}` Implement a Bloom filter in Go with `k` hash functions. Implement `Add(item)` and `Contains(item)`.
224. `[APPLY]` `{L2}` OpenTrace Processor: before querying ClickHouse to check if a trace_id exists, consult a Bloom filter. Why does this reduce DB load for missing trace IDs?
225. `[APPLY]` `{L2}` DungBeetle: use a Bloom filter to check if a job_id has already been processed (deduplication). What false positive rate is acceptable?
226. `[CONCEPT]` `{L2}` What is a Counting Bloom filter? What operation does it add that a standard Bloom filter doesn't support?
227. `[CONCEPT]` `{L2}` What is a Cuckoo filter? How does it compare to a Bloom filter for deletion support and space efficiency?
228. `[CONCEPT]` `{L2}` What is HyperLogLog? What cardinality estimation problem does it solve? What is its space complexity vs a hash set?
229. `[CODE]` `{L2}` Use Redis HyperLogLog to count unique user sessions per hour for OpenTrace with O(1) memory.
230. `[CONCEPT]` `{L2}` What is a Count-Min Sketch? What query does it answer? How does it differ from HyperLogLog?
231. `[CODE]` `{L2}` Implement a Count-Min Sketch in Go: `Add(key)`, `Count(key)`. Use it to estimate the most frequent service names in OpenTrace.
232. `[CONCEPT]` `{L2}` What is a sliding window rate limiter? How does a Sorted Set implement it in Redis?
233. `[CODE]` `{L2}` Implement sliding window rate limiting in Redis: `ZADD`, `ZREMRANGEBYSCORE`, `ZCOUNT` in a Lua script. 100 requests per minute.
234. `[CONCEPT]` `{L2}` What is a token bucket rate limiter? How does it differ from a sliding window? What is burst capacity?
235. `[CODE]` `{L2}` Implement a token bucket rate limiter in Go using a goroutine that refills the bucket at a fixed rate.
236. `[CONCEPT]` `{L2}` What is the leaky bucket algorithm? How is it different from token bucket for handling bursts?
237. `[CODE]` `{L2}` Implement a distributed rate limiter for the OTP gateway: max 5 OTP requests per user per minute using Redis Lua atomic script.
238. `[CONCEPT]` `{L2}` What is a fixed window rate limiter? What is the boundary spike problem? At what time boundary does it cause a 2x burst?
239. `[DESIGN]` `{L2}` BookWise booking API: rate limit per user (5 bookings/min), per venue (1000 bookings/min), per IP (100 requests/min). Design the multi-level rate limiting.
240. `[TRADEOFF]` `{L2}` Redis rate limiter vs API gateway rate limiter (Kong/Nginx): what are the tradeoffs for a 10-service microservice system?

---

## Distributed System Design Patterns (Q241–Q260)

241. `[CONCEPT]` `{L2}` What is the bulkhead pattern? How does it prevent a failing downstream service from exhausting all thread pool capacity?
242. `[CODE]` `{L2}` Implement a bulkhead in Go: separate goroutine pools for ClickHouse writes vs PostgreSQL reads. Limit ClickHouse pool to 50 goroutines.
243. `[CONCEPT]` `{L2}` What is the timeout pattern? What is the "cascade timeout" problem? How do you set per-service timeouts in a call chain?
244. `[CODE]` `{L2}` Implement cascading context timeouts: API handler has 5s total budget. Calls Service B with 2s timeout. Service B calls DB with 1s timeout. Show the context propagation.
245. `[CONCEPT]` `{L2}` What is service mesh? What does Istio/Linkerd add to inter-service communication (mTLS, retries, tracing)?
246. `[CONCEPT]` `{L2}` What is sidecar proxy pattern? How does Envoy implement mTLS and distributed tracing as a sidecar?
247. `[CONCEPT]` `{L2}` What is service discovery? Compare DNS-based vs etcd-based vs Consul-based discovery.
248. `[DESIGN]` `{L2}` OpenTrace 7 components need to discover each other in Kubernetes. How do Kubernetes Services and DNS enable service discovery without etcd?
249. `[CONCEPT]` `{L2}` What is a "saga log"? How does a DungBeetle saga orchestrator persist its state so it can resume after a crash?
250. `[CODE]` `{L2}` Implement saga state persistence in PostgreSQL: `CREATE TABLE saga_instances (saga_id UUID, current_step INT, state JSONB, created_at TIMESTAMPTZ)`. Show the update-on-each-step pattern.
251. `[CONCEPT]` `{L2}` What is an anti-corruption layer (ACL)? When is it needed between two services with different domain models?
252. `[CONCEPT]` `{L2}` What is the strangler fig pattern? How is it used for migrating a monolith to microservices?
253. `[APPLY]` `{L2}` DungBeetle started as a monolith. Describe how to extract the notification sending into a microservice using the strangler fig pattern without breaking existing clients.
254. `[CONCEPT]` `{L2}` What is the sidecar pattern vs the ambassador pattern? Give a use case for each.
255. `[CONCEPT]` `{L2}` What is a write-ahead log (WAL) at the distributed systems level? How does it apply to Kafka and etcd, not just databases?
256. `[CONCEPT]` `{L3}` What is the "two-phase locking" protocol? How does it differ from "two-phase commit"?
257. `[CONCEPT]` `{L3}` What is the Omega concurrency control algorithm? When is it used?
258. `[DESIGN]` `{L2}` Design a distributed ID allocation service for OpenTrace: multiple Collector instances need globally unique trace IDs. How do you avoid coordination per-ID?
259. `[CONCEPT]` `{L2}` What is "cell architecture" in distributed systems (used by Netflix, GitHub)? How does it provide blast radius isolation?
260. `[DESIGN]` `{L3}` Design OpenTrace for 10x scale: 100M spans/sec. What components need to scale? What architectural changes are required beyond "add more instances"?

---

# PART C — Real-Time Systems: WebSockets, SSE, Presence (Q261–Q330)

---

## WebSockets (Q261–Q300)

261. `[CONCEPT]` `{L1}` What is a WebSocket? What is the HTTP upgrade handshake? What port does WebSocket use?
262. `[CONCEPT]` `{L1}` What is the WebSocket frame format? What is a control frame vs data frame? What is a ping/pong?
263. `[CODE]` `{L2}` Implement a WebSocket echo server in Go using `gorilla/websocket`: accept connection, read messages, write back, handle close.
264. `[CODE]` `{L2}` Implement WebSocket ping/pong keepalive: set `SetPingHandler`, send server-side pings every 30 seconds, close connection if no pong in 10 seconds.
265. `[DESIGN]` `{L2}` OpenTrace live tail: a client connects via WebSocket and receives new spans in real-time for a given trace_id. How does the server route Kafka messages to the correct WebSocket connection?
266. `[CODE]` `{L2}` Implement the WebSocket connection registry in Go: `sync.Map` keyed by `traceID`, value is a channel. Fan-out incoming spans to registered watchers.
267. `[CONCEPT]` `{L2}` What is a WebSocket "room"? How does DungBeetle's chat feature route messages to all connections in a room?
268. `[CODE]` `{L2}` Implement Redis pub/sub fan-out for WebSocket: when a message arrives on any server, publish to Redis channel. Each server subscribes and broadcasts to local connections.
269. `[DEBUG]` `{L2}` OpenTrace WebSocket server has 10K connections. Memory is 2GB. Each connection uses ~200KB. What is consuming the memory? How do you reduce per-connection overhead?
270. `[DESIGN]` `{L2}` Scale OpenTrace live tail to 100K concurrent WebSocket connections. How do you distribute connections across multiple server instances?
271. `[CODE]` `{L2}` Implement graceful WebSocket server shutdown: stop accepting new connections, send close frame to all existing connections, wait for all to close with a 10s timeout.
272. `[CONCEPT]` `{L2}` What is `SO_REUSEPORT`? How does it enable multiple goroutines to accept WebSocket connections on the same port?
273. `[DEBUG]` `{L2}` A WebSocket connection drops after 60 seconds of inactivity. The client reports no data was received. What infrastructure component is causing this?
274. `[CONCEPT]` `{L2}` What is the difference between WebSocket binary frames vs text frames? When does OpenTrace use binary (Protobuf spans)?
275. `[CODE]` `{L2}` Implement WebSocket authentication: validate JWT on the upgrade request (HTTP headers), reject connection with 401 if invalid.
276. `[CONCEPT]` `{L2}` What is the maximum number of concurrent WebSocket connections limited by on a Linux server? What is the file descriptor limit? How do you increase it?
277. `[DEBUG]` `{L2}` OpenTrace WebSocket server panics with `too many open files` at 65536 connections. How do you diagnose and fix this?
278. `[CODE]` `{L2}` Implement a WebSocket message rate limiter per connection: if a client sends more than 100 messages/second, close the connection.
279. `[CONCEPT]` `{L3}` What is `epoll` and how does it enable one goroutine to handle 100K concurrent WebSocket connections?
280. `[TRADEOFF]` `{L2}` WebSocket vs SSE vs Long Polling for OpenTrace live tail: compare latency, browser support, server resource usage, and reconnect behavior.
281. `[CODE]` `{L2}` Implement connection backpressure for WebSocket: if a client's message channel is full (slow consumer), drop messages rather than blocking the producer.
282. `[DESIGN]` `{L2}` RouteMaster: 100K drivers send GPS every 5 seconds. 10K riders watch their driver. How do you avoid 100K * 10K = 1B fanout operations?
283. `[CONCEPT]` `{L3}` What is WebTransport? How does it use HTTP/3 QUIC streams to improve over WebSocket?
284. `[DEBUG]` `{L2}` A WebSocket connection to OpenTrace live tail stops receiving messages after a network hiccup, but doesn't disconnect. What is the client-side reconnect strategy?
285. `[CODE]` `{L2}` Implement client-side WebSocket reconnect with exponential backoff: on close, wait 1s, 2s, 4s, 8s (max 30s) before reconnecting.
286. `[CONCEPT]` `{L2}` What is a WebSocket subprotocol? How does OpenTrace negotiate the `otlp-websocket` subprotocol?
287. `[DESIGN]` `{L2}` OpenTrace has 3 WebSocket server instances behind a load balancer. A client connects to instance 1. A span arrives on instance 2 via Kafka. How does the span reach the client on instance 1?
288. `[CODE]` `{L2}` Implement the cross-instance fan-out: OpenTrace Processor publishes to `realtime:{traceID}` Redis channel. WebSocket server 1 and 2 both subscribe. Each server broadcasts to local connections watching that traceID.
289. `[CONCEPT]` `{L3}` What is the C10K problem? How did event-loop architectures (Node.js, Go goroutines) solve it?
290. `[CONCEPT]` `{L2}` What is `gorilla/websocket` vs `nhooyr.io/websocket` vs `gobwas/ws`? Compare their API design and performance for high-concurrency use cases.
291. `[CODE]` `{L3}` Implement a WebSocket server using raw `net.Conn` without a WebSocket library to understand the upgrade handshake and frame parsing at the protocol level.
292. `[DESIGN]` `{L2}` BookWise seat map: show live seat availability changes as other users book. Design the WebSocket + Redis pub/sub architecture.
293. `[CONCEPT]` `{L2}` What is WebSocket compression (`permessage-deflate`)? When does it help? When does it hurt?
294. `[DEBUG]` `{L2}` A load balancer terminates WebSocket connections after 60s. You cannot change the load balancer. How do you keep connections alive?
295. `[CODE]` `{L2}` Implement server-side WebSocket keepalive: send a ping frame every 25 seconds to prevent idle connection termination by load balancers/proxies.
296. `[CONCEPT]` `{L2}` What is `Sec-WebSocket-Key`/`Sec-WebSocket-Accept` in the HTTP upgrade handshake? What does the SHA-1 computation verify?
297. `[CODE]` `{L2}` Write a load test using k6 for OpenTrace WebSocket: 1000 concurrent connections, each subscribing to 10 trace IDs. Measure p99 message delivery latency.
298. `[DESIGN]` `{L2}` Design the OpenTrace live tail API: `ws://openTrace:8080/v1/live?trace_id=abc` — what auth, what message format, what does the server send when no spans arrive for 30s (heartbeat)?
299. `[CONCEPT]` `{L3}` What is gRPC streaming vs WebSocket for bidirectional real-time communication? When does gRPC bidirectional streaming replace WebSocket?
300. `[TRADEOFF]` `{L2}` gRPC server streaming vs WebSocket for OpenTrace live tail: compare protocol overhead, browser support, load balancer compatibility.

---

## SSE & Presence (Q301–Q330)

301. `[CONCEPT]` `{L1}` What is SSE (Server-Sent Events)? What HTTP Content-Type does it use? What is the format of an SSE message?
302. `[CONCEPT]` `{L1}` What is the difference between SSE and WebSocket? When do you choose SSE over WebSocket?
303. `[CODE]` `{L2}` Implement an SSE endpoint in Go: `Content-Type: text/event-stream`, write `data: {json}\n\n`, flush immediately.
304. `[CONCEPT]` `{L2}` What is `Last-Event-ID` in SSE? How does the client send it on reconnect? How does the server use it to replay missed events?
305. `[CODE]` `{L2}` Implement SSE with `Last-Event-ID` replay for BookWise seat availability: client reconnects, server resends all events with ID > last_received.
306. `[CONCEPT]` `{L2}` What is SSE auto-reconnect? What is the `retry:` field? How long before the browser reconnects by default?
307. `[CODE]` `{L2}` Implement an SSE stream for PayCore transaction status: stream `pending → processing → completed` transitions in real-time.
308. `[CONCEPT]` `{L2}` What is the difference between SSE and polling? At what polling frequency does SSE become more efficient?
309. `[CODE]` `{L2}` Implement SSE + Redis pub/sub: subscribe to `booking:{bookingId}:events` Redis channel, forward each message to the SSE stream.
310. `[CONCEPT]` `{L2}` What is server-sent events' browser connection limit? How many SSE connections can a browser open per domain (HTTP/1.1 vs HTTP/2)?
311. `[DEBUG]` `{L2}` BookWise SSE seat updates stop after 6 connections in the same browser. Why? What is the HTTP/1.1 connection limit and how does HTTP/2 fix it?
312. `[CONCEPT]` `{L2}` What is distributed presence? What is the heartbeat protocol? What is TTL-based expiry for presence?
313. `[CODE]` `{L2}` Implement distributed presence for DungBeetle workers: `HSET presence:{workerId} last_seen {ts} status online`, TTL 60s, heartbeat every 30s.
314. `[CODE]` `{L2}` Implement presence expiry detection: a background goroutine every 30s scans for `presence:*` keys, marks workers with `last_seen > 60s ago` as offline.
315. `[DESIGN]` `{L2}` OpenTrace live tail presence: show which users are currently watching each trace. Design the presence data model in Redis.
316. `[CODE]` `{L2}` Implement BookWise "who else is viewing this event" presence: `SADD viewers:{eventId} {userId}` with a 60s TTL, show count in real-time via SSE.
317. `[CONCEPT]` `{L2}` What is a webhook? How does it differ from SSE and WebSocket for delivering events to third-party systems?
318. `[CODE]` `{L2}` Implement webhook delivery for BookWise: on booking confirmation, POST to the configured webhook URL with an HMAC-SHA256 signature header.
319. `[CODE]` `{L2}` Implement webhook signature verification: `HMAC-SHA256(secret, body)`, compare using `hmac.Equal` (timing-safe). Why must you use timing-safe comparison?
320. `[DESIGN]` `{L2}` Design the webhook retry system for the notification service: exponential backoff, DLQ after 3 failures, webhook health check to stop retrying dead endpoints.
321. `[CODE]` `{L2}` Implement the notification service webhook poller: fetch pending webhooks from PostgreSQL (SKIP LOCKED), deliver, update status, exponential backoff on failure.
322. `[CONCEPT]` `{L2}` What is `long polling`? How does it differ from regular polling and SSE? In what scenarios is it still used?
323. `[CODE]` `{L2}` Implement a long-polling endpoint in Go: hold the request open for up to 30 seconds, respond immediately when new data arrives or with 204 after timeout.
324. `[CONCEPT]` `{L2}` What is HTTP/2 server push? Why did it largely fail in practice? How does SSE over HTTP/2 multiplexing differ from HTTP/2 server push?
325. `[DEBUG]` `{L2}` SSE connections drop after 1 minute when using an AWS ALB. What is the ALB idle timeout setting? How do you configure SSE keepalives to prevent it?
326. `[CODE]` `{L2}` Implement SSE heartbeat comments: every 15 seconds, write `: heartbeat\n\n` (an SSE comment) to keep the connection alive through load balancers.
327. `[DESIGN]` `{L2}` RouteMaster real-time driver tracking: 100K drivers, 1K active rides. Each rider watches their driver. Design SSE endpoint for driver location updates. How often do you push updates?
328. `[CONCEPT]` `{L3}` What is gRPC unary vs server streaming vs client streaming vs bidirectional streaming? Map OpenTrace's use cases to each pattern.
329. `[CODE]` `{L2}` Implement gRPC server streaming for OpenTrace live tail: `rpc WatchTrace(WatchRequest) returns (stream Span)`. Compare to WebSocket implementation.
330. `[TRADEOFF]` `{L2}` WebSocket vs SSE vs gRPC streaming for OpenTrace live tail: compare by: browser compatibility, proxy/CDN compatibility, bidirectionality need, frame overhead.

---

# PART D — Observability, Security & Production Patterns (Q331–Q430)

---

## Observability (Q331–Q380)

331. `[CONCEPT]` `{L1}` What are the three pillars of observability? Define metrics, logs, and traces.
332. `[CONCEPT]` `{L1}` What is OpenTelemetry? What are the three signals it standardizes?
333. `[CONCEPT]` `{L1}` What is a distributed trace? What is a trace ID, span ID, parent span ID?
334. `[CONCEPT]` `{L2}` What is a span? What fields does an OTLP span contain: trace_id, span_id, parent_span_id, service_name, operation_name, start_time, end_time, status, attributes?
335. `[CODE]` `{L2}` Instrument a Go HTTP handler with OpenTelemetry: create a span, add attributes, record errors, propagate trace context to downstream calls.
336. `[CODE]` `{L2}` Implement trace context propagation in Go: extract trace context from incoming HTTP headers (`traceparent`), create child span, inject context into outgoing calls.
337. `[CONCEPT]` `{L2}` What is the W3C `traceparent` header format? What are the four fields: version, trace-id, parent-id, trace-flags?
338. `[CODE]` `{L2}` Configure the OpenTelemetry SDK in Go to export spans to OpenTrace Collector via OTLP/gRPC: `WithGRPCExporter`, batch processor settings.
339. `[CONCEPT]` `{L2}` What is a trace sampling strategy? What is head-based sampling vs tail-based sampling? What are the tradeoffs?
340. `[DESIGN]` `{L2}` OpenTrace uses tail-based sampling: collect all spans, decide to keep/drop the trace only after all spans arrive. Design the buffering and decision logic.
341. `[CONCEPT]` `{L2}` What is p50, p95, p99 latency? Why is p99 more important than average for production alerting?
342. `[CONCEPT]` `{L2}` What is the RED method for service metrics: Rate, Errors, Duration? What Prometheus metrics implement it?
343. `[CODE]` `{L2}` Instrument OpenTrace Collector with RED metrics: `spans_received_total` (counter), `spans_error_total` (counter), `span_processing_duration_seconds` (histogram).
344. `[CODE]` `{L2}` Write the PromQL query for OpenTrace Collector's p99 span processing latency: `histogram_quantile(0.99, rate(span_processing_duration_seconds_bucket[5m]))`.
345. `[CODE]` `{L2}` Write a Prometheus alerting rule: fire `SpanIngestionLag` if consumer lag > 100K for 5 minutes.
346. `[CONCEPT]` `{L2}` What is a Prometheus histogram vs summary? When do you use each? Why is histogram preferred for distributed systems?
347. `[CONCEPT]` `{L2}` What is a Prometheus counter vs gauge vs histogram vs summary? Give an example of each for OpenTrace.
348. `[CODE]` `{L2}` Write the Go code to register a custom Prometheus histogram for ClickHouse insert batch size in OpenTrace.
349. `[CONCEPT]` `{L2}` What is `slog` in Go? How do you emit structured JSON logs with `trace_id` on every line?
350. `[CODE]` `{L2}` Configure `slog` in OpenTrace Collector: JSON format, include `trace_id`, `service`, `environment` on every log line using `slog.With()`.
351. `[CONCEPT]` `{L2}` What is the correlation between a trace and its logs? How do you query logs by trace_id in Grafana?
352. `[CODE]` `{L2}` Write a Grafana query to correlate OpenTrace spans with PostgreSQL slow query logs: given trace_id, find all SQL queries that ran during the trace.
353. `[CONCEPT]` `{L2}` What is an SLO (Service Level Objective)? What is an SLI (Service Level Indicator)? What is an SLA?
354. `[DESIGN]` `{L2}` Define SLOs for OpenTrace: span ingestion availability 99.9%, query p99 < 200ms, collector p99 < 5ms. Write the Prometheus alerting rules.
355. `[CONCEPT]` `{L2}` What is an error budget? If your SLO is 99.9% availability, how many minutes of downtime are allowed per month?
356. `[CONCEPT]` `{L2}` What is a burn rate alert? How does it catch SLO violations earlier than threshold alerts?
357. `[CODE]` `{L2}` Write a multi-window burn rate alert for OpenTrace: fire if error rate burns through the error budget at 5x speed over 1 hour.
358. `[CONCEPT]` `{L2}` What is a flame graph? What does the x-axis represent? What does a wide bar mean?
359. `[CODE]` `{L2}` Generate a pprof CPU profile of the OpenTrace Processor in Go: `go tool pprof`, identify the hottest function, interpret the flame graph.
360. `[CONCEPT]` `{L2}` What does `pprof` profile: CPU, memory (heap), goroutines, blocking? What is the default sampling rate?
361. `[CODE]` `{L2}` Expose `pprof` HTTP endpoint in OpenTrace: `import _ "net/http/pprof"`. How do you capture a 30-second CPU profile without restarting?
362. `[CONCEPT]` `{L2}` What is the difference between `runtime.MemStats.Alloc` vs `runtime.MemStats.Sys` vs `runtime.MemStats.HeapInuse`? What does each measure?
363. `[CODE]` `{L2}` Write a Go benchmark test for OpenTrace's span deserialization: measure MB/s throughput, ns/op, allocs/op.
364. `[CONCEPT]` `{L2}` What is distributed tracing context propagation? What happens when a call chain crosses a Kafka message boundary?
365. `[CODE]` `{L2}` Implement trace context injection into Kafka message headers in OpenTrace Collector: `otel.GetTextMapPropagator().Inject(ctx, kafka.Headers)`.
366. `[CONCEPT]` `{L2}` What is a baggage in OpenTelemetry? When would you propagate `user_id` as baggage vs an attribute?
367. `[CONCEPT]` `{L2}` What is `goleak`? How do you use it in Go tests to detect goroutine leaks?
368. `[CODE]` `{L2}` Add `goleak.VerifyNone(t)` to every Go test file in OpenTrace. What common patterns cause goroutine leaks in test teardown?
369. `[CONCEPT]` `{L2}` What is `go test -race`? What is the race detector and what does it catch?
370. `[CODE]` `{L2}` Write a Go test that the race detector would catch: two goroutines read/write a shared map without a mutex.
371. `[DESIGN]` `{L2}` Design the Grafana dashboard for OpenTrace Collector: list 10 specific panels with their Prometheus queries.
372. `[CONCEPT]` `{L2}` What is Alertmanager? How does it route P1 alerts to PagerDuty and P2/P3 to Slack?
373. `[CODE]` `{L2}` Write an Alertmanager routing configuration: match `severity=critical` → PagerDuty, match `severity=warning` → Slack.
374. `[CONCEPT]` `{L3}` What is OpenTelemetry Collector? How does it differ from the application SDK? What is a pipeline: receiver → processor → exporter?
375. `[DESIGN]` `{L3}` Design OpenTrace's own internal observability: OpenTrace instruments itself with OpenTelemetry. Spans flow through itself. How do you prevent infinite recursion?
376. `[CONCEPT]` `{L2}` What is `k6`? How do you write a k6 load test for OpenTrace?
377. `[CODE]` `{L2}` Write a k6 load test for OpenTrace: 100 VUs, each sending 100 spans/second via OTLP/HTTP. Assert p99 < 5ms, error rate < 0.1%.
378. `[CONCEPT]` `{L2}` What is `wrk` vs `k6` vs `hey` for load testing HTTP APIs? When do you use each?
379. `[APPLY]` `{L2}` OpenTrace's k6 load test results show p50=2ms, p95=8ms, p99=150ms. What does the p99 spike suggest? How do you investigate?
380. `[CONCEPT]` `{L2}` What is continuous profiling? What does Pyroscope add beyond pprof snapshots? How does it profile OpenTrace in production continuously?

---

## Security (Q381–Q430)

381. `[CONCEPT]` `{L1}` What is JWT (JSON Web Token)? What are the three parts: header, payload, signature?
382. `[CONCEPT]` `{L1}` What is the difference between HS256 (HMAC) and RS256 (RSA) for JWT signing? When do you use each?
383. `[CONCEPT]` `{L2}` Why does OpenTrace use RS256 (asymmetric) JWTs? How does the Auth Service sign with private key and services verify with public key?
384. `[CODE]` `{L2}` Implement JWT RS256 signing in Go: generate RSA key pair, sign claims, verify signature using public key.
385. `[CODE]` `{L2}` Implement JWT middleware in Go `chi` router: extract Bearer token from Authorization header, verify RS256 signature, extract claims, inject into context.
386. `[CONCEPT]` `{L2}` What is a refresh token? Why does it exist? How does token rotation work?
387. `[CODE]` `{L2}` Implement refresh token rotation: issue short-lived access token (15min) + long-lived refresh token (7 days). On refresh: verify refresh token, issue new both, revoke old refresh token.
388. `[CONCEPT]` `{L2}` What is refresh token revocation? How do you store revoked tokens in Redis? What is the TTL for the revocation record?
389. `[CONCEPT]` `{L2}` What is the OAuth2 Authorization Code flow with PKCE? Why is PKCE required for SPAs and mobile apps?
390. `[CODE]` `{L2}` Implement OAuth2 PKCE in TypeScript/Next.js: generate code_verifier, hash to code_challenge, redirect to auth server, exchange code for tokens.
391. `[CONCEPT]` `{L2}` What is parameterized SQL query? Why is `fmt.Sprintf` in SQL a critical security vulnerability?
392. `[CODE]` `{L2}` Show the SQL injection via `fmt.Sprintf` and the correct `sqlc`/`database/sql` parameterized query equivalent for PayCore.
393. `[CONCEPT]` `{L2}` What is HMAC webhook signature? Why do you use it? Implement `X-Signature: sha256=HMAC(secret, body)`.
394. `[CODE]` `{L2}` Implement webhook signature validation using `hmac.Equal` (constant-time comparison). Why must you NOT use `==` for string comparison?
395. `[CONCEPT]` `{L2}` What is a timing attack? How does `hmac.Equal` prevent it?
396. `[CONCEPT]` `{L2}` What is `crypto/rand` vs `math/rand` in Go? Why must you use `crypto/rand` for OTP generation and tokens?
397. `[CODE]` `{L2}` Generate a cryptographically secure 6-digit OTP using `crypto/rand` in Go.
398. `[CONCEPT]` `{L2}` What is API key storage? Why do you store `SHA256(api_key)` instead of the raw key?
399. `[CODE]` `{L2}` Implement API key creation: generate 32-byte random key using `crypto/rand`, store `SHA256(key)` in DB, return raw key once to user. On verify: hash input and compare.
400. `[CONCEPT]` `{L2}` What is CORS? When does the browser enforce it? What headers must the server return for a valid CORS preflight?
401. `[CODE]` `{L2}` Implement CORS middleware in Go: handle OPTIONS preflight, set `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, `Access-Control-Allow-Headers`.
402. `[CONCEPT]` `{L2}` What is `http.MaxBytesReader`? What request size limit should OpenTrace Collector enforce to prevent memory exhaustion attacks?
403. `[CODE]` `{L2}` Add `http.MaxBytesReader(w, r.Body, 10*1024*1024)` to OpenTrace Collector's span receive handler. What HTTP status do you return when the limit is exceeded?
404. `[CONCEPT]` `{L2}` What are the OWASP Top 10? Name the ones most relevant to OpenTrace: injection, broken auth, sensitive data exposure, XSS, CSRF.
405. `[CONCEPT]` `{L2}` What is XSS (Cross-Site Scripting)? How does OpenTrace's Next.js UI prevent it (React escapes by default, `dangerouslySetInnerHTML`)?
406. `[CONCEPT]` `{L2}` What is CSRF (Cross-Site Request Forgery)? How does `SameSite=Strict` cookie attribute prevent it?
407. `[CODE]` `{L2}` Set secure cookie attributes in Go: `Secure=true`, `HttpOnly=true`, `SameSite=Strict`. What does each prevent?
408. `[CONCEPT]` `{L2}` What is `govulncheck`? What does it check? Integrate it into the OpenTrace CI pipeline.
409. `[CODE]` `{L2}` Write the GitHub Actions step to run `govulncheck ./...` and fail the build on critical vulnerabilities.
410. `[CONCEPT]` `{L2}` What is `trivy`? What does `trivy image openTrace-collector` scan? What severity levels exist?
411. `[CODE]` `{L2}` Write the Dockerfile best practices that reduce `trivy` findings: non-root user, distroless base image, no credentials in layers.
412. `[CONCEPT]` `{L2}` What is a non-root container user? Why is it a security requirement for production deployments?
413. `[CODE]` `{L2}` Write a multi-stage Dockerfile for OpenTrace Collector: builder stage (Go compile), runner stage (distroless), USER nonroot.
414. `[CONCEPT]` `{L2}` What is mTLS (mutual TLS)? How does it authenticate both client and server? Where does OpenTrace use it between internal components?
415. `[CONCEPT]` `{L2}` What is RBAC (Role-Based Access Control)? Design the OpenTrace roles: admin, viewer, service. What permissions does each have?
416. `[CODE]` `{L2}` Implement RBAC middleware in Go: extract role from JWT claims, check against required role for the endpoint, return 403 if insufficient.
417. `[CONCEPT]` `{L2}` What is `Zod` validation? How does it prevent invalid input from reaching OpenTrace's business logic?
418. `[CODE]` `{L2}` Write a Zod schema for BookWise's `CreateBookingRequest`: venue_id (UUID), seat_ids (array, min 1, max 10), payment_method_id (UUID). Auto-generate TypeScript types.
419. `[CONCEPT]` `{L2}` What is input sanitization vs validation? What is the difference between "rejecting bad input" and "escaping bad input"?
420. `[CONCEPT]` `{L2}` What is a secret management system? How does OpenTrace load secrets from Kubernetes Secrets vs Vault vs environment variables? What is the security difference?
421. `[CODE]` `{L2}` Show why storing secrets in Dockerfile ENV variables is insecure. Show the correct approach using Kubernetes Secrets mounted as files.
422. `[CONCEPT]` `{L2}` What is TLS certificate rotation? How do you rotate the PostgreSQL TLS certificate in OpenTrace without downtime?
423. `[CONCEPT]` `{L2}` What is a SQL injection via JSONB? Show how `metadata->>'user_input'` is safe but building the key dynamically is not.
424. `[CONCEPT]` `{L3}` What is `seccomp` in Docker/Kubernetes? What syscalls should the OpenTrace Collector be allowed to make?
425. `[CONCEPT]` `{L3}` What is a Kubernetes NetworkPolicy? How do you restrict OpenTrace Collector to only communicate with Kafka and the Processor?
426. `[CODE]` `{L3}` Write a Kubernetes NetworkPolicy for OpenTrace Collector: allow ingress on port 4317 (OTLP gRPC), allow egress to Kafka (9092) only.
427. `[CONCEPT]` `{L2}` What is certificate pinning? When is it used? What is the risk of overpinning?
428. `[CONCEPT]` `{L2}` What is a JWT `exp` claim? What is `nbf`? What is `iat`? How do you handle clock skew between services?
429. `[CODE]` `{L2}` Implement clock skew tolerance in JWT validation: allow 30-second leeway for `exp` and `nbf` claims using `jwt.WithLeeway(30*time.Second)`.
430. `[CONCEPT]` `{L2}` What is SSRF (Server-Side Request Forgery)? How could a misconfigured webhook delivery in the notification service be exploited? How do you prevent it?

---

# PART E — Go, Node.js & Language-Level Performance (Q431–Q500)

---

## Go Deep (Q431–Q475)

431. `[CONCEPT]` `{L1}` What is Go's M:N goroutine scheduler? How do goroutines differ from OS threads?
432. `[CONCEPT]` `{L1}` Why do goroutines start with 2KB stack vs 1-8MB for OS threads? How does stack growth work?
433. `[CONCEPT]` `{L2}` What is `GOMAXPROCS`? What is the default value? What happens if you set it to 1 in OpenTrace Collector?
434. `[CONCEPT]` `{L2}` What is work stealing in Go's scheduler? How does it balance goroutines across GOMAXPROCS threads?
435. `[CONCEPT]` `{L2}` What is a goroutine leak? What five patterns cause goroutine leaks in OpenTrace?
436. `[CODE]` `{L2}` Find the goroutine leak in this code:
    ```go
    ch := make(chan int)
    go func() { ch <- compute() }()
    select {
    case <-ctx.Done(): return
    case val := <-ch: process(val)
    }
    ```
    Fix it.
437. `[CONCEPT]` `{L2}` What is `sync.WaitGroup`? What is `errgroup.Group`? What does `errgroup` add?
438. `[CODE]` `{L2}` Implement the OpenTrace Collector startup using `errgroup`: start gRPC server, HTTP server, Kafka producer simultaneously; if any fails, shut down all.
439. `[CONCEPT]` `{L2}` What is `singleflight`? How does OpenTrace use it to collapse concurrent identical trace lookups into one DB query?
440. `[CODE]` `{L2}` Implement `singleflight` in OpenTrace Query Service: concurrent requests for the same trace_id trigger only one ClickHouse query.
441. `[CONCEPT]` `{L2}` What is `sync.Pool`? How does OpenTrace use it to reuse Protobuf message buffers and reduce GC pressure?
442. `[CODE]` `{L2}` Implement a `sync.Pool` for span Protobuf buffers in OpenTrace Collector: `Get()` from pool, unmarshal into it, `Put()` back after processing.
443. `[CONCEPT]` `{L2}` What is `sync.RWMutex`? What is `sync.Mutex`? When do you use each?
444. `[CODE]` `{L2}` Use `sync.RWMutex` for the OpenTrace connection registry: `RLock()` for reads (many concurrent watchers), `Lock()` for writes (connect/disconnect).
445. `[CONCEPT]` `{L2}` What is `context.WithCancel`, `context.WithDeadline`, `context.WithTimeout`? How does context propagation prevent goroutine leaks?
446. `[CODE]` `{L2}` Implement context cancellation in OpenTrace Collector: when the parent request context is cancelled (client disconnects), cancel all in-flight Kafka produces.
447. `[CONCEPT]` `{L2}` What is `atomic` in Go? When does `atomic.AddInt64` outperform a mutex?
448. `[CODE]` `{L2}` Use `atomic.Int64` to count spans processed per second in OpenTrace Collector without locking.
449. `[CONCEPT]` `{L2}` What is `defer` in Go? What is the LIFO order of multiple defers? What is the performance cost?
450. `[CODE]` `{L2}` Write a Go function using `defer` for cleanup that correctly handles error propagation from the deferred close call.
451. `[CONCEPT]` `{L2}` What is error wrapping with `%w`? How does `errors.Is` and `errors.As` traverse the error chain?
452. `[CODE]` `{L2}` Wrap PostgreSQL errors in OpenTrace: `fmt.Errorf("query spans: %w", err)`. Show how to unwrap and check for `pgconn.PgError` with error code `42P01`.
453. `[CONCEPT]` `{L2}` What is Go interface? What is implicit interface implementation? What is the empty interface `any`?
454. `[CODE]` `{L2}` Define a `SpanExporter` interface for OpenTrace: `Export(ctx, spans) error`. Implement for ClickHouse and for a no-op test double.
455. `[CONCEPT]` `{L2}` What is Go reflection? When do you avoid it for performance in OpenTrace's hot path?
456. `[CONCEPT]` `{L2}` What is `pprof` CPU profiling? How do you profile the OpenTrace Span Processor to find the hottest code path?
457. `[CODE]` `{L2}` Capture a 30-second CPU profile of OpenTrace Processor under load: `go tool pprof http://localhost:6060/debug/pprof/profile?seconds=30`.
458. `[CONCEPT]` `{L2}` What is escape analysis in Go? Why does `go build -gcflags="-m"` matter for allocations in OpenTrace's hot path?
459. `[CODE]` `{L2}` Run `go build -gcflags="-m" ./...` on OpenTrace Collector. Identify two heap allocations in the hot path that you can move to stack allocation.
460. `[CONCEPT]` `{L2}` What is `go test -bench`? What does `ns/op`, `allocs/op`, `B/op` mean?
461. `[CODE]` `{L2}` Write a benchmark for OpenTrace's Protobuf span unmarshaling: `BenchmarkUnmarshalSpan`. Target: < 1000 ns/op, 0 allocs/op with sync.Pool.
462. `[CONCEPT]` `{L2}` What is the Go garbage collector? What algorithm does it use? What is the tri-color mark-and-sweep?
463. `[CONCEPT]` `{L2}` What is `GOGC`? What is `GOMEMLIMIT`? How do you tune them for OpenTrace's 10M span/sec throughput?
464. `[CODE]` `{L2}` Set `GOMEMLIMIT` for OpenTrace Collector in Kubernetes: set to 90% of container memory limit to prevent OOM kills while allowing GC to reclaim before limit.
465. `[CONCEPT]` `{L2}` What is a map in Go? Is it concurrent-safe? What data race does `sync.Map` prevent?
466. `[CODE]` `{L2}` Use `sync.Map` for OpenTrace's trace-watcher registry: safe for concurrent reads from WebSocket goroutines and writes from the Processor.
467. `[CONCEPT]` `{L2}` What is graceful shutdown in Go? What is the correct sequence for OpenTrace Collector: stop accepting, drain in-flight, close Kafka producer, close DB pool?
468. `[CODE]` `{L2}` Implement graceful shutdown for OpenTrace Collector: `signal.Notify(sigCh, syscall.SIGTERM, syscall.SIGINT)`, 30-second drain timeout.
469. `[CONCEPT]` `{L2}` What is `cobra` in Go? How do you structure OpenTrace Collector's CLI with `cobra`: `collector serve --port=4317 --config=config.yaml`?
470. `[CODE]` `{L2}` Write the OpenTrace Collector `cobra` root command with subcommands: `serve`, `validate-config`, `version`.
471. `[CONCEPT]` `{L2}` What is `chi` router in Go? How do you organize OpenTrace's HTTP routes with middleware: auth, logging, tracing, rate limiting?
472. `[CODE]` `{L2}` Write the OpenTrace HTTP server setup using `chi`: route groups, middleware chain, graceful shutdown integration.
473. `[CONCEPT]` `{L2}` What is gRPC in Go? What is a unary RPC vs server streaming RPC? How does OpenTrace implement both?
474. `[CODE]` `{L2}` Implement a gRPC service in Go for OpenTrace: define the `ExportTraces` unary RPC from the OTLP proto spec. Handle metadata, errors, and status codes.
475. `[CONCEPT]` `{L2}` What is gRPC interceptor (middleware)? Implement a logging + tracing interceptor for OpenTrace's gRPC server.

---

## Node.js Deep & System-Level Patterns (Q476–Q500)

476. `[CONCEPT]` `{L1}` What is the Node.js event loop? What are the 6 phases: timers, pending callbacks, idle/prepare, poll, check, close callbacks?
477. `[CONCEPT]` `{L2}` What is `libuv`? How does it implement async I/O on top of the OS?
478. `[CONCEPT]` `{L2}` What is the difference between `setImmediate` and `process.nextTick`? Which runs first?
479. `[CONCEPT]` `{L2}` What are `worker_threads` in Node.js? How do they differ from the main event loop thread?
480. `[CODE]` `{L2}` Implement a CPU-heavy span parsing task in a `worker_thread` to avoid blocking the Node.js event loop in the DungBeetle job processor.
481. `[CONCEPT]` `{L2}` What is `AsyncLocalStorage` in Node.js? How does OpenTrace use it to propagate trace context through async operations without passing context explicitly?
482. `[CODE]` `{L2}` Implement trace context propagation in Node.js using `AsyncLocalStorage`: wrap every request handler, store trace_id, read it in any downstream logger.
483. `[CONCEPT]` `{L2}` What are Node.js streams? What is backpressure? What is `highWaterMark`?
484. `[CODE]` `{L2}` Stream a 200MB CSV file through a `Transform` stream that parses and validates each row, using constant ~20MB memory. Use `pipeline()` for error handling.
485. `[CONCEPT]` `{L2}` What is V8's hidden class optimization? How does property order in objects affect PayCore's performance?
486. `[CONCEPT]` `{L2}` What is Node.js `cluster` module? How does it use `SO_REUSEPORT` to distribute requests across CPU cores?
487. `[CODE]` `{L2}` Implement a DungBeetle Node.js HTTP server using `cluster` with `os.cpus().length` workers. Implement graceful shutdown that drains each worker.
488. `[CONCEPT]` `{L2}` What is `--max-old-space-size` in Node.js? What happens when the V8 heap exceeds it?
489. `[CONCEPT]` `{L2}` What is TypeScript `strict: true`? What does it enable: `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`?
490. `[CODE]` `{L2}` Write a TypeScript branded type for `TraceId` so that `string` cannot be accidentally passed where `TraceId` is expected.
491. `[CONCEPT]` `{L2}` What is TypeScript conditional types? Write `NonNullable<T>` as a conditional type.
492. `[CODE]` `{L2}` Write a TypeScript generic `Result<T, E>` type (similar to Rust's Result): `Ok<T>` | `Err<E>`. Use it in the DungBeetle job processor return type.
493. `[CONCEPT]` `{L2}` What is Zod? How does a single Zod schema generate both runtime validation and TypeScript types?
494. `[CODE]` `{L2}` Write a Zod schema for the OpenTrace span ingestion payload. Generate the TypeScript type. Validate in the Express middleware.
495. `[CONCEPT]` `{L2}` What is Prisma vs `postgres.js` vs `pg` for PostgreSQL in Node.js? When does each appropriate?
496. `[CONCEPT]` `{L2}` What is `tsc --noEmit`? How do you integrate it into the DungBeetle CI pipeline so TypeScript errors fail the build?
497. `[CODE]` `{L2}` Write the GitHub Actions CI job for DungBeetle: `tsc --noEmit`, `eslint`, `vitest --coverage`, `playwright test`.
498. `[CONCEPT]` `{L2}` What is `testcontainers` for Node.js? How do you start a real PostgreSQL container in a Vitest test?
499. `[CODE]` `{L2}` Write a Vitest integration test for DungBeetle's job queue: start PostgreSQL via `testcontainers`, insert a job, run the worker, assert the job completes.
500. `[APPLY]` `{L2}` Final synthesis: You are presenting OpenTrace to Infraspec's technical team. In 5 minutes, explain: the distributed systems problem it solves, the architecture decisions you made (Kafka vs direct HTTP, ClickHouse vs PostgreSQL, tail-based vs head-based sampling), and the three hardest engineering challenges you faced building it.
