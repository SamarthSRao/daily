# RouteMaster — Project Specification
## Logistics & Notifications Platform

**Role:** Logistics & Notifications Platform  
**Stack:** Next.js · Go · Elasticsearch · Kafka · Redis · PostgreSQL

---

## 1. Project Overview

RouteMaster is a logistics and real-time notifications platform built with Go and Next.js, demonstrating fan-out notifications at scale, Elasticsearch full-text search, a Bloom-filter-backed web crawler, and real-time order tracking via WebSocket. It integrates directly with the Notification Delivery Service (a standalone biweekly project) for multi-channel delivery and serves as the primary consumer of DungBeetle's job queue for async work.

---

## 2. Key Demonstrations

- Fan-out notifications at scale — 10,000 simultaneous delivery confirmations
- Elasticsearch full-text search with BM25 relevance scoring and faceted filters
- Bloom-filter-backed web crawler — avoids re-crawling seen URLs in O(1) space
- Real-time order tracking via WebSocket with Redis pub/sub fan-out
- Kafka-backed notification pipeline with at-least-once delivery guarantees
- Next.js Server Components with SSE for live shipment status updates

---

## 3. Architecture

| Component | Technology | Responsibility |
|---|---|---|
| Order Service | Go + PostgreSQL | Order lifecycle, status transitions, driver assignment |
| Tracking Service | Go + WebSocket + Redis | Real-time location updates, fan-out to connected clients |
| Search Service | Go + Elasticsearch | Full-text shipment search, faceted filters, relevance |
| Crawler | Go + Bloom filter | Address/logistics data crawling, deduplication |
| Notification Pipeline | Kafka + Delivery Service | Fan-out dispatch, multi-channel delivery, receipts |
| Frontend | Next.js + SSE | Order tracker, live map, search UI, notification feed |

---

## 4. Technical Depth

### Fan-Out Notifications at Scale

When a shipment status changes, a Kafka event triggers the Notification Pipeline. The fan-out worker reads all subscribers for the shipment (sender, receiver, account manager) and dispatches to the Notification Delivery Service via its REST API. The Delivery Service handles multi-channel routing (email, SMS, push, webhook). The fan-out is parallelised with a Go `errgroup` — all 10,000 notifications are dispatched concurrently with a semaphore to prevent connection pool exhaustion.

### Elasticsearch Full-Text Search

Shipment search uses Elasticsearch with a BM25 relevance scorer. The index maps: `origin_address` (text, analyzed), `destination_address` (text, analyzed), `carrier_name` (keyword), `status` (keyword), `created_at` (date). Queries combine full-text match on addresses with term filters on status and date range. Faceted search returns aggregation buckets: by carrier, by status, by date. The ADR documents the decision to use Elasticsearch over PostgreSQL full-text search at this data volume.

### Bloom Filter Web Crawler

The logistics data crawler collects address and carrier information from public sources. A Bloom filter (false positive rate: 0.1%) tracks seen URLs in O(1) space — far more memory-efficient than a visited set. Before fetching a URL, the filter is checked; only URLs that pass (not seen) are fetched. The filter is persisted to Redis on shutdown and reloaded on startup. False positive rate is measured and documented in `BENCHMARKS.md`.

### Real-Time Order Tracking

Driver location updates flow: Driver app → Go WebSocket server → Redis pub/sub → all connected tracking clients. Redis pub/sub enables horizontal scaling: any WebSocket server node can fan-out updates to its connected clients regardless of which node the driver is connected to. The WebSocket server uses `gorilla/websocket` with a ping/pong keepalive (30s interval). The presence registry uses Redis HSET with a 60s TTL.

---

## 5. Data Model

- `orders (id, sender_id, recipient_id, status, driver_id, created_at, updated_at)`
- `shipment_events (id, order_id, event_type, location POINT, metadata JSONB, created_at)`
- `notification_subscriptions (id, order_id, user_id, channels TEXT[], created_at)`
- `crawler_seeds (id, url, domain, crawled_at, status)`
- Elasticsearch index: `shipments (origin, destination, carrier, status, created_at)`

---

## 6. Benchmarks

| Metric | Result |
|---|---|
| Fan-out throughput | 10,000 notifications dispatched in < 2s (errgroup + semaphore) |
| WebSocket connections | 5,000 concurrent tracking sessions, < 50ms delivery p99 |
| Elasticsearch search p99 | < 80ms (full-text + facet, 1M documents) |
| Crawler throughput | 500 URLs/sec, Bloom filter false positive rate: 0.08% |
| Order status update latency | < 100ms from driver app to tracking client |

---

## 7. Non-Negotiable Rules

- `go test -race ./...` passes — concurrent WebSocket fan-out has race conditions
- `goleak.VerifyNone(t)` — goroutine leaks in tracking server accumulate over hours
- Fan-out semaphore tuned: connection pool exhaustion tested and prevented
- Bloom filter false positive rate measured and documented
- `EXPLAIN ANALYZE` on every PostgreSQL query, Elasticsearch `explain` on every search
- WebSocket ping/pong tested: dead connections purged within 2 TTL windows

---

## 8. Infraspec Requirement Mapping

| Infraspec Requirement | How This Project Delivers It |
|---|---|
| NoSQL and Elasticsearch | Full-text search, BM25, faceted aggregations, hybrid search |
| Real-time systems | WebSocket, SSE, Redis pub/sub, distributed presence |
| Event-driven architecture | Kafka fan-out, outbox pattern, notification pipeline |
| 0-to-1 product experience | Full logistics product, ground-up, with live tracking UI |
| Performance engineering | Fan-out concurrency, semaphore tuning, p99 benchmarks |
