#!/usr/bin/env python3
"""Generate src/data/machineCoding.json from the interview catalog."""
import json
from pathlib import Path

COMPANIES = [
    {"id": "uber", "name": "Uber", "focus": "Geospatial dispatch, event streaming, and real-time systems. High-concurrency ingestion, spatial partitioning, dynamic pricing, and low-latency matching."},
    {"id": "stripe", "name": "Stripe", "focus": "Financial ledgers, distributed idempotency, and developer infrastructure. Maintainable APIs, defensive types, and structured error propagation."},
    {"id": "razorpay", "name": "Razorpay", "focus": "Payment gateways, webhook orchestration, and high-integrity ledgers. UPI pipelines, nodal settlement, integer money, concurrent merchant debits."},
    {"id": "flipkart", "name": "Flipkart", "focus": "India-scale e-commerce, in-memory domain engines, and modular OOP. SOLID, Strategy/Factory/Observer, working driver programs without external DBs."},
    {"id": "databricks", "name": "Databricks", "focus": "Unified lakehouse engines, Spark internals, and runtime metrics. WAL, CIDR tries, nested aggregation, columnar buffers, Delta ACID."},
    {"id": "snowflake", "name": "Snowflake", "focus": "Cloud warehouses, micro-partition pruning, and Snowsight tooling. Decoupled compute/storage, predicate pushdown, accessible data grids."},
    {"id": "pierre", "name": "The Pierre Computer Company", "focus": "Content-addressed code storage, path-first file trees, and high-performance diff rendering. Git objects, 3PC quorum, virtual hierarchies."},
    {"id": "tml", "name": "Thinking Machines Lab", "focus": "Distributed training infrastructure, RL abstractions, and Tinker. Async client futures, LoRA memory, rollout buffers, GPU worker pools."},
]


def mc(prefix, company, rows):
    items = []
    for i, (title, stack, level, mechanics, variant) in enumerate(rows, 1):
        items.append({
            "id": f"{prefix}-MC-{i:02d}",
            "kind": "mc",
            "company": company,
            "title": title,
            "stack": stack,
            "level": level,
            "mechanics": mechanics,
            "variant": variant,
        })
    return items


def lld(prefix, company, rows):
    items = []
    for i, (title, entities, invariants, patterns) in enumerate(rows, 1):
        items.append({
            "id": f"{prefix}-LLD-{i:02d}",
            "kind": "lld",
            "company": company,
            "title": title,
            "entities": entities,
            "invariants": invariants,
            "patterns": patterns,
        })
    return items


def hld(prefix, company, rows):
    items = []
    for i, (title, scope, constraints, stack) in enumerate(rows, 1):
        items.append({
            "id": f"{prefix}-HLD-{i:02d}",
            "kind": "hld",
            "company": company,
            "title": title,
            "scope": scope,
            "constraints": constraints,
            "stack": stack,
        })
    return items


UBER_MC = [
    ("Real-Time Trip Status Tracker", "React / TypeScript", "Basic", "State machine transition table; WebSocket event binding; decoupled view rendering", "Uber Driver/Rider Web Client Live Coding"),
    ("Fare Estimate Comparison Slider", "React / CSS", "Basic", "Controlled inputs; memoized price multiplier calculation; accessible radio-group", "Uber Rider Web Booking Flow Screen"),
    ("Driver Document Upload Stepper", "React / Hooks", "Basic", "Multi-step state persistence; mime-type client validation; optimistic upload progress", "Uber Driver Onboarding Frontend Loop"),
    ("Vehicle Type Selector Carousel", "React / DOM", "Basic", "Keyboard ARIA accessibility; touch swipe calculation; scroll snap alignment", "Uber Eats / Rides Product Selection"),
    ("Real-Time ETA Countdown Clock", "React / Hooks", "Basic", "Drift-corrected setInterval; background tab synchronization via requestAnimationFrame", "Trip Dispatch Active HUD"),
    ("In-Memory Sliding Window Rate Limiter", "Go / Concurrency", "Basic", "Mutex-protected ring buffer; timestamp eviction; atomic request counter", "Uber L4 Core Services Machine Coding"),
    ("Thread-Safe In-Memory Key-Value Store", "Go / Mutexes", "Basic", "RWMutex read/write splitting; TTL background cleaner goroutine; race detector", "Uber Gateway Platform Screening"),
    ("Trip Cancellation Reason Selector", "React / Forms", "Basic", "Dynamic conditional textarea; debounced submission payload; dirty state check", "Rider Post-Booking Cancellation Flow"),
    ("Driver Earnings Dynamic Bar Chart", "React / SVG", "Basic", "Pure SVG coordinate mapping; linear scaling functions; hover tooltip portals", "Uber Driver Earnings Dashboard"),
    ("Basic Pub-Sub Event Bus", "TypeScript / Node", "Basic", "Map-based subscriber registry; exception-isolated synchronous delivery; unsubscribe token", "Uber Web Core Foundations Round"),
    ("Geospatial Coordinate Interpolator", "TypeScript / Canvas", "Medium", "Linear coordinate interpolation (Lerp); bearing angle computation; requestAnimationFrame", "Live Vehicle Marker Movement Loop"),
    ("Dynamic Surge Heatmap Canvas", "React / HTML5 Canvas", "Medium", "2D spatial grid rendering; color ramp interpolation; off-screen canvas buffering", "Uber Operations Heatmap Interface"),
    ("Virtualized Driver Trip History List", "React / Virtual DOM", "Medium", "Fixed window element recycling; dynamic row offset; scroll event throttling", "Driver Ledger Web Portal"),
    ("Multi-Segment Route Polyline Editor", "React / Leaflet", "Medium", "Waypoint insertion/deletion; drag event debouncing; turn-by-turn re-indexing", "Freight Route Planning Console"),
    ("Autocomplete Address Search Box", "React / Hooks", "Medium", "Request cancellation via AbortController; LRU query caching; key navigation", "Location Search Bar CoderPad"),
    ("Recurring Task Scheduler Daemon", "Java / Concurrency", "Medium", "PriorityBlockingQueue; worker thread pool; task execution re-enqueueing", "Uber L4 Machine Coding Round"),
    ("Driver Location Ingestion Buffer", "Go / Channels", "Medium", "Buffered channels; periodic batch flush worker; non-blocking drop policy", "Location Pipeline Ingestion Node"),
    ("Geospatial Radius Matcher (H3/Geohash)", "Python / Math", "Medium", "Spatial cell boundary matching; distance threshold filtering; sorted neighbor retrieval", "Driver-Rider Pairing Engine"),
    ("Token-Bucket Traffic Shaper", "Go / Goroutines", "Medium", "Continuous token replenishment via elapsed time; burst tolerance; atomic channel read", "Edge Proxy Gateway Live Coding"),
    ("In-Memory Connection Manager", "Node.js / WS", "Medium", "Heartbeat ping-pong; stale connection sweeper; broadcast pub-sub registry", "Push Notification WebSocket Gateway"),
    ("Trip Lifecycle Event State Machine", "Go / Interfaces", "Medium", "State pattern transitions; atomic CAS status verification; illegal state guards", "Trip Management Service"),
    ("Concurrent Batch Request Aggregator", "Go / Sync", "Medium", "Sync.WaitGroup coordination; channel timeout multiplexing; partial success handling", "Multi-Service Aggregator Engine"),
    ("Priority Queue Delivery Matcher", "Java / Generics", "Medium", "Custom Comparator; dynamic surge priority weights; thread-safe polling", "Uber Eats Dispatch Allocator"),
    ("Dynamic Surge Multiplier Calculator", "Python / OOP", "Medium", "Moving supply-demand ratio; historical decay factor; bounding clamp", "Surge Pricing Core Engine"),
    ("High-Frequency Telemetry Debouncer", "TypeScript / RxJS", "Medium", "Lossy sliding window debouncing; maximum emission latency cap; trailing event preservation", "Telematics Ingestion Layer"),
    ("Rider Splitting Split-Fare Calculator", "React / Context", "Medium", "Floating-point rounding guard; transaction delta distribution; participant status", "Shared Ride Booking UI"),
    ("Resilient Polling Hook with Backoff", "React / Custom Hook", "Medium", "Exponential backoff with jitter; window focus revalidation; aborted cleanup", "Driver Dispatch Polling Client"),
    ("Real-Time Chat Bubble Component", "React / Hooks", "Medium", "Optimistic message injection; delivery state tracking; auto-scroll stick-to-bottom", "In-App Rider-Driver Messenger"),
    ("In-Memory Distributed Lock Simulator", "Go / Mutex", "Medium", "Mutex lease expiration; periodic heartbeat extension; fence token generation", "Distributed State Machine Mock"),
    ("Circuit Breaker Middleware", "Go / HTTP", "Medium", "Trip state counter (Closed, Open, Half-Open); failure rate threshold; recovery probe", "Acquirer Gateway Proxy"),
    ("Real-Time Driver Supply Density Grid", "React / Canvas", "Advanced", "WebGL/2D context point rendering; spatial quadtree hover lookups; memory pooling", "Operations Command Center"),
    ("Dynamic Form Engine for Driver KYC", "React / TS", "Advanced", "Recursive JSON schema parser; asynchronous validation engine; field dependency graph", "Global Regulatory Driver Onboarding"),
    ("Fault-Tolerant Event Stream Pipeline", "Go / Channels", "Advanced", "Multi-worker fan-out/fan-in; graceful drain on SIGINT; dead-letter queue routing", "Telemetry Event Pipe"),
    ("High-Concurrency Order Matcher", "Java / Locks", "Advanced", "ReentrantLock condition variables; bidirectional matching engine; lock-free CAS queues", "Uber Freight Load Board"),
    ("Real-Time Route Deviation Detector", "Python / Geometry", "Advanced", "Cross-track error distance; threshold window moving average; alert trigger", "Safety & Telematics Anomaly Engine"),
]

STRIPE_MC = [
    ("Card Number Input Mask & Luhn Validator", "React / TS", "Basic", "Formatted spacing; regex masking; Modulo-10 checksum validation on change", "Stripe Elements Form Field UI"),
    ("Expiry Date & CVC Field Auto-Advancer", "React / Ref", "Basic", "Ref forwarding; dynamic focus jump on input length; backspace boundary check", "Stripe Elements Embedded Checkout"),
    ("Currency Symbol Prefix Formatter", "TypeScript / DOM", "Basic", "Unicode currency formatting; unformatted numerical state extraction", "Dashboard Payment Intent Form"),
    ("Webhook Delivery Status Badge", "React / CSS", "Basic", "Pure status pill mapping; animated retry spinner; accessible title tooltip", "Stripe Developer Webhook HUD"),
    ("Multi-Part String ID Parser & Matcher", "Python / Text", "Basic", "String tokenization; prefix set matching; validation against allowed prefixes", "Stripe Phone Screen Round 1"),
    ("Subscription Plan Pricing Calculator", "TypeScript / Math", "Basic", "Integer cent precision; tax percentage addition; tier threshold branching", "Billing Configuration Engine"),
    ("Merchant API Key Masker & Copy Button", "React / Clipboard", "Basic", "Secret key obfuscation; async navigator.clipboard write; auto-dismissing banner", "Developer Portal API HUD"),
    ("In-Memory Token Bucket Limiter", "Go / Locks", "Basic", "Mutex lock; sliding credit calculation; discrete integer rejection", "Core Infrastructure Screen"),
    ("Bank Routing Number Validator", "TypeScript / Logic", "Basic", "ABA routing transit number checksum algorithm; boundary length gating", "Stripe Financial Connections UI"),
    ("Event Payload Pretty Printer", "React / Hooks", "Basic", "Recursive JSON object formatting; collapsible nested nodes; syntax color pills", "Stripe Dashboard Event Log"),
    ("Idempotent HTTP Request Deduplicator", "Go / HTTP", "Medium", "SHA-256 payload hashing; atomic in-memory cache lookup; duplicate response replay", "Stripe Integration Coding Round"),
    ("Subscription Email Scheduler", "Python / Datetime", "Medium", "Rule-based date calculation; recurring intervals; timezone/leap year handling", "Stripe Coding Round (Email Schedule)"),
    ("CSV Transaction Parser with Filter Rules", "Go / Streaming", "Medium", "Line-by-line CSV reader; predicate chaining; structural record validation", "Stripe Multi-Part Technical Screen"),
    ("Live Webhook Event Log Virtualizer", "React / Hooks", "Medium", "Virtualized window rendering; auto-scroll stickiness with pause-on-wheel", "Dashboard Live Logs Stream"),
    ("Payment Intent State Machine UI", "React / XState", "Medium", "Explicit transitions (RequiresPayment → Processing → Succeeded); lock on pending", "Stripe Payment Intent React SDK"),
    ("Nested JSON Diff Viewer", "TypeScript / Algo", "Medium", "Deep recursive object comparison; key path generation; addition/deletion tags", "Audit Trail Inspector UI"),
    ("Bug Bash: Template Render Engine", "Python / Debug", "Medium", "Locating edge cases in template variable interpolation; fixing stack overflow", "Stripe Bug Squash Onsite Round"),
    ("Multi-Currency Ledger Account Balancer", "Java / BigDec", "Medium", "Strict double-entry debit=credit balance; integer cent validation; immutable logs", "Stripe Core Accounting Live Coding"),
    ("Async Job Queue with Dead-Letter Handling", "Go / Channels", "Medium", "Worker pool; exponential backoff retries; maximum failure diversion", "Webhook Dispatch Engine"),
    ("Proration Billing Engine", "Python / Time", "Medium", "Mid-month tier upgrade proration; second-level exact usage calculation", "Stripe Billing Team Machine Coding"),
    ("Dynamic Payment Method Sorter", "TypeScript / Sort", "Medium", "Historical conversion rate scoring; localized payment method rank order", "Elements Dynamic Payment Methods"),
    ("Merchant Payout Balance Ledger", "Go / Goroutines", "Medium", "Concurrent account transfers; mutex-guarded account state; deadlock avoidance", "Transfers & Connect Live Coding"),
    ("Filterable Developer API Request Inspector", "React / Context", "Medium", "Multi-predicate filtering (status, path, duration); debounced search query", "Dashboard API Request Explorer"),
    ("Bug Bash: Distributed Graph Traversal", "Java / Debug", "Medium", "Debugging race conditions in concurrent task dependency runner", "Stripe Onsite Bug Squash"),
    ("Micro-Deposit Verification Form", "React / State", "Medium", "Dual-input numerical validation; attempt count lockout; error boundary", "ACH Manual Verification Dialog"),
    ("Sliding-Window Fraud Velocity Limiter", "Go / Atomic", "Medium", "Sliding window timestamp array; atomic check-and-add; window eviction", "Radar Live Coding Screen"),
    ("Custom Test Fixture Generator", "TypeScript / FS", "Medium", "Declarative mock schema engine; deterministic fake data creation; JSON export", "Integration Testing CLI Tool"),
    ("Multi-Party Escrow Release Controller", "Python / FSM", "Medium", "Multi-signature release state machine; dispute freeze; timeout expiry", "Connect Marketplace Engine"),
    ("Accessible Data Table with Inline Edit", "React / ARIA", "Medium", "Keyboard cell navigation; optimistic inline updating; blur commit handling", "Stripe Dashboard Line Items Editor"),
    ("API Metering Event Collector", "Go / RingBuffer", "Medium", "Lock-free ring buffer; high-throughput metric incrementing; periodic snapshot", "Usage-Based Billing Ingestion"),
    ("Interactive Invoice PDF Previewer", "React / Canvas", "Advanced", "Virtualized PDF canvas page rendering; zoom/pan transforms; selection bounding", "Dashboard Invoicing Suite"),
    ("Distributed Lock with Fencing Tokens", "Java / Concurrency", "Advanced", "Distributed lock simulation; monotonic fencing token checks; expired lease handling", "Ledger Consensus Live Coding"),
    ("Zero-Allocation JSON Field Extractor", "Go / Bytes", "Advanced", "In-place byte scanning without allocations; matching keys via state machine", "High-Performance Gateway Parser"),
    ("Real-Time Fraud Rule Evaluator", "Python / AST", "Advanced", "Abstract Syntax Tree evaluation of user-defined boolean fraud rules; short-circuit", "Radar Rules Machine Coding"),
    ("Resilient Multi-Acquirer Gateway Switch", "Go / Resilience", "Advanced", "Latency-weighted round-robin; dynamic circuit tripping; health probe loop", "Core Card Processing Network"),
]

RAZORPAY_MC = [
    ("UPI VPA Input Formatter & Validator", "React / TS", "Basic", "Virtual Payment Address regex validation; auto-suffix handle insertion (@okhdfcbank)", "Razorpay Standard Checkout SDK"),
    ("Payment Link Expiry Countdown Timer", "React / Hooks", "Basic", "Driftless interval polling; expiry event emission; action disabling", "Razorpay Invoicing & Links Web"),
    ("Currency Integer Amount Formatter", "TypeScript / Math", "Basic", "Paisa to Rupee formatting; standard comma formatting; zero truncation", "Merchant Checkout Core"),
    ("Netbanking Bank Selector Grid", "React / CSS", "Basic", "Searchable bank tile grid; radio selection state; popular bank quick-access", "Standard Checkout Payment Modes"),
    ("Merchant API Signature Verifier", "Go / Crypto", "Basic", "HMAC-SHA256 signature verification over payment attributes", "Webhook Security Validator"),
    ("OTP Input Field Group", "React / Refs", "Basic", "Individual single-character fields; paste string distribution; backspace focus", "Razorpay OTP Auto-Read Form"),
    ("Thread-Safe Currency Balance Vault", "Go / Mutex", "Basic", "Atomic balance checks; balance debits preventing overdrafts", "Merchant Pre-funded Wallet"),
    ("Payment Status Progress Stepper", "React / Hooks", "Basic", "Dynamic status stepper (Initiated → Pending → Captured); failure state", "Standard Checkout State Machine"),
    ("Rate Limiter via Leaky Bucket", "Java / Concurrency", "Basic", "Constant leak drain rate; synchronized queue capacity bounds", "Payment API Rate Controller"),
    ("Card Brand Identifier from BIN", "TypeScript / Logic", "Basic", "Prefix matching against Bank Identification Numbers (Visa, Mastercard, RuPay)", "Checkout Card Form Component"),
    ("Embeddable Checkout Modal SDK", "TypeScript / DOM", "Medium", "Iframe generation; window.postMessage cross-origin event handshake; lifecycle teardown", "Core Razorpay Checkout JS"),
    ("Dynamic UPI QR Code Poller", "React / Hooks", "Medium", "Long-polling fallback; WebSocket stream; countdown bar; success redirect", "UPI Desktop Flow Screen"),
    ("Webhook Dispatcher with Jittered Retry", "Go / Channels", "Medium", "Worker pool; exponential backoff formula with full jitter; payload signing", "Razorpay Webhook Ingestion Engine"),
    ("Dynamic Acquirer Route Switcher", "Java / OOP", "Medium", "Priority selection based on health score and acquiring bank success rate", "Payment Switching Engine"),
    ("Double-Entry Merchant Balance Ledger", "Go / Sync", "Medium", "Transaction isolation; simultaneous ledger credit and customer debit; atomic locks", "Razorpay Settlement Engine"),
    ("Virtualized Transaction Statement Table", "React / Hooks", "Medium", "Virtualized windowing; dynamic column sorting; date-range filtering", "Merchant Dashboard Ledger"),
    ("Payment Intent State Machine Engine", "Go / Interfaces", "Medium", "FSM guarding transitions: Created, Authorized, Captured, Refunded", "Razorpay Core Payment State"),
    ("Refund Transaction Allocator", "Python / Math", "Medium", "Fractional refund allocation against available balance; zero double-refund", "Refund Processing Core"),
    ("Multi-Tenancy API Request Authenticator", "Go / Middleware", "Medium", "SHA-256 API key hashing; role permission evaluation; context injection", "Merchant API Gateway"),
    ("Resilient Polling Hook with Network Check", "React / Hooks", "Medium", "Navigator.onLine listeners; exponential backoff; cache revalidation", "Offline-Tolerant Mobile Checkout"),
    ("In-Memory Card Token Cache", "Java / Locks", "Medium", "LRU eviction policy; thread-safe concurrent read/writes; TTL expiration", "Card Tokenization Rail"),
    ("Merchant Settlement Batch Scheduler", "Go / Time", "Medium", "Cutoff time aggregation; fee deduction; settlement file record builder", "Daily Settlement Daemon"),
    ("EMI Interest and Schedule Calculator", "TypeScript / Math", "Medium", "Amortization schedule calculation; monthly split view; bank discount application", "Checkout EMI Options Component"),
    ("Async Event Broker Simulator", "Go / Goroutines", "Medium", "Buffered fan-out channels; subscriber group partitions; offset acknowledgment", "Event Processing Core"),
    ("Fraud Velocity Rule Evaluator", "Python / Logic", "Medium", "Sliding window frequency threshold; card number and IP binding; alert generation", "Razorpay Thirdwatch Screen"),
    ("Collapsible Fee Breakdown Card", "React / CSS", "Medium", "Dynamic GST (tax) and MDR computation; animated drawer; accessible toggle", "Merchant Pricing Preview"),
    ("Bulk Payout CSV Stream Parser", "Node.js / Stream", "Medium", "Chunked streaming upload; record-by-record schema validation; error aggregation", "RazorpayX Payout Batch Engine"),
    ("Dynamic Card CVV Re-Prompt Dialog", "React / Focus", "Medium", "Focus trap trapping; security pin masking; auto-dismiss on complete", "Saved Card Quick Checkout"),
    ("In-Memory Distributed Job Locker", "Go / Sync", "Medium", "Lock lease issuance; TTL heartbeat renewal; safe lock release guard", "Settlement Worker Coordinator"),
    ("Merchant Onboarding Verification Stepper", "React / Hooks", "Medium", "Local storage form caching; asynchronous document upload verification", "Razorpay Merchant Activation"),
    ("Cross-Window PostMessage Event Bus", "TypeScript / Core", "Advanced", "Handshake acknowledgement; origin whitelist verification; response promise map", "Razorpay Checkout SDK Bridge"),
    ("High-Throughput UPI Callback Ingestion", "Go / Channels", "Advanced", "Non-blocking ring buffer ingestion; fast worker pool dispatch; DB batching", "UPI S2S Callback Node"),
    ("Concurrent Escrow Account Splitter", "Java / Threads", "Advanced", "ReentrantLock account locking; circular wait deadlock prevention", "Razorpay Route Marketplace Split"),
    ("Real-Time Transaction Anomaly Detector", "Go / Streaming", "Advanced", "Rolling mean and standard deviation computation; threshold deviation flag", "Core Risk & Fraud Engine"),
    ("High-Performance Zero-Copy Payload Router", "Go / Net", "Advanced", "Custom HTTP header scanner; payload dispatch without heap allocations", "Gateway Edge Dispatcher"),
]

FLIPKART_MC = [
    ("Multi-Tiered In-Memory Cache (L1/L2/L3)", "Java / Collections", "Medium", "Hierarchical read-through; capacity-based LRU eviction per tier; dynamic tier scaling", "Flipkart Signature Machine Coding"),
    ("Flight Booking System (Fliptrip)", "Java / OOP", "Medium", "Directed route graph; fewest-hops search; lowest-cost search; meal filters", "Flipkart SDE-2 Machine Coding"),
    ("Doctor Appointment System (FlipMed)", "Java / OOP", "Medium", "30-min slot management; ranking strategy; waitlist promotion on cancellation", "Flipkart SDE-2 Machine Coding"),
    ("Online Auction Bidding (SuperBidder)", "Java / OOP", "Medium", "Seller item listings; highest-bid tracking; balance validation; auction close", "Flipkart SDE Machine Coding"),
    ("Distributed Queue / Pub-Sub Engine", "Java / Concurrency", "Medium", "Topic partitioning; consumer group offset tracking; concurrent message pull", "Flipkart Machine Coding Round"),
    ("Pluggable Logging Library (SLF4J)", "Java / Design", "Medium", "Log level hierarchy; sink routing (Console, File); log message formatting", "Flipkart Machine Coding Round"),
    ("Expense Sharing Engine (Splitwise)", "Java / OOP", "Medium", "User balances; equal, percentage, and exact splits; balance simplification", "Flipkart Core Machine Coding"),
    ("Multi-Floor Parking Lot System", "Java / OOP", "Medium", "Multi-vehicle spot allocation; nearest spot strategy; ticket fee calculation", "Flipkart Signature Round"),
    ("Snake and Ladder Board Game Engine", "Java / OOP", "Basic", "Configurable board size; snake/ladder maps; multi-player turns; win condition", "Flipkart Standard Machine Coding"),
    ("E-Commerce Cart & Promotional Coupon", "Java / OOP", "Medium", "Percentage and flat cart discounts; coupon exclusions; item subtotaling", "Flipkart Checkout Machine Coding"),
    ("Flash Sale Product Counter & Gauge", "React / Hooks", "Basic", "Live countdown timer; stock remaining percentage bar; button disable on zero", "Big Billion Days Flash Sale UI"),
    ("E-Commerce Faceted Search Filter Drawer", "React / State", "Basic", "Multi-select checkboxes; price slider; URL query synchronization; clear-all", "Flipkart Search Page UI"),
    ("Product Image Zoom & Thumbnail Slider", "React / DOM", "Basic", "Active thumbnail selection; mouse position magnification overlay calculation", "Product Display Page Component"),
    ("Pincode Delivery Availability Checker", "React / Hooks", "Basic", "Input validation; mock asynchronous availability lookup; estimated SLA display", "Delivery Address Validation Component"),
    ("Delivery Slot Time-Window Picker", "React / State", "Basic", "Grouped dates; selectable 2-hour morning/evening slots; capacity lockouts", "Grocery Delivery Slot Flow"),
    ("Food Ordering System (FlipFood)", "Java / OOP", "Medium", "Restaurant menu management; cart building; lowest delivery cost assignment", "Flipkart Machine Coding Practice"),
    ("Ride Sharing Vehicle Matching", "Java / OOP", "Medium", "Driver location registration; ride requests; shortest distance pairing", "Flipkart Machine Coding Practice"),
    ("Stock Portfolio Tracker", "Java / OOP", "Medium", "Real-time buy/sell execution; weighted average cost basis; profit/loss reporting", "Flipkart Machine Coding Practice"),
    ("Digital Wallet & Passbook System", "Java / OOP", "Medium", "Wallet-to-wallet transfers; transactional balance guards; historical passbook statements", "Flipkart SuperMoney Round"),
    ("Trello-like Task Management Board", "Java / OOP", "Medium", "Boards, lists, and cards; card movement between states; assignees and tags", "Flipkart Machine Coding Practice"),
    ("Dynamic Inventory Reservation Lock", "Go / Mutex", "Medium", "Item reservation with 10-minute lock TTL; background expiry replenishment", "Flash Sale Inventory Worker"),
    ("Sticky Notes Collaboration Board", "React / DOM", "Medium", "Absolute drag-and-drop position calculation; note creation; z-index ordering", "Web Whiteboard Interview"),
    ("Star Rating Input with Hover Preview", "React / Hooks", "Basic", "Hover state feedback; fractional half-star selection; accessible ARIA radios", "Reviews and Ratings UI"),
    ("Customer Notification Aggregator", "Java / Design", "Medium", "Notification channels (SMS, Email, Push); opt-out preferences; rate throttling", "User Communication Engine"),
    ("In-Memory Key-Value Store with TTL", "Go / Sync", "Medium", "RWLock synchronization; active scanning plus lazy eviction on retrieval", "Core Platform Live Coding"),
    ("Multi-Criteria Product Ranking Engine", "Java / Streams", "Medium", "Comparator chaining (price, customer rating, delivery speed); dynamic sorting", "Catalog Search Sorter"),
    ("Infinite Scrolling Review Feed", "React / Intersection", "Medium", "IntersectionObserver API integration; page buffer fetching; skeleton loader", "Product Reviews Scroll"),
    ("Dynamic Nested Comments Thread", "React / Recursion", "Medium", "Recursive component tree; reply input inline toggling; upvote counter", "User Community QA Component"),
    ("In-Memory Sliding Window Counter", "Java / Concurrency", "Medium", "AtomicLong array; thread-safe time bucket rotation; aggregate load metric", "Edge Traffic Throttler"),
    ("Order Cancellation & Refund State Machine", "Java / OOP", "Medium", "FSM guarding transition states: Placed, Packed, Shipped, Delivered", "Order Management Core"),
    ("High-Concurrency Flash Sale Inventory Gate", "Go / Channels", "Advanced", "Channel-based queue; fixed-stock reservation; immediate out-of-stock rejection", "Big Billion Days Flash Sale"),
    ("Thread-Safe Event Bus with Pattern Sub", "Java / Threads", "Advanced", "Regex topic subscription; thread pool event dispatch; non-blocking delivery", "Core Messaging Infrastructure"),
    ("Directed Acyclic Graph Workflow Engine", "Java / Graphs", "Advanced", "Cycle detection; topological dependency execution; task failure backtracking", "Order Fulfillment Pipeline"),
    ("Real-Time Live Bidding Dashboard", "React / WS", "Advanced", "High-frequency bid stream; optimistic user bid injection; auction timer", "Flipkart Live Auction UI"),
    ("Virtualized E-Commerce Product Grid", "React / Canvas", "Advanced", "Custom virtual row/column coordinate rendering; image lazy loading pipeline", "Catalog Search Result View"),
]

DATABRICKS_MC = [
    ("Instrumented Map with Rolling Load (5-min)", "Go / Sync", "Medium", "Sliding window circular bucket ring; atomic call increment; thread-safe rate calculation", "Databricks Signature Machine Coding"),
    ("Nested Customer Referral Revenue Service", "Python / OOP", "Medium", "Multi-level referral tree lookup; depth-bounded aggregation; sorted lowest-K", "Databricks SDE Live Coding"),
    ("CIDR & IP Access Rule Matcher", "Java / Bitwise", "Medium", "Trie-based IP bitmask matching; longest prefix match; allow/deny resolution", "Databricks Onsite Algorithms"),
    ("Generalized Tic-Tac-Toe (M×N, K win)", "Python / Arrays", "Medium", "Row, column, and diagonal sliding counter validation; O(1) move verification", "Databricks Live Coding"),
    ("Spark Job DAG Stage Visualizer", "React / SVG", "Medium", "Topological node layout; stage dependency polyline rendering; status colors", "Databricks Spark UI Dashboard"),
    ("Virtualized Columnar Data Table", "React / TS", "Medium", "Virtualized windowing; horizontal column virtualization; sticky schema headers", "Databricks SQL Query Result Viewer"),
    ("Interactive Notebook Cell Runner UI", "React / Hooks", "Medium", "Cell execution queuing; output stream appending; markdown/code toggling", "Databricks Workspace UI"),
    ("Cluster Autoscaling Worker Slider", "React / State", "Basic", "Dual thumb bounds; spot-instance checkbox guard; memory ratio preview", "Compute Cluster Settings UI"),
    ("String Cover Deletion Engine", "Python / Strings", "Medium", "Interval cover representation; deletion index mapping; interval re-merging", "Databricks Phone Screen Round"),
    ("In-Memory Priority Queue via Linked List", "Java / Pointers", "Medium", "Singly linked list insertion maintaining order; operation cost tradeoff analysis", "Databricks Live Coding"),
    ("Single-Machine Write-Ahead Log (WAL)", "Go / IO", "Medium", "Append-only binary disk log; record checksumming; crash recovery parser", "Databricks Durable KV Design"),
    ("Friendship Timeline Connectivity Tracker", "Python / UnionFind", "Medium", "Incremental union-find with path compression; timestamp tracking", "Databricks SWE Screen"),
    ("Multi-List General Merge K-Way Sorter", "Java / Heaps", "Medium", "PriorityQueue heap tracking; iterator exhaustion checks; memory bounds", "Databricks Data Processing Round"),
    ("Delta Lake Parquet Metadata Parser", "Python / JSON", "Basic", "Transaction log JSON action parser (add, remove, commitInfo)", "Delta Lake Engine Live Coding"),
    ("SQL Query Syntax Highlighter Component", "React / RegEx", "Basic", "Lexical tokenization; keyword coloring; string literal handling", "Workspace SQL Worksheet"),
    ("Column Statistics Min-Max Pruning Engine", "Go / Structs", "Medium", "Metadata bounding checks against query WHERE predicates; file elimination", "Lakehouse Query Engine"),
    ("Metric Streaming Live Line Chart", "React / Canvas", "Medium", "Rolling 60-second time series; canvas buffer blitting; memory leak mitigation", "Cluster CPU/Memory Ganglia UI"),
    ("High-Concurrency Thread-Safe Counter Ring", "Java / Atomic", "Medium", "LongAdder stripes; modulo window bucketing; uncontended increments", "Core Platform Metrics"),
    ("Fibonacci Tree Shortest Path Finder", "Python / Trees", "Medium", "K-th order Fibonacci tree traversal; shortest path coordinate calculation", "Databricks Technical Phone Screen"),
    ("In-Memory Columnar Chunk Buffer", "C++ / Arrays", "Medium", "Contiguous memory allocation; bitmask null vectors; vectorized scan", "Vectorized Query Engine"),
    ("Notebook Cell Dependency Graph Resolver", "TypeScript / Graph", "Medium", "Topological sort of cell references; cycle detection; invalidation propagation", "Reactive Notebook Execution"),
    ("Delta Lake Compaction Simulator", "Python / Files", "Medium", "Small file bin-packing into target chunk sizes; metadata rewrite", "Delta Optimization Core"),
    ("Resilient Polling Worker for Query Status", "React / Custom Hook", "Basic", "Query execution state polling; cancel on unmount; failure retry", "Databricks SQL Query Runner"),
    ("Spark Shuffle Memory Spiller", "Java / Memory", "Medium", "Heap threshold monitoring; in-memory sort; spilling sorted runs to disk", "Spark Core Execution Round"),
    ("Schema Evolution Validator", "Go / Schemas", "Medium", "Backward compatibility checks (column additions, promotions); forbidden drops", "Unity Catalog Live Coding"),
    ("Collapsible Schema Catalog Tree View", "React / Hooks", "Basic", "Recursive table/column hierarchy; lazy fetching on branch expand", "Unity Catalog Asset Tree"),
    ("Sliding Window Anagram Substring Finder", "Go / TwoPointers", "Basic", "Frequency hash map sliding window; matches count tracking", "Databricks SWE Screen"),
    ("Multi-Tenant Warehouse Quota Enforcer", "Python / Locks", "Medium", "Token bucket allocation per workspace; thread-safe borrowing", "Resource Management Layer"),
    ("In-Memory LRU Cache with Intrusive Pointers", "C++ / Structs", "Medium", "Doubly linked list nodes embedded within hash table buckets; zero allocation", "Buffer Pool Machine Coding"),
    ("Breadth-First Search Grid Path Finder", "Java / BFS", "Medium", "Multi-modal travel time pathfinding with cost tie-breaking", "Databricks Coding Round"),
    ("Real-Time Cluster Metric Tile Matrix", "React / Grid", "Advanced", "Virtualized tile layout; high-frequency WebSocket updates; DOM recycling", "Large Fleet Operations HUD"),
    ("Zero-Copy Byte Array Deserializer", "Go / Unsafe", "Advanced", "Scanning raw memory buffers into columnar structures without copying", "Photon Vector Engine"),
    ("Concurrent Multi-Version Delta Log Reader", "Java / Concurrency", "Advanced", "ReentrantReadWriteLock synchronization; snapshot reconstruction from JSON checkpoints", "Delta Lake Core Round"),
    ("High-Throughput Sliding Window Load Monitor", "Go / Atomics", "Advanced", "Striped ring buffers; fractional second time quantization; lock-free reads", "Databricks Core Systems"),
    ("Distributed Task Dependency Scheduler", "Java / Queues", "Advanced", "DAG stage progression; executor heartbeat monitoring; worker reassignment", "Spark Scheduler Live Coding"),
]

SNOWFLAKE_MC = [
    ("In-Memory Posix File System Hierarchy", "Python / Trees", "Medium", "Path splitting; recursive directory/file node tree; ls, mkdir, cat", "Snowflake Signature Live Coding"),
    ("Document Predicate Filtering Engine", "Java / Logic", "Medium", "Document tokenization; boolean predicate expression evaluation (AND, OR, NOT)", "Snowflake SDE Algorithms"),
    ("Query Statistics & Object Usage Tracker", "Python / Hash", "Medium", "Access frequency tracking; unaccessed table/column detection over time window", "Snowflake Core Data Screen"),
    ("Micro-Partition Min-Max Pruning Simulator", "Go / Structs", "Medium", "Column value bounds checking against WHERE predicates; file pruning", "Snowflake Storage Engine Screen"),
    ("Configurable Matrix Checkerboard UI", "React / CSS", "Basic", "2D cell coordinate rendering; alternating background math; keyboard nav", "Snowflake Frontend Screen"),
    ("Virtualized Query Result Data Table", "React / Hooks", "Medium", "Virtualized window rendering; column sort comparator; dynamic column resize", "Snowsight Results Component"),
    ("Multi-Tab SQL Worksheet Manager UI", "React / State", "Medium", "Tab state isolation (draft query, results cache); keyboard execution shortcut", "Snowsight Worksheet Workspace"),
    ("Autocomplete Typeahead for SQL Tokens", "React / Hooks", "Medium", "Trie-backed token matching; active caret coordinate calculation; key binds", "Snowsight SQL Editor"),
    ("Robot Grid Navigation Simulator UI", "React / State", "Basic", "Coordinate boundary collision checking; movement action dispatcher; score HUD", "Snowflake UI Live Coding"),
    ("Typed Event Emitter Implementation", "TypeScript / Core", "Basic", "Listener registry; event unsubscription token; exception isolation", "Snowflake JavaScript Core Screen"),
    ("Deep Object Clone & Recursive Serializer", "TypeScript / Logic", "Basic", "Recursive cycle detection via WeakSet; type handling (dates, arrays, objects)", "Frontend Fundamentals Round"),
    ("Command Pattern Undo/Redo Engine", "TypeScript / State", "Basic", "Dual command stacks; execute/undo state mutation; stack invalidation", "Snowsight Editor History"),
    ("Deep-Copy Linked List with Random Pointers", "Java / Pointers", "Medium", "Interleaving node copies or hash map mapping; pointer preservation", "Snowflake CoderPad Screen"),
    ("Undirected Graph 3-Coloring Validator", "Python / Graphs", "Medium", "Backtracking traversal; adjacent vertex color conflict verification", "Snowflake Algorithm Round"),
    ("Office Desk to Bathroom Distance Matrix", "Java / BFS", "Medium", "Multi-source BFS traversal; distance matrix propagation across grid", "Snowflake Onsite Coding"),
    ("Virtual Warehouse Credit Consumption Meter", "Go / Sync", "Medium", "Second-level credit consumption calculation; cluster size scaling multiplier", "Snowflake Compute Management"),
    ("Query Result Cache with Version Invalidation", "Go / Mutex", "Medium", "Canonical SQL string hashing; table version tracking; cache hit resolution", "Query Result Cache Engine"),
    ("Multi-Level Directory Expansion Tree", "React / Recursion", "Basic", "Collapsible node branches; path string keys; directory toggle state", "Schema Tree Navigator"),
    ("Sliding Window Maximum Stream Aggregator", "Java / Deque", "Medium", "Monotonic decreasing deque; sliding window maximum extraction", "Data Warehouse Stream Processing"),
    ("Basic SQL Lexer and Token Streamer", "Python / Text", "Medium", "Lexical state scanner; keyword, identifier, and string literal isolation", "Query Compiler Screen"),
    ("Snowpipe Continuous File Queue Ingester", "Go / Channels", "Medium", "S3 notification event parser; deduplication cache; chunked stage loading", "Snowpipe Ingestion Core"),
    ("Interactive Database Role Permissions Matrix", "React / Context", "Medium", "Role-to-Privilege boolean checkbox grid; inheritance hierarchy propagation", "Snowflake Access Control UI"),
    ("Priority-Based Query Queue Coordinator", "Java / Concurrency", "Medium", "PriorityBlockingQueue; warehouse concurrency limit gating; task preemption", "Warehouse Query Scheduler"),
    ("JSON Semi-Structured Variant Flattener", "Python / Recursion", "Medium", "Nested JSON object traversal; dot-notation column path flattening", "Variant Data Type Core"),
    ("Resilient WebSocket Query Execution Hook", "React / Custom Hook", "Medium", "Connection lifecycle; query progress percentage stream; cancelation", "Snowsight Execution HUD"),
    ("In-Memory Dictionary-Encoded Column Store", "C++ / Structs", "Medium", "Distinct string vocabulary dictionary; integer index vector representation", "Columnar Storage Core"),
    ("Zero-Copy Table Clone Metadata Simulator", "Go / Structs", "Medium", "Pointer mapping to existing micro-partitions; copy-on-write fork tracking", "Zero-Copy Clone Engine"),
    ("Dynamic Data Masking Rule Evaluator", "Python / Strings", "Medium", "Role-based column value masking (regex redaction, full hash substitution)", "Security & Governance Core"),
    ("Debounced Search Input with Cancellation", "React / Hooks", "Basic", "Custom hook combining debounce timer with fetch AbortController", "Snowsight Global Search Bar"),
    ("Circular Ring Buffer Query History Log", "Go / RingBuffer", "Basic", "Fixed capacity buffer; overwrite oldest on saturation; concurrent reads", "System Query Log Collector"),
    ("Virtualized Infinite Matrix Grid Canvas", "React / Canvas", "Advanced", "Custom virtualized canvas rendering millions of cells without DOM nodes", "High-Scale Data Grid UI"),
    ("Columnar Vector SIMD Predicate Evaluator", "C++ / Vector", "Advanced", "Vectorized SIMD comparison over contiguous integer arrays; match bitmask", "Query Vector Processing Core"),
    ("High-Concurrency Micro-Partition Lock Pool", "Java / Concurrency", "Advanced", "Fine-grained partition read/write locks; deadlock-free lock ordering", "Multi-Cluster Shared Data Core"),
    ("Real-Time Memory Spillage Coordinator", "Go / Memory", "Advanced", "Monitoring memory thresholds; spilling temporary partition runs to disk", "Compute Spilling System"),
    ("Distributed Query Execution Token Graph", "Java / DirectedGraph", "Advanced", "Node-to-node exchange operator plan; vectorized pipeline step execution", "Distributed Query Engine"),
]

PIERRE_MC = [
    ("Path-First Canonical Tree Model", "TypeScript / Logic", "Basic", "Ingestion of flat path arrays (['src/index.ts']); canonical directory splitting", "Trees by Pierre Model Architecture"),
    ("Compact Chained Folder Flattener", "TypeScript / Algo", "Basic", "Compacting single-child directory chains (.github/workflows) into single row", "@pierre/trees Flatten Engine"),
    ("Collapsible File Tree Row Component", "React / Hooks", "Basic", "Expansion chevron toggle; path selection state; icon mapping (file vs folder)", "Trees React Entry Layer"),
    ("Unified Diff Line Tokenizer", "TypeScript / RegEx", "Basic", "Parsing unified diff lines; identifying markers (+, -, @@ -l,s +l,s @@)", "Diffs by Pierre Core Parser"),
    ("Split Diff Side-by-Side Line Aligner", "TypeScript / Arrays", "Medium", "Synchronizing old and new line numbers; blank placeholder injection on additions", "@pierre/diffs Split View Engine"),
    ("In-Memory Virtual File System (VFS)", "TypeScript / Map", "Medium", "Materializing file paths in memory; staging additions and deletions", "@pierre/just-code-storage VFS Core"),
    ("Git Blob SHA-1 Content Addresser", "Go / Crypto", "Basic", "blob <size>\\0<content> byte formatting; SHA-1 digest calculation", "Code Storage Object Serialization"),
    ("Commit from Unified Diff Text", "TypeScript / Logic", "Medium", "Single-pass diff parsing; extracting file hunks; constructing modified files", "repo.createCommitFromDiff SDK"),
    ("Fast Glob Path Pattern Matcher", "Go / Strings", "Basic", "Glob matching (**/*.ts, !dist/**); wildcard path resolution", "Code Storage Glob Archive Engine"),
    ("Ephemeral Branch Namespace Manager", "Go / Mutex", "Medium", "Ephemeral branch pointer generation; lease TTL expiration; ref updates", "Code Storage Ephemeral Branches"),
    ("Codebase Grep Regex Scanning Engine", "Go / Workers", "Medium", "Multithreaded file tree traversal; regex pattern matching across blobs", "Code Storage Grep API"),
    ("Virtualized File Tree Viewport", "React / DOM", "Medium", "Recycled row rendering; path-first row keys; keyboard arrow navigation", "@pierre/trees/react Virtualizer"),
    ("Git Tree Object Binary Serializer", "Go / Bytes", "Medium", "Formatting mode, path, and raw 20-byte SHA into canonical Git tree entries", "Git Low-Level Storage Layer"),
    ("Multi-File Staging and Discard UI", "React / Hooks", "Medium", "Checkbox selection of files; stage/unstage dispatch; optimistic tree update", "Agent Commit Builder UI"),
    ("Diff Syntax Highlighting Tokenizer", "TypeScript / Shiki", "Medium", "Language grammar injection; syntax token span generation; cache hit reuse", "@pierre/diffs Syntax Pipeline"),
    ("Three-Phase Commit Quorum Coordinator", "Go / Channels", "Advanced", "Phase 1 Pre-Commit, Phase 2 Prepare, Phase 3 Commit; majority ACK verification", "Code Storage Spoke Quorum Layer"),
    ("Git Packfile Index (IDX) Parser", "C++ / Binary", "Advanced", "Parsing fan-out table, SHA table, CRC32 table, and packfile byte offsets", "High-Speed Git Engine"),
    ("Fast Working Tree Diff Computer", "Go / Pointers", "Medium", "Comparing two Git tree objects; generating added, modified, deleted delta lists", "Code Storage Native Diff Service"),
    ("Git Ref Log and History Traverser", "TypeScript / OOP", "Medium", "Resolving branch ref to HEAD commit; traversing parent commit pointers", "@pierre/just-code-storage Log"),
    ("Inline Comment Thread on Diff Lines", "React / State", "Medium", "Anchoring discussion components to specific diff line numbers and side", "DiffsHub Collaboration Layer"),
    ("Cold Storage Tier Migration Worker", "Go / Time", "Medium", "Tracking repository idle read time; archiving inactive repos after 7 days", "Code Storage Cold Storage Tier"),
    ("Branch Merge Conflict Matrix Detector", "Python / Logic", "Medium", "Three-way merge calculation (Base, Ours, Theirs); conflict hunk labeling", "Git Storage Merge Engine"),
    ("Path-First Rename and Move Handler", "TypeScript / Model", "Medium", "Updating canonical paths across tree children; emitting atomic rename event", "@pierre/trees Model Actions"),
    ("Git LFS Pointer Creator & Ingester", "Go / Crypto", "Medium", "Hashing large binary payloads; formatting Git LFS pointer text; blob routing", "Code Storage Git LFS Mirroring"),
    ("Git Commit DAG Revision Visualizer", "React / SVG", "Medium", "Calculating branch swimlanes; rendering merge bezier curves; commit nodes", "Pierre Visual Commit Graph"),
    ("Hot-to-Cold Object Store Eviction Engine", "Go / Storage", "Medium", "S3/R2 multi-part upload of repository tarballs; local disk freeing", "Tiered Storage Architecture"),
    ("Incremental Tree Invalidation Cache", "TypeScript / Cache", "Medium", "Invalidating only ancestor path segments upon child leaf addition", "Trees Model Reactivity"),
    ("Custom Theme Token CSS Variable Bridge", "React / CSS", "Basic", "Injecting Pierre color variables into Shiki and code tokens", "@pierre/theme Integrator"),
    ("In-Memory Git Tag Reference Index", "Go / Sync", "Basic", "Mapping lightweight tags and annotated tag objects to commit SHAs", "Ref Management Subsystem"),
    ("Asynchronous Native Git Protocol Bridge", "Go / Net", "Advanced", "Custom TCP handler serving Git Smart HTTP protocol (/info/refs, git-upload-pack)", "Code Storage Edge Git Gateway"),
    ("Virtualized Multi-File Diff Canvas", "React / Canvas", "Advanced", "Virtualized rendering of thousands of diff hunks across hundreds of files", "Large Pull Request Diff View"),
    ("Zero-Allocation Git Object Streamer", "Go / IO", "Advanced", "Streaming Git blob objects straight to HTTP writer without buffering in RAM", "Code Storage Stream Service"),
    ("Concurrent Spoke Replica Synchronizer", "Go / Channels", "Advanced", "Multi-worker parallel catchup replication across distributed spoke nodes", "Spoke Replication Mesh"),
    ("AST-Aware Code Difference Matcher", "TypeScript / AST", "Advanced", "Matching moved and refactored code blocks across diffs via node hashing", "Diffs Advanced Diffing Mode"),
    ("High-Scale Agent Memory File Store", "Go / Sharding", "Advanced", "Optimized content-addressed storage for billions of tiny agent memory snippets", "Code Storage Agent Memory Layer"),
]

TML_MC = [
    ("Training Client Future with Jittered Retry", "Python / Async", "Basic", "Polling future status; exponential backoff on transient errors; unwrap result", "Tinker Python SDK Core Pattern"),
    ("Structured Message-to-Token Renderer", "Python / Text", "Basic", "Converting role-based chat messages into formatted token strings; special tokens", "Tinker Cookbook tml-renderers"),
    ("Training Loss & Learning Rate Tracker", "Python / Math", "Basic", "Tracking step losses; rolling average calculation; learning rate warmup", "Tinker Fine-Tuning Execution"),
    ("Live Metric Streaming Canvas HUD", "React / Canvas", "Basic", "Real-time step loss curve; auto-scaling Y-axis; high-frequency coordinate draw", "Tinker Console Training Dashboard"),
    ("Training Run Experiment Filter Table", "React / Hooks", "Basic", "Filter runs by base model, status, LoRA rank; search input; sorting", "Tinker Cloud Management Console"),
    ("In-Memory Checkpoint Metadata Indexer", "Go / Mutex", "Basic", "Mapping step IDs to remote checkpoint archive URLs; atomic updates", "Checkpoint Archival Service"),
    ("Model Parameter Scale & Rank Formatter", "TypeScript / Math", "Basic", "Formatting 1B to 1T+ parameter numbers; LoRA rank memory multiplier preview", "Tinker Run Launcher Dialog"),
    ("Token Counter and Context Window Gauge", "React / State", "Basic", "Token estimation from character count; maximum context percentage bar", "Prompt Construction UI"),
    ("Benchmark Score Matrix Heatmap", "React / SVG", "Basic", "Rendering evaluation scores across benchmarks (GSM8K, MATH-500, IFEval)", "Tinker Benchmark Suite HUD"),
    ("Hardware Node Heartbeat Sweeper", "Python / Time", "Basic", "Identifying GPU nodes exceeding 10-second heartbeat timeout; marking degraded", "Cluster Heartbeat Daemon"),
    ("Asynchronous Training Client Dispatcher", "Python / OOP", "Medium", "Implementing ServiceClient, TrainingClient, and SamplingClient interfaces", "Tinker SDK Architecture"),
    ("Dynamic LoRA Rank Parameter Calculator", "Python / Torch", "Medium", "Computing trainable parameter counts for low-rank adapters (A×B matrices)", "LoRA Fine-Tuning Engine"),
    ("RL Rollout Trajectory Buffer with Clipping", "Python / NumPy", "Medium", "Storing rollout steps; computing clipped importance ratios; advantage bounds", "Tinker RL Trajectory Recipe"),
    ("Checkpoint Archive Streaming Downloader", "Python / IO", "Medium", "Streaming multi-part tarball chunks from Tinker path to local disk file", "get_checkpoint_archive_url SDK"),
    ("Live Loss Curve Virtualized Data Stream", "React / Hooks", "Medium", "Handling 100 Hz step emissions via batching; web worker offloading", "Tinker Live Training Monitor"),
    ("Priority GPU Job Queue Scheduler", "Go / Concurrency", "Medium", "Priority-based job scheduling; preemption of evaluation runs by training runs", "Distributed Scheduler Core"),
    ("Token-Level Logprob Visualizer UI", "React / CSS", "Medium", "Coloring token spans based on logprob values; hover tooltips for alternatives", "Model Sampling Inspector"),
    ("DPO Preference Pair Tensor Batcher", "Python / Torch", "Medium", "Batching chosen vs rejected prompt completions; padding mask alignment", "DPO Post-Training Pipeline"),
    ("Dynamic Batch Size Accumulator", "Python / Yield", "Medium", "Yielding variable-sized micro-batches to match token budget; padding reduction", "Training Data Loader"),
    ("Model Checkpoint Pruner and Retention", "Go / Time", "Medium", "Retaining only top-K checkpoints based on evaluation metrics; purging disk", "Model Registry Lifecycle"),
    ("Speculative Sampling Output Verifier", "Python / Strings", "Medium", "Matching draft model speculative tokens against target model verification", "High-Throughput Sampling Core"),
    ("Cluster GPU Memory Pressure Alarm UI", "React / Hooks", "Medium", "Polling VRAM utilization; rendering threshold warning banners; throttle warning", "Cluster Infrastructure Health"),
    ("Distributed Optimizer Step Synchronizer", "Go / Channels", "Medium", "Barrier synchronization waiting for all rank gradients before allowing step", "Cluster Engine Coordinator"),
    ("Trajectory Reward Signal Aggregator", "Python / Math", "Medium", "Calculating compound rewards (document recall + token efficiency penalty)", "Context-1 Agent Post-Training"),
    ("Resilient Server-Sent Event (SSE) Consumer", "React / Custom Hook", "Medium", "Reconnecting SSE client; event deduplication by ID; buffer flushing", "Remote Training Log Streamer"),
    ("Multimodal Image Tensor Normalizer", "Python / Imaging", "Medium", "Resizing vision tokens; patch flattening; bounding box tensor alignment", "VLM Rendering Pipeline"),
    ("Distributed Lock Lease for Model Weights", "Go / Mutex", "Medium", "Heartbeat lease renewal; preventing dual-writer checkpoint corruptions", "Model Weight Registry"),
    ("Benchmark Run Orchestration Harness", "Python / Asyncio", "Medium", "Executing parallel evaluations across benchmarks; aggregating accuracy metrics", "run_benchmarks Harness"),
    ("In-Memory Sliding Gradient Ring Buffer", "C++ / Arrays", "Medium", "Circular storage of historical gradient norms; detecting gradient explosions", "Numerical Stability Monitor"),
    ("Interactive Hyperparameter Tuning Form", "React / Forms", "Medium", "Synchronized learning rate, LoRA rank, and warmup step inputs; validation", "Experiment Configuration UI"),
    ("High-Frequency Real-Time Telemetry Canvas", "React / WebGL", "Advanced", "Visualizing 10,000 live step loss curves across parallel distributed trials", "Frontier Scale Experiment UI"),
    ("Zero-Copy Distributed Tensor Deserializer", "C++ / SharedMem", "Advanced", "Shared memory tensor deserialization directly into PyTorch CUDA tensors", "Ultra-Low Latency Inference"),
    ("Fault-Tolerant Step Recovery Coordinator", "Python / Network", "Advanced", "Detecting GPU node failure; rolling back to step N−1; replaying micro-batch", "Cluster Fault Tolerance Engine"),
    ("Off-Policy PPO Trajectory Weight Calculator", "Python / Vector", "Advanced", "Computing importance weights with clipped importance ratios and capped advantages", "Stable RL Training Core"),
    ("High-Throughput Remote Token Streaming Engine", "Go / Net", "Advanced", "Multiplexing token generation streams across thousands of connected clients", "Sampling Gateway Service"),
]

UBER_LLD = [
    ("Multi-Threaded Task & Ride Match Scheduler", "RideRequest, DriverMatchQueue, SchedulePlan, ExecutionWorker", "Thread-safe priority polling; tasks must not starvation-lock; cancelation propagation", "Strategy Pattern, Worker Pool, Command Pattern"),
    ("Geospatial Index Quadtree Engine", "Point, BoundingBox, QuadNode, SpatialIndex", "Max 100 objects per leaf before subdivision; atomic coordinate insertion; concurrent read-locks", "Composite Pattern, Visitor Pattern"),
    ("Real-Time Surge Pricing Engine", "Zone, SupplyCounter, DemandCounter, SurgeStrategy", "Sliding time decay on historical demand; multiplier clamped between 1.0x and 5.0x", "Strategy Pattern, Observer Pattern"),
    ("Trip Lifecycle State Machine", "Trip, TripEvent, State, TransitionGuard", "Progressive states (REQUESTED → MATCHED → ARRIVED → IN_PROGRESS → COMPLETED); atomic rollback", "State Pattern, Finite State Machine (FSM)"),
    ("In-Memory Token Bucket Rate Limiter", "Bucket, RateRule, TokenRefillStrategy", "Atomic CAS on token balance; zero thread blocking on rejection", "Decorator Pattern, Factory Pattern"),
    ("Driver Dispatch Allocator & Offers", "DispatchSession, CandidateList, OfferTimeout, OfferStatus", "Exactly one active driver offer per trip; 15-second TTL per offer; sequential fallback", "Chain of Responsibility, State Pattern"),
    ("In-App Chat & Notification Router", "Session, Channel, Participant, MessagePayload", "FIFO message sequencing; delivery receipt reconciliation; decoupled push workers", "Observer Pattern, Mediator Pattern"),
    ("In-Memory Vehicle Telematics Ring Buffer", "TelemetryPoint, CircularBuffer, WindowAggregator", "Overwrite-oldest behavior without memory reallocation; lock-free read pointers", "Circular Buffer Pattern, Iterator Pattern"),
    ("Fare Computation & Split Engine", "BaseFare, DistanceTier, DurationFactor, SplitLedger", "Decimal-safe currency calculations; multi-rider sum equals total fare minus discounts", "Builder Pattern, Strategy Pattern"),
    ("Driver Document Verification Workflow", "Document, VerifierRule, ValidationPipeline, ApprovalResult", "Halting on blocking validation failure; async callback handling; deterministic audit logs", "Pipeline Pattern, Chain of Responsibility"),
]

STRIPE_LLD = [
    ("Double-Entry Ledger Transaction Engine", "Account, Transaction, Entry (Debit/Credit), Balance", "Sum of debits strictly equals sum of credits; balances never float", "Command Pattern, Unit of Work"),
    ("Idempotency Key Coordination Service", "IdempotencyRecord, LockLease, ResponseCache, Hasher", "Requests with identical key and differing payloads abort with HTTP 400", "Proxy Pattern, Interceptor Pattern"),
    ("Webhook Dispatcher with Exponential Backoff", "WebhookEndpoint, Event, DeliveryAttempt, RetryPolicy", "Guaranteed at-least-once delivery; exponential backoff with jitter", "Strategy Pattern, Observer Pattern"),
    ("Card Vault Tokenization Service", "CardMetadata, Token, EncryptionEnvelope, Vault", "Primary Account Number (PAN) never logged or stored in plain text", "Adapter Pattern, Repository Pattern"),
    ("Subscription Lifecycle & Proration Engine", "Subscription, Phase, ProrationCredit, InvoiceSchedule", "Plan upgrades calculate second-level accurate debits and credits", "State Pattern, Builder Pattern"),
    ("Fraud Pipeline Rule Evaluator", "TransactionContext, FraudRule, RiskScore, EvaluationResult", "Evaluation executes within sub-5ms latency budgets; short-circuit validation", "Chain of Responsibility, Composite"),
    ("Payment Routing & Acquirer Switch", "PaymentIntent, AcquirerRoute, HealthScore, FeeTier", "Traffic dynamically bypasses degraded banking rails based on success rates", "Strategy Pattern, Circuit Breaker"),
    ("In-Memory Metering Aggregator", "MeterRecord, AggregationWindow, BillableMetric", "Thread-safe metric increments; zero loss during periodic snapshot flushes", "Aggregator Pattern, Flyweight"),
    ("Chargeback & Dispute Workflow Coordinator", "Dispute, EvidenceFile, EvidenceDeadline, ReviewStatus", "Evidence locked after bank deadline; deterministic state progression", "State Pattern, Template Method"),
    ("Multi-Currency Quotation Cache", "CurrencyPair, ExchangeRate, QuoteLease, SpreadMargin", "Quoted exchange rate locked for 60 seconds; automatic rate refresh on expiry", "Cache-Aside Pattern, Factory Pattern"),
]

RAZORPAY_LLD = [
    ("Payment Gateway Routing Engine", "PaymentRequest, AcquirerSwitch, RouteRule, BankHealth", "Dynamic routing based on real-time success metrics; failure rerouting", "Strategy Pattern, Chain of Responsibility"),
    ("UPI Intent & Collect Lifecycle Manager", "UpiOrder, VpaAddress, CollectRequest, StatusMonitor", "UPI session expiry strictly enforced at 10 minutes; atomic callback handling", "State Pattern, Observer Pattern"),
    ("Webhook Delivery and Retries Engine", "WebhookEvent, DestinationEndpoint, RetryPolicy, DeadLetterStore", "Monotonically increasing backoff delays; signature verification guarantees", "Decorator Pattern, Worker Pool"),
    ("Merchant Settlement Ledger Engine", "MerchantAccount, SettlementBatch, BalanceAdjustment, PayoutFile", "Balances resolve to zero sum; strict non-floating integer arithmetic", "Command Pattern, Visitor Pattern"),
    ("Real-Time Fraud & Card Velocity Engine", "TransactionContext, VelocityWindow, RiskCriterion, Verdict", "Halting on risk violation; sliding time-window frequency checks", "Specification Pattern, Strategy Pattern"),
    ("Marketplace Split Engine (Razorpay Route)", "OrderPayment, VendorSplit, CommissionDeduction, HoldPolicy", "Total sub-splits plus commission exactly equals authorized charge; rollback on split failure", "Composite Pattern, Builder Pattern"),
    ("In-Memory Card Tokenization Vault", "CardRecord, NetworkToken, CryptographicContext, TokenStore", "PAN data never stored in plaintext; thread-safe concurrent token lookup", "Proxy Pattern, Singleton Pattern"),
    ("Recurring Mandates Engine (UPI AutoPay)", "Mandate, ExecutionSchedule, PreDebitNotification, DebitAttempt", "24-hour mandatory pre-debit SMS/notification window verification", "Observer Pattern, State Pattern"),
    ("Automated Refund Orchestrator", "RefundOrder, SourcePayment, GatewayRefundHandler, LedgerReversal", "Refund cannot exceed captured charge; instantaneous balance hold", "Template Method Pattern, Unit of Work"),
    ("Payment Link Access Controller", "PaymentLink, AccessPolicy, PaymentSession, ShortUrl", "Atomic access counting; automatic invalidation on max payment count", "Factory Pattern, Decorator Pattern"),
]

FLIPKART_LLD = [
    ("Multi-Level In-Memory Cache System", "CacheLevel, EvictionPolicy, CacheEntry, CacheManager", "Cascading read-through promotion; strict level capacity enforcement", "Chain of Responsibility, Strategy Pattern"),
    ("Flight Route Optimization Engine (Fliptrip)", "Flight, Airline, RouteGraph, BookingRequest", "BFS/Dijkstra traversal; filter validation (meals, stops)", "Strategy Pattern, Facade Pattern"),
    ("Doctor Appointment Scheduling (FlipMed)", "Doctor, Speciality, TimeSlot, WaitlistQueue", "No overlapping doctor/patient slots; FIFO waitlist promotion upon cancellation", "Observer Pattern, Factory Pattern"),
    ("Real-Time Bidding System (SuperBidder)", "AuctionItem, Bidder, Bid, AuctionRule", "Bids must exceed current highest bid; user balance verified before bid registration", "State Pattern, Observer Pattern"),
    ("In-Memory Message Broker & Pub-Sub", "Topic, Partition, ConsumerGroup, OffsetManager", "Partition ordering preserved; multiple consumer groups maintain isolated offsets", "Observer Pattern, Iterator Pattern"),
    ("Configurable Logging Framework", "Logger, LogLevel, LogSink, LogFormatter", "Hierarchical level gating (DEBUG < INFO < WARN < ERROR); non-blocking sinks", "Strategy Pattern, Decorator Pattern"),
    ("Expense Sharing Platform (Splitwise)", "User, Expense, SplitStrategy, BalanceSheet", "Sum of split allocations equals total transaction amount", "Strategy Pattern, Composite Pattern"),
    ("Multi-Floor Parking Lot Engine", "ParkingFloor, ParkingSpot, Vehicle, Ticket", "Vehicle size fits spot type; nearest spot allocation", "Factory Method, Strategy Pattern"),
    ("Promotional Coupon Engine", "Cart, Product, Coupon, DiscountStrategy", "Mutual coupon exclusivity; minimum cart threshold evaluation", "Strategy Pattern, Builder Pattern"),
    ("Flash Sale Inventory Locker", "InventoryItem, LockLease, CartReservation", "Atomic decrement on lock acquisition; automatic replenishment on TTL timeout", "Proxy Pattern, State Pattern"),
]

DATABRICKS_LLD = [
    ("Durable Key-Value Store with WAL", "MemTable, WALWriter, DiskSegment, SSTable", "Append to disk before updating in-memory map; binary recovery scan", "Write-Ahead Log Pattern, Strategy"),
    ("Instrumented Store with Rolling Load", "TimeBucketRing, AtomicCounter, MapStorage, LoadCalc", "Atomic increments; non-blocking time-window quantization", "Flyweight Pattern, Decorator Pattern"),
    ("CIDR and IP Access Control Engine", "TrieNode, CIDRBlock, RuleEntry, AccessResult", "Longest bitwise prefix matching; deterministic rule resolution", "Composite Pattern, Chain of Responsibility"),
    ("Spark Stage DAG Execution Coordinator", "DAGStage, TaskSet, ExecutorHandle, DependencyGraph", "Topological stage execution; stages triggered only after parent shuffle completes", "Observer Pattern, Command Pattern"),
    ("In-Memory Columnar Chunk Buffer", "ColumnVector, ChunkMetadata, TypeDescriptor, BitNulls", "Off-heap contiguous memory; vector iterations without boxing", "Iterator Pattern, Flyweight Pattern"),
    ("Delta Lake Transaction Log File Parser", "CommitLog, LogAction, CheckpointSnapshot, VersionResolver", "Monotonically increasing zero-padded commit IDs; checkpoint compaction", "Builder Pattern, Factory Pattern"),
    ("Nested Referral Revenue Tracker", "CustomerNode, RevenueRecord, ReferralTree, KMinHeap", "Bounded-depth DFS aggregation; minimum revenue filtering", "Composite Pattern, Visitor Pattern"),
    ("In-Memory Clock Eviction Buffer Pool", "BufferPage, ClockHand, FrameTable, PageDescriptor", "Usage-bit sweep without queue shifting; atomic pin-counting during scans", "Iterator Pattern, Proxy Pattern"),
    ("Cluster Autoscaler Workload Evaluator", "WorkerFleet, TaskBacklog, ScalingPolicy, CooldownTimer", "Hysteresis window preventing rapid scale-up/down thrashing", "State Pattern, Strategy Pattern"),
    ("Multi-Tenant Workspace Quota Manager", "Workspace, ResourceTokenBucket, AllocationLease", "Maximum concurrent driver cores and memory per workspace", "Interceptor Pattern, Singleton Pattern"),
]

SNOWFLAKE_LLD = [
    ("In-Memory POSIX File System", "FSNode, Directory, FileLeaf, PathResolver", "Atomic path traversal; sorted directory listings", "Composite Pattern, Interpreter"),
    ("Query Result Cache with Version Invalidation", "CacheKey (Hash of AST + Schema), ResultPage, VersionTracker", "DML on tables invalidates matching cached keys", "Observer Pattern, Cache-Aside"),
    ("Document Index with Predicate Pushdown", "Document, InvertedIndex, PredicateTree, DocEvaluator", "Short-circuit evaluation for nested boolean expressions", "Composite Pattern, Strategy Pattern"),
    ("Virtual Warehouse Credit Metering", "ComputeCluster, SizeMultiplier, CreditCounter, Lease", "Credit charges correspond to exact cluster active seconds", "Strategy Pattern, Factory Pattern"),
    ("Micro-Partition Pruning Metadata Index", "MicroPartition, ColumnStat (Min, Max, Nulls), Pruner", "Partitions bypassed when literals lie outside [min,max]", "Flyweight Pattern, Specification"),
    ("Column-Oriented Block Reader", "DictBlock, SymbolTable, OffsetArray, VectorIterator", "Zero allocation string checks via integer token comparisons", "Iterator Pattern, Flyweight"),
    ("Snowsight Multi-Tab Worksheet Manager", "WorksheetTab, QueryBuffer, ExecutionSession, DraftStore", "Tab state changes isolated; background auto-save without blocking", "Memento Pattern, State Pattern"),
    ("Command History Undo/Redo Engine", "Command, EditOperation, HistoryStack, CaretTracker", "Redo stack cleared on new mutation; symmetric execution", "Command Pattern"),
    ("SQL Autocomplete Tokenizer", "TokenStream, TrieLexicon, ContextScope, CompletionProposal", "Context-aware prefix lookups (tables after FROM, columns after SELECT)", "State Pattern, Builder Pattern"),
    ("Warehouse Concurrency Gate", "QueryTask, ConcurrencyGate, QueuePriorityQueue, WorkerChannel", "Running query count never exceeds cluster slot capacity", "Semaphore Pattern, Producer-Consumer"),
]

PIERRE_LLD = [
    ("Content-Addressed Git Object Store", "GitBlob, GitTree, GitCommit, GitRef, ObjectHasher", "Immutable SHA-1/SHA-256 addressing; canonical serialization", "Factory Pattern, Repository Pattern"),
    ("Path-First File Tree Model Engine", "TreeModel, TreeNode, PathResolver, ChainedFolderCompactor", "Canonical path addresses every node; idempotent directory expansion", "Composite Pattern, Iterator Pattern"),
    ("Unified Diff Streaming Parser", "DiffHunk, LineRecord, ChangeType, PatchEngine", "Line numbers preserve exact mapping between source and dest", "Builder Pattern, Interpreter Pattern"),
    ("Virtual File System Session Workspace", "VFSWorktree, StagingIndex, VFSNode, ConflictDescriptor", "In-memory staging operations match POSIX filesystem semantics", "Facade Pattern, Unit of Work"),
    ("Three-Phase Commit Spoke Node Coordinator", "CoordinationSession, CohortSpoke, VoteRecord, CommitBarrier", "Non-blocking abort on timeout; quorum consensus verification", "State Pattern, Mediator Pattern"),
    ("Codebase In-Memory Grep Pattern Matcher", "GrepWorker, RegexMatcher, MatchOccurrence, SearchScope", "Parallel blob evaluation; line-offset tracking; zero copy scanning", "Worker Pool, Strategy Pattern"),
    ("Ephemeral Branch Reference Lease Manager", "EphemeralRef, LeaseTTL, HeartbeatRenewal, RefCleaner", "Automatic ref tombstoning on TTL expiration; thread-safe atomic swaps", "Proxy Pattern, Observer Pattern"),
    ("Hot-to-Cold Tiered Storage Migration Daemon", "RepositoryMetadata, AccessLog, ArchivalPacker, StorageBridge", "Inactive repos after 7 days safely compacted and flushed to cold storage", "State Pattern, Strategy Pattern"),
    ("Git LFS Chunked Hash Allocation Engine", "LFSObject, ChunkDescriptor, OidVerification, LfsPointer", "SHA-256 integrity check; raw binary stream bypass of commit objects", "Chain of Responsibility, Adapter"),
    ("Syntax Highlighting Token Cache", "TokenCacheKey, SyntaxTokenStream, GrammarDefinition", "Cache key includes text hash and grammar state; LRU eviction", "Flyweight Pattern, Cache-Aside"),
]

TML_LLD = [
    ("Training & Sampling Session Manager", "ServiceClient, LoraTrainingClient, SamplingClient, Session", "Model switching via base string; state parity between training and sampling", "Factory Pattern, Facade Pattern"),
    ("Remote Execution Future with Backoff", "RemoteFuture, PollerThread, RetryContext, ResultEnvelope", "Non-blocking resolution; transparent handling of transient cluster errors", "Future/Promise Pattern, Strategy"),
    ("Chat Template Tokenizer & Renderer", "ChatMessage, TokenStream, SpecialTokenMap, Renderer", "Bidirectional conversion idempotency; special role token safety", "Builder Pattern, Interpreter"),
    ("LoRA Matrix Memory Allocator", "AdapterMatrix, RankConfig, AlphaScalar, WeightBuffer", "Memory scaling by rank r≪d; initialization B=0, A∼N(0,σ²)", "Flyweight Pattern, Prototype"),
    ("RL Rollout Trajectory Buffer", "TrajectoryStep, Observation, ActionLogprob, RewardSignal", "Storage of off-policy importance ratios; advantage capping to prevent collapse", "Circular Buffer Pattern, Collector"),
    ("GPU Failure Detector & Heartbeat Monitor", "GPUNode, HeartbeatLease, NodeHealth, ClusterRebalancer", "Nodes silent for >10s evicted; automatic reassignment of rank partitions", "Observer Pattern, State Pattern"),
    ("Learning Rate & Hyperparameter Scaler", "Scheduler, WarmupSchedule, CosineDecay, RankScaleFactor", "LR scaled inversely with LoRA rank; step counter determinism", "Strategy Pattern"),
    ("Benchmark Evaluation Suite Harness", "BenchmarkTask (GSM8K, IFEval), Worker, AccuracyMetric", "Deterministic sampling temperature (T=0); strict regex answer extraction", "Template Method, Strategy Pattern"),
    ("Model Checkpoint Packager", "CheckpointArchive, TarballStream, RegistryEntry", "Checkpoint includes weights and optimizer states; SHA-256 verification", "Builder Pattern, Proxy Pattern"),
    ("Multimodal VLM Tensor Batching Pipeline", "VisionToken, ImageTensor, BoundingBox, BatchCollator", "Tensor padding aligned to 64-byte boundaries; interleaved text/image tensors", "Pipeline Pattern, Adapter Pattern"),
]

UBER_HLD = [
    ("Global Real-Time Ride Matching Architecture", "Geospatial driver lookup, low-latency match dispatch, accept/reject orchestration", "1M active drivers, 100k requests/sec, matching latency P99 <1000ms", "Google S2 / Uber H3, Apache Kafka, Redis Cluster, Envoy"),
    ("Real-Time Driver Location Ingestion Pipeline", "Ingestion of driver GPS coordinates every 4 seconds; coordinate map-matching", "2.5M writes/sec; write latency <50ms; durable stream retention", "Netty TCP Gateway, Apache Flink, Cassandra / ScyllaDB, Kafka"),
    ("Real-Time Dynamic Surge Pricing Platform", "Continuous supply-demand aggregation per spatial cell; dynamic multiplier publication", "Sub-minute aggregation windows; eventual consistency bounded by 10 seconds", "Flink sliding window streaming, H3 spatial grid indexing, Redis pub-sub"),
    ("High-Availability Heatmap Generation Engine", "Live driver density and demand intensity rendering for rider and driver apps", "Global delivery; client-side vector tile compression; maximum cache age 5s", "Quadtree tile generator, Redis Geo, CDN edge caching"),
    ("Real-Time ETA Prediction Engine", "Routing calculation, traffic overlay ingestion, deep learning ETA inference", "Graph traversal over tens of millions of road segments; inference time <30ms", "Contraction Hierarchies, C++ Routing Core, Triton Inference Server"),
    ("Schemaless Distributed Datastore Architecture", "Append-only entity storage over relational backends (MySQL shards)", "Petabyte scale; linear scale-out; immutable cell revision history", "Uber Schemaless, MySQL shards, ZooKeeper coordination"),
    ("Distributed Webhook & Event Push Gateway", "Real-time state push to millions of connected mobile apps via persistent sockets", "10M concurrent persistent WebSocket connections; graceful edge failover", "Go WebSocket Edge, Redis Session Store, gRPC routing"),
    ("Cross-Region Active-Active Trip Coordination", "Multi-datacenter deployment preventing split-brain trip mutations", "Zero data loss on regional outage; strict idempotency on trip status mutations", "Raft-backed coordinator, CockroachDB / Spanner primitives, Envoy"),
    ("Uber Eats Batch Delivery & Courier Routing", "Multi-order batch bundling; kitchen prep time alignment; courier routing", "Dynamic TSP (Traveling Salesperson) optimization in sub-second timelines", "VRP solvers, Redis state cache, Kafka event triggers"),
    ("Real-Time City Operations Analytics Dashboard", "OLAP slice-and-dice of active trips, driver utilization, cancellations, and earnings", "Query response <500ms over billions of historical and real-time records", "Apache Pinot, Apache Kafka, Presto / Trino query layer"),
]

STRIPE_HLD = [
    ("Global Idempotent Payment Intent Gateway", "Public API endpoint terminating millions of checkout payment attempts with idempotency", "100,000 req/sec; P99 <150ms; strict exactly-once payment semantics", "Envoy, Redis (Idempotency cache), CockroachDB, Kafka"),
    ("Double-Entry General Ledger System", "Immutable recording of all financial transfers, debits, credits, and payouts", "Durability guarantee; zero discrepancy; auditability across 10 years", "Distributed Relational Store (Spanner/PostgreSQL Shards), Raft, Kafka"),
    ("Real-Time Fraud Detection Engine (Stripe Radar)", "Pre-scoring every transaction via ML inference and user heuristics", "Scoring execution budget <80ms; streaming feature extraction across billions of events", "Flink, Triton Inference Server, Aerospike Feature Store"),
    ("Distributed Webhook Ingestion & Delivery Service", "Guaranteed delivery of system events (payment_intent.succeeded) to external URLs", "50M events daily; resilient retry schedule spanning 72 hours", "SQS / Kafka, Step Functions / Custom Go Dispatchers, Redis"),
    ("Global Multi-Tenant Billing System", "Flexible invoicing, usage metering, automatic payment collection, tax computation", "Hundreds of thousands of daily invoice generations; batch billing windows", "Distributed Scheduler, Temporal Workflow Engine, Amazon Aurora"),
    ("PCI-DSS Compliant Isolated Card Tokenization Vault", "Isolation, encryption, storage, and tokenized retrieval of raw card data", "HSM-backed cryptographic operations; zero cleartext ingress to general network", "Hardware Security Modules (HSM), Enclave Containers, Vault"),
    ("Multi-Acquirer Payment Routing & Circuit Breaking", "Directing authorization requests to global acquiring banks based on uptime and fees", "Dynamic switching within 10ms of acquirer degradation", "Redis Cluster, Consul, Go Routing Service, ClickHouse for telemetry"),
    ("High-Throughput Usage-Based Metering System", "Streaming ingestion of API calls and compute consumption from developers", "1M events/sec; deduplication over 24-hour sliding windows", "Kafka, Apache Druid, RocksDB embedded aggregators"),
    ("Daily Bank Reconciliation and Settlement Engine", "Ingestion of multi-bank clearing files (NACHA, MT940), reconciling ledger entries", "Multi-gigabyte file parsing in parallel; automated mismatch flagging", "Apache Spark, Airflow, Object Storage (S3), PostgreSQL"),
    ("Cross-Region Multi-Cloud Disaster Recovery", "Replication of payment processing state across clouds without split-brain risk", "RPO = 0; RTO <30s under multi-region cloud failure", "Global Spanner, Multi-cloud DNS routing, Envoy Service Mesh"),
]

RAZORPAY_HLD = [
    ("High-Volume UPI Processing Infrastructure", "Peak UPI transactions per second, collect requests, and bank switches", "10,000 TPS burst; callback resolution time <1s", "Go S2S workers, Redis Cluster, Apache Kafka, ScyllaDB"),
    ("India-Scale Merchant Settlement Platform (RazorpayX)", "Daily automated netting, nodal account transfers, and NEFT/RTGS/IMPS integrations", "Daily settlement across millions of accounts; multi-million dollar correctness", "Temporal Workflow Engine, PostgreSQL Shards, Apache Spark"),
    ("Multi-Bank Payment Route Switching System", "Dynamic transaction routing across acquiring banks using real-time machine learning telemetry", "Latency overhead <10ms; immediate failover on bank degradation", "Envoy Service Mesh, Redis, ClickHouse for stream analytics"),
    ("Scalable Multi-Tenant Webhook Dispatch Platform", "Delivery of payment events to merchant webhooks", "100M events/day; 99.99% delivery or permanent DLQ archival", "Apache Kafka, Custom Go Dispatcher Workers, MongoDB"),
    ("Real-Time Fraud Detection Platform", "Pre-authorization scoring of transactions for identity theft and velocity fraud", "Decision latency <50ms at 5,000 requests/sec", "Apache Flink, Redis, Python Inference Microservice, Cassandra"),
    ("High-Availability Payment Links Service", "Short-link generation, custom domain routing, mobile-optimized checkout pages", "Global edge availability; flash sale load spikes (100k views/min)", "Cloudflare Workers, Redis, Aurora MySQL"),
    ("Standard Checkout Embeddable SDK Delivery Network", "CDN-served JavaScript bundle powering checkout on merchant domains", "Sub-50KB bundle; global latency <100ms; 99.999% CDN uptime", "AWS CloudFront / Fastly, Rollup bundler, S3 origin, SRI"),
    ("Real-Time Merchant Analytics Engine", "Live GMV, transaction success rates, and customer cohorts on merchant dashboards", "Query response <200ms across billions of historical transactions", "Apache Pinot, Apache Flink, Trino, PostgreSQL"),
    ("Tokenized Card Vault Infrastructure", "Provisioning, storing, and referencing CoF (Card-on-File) network tokens across networks", "Hardware Security Module encryption; zero storage of plain card data", "Dedicated HSM, Kubernetes isolated enclaves, HashiCorp Vault"),
    ("Automated Dispute Resolution Portal", "Managing financial claims, auto-routing disputes to bank systems, evidence lifecycle", "Multi-institution workflow engine; document image processing", "PostgreSQL, S3, Camunda / Temporal workflow engine"),
]

FLIPKART_HLD = [
    ("Big Billion Days Flash Sale Architecture", "Real-time inventory reservation, queue gating, and checkout processing", "500,000 req/sec on hot items; zero overselling", "Redis Cluster (Lua scripts), Kafka, Cassandra"),
    ("Distributed Order Management System (OMS)", "Order placement, status updates, warehouse dispatch, and returns", "10M orders/day; ACID consistency on checkout", "Spanner / CockroachDB, Temporal, Kafka"),
    ("Real-Time E-Commerce Product Search", "Search across hundreds of millions of product SKUs with category filtering", "50,000 search QPS; index refresh latency <2s", "Elasticsearch / Apache Solr cluster, Kafka, Redis"),
    ("India-Scale Warehouse & Inventory Allocation", "Routing orders to fulfillment centers based on stock and SLA", "Dynamic optimization over hundreds of hubs and dark stores", "Graph DBs (Neo4j), PostgreSQL, Flink"),
    ("Real-Time Dynamic Repricing Engine", "Continuous competitor price tracking and instant catalog repricing", "Repricing pipeline evaluating 100M SKUs hourly", "Apache Spark, Apache Hudi Lakehouse, Redis"),
    ("Reviews & Ratings Ingestion Pipeline", "Ingestion of customer media, spam detection, and aggregate rating calculation", "Asynchronous media resizing; eventual consistency for star score aggregates", "S3-compatible Store, Apache Flink, Cassandra, Kafka"),
    ("Reverse Logistics & Return Tracking", "Orchestrating product pick-up, quality checks, return routing, and instant refunds", "Real-time tracking across 10,000 delivery agents", "Go Microservices, RabbitMQ, PostgreSQL"),
    ("Personalized Homepage Feed Engine", "Real-time product recommendations and widget delivery based on user intent", "Recommendation retrieval <50ms; 100M daily active users", "Vector Search (Milvus/Pinecone), Redis Feature Store, Ray"),
    ("Delivery Slot Booking & Fleet Dispatch", "Capacity management for grocery delivery windows; route clustering", "Dynamic cut-offs when delivery slot capacities are reached", "Redis bit-arrays, PostgreSQL, OSRM"),
    ("Cross-Region Disaster Recovery Datastore", "Replication of user cart and payment state across Indian data centers", "RPO = 0, RTO <60s under datacenter isolation", "Raft state machines, Global Anycast Routing, ZooKeeper"),
]

DATABRICKS_HLD = [
    ("Delta Lake Storage Engine & ACID Protocol", "Serialized ACID transactions over cloud object storage (S3/Azure/GCS)", "Millions of write operations; zero data corruption; handling eventual consistency", "Parquet, Delta Log JSON/Checkpoints, S3 Conditional Writes"),
    ("Unity Catalog Lakehouse Governance", "Fine-grained access control, lineage tracking, and audit logging across tables", "Sub-10ms authorization overhead; cross-cloud catalog federation", "Distributed Metadata Engine (Spanner/Aurora), gRPC"),
    ("Distributed Spark Shuffle Service", "Partitioning, shuffle exchange, and task scheduling across thousands of nodes", "Petabytes shuffled per query; handling executor loss without job failure", "Apache Spark, Netty-based External Shuffle Service"),
    ("Serverless SQL Warehouse Control Plane", "Rapid provisioning and automatic scaling of SQL clusters in sub-10 seconds", "Thousands of customer tenants; warm VM pool management", "Kubernetes Operator, WireGuard mesh, etcd, Envoy"),
    ("Streaming Ingestion (Delta Live Tables)", "Declarative ETL pipeline orchestration with automatic lineage and quality monitoring", "Exactly-once processing guarantees; micro-batch and continuous low-latency modes", "Spark Structured Streaming, RocksDB state store, Kafka"),
    ("Collaborative Notebook Workspace Platform", "Collaborative Python/SQL/Scala notebook kernel sessions with live streaming", "100k concurrent notebooks; tenant sandbox isolation", "WebSockets, Jupyter Kernel Gateway, Firecracker MicroVMs"),
    ("Lakehouse Time Travel & Snapshot Manager", "Point-in-time querying and zero-copy historical rollback across dataset versions", "Instantaneous snapshot resolution over millions of Parquet files", "Delta Log indexing, S3 versioning, RocksDB checkpoint cache"),
    ("Vector Search Engine for Lakehouse AI", "Embedding index generation, similarity search, and real-time retrieval over Delta", "Billions of vector embeddings; sub-20ms search latency", "HNSW / IVF-PQ index algorithms, GPU-accelerated nodes"),
    ("Change Data Capture (CDC) Lakehouse Pipe", "Streaming CDC log ingestion from OLTP databases directly into Delta tables", "Handling schema drift, row out-of-order arrival, and deduplication", "Debezium, Apache Kafka, Spark Streaming Merge"),
    ("Global Fleet Metric Telemetry Aggregator", "Ingestion and visualization of executor CPU, memory, GC, and spill metrics", "Tens of millions of metrics per second from global compute clusters", "Apache Pinot, OpenTelemetry, Kafka, VictoriaMetrics"),
]

SNOWFLAKE_HLD = [
    ("Multi-Cluster Shared-Data Architecture", "Decoupling storage (object store) and compute (stateless virtual warehouses)", "Independent scaling; zero resource contention between warehouses", "S3 / Azure Blob, Stateless EC2 Workers, FoundationDB"),
    ("Micro-Partition Storage & Metadata Engine", "Immutable columnar micro-partition creation (50-500MB) with pruning metadata", "Hundreds of billions of partitions; instant catalog lookups", "Cloud Object Store, Paxos/Raft Metadata Service"),
    ("Distributed Query Result Cache", "Multi-tenant cached query result retrieval bypassing compute warehouses", "100,000 queries/min; sub-10ms response on cache hits", "Redis / DynamoDB metadata, S3 result objects"),
    ("Snowpipe: Continuous Data Ingestion", "Serverless micro-batch loading triggered via cloud storage events", "Ingestion latency <3s; automated file deduplication", "SQS / SNS / EventBridge, Serverless Compute"),
    ("Zero-Copy Database Cloning Infrastructure", "Cloning entire schemas and databases without physical data duplication", "Clone operation latency <2s regardless of petabyte scale", "Metadata pointer replication, copy-on-write tracking"),
    ("Database Time Travel and Fail-Safe System", "Historical point-in-time state querying and table resurrection up to 90 days", "Immutable historical partition tracking; automated lifecycle purging", "Metadata history graph, retention managers"),
    ("Secure Data Sharing Mesh across Clouds", "Cross-account, cross-cloud live data sharing without ETL data movement", "Zero physical data replication; unified access control across AWS/Azure/GCP", "Global metadata federation, cross-cloud tokens"),
    ("Multi-Tenant RBAC & Data Masking Engine", "Centralized security evaluating row access and column masking policies", "Sub-millisecond policy compile time during query parsing", "AST rewriting rules, secure view virtualization"),
    ("Distributed Spilling & Local SSD Caching", "NVMe SSD cache on warehouse nodes, spilling to object storage on OOM", "Sustaining query execution across data volumes far exceeding RAM", "NVMe kernel caching, remote chunk spilling daemons"),
    ("Snowsight Web Workspaces Architecture", "Multi-tenant web platform for SQL editing, profiling, and chart generation", "Rendering millions of table rows; collaborative state sync", "React, WebAssembly data parsing, WebSockets, CDN"),
]

PIERRE_HLD = [
    ("Ultra-Low Latency Git Storage (code.storage)", "White-label, distributed Git infrastructure for AI codegen platforms", "Millions of new repos daily; read/write ∼60× faster than S3/R2", "Spoke quorum cluster, NVMe write engine, Git 3PC, Cloudflare"),
    ("Spoke Distributed Git Replica Cluster", "Quorum-based replication ensuring durability across Git spoke nodes", "N/2+1 majority quorum write ACKs; transparent failover", "Go Spoke daemons, Raft coordination, custom TCP transport"),
    ("Tiered Code Storage (Hot SSD to Cold Object)", "Migration of idle agent repositories to cold object storage with fast rehydration", "Cold tier storage cost optimization with sub-second unarchival", "S3 / Cloudflare R2, RocksDB metadata, zstd compression"),
    ("AI Agent Repository Spawner (1M+ Repos/Day)", "Programmatic creation of Git repositories for agent execution environments", "Repo provisioning latency <20ms; zero rate limits", "Copy-on-write ref namespaces, distributed Spoke allocation"),
    ("Global Codebase Grep & Content Indexing", "Regex code search and glob-based filtering across machine-generated repos", "Search response time <100ms over gigabyte repositories", "Trigram inverted indices, memory-mapped blob scanning, Go"),
    ("Programmable Git Protocol Edge Gateway", "Exposing native Git transport (git clone, git push) alongside REST and SDKs", "Terminating tens of thousands of concurrent Git packfile transfers", "Go Git HTTP/SSH edge server, Envoy proxy, eBPF routing"),
    ("External Git Sync Engine (GitHub/GitLab)", "Automated synchronization between code.storage and external Git remotes", "Webhook ingestion; conflict detection; transparent push mirroring", "Redis sync queue, Worker Pool, GitHub App OAuth"),
    ("Real-Time Collaborative VFS Mesh", "Synchronizing in-memory virtual file trees across agents and browser sessions", "Sub-10ms patch broadcasting; CRDT document merging", "WebSockets, Yjs / Automerge CRDTs, Bun/TypeScript backend"),
    ("Git Large File Storage (LFS) Vault", "Streaming storage and deduplication for multi-gigabyte ML weights and assets", "Multi-part streaming direct to object storage; SHA-256 verification", "S3-compatible cold tier, Redis chunk tracking, Go chunk streamer"),
    ("Multi-Tenant Cryptographic Audit Ledger", "Per-tenant encryption, SOC2 Type II compliance, and fine-grained agent action logging", "Tamper-evident cryptographic log generation on every commit and ref update", "Merkle Tree audit chains, AWS KMS envelope encryption, PostgreSQL"),
]

TML_HLD = [
    ("Tinker Distributed Training Platform", "Decoupled CPU-based user training loop over managed GPU clusters", "Models from 1B to 1T+ parameters; transparent hardware recovery", "Custom Cluster Orchestrator, gRPC, PyTorch / CUDA, Ray"),
    ("Multi-Tenant LoRA Compute Multiplexer", "Multiplexing multiple user LoRA jobs onto shared base model GPU weights", "10× improvement in GPU utilization; total tenant memory isolation", "Custom CUDA kernels, NVIDIA MIG, vLLM"),
    ("Distributed Sampling & Speculative Decoding", "Rollout generation for RL and evaluation workloads", "Tens of thousands of tokens/sec; KV-cache reuse across trajectory iterations", "Triton Inference Server, vLLM, FlashAttention, Ray Serve"),
    ("Transparent Hardware Failure Recovery Engine", "Live migration of in-flight training runs upon GPU hardware fault", "Rollback to step snapshot; recovery time <30s without script crash", "Kubernetes Operator, InfiniBand monitoring, S3 streams"),
    ("Real-Time RL Rollout & Gradient Pipeline", "Generating rollouts, computing reward signals, aggregating gradients", "Low-latency on-policy and stabilized off-policy RL execution", "NCCL, ZeroMQ, Redis Streams"),
    ("Checkpoint Archival & Global Snapshot Mesh", "Saving and retrieval of checkpoint tarballs across cloud storage regions", "Terabytes written per hour; multi-region replication", "Cloud Object Storage (S3/GCS), Ceph, P2P cluster mesh"),
    ("Automated Evaluation & Benchmark Scoring Grid", "Inline validation running 12+ benchmarks (GSM8K, MATH-500, SWE-bench)", "Dynamic worker allocation without starving primary training runs", "Celery / Temporal, Docker Sandboxes, ClickHouse"),
    ("Real-Time Training Telemetry Platform", "Ingestion and streaming of step loss, learning rate, gradient norms, and VRAM", "100k events/sec; sub-second browser dashboard rendering via WebSockets/SSE", "Kafka, TimescaleDB / ClickHouse, WebSockets Gateway"),
    ("Secure Sandbox for Code Reasoning Rollouts", "Isolated execution environments for training models on coding tasks", "Sub-50ms container startup; full network and syscall isolation", "Firecracker MicroVMs, gVisor, Linux cgroups"),
    ("Multimodal Model Post-Training Ingestion", "Parallel tokenization, image patch embedding, and audio tokenization", "Gigabytes of multimodal data per minute without GPU starvation", "Ray Data, Apache Arrow, Shared Memory IPC"),
]

REFERENCES = [
    {"title": "Mastering the Stripe Software Engineer Interview", "site": "leetcodewizard.io", "url": "https://leetcodewizard.io/blog/stripe-software-engineer-interview"},
    {"title": "Flipkart Interview Process 2026: Machine Coding, DSA Questions", "site": "ophyai.com", "url": "https://ophyai.com/blog/flipkart-interview-process"},
    {"title": "Top 33 Razorpay Interview Questions And Answers 2025", "site": "techprep.app", "url": "https://www.techprep.app/blogs/razorpay-interview-questions"},
    {"title": "Databricks Coding & Algorithms interview questions", "site": "prachub.com", "url": "https://prachub.com/databricks-coding-interview-questions"},
    {"title": "Code Storage — Git Infrastructure at Scale", "site": "code.storage", "url": "https://code.storage"},
    {"title": "Thinking Machines Lab Business Breakdown & Founding Story", "site": "research.contrary.com", "url": "https://research.contrary.com/company/thinking-machines"},
    {"title": "Just had Stripe First Coding Round", "site": "reddit.com", "url": "https://www.reddit.com/r/leetcode/comments/just_had_stripe_first_coding_round/"},
    {"title": "Prepare and practice for Flipkart Machine Coding Round", "site": "github.com", "url": "https://github.com/topics/flipkart-machine-coding"},
    {"title": "Databricks SWE Interview: Algorithms Guide", "site": "coditioning.com", "url": "https://www.coditioning.com/databricks-swe-interview"},
    {"title": "Uber Frontend Engineer Interview Questions (with answers)", "site": "frontendlead.com", "url": "https://www.frontendlead.com/interviews/uber"},
    {"title": "Snowflake Frontend Interview Questions: Prep Guide for 2026", "site": "greatfrontend.com", "url": "https://www.greatfrontend.com/blog/snowflake-frontend-interview-questions"},
    {"title": "Uber | L4 | Bangalore | Oct-Nov 2020 [Reject]", "site": "leetcode.com", "url": "https://leetcode.com/discuss/interview-experience/uber"},
    {"title": "FAANG-Coding-Interview-Questions", "site": "github.com", "url": "https://github.com/ombharatiya/FAANG-Coding-Interview-Questions"},
    {"title": "Razorpay-Style Machine Coding Round: Format, Tips & Practice", "site": "gronex.org", "url": "https://gronex.org/razorpay-machine-coding-round"},
    {"title": "Databricks Interview Questions & Experiences 2026", "site": "codingkaro.in", "url": "https://codingkaro.in/databricks-interview-questions"},
    {"title": "Top 10 Databricks Interview Questions and Answers for 2026", "site": "blog.theinterviewguys.com", "url": "https://blog.theinterviewguys.com/databricks-interview-questions/"},
    {"title": "15 Common Snowflake Interview Questions", "site": "dataengineeracademy.com", "url": "https://dataengineeracademy.com/blog/snowflake-interview-questions/"},
    {"title": "Trees docs", "site": "trees.software", "url": "https://trees.software"},
    {"title": "Tinker: a training API for researchers and developers", "site": "tinker-docs.thinkingmachines.ai", "url": "https://tinker-docs.thinkingmachines.ai"},
    {"title": "Machine Coding Round: Flipkart SDE-II Interview", "site": "medium.com", "url": "https://medium.com/tag/machine-coding-round"},
    {"title": "Uber Technical Interview Questions: Complete Guide (2026)", "site": "jobright.ai", "url": "https://jobright.ai/blog/uber-technical-interview-questions"},
    {"title": "Uber Interview Process: (Step-by-Step Guide)", "site": "codinginterview.com", "url": "https://www.codinginterview.com/guide/uber-interview"},
    {"title": "Uber | SDE-2 | Offer | Bangalore", "site": "leetcode.com", "url": "https://leetcode.com/discuss/interview-experience?query=uber"},
    {"title": "Stripe Software Engineer Interview Guides", "site": "prepfully.com", "url": "https://prepfully.com/interview-guides/stripe-software-engineer"},
    {"title": "Stripe [No offer] — Discuss", "site": "leetcode.com", "url": "https://leetcode.com/discuss/interview-experience?query=stripe"},
    {"title": "Stripe - Backend Engineer Interview Experience", "site": "leetcode.com", "url": "https://leetcode.com/discuss/interview-question?query=stripe"},
    {"title": "Stripe Onsite Interview (Hopeful pass)", "site": "leetcode.com", "url": "https://leetcode.com/discuss/interview-experience?query=stripe%20onsite"},
    {"title": "Stripe New Grad Interview Experience 2026", "site": "leetcode.com", "url": "https://leetcode.com/discuss/interview-experience?query=stripe%20new%20grad"},
    {"title": "Razorpay Interview Process: SDE Rounds Explained", "site": "finalroundai.com", "url": "https://www.finalroundai.com/blog/razorpay-interview-process"},
    {"title": "Flipkart Low Level Design Interview Questions from Recent Machine Coding", "site": "reddit.com", "url": "https://www.reddit.com/r/developersIndia/comments/flipkart-lld/"},
    {"title": "Flipkart Interview Experience for SDE-2 (3.5 years experienced)", "site": "geeksforgeeks.org", "url": "https://www.geeksforgeeks.org/flipkart-interview-experience-for-sde-2/"},
    {"title": "FlipFin/FlipMed — Asked in Flipkart Machine Coding Round", "site": "github.com", "url": "https://github.com/topics/flipmed"},
    {"title": "shubhamharitash/SuperBidder — Flipkart Machine Coding", "site": "github.com", "url": "https://github.com/shubhamharitash/SuperBidder"},
    {"title": "machinecoding GitHub Topics", "site": "github.com", "url": "https://github.com/topics/machinecoding"},
    {"title": "Devtools-Tech-Team/front-end-interview-questions", "site": "github.com", "url": "https://github.com/Devtools-Tech-Team/front-end-interview-questions"},
    {"title": "react-interview-questions GitHub Topics", "site": "github.com", "url": "https://github.com/topics/react-interview-questions"},
    {"title": "Top 42 Databricks Interview Questions And Answers 2025", "site": "techprep.app", "url": "https://www.techprep.app/blogs/databricks-interview-questions"},
    {"title": "Databricks Interview SDE — Discuss", "site": "leetcode.com", "url": "https://leetcode.com/discuss/interview-experience?query=databricks"},
    {"title": "Trees.software", "site": "trees.software", "url": "https://trees.software"},
    {"title": "Snowflake's Interview Process (2026)", "site": "techprep.app", "url": "https://www.techprep.app/blogs/snowflake-interview-process"},
    {"title": "Snowflake Interview Process 2026 — Coding, System Design", "site": "ophyai.com", "url": "https://ophyai.com/blog/snowflake-interview-process"},
    {"title": "Snowflake Senior Software Engineer Phone Screen", "site": "leetcode.com", "url": "https://leetcode.com/discuss/interview-experience?query=snowflake"},
    {"title": "Snowflake Coding & Algorithms Questions (Updated 2026)", "site": "prachub.com", "url": "https://prachub.com/snowflake-coding-interview-questions"},
    {"title": "Snowflake Software Engineer (SWE) Interview Guide", "site": "tryexponent.com", "url": "https://www.tryexponent.com/guides/snowflake-software-engineer-interview"},
    {"title": "Snowflake Coding Interview Questions (90 Problems Reported)", "site": "stealthcoder.app", "url": "https://stealthcoder.app/snowflake-coding-interview-questions"},
    {"title": "Pierre Computer Company", "site": "pierre.computer", "url": "https://pierre.computer"},
    {"title": "just-bash supports git command, backed by code.storage", "site": "github.com", "url": "https://github.com/search?q=just-bash+code.storage"},
    {"title": "Code Storage by the Pierre Computer Company", "site": "daily.dev", "url": "https://app.daily.dev/posts/code-storage-by-the-pierre-computer-company"},
    {"title": "Code Storage by the Pierre Computer Company", "site": "news.ycombinator.com", "url": "https://news.ycombinator.com/item?id=code-storage"},
    {"title": "INTRODUCING CODE.STORAGE", "site": "code.storage", "url": "https://code.storage"},
    {"title": "The Pierre Computer Company", "site": "github.com", "url": "https://github.com/pierre"},
    {"title": "Thinking Machines' first official product is here: meet Tinker", "site": "venturebeat.com", "url": "https://venturebeat.com/ai/thinking-machines-tinker"},
    {"title": "thinking-machines-lab/tinker-cookbook", "site": "github.com", "url": "https://github.com/thinking-machines-lab/tinker-cookbook"},
    {"title": "Tinker Tutorial: Fine-Tuning LLMs With Thinking Machines Lab", "site": "datacamp.com", "url": "https://www.datacamp.com/tutorial/tinker-thinking-machines"},
    {"title": "Tinker — Thinking Machines Lab", "site": "thinkingmachines.ai", "url": "https://thinkingmachines.ai/tinker"},
]


def main():
    items = []
    items += mc("UB", "uber", UBER_MC)
    items += lld("UB", "uber", UBER_LLD)
    items += hld("UB", "uber", UBER_HLD)
    items += mc("ST", "stripe", STRIPE_MC)
    items += lld("ST", "stripe", STRIPE_LLD)
    items += hld("ST", "stripe", STRIPE_HLD)
    items += mc("RP", "razorpay", RAZORPAY_MC)
    items += lld("RP", "razorpay", RAZORPAY_LLD)
    items += hld("RP", "razorpay", RAZORPAY_HLD)
    items += mc("FK", "flipkart", FLIPKART_MC)
    items += lld("FK", "flipkart", FLIPKART_LLD)
    items += hld("FK", "flipkart", FLIPKART_HLD)
    items += mc("DB", "databricks", DATABRICKS_MC)
    items += lld("DB", "databricks", DATABRICKS_LLD)
    items += hld("DB", "databricks", DATABRICKS_HLD)
    items += mc("SF", "snowflake", SNOWFLAKE_MC)
    items += lld("SF", "snowflake", SNOWFLAKE_LLD)
    items += hld("SF", "snowflake", SNOWFLAKE_HLD)
    items += mc("PC", "pierre", PIERRE_MC)
    items += lld("PC", "pierre", PIERRE_LLD)
    items += hld("PC", "pierre", PIERRE_HLD)
    items += mc("TM", "tml", TML_MC)
    items += lld("TM", "tml", TML_LLD)
    items += hld("TM", "tml", TML_HLD)

    counts = {"mc": 0, "lld": 0, "hld": 0}
    for it in items:
        counts[it["kind"]] += 1
    assert counts["mc"] == 280, counts
    assert counts["lld"] == 80, counts
    assert counts["hld"] == 80, counts
    assert len(items) == 440, len(items)
    ids = [it["id"] for it in items]
    assert len(ids) == len(set(ids))

    payload = {"companies": COMPANIES, "items": items, "references": REFERENCES}
    out = Path(__file__).resolve().parents[1] / "src" / "data" / "machineCoding.json"
    out.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {out} items={len(items)} refs={len(REFERENCES)} {counts}")


if __name__ == "__main__":
    main()
