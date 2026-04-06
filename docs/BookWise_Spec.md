# BookWise — Project Specification
## Distributed Seat Reservation System

**Role:** Distributed Seat Reservation System  
**Stack:** Go · PostgreSQL · Redis · Kafka · gRPC · Next.js

---

## 1. Project Overview

BookWise is a distributed seat reservation system built in Go, demonstrating the classical concurrency and correctness problems of booking systems at scale: distributed locking with fencing tokens, double-booking prevention under 10,000 concurrent users, payment Saga choreography, and a waitlist state machine. Every reservation is guaranteed to be mutually exclusive. Every payment failure releases the held seat.

---

## 2. Key Demonstrations

- Distributed locks with fencing tokens — prevents double-booking under high concurrency
- Double-booking prevention verified at 10,000 concurrent users (k6)
- Payment Saga — reserve seat → charge payment → confirm booking with compensation
- Waitlist state machine — automatic promotion when a cancellation occurs
- `SELECT FOR UPDATE SKIP LOCKED` — correct row-level locking for seat holds
- Isolation level demos — dirty read, non-repeatable read, phantom read triggered live in psql

---

## 3. Architecture

| Component | Technology | Responsibility |
|---|---|---|
| Booking Service | Go + PostgreSQL | Seat availability, reservation creation, hold management |
| Lock Service | Go + Redis | Distributed locks, fencing tokens, TTL-based expiry |
| Payment Gateway | Go + Kafka + Saga | Payment processing, Saga orchestration, compensation |
| Waitlist Engine | Go + PostgreSQL | Queue management, automatic promotion, notifications |
| Query Service | Go + gRPC | Read-optimised availability queries, Redis cache |
| Frontend | Next.js + Tanstack Query | Seat map, booking flow, waitlist position tracker |

---

## 4. Technical Depth

### Distributed Locking with Fencing Tokens

A seat hold acquires a Redis distributed lock with a monotonically increasing fencing token. The token is included in every subsequent database write. If an expired lock holder attempts a late write, the database rejects it (`token < current_token`). This eliminates the race condition where a slow process holds an expired lock and overwrites a newer reservation. Correctness test: 10,000 goroutines simultaneously attempt to book the same seat — exactly one succeeds.

### SELECT FOR UPDATE SKIP LOCKED

Seat availability queries use `SELECT ... FOR UPDATE SKIP LOCKED` to atomically claim a seat row without blocking other workers on already-locked rows. This is the correct pattern for a reservation system: a worker picks only rows it can immediately lock, processes them, and releases. Workers never block each other. The pattern is documented in an ADR comparing it to optimistic locking.

### Payment Saga — Seat Reservation Flow

The booking flow is a three-step Saga:
1. **Hold seat** — acquire distributed lock, mark seat as `HELD`
2. **Charge payment** — call payment gateway via Kafka event
3. **Confirm booking** — update seat to `CONFIRMED`, release lock

On payment failure, a compensating event releases the hold and returns the seat to `AVAILABLE`. If the process crashes between steps, the hold TTL (120s) expires and the seat is automatically released.

### Waitlist State Machine

When a booking is cancelled, the Waitlist Engine is notified via a Kafka event. The engine promotes the first eligible waitlist entry: notifies the user, initiates a payment Saga, and starts a 15-minute confirmation window. If the promoted user fails to confirm, the next waitlist entry is promoted.

State transitions: `WAITING → OFFERED → CONFIRMED | EXPIRED → WAITING (next user)`

---

## 5. Data Model

- `seats (id, event_id, section, row, number, status, held_until, fencing_token)`
- `reservations (id, seat_id, user_id, status, payment_id, idempotency_key, created_at)`
- `waitlist (id, event_id, user_id, position, status, offered_at, expires_at)`
- `payment_events (id, reservation_id, event_type, payload JSONB, created_at)`
- `outbox (id, topic, payload, published_at)`

---

## 6. Benchmarks

| Metric | Result |
|---|---|
| Concurrent booking test | 10,000 goroutines, 1 seat — exactly 1 succeeds (k6) |
| Seat hold acquisition p99 | < 10ms (Redis SETNX + fencing token) |
| Booking throughput | 3,000 reservations/min under load |
| Waitlist promotion latency | < 500ms from cancellation to notification |
| Payment Saga p99 | < 2s end-to-end (hold → charge → confirm) |

---

## 7. Non-Negotiable Rules

- `go test -race ./...` passes — concurrent seat access is the core correctness problem
- Fencing token correctness test: 10K concurrent attempts, exactly 1 succeeds
- Saga compensation: payment failure triggers seat release, verified
- Waitlist promotion: cancellation triggers automatic promotion, verified
- `EXPLAIN ANALYZE` on every query — zero seq scans on seats/reservations tables
- Isolation level anomaly demos — phantom read triggered live in psql

---

## 8. Infraspec Requirement Mapping

| Infraspec Requirement | How This Project Delivers It |
|---|---|
| Distributed systems depth | Fencing-token distributed locks, exactly-once reservation |
| 0-to-1 product experience | Full booking product built ground-up, Week 1 to production |
| SQL and PostgreSQL depth | SELECT FOR UPDATE SKIP LOCKED, isolation levels, partitioning |
| Event-driven architecture | Saga choreography, Kafka outbox, waitlist state machine |
| Debugging + production issues | Concurrent lock contention, phantom read demo, PITR drill |
