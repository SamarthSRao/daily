# Backend Engineering — Section 1: Web Request Lifecycle
### 500 Questions | DNS · TCP · HTTP · TLS · gRPC · Load Balancing · Kubernetes
> Mapped to Backend 2026 Roadmap Stage 1 + Stage 2 | Infraspec Target
> Tagged: [CONCEPT] [CODE] [DEBUG] [TRADEOFF] [DESIGN] [APPLY]
> Levels: {L1} must know · {L2} mid/senior · {L3} staff

---

# PART A — DNS (Q1–Q60)

1. `[CONCEPT]` `{L1}` What happens when a user types `openTrace.dev`? Name every DNS step: browser cache → OS cache → recursive resolver → root → TLD → authoritative.
2. `[CONCEPT]` `{L1}` What is the difference between a recursive resolver and an authoritative nameserver?
3. `[CONCEPT]` `{L1}` Explain DNS record types: A, AAAA, CNAME, MX, TXT, NS, SOA, PTR, SRV. Give one use case each.
4. `[CONCEPT]` `{L1}` What is DNS TTL? What happens during a deployment if your TTL is 86400s and you need to switch IPs?
5. `[APPLY]` `{L1}` What is the safe TTL-lowering procedure before a planned IP migration? How far in advance?
6. `[CONCEPT]` `{L1}` What is the difference between a CNAME and an A record? When must you use an A record for a root domain?
7. `[DEBUG]` `{L1}` Explain every section of `dig +trace openTrace.dev`: QUESTION, ANSWER, AUTHORITY, ADDITIONAL.
8. `[CONCEPT]` `{L2}` What is a DNS zone? What does the SOA record's MNAME, RNAME, and serial number mean?
9. `[CONCEPT]` `{L2}` What is negative caching (NXDOMAIN TTL)? How can a high negative TTL block incident recovery?
10. `[CONCEPT]` `{L2}` What is split-horizon DNS? Give an OpenTrace example: different IPs for internal vs external clients.
11. `[CONCEPT]` `{L2}` What is Anycast DNS? How does Cloudflare serve DNS from 300+ PoPs using one IP?
12. `[CONCEPT]` `{L2}` What is DNS over HTTPS (DoH) and DNS over TLS (DoT)? Why do they exist?
13. `[CONCEPT]` `{L2}` What is DNSSEC? What is the chain of trust from root to your domain?
14. `[DEBUG]` `{L2}` `dig openTrace.dev` returns `SERVFAIL`. Walk through your five-step diagnosis.
15. `[DEBUG]` `{L1}` DNS resolution works from your laptop but not from a Kubernetes pod. Name the three most likely causes.
16. `[CONCEPT]` `{L2}` What is `ndots` in `/etc/resolv.conf`? How does Kubernetes's default `ndots:5` cause 5 extra DNS lookups per external hostname?
17. `[DEBUG]` `{L2}` A call to `postgres.default.svc.cluster.local` takes 50ms extra. `ndots:5` is the culprit. Explain why and how to fix it.
18. `[CONCEPT]` `{L2}` What is CoreDNS in Kubernetes? What is the `Corefile`? How do you add a custom upstream resolver?
19. `[CONCEPT]` `{L2}` What is the DNS wire format? Describe the 12-byte message header fields.
20. `[CODE]` `{L2}` In Biweekly Project 4 (DNS resolver), describe the binary layout of a DNS question: QNAME label encoding, QTYPE, QCLASS.
21. `[CODE]` `{L2}` Implement DNS label encoding in Go: `www.example.com` → `\x03www\x07example\x03com\x00`.
22. `[CONCEPT]` `{L2}` What is DNS name compression using the pointer format (`0xC0`)? Why is it needed for the 512-byte UDP limit?
23. `[CONCEPT]` `{L2}` What is CNAME flattening? Why can a root domain (`@`) not use a CNAME per RFC 1912?
24. `[CONCEPT]` `{L2}` What is a wildcard DNS record `*.openTrace.dev`? What does it match vs not match?
25. `[APPLY]` `{L2}` OpenTrace deploys to 3 regions. Design Cloudflare Geo-routing to send Indian users to Mumbai, EU users to Frankfurt.
26. `[CONCEPT]` `{L2}` What is DNS cache poisoning? What is the Kaminsky attack? How does DNSSEC prevent it?
27. `[DEBUG]` `{L2}` OpenTrace's DNS record was updated. Some users still resolve the old IP after 2 hours despite a 300s TTL. What are four possible causes?
28. `[CONCEPT]` `{L2}` What is an SRV record? How does Kubernetes use SRV records for headless services?
29. `[CODE]` `{L2}` In your biweekly DNS resolver, implement CNAME chain following: A → CNAME → CNAME → A. Count UDP round trips.
30. `[CONCEPT]` `{L2}` What is the DNS delegation chain: IANA → Verisign (.com) → your registrar → your nameserver?
31. `[APPLY]` `{L1}` Configure OpenTrace's domains on Cloudflare: A record for `collector.openTrace.dev`, CNAME for `www`, MX for email. What TTL for each?
32. `[DESIGN]` `{L2}` Design the subdomain strategy for all 7 OpenTrace components: collector, query, ui, alertmanager, grafana, kafka-ui, jaeger.
33. `[CONCEPT]` `{L2}` What is Cloudflare "orange cloud" (proxied) vs "grey cloud" (DNS only)? What does proxied mode add?
34. `[DEBUG]` `{L2}` A Kubernetes pod can't resolve external domains but resolves internal service names fine. What CoreDNS config do you check?
35. `[APPLY]` `{L2}` Implement DNS failover for OpenTrace: primary Collector in us-east-1, failover to eu-west-1. Configure Cloudflare health-check-based failover.
36. `[CONCEPT]` `{L2}` What is a PTR record? How does `dig -x 1.2.3.4` work? Why do mail servers check PTR records?
37. `[DEBUG]` `{L2}` OpenTrace notification service emails land in spam. How do SPF, DKIM, DMARC TXT records affect email deliverability?
38. `[CONCEPT]` `{L2}` What is a CAA record? How does it restrict which CAs can issue TLS certificates for your domain?
39. `[APPLY]` `{L2}` Configure Kubernetes ExternalDNS to automatically create Cloudflare DNS records when OpenTrace Ingress resources are deployed.
40. `[CONCEPT]` `{L3}` What is EDNS Client Subnet? How does it enable CDN geolocation to route users to the nearest edge node?
41. `[CODE]` `{L3}` In your DNS resolver, implement CNAME compression using pointer format. Why is it critical for DNS message size?
42. `[APPLY]` `{L2}` OpenTrace adds a new region. How do you use Route 53 latency-based routing to direct users to the closest region?
43. `[DEBUG]` `{L3}` CoreDNS in Kubernetes shows high CPU (2 cores). What queries cause this? (Hint: `ndots:5` causing 5 lookups per hostname)
44. `[CONCEPT]` `{L2}` What is the `search` directive in `/etc/resolv.conf`? How does it affect what Kubernetes pods resolve without FQDNs?
45. `[CODE]` `{L2}` Implement TTL-based caching in your DNS resolver: cache each record with TTL, return cached if valid, resolve recursively on miss.
46. `[APPLY]` `{L2}` Walk through the zero-downtime IP migration procedure for OpenTrace Collector: when to lower TTL, when to add new A record, when to remove old record, when to raise TTL.
47. `[CONCEPT]` `{L2}` What is DNS prefetching? How does OpenTrace UI use `<link rel="dns-prefetch">` to speed up the first span submission?
48. `[CONCEPT]` `{L3}` What is DANE with TLSA records? When would OpenTrace use it for certificate pinning via DNS?
49. `[DEBUG]` `{L3}` OpenTrace WebSocket connections fail on corporate wifi due to DNS rebinding protection. How do you diagnose and work around it?
50. `[DESIGN]` `{L2}` Design OpenTrace's DNS observability: what CoreDNS metrics do you export to Prometheus? What thresholds trigger alerts?
51. `[CONCEPT]` `{L2}` What is DNS round-robin load balancing? What are its limitations vs a real L7 load balancer?
52. `[CONCEPT]` `{L2}` What is a stub resolver? How does it differ from a recursive resolver?
53. `[DEBUG]` `{L2}` After updating Kafka broker DNS, consumers still connect to old IP. The Kafka client only resolves DNS at startup. How do you force reconnection without a restart?
54. `[CONCEPT]` `{L2}` What is DNS-based service discovery vs Kubernetes Service-based discovery? When does each apply?
55. `[CODE]` `{L2}` Configure a Kubernetes headless Service for OpenTrace's Kafka so each pod gets its own DNS entry `pod.svc.cluster.local`.
56. `[CONCEPT]` `{L2}` What are `timeout` and `attempts` in `resolv.conf`? How do these affect OpenTrace's startup latency in Kubernetes?
57. `[APPLY]` `{L3}` OpenTrace multi-tenant: each tenant gets `{tenant}.openTrace.dev`. Design the wildcard certificate and DNS routing strategy.
58. `[CONCEPT]` `{L2}` What is NS record delegation? How do you delegate `infra.openTrace.dev` to a separate nameserver for the infrastructure team?
59. `[DEBUG]` `{L2}` After a Kubernetes node replacement, some pods have stale DNS entries for other pods. How does Kubernetes DNS TTL for pod IPs work?
60. `[APPLY]` `{L2}` Design the DNS strategy for OpenTrace's blue-green deployment: how do you use DNS to shift traffic from blue to green without client reconnects?

---

# PART B — TCP, UDP & Socket Programming (Q61–Q140)

61. `[CONCEPT]` `{L1}` Draw the TCP three-way handshake: SYN, SYN-ACK, ACK. What state does each side enter at each step?
62. `[CONCEPT]` `{L1}` Draw the TCP four-way teardown: FIN, ACK, FIN, ACK. Why four steps instead of three?
63. `[CONCEPT]` `{L1}` What is the TIME_WAIT state? Why does it exist? How long does it last (2×MSL)?
64. `[DEBUG]` `{L2}` OpenTrace Collector has 10K sockets in TIME_WAIT. `ss -s` shows this. What caused it and what are your options?
65. `[CONCEPT]` `{L2}` What is `SO_REUSEADDR`? What does it allow? How does it differ from `SO_REUSEPORT`?
66. `[CONCEPT]` `{L2}` What is `SO_REUSEPORT`? How does it let multiple goroutines accept connections on the same port?
67. `[CONCEPT]` `{L2}` What is Nagle's algorithm? When does it delay small packets? How do you disable it with `TCP_NODELAY`?
68. `[DEBUG]` `{L2}` OpenTrace gRPC latency has a ~40ms spike for small messages. Nagle's algorithm is the culprit. Explain the interaction and the Go fix.
69. `[CONCEPT]` `{L2}` What is TCP window scaling? What is the receive window? How does it limit throughput on high-latency links?
70. `[CONCEPT]` `{L2}` What is TCP slow start? What is the congestion window (cwnd)? How does it affect the first request on a new connection?
71. `[CONCEPT]` `{L2}` What are the four TCP congestion control phases: slow start, congestion avoidance, fast retransmit, fast recovery?
72. `[CONCEPT]` `{L2}` What is CUBIC congestion control? How does BBR differ? Why does Google use BBR for high-bandwidth links?
73. `[CONCEPT]` `{L2}` What is a TCP SYN flood attack? What are SYN cookies and how do they mitigate it without allocating per-connection state?
74. `[CONCEPT]` `{L1}` What is the TCP accept backlog? What is the accept queue? What happens when it overflows?
75. `[DEBUG]` `{L2}` OpenTrace Collector's accept queue overflows during traffic spikes. `ss -ltn` shows `Recv-Q` growing. What is the fix?
76. `[CONCEPT]` `{L2}` What is `SO_KEEPALIVE`? What are `tcp_keepalive_time`, `tcp_keepalive_intvl`, `tcp_keepalive_probes`?
77. `[CONCEPT]` `{L2}` What is a half-open TCP connection? How does it occur? How does keepalive detect it?
78. `[CONCEPT]` `{L2}` What is MSS (Maximum Segment Size)? How does it relate to MTU? What is path MTU discovery?
79. `[DEBUG]` `{L2}` Large gRPC messages from OpenTrace Collector fail silently. `tcpdump` shows fragmentation. What is the MTU issue and how do you diagnose it?
80. `[CONCEPT]` `{L2}` What is `TCP_FASTOPEN`? How does it reduce latency for frequent short-lived connections? What security risk does it introduce?
81. `[CONCEPT]` `{L2}` What is `SO_LINGER`? What does setting it to 0 do (RST instead of FIN)? When is this useful?
82. `[CODE]` `{L2}` Write a TCP server in Go: `net.Listen`, `Accept`, goroutine-per-connection, read/write with deadlines, graceful close.
83. `[CODE]` `{L2}` Write a TCP client in Go: `net.DialTimeout`, set read/write deadlines, handle errors, close, implement reconnect logic.
84. `[CONCEPT]` `{L2}` What is `SetDeadline` vs `SetReadDeadline` vs `SetWriteDeadline` in Go? Why must you set both on production servers?
85. `[CODE]` `{L2}` Implement the TCP echo server from your biweekly project: accept connection, read 4-byte length-prefixed frames, echo back, handle EOF, close with keepalive.
86. `[CONCEPT]` `{L3}` What is `epoll` vs `select` vs `kqueue`? How does Go's runtime use `epoll` to multiplex I/O across goroutines?
87. `[CONCEPT]` `{L2}` What is the C10K problem? How did goroutines (2KB stacks + M:N scheduler) solve it for OpenTrace Collector's 100K concurrent connections?
88. `[DEBUG]` `{L2}` `ss -tlnp` shows a port in LISTEN state but connections fail with `connection refused`. What are the five possible causes?
89. `[CODE]` `{L2}` Write the `tcpdump` command to capture OpenTrace gRPC traffic on port 4317, save to pcap file, then analyze SYN/SYN-ACK/ACK/data/FIN sequence.
90. `[CONCEPT]` `{L2}` What does `ss -tlnp` show vs `netstat -an`? What columns are most useful for debugging OpenTrace connection issues?
91. `[CONCEPT]` `{L2}` What is `mtr`? How is it better than `traceroute` for diagnosing packet loss between OpenTrace Collector and Kafka?
92. `[CONCEPT]` `{L2}` What is `iperf3`? How do you test raw TCP throughput between OpenTrace Collector and ClickHouse?
93. `[DEBUG]` `{L2}` OpenTrace gRPC connections drop every 10 minutes. `tcpdump` shows RST packets from the load balancer. What are the three most likely causes?
94. `[CONCEPT]` `{L2}` What is TCP segmentation offload (TSO)? How does it improve throughput for bulk span ingestion on modern NICs?
95. `[DEBUG]` `{L2}` OpenTrace Collector fails to open new connections with `EADDRNOTAVAIL`. `ss -s` shows 60K TIME_WAIT. The ephemeral port range is exhausted. What is the fix?
96. `[CONCEPT]` `{L2}` What is `net.ipv4.ip_local_port_range`? What is the default? How do you expand it for high-connection-rate services?
97. `[CONCEPT]` `{L2}` What is `tcp_tw_reuse`? What does it enable? When is it safe to set it to 1 for OpenTrace's outbound connections?
98. `[CODE]` `{L2}` Implement connection pooling in your biweekly TCP pool project: maintain N persistent PostgreSQL connections, multiplex 1000 clients, queue when pool is full.
99. `[CODE]` `{L2}` In your biweekly TCP pool, describe how you parse the pgwire protocol to know when a transaction completes and a connection can return to pool.
100. `[CONCEPT]` `{L2}` What is the pgwire protocol startup message? What bytes does PostgreSQL send (authentication request) and what does the client send back?
101. `[CONCEPT]` `{L2}` What is `SIGPIPE`? When does OpenTrace Collector receive it? Why must Go programs handle it (`signal.Ignore(syscall.SIGPIPE)`)?
102. `[CODE]` `{L2}` Implement graceful TCP shutdown for OpenTrace Collector: stop accepting new connections, set a 30s drain deadline, wait for in-flight reads/writes to complete.
103. `[CONCEPT]` `{L3}` What is `io_uring`? How does it improve on `epoll` for high-throughput async I/O? What performance gains has it shown for database I/O?
104. `[CONCEPT]` `{L2}` What is the difference between `close()` and `shutdown(SHUT_WR)` for a TCP socket? When would you use half-close in a streaming protocol?
105. `[DEBUG]` `{L3}` OpenTrace Collector shows `Recv-Q > 0` on `ss -ltn` but `Accept-Q = 0`. What does this mean? (data received on accepted connections before the app read it)
106. `[CONCEPT]` `{L2}` What is TCP out-of-order delivery? How does the kernel receive buffer reorder segments? How does this affect OpenTrace's binary frame parser?
107. `[CODE]` `{L3}` Implement a TCP framing protocol for OpenTrace's binary span transport: 4-byte big-endian length prefix, variable-length protobuf body. Handle partial reads across multiple `Read()` calls.
108. `[CONCEPT]` `{L2}` What is `net.Buffers` in Go? How does scatter-gather I/O avoid copying when assembling multi-part OpenTrace responses?
109. `[TRADEOFF]` `{L2}` Goroutine-per-connection vs event-loop: what is the memory cost difference at 100K connections? When does Go's goroutine model lose to a single-threaded event loop?
110. `[CODE]` `{L2}` Implement a load test for your TCP connection pool: spawn 1000 goroutines each sending 100 queries, measure throughput and p99 latency, verify pool never exceeds N connections.
111. `[CONCEPT]` `{L1}` What is UDP? What guarantees does it NOT provide vs TCP?
112. `[CONCEPT]` `{L1}` When does DNS use UDP vs TCP? What triggers the TCP fallback?
113. `[CONCEPT]` `{L2}` What is QUIC? What layer is it on? What does it borrow from TCP and what is genuinely new?
114. `[CONCEPT]` `{L2}` What is 0-RTT in QUIC? What latency does it save? What security tradeoff (replay attacks) does it make?
115. `[CONCEPT]` `{L2}` What is head-of-line blocking in HTTP/1.1 and HTTP/2? How does QUIC's independent UDP streams solve it at the transport layer?
116. `[CONCEPT]` `{L2}` What is HTTP/3? What transport does it use? What does it eliminate vs HTTP/2 over TCP?
117. `[TRADEOFF]` `{L2}` TCP (gRPC) vs UDP for OpenTrace span ingestion: why does OpenTrace use TCP despite higher overhead?
118. `[CODE]` `{L2}` In Biweekly Project 4 (DNS resolver), implement a UDP socket server in Go: `net.ListenPacket("udp", ":1053")`, `ReadFromUDP`, `WriteToUDP`. Handle 512-byte UDP limit.
119. `[CONCEPT]` `{L2}` What is a UDP socket buffer overflow? What is `SO_RCVBUF`? How do you detect dropped UDP packets with `netstat -su`?
120. `[DEBUG]` `{L2}` DNS queries to your biweekly resolver occasionally get no response. `netstat -su` shows `RcvbufErrors` increasing. What is happening and how do you fix it?
121. `[CONCEPT]` `{L2}` What is the maximum safe UDP datagram size for DNS (512 bytes)? What is EDNS0's role in extending it?
122. `[CONCEPT]` `{L2}` What is a network namespace? How does Kubernetes use network namespaces to isolate pod networking?
123. `[CONCEPT]` `{L2}` What is CNI (Container Network Interface)? What does a CNI plugin do when a Kubernetes pod starts?
124. `[DEBUG]` `{L2}` OpenTrace pods on different Kubernetes nodes cannot communicate. `kubectl exec -it pod -- ping other-pod-ip` fails. What CNI layer do you investigate?
125. `[CONCEPT]` `{L2}` What is VXLAN? How does Flannel use it to create an overlay network for pod-to-pod communication across nodes?
126. `[CONCEPT]` `{L3}` What is eBPF? How does Cilium use it for zero-overhead Kubernetes networking, bypassing the Linux TCP/IP stack for pod-to-pod traffic?
127. `[CONCEPT]` `{L2}` What is an IP route table? How does `ip route show` reveal the path OpenTrace Collector uses to reach Kafka?
128. `[DEBUG]` `{L2}` OpenTrace Collector can't reach Kafka on the same subnet. `ping` works but TCP fails. What is the ARP table investigation using `arp -n`?
129. `[CONCEPT]` `{L2}` What is ARP (Address Resolution Protocol)? How does it resolve an IP to a MAC address on the same subnet?
130. `[CONCEPT]` `{L2}` What is ICMP? What does `ping` actually send and receive? What is the echo request/reply format?
131. `[CONCEPT]` `{L2}` What is `traceroute`? What is the TTL decrement mechanism it uses? Why does it use UDP on Linux vs ICMP on Windows?
132. `[CONCEPT]` `{L2}` What is the MTU for Ethernet (1500), loopback (65535), and Kubernetes VXLAN overlay (1450, 50-byte overhead)?
133. `[DEBUG]` `{L2}` OpenTrace gRPC streams fail for messages > 1400 bytes on Kubernetes but work on bare metal. What is the VXLAN MTU overhead causing this and how do you fix it?
134. `[CONCEPT]` `{L3}` What is DPDK (Data Plane Development Kit)? How does it bypass the kernel TCP/IP stack for ultra-low-latency networking?
135. `[TRADEOFF]` `{L2}` gRPC (HTTP/2 over TCP) vs HTTP/3 (QUIC) for OpenTrace internal span ingestion: compare latency, reliability, Go library maturity in 2024.
136. `[CONCEPT]` `{L2}` What is a network policy in Kubernetes? How does it differ from a firewall rule at the VM level?
137. `[CODE]` `{L2}` Write `iptables -L -n -v` interpretation: identify the KUBE-SERVICES chain and how it routes traffic to OpenTrace pods.
138. `[CONCEPT]` `{L2}` What is a virtual IP (VIP) in Kubernetes Service? How does kube-proxy implement it using iptables DNAT rules?
139. `[DEBUG]` `{L3}` OpenTrace Collector pods receive traffic but reply packets go to the wrong gateway. What is asymmetric routing and how does it manifest in Kubernetes?
140. `[APPLY]` `{L2}` Design the complete network path for a span from an SDK in a user's browser to ClickHouse storage: list every network hop, protocol, and component.

---

# PART C — HTTP Protocol & API Design (Q141–Q280)

141. `[CONCEPT]` `{L1}` What is the structure of an HTTP request: method, path, version, headers, body? Which parts are mandatory?
142. `[CONCEPT]` `{L1}` Which HTTP methods are idempotent? Which are safe? Why does this matter for OpenTrace span retry logic?
143. `[CONCEPT]` `{L1}` Map HTTP status codes for OpenTrace: 200, 201, 202, 204, 400, 401, 403, 404, 409, 422, 429, 500, 503.
144. `[CONCEPT]` `{L1}` What is the difference between 301, 302, 307, and 308 redirects? Which one preserves the HTTP method on redirect?
145. `[CONCEPT]` `{L1}` What is HTTP keep-alive (persistent connections)? How does it differ from opening a new TCP connection per request?
146. `[CONCEPT]` `{L2}` What is HTTP pipelining? Why did it fail in practice? What is HTTP/1.1 head-of-line blocking?
147. `[CONCEPT]` `{L1}` What is CORS? Why does the browser enforce it but not the server? When does a preflight (OPTIONS) request occur?
148. `[CODE]` `{L2}` Implement CORS middleware for OpenTrace's HTTP API in chi: handle OPTIONS preflight, set `Access-Control-Allow-Origin`, `Methods`, `Headers`.
149. `[CONCEPT]` `{L1}` What is content negotiation? How do `Accept`, `Content-Type`, and `Accept-Encoding` headers work together?
150. `[CONCEPT]` `{L2}` What is HTTP caching? Explain `Cache-Control`, `ETag`, `Last-Modified`, `If-None-Match`. What is `max-age` vs `s-maxage`?
151. `[CODE]` `{L2}` Implement conditional GET for OpenTrace's trace query: generate ETag from result hash, return 304 if client's ETag matches, 200 with body otherwise.
152. `[CONCEPT]` `{L2}` What is the `Vary` header? When would OpenTrace use it to tell CDNs to cache different responses per `Accept-Encoding`?
153. `[CONCEPT]` `{L1}` What is gzip/Brotli compression in HTTP? At what response size does compression help vs hurt latency?
154. `[CODE]` `{L2}` Add gzip compression middleware to OpenTrace's HTTP server: threshold of 1KB, set `Content-Encoding: gzip`, handle `Accept-Encoding: gzip` check.
155. `[CONCEPT]` `{L1}` What is a reverse proxy vs a forward proxy? How does nginx operate in front of OpenTrace as a reverse proxy?
156. `[CONCEPT]` `{L2}` What does `X-Forwarded-For` contain? Why can't you blindly trust it? What is the PROXY protocol alternative?
157. `[CODE]` `{L2}` Extract the real client IP in OpenTrace's rate limiter from `X-Forwarded-For`, accounting for one trusted proxy hop.
158. `[CONCEPT]` `{L2}` What is chunked transfer encoding? When does OpenTrace use it to stream large trace export results?
159. `[CODE]` `{L2}` Implement streaming HTTP response in Go for OpenTrace: set `Transfer-Encoding: chunked`, write spans in 1000-item batches, flush after each batch, close when done.
160. `[CONCEPT]` `{L1}` What is HTTPS? What is TLS? Describe the TLS 1.3 handshake: ClientHello, ServerHello, Certificate, Finished, what is new vs 1.2.
161. `[CONCEPT]` `{L2}` What is SNI (Server Name Indication)? Why is it needed when multiple domains share one IP?
162. `[CONCEPT]` `{L2}` What is HSTS? What does `max-age=31536000; includeSubDomains; preload` mean?
163. `[CODE]` `{L2}` Add HSTS header to all OpenTrace HTTPS responses: `Strict-Transport-Security: max-age=31536000; includeSubDomains`.
164. `[CONCEPT]` `{L2}` What is mTLS? How does OpenTrace use it between Collector and Processor for service-to-service authentication?
165. `[CODE]` `{L2}` Configure mTLS in Go for OpenTrace: generate CA + server cert + client cert, require `tls.RequireAndVerifyClientCert` on the server side.
166. `[CONCEPT]` `{L2}` What is a TLS certificate chain? What is a root CA vs intermediate CA? How does cert-manager issue leaf certificates?
167. `[DEBUG]` `{L1}` OpenTrace returns 200 but with an empty body. Where do you check first in the request lifecycle?
168. `[DEBUG]` `{L1}` A POST to OpenTrace's span ingest is executed twice. Walk through every layer where deduplication could fail.
169. `[CONCEPT]` `{L2}` What is an HTTP cookie? What do `Secure`, `HttpOnly`, `SameSite=Strict` each prevent?
170. `[CODE]` `{L2}` Set a session cookie for OpenTrace's UI: `Set-Cookie: session=token; SameSite=Strict; Secure; HttpOnly; Max-Age=86400; Path=/`.
171. `[CONCEPT]` `{L2}` What is CSP (Content Security Policy)? What attacks does it prevent? Write a CSP header for OpenTrace UI.
172. `[CONCEPT]` `{L2}` What is `X-Content-Type-Options: nosniff`? What MIME sniffing attack does it prevent?
173. `[CONCEPT]` `{L2}` What is `X-Frame-Options: DENY`? What clickjacking attack does it prevent?
174. `[CODE]` `{L2}` Write a security headers middleware for OpenTrace: CSP, HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy.
175. `[CONCEPT]` `{L2}` What is Go's `http.Transport` connection pool? What are `MaxIdleConnsPerHost`, `IdleConnTimeout`, `TLSHandshakeTimeout`?
176. `[CODE]` `{L2}` Configure `http.Transport` for OpenTrace's outbound HTTP calls: `MaxIdleConnsPerHost=100`, `IdleConnTimeout=90s`, `ResponseHeaderTimeout=10s`.
177. `[DEBUG]` `{L2}` OpenTrace's HTTP client creates a new TCP connection for every request. `ss -s` shows hundreds of TIME_WAIT. What is misconfigured?
178. `[CONCEPT]` `{L2}` What is `http.MaxBytesReader`? Why does OpenTrace set a 10MB body limit for span batch uploads?
179. `[CODE]` `{L2}` Add body size limiting in OpenTrace Collector: `r.Body = http.MaxBytesReader(w, r.Body, 10<<20)`. Return 413 on overflow.
180. `[CODE]` `{L2}` Implement a health check endpoint for OpenTrace Collector: `GET /health/ready` checks Kafka producer, returns 200/503. `GET /health/live` returns 200 if process is running.
181. `[CONCEPT]` `{L1}` What is HTTP/2? What four features does it add: multiplexing, HPACK compression, server push, binary framing?
182. `[CONCEPT]` `{L2}` What is HTTP/2 multiplexing? How does it send 100 concurrent requests over one TCP connection without head-of-line blocking?
183. `[CONCEPT]` `{L2}` What is HPACK header compression? Why is it stateful? What is the CRIME attack on TLS+compression?
184. `[CONCEPT]` `{L2}` What is HTTP/2 server push? Why was it largely abandoned? What is the modern `103 Early Hints` alternative?
185. `[CONCEPT]` `{L2}` What is an HTTP/2 stream? How many can exist simultaneously? What is `SETTINGS_MAX_CONCURRENT_STREAMS`?
186. `[TRADEOFF]` `{L1}` REST vs gRPC for OpenTrace's span ingestion: when does gRPC win (type safety, streaming, code gen)? When does REST win (debugging, CDN, browser)?
187. `[CONCEPT]` `{L1}` What are REST constraints: stateless, uniform interface, resource-based, HATEOAS?
188. `[CODE]` `{L2}` Design the OpenTrace REST API resource hierarchy: `GET /v1/traces/{id}`, `GET /v1/traces/{id}/spans`, `GET /v1/services/{name}/traces`.
189. `[CONCEPT]` `{L2}` What is API versioning? Compare URL versioning (`/v1/`), header versioning, media type versioning. When does OpenTrace use URL versioning?
190. `[CODE]` `{L2}` Implement API versioning in chi router: route groups `/v1` and `/v2`, shared middleware, version-specific handler implementations.
191. `[CONCEPT]` `{L2}` What is backward compatibility? When is adding a new JSON field non-breaking? When is removing a field a breaking change?
192. `[CODE]` `{L2}` Add `Deprecation: true; Sunset: "2025-06-01"` headers to OpenTrace's v1 API endpoints when v2 is available.
193. `[CODE]` `{L2}` Design OpenTrace's paginated trace list: `{"data":[...],"meta":{"cursor":"b64","total":1000,"has_next":true}}`.
194. `[CONCEPT]` `{L2}` What is cursor-based vs offset-based pagination? Why does OpenTrace use cursor for the trace list?
195. `[CODE]` `{L2}` Implement cursor pagination for OpenTrace: encode `(trace_id, start_time)` as base64 opaque cursor, decode in next request, write the ClickHouse WHERE clause.
196. `[CODE]` `{L2}` Return rate limit headers from OpenTrace: `X-RateLimit-Limit: 1000`, `X-RateLimit-Remaining: 750`, `X-RateLimit-Reset: epoch`.
197. `[DESIGN]` `{L2}` Design the API gateway for OpenTrace's public ingestion API: JWT validation, rate limiting per API key, request logging, routing to Collector instances.
198. `[CODE]` `{L2}` Implement idempotency key middleware in OpenTrace: read `X-Idempotency-Key` header, check Redis, return cached response on replay, cache on first successful response.
199. `[CODE]` `{L2}` Add `swaggo/swag` annotations to OpenTrace's `POST /v1/traces` endpoint. Generate and serve the OpenAPI spec at `/docs`.
200. `[TRADEOFF]` `{L2}` GraphQL vs REST for OpenTrace's trace query API: compare query flexibility, overfetching, caching difficulty, client complexity.
201. `[CONCEPT]` `{L2}` What is `application/x-ndjson`? When does OpenTrace use it for streaming bulk span export?
202. `[CODE]` `{L2}` Implement ndjson streaming: read body line-by-line with `bufio.Scanner`, unmarshal each line as a span, process without loading entire body into memory.
203. `[CODE]` `{L2}` Design async export API: `POST /v1/exports` returns `202 {"job_id":"uuid"}`. Client polls `GET /v1/exports/{id}` for `{status, download_url}`.
204. `[CODE]` `{L2}` Generate an S3 presigned GET URL in Go for a trace export file, 15-minute expiry, with `Content-Disposition: attachment; filename="export.json"`.
205. `[CODE]` `{L2}` Implement RFC 7807 error response in OpenTrace: `{"type":"https://openTrace.dev/errors/rate-limited","title":"Rate Limited","detail":"Retry after 60s","status":429}`.
206. `[CODE]` `{L2}` Add `Server-Timing: db;dur=12.5, kafka;dur=2.1, total;dur=15.3` header to OpenTrace's span ingestion response.
207. `[CONCEPT]` `{L2}` What is W3C `traceparent` header format? What are its four fields: version, trace-id, parent-id, trace-flags?
208. `[CODE]` `{L2}` Wrap Go's `http.Client` with OTel transport to auto-inject `traceparent` into all OpenTrace outgoing HTTP calls.
209. `[TRADEOFF]` `{L2}` JSON vs Protobuf vs MessagePack for OpenTrace span API: compare wire size, serialization speed, human readability, schema evolution.
210. `[CODE]` `{L2}` Implement Protobuf span ingestion: `Content-Type: application/x-protobuf`, unmarshal `ExportTraceServiceRequest`, validate, forward to Kafka.
211. `[CONCEPT]` `{L2}` What is gRPC? How does it build on HTTP/2? What is a unary vs server-streaming vs client-streaming vs bidirectional streaming RPC?
212. `[CODE]` `{L2}` Implement `ExportTraceServiceServer` in Go from the OTLP proto spec: handle metadata, partial success response, error status codes.
213. `[CODE]` `{L2}` Add a logging + tracing gRPC interceptor to OpenTrace Collector: log every RPC call with method, status, duration, trace_id.
214. `[CODE]` `{L2}` Add gRPC health check service to OpenTrace Collector: implement `grpc_health_v1.Health`, set SERVING when Kafka connected, NOT_SERVING otherwise.
215. `[DEBUG]` `{L2}` OpenTrace gRPC calls fail with `code = Unavailable, message = connection refused`. The server is running. What are the first three things you check?
216. `[CONCEPT]` `{L2}` What is gRPC backpressure via HTTP/2 flow control? How does it prevent OpenTrace Collector from overwhelming the Processor?
217. `[CODE]` `{L2}` Configure gRPC server for OpenTrace: `MaxRecvMsgSize: 4MB`, `MaxConcurrentStreams: 1000`, `KeepaliveParams{Time: 30s, Timeout: 10s}`.
218. `[CODE]` `{L2}` Configure gRPC client retry for OpenTrace: retry on `Unavailable`, exponential backoff, max 3 attempts, no retry on `InvalidArgument`.
219. `[CONCEPT]` `{L2}` What is gRPC keepalive? How does OpenTrace configure it to prevent stale connections through load balancers that close idle TCP connections?
220. `[DEBUG]` `{L2}` gRPC connections from OpenTrace Collector drop after 10 minutes behind an AWS ALB. The ALB idle timeout is 60s. What is the exact fix?
221. `[CONCEPT]` `{L2}` What is gRPC deadline propagation? How does a client deadline flow through the OpenTrace call chain: Collector → Processor → ClickHouse?
222. `[CODE]` `{L2}` Implement gRPC deadline propagation in OpenTrace: extract deadline from incoming context, use same deadline for all downstream gRPC calls.
223. `[CODE]` `{L2}` Configure gRPC client-side load balancing for OpenTrace: `grpc.WithDefaultServiceConfig('{"loadBalancingPolicy":"round_robin"}')` with DNS resolver.
224. `[CODE]` `{L2}` Enable gRPC reflection in OpenTrace Collector: `reflection.Register(server)`. Verify with `grpcurl -plaintext localhost:4317 list`.
225. `[CONCEPT]` `{L3}` What is gRPC transcoding? How does OpenTrace's gRPC service also accept HTTP/JSON via `google.api.http` annotations?
226. `[CONCEPT]` `{L3}` What is gRPC-web? How does it enable browsers to call OpenTrace's gRPC service directly without a gRPC proxy?
227. `[TRADEOFF]` `{L2}` gRPC-web vs REST for OpenTrace's browser-to-API communication: browser support, proxy requirements, developer experience.
228. `[CODE]` `{L2}` Version the OpenTrace span proto: add `string service_namespace = 16;`, deprecate old field. Show forward and backward compatibility.
229. `[CONCEPT]` `{L2}` What is a WebSocket upgrade request? What HTTP headers trigger the WebSocket handshake?
230. `[CODE]` `{L2}` Implement WebSocket upgrade for OpenTrace live tail: `gorilla/websocket.Upgrader{CheckOrigin: fn}`, set allowed origins, read/write buffer sizes.
231. `[CONCEPT]` `{L2}` What is a WebSocket frame: opcode for text (1), binary (2), close (8), ping (9), pong (10)?
232. `[CODE]` `{L2}` Implement WebSocket ping/pong keepalive: server sends ping every 30s, closes connection if no pong in 10s.
233. `[CONCEPT]` `{L2}` What is SSE (Server-Sent Events)? What is the `text/event-stream` format? What are `data:`, `event:`, `id:`, `retry:` fields?
234. `[CODE]` `{L2}` Implement SSE endpoint in Go for BookWise seat availability: write `data: {"seat_id":"A1","status":"booked"}\n\n`, flush after each write.
235. `[CONCEPT]` `{L2}` What is `Last-Event-ID` in SSE? How does the client send it on reconnect? How does the server replay missed events?
236. `[CODE]` `{L2}` Implement SSE with `Last-Event-ID` replay for OpenTrace alerts: store last 100 events in Redis List, replay from last seen ID on reconnect.
237. `[DEBUG]` `{L2}` SSE connections to OpenTrace break after 60s behind an AWS ALB. What SSE keepalive comment prevents idle disconnection?
238. `[CODE]` `{L2}` Add SSE keepalive to OpenTrace: write `: heartbeat\n\n` every 15 seconds to prevent ALB/proxy idle timeouts.
239. `[TRADEOFF]` `{L2}` WebSocket vs SSE vs Long Polling for OpenTrace live tail: compare latency, browser support, server resources, reconnect behavior.
240. `[TRADEOFF]` `{L2}` gRPC server streaming vs WebSocket for OpenTrace live tail: compare protocol overhead, browser compatibility, load balancer support.
241. `[CONCEPT]` `{L2}` What is the `Range` header? How does OpenTrace enable resumable downloads of large trace export files?
242. `[CODE]` `{L2}` Implement range request support in Go: read `Range: bytes=0-1023`, seek in S3 object, return `206 Partial Content`.
243. `[CONCEPT]` `{L2}` What is multipart upload? How does BookWise accept file attachments larger than 100MB without loading them into memory?
244. `[CODE]` `{L2}` Implement multipart file upload in Go for BookWise: parse `multipart/form-data`, stream each part directly to S3 multipart upload.
245. `[CONCEPT]` `{L2}` What is HTTP long polling? How does it differ from SSE? When is it still used?
246. `[CODE]` `{L2}` Implement long polling in Go: hold request open up to 30s, respond immediately when new data arrives, return 204 on timeout.
247. `[CONCEPT]` `{L2}` What is the async HTTP pattern (`202 Accepted`)? When does OpenTrace's bulk export use it instead of synchronous response?
248. `[CONCEPT]` `{L2}` What is content encoding vs content type? When does OpenTrace send `Content-Encoding: gzip` vs `Content-Type: application/x-protobuf`?
249. `[CONCEPT]` `{L3}` What is HAR (HTTP Archive) format? How does it help debug slow OpenTrace UI page loads?
250. `[APPLY]` `{L2}` A user reports OpenTrace's trace list page takes 8s to load. Walk through HTTP-level investigation using Chrome DevTools Network tab and waterfall.
251. `[CONCEPT]` `{L2}` What is virtual scrolling? How does OpenTrace's trace waterfall use `react-window` to render 10K spans with only 50 DOM nodes mounted?
252. `[CODE]` `{L2}` Implement server-side NDJSON streaming for OpenTrace trace detail: stream spans as they come from ClickHouse, render each in the browser via `Response.body.getReader()`.
253. `[DESIGN]` `{L2}` Design the caching strategy for OpenTrace's trace query API: 5s TTL for recent traces, 60s for historical. Cache key includes `{trace_id, time_range}`.
254. `[CODE]` `{L2}` Implement Redis caching for OpenTrace trace query: check `cache:trace:{id}`, miss → ClickHouse → cache 60s → return. Add `X-Cache: HIT/MISS` header.
255. `[CODE]` `{L2}` Use `singleflight` to collapse concurrent cache misses for the same trace_id in OpenTrace: only one ClickHouse query runs, result shared to all waiters.
256. `[CODE]` `{L2}` Implement stale-while-revalidate for OpenTrace: return cached result immediately, kick off background goroutine to refresh, use `singleflight` to deduplicate refreshes.
257. `[CONCEPT]` `{L2}` What is a request budget? How does OpenTrace enforce that `GET /trace/{id}` must complete in 2s total across ClickHouse (1.5s), PostgreSQL (0.3s), enrichment (0.2s)?
258. `[CODE]` `{L2}` Implement request budget in OpenTrace: `totalCtx = context.WithTimeout(r.Context(), 2s)`. Derive sub-contexts with per-component timeouts using remaining budget.
259. `[CONCEPT]` `{L2}` What is cache invalidation via Kafka? When Processor writes new spans for trace_id X, how does OpenTrace invalidate the cached trace detail?
260. `[CODE]` `{L2}` Implement cache invalidation: Processor publishes `cache-invalidation:{trace_id}` to Kafka. Query Service consumes and deletes `cache:trace:{id}` from Redis.
261. `[CONCEPT]` `{L2}` What is the thundering herd on cache miss? When 1000 requests for the same trace_id miss simultaneously, what prevents overloading ClickHouse?
262. `[CODE]` `{L2}` Implement cache-aside with singleflight for OpenTrace: `group.Do(traceId, func() { query ClickHouse, cache result, return })`.
263. `[CONCEPT]` `{L2}` What is prefetching for paginated trace lists? How does OpenTrace prefetch the next page while the user reads the current one?
264. `[CODE]` `{L2}` Implement speculative prefetch in OpenTrace Query Service: after serving page N, kick off a background query for page N+1 with a 500ms deadline, cache it.
265. `[APPLY]` `{L2}` OpenTrace's p50=2ms, p95=8ms, p99=150ms. What does this distribution suggest? (GC pauses, lock contention, tail DB query)
266. `[CODE]` `{L2}` Add continuous profiling to OpenTrace: every 5 minutes, capture 30s CPU profile, upload to S3 with timestamp for historical flame graph comparison.
267. `[CONCEPT]` `{L2}` What is a pprof goroutine profile vs CPU profile vs heap profile? When do you capture each during an OpenTrace incident?
268. `[CODE]` `{L2}` Capture a goroutine dump during OpenTrace's high-latency incident: `GET /debug/pprof/goroutine?debug=2`. What blocked goroutine patterns indicate a lock contention problem?
269. `[CODE]` `{L2}` Write Prometheus alerting rules for OpenTrace SLOs: ingestion rate < 1000/sec for 2 min, p99 latency > 100ms for 5 min, error rate > 1% for 1 min.
270. `[CODE]` `{L2}` Write multi-window burn rate alert for OpenTrace: 5% error rate over 1h AND 2% over 6h → fire PagerDuty P1.
271. `[CODE]` `{L2}` List the 10 essential Grafana panels for OpenTrace Collector with PromQL: spans/sec, error rate, p99 latency, Kafka lag, goroutine count, GC pause, memory, CPU, connection pool size, uptime.
272. `[CODE]` `{L2}` Configure `slog.JSONHandler` for OpenTrace: base fields `service`, `env`. Add `trace_id`, `tenant_id`, `request_id` from context in auth middleware, include in every log call.
273. `[CODE]` `{L2}` Add `trace_id` to PostgreSQL slow query logs via `SET application_name = $trace_id` on each DB connection in OpenTrace, enabling log correlation in Grafana.
274. `[CODE]` `{L2}` Write a k6 load test for OpenTrace: 100 VUs, each sending 100 spans/sec via OTLP/HTTP, threshold `http_req_duration{p(99)} < 10ms`, error rate < 0.1%.
275. `[CODE]` `{L2}` Write a k6 ramp scenario for OpenTrace: ramp 0→100 VUs over 2 min, hold at 100 VUs for 5 min, ramp down over 1 min.
276. `[CODE]` `{L2}` Write a Playwright E2E test for OpenTrace: go to `/traces`, submit test span via API, `waitForSelector('[data-testid="trace-item"]')`, verify trace_id appears.
277. `[CODE]` `{L2}` Write an integration test using testcontainers-go: start Kafka container, create topic, produce test spans, verify Processor writes them to ClickHouse mock.
278. `[CODE]` `{L2}` Add `goleak.VerifyNone(t)` to all OpenTrace Go tests. Show what the failure output looks like when a goroutine leaks in test teardown.
279. `[CODE]` `{L2}` Run `go test -race ./...` on OpenTrace. Show what a race condition between two goroutines writing a shared map looks like in the race detector output.
280. `[APPLY]` `{L2}` Design OpenTrace's complete test pyramid: unit tests (pure functions), integration tests (testcontainers), E2E tests (Playwright), load tests (k6). What percentage coverage for each tier?

---

# PART D — Load Balancing, Kubernetes & Deployment (Q281–Q400)

281. `[CONCEPT]` `{L1}` What is a load balancer? What is the difference between L4 (TCP/UDP) and L7 (HTTP) load balancing?
282. `[CONCEPT]` `{L2}` What is DSR (Direct Server Return) in L4 load balancing? How does it improve throughput?
283. `[CONCEPT]` `{L2}` What are load balancing algorithms: round-robin, least connections, IP hash, weighted round-robin? When is each appropriate for OpenTrace?
284. `[DESIGN]` `{L2}` Design the load balancing strategy for OpenTrace Collector: round-robin for stateless span ingestion. Why NOT IP hash?
285. `[CONCEPT]` `{L2}` What is connection draining? Why is it necessary before removing an OpenTrace backend during rolling deployment?
286. `[CONCEPT]` `{L2}` What is the difference between active and passive health checks in a load balancer?
287. `[DEBUG]` `{L2}` The load balancer health check passes but end users see 502s from one OpenTrace backend. What is the discrepancy?
288. `[CONCEPT]` `{L2}` What is sticky session (session affinity)? When does OpenTrace's WebSocket live tail require it? What is the scaling drawback?
289. `[DESIGN]` `{L2}` Configure sticky sessions for OpenTrace live tail behind nginx: cookie-based affinity. How does this interact with horizontal scaling?
290. `[CONCEPT]` `{L2}` What is an AWS ALB vs NLB? When does OpenTrace use ALB (HTTP/gRPC) vs NLB (TCP, preserve client IP)?
291. `[DEBUG]` `{L2}` gRPC calls to OpenTrace Collector fail behind an AWS ALB with `ERR_HTTP2_PROTOCOL_ERROR`. What ALB setting must be enabled?
292. `[CODE]` `{L2}` Implement HTTPS redirect middleware: if `X-Forwarded-Proto != "https"`, return 301 to HTTPS URL.
293. `[CONCEPT]` `{L2}` What is a CDN? How does Cloudflare cache OpenTrace's UI static assets? What is a content-hash cache-buster?
294. `[CODE]` `{L2}` Configure Next.js for OpenTrace UI: content-hashed filenames, `Cache-Control: public, max-age=31536000, immutable` for hashed assets, `no-cache` for `index.html`.
295. `[CONCEPT]` `{L2}` What is egress cost? Why is S3-to-internet bandwidth expensive? How does Cloudflare R2 (zero egress) benefit OpenTrace?
296. `[CONCEPT]` `{L2}` What is Kubernetes Ingress? How does nginx Ingress Controller route traffic to OpenTrace services based on hostname and path?
297. `[CODE]` `{L2}` Write a Kubernetes Ingress for OpenTrace: `collector.openTrace.dev → collector:4317`, `query.openTrace.dev → query:8080`, `ui.openTrace.dev → ui:3000`. Enable TLS with cert-manager.
298. `[CONCEPT]` `{L2}` What is cert-manager? How does it automate TLS certificate issuance and renewal via Let's Encrypt ACME?
299. `[CODE]` `{L2}` Write a cert-manager `ClusterIssuer` for Let's Encrypt production with DNS-01 challenge via Cloudflare API token. Annotate OpenTrace Ingress to auto-issue certificate.
300. `[CODE]` `{L2}` Write a NetworkPolicy for OpenTrace Collector: deny all by default, allow ingress on 4317 from anywhere, allow egress to Kafka (9092), PostgreSQL (5432), CoreDNS (53).
301. `[CODE]` `{L2}` Write a Kubernetes HPA for OpenTrace Collector: scale 2–20 replicas, target custom metric `kafka_consumer_lag > 10000`.
302. `[CODE]` `{L2}` Write a PodDisruptionBudget for OpenTrace Collector: `minAvailable: 2` to ensure HA during node maintenance.
303. `[DESIGN]` `{L2}` Design OpenTrace's zero-downtime rolling deployment: `maxUnavailable=0`, `maxSurge=1`, readiness probe checks Kafka connection before routing traffic.
304. `[CODE]` `{L2}` Configure Kubernetes probes for OpenTrace Collector: readiness → `GET /health/ready` (Kafka connected), liveness → `GET /health/live` (process alive), startup with `failureThreshold=30`.
305. `[CODE]` `{L2}` Set resource requests and limits for OpenTrace Collector: `requests: {cpu: 100m, memory: 256Mi}`, `limits: {cpu: 500m, memory: 1Gi}`. Set `GOMEMLIMIT=900MiB`.
306. `[CONCEPT]` `{L2}` What is a Kubernetes QoS class: Guaranteed, Burstable, BestEffort? What class does OpenTrace Collector get with the above resource config?
307. `[CODE]` `{L2}` Implement Kubernetes-compatible graceful shutdown for OpenTrace: trap SIGTERM, stop accepting spans, drain Kafka producer buffer (30s), close DB connections, exit 0.
308. `[DESIGN]` `{L2}` Design OpenTrace's Kubernetes Service types: Collector (LoadBalancer), Query (ClusterIP), UI (Ingress), Kafka (ExternalName pointing to managed MSK).
309. `[CODE]` `{L2}` Write a multi-stage Dockerfile for OpenTrace Collector: `FROM golang:1.23 AS builder`, compile binary, `FROM gcr.io/distroless/static AS runner`, COPY binary, `USER 65534`.
310. `[DEBUG]` `{L2}` OpenTrace's Docker image is 800MB instead of ~20MB. What layers are bloating it? Walk through `docker history image:tag` to identify the problem.
311. `[CODE]` `{L2}` Write the complete GitHub Actions workflow for OpenTrace: checkout → lint+test+race → `docker build` (BuildKit) → `trivy scan` → `docker push` (ECR) → `kubectl rollout` → verify.
312. `[CODE]` `{L2}` Add `govulncheck ./...` to OpenTrace's CI: fail the build on any CRITICAL Go vulnerability in dependencies.
313. `[CODE]` `{L2}` Mount OpenTrace's PostgreSQL password as a Kubernetes Secret env var. Mount Kafka TLS certs as a volume at `/etc/kafka/tls/`. Reference both in Deployment spec.
314. `[CONCEPT]` `{L2}` What is a Kubernetes StatefulSet vs Deployment? Why does OpenTrace's ClickHouse cluster use StatefulSet?
315. `[CODE]` `{L2}` Write a Kubernetes ResourceQuota for the `openTrace` namespace: `requests.cpu: 16`, `requests.memory: 32Gi`, `limits.memory: 64Gi`.
316. `[CONCEPT]` `{L3}` What is karpenter? How does it provision EC2 nodes faster than cluster-autoscaler for OpenTrace's traffic spikes?
317. `[CODE]` `{L2}` Run `kubectl rollout undo deployment/openTrace-collector` to roll back. Add CI automation that triggers rollback if `kubectl rollout status --timeout=5m` fails.
318. `[CODE]` `{L2}` Write a Kubernetes DaemonSet for Fluentd: read OpenTrace pod logs from `/var/log/containers/`, forward to Loki.
319. `[CODE]` `{L2}` Write a Kubernetes CronJob for OpenTrace's daily ClickHouse partition creation: run at `0 0 * * *`, create next month's partition.
320. `[CODE]` `{L2}` Write a PersistentVolumeClaim for OpenTrace's ClickHouse: `storageClassName: gp3`, `resources.requests.storage: 1Ti`, `accessModes: ReadWriteOnce`.
321. `[CODE]` `{L2}` Configure IRSA for OpenTrace Collector: annotate ServiceAccount with `eks.amazonaws.com/role-arn`, IAM role with S3:PutObject, bind in pod spec.
322. `[CODE]` `{L2}` Add `topologySpreadConstraints` to OpenTrace Collector: spread evenly across 3 AZs with `maxSkew: 1`.
323. `[CODE]` `{L2}` Add pod anti-affinity to OpenTrace Collector: `podAntiAffinity.requiredDuringScheduling` with `topologyKey: kubernetes.io/hostname` (never two pods on same node).
324. `[CODE]` `{L2}` Add init container to OpenTrace Collector pod: `busybox` that loops `nc -z kafka:9092` until Kafka is reachable, then exits 0 to allow main container to start.
325. `[CODE]` `{L2}` Use `kubectl port-forward pod/openTrace-collector-xyz 6060:6060` then `go tool pprof http://localhost:6060/debug/pprof/profile?seconds=30` to capture CPU profile.
326. `[DEBUG]` `{L2}` An OpenTrace pod is in `CrashLoopBackOff`. Walk through `kubectl describe pod`, `kubectl logs --previous`, `kubectl get events` to diagnose the root cause.
327. `[DEBUG]` `{L2}` OpenTrace Collector pods are in `Pending` state. `kubectl describe pod` shows `0/3 nodes are available: 3 Insufficient memory`. What are your options?
328. `[DEBUG]` `{L2}` An OpenTrace pod is stuck in `Terminating` for 10 minutes. What is causing it and how do you safely force-delete it?
329. `[CODE]` `{L2}` Set PriorityClass for OpenTrace: `system-cluster-critical` for Collector (never evict during memory pressure).
330. `[CODE]` `{L2}` Add node affinity to OpenTrace ClickHouse pods: schedule only on nodes labeled `node.kubernetes.io/instance-type: r6i.4xlarge`.
331. `[CODE]` `{L2}` Add taint to dedicated ClickHouse nodes: `kubectl taint node ch-node-1 dedicated=clickhouse:NoSchedule`. Add matching toleration to ClickHouse pods.
332. `[CODE]` `{L2}` Write an ArgoCD Application for OpenTrace: sync from `github.com/org/openTrace-k8s`, `HEAD` branch, `openTrace` namespace, auto-sync with prune and self-heal.
333. `[CODE]` `{L2}` Implement blue-green deployment for OpenTrace: deploy green Deployment, run smoke test, patch Service selector to `version: green`, remove blue.
334. `[CODE]` `{L2}` Write an Argo Rollouts canary for OpenTrace Collector: 5% → 20% → 100% steps, 5-minute pause at each, auto-rollback if error rate > 1%.
335. `[CODE]` `{L2}` Configure GitHub Actions environment `production` with required reviewers for OpenTrace deploys. Add `environment: production` to the deploy job.
336. `[CONCEPT]` `{L2}` What is GitOps? How does ArgoCD deploy OpenTrace from Git instead of direct `kubectl apply`? What is the Git-as-source-of-truth invariant?
337. `[CONCEPT]` `{L2}` What is a Kubernetes Operator? How does OpenTrace's K8s Operator manage its 7 components using custom CRDs?
338. `[CONCEPT]` `{L2}` What is a feature flag? How does OpenTrace use LaunchDarkly to gate the `v2_span_format` feature for 10% of ingestion traffic?
339. `[CODE]` `{L2}` Integrate LaunchDarkly into OpenTrace Collector: evaluate `v2_span_format` flag per API key, route to new vs old span parser.
340. `[CODE]` `{L2}` Write OpenTrace's BENCHMARKS.md: ingestion throughput (10M spans/sec), ClickHouse query p99 (<200ms on 30-day window), Collector gRPC p99 (<5ms), storage cost vs Elasticsearch (8x cheaper).

---

# PART E — Middleware, Observability & E2E Synthesis (Q341–Q500)

341. `[CONCEPT]` `{L1}` What is middleware in an HTTP framework? Name five cross-cutting concerns middleware handles in OpenTrace.
342. `[CODE]` `{L2}` Write request logging middleware: log method, path, status, latency, request_id, trace_id on every request using `slog.Info`.
343. `[CODE]` `{L2}` Write request ID middleware: generate UUID if no `X-Request-ID`, inject into context and response header.
344. `[CODE]` `{L2}` Write JWT auth middleware for OpenTrace: extract Bearer token, verify RS256 signature using public key, inject claims into context, return 401 with RFC 7807 on failure.
345. `[CODE]` `{L2}` Write panic recovery middleware: recover from panics, log stack trace, return 500 with RFC 7807 body, never crash the server.
346. `[CONCEPT]` `{L2}` What is the correct middleware chain ordering for OpenTrace? Why does recovery run first, auth run after logging?
347. `[CODE]` `{L2}` Implement middleware chain for OpenTrace chi router: recovery → request_id → logger → auth → rate_limit → handler → compress. Show the chi `Use()` calls.
348. `[CODE]` `{L2}` Propagate `trace_id`, `user_id`, `tenant_id` through Go context: set in auth middleware, read in handler, pass to DB query function, appear in all log lines.
349. `[CODE]` `{L2}` Implement graceful HTTP server shutdown: catch SIGTERM, `server.Shutdown(30s ctx)`, then `kafkaProducer.Flush(30s)`, then `db.Close()`.
350. `[CODE]` `{L2}` Implement non-blocking span ingest with backpressure: write spans to buffered `chan []Span` of size 10K. Return `503 Service Unavailable` immediately when channel is full.
351. `[CODE]` `{L2}` Implement circuit breaker middleware for OpenTrace: after `kafkaErrCount > 10` in 60s, return `503` for 30s without attempting Kafka produce.
352. `[CODE]` `{L2}` Implement per-route timeouts in chi: `/v1/spans` → 5s, `/v1/traces/{id}` → 10s, `/v1/export` → 300s.
353. `[CODE]` `{L2}` Pass request context to every DB and Kafka call in OpenTrace. Show that a cancelled client request cancels the in-flight ClickHouse query.
354. `[CODE]` `{L2}` Implement content negotiation middleware: read `Content-Type`, dispatch to JSON or Protobuf unmarshaler, return `415 Unsupported Media Type` for anything else.
355. `[CODE]` `{L2}` Implement a centralized error handler in chi: map `ErrNotFound → 404`, `ErrForbidden → 403`, `ErrRateLimit → 429`, unknown → 500. Write RFC 7807 body for each.
356. `[CODE]` `{L2}` Implement streaming JSON body processing: `json.NewDecoder(r.Body).Decode(&span)` in a loop, process each span as it arrives without loading the entire body.
357. `[CODE]` `{L2}` Implement rate limiter middleware: extract API key from JWT, call Redis sliding window Lua script, return 429 with `Retry-After` when limit exceeded.
358. `[CODE]` `{L2}` Implement idempotency middleware: check Redis for `idem:{key}`, return cached `{status, body}` if found; capture response body on first request, cache with 24h TTL.
359. `[CODE]` `{L2}` Add OTel HTTP server middleware: create root span for every request using `otelhttp.NewHandler(router, "openTrace.collector")`, propagate `traceparent` from incoming headers.
360. `[CODE]` `{L2}` Implement Prometheus RED metrics middleware: record `http_requests_total{method, path, status}` counter and `http_request_duration_seconds{method, path}` histogram.
361. `[CODE]` `{L2}` Implement multi-tenant isolation middleware: after JWT auth, extract `tenant_id` from claims, inject into context. All downstream DB queries include `WHERE tenant_id = $tenant`.
362. `[CODE]` `{L2}` Implement dual-auth middleware: try `Authorization: Bearer` (JWT) first, fallback to `X-API-Key` header (hashed API key lookup), return 401 if neither valid.
363. `[CODE]` `{L2}` Write a `responseWriter` wrapper that captures the HTTP status code and bytes written for accurate access logging in OpenTrace's middleware.
364. `[CODE]` `{L2}` Implement reconnect jitter for OpenTrace SDK clients: `baseDelay * 2^attempt + random(0, baseDelay * 0.1)`, max 30s cap. Show the Go implementation.
365. `[CODE]` `{L2}` Implement span fan-out in OpenTrace: after Kafka consume, look up all WebSocket connections watching `trace_id` using `sync.Map`, send span to each subscriber's channel.
366. `[CODE]` `{L2}` Fix blocked subscriber channels in OpenTrace fan-out: use non-blocking send (`select { case ch <- span: default: logDrop() }`). Drop for slow consumers rather than blocking producer.
367. `[CODE]` `{L2}` Implement OTel trace context injection into Kafka message headers in OpenTrace Collector: `otel.GetTextMapPropagator().Inject(ctx, kafkaHeaderCarrier)`.
368. `[CODE]` `{L2}` Implement OTel trace context extraction in OpenTrace Processor: `ctx = otel.GetTextMapPropagator().Extract(ctx, kafkaHeaderCarrier)` to continue the distributed trace from Kafka message.
369. `[CODE]` `{L2}` Implement self-instrumentation circuit breaker in OpenTrace: add `openTrace.self=true` attribute to self-generated spans so the Processor skips processing them (prevents infinite recursion).
370. `[CONCEPT]` `{L2}` What is the `Server-Timing` header? How does OpenTrace use it to expose `db`, `kafka`, and `total` timings to browser DevTools?
371. `[CONCEPT]` `{L2}` What is `goleak.VerifyNone`? How does OpenTrace use it in every Go test to catch goroutine leaks introduced during test teardown?
372. `[CONCEPT]` `{L2}` What is `go test -race`? What data races does the race detector catch that normal tests miss? Give an OpenTrace example.
373. `[CONCEPT]` `{L2}` What is `testcontainers-go`? How does OpenTrace use it for integration tests with real PostgreSQL, Redis, and Kafka containers?
374. `[CONCEPT]` `{L2}` What is Playwright? How does OpenTrace use it for E2E tests: submit trace, verify it appears in list, click to open detail, verify spans display?
375. `[CONCEPT]` `{L2}` What is k6? How do k6 thresholds fail a load test? What is the `http_req_duration{p(99)} < 10ms` threshold for OpenTrace?
376. `[APPLY]` `{L2}` OpenTrace k6 results: p50=2ms, p95=8ms, p99=150ms. Error rate spikes to 5% at 80 VUs. What components should you investigate first?
377. `[APPLY]` `{L2}` Write the OpenTrace incident runbook for "ClickHouse query p99 > 2s": symptoms, triage steps, diagnosis queries, remediation, escalation path.
378. `[APPLY]` `{L2}` Write the OpenTrace incident runbook for "Kafka consumer lag > 1M messages": what does it indicate, how do you scale, how do you check partition assignment.
379. `[APPLY]` `{L2}` Write a mini postmortem for: "2024-01-15 03:00 UTC — Collector crashed due to goroutine leak in tail sampling buffer. 15-minute span loss. Fix: added buffer size cap."
380. `[APPLY]` `{L2}` Document the OpenTrace PITR runbook: `DROP TABLE` at 14:37, last backup at 2am, how do you recover to 14:36? Walk through exact `recovery_target_time` steps.
381. `[APPLY]` `{L2}` Write the OpenTrace ADR for "ClickHouse over Elasticsearch for span storage": context, decision, alternatives considered, consequences.
382. `[APPLY]` `{L2}` Write the OpenTrace ADR for "tail-based vs head-based sampling": context, decision (tail-based), consequences (memory, complexity), alternatives (head-based: simpler, wastes storage).
383. `[APPLY]` `{L2}` Prepare the Infraspec OpenTrace architecture pitch (2 minutes): 7 components, Kafka pipeline, ClickHouse storage, 10M spans/sec, key engineering challenges.
384. `[APPLY]` `{L2}` Infraspec question: "What would you do differently rebuilding OpenTrace today?" — discuss ClickHouse vs DuckDB, gRPC vs HTTP/3, Kafka vs Redpanda.
385. `[APPLY]` `{L2}` Infraspec question: "How does OpenTrace handle partial failures?" — circuit breakers, DLQ, fencing tokens, retry semantics at each component boundary.
386. `[APPLY]` `{L2}` Infraspec question: "Scale OpenTrace to 100M spans/sec." — identify bottlenecks: Collector scale, Kafka partition increase, ClickHouse cluster, query caching.
387. `[APPLY]` `{L2}` Describe the Jaeger ClickHouse plugin proposal: current Jaeger storage backends, how ClickHouse fits, the gRPC storage plugin interface, implementation plan using OpenTrace's storage layer.
388. `[APPLY]` `{L2}` Compare OpenTrace to Jaeger: scope, performance limits (10M/sec vs Jaeger's limits), architecture differences, where they're complementary.
389. `[APPLY]` `{L2}` Design the OpenTrace GitHub monorepo: `/collector`, `/processor`, `/query`, `/ui`, `/pkg/proto`, `/pkg/storage`, `/pkg/kafka`, shared `Makefile`, per-component `Dockerfile`.
390. `[APPLY]` `{L2}` Write the OpenTrace RFC for "Collector backpressure strategy": problem statement, three options (drop, block, queue), recommendation with explicit tradeoffs.
391. `[APPLY]` `{L2}` Walk through OpenTrace's disaster recovery: ClickHouse data corrupted, PostgreSQL healthy, Kafka retains 7 days of spans. How do you recover ClickHouse from Kafka replay?
392. `[APPLY]` `{L3}` Design OpenTrace v2: add profiles (Go pprof) and metrics (OpenMetrics) alongside traces. How does the architecture change? What new components are needed?
393. `[APPLY]` `{L2}` Describe OpenTrace's self-referential demo: submit a query to OpenTrace UI, observe the trace of that query appearing in OpenTrace itself. Show the call chain UI → API gateway → Query Service → ClickHouse.
394. `[CONCEPT]` `{L2}` What is an ADR (Architecture Decision Record)? What is the standard format? Write the structure for a typical OpenTrace ADR.
395. `[CONCEPT]` `{L2}` What is a runbook? What are the five required sections for an OpenTrace production runbook? How does it differ from a postmortem?
396. `[CONCEPT]` `{L2}` What is the Infraspec narrative for OpenTrace? What are the three key metrics to highlight in the first 30 seconds of a technical interview?
397. `[APPLY]` `{L2}` Write OpenTrace's README "What is this?" section in three sentences that a senior backend engineer can immediately understand.
398. `[APPLY]` `{L2}` Design the OpenTrace Kubernetes Operator: what custom resources does it define (OpenTraceCluster, OpenTraceCollector, OpenTraceStorage)? What does the reconcile loop do?
399. `[APPLY]` `{L2}` Describe OpenTrace's OTel SDK compatibility test: configure official `go.opentelemetry.io/otel` SDK with `OTEL_EXPORTER_OTLP_ENDPOINT=collector:4317`, send 1000 spans, verify receipt.
400. `[CONCEPT]` `{L2}` What is the LFX Mentorship program? How does OpenTrace's architecture directly enable the Jaeger ClickHouse storage plugin proposal as a contribution?
401. `[APPLY]` `{L2}` Explain the OpenTrace biweekly project structure: 12 projects over 6 months, each building one layer. How do they connect to form a complete system by Week 24?
402. `[APPLY]` `{L2}` Describe what you built in Biweekly Project 1 (TCP connection pool): what protocol, what pool implementation, what tests, what performance you achieved.
403. `[APPLY]` `{L2}` Describe Biweekly Project 4 (DNS resolver): what RFC did you implement, what query types, how does your resolver compare to CoreDNS in scope?
404. `[APPLY]` `{L2}` Describe Biweekly Project 7 (distributed lock service): what API, what Redis implementation, what fencing tokens, what the test for split-brain looks like.
405. `[APPLY]` `{L2}` Describe Biweekly Project 10 (LSM-tree storage engine): what MemTable, SSTable, Bloom filter, compaction strategy you implemented. What read/write throughput did you achieve?
406. `[CONCEPT]` `{L2}` What is the OpenTrace observability stack: Prometheus, Grafana, Loki, Tempo? How does each component contribute?
407. `[CODE]` `{L2}` Write the Prometheus scrape config for OpenTrace: scrape `collector:9090/metrics`, `processor:9090/metrics`, `query:9090/metrics` every 15s.
408. `[CODE]` `{L2}` Write the Grafana datasource config for OpenTrace: Prometheus at `http://prometheus:9090`, Loki at `http://loki:3100`, Tempo at `http://tempo:3200`.
409. `[CODE]` `{L2}` Write Alertmanager routing config for OpenTrace: `severity=critical` → PagerDuty, `severity=warning` → Slack `#openTrace-alerts`, `severity=info` → Slack `#openTrace-info`.
410. `[CONCEPT]` `{L2}` What is Loki? How does it store logs differently from Elasticsearch? What is the LogQL query language?
411. `[CODE]` `{L2}` Write a LogQL query to find all OpenTrace Collector error logs in the last 1 hour: `{service="openTrace-collector"} |= "error" | json | level="error"`.
412. `[CONCEPT]` `{L2}` What is Tempo? How does it store distributed traces? How does Grafana link a log line to its trace via `trace_id`?
413. `[CODE]` `{L2}` Configure Grafana trace-to-logs correlation for OpenTrace: in Tempo datasource, add Loki derived field `trace_id` → Loki query `{trace_id="$trace_id"}`.
414. `[CONCEPT]` `{L2}` What is the difference between `histogram_quantile` on a Prometheus histogram vs a summary metric? Why does OpenTrace prefer histograms?
415. `[CODE]` `{L2}` Write the PromQL for OpenTrace's span ingestion rate: `rate(spans_received_total[5m])`. Write the alert: fire if rate drops below 1000/sec for 2 minutes.
416. `[CODE]` `{L2}` Write the PromQL for OpenTrace's Kafka consumer lag: `kafka_consumer_group_lag{topic="spans"}`. Alert if sum > 100K for 5 minutes.
417. `[CODE]` `{L2}` Write the PromQL for OpenTrace Collector's Go GC pause time p99: `histogram_quantile(0.99, rate(go_gc_pauses_seconds_bucket[5m]))`. Alert if > 10ms.
418. `[CONCEPT]` `{L2}` What is pprof CPU profiling vs trace vs heap vs goroutine? When would you use each during an OpenTrace production incident?
419. `[CODE]` `{L2}` Implement `/debug/pprof` exposure in OpenTrace on a separate internal port (not public): `mux.Handle("/debug/pprof/", http.DefaultServeMux)` on `:6060`.
420. `[CONCEPT]` `{L2}` What is `GOMEMLIMIT`? How do you set it to 90% of container memory limit in Kubernetes to prevent OOMKill while allowing GC to reclaim before the hard limit?
421. `[CODE]` `{L2}` Set `GOMEMLIMIT` for OpenTrace Collector in Kubernetes env: `GOMEMLIMIT=900MiB` (with `limits.memory: 1Gi`). Show the environment variable in the Deployment spec.
422. `[CONCEPT]` `{L2}` What is `GOGC`? What is the default value (100)? When would you lower it to 50 for OpenTrace's high-throughput span processing?
423. `[CODE]` `{L2}` Write a Go benchmark for OpenTrace's Protobuf span unmarshal: `BenchmarkUnmarshalSpan`. Target < 1000 ns/op, 0 allocs/op using `sync.Pool` for buffers.
424. `[CODE]` `{L2}` Profile OpenTrace Collector under load: `go tool pprof http://collector:6060/debug/pprof/heap`. Identify the top three allocations in the flame graph.
425. `[CONCEPT]` `{L2}` What is escape analysis in Go? How does `go build -gcflags="-m"` identify heap allocations in OpenTrace's hot span processing path?
426. `[CODE]` `{L2}` Run `go build -gcflags="-m" ./...` on OpenTrace Collector. Identify two heap allocations in the hot path that can be moved to stack by changing function signatures.
427. `[CONCEPT]` `{L2}` What is `sync.Pool`? How does OpenTrace use it to reuse Protobuf decode buffers and reduce GC pressure during 10M spans/sec processing?
428. `[CODE]` `{L2}` Implement a `sync.Pool` for span Protobuf buffers in OpenTrace Collector: `Get()` from pool before unmarshal, `Put()` back after processing to reduce allocations.
429. `[CONCEPT]` `{L2}` What is `singleflight` in Go? When does OpenTrace use it to collapse concurrent identical ClickHouse queries for the same trace_id?
430. `[CODE]` `{L2}` Implement `singleflight` in OpenTrace Query Service: `var group singleflight.Group; group.Do(traceId, func() { query ClickHouse, cache result, return })`.
431. `[CONCEPT]` `{L2}` What is `errgroup` in Go? How does OpenTrace use it to start gRPC server, HTTP server, and Kafka producer simultaneously with mutual cancellation on failure?
432. `[CODE]` `{L2}` Implement OpenTrace Collector startup with `errgroup`: start gRPC server, HTTP server, Kafka producer; if any fails, cancel all others and return the first error.
433. `[CONCEPT]` `{L2}` What is `context.WithCancel` vs `context.WithTimeout` vs `context.WithDeadline`? How does OpenTrace use each in different parts of the request lifecycle?
434. `[CODE]` `{L2}` Implement context cancellation propagation in OpenTrace: when the gRPC client cancels (deadline exceeded), cancel the in-flight ClickHouse query and Kafka produce via context.
435. `[CONCEPT]` `{L2}` What is `atomic.Int64` in Go? When does OpenTrace use it for lock-free span counters instead of `sync.Mutex`?
436. `[CODE]` `{L2}` Use `atomic.Int64` to count spans processed per second in OpenTrace Collector without mutex overhead. Show the counter reset and rate calculation.
437. `[CONCEPT]` `{L2}` What is `sync.RWMutex`? When does OpenTrace use it for the trace-watcher registry (many concurrent reads, rare writes) vs `sync.Mutex`?
438. `[CODE]` `{L2}` Implement the OpenTrace WebSocket connection registry using `sync.RWMutex`: `RLock` for fan-out reads, `Lock` for connect/disconnect writes.
439. `[CONCEPT]` `{L2}` What is a goroutine leak in OpenTrace? Name five patterns that cause goroutine leaks in the Collector codebase.
440. `[CODE]` `{L2}` Fix this goroutine leak: `ch := make(chan Span); go func() { ch <- processSpan() }()`. The caller returns on context cancellation but the goroutine blocks forever on `ch`.
441. `[CONCEPT]` `{L2}` What is `cobra` in Go? How do you structure OpenTrace Collector's CLI: `collector serve --port=4317 --config=config.yaml`?
442. `[CODE]` `{L2}` Write the OpenTrace Collector `cobra` root command with subcommands: `serve`, `validate-config`, `version`. Show `PersistentPreRunE` for config loading.
443. `[CONCEPT]` `{L2}` What is `chi` router in Go? How do you organize OpenTrace's HTTP routes with middleware groups, route groups, and per-route middleware?
444. `[CODE]` `{L2}` Write OpenTrace HTTP server setup using chi: route groups `/v1` and `/v2`, shared auth middleware, per-route timeouts, graceful shutdown integration.
445. `[CONCEPT]` `{L2}` What is `sqlc` in Go? How does it generate type-safe Go code from SQL queries? Show the workflow for OpenTrace's PostgreSQL queries.
446. `[CODE]` `{L2}` Write a `sqlc` query for OpenTrace: `-- name: GetSpansByTrace :many SELECT * FROM spans WHERE trace_id = $1 ORDER BY start_time ASC`. Show generated Go struct and function signature.
447. `[CONCEPT]` `{L2}` What is `golang-migrate`? What is the up/down migration convention? How does OpenTrace use it for schema migrations?
448. `[CODE]` `{L2}` Write a `golang-migrate` migration for OpenTrace: create `000001_create_spans_table.up.sql` and `000001_create_spans_table.down.sql`. Show the schema.
449. `[CONCEPT]` `{L2}` What is `database/sql` in Go? What are `db.SetMaxOpenConns`, `db.SetMaxIdleConns`, `db.SetConnMaxLifetime`? How do you size these for OpenTrace's 10M spans/sec?
450. `[CODE]` `{L2}` Write a Go function using `database/sql` that correctly acquires a connection, queries with context, returns the connection, handles errors, and cancels on context timeout.
451. `[CONCEPT]` `{L2}` What is `Zod` in TypeScript? How does a single Zod schema generate both runtime validation and TypeScript types for OpenTrace's API clients?
452. `[CODE]` `{L2}` Write a Zod schema for OpenTrace's `CreateSpanRequest`: trace_id (UUID), span_id (UUID), service_name (string, min 1, max 100), duration_ms (positive number). Generate the TypeScript type.
453. `[CONCEPT]` `{L2}` What is TypeScript `strict: true`? What does it enable: `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`?
454. `[CODE]` `{L2}` Write a TypeScript branded type for `TraceId` in OpenTrace so that `string` cannot be accidentally passed where `TraceId` is required.
455. `[CODE]` `{L2}` Write a TypeScript `Result<T, E>` type for OpenTrace's API client: `Ok<T> | Err<E>`. Use it in the span submission function return type.
456. `[CONCEPT]` `{L2}` What is `AsyncLocalStorage` in Node.js? How does OpenTrace's Next.js frontend use it to propagate `trace_id` through all async operations without passing it explicitly?
457. `[CODE]` `{L2}` Implement trace context propagation in Node.js using `AsyncLocalStorage`: wrap every request handler, store `trace_id`, read it in any downstream logger.
458. `[CONCEPT]` `{L2}` What is a Node.js `worker_thread`? How does OpenTrace's DungBeetle job processor offload CPU-heavy span parsing to a worker thread?
459. `[CODE]` `{L2}` Implement a worker thread in DungBeetle: spawn thread with `new Worker('./parser.js', {workerData: rawSpan})`, receive result via `worker.on('message', ...)`.
460. `[CONCEPT]` `{L2}` What is Node.js `cluster` module? How does DungBeetle's Node.js HTTP server use it to distribute connections across CPU cores?
461. `[CODE]` `{L2}` Implement DungBeetle Node.js cluster: `cluster.fork()` `os.cpus().length` workers, graceful shutdown that drains each worker before `process.exit()`.
462. `[CONCEPT]` `{L2}` What is `Prisma` vs `postgres.js` vs `pg` for PostgreSQL in Node.js? When does each apply for DungBeetle's job queue?
463. `[CODE]` `{L2}` Write DungBeetle's job queue worker in Node.js using `postgres.js`: `SELECT FOR UPDATE SKIP LOCKED WHERE status='pending' ORDER BY priority DESC LIMIT 1`.
464. `[CODE]` `{L2}` Write the Vitest integration test for DungBeetle's job queue: start PostgreSQL via `testcontainers`, insert a job, run the worker, assert the job moves to `completed` status.
465. `[CODE]` `{L2}` Write `tsc --noEmit` step in DungBeetle's GitHub Actions CI: fail the build on TypeScript errors. Show the exact CI job configuration.
466. `[CONCEPT]` `{L2}` What is Node.js streams backpressure? What is `highWaterMark`? How does DungBeetle's CSV import stream use it to process 200MB files with constant ~20MB memory?
467. `[CODE]` `{L2}` Implement a Transform stream in DungBeetle that parses and validates each CSV row, using `pipeline()` for proper error handling and backpressure.
468. `[CONCEPT]` `{L2}` What is Next.js App Router vs Pages Router? When does OpenTrace UI use Server Components vs Client Components?
469. `[CODE]` `{L2}` Implement an OpenTrace Server Component that fetches the trace list from the Query Service at build time (SSG) vs request time (SSR). Show the `generateStaticParams` usage.
470. `[CODE]` `{L2}` Implement React Query in OpenTrace UI: `useQuery({queryKey: ['trace', traceId], queryFn: fetchTrace})`. Show cache invalidation when a new span arrives via WebSocket.
471. `[CONCEPT]` `{L2}` What is React's virtual DOM reconciliation? How does OpenTrace's trace waterfall avoid unnecessary re-renders when new spans arrive at 100/sec?
472. `[CODE]` `{L2}` Use `React.memo` and `useCallback` in OpenTrace's span row component to prevent re-renders when unrelated state changes in the parent.
473. `[CODE]` `{L2}` Implement the OpenTrace trace waterfall with `react-window` `FixedSizeList`: render 10K spans with only 50 DOM nodes, measure FPS improvement.
474. `[CONCEPT]` `{L2}` What is React Server Actions? How does OpenTrace UI use them for form submissions instead of API routes?
475. `[CODE]` `{L2}` Implement a BookWise booking Server Action: validate `bookingSchema`, call PostgreSQL, return typed result. Show `useFormState` hook usage.
476. `[APPLY]` `{L2}` Walk through what happens end-to-end when a developer instruments their app with the OpenTrace SDK and sends the first span: SDK initialization, gRPC connection, span serialization, Collector receipt, Kafka publish, Processor consume, ClickHouse write, UI display.
477. `[APPLY]` `{L2}` Walk through what happens when a user opens the OpenTrace UI and searches for "traces from service user-api in the last 1 hour": UI API call, Query Service logic, ClickHouse query, response pagination, UI rendering.
478. `[APPLY]` `{L2}` Walk through OpenTrace's live tail feature: user opens WebSocket, Processor receives a new span matching the trace_id, Redis pub/sub broadcast, WebSocket fan-out, browser display.
479. `[APPLY]` `{L2}` Walk through OpenTrace's alerting pipeline: ClickHouse detects span error rate spike, alert fires in Prometheus, Alertmanager routes to PagerDuty, on-call engineer receives page, opens Grafana, drills to Loki logs, finds root cause.
480. `[APPLY]` `{L2}` Walk through OpenTrace's trace export flow: user requests export of 1M spans, async job created, Processor queries ClickHouse in batches, writes to S3 as Parquet, presigned URL returned, user downloads.
481. `[APPLY]` `{L2}` Describe OpenTrace's multi-tenant isolation: how is tenant_id enforced at the API layer (JWT claims), storage layer (ClickHouse partition), cache layer (Redis key prefix), and WebSocket layer (connection registry)?
482. `[APPLY]` `{L2}` Describe OpenTrace's rate limiting strategy: per-API-key limits (Kafka write quota), per-tenant limits (total span volume), global limits (Collector accept rate). What happens when each limit is hit?
483. `[APPLY]` `{L2}` Describe how OpenTrace handles a network partition between the Collector and Kafka: circuit breaker opens, 503 returned to SDKs, SDKs retry with exponential backoff, partition heals, circuit closes, normal ingestion resumes.
484. `[APPLY]` `{L2}` Describe OpenTrace's data retention: hot data in ClickHouse (90 days), warm data in ClickHouse cold tier (180 days), cold data in S3 Parquet (indefinite). What drives the tiering decisions?
485. `[APPLY]` `{L2}` Describe OpenTrace's tail-based sampling decision: all spans collected, after 60s of no new spans for a trace, sample decision made, 5% of traces kept for display, 95% metadata-only stored.
486. `[APPLY]` `{L2}` Design OpenTrace's capacity planning: 10M spans/sec, each span ~2KB. Calculate: Collector CPU/memory, Kafka throughput and storage, Processor CPU, ClickHouse storage per day, monthly S3 cost.
487. `[APPLY]` `{L2}` Design OpenTrace's disaster recovery plan: RPO = 0 minutes (no data loss), RTO = 10 minutes (fast recovery). What replication and backup strategies achieve this?
488. `[APPLY]` `{L2}` Walk through the sequence of engineering decisions that led to OpenTrace's architecture: why gRPC over HTTP/1.1, why Kafka over direct DB write, why ClickHouse over PostgreSQL, why tail-based sampling over head-based.
489. `[APPLY]` `{L3}` Design OpenTrace's next 6-month roadmap: v2.0 features (profiles, metrics), enterprise features (SAML SSO, audit logs, per-tenant rate limits), performance targets (50M spans/sec).
490. `[APPLY]` `{L3}` How would you open-source OpenTrace? What is the license choice (Apache 2.0 vs MIT vs AGPL)? What is the governance model? What is the first community contribution you'd accept?
491. `[CONCEPT]` `{L2}` What is the OTLP (OpenTelemetry Protocol)? What proto files define it? How does OpenTrace implement both the gRPC and HTTP transports?
492. `[CONCEPT]` `{L2}` What is W3C Trace Context standard? What is the `traceparent` header? What is `tracestate`? How does OpenTrace comply with both?
493. `[CONCEPT]` `{L2}` What is the OpenTelemetry Semantic Conventions? What attributes are standard for HTTP spans (`http.method`, `http.status_code`, `net.peer.ip`)? How does OpenTrace validate incoming spans?
494. `[CODE]` `{L2}` Write a Go middleware that adds standard OTel HTTP semantic convention attributes to every server span: `http.method`, `http.route`, `http.status_code`, `net.peer.ip`.
495. `[CONCEPT]` `{L2}` What is W3C Baggage header? What is the difference between trace context propagation and baggage propagation? When would OpenTrace propagate `tenant_id` as baggage?
496. `[CODE]` `{L2}` Inject `tenant_id` as W3C Baggage in OpenTrace's API gateway middleware: `baggage.NewKeyValueProperty("tenant.id", tenantId)`, include in all outgoing calls to downstream services.
497. `[CONCEPT]` `{L2}` What is the OpenTelemetry Collector (OTelCol) separate from OpenTrace Collector? What is an OTLP receiver, a batch processor, and an OTLP exporter in OTelCol's pipeline?
498. `[APPLY]` `{L2}` Explain how a customer can replace the official OTelCol with OpenTrace's Collector in their existing setup: same OTLP endpoint, same protocol, additional features (tail sampling, compression).
499. `[APPLY]` `{L2}` Walk through the Infraspec interview technical deep-dive: you will be asked to explain OpenTrace's architecture on a whiteboard. Describe each of the 7 components, their connections, and the data flow in 10 minutes.
500. `[APPLY]` `{L1}` Final synthesis: Walk through the COMPLETE lifecycle of a single HTTP request to `GET /v1/traces/abc123`. Cover every layer: DNS resolution → TCP handshake → TLS 1.3 negotiation → HTTP/2 stream → chi middleware chain (recovery → request_id → logger → auth → rate_limit) → ClickHouse query → response streaming → TCP teardown. Name every timeout, protocol, and data structure touched.
