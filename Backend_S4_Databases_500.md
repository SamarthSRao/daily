# Backend Engineering — Section 4: Databases (Deep Internals)
### 500 Questions | PostgreSQL · MySQL · Redis · MongoDB · Elasticsearch · ClickHouse · LSM-trees · WAL
> Mapped to Backend 2026 Roadmap Stage 5 — "The most important block for backend"
> Tagged: [CONCEPT] [CODE] [DEBUG] [TRADEOFF] [QUERY] [INTERNALS] [APPLY]
> Levels: {L1} must know · {L2} mid/senior · {L3} staff/DBA

---

# PART A — PostgreSQL Fundamentals & SQL Mastery (Q1–Q80)

---

## Schema, Tables & Constraints (Q1–Q20)

1. `[CONCEPT]` `{L1}` What is a schema in PostgreSQL? How does it differ from a database? How do you set the search_path?
2. `[CONCEPT]` `{L1}` What are the five constraint types in PostgreSQL? Give the syntax for each: PRIMARY KEY, UNIQUE, NOT NULL, CHECK, FOREIGN KEY.
3. `[QUERY]` `{L1}` Write a CREATE TABLE for an `orders` table with: order_id (serial PK), user_id (FK to users), amount (numeric, must be > 0), status (CHECK in list), created_at (timestamptz, default now()).
4. `[CONCEPT]` `{L1}` What is the difference between `SERIAL` and `IDENTITY` columns in PostgreSQL? Which is preferred in modern PostgreSQL?
5. `[CONCEPT]` `{L1}` What is normalization? Explain 1NF, 2NF, 3NF with a concrete example using an orders table.
6. `[CONCEPT]` `{L2}` What is denormalization? When is it appropriate? Give a real example from a high-read system.
7. `[QUERY]` `{L1}` Write SQL to add a column, drop a column, rename a column, and change a column's type on an existing table.
8. `[CONCEPT]` `{L2}` What is the difference between `ALTER TABLE` in PostgreSQL vs MySQL regarding table locks? How does PostgreSQL handle schema migrations on large tables?
9. `[QUERY]` `{L2}` Write a migration that adds a NOT NULL column to a table with 500M rows without locking the table. What is the safe multi-step approach?
10. `[CONCEPT]` `{L2}` What is `pg_catalog`? What is `information_schema`? What is the difference?
11. `[QUERY]` `{L1}` Write a query to list all tables in the current database with their row counts.
12. `[CONCEPT]` `{L1}` What is a foreign key? What are the four ON DELETE behaviors: RESTRICT, CASCADE, SET NULL, SET DEFAULT?
13. `[DEBUG]` `{L2}` A FOREIGN KEY constraint causes a slow DELETE operation. What is the likely cause? How do you diagnose and fix it?
14. `[CONCEPT]` `{L2}` What is a partial unique constraint? Give a use case for `CREATE UNIQUE INDEX ON orders(user_id) WHERE status = 'pending'`.
15. `[CONCEPT]` `{L2}` What is `DEFERRABLE INITIALLY DEFERRED` for a constraint? When is it essential?
16. `[QUERY]` `{L2}` Write a query to find all tables with no indexes beyond the primary key.
17. `[CONCEPT]` `{L2}` What is table inheritance in PostgreSQL? How does it differ from partitioning?
18. `[CONCEPT]` `{L2}` What are generated columns in PostgreSQL? How do they differ from computed columns in MySQL?
19. `[QUERY]` `{L2}` Create a table with a generated column that stores the full name from `first_name || ' ' || last_name`.
20. `[CONCEPT]` `{L3}` What is row-level security (RLS) in PostgreSQL? How do you implement multi-tenant isolation at the database level?

---

## SQL Mastery: JOINs, Aggregations, CTEs, Window Functions (Q21–Q50)

21. `[QUERY]` `{L1}` Write INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN for users and orders. Explain what each returns.
22. `[CONCEPT]` `{L1}` What is the difference between LEFT JOIN and INNER JOIN for NULL handling? When does LEFT JOIN produce rows that INNER JOIN does not?
23. `[QUERY]` `{L1}` Find all users who have never placed an order using LEFT JOIN + WHERE NULL.
24. `[QUERY]` `{L1}` Write a self-join to find all employees managed by the same manager.
25. `[QUERY]` `{L1}` Write GROUP BY + HAVING to find all users who placed more than 5 orders in the last 30 days.
26. `[CONCEPT]` `{L1}` What is the difference between WHERE and HAVING? Can you use a window function in WHERE?
27. `[QUERY]` `{L1}` Write a CTE (WITH clause) to find the top 3 products by revenue per category.
28. `[CONCEPT]` `{L2}` What is a recursive CTE? Write one to traverse an employee hierarchy tree.
29. `[QUERY]` `{L2}` Write a recursive CTE to find all descendants of a given node in a category tree.
30. `[QUERY]` `{L1}` Write a query using ROW_NUMBER(), RANK(), and DENSE_RANK(). What is the difference between RANK and DENSE_RANK?
31. `[QUERY]` `{L2}` Write a window function query to compute a running total of revenue per day.
32. `[QUERY]` `{L2}` Write a query using LEAD() and LAG() to find day-over-day revenue change.
33. `[QUERY]` `{L2}` Use FIRST_VALUE() and LAST_VALUE() to find the first and last order per user.
34. `[QUERY]` `{L2}` Use NTILE(4) to divide orders into revenue quartiles.
35. `[QUERY]` `{L2}` Write a query to compute a 7-day moving average of daily revenue using window functions.
36. `[CONCEPT]` `{L2}` What is the PARTITION BY clause in a window function? How does it differ from GROUP BY?
37. `[QUERY]` `{L2}` Use window functions to find the second-highest revenue per category without a subquery.
38. `[QUERY]` `{L2}` Write a query to pivot rows into columns: turn monthly revenue rows into columns (Jan, Feb, ..., Dec) per year.
39. `[QUERY]` `{L2}` Use `FILTER (WHERE condition)` with an aggregate to compute conditional counts in a single pass.
40. `[QUERY]` `{L1}` Write a subquery in SELECT, FROM, WHERE positions. What is a correlated subquery?
41. `[QUERY]` `{L2}` Rewrite a correlated subquery using a lateral join. When is LATERAL faster?
42. `[CONCEPT]` `{L2}` What is a LATERAL join? When does it enable things that a regular JOIN cannot?
43. `[QUERY]` `{L2}` Write an UPSERT using INSERT ... ON CONFLICT DO UPDATE. What is the difference from MySQL's INSERT ... ON DUPLICATE KEY UPDATE?
44. `[QUERY]` `{L2}` Write a query using EXCEPT, INTERSECT, and UNION ALL. When does UNION vs UNION ALL matter for performance?
45. `[QUERY]` `{L2}` Write a DELETE with a JOIN (DELETE FROM orders USING users WHERE ...).
46. `[QUERY]` `{L2}` Write an UPDATE with a CTE to update multiple rows based on a ranking.
47. `[CONCEPT]` `{L2}` What is GROUPING SETS? What is ROLLUP? What is CUBE? Give a reporting use case.
48. `[QUERY]` `{L3}` Write a query to detect gaps in a sequence (find missing order IDs in a sequence).
49. `[QUERY]` `{L3}` Write a query to implement a "top N per group" without row_number using arrays and unnest.
50. `[DEBUG]` `{L2}` A CTE is running slower than expected. The developer assumed CTEs are always "optimization fences." What is the PostgreSQL 12+ behavior change for CTEs?

---

## EXPLAIN ANALYZE & Query Planning (Q51–Q80)

51. `[CONCEPT]` `{L1}` What does `EXPLAIN` show? What does `EXPLAIN ANALYZE` additionally show? What does `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)` add?
52. `[CONCEPT]` `{L1}` What is a sequential scan (Seq Scan)? When does the planner choose it over an index scan?
53. `[CONCEPT]` `{L1}` What is an Index Scan? What is an Index-Only Scan? What is a Bitmap Index Scan? When does each occur?
54. `[CONCEPT]` `{L2}` What is the difference between a Bitmap Index Scan and an Index Scan? When does PostgreSQL prefer the bitmap approach?
55. `[CONCEPT]` `{L2}` What is a "lossy" bitmap? What does it mean when Bitmap Heap Scan shows "Lossy" in EXPLAIN output?
56. `[QUERY]` `{L1}` Run `EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 123`. Identify: scan type, actual rows, estimated rows, cost.
57. `[CONCEPT]` `{L2}` What does "cost" mean in EXPLAIN output? What units is it in? What are `seq_page_cost` and `random_page_cost`?
58. `[CONCEPT]` `{L1}` What is the difference between estimated rows and actual rows in EXPLAIN ANALYZE? What causes large discrepancies?
59. `[CONCEPT]` `{L2}` What is `pg_stats`? What does `ANALYZE` collect? What is a histogram in planner statistics?
60. `[DEBUG]` `{L1}` `EXPLAIN ANALYZE` shows estimated rows = 1 but actual rows = 500,000. What is the likely cause and fix?
61. `[CONCEPT]` `{L2}` What are the three join strategies the planner can choose: Hash Join, Nested Loop, Merge Join? When is each optimal?
62. `[CONCEPT]` `{L2}` What is `work_mem`? How does it affect hash join and sort performance? What is the risk of setting it too high?
63. `[CONCEPT]` `{L2}` What is `enable_seqscan`, `enable_indexscan`, `enable_hashjoin`? When would you set them to `off` for debugging?
64. `[DEBUG]` `{L2}` A query joins 4 tables. EXPLAIN shows it choosing a nested loop join on 1M rows. How do you force a hash join?
65. `[CONCEPT]` `{L2}` What is a parallel query in PostgreSQL? What does `Workers Planned` vs `Workers Launched` mean in EXPLAIN?
66. `[CONCEPT]` `{L2}` What is `max_parallel_workers_per_gather`? How does PostgreSQL decide to parallelize a query?
67. `[DEBUG]` `{L2}` A query runs fine on staging (10K rows) but is slow in production (50M rows). The indexes exist. What do you check first?
68. `[CONCEPT]` `{L2}` What is a covering index scan vs a regular index scan? What is "Index Only Scan" and when does it fail to be index-only?
69. `[QUERY]` `{L2}` Write a query and show how adding a covering index changes the EXPLAIN output from Index Scan to Index Only Scan.
70. `[DEBUG]` `{L2}` A developer created an index on `LOWER(email)` but queries on `email = 'test@example.com'` don't use it. Why?
71. `[CONCEPT]` `{L2}` What is the "correlation" statistic in pg_stats? How does it affect the planner's choice between index scan and seq scan?
72. `[DEBUG]` `{L2}` After running `VACUUM`, the query is still slow. After `VACUUM ANALYZE`, it becomes fast. What was the difference?
73. `[CONCEPT]` `{L2}` What is `auto_explain`? How do you configure it to log slow query plans automatically?
74. `[CONCEPT]` `{L3}` What is `pg_stat_statements`? What are the five most important columns to monitor for query performance?
75. `[DEBUG]` `{L3}` `pg_stat_statements` shows a query with `calls=10M`, `total_time=50000s`, `mean_time=5ms`. Is this a problem? What do you investigate?
76. `[CONCEPT]` `{L2}` What is a "generic plan" vs a "custom plan" in PostgreSQL? What is `plan_cache_mode`?
77. `[DEBUG]` `{L2}` Prepared statement runs slow on some calls but fast on others. What is the parameter sniffing equivalent in PostgreSQL?
78. `[CONCEPT]` `{L3}` What is `JIT compilation` in PostgreSQL? When does it help and when does it add overhead?
79. `[CONCEPT]` `{L3}` What is `pg_hint_plan`? When is it justified to force a query plan override?
80. `[DEBUG]` `{L3}` A query plan changes after a PostgreSQL upgrade. The new plan is slower. How do you reproduce and force the old plan?

---

# PART B — Indexes Deep Dive (Q81–Q150)

---

## B-Tree Indexes (Q81–Q110)

81. `[CONCEPT]` `{L1}` What is a B-tree index? Explain the structure: root, internal nodes, leaf nodes. How does a search traverse it?
82. `[CONCEPT]` `{L1}` What is the time complexity of B-tree search, insert, and delete? What is the typical height for a table with 100M rows?
83. `[CONCEPT]` `{L2}` What is a B+ tree? How does it differ from a B-tree? Why do databases use B+ trees instead of B-trees?
84. `[CONCEPT]` `{L2}` What is a page split in a B-tree? What triggers it? What is fill factor and how does it reduce splits?
85. `[CONCEPT]` `{L2}` What is index bloat in PostgreSQL? How do dead tuples (from MVCC) cause the index to grow? How do you reclaim space?
86. `[QUERY]` `{L1}` Create a B-tree index on `orders(user_id)`. Create a composite index on `orders(user_id, created_at DESC)`. Explain the difference.
87. `[CONCEPT]` `{L1}` What is the "left-prefix rule" for composite indexes? For index on `(a, b, c)`, which queries can use it?
88. `[DEBUG]` `{L1}` A developer creates an index on `(status, user_id)` but queries `WHERE user_id = 123` don't use it. Why? What's the fix?
89. `[CONCEPT]` `{L2}` What is index cardinality? Why does an index on a boolean column (true/false) rarely help?
90. `[CONCEPT]` `{L2}` What is a partial index? Write the syntax. Give three real-world use cases.
91. `[QUERY]` `{L2}` Create a partial index on `orders(user_id) WHERE status = 'active'`. When does the planner use it?
92. `[CONCEPT]` `{L2}` What is a covering index? How do you create one in PostgreSQL using INCLUDE?
93. `[QUERY]` `{L2}` Create a covering index: `CREATE INDEX ON orders(user_id) INCLUDE (amount, status)`. When does EXPLAIN show Index Only Scan vs Index Scan?
94. `[CONCEPT]` `{L2}` What is an expression index (functional index)? Write the syntax for an index on LOWER(email).
95. `[DEBUG]` `{L2}` An expression index on `LOWER(email)` exists. The query `WHERE email ILIKE 'test%'` doesn't use it. Why? What index does it need?
96. `[CONCEPT]` `{L2}` What is the write overhead of an index? How does having 10 indexes on a table affect INSERT/UPDATE/DELETE throughput?
97. `[DEBUG]` `{L2}` Bulk insert of 10M rows is slow. The table has 8 indexes. What is the optimal strategy for bulk loading?
98. `[CONCEPT]` `{L2}` What is `CREATE INDEX CONCURRENTLY`? How does it differ from regular `CREATE INDEX`? What is its limitation?
99. `[DEBUG]` `{L2}` `CREATE INDEX CONCURRENTLY` fails partway through. The index is left in an "invalid" state. How do you clean it up?
100. `[CONCEPT]` `{L2}` What is index-only scan? What are the three conditions for PostgreSQL to use it instead of an index scan?
101. `[CONCEPT]` `{L2}` What is `pg_stat_user_indexes`? What `idx_scan = 0` tells you? When should you drop an index?
102. `[QUERY]` `{L2}` Write a query to find all indexes on a table that have never been used since the last `pg_stat_reset()`.
103. `[CONCEPT]` `{L3}` What is a hash index in PostgreSQL? When is it faster than a B-tree? What can it NOT do?
104. `[CONCEPT]` `{L2}` What is a BRIN index? For what table structure is it optimal? Why is it so small?
105. `[QUERY]` `{L2}` Create a BRIN index on a time-series `events(created_at)` table that receives only append writes. Why is BRIN appropriate here?
106. `[CONCEPT]` `{L2}` What is a GIN index? What data types need it? Give three use cases.
107. `[QUERY]` `{L2}` Create a GIN index for full-text search on a `documents(body)` column using `tsvector`.
108. `[QUERY]` `{L2}` Create a GIN index on a `JSONB` column to support containment queries (`@>`).
109. `[CONCEPT]` `{L3}` What is a GiST index? What is the difference between GIN and GiST? For what queries is each better?
110. `[CONCEPT]` `{L3}` What is `pg_trgm`? How does it enable fuzzy search with an index? What is the `%` similarity operator?

---

## LSM-Trees vs B-Trees (Q111–Q130)

111. `[CONCEPT]` `{L2}` What is an LSM-tree (Log-Structured Merge-tree)? What problem does it solve vs a B-tree for write-heavy workloads?
112. `[CONCEPT]` `{L2}` Describe the LSM-tree write path: MemTable → WAL → SSTable flush → compaction. What happens at each step?
113. `[CONCEPT]` `{L2}` What is a MemTable? What data structure backs it (typically a skip list or red-black tree)? Why must it be sorted?
114. `[CONCEPT]` `{L2}` What is an SSTable? What is its layout on disk? How is a key lookup performed?
115. `[CONCEPT]` `{L2}` What is compaction in an LSM-tree? What are size-tiered vs leveled compaction strategies?
116. `[CONCEPT]` `{L2}` What is write amplification? How does it affect SSD lifespan? Which is worse: B-tree or LSM-tree?
117. `[CONCEPT]` `{L2}` What is read amplification? Why does an LSM-tree have higher read amplification than a B-tree?
118. `[CONCEPT]` `{L2}` What is space amplification in an LSM-tree? How do duplicate keys (multiple versions of same key) accumulate before compaction?
119. `[CONCEPT]` `{L2}` What is a Bloom filter in an LSM-tree? How does it reduce read amplification from O(N SSTables) to O(1)?
120. `[CODE]` `{L2}` Describe the exact read path for a GET key in an LSM-tree with 3 levels of SSTables and a Bloom filter per SSTable.
121. `[CONCEPT]` `{L2}` What is a tombstone in an LSM-tree? Why must tombstones survive until they are merged below all SSTables containing the key?
122. `[CONCEPT]` `{L2}` What is a "write stall" in RocksDB/LevelDB? What triggers it? How does it manifest in production latency?
123. `[TRADEOFF]` `{L2}` LSM-tree vs B-tree: compare write throughput, read latency, space efficiency, compaction CPU cost. When do you choose each?
124. `[APPLY]` `{L2}` Which databases use LSM-trees? (RocksDB, LevelDB, Cassandra, DynamoDB, ScyllaDB, ClickHouse MergeTree). What properties led them to choose LSM?
125. `[CONCEPT]` `{L3}` What is the RocksDB column family? How does it enable different compaction strategies per logical table?
126. `[CODE]` `{L2}` In your LSM-tree biweekly project, how do you handle a GET for a key that was deleted 3 compaction cycles ago? Walk through the entire path.
127. `[CONCEPT]` `{L3}` What is MANIFEST in RocksDB? What does it track? Why is it needed alongside the WAL?
128. `[CONCEPT]` `{L3}` What is the "compaction debt"? What happens to write latency when compaction falls behind?
129. `[TRADEOFF]` `{L3}` Compare ClickHouse MergeTree (LSM-variant) to PostgreSQL B-tree index for a time-series workload with 10M inserts/sec.
130. `[CODE]` `{L2}` Walk through the exact binary layout of an SSTable in your biweekly LSM implementation: data blocks, index block, footer, Bloom filter position.

---

## Index Design for Real Workloads (Q131–Q150)

131. `[DESIGN]` `{L2}` OpenTrace spans table receives 10M inserts/sec. Design the ClickHouse partitioning key, sorting key, and index strategy.
132. `[DESIGN]` `{L2}` PayCore transactions table: 500M rows, queries by `user_id + date_range + status`. Design the optimal composite index. Justify column order.
133. `[DESIGN]` `{L2}` DungBeetle jobs table: workers `SELECT FOR UPDATE SKIP LOCKED WHERE status='pending' ORDER BY priority DESC, created_at ASC`. Design the index.
134. `[DESIGN]` `{L2}` BookWise bookings table: seats_id + venue_id + event_date with concurrent booking attempts. Design indexes to support both the lock check and the availability query.
135. `[DEBUG]` `{L2}` A query `SELECT * FROM spans WHERE trace_id = $1` on a 500M row table does a seq scan despite an index on `trace_id`. What are the five possible reasons?
136. `[DESIGN]` `{L2}` A multi-tenant SaaS table where every query includes `WHERE tenant_id = $1`. Should `tenant_id` be first in composite indexes? Always? What is the exception?
137. `[DEBUG]` `{L2}` An index was fast last week, slow today. Rows haven't grown significantly. What happened? (Hint: dead tuple bloat after a large UPDATE).
138. `[DESIGN]` `{L3}` Design a geospatial index for RouteMaster: "find all drivers within 5km of this coordinate." What index type and PostGIS extension?
139. `[DESIGN]` `{L2}` Elasticsearch inverted index vs PostgreSQL GIN index for full-text search on 10M documents. When does each win?
140. `[DEBUG]` `{L2}` A developer added a `CREATE INDEX ON orders(created_at)` to speed up monthly reports. But `DELETE FROM orders WHERE created_at < '2020-01-01'` is now slower. Why?
141. `[DESIGN]` `{L2}` BookWise seat availability: millions of concurrent readers. Should you index `seat_status`? Why is cardinality the key factor?
142. `[DESIGN]` `{L3}` You have a JSONB column `metadata` with 50 different keys. Some queries filter on `metadata->>'type'`. Design the indexing strategy.
143. `[DEBUG]` `{L3}` An expression index on `(metadata->>'user_id')::bigint` exists but queries using `WHERE (metadata->>'user_id')::bigint = 123` don't use it. Why? What is the cast consistency rule?
144. `[DESIGN]` `{L2}` A time-series table partitioned by month. Design indexes on each partition. Why does `CREATE INDEX ON ONLY parent_table` fail to help queries on child partitions?
145. `[DESIGN]` `{L3}` ClickHouse `spans` table with ORDER BY (trace_id, span_id). Design a secondary index using `INDEX` clause for service_name. What is a "skipping index"?
146. `[CONCEPT]` `{L2}` What is index intersection in PostgreSQL? When does the planner use two separate indexes on a single table for one query?
147. `[DEBUG]` `{L2}` A query uses `WHERE a = 1 AND b = 2`. There are separate indexes on (a) and (b) but not (a, b). EXPLAIN shows "BitmapAnd". Is this good? When is it better to create a composite index?
148. `[DESIGN]` `{L2}` OpenTrace trace search: users query by service_name, start_time range, and duration. Design the index given that service_name has 50 distinct values, start_time is always in the WHERE, and duration filter is optional.
149. `[CONCEPT]` `{L3}` What is a "sawtooth" index bloat pattern? When does it occur? How do partial vacuums vs full `VACUUM FULL` interact with it?
150. `[DESIGN]` `{L3}` Design a zero-downtime index replacement strategy: you need to swap a bad index for a better one on a 1B row production table without any query downtime.

---

# PART C — MVCC, WAL & Transactions (Q151–Q250)

---

## MVCC Internals (Q151–Q180)

151. `[CONCEPT]` `{L1}` What is MVCC (Multi-Version Concurrency Control)? What problem does it solve vs lock-based concurrency?
152. `[CONCEPT]` `{L1}` In PostgreSQL MVCC, what are `xmin` and `xmax` on a tuple? What do they represent?
153. `[CONCEPT]` `{L2}` How does PostgreSQL determine if a tuple is "visible" to a transaction? What is the visibility check algorithm?
154. `[CONCEPT]` `{L2}` What is a transaction snapshot in PostgreSQL? What does it capture (xmin, xmax, xip_list)?
155. `[CONCEPT]` `{L2}` What is a "dead tuple" in PostgreSQL? Why do UPDATEs create two rows instead of modifying in place?
156. `[CONCEPT]` `{L1}` What is VACUUM? What does it do? Why is it necessary in a MVCC database?
157. `[CONCEPT]` `{L1}` What is autovacuum? What triggers it? What are the `autovacuum_vacuum_threshold` and `autovacuum_vacuum_scale_factor` settings?
158. `[DEBUG]` `{L2}` A table has grown to 50GB but only contains 5GB of live data. `VACUUM` has been running. Why hasn't the size decreased? What does `VACUUM FULL` do differently?
159. `[CONCEPT]` `{L2}` What is table bloat? How do you measure it? What query shows dead tuple ratios?
160. `[DEBUG]` `{L2}` `pg_stat_user_tables` shows `n_dead_tup = 10,000,000` on a table with `n_live_tup = 100,000`. What happened and what is the fix?
161. `[CONCEPT]` `{L2}` What is the "autovacuum wraparound" emergency? What is transaction ID wraparound? How close to it is dangerous?
162. `[DEBUG]` `{L3}` Your monitoring shows `age(datfrozenxid)` approaching `autovacuum_freeze_max_age`. What is the risk and what do you do immediately?
163. `[CONCEPT]` `{L2}` What is `pg_freeze`? What does `VACUUM FREEZE` do differently from regular VACUUM?
164. `[CONCEPT]` `{L2}` What is `FILLFACTOR` for a table? How does setting `FILLFACTOR = 70` improve HOT (Heap Only Tuple) updates?
165. `[CONCEPT]` `{L2}` What is a HOT update? What conditions must be met for PostgreSQL to perform a HOT update instead of a full update?
166. `[CONCEPT]` `{L3}` What is the visibility map? How does it let VACUUM skip clean pages and enable index-only scans?
167. `[CONCEPT]` `{L3}` What is the free space map (FSM) in PostgreSQL? How does INSERT use it to find a page with space?
168. `[CONCEPT]` `{L2}` What is `pg_stat_activity`? What query shows all long-running transactions holding locks?
169. `[DEBUG]` `{L2}` A long-running transaction is blocking autovacuum on a critical table. How do you find it and what do you do?
170. `[CONCEPT]` `{L3}` What is the `vacuum_cost_delay` setting? How does it throttle autovacuum to avoid I/O spikes?
171. `[CONCEPT]` `{L2}` Compare MVCC in PostgreSQL vs MySQL InnoDB. What is the "undo log" approach that InnoDB uses? What is the advantage and disadvantage?
172. `[CONCEPT]` `{L2}` How does read consistency work in PostgreSQL's REPEATABLE READ? Can you see your own writes in the same transaction?
173. `[CONCEPT]` `{L3}` What is "snapshot too old" error in PostgreSQL? What setting controls old snapshot age? When does it fire?
174. `[DEBUG]` `{L3}` A long-running analytics query returns a `snapshot too old` error. What is the root cause and the production fix?
175. `[CONCEPT]` `{L3}` What is logical replication and how does MVCC interact with the replication origin? What is `pg_replication_slots` and what happens when a slot is not consumed?
176. `[DEBUG]` `{L3}` An inactive replication slot is causing disk usage to grow unboundedly (WAL accumulation). How do you detect and resolve this?
177. `[CONCEPT]` `{L2}` What is `pg_visibility`? How do you use it to check the visibility map of a table?
178. `[CONCEPT]` `{L3}` What is `pg_prewarm`? When and why would you use it before a planned maintenance window?
179. `[CONCEPT]` `{L2}` What is the difference between `VACUUM` and `VACUUM ANALYZE`? What does the ANALYZE part do?
180. `[DEBUG]` `{L2}` After a large bulk DELETE (removing 80% of rows), query performance degrades. VACUUM ANALYZE doesn't help. What do you do? (Hint: CLUSTER or VACUUM FULL + pg_repack)

---

## WAL (Write-Ahead Log) (Q181–Q210)

181. `[CONCEPT]` `{L1}` What is the Write-Ahead Log (WAL)? What fundamental rule does it enforce regarding durability?
182. `[CONCEPT]` `{L1}` Why must WAL records be written to disk before the actual data pages? What would happen without this ordering?
183. `[CONCEPT]` `{L2}` What is a WAL record? What does it contain: LSN, type, before image, after image, transaction ID?
184. `[CONCEPT]` `{L2}` What is an LSN (Log Sequence Number)? How does it uniquely identify a point in the WAL stream?
185. `[CONCEPT]` `{L1}` What is a checkpoint in PostgreSQL? What happens during a checkpoint? How frequently does it occur?
186. `[CONCEPT]` `{L2}` What is `checkpoint_completion_target`? How does it spread checkpoint I/O to avoid spikes?
187. `[CONCEPT]` `{L2}` What is `wal_level`? What are the values: minimal, replica, logical? What does each enable?
188. `[CONCEPT]` `{L2}` What is `synchronous_commit`? What values exist: on, off, local, remote_write, remote_apply? What are the durability vs performance tradeoffs?
189. `[DEBUG]` `{L2}` Setting `synchronous_commit = off` improves write throughput 3x. What data loss risk does this introduce? When is it acceptable?
190. `[CONCEPT]` `{L2}` What is WAL archiving? How does it enable PITR (Point-In-Time Recovery)?
191. `[CODE]` `{L2}` Describe the binary format of a WAL record in your biweekly WAL project. What fields are in the header? What is in the data section?
192. `[CODE]` `{L2}` In your WAL biweekly project, how do you detect a partial write (power loss mid-write)? What role do checksums play?
193. `[CODE]` `{L2}` Describe the recovery algorithm from WAL replay in your biweekly project. What is the "redo" point? What is crash recovery?
194. `[CONCEPT]` `{L2}` What is `fsync`? What is `fdatasync`? What is the difference? Which does PostgreSQL use for WAL?
195. `[CONCEPT]` `{L2}` What is a write barrier? Why does the OS page cache not guarantee persistence without `fsync`?
196. `[DEBUG]` `{L2}` A developer says "we don't need fsync because we're on cloud VMs with persistent storage." Is this argument valid?
197. `[CONCEPT]` `{L2}` What is WAL compression in PostgreSQL? What is `wal_compression`? What is the CPU vs I/O tradeoff?
198. `[CONCEPT]` `{L2}` What is a WAL segment? What is the default segment size (16MB)? How do you change it?
199. `[CONCEPT]` `{L2}` What is `pg_waldump`? How do you use it to inspect WAL records?
200. `[DEBUG]` `{L3}` WAL is accumulating faster than it's being archived. `pg_wal` directory is growing. What are the causes and fixes?
201. `[CONCEPT]` `{L2}` What is streaming replication? How does the primary send WAL to standby? What is the replication protocol?
202. `[CONCEPT]` `{L2}` What is `pg_stat_replication`? What columns tell you replication lag?
203. `[CONCEPT]` `{L2}` What is write_lsn, flush_lsn, replay_lsn in `pg_stat_replication`? What is the difference?
204. `[DEBUG]` `{L2}` Replication lag is growing. `replay_lsn` is falling behind `write_lsn`. What are the three possible bottlenecks?
205. `[CONCEPT]` `{L3}` What is logical decoding in PostgreSQL? What is the `pgoutput` plugin? How does Debezium CDC use it?
206. `[CONCEPT]` `{L2}` What is PITR (Point-In-Time Recovery)? Walk through the exact steps to restore a PostgreSQL database to a specific timestamp.
207. `[CODE]` `{L2}` Write the `recovery.conf` (or `postgresql.conf` in PG12+) configuration for PITR using WAL archives in S3.
208. `[CONCEPT]` `{L2}` What is a base backup in PostgreSQL? How does `pg_basebackup` work? What does it copy?
209. `[APPLY]` `{L2}` A developer accidentally runs `DROP TABLE bookings` in production at 14:37. Your last full backup is 2am. How do you recover to 14:36? Walk through the exact steps.
210. `[CONCEPT]` `{L3}` What is `pg_rewind`? When do you need it (after a failover)? What does it do to the old primary?

---

## Isolation Levels & Transactions (Q211–Q250)

211. `[CONCEPT]` `{L1}` What are ACID properties? Define each with a concrete example from a payment system.
212. `[CONCEPT]` `{L1}` What are the four SQL isolation levels? Name them from weakest to strongest.
213. `[CONCEPT]` `{L1}` What is a dirty read? At which isolation level is it possible? Demonstrate it with a two-session psql script.
214. `[CONCEPT]` `{L1}` What is a non-repeatable read? Which isolation level prevents it? Demonstrate with two sessions.
215. `[CONCEPT]` `{L1}` What is a phantom read? Which isolation level prevents it? What is the difference between a phantom read and a non-repeatable read?
216. `[CONCEPT]` `{L2}` What is a serialization anomaly (write skew)? Give the "two doctors scheduling the last on-call shift" example. Which isolation level prevents it?
217. `[CODE]` `{L2}` Write the exact psql two-session script to trigger a write skew anomaly at REPEATABLE READ. Then show how SERIALIZABLE prevents it.
218. `[CONCEPT]` `{L2}` What is SSI (Serializable Snapshot Isolation) in PostgreSQL? How does it detect serialization conflicts without locking?
219. `[DEBUG]` `{L2}` Under SERIALIZABLE isolation, your application gets `ERROR: could not serialize access due to concurrent update`. How do you handle this in application code?
220. `[CONCEPT]` `{L1}` What is PostgreSQL's default isolation level? What is MySQL InnoDB's default? Why does this matter for developers switching between them?
221. `[CONCEPT]` `{L2}` What is an optimistic lock? How do you implement it with a `version` column? Write the SQL.
222. `[CODE]` `{L2}` Implement optimistic locking for PayCore balance updates: `UPDATE accounts SET balance = $1, version = version + 1 WHERE id = $2 AND version = $3`. What do you do when 0 rows are updated?
223. `[CONCEPT]` `{L2}` What is `SELECT FOR UPDATE`? What rows does it lock? What is the difference from a SELECT?
224. `[CODE]` `{L2}` Write the DungBeetle job queue worker using `SELECT FOR UPDATE SKIP LOCKED`. Why is `SKIP LOCKED` essential for concurrent workers?
225. `[CONCEPT]` `{L2}` What is `SELECT FOR SHARE`? When would you use it vs `SELECT FOR UPDATE`?
226. `[CONCEPT]` `{L2}` What are advisory locks in PostgreSQL? What is `pg_advisory_lock` vs `pg_advisory_xact_lock`? When do they release?
227. `[CODE]` `{L2}` Use `pg_advisory_xact_lock(hashtext('seat:' || seat_id))` in BookWise to prevent double-booking. Why is this simpler than a Redis distributed lock for this use case?
228. `[CONCEPT]` `{L2}` What is a deadlock? How does PostgreSQL detect and resolve it? What error does the killed transaction receive?
229. `[DEBUG]` `{L2}` PayCore has recurring deadlocks between `UPDATE accounts WHERE id = $1` and `UPDATE accounts WHERE id = $2` running concurrently. What is the cause and how do you fix it?
230. `[CONCEPT]` `{L2}` What is `lock_timeout` vs `statement_timeout` vs `idle_in_transaction_session_timeout` in PostgreSQL? When do you set each?
231. `[DEBUG]` `{L2}` A production query hangs indefinitely. `pg_stat_activity` shows it's "idle in transaction". What is happening and what do you do?
232. `[CONCEPT]` `{L2}` What is `pg_locks`? Write a query to find all blocking lock chains with the blocking PID and the blocked query.
233. `[CODE]` `{L2}` Write the "find blocking queries" query using `pg_locks` joined with `pg_stat_activity`.
234. `[CONCEPT]` `{L2}` What is a two-phase commit (2PC) in PostgreSQL (`PREPARE TRANSACTION` / `COMMIT PREPARED`)? When is it used?
235. `[CONCEPT]` `{L2}` What is the outbox pattern? How does it guarantee exactly-once Kafka publishing even if the service crashes between the DB write and the Kafka publish?
236. `[CODE]` `{L2}` Implement the transactional outbox: insert into `outbox` table within the same transaction as the main write. Show the schema and the polling worker.
237. `[CONCEPT]` `{L2}` What is the Saga pattern? How do compensating transactions work? Give the PayCore payment Saga.
238. `[CODE]` `{L2}` Write the Saga steps for PayCore: debit sender → credit receiver → publish event. Write the compensating transaction for each step.
239. `[CONCEPT]` `{L2}` What is the difference between a choreography Saga and an orchestration Saga? What are the failure mode differences?
240. `[CODE]` `{L2}` Implement a Saga orchestrator in Go: state machine with steps, compensations, and retry logic.
241. `[CONCEPT]` `{L3}` What is the "dual-write problem"? Why does writing to a DB and publishing to Kafka in two separate operations break exactly-once guarantees?
242. `[CONCEPT]` `{L2}` What is idempotency? How do you implement idempotency keys for PayCore payment creation?
243. `[CODE]` `{L2}` Implement idempotency key deduplication: `INSERT INTO idempotency_keys (key, response) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING`. What do you return on conflict?
244. `[CONCEPT]` `{L2}` What is `SAVEPOINT` in PostgreSQL? How do you use it for nested transactions?
245. `[CODE]` `{L2}` Use `SAVEPOINT` to implement a partial rollback within a larger transaction. Show a concrete use case.
246. `[DEBUG]` `{L3}` Under high concurrency, PayCore's idempotency key check has a race condition despite `ON CONFLICT DO NOTHING`. Why? How do you fix it?
247. `[CONCEPT]` `{L3}` What is a "long transaction"? Why does a long-running transaction block autovacuum and cause table bloat?
248. `[DEBUG]` `{L3}` A transaction that started 2 hours ago is holding row locks and blocking autovacuum on a hot table. What are your options? What is `idle_in_transaction_session_timeout`?
249. `[CONCEPT]` `{L2}` What is `READ COMMITTED` vs `REPEATABLE READ` in PostgreSQL? Is PostgreSQL's REPEATABLE READ actually serializable?
250. `[APPLY]` `{L2}` Choose the correct isolation level for: (a) financial ledger writes, (b) analytics read query, (c) job queue worker, (d) booking availability check. Justify each choice.

---

# PART D — Scaling, Replication & Connection Pooling (Q251–Q310)

---

## Read Replicas & Streaming Replication (Q251–Q270)

251. `[CONCEPT]` `{L1}` What is streaming replication in PostgreSQL? What does the standby receive from the primary?
252. `[CONCEPT]` `{L2}` What is the difference between synchronous and asynchronous replication? What is the durability guarantee of each?
253. `[CONCEPT]` `{L2}` What is `synchronous_standby_names`? How does it enforce synchronous commit to replicas?
254. `[CONCEPT]` `{L2}` What is replication lag? How do you measure it in bytes (`write_lsn - replay_lsn`) and in time?
255. `[DEBUG]` `{L2}` Replication lag on the standby is growing to 60 seconds. What are the three most likely causes?
256. `[CONCEPT]` `{L2}` What is a hot standby? What read operations are safe to run on it? What writes are forbidden?
257. `[CONCEPT]` `{L2}` What is `hot_standby_feedback`? Why might you enable it on a long-running analytics standby?
258. `[CONCEPT]` `{L3}` What is `recovery_min_apply_delay`? When would you want to intentionally delay replica apply (disaster recovery standby)?
259. `[CONCEPT]` `{L2}` What is failover vs switchover? What is `pg_promote()`? What steps are needed to promote a standby?
260. `[CONCEPT]` `{L3}` What is `pg_rewind`? When do you need it after a failover? What does it do to the former primary's data?
261. `[CONCEPT]` `{L2}` What is Patroni? What problem does it solve over manual PostgreSQL replication management?
262. `[DESIGN]` `{L2}` OpenTrace receives 10M spans/sec. Design the PostgreSQL + ClickHouse read-write split: what goes to PostgreSQL? What goes to ClickHouse? Where do replicas go?
263. `[DEBUG]` `{L2}` Your application reads from a read replica. Users report they can't see data they just inserted. What is happening? How do you fix it?
264. `[CONCEPT]` `{L2}` What is consistent reads from a replica? How do you implement "read-your-writes" consistency when using replicas?
265. `[CONCEPT]` `{L3}` What is Citus? How does it extend PostgreSQL for horizontal sharding? What is a coordinator node?
266. `[DESIGN]` `{L2}` BookWise grows to 100M bookings. A single PostgreSQL instance can't handle reads. Design the replica routing: which queries go to primary, which to replica?
267. `[CONCEPT]` `{L3}` What is logical replication in PostgreSQL? How does it differ from physical replication? What can you replicate with logical (selective tables, cross-version)?
268. `[APPLY]` `{L2}` Use logical replication to migrate DungBeetle's jobs table from PostgreSQL 14 to PostgreSQL 16 with zero downtime. Walk through the steps.
269. `[CONCEPT]` `{L3}` What is a replication slot? What is the difference between a physical slot and a logical slot? What happens if a logical slot is not consumed?
270. `[DEBUG]` `{L3}` `pg_wal` is growing unboundedly. `pg_replication_slots` shows an inactive logical replication slot with `confirmed_flush_lsn` far behind. What do you do?

---

## PgBouncer & Connection Pooling (Q271–Q290)

271. `[CONCEPT]` `{L1}` Why does each PostgreSQL connection consume ~5-10MB of memory? What happens when you open 1000 raw connections?
272. `[CONCEPT]` `{L1}` What is PgBouncer? What problem does it solve? What is the difference from a database driver's built-in connection pool?
273. `[CONCEPT]` `{L1}` What are the three PgBouncer pool modes: session, transaction, statement? What operations are safe in each?
274. `[DEBUG]` `{L2}` A developer uses PostgreSQL advisory locks through PgBouncer in transaction mode. The locks behave incorrectly. Why?
275. `[DEBUG]` `{L2}` A developer uses `SET search_path TO tenant_schema` through PgBouncer in transaction mode. It affects other tenants. Why?
276. `[CONCEPT]` `{L2}` What is the connection pool sizing formula? How do you calculate `pool_size = (number_of_cores * 2) + effective_spindle_count`?
277. `[CODE]` `{L2}` Walk through your TCP connection pool biweekly project: how do you parse the pgwire protocol to know when a transaction ends and the connection can be returned to the pool?
278. `[CONCEPT]` `{L2}` What is the pgwire protocol? What is the message format? How does PgBouncer detect query start and end without understanding SQL?
279. `[CONCEPT]` `{L2}` What is `server_idle_timeout` in PgBouncer? What is `client_idle_timeout`? What is `query_timeout`?
280. `[DEBUG]` `{L2}` Under high load, PgBouncer shows `cl_waiting` growing. What does this mean? What are the solutions?
281. `[CONCEPT]` `{L2}` What is `pg_stat_activity` `wait_event = 'ClientRead'`? What does it mean when many connections are in this state?
282. `[CONCEPT]` `{L2}` What is `max_client_conn` vs `max_pool_size` in PgBouncer? How does queuing work when both are exceeded?
283. `[DESIGN]` `{L2}` OpenTrace Collector sends 10K concurrent writes per second. Your PostgreSQL has 200 max connections. Design the PgBouncer configuration with pool sizes and modes.
284. `[DEBUG]` `{L2}` After adding PgBouncer, prepared statements fail with "prepared statement does not exist." Why? What is the PgBouncer setting to fix it?
285. `[CONCEPT]` `{L2}` What is `pgbouncer_stats`? What metrics do you monitor? What is `avg_query_time` telling you?
286. `[TRADEOFF]` `{L2}` PgBouncer session mode vs transaction mode: what is the throughput difference? What features break in transaction mode?
287. `[CODE]` `{L2}` In your TCP connection pool biweekly project, implement health checking: how do you detect a broken backend connection and replace it?
288. `[CONCEPT]` `{L3}` What is Odyssey? What is pgpool-II? How do they compare to PgBouncer?
289. `[DESIGN]` `{L3}` A multi-tenant SaaS with 5000 tenants needs per-tenant connection pools. Can PgBouncer handle 5000 pools? What is the resource cost?
290. `[CONCEPT]` `{L2}` What is `so_reuseport` in PgBouncer? How does it allow multiple PgBouncer processes to share the same port?

---

## Sharding & Partitioning (Q291–Q310)

291. `[CONCEPT]` `{L1}` What is table partitioning? What are the three PostgreSQL partitioning strategies: range, list, hash?
292. `[CONCEPT]` `{L2}` What is partition pruning? How does it reduce query cost? When does it fail (hint: non-immutable functions in WHERE)?
293. `[QUERY]` `{L2}` Create a range-partitioned `spans` table in PostgreSQL, partitioned by month on `created_at`. Create 12 monthly partitions.
294. `[CONCEPT]` `{L2}` What is the overhead of adding a new partition? How do you automate monthly partition creation in PostgreSQL?
295. `[DEBUG]` `{L2}` A query on a partitioned table scans ALL partitions despite a WHERE on the partition key. What are the common causes?
296. `[CONCEPT]` `{L2}` What is the difference between table partitioning (one server) and sharding (multiple servers)? When do you need sharding?
297. `[CONCEPT]` `{L2}` What is horizontal sharding? What is a shard key? What are the tradeoffs of choosing user_id vs created_at as a shard key?
298. `[CONCEPT]` `{L2}` What is consistent hashing? How does it minimize data movement when adding/removing shards?
299. `[DESIGN]` `{L2}` DungBeetle needs to shard its jobs table across 4 PostgreSQL instances. Design the sharding key, routing logic, and cross-shard query strategy.
300. `[CONCEPT]` `{L2}` What are the limitations of sharding? What queries become expensive or impossible after sharding?
301. `[CONCEPT]` `{L3}` What is a hot shard? How do you detect it? How do you resolve it without resharding all data?
302. `[CONCEPT]` `{L2}` What is ClickHouse partitioning vs PostgreSQL partitioning? How does ClickHouse partition pruning work with the `_partition_id` virtual column?
303. `[DESIGN]` `{L3}` OpenTrace spans: 10TB of data across 90 days. Design ClickHouse TTL policies to automatically evict data older than 90 days.
304. `[CONCEPT]` `{L2}` What is a hash partition in PostgreSQL? How does it distribute rows? What is the modulo operation behind it?
305. `[DEBUG]` `{L2}` A range-partitioned table has a "default partition" that's growing out of control. What is the default partition? How do you fix the partition design?
306. `[CONCEPT]` `{L3}` What is declarative partitioning vs inheritance-based partitioning in PostgreSQL? When does each apply?
307. `[QUERY]` `{L2}` Write SQL to attach and detach a partition from a partitioned table without downtime. What does ATTACH PARTITION lock?
308. `[DESIGN]` `{L2}` Design a data retention strategy for OpenTrace: spans older than 30 days should move to cold storage (ClickHouse MergeTree cold tier or S3). What partitioning enables this?
309. `[CONCEPT]` `{L2}` What is `pg_partman`? What does it automate?
310. `[DESIGN]` `{L3}` PayCore transactions: 1B rows growing at 100M/month. Design the long-term partitioning + archival + purge strategy. What is the operational runbook for adding a new partition each month?

---

# PART E — Redis, MongoDB, Elasticsearch & ClickHouse (Q311–Q420)

---

## Redis (Q311–Q360)

311. `[CONCEPT]` `{L1}` What are Redis's 8 data structures? Name them and give one use case for each: String, Hash, List, Set, Sorted Set, Stream, HyperLogLog, Bloom Filter.
312. `[CODE]` `{L1}` Write Redis commands for: set a key with TTL, get and delete atomically (Lua), increment a counter, add to a set, add to a sorted set.
313. `[CONCEPT]` `{L1}` What is Redis's single-threaded model? How does it achieve high throughput without locks?
314. `[CONCEPT]` `{L2}` What is Redis pipelining? What throughput improvement does it provide? When does it fail to help?
315. `[CODE]` `{L2}` Implement a rate limiter using Redis Sorted Set: ZADD with timestamp as score, ZREMRANGEBYSCORE to evict old entries, ZCOUNT to check rate.
316. `[CODE]` `{L2}` Implement a distributed lock in Redis: `SET lock:{resource} {token} NX PX {ttl}`. Write the Lua script for atomic release.
317. `[CODE]` `{L2}` Write the exact Lua script for verify-and-delete for a Redis distributed lock. Why must it be atomic?
318. `[CONCEPT]` `{L2}` What is a Redis Lua script? Why does it run atomically? What is `EVALSHA` vs `EVAL`?
319. `[CODE]` `{L2}` Implement PayCore inventory decrement with floor-at-zero: `DECRBY inventory:{item} {qty}` with a Lua check that prevents going negative.
320. `[CONCEPT]` `{L2}` What is Redis TTL jitter? Why is it important for cache expiry? Implement `TTL = base + random(0, base*0.1)` to prevent cache stampede.
321. `[CONCEPT]` `{L1}` What is cache stampede (dog pile effect)? How does TTL jitter prevent it?
322. `[CODE]` `{L2}` Implement a cache-aside pattern with Redis: check cache → on miss, query DB, write to cache with TTL, return result.
323. `[CONCEPT]` `{L2}` What is write-through caching? Write-behind caching? When does each apply?
324. `[DEBUG]` `{L2}` Redis memory grows without bound. `INFO memory` shows `used_memory: 8GB`. The data should only be 2GB. What are the causes?
325. `[CONCEPT]` `{L2}` What is Redis eviction policy? What are the options: noeviction, allkeys-lru, volatile-lru, allkeys-lfu? When do you use each?
326. `[CONCEPT]` `{L2}` What is Redis persistence? What is RDB snapshotting? What is AOF (Append-Only File)? What are the tradeoffs?
327. `[CONCEPT]` `{L2}` What is `appendfsync always vs everysec vs no`? What are the durability/performance tradeoffs?
328. `[CONCEPT]` `{L2}` What is Redis Replication? What is Redis Sentinel? What is Redis Cluster? When do you need each?
329. `[CONCEPT]` `{L2}` What is Redis Cluster's hash slot mechanism? How are 16384 slots distributed across nodes?
330. `[DEBUG]` `{L2}` A Redis Cluster operation fails with `CROSSSLOT Keys in request don't hash to the same slot`. What is happening? How do you fix it with hash tags `{}`?
331. `[CODE]` `{L2}` Implement BookWise's real-time seat availability using Redis: `SET seat:{id} {status} NX` for atomic seat claim, pipeline for batch status check.
332. `[CODE]` `{L2}` Implement a job queue using Redis List: LPUSH to enqueue, BRPOPLPUSH to atomically dequeue and move to processing list, LREM to acknowledge.
333. `[CODE]` `{L2}` Implement a pub/sub fan-out in Redis for OpenTrace live tail: PUBLISH to channel, SUBSCRIBE from multiple collectors.
334. `[CONCEPT]` `{L2}` What is Redis Streams? How is it different from pub/sub? What is a consumer group in Redis Streams?
335. `[CODE]` `{L2}` Implement a Redis Stream consumer group for distributing span processing across multiple collector instances.
336. `[CONCEPT]` `{L2}` What is `XADD`, `XREADGROUP`, `XACK` in Redis Streams? What does `XPENDING` show?
337. `[DEBUG]` `{L2}` Redis Stream has messages in `XPENDING` that are never acknowledged. What is the likely cause? How do you reclaim stale messages?
338. `[CODE]` `{L2}` Implement DungBeetle's distributed presence system: `HSET presence:{userId} last_seen {ts}`, TTL of 60s, heartbeat every 30s. How do you detect a disconnected user?
339. `[CONCEPT]` `{L2}` What is a Redis HyperLogLog? What is its space complexity? What is its error rate? When would you use it for OpenTrace metrics?
340. `[CODE]` `{L2}` Use Redis HyperLogLog (`PFADD`, `PFCOUNT`) to count unique trace IDs received per minute with O(1) memory.
341. `[CONCEPT]` `{L2}` What is a Redis Bloom filter module? How does it reduce unnecessary DB lookups for "does this key exist"?
342. `[CONCEPT]` `{L2}` What is the SETNX command? Why is it deprecated in favor of `SET NX` with `PX`? What race condition did SETNX have?
343. `[CODE]` `{L2}` Implement a leaderboard using a Redis Sorted Set: `ZADD leaderboard {score} {userId}`, `ZREVRANK` for position, `ZREVRANGE` for top-k.
344. `[DEBUG]` `{L3}` Redis latency spikes to 500ms during RDB snapshot (`BGSAVE`). What is causing it? How do you mitigate it?
345. `[CONCEPT]` `{L3}` What is Redis WAIT command? How does it synchronously wait for replica confirmation for stronger durability guarantees?
346. `[CODE]` `{L2}` Implement OTP storage in Redis: `SET otp:{namespace}:{id} {hashedOTP} EX {ttl} NX`. Write the verify command with attempt counter.
347. `[CONCEPT]` `{L2}` What is Redis `DEBUG SLEEP`? What is `DEBUG QUICKLIST-PACKED-THRESHOLD`? When are these debug commands used?
348. `[DEBUG]` `{L2}` Redis is returning stale data from a replica when the primary just wrote. What is `replica-read-only` and how do you implement read-your-writes?
349. `[CONCEPT]` `{L3}` What is Redis keyspace notifications? How do you subscribe to TTL expiry events? What is the use case for BookWise waitlist?
350. `[CODE]` `{L3}` Subscribe to Redis keyspace notification for key expiry: when a booking reservation key expires, trigger a Kafka message to release the seat.
351. `[CONCEPT]` `{L2}` What is `redis-cli --latency`? What is `redis-cli --hotkeys`? When do you use each in production debugging?
352. `[DEBUG]` `{L2}` A single Redis key is being updated 100K times per second. The instance's CPU is maxed. What is the problem (hot key) and what are the solutions?
353. `[CONCEPT]` `{L2}` What is Redis `OBJECT ENCODING`? Why does a list of integers use `listpack` encoding vs `linkedlist`? What is the threshold?
354. `[TRADEOFF]` `{L2}` Redis vs PostgreSQL for: session storage, rate limiting, distributed locks, job queue, leaderboard. When does PostgreSQL win despite being "slower"?
355. `[CONCEPT]` `{L3}` What is RedisJSON? What is RediSearch? How do they extend Redis for document and search workloads?
356. `[CODE]` `{L2}` Implement a session store in Redis: set session with 24h TTL, sliding expiry (refresh TTL on every access), invalidate on logout.
357. `[CONCEPT]` `{L2}` What is Redis `SCAN` vs `KEYS`? Why should you never use `KEYS *` in production?
358. `[CODE]` `{L2}` Use `SCAN` with a cursor to safely iterate all keys matching pattern `session:*` without blocking Redis.
359. `[CONCEPT]` `{L2}` What is `MULTI`/`EXEC` (Redis transactions)? What is the difference from database transactions? What does `WATCH` enable?
360. `[CODE]` `{L2}` Implement optimistic locking with Redis `WATCH`/`MULTI`/`EXEC` for a seat booking: watch the seat key, check availability, book atomically.

---

## MongoDB (Q361–Q380)

361. `[CONCEPT]` `{L1}` What is MongoDB's document model? How is a document different from a relational row?
362. `[CONCEPT]` `{L1}` What is BSON? How does it differ from JSON? What additional types does it support?
363. `[QUERY]` `{L1}` Write MongoDB queries: insert, findOne, find with filter, update with `$set`, delete, upsert.
364. `[CONCEPT]` `{L2}` What is the aggregation pipeline? What stages exist: `$match`, `$group`, `$project`, `$sort`, `$limit`, `$lookup`, `$unwind`, `$facet`?
365. `[QUERY]` `{L2}` Write a MongoDB aggregation to find the top 5 users by total order amount, filtering orders from the last 30 days.
366. `[CONCEPT]` `{L2}` What is `$lookup`? How does it implement a JOIN between two collections? What are its performance limitations?
367. `[CONCEPT]` `{L2}` What indexes does MongoDB support: single field, compound, multikey, text, geospatial, hashed? When do you use each?
368. `[CONCEPT]` `{L2}` What is the MongoDB `explain()` method? What are the three verbosity modes: queryPlanner, executionStats, allPlansExecution?
369. `[CONCEPT]` `{L2}` What are MongoDB's write concern levels: 0, 1, majority? What are the durability tradeoffs?
370. `[CONCEPT]` `{L2}` What are MongoDB's read concern levels: local, available, majority, linearizable? When does each matter for consistency?
371. `[CONCEPT]` `{L2}` What is a MongoDB replica set? How many nodes? What is the election algorithm?
372. `[CONCEPT]` `{L2}` What is MongoDB's WiredTiger storage engine? What is the document-level locking it provides?
373. `[TRADEOFF]` `{L2}` When would you choose MongoDB over PostgreSQL? Give three specific workload types where MongoDB wins.
374. `[TRADEOFF]` `{L2}` When would you choose PostgreSQL over MongoDB? Give three specific workloads where MongoDB fails.
375. `[DESIGN]` `{L2}` Design a MongoDB schema for OpenTrace span documents: what is the optimal document structure for trace search queries?
376. `[DEBUG]` `{L2}` A MongoDB query is slow despite an index. `explain()` shows the index is being used but scanning 100K keys to return 10 documents. What is the problem?
377. `[CONCEPT]` `{L2}` What is index selectivity in MongoDB? When is an index with low selectivity worse than a collection scan?
378. `[CONCEPT]` `{L2}` What is MongoDB Change Streams? How do you use it as a CDC (Change Data Capture) mechanism?
379. `[CODE]` `{L2}` Write a MongoDB Change Stream listener in Node.js that listens for new documents in the `spans` collection and forwards to Kafka.
380. `[TRADEOFF]` `{L2}` MongoDB vs Elasticsearch for full-text search: what does Elasticsearch do that MongoDB's text index cannot match?

---

## Elasticsearch (Q381–Q400)

381. `[CONCEPT]` `{L1}` What is an inverted index? How does it map terms to document IDs?
382. `[CONCEPT]` `{L1}` What is a document in Elasticsearch? What is a mapping? What is an index?
383. `[CONCEPT]` `{L2}` What is the Elasticsearch write path: client → coordinator → primary shard → replica shards?
384. `[CONCEPT]` `{L2}` What is a shard in Elasticsearch? What is a replica shard? Can you change the number of primary shards after index creation?
385. `[CONCEPT]` `{L2}` What is the BM25 algorithm? How does it score document relevance? What is TF-IDF and why is BM25 better?
386. `[CONCEPT]` `{L2}` What is an analyzer chain? What are the three components: character filters, tokenizer, token filters?
387. `[QUERY]` `{L2}` Write an Elasticsearch query for full-text search on `body` field with a date range filter and relevance scoring.
388. `[CONCEPT]` `{L2}` What is `match` vs `match_phrase` vs `term` vs `terms` query? When do you use each?
389. `[CONCEPT]` `{L2}` What is `filter` context vs `query` context in Elasticsearch? Why do filter queries not affect scoring and are cached?
390. `[CONCEPT]` `{L2}` What are aggregations in Elasticsearch? What are bucket aggregations vs metric aggregations?
391. `[QUERY]` `{L2}` Write an Elasticsearch aggregation to find the top 10 services by error count, faceted by time bucket (1-hour intervals).
392. `[CONCEPT]` `{L2}` What is the `_source` field? What is `_all`? What is `doc_values`? When do you disable each?
393. `[CONCEPT]` `{L2}` What is mapping explosion? What is `dynamic: strict` and when do you enable it?
394. `[DESIGN]` `{L2}` Design an Elasticsearch index for OpenTrace spans: what mappings for trace_id, service_name, duration, timestamp? What analyzers?
395. `[CONCEPT]` `{L2}` What is Elasticsearch's refresh interval? What is the default 1s? What does refreshing do? How do you balance search freshness vs indexing throughput?
396. `[CONCEPT]` `{L2}` What is a segment in Elasticsearch? How does Lucene merge segments? What is the relationship between segment merging and LSM-tree compaction?
397. `[CONCEPT]` `{L3}` What is kNN vector search in Elasticsearch? What is the HNSW index? How does it enable hybrid BM25 + vector search for RAG pipelines?
398. `[CODE]` `{L3}` Write an Elasticsearch hybrid search query: combine BM25 text relevance with vector cosine similarity for semantic search.
399. `[DEBUG]` `{L2}` Elasticsearch JVM heap usage is at 90%. `GET /_cat/nodes` shows `heap.percent = 90`. What actions do you take?
400. `[TRADEOFF]` `{L2}` Elasticsearch vs PostgreSQL full-text search for 10M documents: compare indexing speed, query latency, memory requirements, operational complexity.

---

## ClickHouse (Q401–Q420)

401. `[CONCEPT]` `{L1}` What is ClickHouse? What is it optimized for? Why is it used for OpenTrace span storage?
402. `[CONCEPT]` `{L1}` What is columnar storage? Why is it 10-100x faster than row-oriented storage for aggregation queries?
403. `[CONCEPT]` `{L2}` What is the MergeTree engine in ClickHouse? How does it relate to an LSM-tree?
404. `[CONCEPT]` `{L2}` What is the ORDER BY key in MergeTree? What is the primary key? How do they differ in ClickHouse?
405. `[QUERY]` `{L2}` Create a ClickHouse MergeTree table for spans: trace_id, span_id, service_name, duration_ms, start_time. Design ORDER BY and PARTITION BY.
406. `[CONCEPT]` `{L2}` What is partition pruning in ClickHouse? Why is it crucial for 30-day query windows in OpenTrace?
407. `[DEBUG]` `{L2}` A ClickHouse query on 30 days of spans takes 10 seconds. `EXPLAIN` shows it reads all partitions. What is wrong with the WHERE clause?
408. `[CONCEPT]` `{L2}` What is a ClickHouse `sparse index` (primary key index)? How does it differ from a PostgreSQL B-tree index?
409. `[CONCEPT]` `{L2}` What is a ClickHouse `skipping index`? What index types exist: minmax, set, bloom_filter, tokenbf_v1?
410. `[QUERY]` `{L2}` Add a Bloom filter skipping index to the `service_name` column in the spans table. Show the DDL.
411. `[CONCEPT]` `{L2}` What is a ReplicatedMergeTree? What is ZooKeeper/ClickHouse Keeper's role in it?
412. `[CONCEPT]` `{L2}` What is a DistributedTable in ClickHouse? How does it query across shards?
413. `[CONCEPT]` `{L2}` What is ClickHouse's `MaterializedView`? How do you use it to pre-aggregate data at insert time for fast dashboards?
414. `[QUERY]` `{L2}` Create a ClickHouse materialized view that pre-aggregates span counts per service per minute as spans are inserted.
415. `[CONCEPT]` `{L2}` What is ClickHouse's batch insert requirement? Why must you insert in large batches (1000+ rows) and what happens with small inserts?
416. `[CODE]` `{L2}` Implement the OpenTrace storage layer: batch spans in memory for 500ms or 10K spans (whichever comes first), then INSERT in one batch to ClickHouse.
417. `[CONCEPT]` `{L2}` What is ClickHouse TTL? How do you configure automatic data expiry and data tiering (hot → cold storage)?
418. `[QUERY]` `{L2}` Add a TTL clause to the spans table: delete data older than 90 days, move data older than 7 days to cold storage.
419. `[CONCEPT]` `{L3}` What is the ClickHouse `AggregatingMergeTree`? What is `AggregateFunctionState`? How does it enable incremental aggregation?
420. `[TRADEOFF]` `{L2}` ClickHouse vs Elasticsearch for OpenTrace's trace search: compare query latency, storage cost, aggregation performance, operational complexity.

---

# PART F — Database Design & Selection (Q421–Q500)

---

## Database Selection ADRs (Q421–Q450)

421. `[TRADEOFF]` `{L1}` For a financial ledger (PayCore): PostgreSQL vs MongoDB. Which do you choose and why? Write a 3-bullet ADR.
422. `[TRADEOFF]` `{L1}` For a full-text search feature on 10M documents: PostgreSQL full-text search vs Elasticsearch vs Typesense. When does each win?
423. `[TRADEOFF]` `{L2}` For a job queue (DungBeetle): PostgreSQL `SELECT FOR UPDATE SKIP LOCKED` vs Redis List vs Kafka. When does each approach reach its limits?
424. `[TRADEOFF]` `{L2}` For session storage (OTP gateway): Redis vs PostgreSQL. Why is Redis always correct here?
425. `[TRADEOFF]` `{L2}` For a distributed lock: Redis `SET NX` vs PostgreSQL advisory locks vs ZooKeeper. What are the failure modes of each?
426. `[TRADEOFF]` `{L2}` For a time-series metrics store: ClickHouse vs TimescaleDB vs InfluxDB. Compare query flexibility, storage efficiency, and operational complexity.
427. `[TRADEOFF]` `{L2}` For RAG (Retrieval-Augmented Generation) vector search: PGVector vs Pinecone vs Weaviate. What does PGVector sacrifice vs specialized vector DBs?
428. `[TRADEOFF]` `{L2}` For a user activity feed (write-heavy, ordered): Cassandra vs Redis Sorted Set vs PostgreSQL with partitioning. Design for 100K writes/sec.
429. `[TRADEOFF]` `{L2}` For a product catalog (read-heavy, flexible schema, faceted search): MongoDB vs PostgreSQL + Elasticsearch vs a single Elasticsearch cluster.
430. `[TRADEOFF]` `{L3}` For a graph database (social network friends): PostgreSQL (recursive CTEs) vs Neo4j vs Amazon Neptune. At what scale does PostgreSQL become too slow for graph traversal?
431. `[DESIGN]` `{L2}` RouteMaster: drivers send GPS coordinates every 5 seconds. 100K active drivers. Design the storage layer. What DB stores current location vs historical track?
432. `[DESIGN]` `{L2}` BookWise: store event history for audit. Every state change must be immutable and queryable. Which pattern and DB: event sourcing with Kafka+PostgreSQL or append-only table?
433. `[DESIGN]` `{L2}` DungBeetle: multi-tenant job platform. Each tenant must be isolated. Design the isolation strategy: schema-per-tenant vs row-level security vs separate database.
434. `[DESIGN]` `{L2}` OpenTrace: 1 billion spans per day across 90 days = 90B rows. Design the storage tier: hot (ClickHouse), warm (ClickHouse cold tier), cold (S3 Parquet).
435. `[DESIGN]` `{L2}` PayCore: financial audit log must be tamper-evident. Design an append-only audit trail in PostgreSQL. What makes it tamper-evident?
436. `[DESIGN]` `{L3}` An e-commerce platform has product catalog (read-heavy), orders (write-heavy), search (full-text), and recommendations (vector). Design the polyglot persistence architecture.
437. `[DESIGN]` `{L2}` BookWise grows internationally. Users in India + EU + USA. GDPR requires EU data stays in EU. Design the geo-partitioned database architecture.
438. `[TRADEOFF]` `{L2}` SQLite vs PostgreSQL for a single-binary service deployed on edge nodes. When is SQLite the right choice?
439. `[TRADEOFF]` `{L2}` Redis vs DynamoDB for a serverless rate limiter. Compare latency, cost, and operational complexity at 1M requests/day vs 1B requests/day.
440. `[DESIGN]` `{L3}` Design a CQRS (Command Query Responsibility Segregation) architecture for BookWise: separate write model (PostgreSQL) from read model (Elasticsearch). How do you keep them in sync?

---

## Schema Design & Performance Patterns (Q441–Q500)

441. `[DESIGN]` `{L1}` Design a normalized schema for a simple e-commerce system: users, products, orders, order_items. Name all foreign keys.
442. `[DESIGN]` `{L2}` Design the PayCore schema: accounts, transactions, ledger entries. What constraints prevent double-spending?
443. `[DESIGN]` `{L2}` Design the DungBeetle schema: jobs, workers, job_assignments, job_logs. What indexes support the job queue worker query?
444. `[DESIGN]` `{L2}` Design a multi-tenant schema for BookWise: venues, events, seats, bookings. How do you enforce tenant isolation at the schema level?
445. `[CONCEPT]` `{L2}` What is the EAV (Entity-Attribute-Value) pattern? When is it used? What are its query performance problems?
446. `[CONCEPT]` `{L2}` What is JSONB in PostgreSQL? What operations does it support? When do you use JSONB vs separate columns?
447. `[QUERY]` `{L2}` Query JSONB: extract a nested field, filter by containment `@>`, update a single nested key without replacing the whole document.
448. `[DESIGN]` `{L2}` An API logs every request: method, path, status_code, latency_ms, user_id, timestamp. 1M requests/day. Design the schema for both real-time queries and monthly reports.
449. `[CONCEPT]` `{L2}` What is cursor-based pagination? Write the SQL using `WHERE id > $cursor ORDER BY id LIMIT 50`. Why is this better than OFFSET for large tables?
450. `[CONCEPT]` `{L2}` What is the N+1 query problem? Give an ORM example. Fix it using a JOIN, subquery, or `IN` clause.
451. `[DEBUG]` `{L2}` An ORM generates N+1 queries for a list view. `pg_stat_statements` shows 5000 identical single-row SELECTs. Fix it without changing the ORM.
452. `[DESIGN]` `{L2}` Design a soft-delete pattern: instead of DELETE, set `deleted_at = now()`. What indexes and query patterns must change?
453. `[CONCEPT]` `{L2}` What is a surrogate key vs a natural key? When is each appropriate? What are the B-tree index implications of using UUIDs vs sequential integers?
454. `[DEBUG]` `{L2}` Switching from `SERIAL` (sequential integer) primary key to `UUID` primary key causes index performance regression. Why? (Hint: random inserts vs sequential inserts into B-tree)
455. `[CONCEPT]` `{L2}` What is `gen_random_uuid()` vs `uuid_generate_v4()` vs `uuid_generate_v7()` in PostgreSQL? What is UUID v7 and why is it better for B-tree indexes?
456. `[DESIGN]` `{L2}` Design the OpenTrace spans table for ClickHouse: ORDER BY (trace_id, span_id) enables trace lookups. But what is the cost for service_name queries? Add a secondary skip index.
457. `[CONCEPT]` `{L2}` What is connection leak? How does it manifest in `pg_stat_activity`? What causes it in Go applications using `database/sql`?
458. `[DEBUG]` `{L2}` `pg_stat_activity` shows 500 idle connections from `go-service`. But `max_connections = 200`. The database accepts no more connections. How is this possible? (Hint: PgBouncer pool exhaustion)
459. `[CONCEPT]` `{L2}` What is `database/sql` in Go? What is `db.SetMaxOpenConns`, `db.SetMaxIdleConns`, `db.SetConnMaxLifetime`? How do you size these for OpenTrace?
460. `[CODE]` `{L2}` Write a Go function using `database/sql` that correctly handles: acquiring a connection from the pool, executing a query, returning the connection, and handling context cancellation.
461. `[CONCEPT]` `{L2}` What is `sqlc`? How does it generate type-safe Go code from SQL queries? What does the workflow look like?
462. `[CODE]` `{L2}` Write a `sqlc` query definition for DungBeetle: `GetPendingJobs(ctx, tenantID, limit)` using `SELECT FOR UPDATE SKIP LOCKED`.
463. `[CONCEPT]` `{L2}` What is a database migration tool? What is the difference between `golang-migrate`, `goose`, and `flyway`? What is the "up/down" migration concept?
464. `[CODE]` `{L2}` Write a `golang-migrate` migration to add a partial index on `jobs(tenant_id) WHERE status='pending'`.
465. `[DEBUG]` `{L2}` A migration runs in staging but fails in production with "lock timeout exceeded." The target table has 500M rows. What happened and what is the safe approach?
466. `[CONCEPT]` `{L2}` What is an advisory lock in database migration tools? Why do `golang-migrate` and `flyway` use them to prevent concurrent migration runs?
467. `[DESIGN]` `{L2}` Design a zero-downtime deployment for a schema change that adds a NOT NULL column with a default value to a 1B row table. What are the three phases?
468. `[CONCEPT]` `{L2}` What is `pg_repack`? How does it rebuild a table without a long exclusive lock?
469. `[DEBUG]` `{L3}` A `VACUUM FULL` on a 500GB table takes 2 hours and holds an exclusive lock the entire time. What is the alternative for production?
470. `[CONCEPT]` `{L2}` What is `EXPLAIN (ANALYZE, BUFFERS)`? What does `Buffers: shared hit=X read=Y` tell you about cache behavior?
471. `[DEBUG]` `{L2}` A query shows `Buffers: shared read=100000` in EXPLAIN. What does this mean? How do you reduce physical reads?
472. `[CONCEPT]` `{L2}` What is `shared_buffers` in PostgreSQL? What is the recommended setting? What is the effect of setting it too low vs too high?
473. `[CONCEPT]` `{L2}` What is `effective_cache_size` in PostgreSQL? How does it affect the planner? What does it NOT actually do?
474. `[CONCEPT]` `{L2}` What is `random_page_cost`? What should you set it to on SSDs vs HDDs? How does it affect index vs seq scan decisions?
475. `[CONCEPT]` `{L3}` What is `pg_buffercache`? How do you inspect what's in PostgreSQL's shared_buffers?
476. `[CODE]` `{L2}` Write a query using `pg_buffercache` to find which tables are consuming the most shared buffer pages.
477. `[CONCEPT]` `{L2}` What is connection overhead in PostgreSQL? What is the cost of a new connection in ms? How does PgBouncer reduce this to near-zero?
478. `[DESIGN]` `{L2}` Design the database monitoring stack for OpenTrace: what PostgreSQL metrics do you export to Prometheus? List 10 critical metrics.
479. `[CONCEPT]` `{L2}` What is `pg_stat_statements`? What is the `mean_exec_time` column? What threshold do you alert on?
480. `[CODE]` `{L2}` Write the SQL query to find the top 10 slowest queries in `pg_stat_statements` by `mean_exec_time`.
481. `[DEBUG]` `{L3}` `pg_stat_statements` shows a query with `rows = 0` but `mean_exec_time = 500ms`. What kind of query is this? (Hint: write-heavy UPDATE with lock contention)
482. `[CONCEPT]` `{L2}` What is `pg_stat_bgwriter`? What does `checkpoints_timed` vs `checkpoints_req` tell you? What does a high `checkpoints_req` mean?
483. `[DEBUG]` `{L3}` `pg_stat_bgwriter` shows `buffers_clean = 0` and `maxwritten_clean > 0`. What does this mean? What should you adjust?
484. `[CONCEPT]` `{L2}` What is `wal_buffers` in PostgreSQL? How does increasing it from the default 4MB help write-intensive workloads?
485. `[CONCEPT]` `{L3}` What is `huge_pages` in PostgreSQL? When does enabling huge pages (2MB pages) help performance vs 4KB pages?
486. `[CONCEPT]` `{L2}` What is `track_io_timing`? Why is it disabled by default? How does it help diagnose I/O-bound queries in EXPLAIN output?
487. `[DESIGN]` `{L2}` OpenTrace Collector inserts 10M spans/sec. Design the batch insert pipeline in Go: buffering strategy, flush interval, error handling on partial batch failure.
488. `[CODE]` `{L2}` Implement a PostgreSQL batch upsert using `COPY` command for bulk loading. Compare throughput to individual INSERTs.
489. `[CONCEPT]` `{L2}` What is the `COPY` command in PostgreSQL? Why is it 10-100x faster than INSERT for bulk loading?
490. `[CONCEPT]` `{L2}` What is `pgstattuple`? How do you use it to measure dead tuple ratio and index bloat?
491. `[DESIGN]` `{L3}` Design a database observability dashboard in Grafana for OpenTrace: what panels, what queries, what alerts? List 10 specific panels.
492. `[CONCEPT]` `{L2}` What is connection string pooling vs proxy pooling? When does PgBouncer proxy pooling have less latency than a driver-level pool?
493. `[DEBUG]` `{L2}` A batch job reads 100M rows from PostgreSQL and runs for 4 hours. Memory usage on the application grows linearly. Why? What is `db.QueryRows` doing? How do you fix it with a cursor?
494. `[CODE]` `{L2}` Implement server-side cursor in PostgreSQL using `DECLARE cursor FOR SELECT...` and `FETCH 1000 FROM cursor`. Why does this prevent OOM?
495. `[CONCEPT]` `{L2}` What is `idle_in_transaction_session_timeout`? Why do you always set it in production? What value?
496. `[CONCEPT]` `{L2}` What is `statement_timeout`? What is a good default for API queries vs batch jobs?
497. `[DEBUG]` `{L3}` A query returns different results on two identical replicas with `synchronous_commit = off`. Explain why this is possible and what the correct setting is for read-your-writes.
498. `[DESIGN]` `{L3}` Design a complete PostgreSQL high-availability setup for PayCore: primary + 2 synchronous replicas + 1 async replica + PgBouncer + Patroni + monitoring. Draw the architecture.
499. `[CONCEPT]` `{L3}` What is `pg_upgrade`? What are the two methods: pg_dumpall vs link mode vs clone mode? How do you upgrade PostgreSQL with zero downtime?
500. `[APPLY]` `{L2}` Final synthesis: You are the backend engineer for OpenTrace. It's 3am. PagerDuty fires: "ClickHouse query p99 > 2000ms, PostgreSQL connections exhausted, Kafka consumer lag growing." Walk through your exact investigation and remediation steps for each alert simultaneously.
