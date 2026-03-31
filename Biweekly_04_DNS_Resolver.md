# Biweekly Project 4 — Recursive DNS Resolver
## Full DNS Resolution from Root Servers

**Timeline:** Weeks 7–8  
**Language:** Go  
**What it mirrors:** `dig` · `unbound` · CoreDNS resolver logic  

---

## 1. What This Teaches

How DNS actually works at the wire level — not just "it resolves domain names to IPs" but the full recursive resolution path from root servers down to authoritative nameservers. Every backend engineer uses DNS hundreds of times per day. Almost none of them can explain what happens between `curl google.com` and the first TCP SYN packet.

---

## 2. The Problem It Solves

You want to resolve `api.paycore.dev` to an IP address without using the OS resolver or any library that wraps it. You must implement the full recursive resolution algorithm: start at root hints, follow NS referrals, query authoritative servers, and return the final A record — caching at each step.

---

## 3. What You Build

### 3.1 Resolution Algorithm

```
resolve("api.paycore.dev", A):
  1. Check cache → HIT: return cached answer
  2. Start at root hints (hardcoded list of root server IPs)
  3. Query root: "who handles .dev?"
     → Returns NS records for .dev TLD servers
  4. Query .dev TLD server: "who handles paycore.dev?"
     → Returns NS records for paycore.dev authoritative server
  5. Query paycore.dev authoritative: "what is api.paycore.dev?"
     → Returns A record: 1.2.3.4
  6. Cache all answers with their TTLs
  7. Return 1.2.3.4
```

### 3.2 Components

| Component | Responsibility |
|---|---|
| UDP Client | Sends DNS queries over UDP port 53, handles retries on timeout |
| DNS Message Parser | Parses binary DNS wire format: header + question + answer + authority + additional sections |
| DNS Message Builder | Constructs valid DNS query messages with random query ID |
| Recursive Resolver | Implements the iterative resolution algorithm above |
| Cache | TTL-aware cache: `map[string]CacheEntry` with expiry. Respects TTL from DNS responses. |
| Root Hints | Hardcoded list of root server IPs (same list as every resolver uses) |

### 3.3 DNS Wire Format (Simplified)

```
Header (12 bytes):
  ID (2)  FLAGS (2)  QDCOUNT (2)  ANCOUNT (2)  NSCOUNT (2)  ARCOUNT (2)

Question:
  QNAME (variable, length-prefixed labels)  QTYPE (2)  QCLASS (2)

Answer/Authority/Additional:
  NAME (2, pointer)  TYPE (2)  CLASS (2)  TTL (4)  RDLENGTH (2)  RDATA (variable)
```

### 3.4 Record Types to Support

| Type | Value | Description |
|---|---|---|
| A | 1 | IPv4 address (4 bytes) |
| NS | 2 | Nameserver hostname |
| CNAME | 5 | Canonical name alias |
| AAAA | 28 | IPv6 address (16 bytes) |
| MX | 15 | Mail exchange + priority |

---

## 4. Key Concepts Demonstrated

- **DNS is UDP by default** — queries and responses fit in a single UDP packet (< 512 bytes historically, up to 4096 with EDNS0). TCP is used only for zone transfers and when response exceeds UDP limit.
- **Recursive vs iterative resolution** — your resolver is recursive (does all the work for the client). The root servers are iterative (just tell you where to go next, they don't resolve for you).
- **TTL caching** — every DNS record has a TTL. Caching with TTL respect is what makes DNS scalable. Without caching, every request hits the root servers.
- **Label compression** — DNS names use pointer compression in responses: `\xc0\x0c` means "jump to offset 12 in the packet". Your parser must handle this.
- **CNAME chains** — `www.paycore.dev` might CNAME to `paycore.dev` which CNAMEs to a CDN hostname. Your resolver must follow the chain.

---

## 5. Implementation Checklist

- [ ] DNS message builder: constructs valid query for any domain + type
- [ ] DNS message parser: header, question, all four record types, label compression
- [ ] UDP client: `net.Dial("udp", server+":53")`, 2s timeout, 2 retries
- [ ] Root hints: hardcoded IPs of 13 root server clusters (a.root-servers.net etc.)
- [ ] Iterative resolver loop: root → TLD → authoritative
- [ ] CNAME chain follower: resolve CNAME targets recursively
- [ ] TTL cache: map with expiry, thread-safe with `sync.RWMutex`
- [ ] Test: resolve `google.com`, `api.github.com`, `mail.google.com` (MX) correctly
- [ ] Benchmark: cold cache vs warm cache resolution time
- [ ] Compare output with `dig +trace` for the same domains

---

## 6. Benchmarks to Document

| Metric | Cold Cache | Warm Cache |
|---|---|---|
| Resolution time (simple A record) | 100–500ms (3 round trips) | < 1ms |
| Resolution time (CNAME chain, 3 hops) | 300–900ms | < 1ms |
| Cache hit rate after 10 min of traffic | — | > 90% |
| UDP packet loss handling | Retry after 2s | — |

---

## 7. Interview Value

- **All companies (OA MCQs):** DNS questions appear in every Bangalore OA — A records, TTL, propagation delay, split-horizon DNS.
- **Uber / DoorDash infrastructure rounds:** *"Why does DNS TTL matter for zero-downtime deployments?"* → TTL is the propagation delay. You control it.
- **Amazon / Google:** *"Walk me through what happens when a user types `google.com` in their browser."* → You can trace DNS from root hints to answer, then TCP handshake, then HTTP.
- **System design:** *"How would you implement a service discovery system?"* → DNS is one answer; understanding its limits (TTL-based propagation delay vs Consul's push-based model) is the follow-up.

---

## 8. ADR to Write

**"DNS caching strategy: TTL-faithful vs TTL-floor"**  
Decision: honour TTL exactly as returned by authoritative server.  
Alternative: enforce a minimum TTL floor of 30s (prevents cache thrashing for records with TTL=0).  
Implication for deployments: if you set TTL=60s before a migration, you must wait 60s after the change for all resolvers to pick it up.
