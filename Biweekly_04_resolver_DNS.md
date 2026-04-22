# Biweekly 04 — `resolver` · Recursive DNS Resolver · Go
**Stack:** Go · `net` UDP stdlib · binary protocol parsing · in-memory TTL cache
**Interface:** UDP `:5353` (standard DNS wire protocol) · REST `GET /resolve?name=X&type=A`
**Consumed by:** All services in Docker network (debug DNS), infrastructure tooling
**Teaches:** Binary protocol parsing at byte level, UDP vs TCP, DNS delegation chain, TTL caching

## What It Is
A fully recursive DNS resolver starting from root hints. Exposes standard DNS UDP for use as a network-level DNS server, plus a REST API for debugging which DNS lookups your services are making. The building block nature: every project in the Docker Compose network uses `resolver` as its DNS — you see every lookup, its TTL, and which server answered.

## Stack Detail
| Layer | Tech | Why |
|---|---|---|
| Language | Go 1.23+ | `net.ListenUDP`, `encoding/binary`, manual byte slice parsing |
| Transport | UDP primary, TCP fallback | DNS uses UDP; TCP when response > 512 bytes (TC bit set) |
| Cache | `sync.Map` + TTL expiry goroutine | Respect TTL from response; jitter ±10% |
| Root hints | Hardcoded `[]string` | Same list every production resolver uses |
| REST API | `net/http` stdlib | `GET /resolve` for debugging, `GET /cache` to inspect current cache |
| Metrics | Prometheus | Cache hit rate, resolution time per upstream server |

## DNS Wire Format (What You Parse)
```
Header (12 bytes): ID:16 FLAGS:16 QDCOUNT:16 ANCOUNT:16 NSCOUNT:16 ARCOUNT:16
Question: QNAME(length-prefixed labels) QTYPE:2 QCLASS:2
Answer:   NAME:2(pointer) TYPE:2 CLASS:2 TTL:4 RDLENGTH:2 RDATA:n
Label compression: 0xC0 0x0C = pointer to offset 12 — MUST handle this
```

## Resolution Algorithm
```
resolve(name, type):
  1. Cache hit? → return (< 1ms)
  2. nameservers = root_hints
  3. loop:
     resp = queryUDP(nameservers[0], name, type)
     if resp.answers: cache + return
     if resp.authority: nameservers = authority NS IPs; continue
     return NXDOMAIN
```

## Checklist
- [ ] DNS message builder: construct valid query for any name + type
- [ ] DNS message parser: header, all 6 record types (A, AAAA, NS, CNAME, MX, TXT), label compression
- [ ] UDP client: 2s timeout, 3 retries; TCP fallback when TC bit set
- [ ] Recursive resolver loop: root → TLD → authoritative
- [ ] CNAME chain follower (max 10 hops)
- [ ] TTL cache with background expiry goroutine
- [ ] UDP listener on `:5353` answering standard DNS queries
- [ ] REST `GET /resolve?name=api.github.com&type=A`
- [ ] REST `GET /cache` — show all cached entries (debug tool)
- [ ] Validate output matches `dig +trace` for 10 domains
- [ ] `go test -race ./...` and `goleak.VerifyNone(t)` pass

## Benchmarks
| Metric | Cold Cache | Warm Cache |
|---|---|---|
| A record (3 round trips) | 100–500ms | < 1ms |
| Cache hit rate after 10min | — | > 90% |
