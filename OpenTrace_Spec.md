# OpenTrace — Project Specification
## Distributed Tracing System · TypeScript + Go Hybrid

**TypeScript components:** API Gateway · Next.js UI · Auto-Instrumentation SDK (TS)
**Go components:** Collector · Pipeline Processor · Storage Layer · Query Service · Auto-Instrumentation SDK (Go)
**Stack:** Go · TypeScript · gRPC + Protobuf · ClickHouse · Kafka · Next.js 15 · D3.js · Kubernetes
**Building Blocks:** `relay` (live tail WS) · `switchboard` (gateway auth layer) · `vault` (span dedup) · `pgpool` (metadata PG proxy)

---

## 1. What It Is

A complete open-source distributed tracing system — architecturally equivalent to Jaeger, built from scratch. Receives OTLP spans over gRPC/HTTP, processes them through Kafka with tail-based sampling, stores in ClickHouse at 10M spans/sec, queries via gRPC, renders in a Next.js UI with D3.js waterfall visualisation and live tail. OpenTrace instruments itself — the self-referential demo is live.

This is the final year project and portfolio centrepiece. It is the project that makes the LFX Mentorship application credible, because you built what Jaeger is.

---

## 2. Component Language Split

| Component | Language | Mirrors | Month Built |
|---|---|---|---|
| **Collector** | Go | Jaeger Collector / OTel Collector | Month 2 |
| **Pipeline Processor** | Go | Jaeger Ingester / OTel Processor | Month 3 |
| **Storage Layer** | Go | Jaeger ClickHouse Plugin | Month 5 |
| **Query Service** | Go | Jaeger Query Service | Month 6 |
| **API Gateway** | TypeScript (Node.js + Express) | Jaeger HTTP API + gRPC-gateway | Month 6 |
| **UI** | TypeScript (Next.js + React + D3.js) | Jaeger UI | Months 4 + 7 |
| **SDK (Go)** | Go | OpenTelemetry Go SDK | Month 7 |
| **SDK (TypeScript)** | TypeScript | OpenTelemetry JS SDK | Month 7 |

---

## 3. Full Stack

| Layer | Technology | Used In |
|---|---|---|
| Go backend | Go 1.23+ · `grpc-go` · `sarama` · `clickhouse-go` · `slog` · `pprof` | Collector, Processor, Storage, Query, Go SDK |
| TypeScript backend | Node.js 22 · Express 5 · TypeScript strict · Zod · `@grpc/grpc-js` | API Gateway |
| Frontend | Next.js 15 · React · D3.js · TypeScript · Tanstack Query · Shadcn | UI |
| Protocol | Protobuf 3 · OTLP wire format | Collector receiver + all gRPC services |
| Storage | ClickHouse (spans) · PostgreSQL (metadata) · Redis (cache + dedup) | Storage Layer, Query Service |
| Messaging | Kafka (`sarama` in Go, `kafkajs` in TS tests) | Collector → Processor pipeline |
| Infra | Kubernetes · K8s Operator (`controller-runtime`) · Terraform · GitHub Actions | Month 6+ |
| Observability | OTel Go SDK (self-instrumentation) · Prometheus · Grafana | All components |

---

## 4. Go Components — Deep Points

### Collector (gRPC OTLP Receiver)
```go
// Implements the OTLP TraceService proto
type collector struct {
    pb.UnimplementedTraceServiceServer
    kafka  sarama.SyncProducer
    buffer *spanBuffer
}

func (c *collector) Export(ctx context.Context, req *pb.ExportTraceServiceRequest) (*pb.ExportTraceServiceResponse, error) {
    spans := validateAndFlatten(req.ResourceSpans)  // validate trace_id format, timestamps
    if err := c.buffer.Add(ctx, spans); err != nil {
        return nil, status.Error(codes.ResourceExhausted, "backpressure")
    }
    return &pb.ExportTraceServiceResponse{}, nil
}
// Batch flush to Kafka every 100ms or 10K spans — whichever comes first
// Partition key = trace_id: all spans of one trace → same partition → ordering guaranteed
```

### Pipeline Processor (Tail-Based Sampling)
```go
func (s *TailSampler) ShouldKeep(spans []Span) bool {
    for _, span := range spans {
        if span.StatusCode == StatusError { return true }  // 100% errors
        if span.DurationUs > 500_000      { return true }  // 100% slow (> 500ms)
    }
    return rand.Float64() < 0.05  // 5% sample of normal traces
}
// ClickHouse bulk insert: batch 10K spans before writing
// Benchmark: single-row insert vs batch → 100x throughput difference in BENCHMARKS.md
```

### ClickHouse Schema
```sql
CREATE TABLE spans (
    trace_id        FixedString(32),
    span_id         FixedString(16),
    parent_span_id  FixedString(16),
    operation_name  LowCardinality(String),
    service_name    LowCardinality(String),
    start_time      DateTime64(6),
    duration_us     UInt64,
    status_code     UInt8,
    attributes      Map(String, String),
    resource        Map(String, String)
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(start_time)
ORDER BY (service_name, start_time, trace_id)
TTL start_time + INTERVAL 30 DAY;
```

---

## 5. TypeScript Components — Deep Points

### API Gateway (Express + gRPC client)
```typescript
// REST → gRPC translation with full TypeScript types
app.get('/api/traces', auth, validate(FindTracesSchema), async (req, res) => {
  const { service, operation, start, end, minDuration } = req.query as z.infer<typeof FindTracesSchema>;

  const traces: Trace[] = [];
  const stream = queryClient.FindTraces({ serviceName: service, startTime: new Date(start), endTime: new Date(end) });

  for await (const trace of stream) {
    traces.push(traceFromProto(trace));
  }

  res.json({ traces, total: traces.length });
});

// OTel Node.js auto-instrumentation — gateway traces visible in OpenTrace itself
```

### Next.js UI — Trace Waterfall (D3.js)
```typescript
// Virtualised rendering — only DOM nodes for visible spans (10K+ span support)
const WaterfallChart = ({ spans, traceStart, totalDuration }: Props) => {
  const rowHeight = 24;
  const [scrollY, setScrollY] = useState(0);
  const visibleStart = Math.floor(scrollY / rowHeight);
  const visibleEnd   = visibleStart + Math.ceil(height / rowHeight);
  const visibleSpans = spans.slice(visibleStart, visibleEnd);

  return (
    <div onScroll={e => setScrollY(e.currentTarget.scrollTop)} style={{ overflowY: 'auto', height }}>
      <div style={{ height: spans.length * rowHeight }}>
        {visibleSpans.map(span => (
          <SpanBar key={span.spanId}
            left={`${((span.startTime - traceStart) / totalDuration) * 100}%`}
            width={`${(span.durationUs / totalDuration / 10) * 100}%`}
            top={span.depth * rowHeight}
            color={serviceColor(span.serviceName)} />
        ))}
      </div>
    </div>
  );
};
```

### TypeScript Auto-Instrumentation SDK
```typescript
// Zero-code-change instrumentation for any Node.js HTTP server
import './sdk/tracing';  // import side effect — wraps http, Express, pg, Redis, Kafka

export function instrument(app: Express): Express {
  return app;  // wrapping handled at module load via monkey-patching
}
// Any app using the official @opentelemetry/sdk-node sends to OpenTrace with:
// OTEL_EXPORTER_OTLP_ENDPOINT=your-collector:4317
```

---

## 6. Self-Instrumentation Demo

OpenTrace instruments all 7 of its own components using the OTel Go SDK pointing at its own Collector. A query request produces a real distributed trace visible in OpenTrace itself:

```
UI request ──→ API Gateway (TS) ──→ Query Service (Go) ──→ ClickHouse
                                                 ↑
                             All spans collected by Collector (Go)
                             Processed by Processor (Go)
                             Stored in ClickHouse
                             Visible in the UI — the system traces itself
```

---

## 7. Benchmarks

| Metric | Target |
|---|---|
| Ingestion throughput | 10M spans/sec |
| ClickHouse query p99 (30-day window) | < 200ms |
| Collector gRPC p99 | < 5ms |
| UI waterfall render (10K spans) | < 100ms (virtualised) |
| Storage cost vs Elasticsearch | 8x cheaper per GB |

---

## 8. Non-Negotiable Rules

- `go test -race ./...` — data races in Collector lose spans silently under load
- `goleak.VerifyNone(t)` — goroutine leaks in span pipeline accumulate over days
- `tsc --noEmit` + `strict: true` in API Gateway and UI
- Outbox pattern for Kafka publish — crash between receive and publish loses spans forever
- `EXPLAIN` on every ClickHouse query — partition pruning verified (`Selected 1/7 parts`)
- 10M spans/sec load test documented in `BENCHMARKS.md` — untested claims are fiction
- OTel compatibility verified — official `go.opentelemetry.io/otel` SDK sends to OpenTrace with zero config changes
