# Biweekly 07 — `gatekeeper` · OTP Gateway · TypeScript
**Stack:** TypeScript · Node.js 22 · Express 5 · Redis · `crypto` module · Zod · Vitest · Docker
**Interface:** REST `PUT /api/otp/:id` (generate+send) · `POST /api/otp/:id` (verify) · `GET /api/otp/:id/status`
**Consumed by:** PayCore (wire transfer 2FA), BookWise (booking confirmation), RouteMaster (driver registration)
**Teaches:** `crypto.randomInt` vs `Math.random` for cryptographic secrets, Redis as ephemeral TTL store, multi-tenancy at API level, hash-before-store, rate limiting, `timingSafeEqual`

## What It Is
A self-hosted, multi-tenant OTP verification service. Any project needing 2FA or phone/email verification calls `gatekeeper` with three endpoints. Each project gets its own namespace and secret. OTPs are generated with CSPRNG, hashed before storage, rate-limited, and delivered via `herald`.

**Why TypeScript here:** This is the Month 2 Node.js deep-dive project. Node.js's `crypto` module — `randomInt`, `createHash`, `timingSafeEqual`, `createHmac` — is the exact API you study. Express middleware chains, `ioredis` TTL patterns, and Zod validation are applied at production depth. The multi-tenant design teaches TypeScript interface segregation with real security constraints.

## Stack Detail
| Layer | Tech | Depth Point |
|---|---|---|
| Language | TypeScript (Node.js 22) strict | `crypto` module — `randomInt`, `createHash`, `timingSafeEqual` |
| Framework | Express 5 + Zod | Request validation; typed route handlers |
| OTP storage | Redis `SETEX otp:{ns}:{id} {ttl} {hashedOTP}` | Ephemeral — OTPs expire automatically; Redis TTL is the lifecycle |
| Hashing | `crypto.createHash('sha256')` | Never store raw OTP — hash + compare on verify |
| Generation | `crypto.randomInt(100000, 999999)` | CSPRNG — `Math.random()` is predictable |
| Rate limiting | Redis `INCR otp:attempts:{ns}:{id}` + TTL | Max 5 verification attempts per OTP |
| Delivery | HTTP call to `herald` | OTP sent via the notification building block |
| Auth | HTTP Basic Auth per tenant | `Authorization: Basic base64(namespace:secret)` |
| Testing | Vitest + Supertest + `ioredis-mock` | Unit + integration; `tsc --noEmit` in CI |

## Why `crypto.randomInt`, Not `Math.random`
```typescript
// ❌ NEVER for security: Math.random is a PRNG — predictable from observed outputs
const otp = Math.floor(Math.random() * 900000 + 100000).toString();

// ✅ CSPRNG — reads from OS /dev/urandom, cryptographically unpredictable
import { randomInt, createHash, timingSafeEqual } from 'node:crypto';
const otp = randomInt(100000, 1000000).toString();

// ❌ NEVER store raw OTP
await redis.setex(key, 300, otp);

// ✅ Hash before storing — if Redis is compromised, OTPs are not exposed
const hashed = createHash('sha256').update(otp).digest('hex');
await redis.setex(key, 300, hashed);

// ✅ Timing-safe comparison — prevents timing oracle attacks
const submitted = createHash('sha256').update(req.body.otp).digest('hex');
const match = timingSafeEqual(Buffer.from(hashed), Buffer.from(submitted));
```

## Multi-Tenant Namespace
```typescript
// Each tenant: isolated namespace, own secret, own TTL config
type Tenant = { secret: string; defaultTtlSeconds: number; maxAttempts: number };
const tenants: Record<string, Tenant> = {
  paycore:     { secret: env.PAYCORE_SECRET,     defaultTtlSeconds: 300, maxAttempts: 5 },
  bookwise:    { secret: env.BOOKWISE_SECRET,    defaultTtlSeconds: 600, maxAttempts: 3 },
  routemaster: { secret: env.ROUTEMASTER_SECRET, defaultTtlSeconds: 300, maxAttempts: 5 },
};
// Redis keys always namespaced:
// otp:{namespace}:{id}            → hashed OTP
// otp:attempts:{namespace}:{id}  → attempt counter
// otp:verified:{namespace}:{id}  → verified flag (TTL 1 hour)
```

## Rate Limiting
```typescript
const attemptsKey = `otp:attempts:${namespace}:${id}`;
const attempts = await redis.incr(attemptsKey);
if (attempts === 1) await redis.expire(attemptsKey, tenant.defaultTtlSeconds);
if (attempts > tenant.maxAttempts) {
  return res.status(429).json({ error: 'Too many attempts. Request a new OTP.' });
}
```

## Request Lifecycle
```
PUT /api/otp/wire-transfer-usr123
  1. Basic Auth → validate namespace + secret
  2. crypto.randomInt(100000, 999999) → otp
  3. sha256(otp) → hash
  4. SETEX otp:{ns}:{id} 300 {hash}
  5. POST herald /v1/notifications (send OTP via SMS/email)
  6. Return 200 { expires_in: 300 }

POST /api/otp/wire-transfer-usr123  { "otp": "847291" }
  1. INCR otp:attempts:{ns}:{id} → check max
  2. GET otp:{ns}:{id} → storedHash
  3. timingSafeEqual(sha256(submitted), storedHash)
  4. On match: DEL otp key, SET otp:verified:{ns}:{id} (TTL 1h)
  5. Return 200 { verified: true }
```

## Checklist
- [ ] Express app with Basic Auth middleware (verify against tenant config)
- [ ] Zod schema on all request bodies
- [ ] `PUT /api/otp/:id` — generate, hash, SETEX, call herald
- [ ] `POST /api/otp/:id` — rate check, timingSafeEqual hash compare
- [ ] `GET /api/otp/:id/status` — check verified flag
- [ ] OpenAPI 3.0 spec auto-generated (`zod-to-openapi`), Swagger UI at `/docs`
- [ ] Vitest unit: generation, hashing, rate limiting, timing-safe compare
- [ ] Supertest integration: full OTP lifecycle with `ioredis-mock`
- [ ] `tsc --noEmit` + `strict: true` — no `any` anywhere
- [ ] Docker multi-stage (build → alpine), non-root user

## Benchmarks
| Metric | Target |
|---|---|
| OTP generation + Redis write p99 | < 5ms |
| OTP verification p99 | < 3ms |
| Rate limit enforcement | 5 attempts max (test verifies) |
| OTP entropy | ~20 bits — documented in README |
