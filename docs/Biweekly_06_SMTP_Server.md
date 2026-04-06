# Biweekly Project 6 — SMTP Server
## Email Protocol from Scratch

**Timeline:** Weeks 11–12  
**Language:** Go  
**What it mirrors:** Postfix · Haraka · MailHog (dev SMTP) · AWS SES receiving pipeline  

---

## 1. What This Teaches

How email actually works at the protocol level — the SMTP command sequence, MX record lookup for routing, STARTTLS for transport security, and DKIM/SPF concepts for deliverability. Most engineers use SendGrid as a black box. After this project, you understand what SendGrid is doing at the TCP level and why email deliverability is hard.

---

## 2. The Problem It Solves

You want to receive email at `notifications@paycore.dev` and process it programmatically — parsing the sender, subject, and body from the raw SMTP stream. You also want to understand how to send email without a third-party provider by speaking SMTP directly to recipient mail servers.

---

## 3. What You Build

### 3.1 Components

| Component | Responsibility |
|---|---|
| TCP Listener | Listens on port 2525 (non-privileged alternative to 25) |
| SMTP State Machine | Implements the SMTP command sequence (EHLO → MAIL FROM → RCPT TO → DATA → QUIT) |
| TLS Upgrade | STARTTLS command upgrades the connection to TLS in-place |
| Message Parser | Parses raw email: headers (From, To, Subject, Date), MIME body, attachments |
| MX Resolver | Looks up MX records for recipient domain to find the target mail server |
| Outbound Sender | Connects to recipient's mail server and delivers the email over SMTP |
| Storage Backend | Saves received emails to PostgreSQL for programmatic access |

### 3.2 SMTP Command Sequence

```
Client (sender)           Server (your SMTP server)
──────────────────────────────────────────────────
                    ←  220 mail.paycore.dev ESMTP ready
EHLO sender.com     →
                    ←  250-mail.paycore.dev
                    ←  250-STARTTLS
                    ←  250-SIZE 10485760
                    ←  250 OK
STARTTLS            →
                    ←  220 Go ahead
[TLS handshake]
EHLO sender.com     →  (repeated after TLS)
                    ←  250 OK
MAIL FROM:<noreply@sender.com>  →
                    ←  250 OK
RCPT TO:<user@paycore.dev>  →
                    ←  250 OK
DATA                →
                    ←  354 Start mail input
[email headers + body]  →
.                   →  (single dot = end of message)
                    ←  250 OK: queued as msg-id-xyz
QUIT                →
                    ←  221 Bye
```

### 3.3 Email Message Structure

```
From: noreply@zomato.com
To: user@paycore.dev
Subject: Your order has been delivered
Date: Mon, 01 Jan 2026 12:00:00 +0530
Content-Type: multipart/alternative; boundary="boundary123"
Message-ID: <unique-id@zomato.com>

--boundary123
Content-Type: text/plain; charset=utf-8

Your order #ORD-456 has been delivered.

--boundary123
Content-Type: text/html; charset=utf-8

<html><body>Your order <b>#ORD-456</b> has been delivered.</body></html>

--boundary123--
```

### 3.4 MX Record Lookup for Outbound Sending

```go
// To send email to user@gmail.com:
// 1. Look up MX records for gmail.com
mxRecords, err := net.LookupMX("gmail.com")
// Returns: [alt1.gmail-smtp-in.l.google.com (priority 5), ...]

// 2. Sort by priority (lowest = preferred)
// 3. Connect to highest-priority MX server on port 25
// 4. Complete SMTP handshake and deliver
```

---

## 4. Key Concepts Demonstrated

- **SMTP is text-based** — every command is a plain ASCII line terminated by `\r\n`. The server responds with 3-digit status codes (2xx = success, 4xx = temporary failure, 5xx = permanent failure).
- **STARTTLS in-place upgrade** — unlike HTTPS which uses a separate port (443), SMTP upgrades an existing plaintext connection to TLS using the STARTTLS command. The connection goes from plaintext → TLS without reconnecting.
- **MIME multipart** — modern emails contain both plain-text and HTML versions in a `multipart/alternative` container. Email clients choose the version they can render.
- **MX record routing** — email routing uses MX DNS records, not A records. A domain can have multiple MX servers with priorities. The lowest-priority number = highest preference.
- **Why SPF/DKIM exist** — SMTP has no built-in authentication. Anyone can claim `MAIL FROM:<ceo@google.com>`. SPF (sender IP whitelist in DNS) and DKIM (cryptographic signature in email header) are the fixes. Understanding this is why you know not to run your own mail server in production.

---

## 5. Implementation Checklist

- [ ] TCP listener on port 2525
- [ ] SMTP state machine: EHLO, MAIL FROM, RCPT TO, DATA, QUIT, RSET, NOOP
- [ ] STARTTLS: generate self-signed TLS cert for dev, TLS upgrade on command
- [ ] Message accumulation: buffer email data between DATA and `.`
- [ ] MIME parser: extract From, To, Subject, Date headers and text/html body parts
- [ ] PostgreSQL storage: `emails (id, from, to, subject, body_text, body_html, raw, received_at)`
- [ ] REST API: `GET /emails` list, `GET /emails/{id}` detail (MailHog-style UI optional)
- [ ] MX resolver: `net.LookupMX` for outbound routing
- [ ] Outbound sender: connect to MX server, complete SMTP handshake, deliver
- [ ] Integration test: send email to your server using `net/smtp`, verify it appears in storage

---

## 6. Benchmarks to Document

| Metric | Target |
|---|---|
| Email ingestion throughput | 1,000 emails/min |
| SMTP handshake time | < 100ms (local) |
| TLS handshake overhead | < 10ms additional |
| Message parsing time (1MB email) | < 5ms |
| MX lookup + delivery time | 1–5s (network dependent) |

---

## 7. Interview Value

- **All companies (OA MCQs):** SMTP, MX records, and email headers appear in networking MCQs at Swiggy, Zomato, and Adobe.
- **System design:** *"How would you build an email notification system?"* — Understanding SMTP at the protocol level means you know exactly what SendGrid abstracts and why that abstraction is worth paying for.
- **Security rounds:** *"Why can't you just trust the `From:` header in an email?"* — SMTP has no sender authentication by default. SPF/DKIM/DMARC are DNS-based fixes.
- **Notification Delivery Service:** This project gives you the knowledge to implement email delivery from first principles, making the Notification Delivery Service's email channel trivial to reason about.

---

## 8. ADR to Write

**"Own SMTP server vs third-party provider (SendGrid/SES)"**  
Decision: use AWS SES for production email delivery.  
Building your own: educational value is enormous, but deliverability requires IP reputation, SPF/DKIM/DMARC setup, bounce handling, and ISP relationship management — all operational overhead with no engineering value for a product company.  
This project exists to understand what SES does, not to replace it.
