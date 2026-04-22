# Biweekly 08 — `switchboard` · API Gateway · TypeScript
**Stack:** TypeScript · Node.js 22 · Express 5 · Redis · JWT (`jose`) · Zod · SSE proxy · Docker
**Interface:** HTTP reverse proxy on `:3000` — routes to upstream services by path prefix
**Consumed by:** BookWise (all external traffic), RouteMaster (all external traffic), OpenTrace UI (API gateway)
**Teaches:** JWT RS256 verification, rate limiting (token bucket + sliding window), circuit breaker pattern, SSE proxying, L7 routing, request tracing, Node.js `http.request` streams

## What It Is
A lightweight API gateway written entirely in TypeScript. It verifies JWTs, rate-limits per client, proxies requests to the correct upstream service, adds `traceparent` headers, and handles SSE passthrough. The building block nature: BookWise and RouteMaster sit entirely behind `switchboard` — their backends never deal with auth, rate limiting, or routing.

**Why TypeScript here:** API gateways are overwhelmingly Node.js/TypeScript in Indian product companies (Kong's plugins, custom Express gateways at Razorpay/Zepto). The Node.js `http` module's streaming request proxy — piping the request body to the upstream and the response body back — is a genuine Node.js depth exercise. JWT verification with `jose` (RSA public key verification without a secret shared across services), and sliding window rate limiting with Redis Lua, are the security depth points.

## Stack Detail
| Layer | Tech | Depth Point |
|---|---|---|
| Language | TypeScript (Node.js 22) strict | `node:http` streaming proxy, `AsyncLocalStorage` for request context |
| Framework | Express 5 | Middleware chain: auth → rate limit → route → proxy |
| JWT | `jose` library (JWKS endpoint) | RS256 verification with public key — private key stays in auth service |
| Rate limiting | Redis Lua (sliding window log) | Per-client per-route limits; atomic Redis script |
| Circuit breaker | State machine in memory | Closed → Open → Half-Open; fast-fail on upstream errors |
| SSE proxy | Node.js `http.request` + pipe | `text/event-stream` responses piped transparently to clients |
| Routing | Config-driven route table | JSON config: `{ "/api/bookings": "http://bookwise:8080" }` |
| Tracing | OTel Node.js SDK | Inject `traceparent` header on every proxied request |
| Metrics | Prometheus | `switchboard_requests_total{route,status}`, `switchboard_upstream_latency_seconds` |
| Testing | Vitest + Supertest + `nock` | Mock upstreams; test circuit breaker transitions |

## JWT RS256 Verification (No Shared Secret)
```typescript
import { jwtVerify, createRemoteJWKSet } from 'jose';

const JWKS = createRemoteJWKSet(new URL(env.AUTH_JWKS_URL));

async function verifyJWT(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, JWKS, {
    algorithms: ['RS256'],
    audience:   'api.platform',
    issuer:     'auth.paycore.dev',
  });
  return payload;
}
// RS256: auth service signs with private key
//        switchboard verifies with public key from JWKS endpoint
//        private key NEVER leaves the auth service
```

## Sliding Window Rate Limiter (Redis Lua)
```typescript
const slidingWindowScript = `
  local key    = KEYS[1]
  local now    = tonumber(ARGV[1])
  local window = tonumber(ARGV[2])
  local limit  = tonumber(ARGV[3])

  redis.call('ZREMRANGEBYSCORE', key, 0, now - window * 1000)
  local count = redis.call('ZCARD', key)
  if count < limit then
    redis.call('ZADD', key, now, now .. math.random())
    redis.call('EXPIRE', key, window)
    return 1
  end
  return 0
`;
async function checkRateLimit(clientId: string, route: string): Promise<boolean> {
  const key = `rl:${clientId}:${route}`;
  const result = await redis.eval(slidingWindowScript, 1, key, Date.now(), 60, 100);
  return result === 1;  // true = allowed
}
```

## Circuit Breaker
```typescript
type CBState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

class CircuitBreaker {
  private state: CBState = 'CLOSED';
  private failures = 0;
  private lastFailure = 0;

  async call<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailure > 30_000) {
        this.state = 'HALF_OPEN';  // try one request
      } else {
        throw new ServiceUnavailableError();  // fast fail — no upstream call
      }
    }
    try {
      const result = await fn();
      if (this.state === 'HALF_OPEN') { this.state = 'CLOSED'; this.failures = 0; }
      return result;
    } catch (err) {
      this.failures++;
      this.lastFailure = Date.now();
      if (this.failures > 5) this.state = 'OPEN';
      if (this.state === 'HALF_OPEN') this.state = 'OPEN';
      throw err;
    }
  }
}
```

## SSE Transparent Proxy
```typescript
// SSE needs special handling: no buffering, flush headers immediately
app.use('/stream/*', async (req, res) => {
  const upstream = routes[req.path];
  const proxyReq = http.request(upstream + req.url, {
    method: req.method,
    headers: { ...req.headers, 'x-trace-id': traceCtx.getStore()?.traceId },
  });

  proxyReq.on('response', (proxyRes) => {
    // For SSE: pipe directly, don't buffer
    if (proxyRes.headers['content-type']?.includes('text/event-stream')) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.flushHeaders();
      proxyRes.pipe(res);  // streaming pipe — no buffering
    } else {
      res.writeHead(proxyRes.statusCode!, proxyRes.headers);
      proxyRes.pipe(res);
    }
  });

  req.pipe(proxyReq);  // pipe request body to upstream
});
```

## Route Config
```json
{
  "routes": [
    { "prefix": "/api/bookings",   "upstream": "http://bookwise-api:8080",    "rateLimit": 100 },
    { "prefix": "/api/orders",     "upstream": "http://routemaster-api:8080", "rateLimit": 200 },
    { "prefix": "/api/otp",        "upstream": "http://gatekeeper:3000",      "rateLimit": 10 },
    { "prefix": "/stream/seats",   "upstream": "http://bookwise-api:8080",    "sse": true },
    { "prefix": "/stream/tracking","upstream": "http://routemaster-api:8080", "sse": true }
  ]
}
```

## Checklist
- [ ] JWT RS256 verification via JWKS endpoint (`jose`)
- [ ] Sliding window rate limiter: Redis Lua script, per-client per-route
- [ ] Circuit breaker: Closed/Open/Half-Open state machine, per upstream
- [ ] HTTP reverse proxy: `req.pipe(proxyReq)`, `proxyRes.pipe(res)`
- [ ] SSE passthrough: detect `text/event-stream`, pipe without buffering
- [ ] `traceparent` header injection on every proxied request (OTel W3C format)
- [ ] `AsyncLocalStorage` for request context (traceId, clientId) through middleware chain
- [ ] Config-driven routing from JSON file (hot-reload on SIGHUP)
- [ ] Prometheus metrics: requests/sec by route+status, upstream latency histogram
- [ ] `tsc --noEmit` + `strict: true` — no `any`
- [ ] Vitest: circuit breaker transitions, rate limit enforcement, JWT validation
- [ ] Supertest + `nock`: mock upstreams for integration tests

## Benchmarks
| Metric | Target |
|---|---|
| Proxy overhead (added latency) | < 2ms p99 |
| JWT verification p99 | < 1ms (cached JWKS) |
| Rate limit check (Redis Lua) | < 1ms p99 |
| Circuit breaker open — requests rejected | 100% fast-fail (no upstream call) |
| Throughput | 10K req/sec on single Node.js process |
