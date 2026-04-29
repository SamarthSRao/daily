# Backend Engineering — Section 8: Observability, Testing & GenAI
### 500 Questions | Prometheus · Loki · Tempo · Grafana · Testing · LLMs · RAG · Agents · AI-Native
> Mapped to Backend 2026 Roadmap Stages 10, 12–15 | Infraspec Target
> Tagged: [CONCEPT] [CODE] [DEBUG] [TRADEOFF] [DESIGN] [APPLY]
> Levels: {L1} must know · {L2} mid/senior · {L3} staff/specialist

---

# PART A — Metrics & Prometheus (Q1–Q80)

1. `[CONCEPT]` `{L1}` What is Prometheus? What is its pull-based scrape model? How does it differ from push-based systems like Graphite?
2. `[CONCEPT]` `{L1}` What are the four Prometheus metric types: Counter, Gauge, Histogram, Summary? Give an OpenTrace example of each.
3. `[CONCEPT]` `{L1}` What is a Counter? Why does it only go up? What does `rate()` do to a counter in PromQL?
4. `[CONCEPT]` `{L1}` What is a Gauge? Give three OpenTrace examples: goroutine count, Kafka consumer lag, active WebSocket connections.
5. `[CONCEPT]` `{L1}` What is a Histogram? What are buckets? What is `histogram_quantile(0.99, ...)`?
6. `[CONCEPT]` `{L2}` What is the difference between a Histogram and a Summary? Why does Prometheus recommend Histograms for distributed systems?
7. `[CODE]` `{L1}` Register Prometheus Counter and Histogram for OpenTrace Collector in Go using `promauto`:
    ```go
    spansTotal = promauto.NewCounterVec(prometheus.CounterOpts{
        Name: "openTrace_spans_received_total",
        Help: "Total spans received",
    }, []string{"service", "status"})
    
    processDuration = promauto.NewHistogramVec(prometheus.HistogramOpts{
        Name:    "openTrace_span_processing_seconds",
        Buckets: prometheus.ExponentialBuckets(0.0001, 2, 15),
    }, []string{"stage"})
    ```
8. `[CODE]` `{L1}` Expose `/metrics` endpoint in OpenTrace: `mux.Handle("/metrics", promhttp.Handler())`.
9. `[CONCEPT]` `{L1}` What is label cardinality in Prometheus? Why is using `user_id` as a label dangerous?
10. `[DEBUG]` `{L2}` OpenTrace's Prometheus uses 10GB RAM. The cardinality explorer shows `http_request_duration_seconds` with 50K label combinations. What is the fix?
11. `[CODE]` `{L1}` Write PromQL for OpenTrace's 5-minute span ingestion rate: `rate(openTrace_spans_received_total[5m])`.
12. `[CODE]` `{L2}` Write PromQL for OpenTrace's p99 span processing latency:
    `histogram_quantile(0.99, rate(openTrace_span_processing_seconds_bucket[5m]))`.
13. `[CODE]` `{L2}` Write PromQL for OpenTrace's error rate: `rate(errors[5m]) / rate(total[5m])`.
14. `[CONCEPT]` `{L2}` What is the RED method? Write the three PromQL queries for OpenTrace Collector: Rate, Errors, Duration.
15. `[CONCEPT]` `{L2}` What is the USE method? Write PromQL for OpenTrace's Kafka producer: Utilization, Saturation, Errors.
16. `[CODE]` `{L2}` Aggregate OpenTrace spans by service: `sum by (service) (rate(openTrace_spans_received_total[5m]))`.
17. `[CODE]` `{L2}` Find top 5 services by span rate: `topk(5, sum by (service) (rate(openTrace_spans_received_total[5m])))`.
18. `[CONCEPT]` `{L2}` What is `rate()` vs `irate()` vs `increase()` in PromQL? When does OpenTrace use each?
19. `[CODE]` `{L2}` Alert when OpenTrace Collector stops reporting: `absent(up{job="openTrace-collector"})`.
20. `[CODE]` `{L2}` Predict OpenTrace ClickHouse disk full: `predict_linear(node_filesystem_free_bytes[24h], 7*24*3600) < 0`.
21. `[CONCEPT]` `{L2}` What is a recording rule in Prometheus? How does OpenTrace use them to pre-compute expensive per-service error rates?
22. `[CODE]` `{L2}` Write a recording rule for OpenTrace: `record: job:openTrace_error_rate:ratio5m expr: rate(errors[5m]) / rate(total[5m])`.
23. `[CONCEPT]` `{L2}` What is a Prometheus scrape config? What is `scrape_interval`? Write the Kubernetes service discovery config for OpenTrace.
24. `[CONCEPT]` `{L2}` What is remote write? How does OpenTrace send metrics to Grafana Cloud (Mimir)?
25. `[CODE]` `{L2}` Configure Prometheus remote write for OpenTrace: `url: https://prometheus-prod.grafana.net/api/prom/push` with basic auth.
26. `[CONCEPT]` `{L2}` What is Thanos? What is Mimir? How does OpenTrace use either for long-term metrics retention?
27. `[CODE]` `{L2}` Write ServiceMonitor for OpenTrace Collector (Prometheus Operator): selector by `app: openTrace-collector`, port `metrics`, interval `15s`.
28. `[CODE]` `{L2}` Write PrometheusRule CRD for OpenTrace's span ingestion down alert: `expr: rate(openTrace_spans_received_total[5m]) < 100 for: 5m`.
29. `[CONCEPT]` `{L2}` What is Alertmanager? What is a route? What is inhibition? How does OpenTrace route P1 alerts to PagerDuty?
30. `[CODE]` `{L2}` Write Alertmanager routing: `severity=critical` → PagerDuty, `severity=warning` → Slack. Inhibit warning when critical fires.
31. `[CONCEPT]` `{L2}` What is an SLO? What is an error budget? How does OpenTrace calculate its monthly error budget from a 99.9% SLO?
32. `[CODE]` `{L2}` Write multi-window burn rate alert for OpenTrace (99.9% SLO): fire when error rate × time > 5% of monthly budget in 1h AND 5m.
33. `[CODE]` `{L2}` Write PromQL for pod restart rate in OpenTrace: `increase(kube_pod_container_status_restarts_total{namespace="openTrace"}[1h]) > 3`.
34. `[CODE]` `{L2}` Write PromQL for host disk usage alert: `(node_filesystem_size_bytes - node_filesystem_free_bytes) / node_filesystem_size_bytes > 0.8`.
35. `[CONCEPT]` `{L2}` What is an exemplar in Prometheus? How does OpenTrace link a high-latency metric sample to a specific `trace_id`?
36. `[CODE]` `{L2}` Add exemplar to OpenTrace's latency observation: `histogram.ObserveWithExemplar(duration, prometheus.Labels{"trace_id": traceID})`.
37. `[CONCEPT]` `{L2}` What is a native histogram in Prometheus 2.40+? How does it improve on classic histograms for dynamic bucket selection?
38. `[CONCEPT]` `{L2}` What is `metric_relabel_configs`? How does OpenTrace drop high-cardinality `user_id` labels before Prometheus ingestion?
39. `[CONCEPT]` `{L2}` What is `kube-state-metrics`? What metrics does it expose for OpenTrace: pod restarts, deployment replicas, PVC capacity?
40. `[CODE]` `{L2}` Export Go runtime metrics from OpenTrace automatically: `import _ "github.com/prometheus/client_golang/prometheus/collectors"` — registers GC, goroutine, memory metrics.
41. `[CONCEPT]` `{L2}` What is `GaugeFunc` in Prometheus Go client? Write one for OpenTrace's `runtime.NumGoroutine()`.
42. `[CONCEPT]` `{L2}` What is label-replace in PromQL? How does OpenTrace normalize service name labels that differ across clusters?
43. `[CODE]` `{L2}` Compare current vs week-ago span rate in OpenTrace: `rate(openTrace_spans_received_total[5m]) / rate(openTrace_spans_received_total[5m] offset 1w)`.
44. `[CONCEPT]` `{L2}` What is `subquery` in PromQL? How does OpenTrace calculate the max error rate over the last 24 hours?
45. `[CODE]` `{L2}` Calculate 24-hour max error rate for OpenTrace: `max_over_time(rate(openTrace_errors_total[5m])[24h:5m])`.
46. `[CONCEPT]` `{L2}` What is the difference between `sum(rate())` and `rate(sum())`? Which is correct for multi-instance error rate?
47. `[CONCEPT]` `{L2}` What is Prometheus Agent Mode? When does OpenTrace use it to send metrics without local storage?
48. `[CONCEPT]` `{L3}` What is VictoriaMetrics? How does it compare to Prometheus for OpenTrace's cardinality requirements at 10M spans/sec scale?
49. `[CODE]` `{L2}` Secure OpenTrace's `/metrics` endpoint: serve on port 9090 bound to `127.0.0.1` only. Use Kubernetes Service to expose to Prometheus within the cluster.
50. `[APPLY]` `{L2}` Design OpenTrace's complete metrics strategy: 15 essential metrics, their types, labels, PromQL queries, recording rules, and alert thresholds.
51. `[CODE]` `{L2}` Write PromQL for Kafka consumer lag per partition: `kafka_consumer_group_lag{group="openTrace-processor", topic="spans"}`.
52. `[CODE]` `{L2}` Write PromQL for OpenTrace's goroutine count alert: `go_goroutines{job="openTrace-collector"} > 50000 for: 5m`.
53. `[CODE]` `{L2}` Write PromQL for ClickHouse insert batch size p99: `histogram_quantile(0.99, rate(openTrace_clickhouse_batch_size_bucket[5m]))`.
54. `[CODE]` `{L2}` Write PromQL for OpenTrace Redis hit rate: `rate(redis_hits_total[5m]) / (rate(redis_hits_total[5m]) + rate(redis_misses_total[5m]))`.
55. `[CODE]` `{L2}` Alert when OpenTrace's Redis eviction rate is high: `rate(redis_evicted_keys_total[5m]) > 100`.
56. `[CONCEPT]` `{L2}` What is `Infra-as-code` for Prometheus? How does OpenTrace use the `prometheus-community` Helm chart with custom values?
57. `[CODE]` `{L2}` Write Helm values for OpenTrace's Prometheus: retention 15d, storage 50Gi, scrape interval 15s, remote write to Grafana Cloud.
58. `[CONCEPT]` `{L2}` What is `stale marker` in Prometheus? What happens when OpenTrace Collector stops scraping for 5 minutes?
59. `[CONCEPT]` `{L2}` What is PromQL `bool` modifier? How does OpenTrace produce a binary 0/1 metric from a threshold comparison?
60. `[CONCEPT]` `{L2}` What is `vector matching` in PromQL (`on()`, `ignoring()`, `group_left()`)? When does OpenTrace need it for multi-label join queries?
61. `[CODE]` `{L2}` Write OpenTrace's SLO burn rate Grafana panel query: `1 - (sum(rate(errors[30d])) / sum(rate(total[30d])))`.
62. `[CODE]` `{L2}` Write PromQL for OpenTrace's gRPC error rate by method: `sum by (grpc_method) (rate(grpc_server_handled_total{grpc_code!="OK"}[5m]))`.
63. `[CONCEPT]` `{L2}` What is Infracost for monitoring Prometheus cost? At what point does OpenTrace need to switch from a single Prometheus to Mimir/Thanos?
64. `[CONCEPT]` `{L2}` What is `prometheus_tsdb_head_series`? What is a healthy cardinality limit for OpenTrace (< 1M active series)?
65. `[CODE]` `{L2}` Alert on OpenTrace's Prometheus cardinality explosion: `prometheus_tsdb_head_series > 1000000 for: 10m labels: {severity: warning}`.
66. `[CONCEPT]` `{L2}` What is `ALERTS_FOR_STATE` metric in Prometheus? What is the difference from `ALERTS`?
67. `[CODE]` `{L2}` Write a Grafana annotation query to show OpenTrace deployments: query `ALERTS{alertname="Deployment", service="openTrace-collector"}`.
68. `[CONCEPT]` `{L2}` What is `scrape_duration_seconds` and `up` metric? How does OpenTrace monitor whether its own metrics scrape is healthy?
69. `[CODE]` `{L2}` Alert when OpenTrace metrics scrape takes too long: `scrape_duration_seconds{job="openTrace-collector"} > 10`.
70. `[APPLY]` `{L2}` OpenTrace on-call exercise: PagerDuty fires "SpanIngestionDown". Walk through: check `up` metric, check Collector logs, check Kafka lag, check network policy, check ClickHouse health. What dashboard panels do you look at first?
71. `[CODE]` `{L2}` Write PromQL for OpenTrace's per-tenant span volume: `sum by (tenant_id) (rate(openTrace_spans_received_total[5m]))`.
72. `[CODE]` `{L2}` Write PromQL for OpenTrace's active WebSocket connections: `openTrace_websocket_connections_active{service="openTrace-query"}`.
73. `[CONCEPT]` `{L2}` What is Prometheus `exemplars` storage? How do you enable and query exemplars in Prometheus 2.29+?
74. `[CODE]` `{L2}` Enable exemplars in OpenTrace's Prometheus config: `exemplars: { max_exemplars: 100000 }`. Query: `{__name__="openTrace_span_processing_seconds_bucket", trace_id="abc"}`.
75. `[CONCEPT]` `{L2}` What is the difference between `up{job="x"}` and `absent(up{job="x"})`? When does OpenTrace use each for alerting?
76. `[CONCEPT]` `{L2}` What is `staleness handling` in Prometheus? What is the 5-minute staleness window?
77. `[CODE]` `{L2}` Write OpenTrace's Prometheus alert for high GC pause: `histogram_quantile(0.99, rate(go_gc_duration_seconds_bucket{job="openTrace-collector"}[5m])) > 0.01`.
78. `[CONCEPT]` `{L3}` What is Prometheus `federation`? How does OpenTrace aggregate metrics from 3 regional Prometheus instances into one global view?
79. `[CONCEPT]` `{L2}` What is `promtool check rules`? How does OpenTrace validate alerting rules in CI before deploying?
80. `[CODE]` `{L2}` Add Prometheus rule validation to OpenTrace CI: `promtool check rules ./alerts/*.yaml`. Fail CI on syntax errors or invalid PromQL.

---

# PART B — Logging, Tracing & Grafana (Q81–Q160)

81. `[CONCEPT]` `{L1}` What is structured logging? Why is JSON logging better than plain text for OpenTrace?
82. `[CODE]` `{L1}` Configure `slog` for OpenTrace with JSON output, base fields `service`, `env`:
    ```go
    logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
    slog.SetDefault(logger.With("service", "openTrace-collector", "env", "production"))
    ```
83. `[CODE]` `{L1}` Add `trace_id`, `tenant_id`, `request_id` to OpenTrace's context logger in middleware, propagate to all downstream log calls.
84. `[CONCEPT]` `{L1}` What is Loki? How does it differ from Elasticsearch — label-based indexing vs full-text inverted index?
85. `[CONCEPT]` `{L1}` What is LogQL? Write a query to find OpenTrace Collector ERROR logs in the last 1 hour.
86. `[CODE]` `{L1}` Write LogQL for OpenTrace errors: `{namespace="openTrace",app="openTrace-collector"} |= "level=ERROR" | json | level = "ERROR"`.
87. `[CODE]` `{L2}` Write LogQL to count OpenTrace errors by service per minute: `sum by (service) (rate({app="openTrace-collector"} |= "error" | json [1m]))`.
88. `[CONCEPT]` `{L2}` What is Loki label cardinality? Why can't OpenTrace use `trace_id` as a Loki stream label?
89. `[CODE]` `{L2}` Configure Promtail pipeline for OpenTrace: parse JSON logs, extract `level` and `service` as labels, parse timestamp as RFC3339Nano.
90. `[CONCEPT]` `{L2}` What is log-to-trace correlation? How does OpenTrace link a Loki log line to a Grafana Tempo trace via `trace_id`?
91. `[CODE]` `{L2}` Configure Grafana derived field for OpenTrace: parse `trace_id` from log, create link to Tempo: `https://tempo/trace/${__value.raw}`.
92. `[CODE]` `{L2}` Write LogQL to find all logs for a specific OpenTrace trace: `{namespace="openTrace"} | json | trace_id = "abc123"`.
93. `[CONCEPT]` `{L2}` What is Loki retention? Configure 30-day log retention for OpenTrace with 14-day retention for debug logs.
94. `[CODE]` `{L2}` Implement log sampling in OpenTrace: log only 1% of DEBUG-level span ingestion events to reduce Loki cost:
    ```go
    if level == slog.LevelDebug && rand.Float64() > 0.01 { return }
    ```
95. `[CONCEPT]` `{L2}` What is a Loki ruler? Write a Loki alert rule that fires when "panic" appears in OpenTrace Collector logs.
96. `[CODE]` `{L2}` Write Loki panic alert: `count_over_time({app="openTrace-collector"} |= "panic" [5m]) > 0`.
97. `[CONCEPT]` `{L2}` What is `slog.LogAttrs` vs `slog.Info`? When does OpenTrace use `LogAttrs` in the hot span path for zero allocations?
98. `[CODE]` `{L2}` Zero-allocation logging in OpenTrace hot path:
    ```go
    logger.LogAttrs(ctx, slog.LevelInfo, "span processed",
        slog.String("trace_id", traceID),
        slog.Int64("duration_ns", durationNs),
    )
    ```
99. `[CONCEPT]` `{L2}` What is the OTel log signal? How does OpenTrace bridge OTel logs to Loki via the OTel Collector?
100. `[CONCEPT]` `{L2}` What is Loki multi-tenancy? How does OpenTrace isolate logs per tenant using `X-Scope-OrgID`?
101. `[CONCEPT]` `{L1}` What is distributed tracing? What is a trace? What is a span? What is the W3C `traceparent` header format?
102. `[CODE]` `{L1}` Instrument an HTTP handler in OpenTrace with OTel:
    ```go
    ctx, span := tracer.Start(r.Context(), "SpanHandler",
        trace.WithAttributes(semconv.HTTPMethodKey.String(r.Method)))
    defer span.End()
    ```
103. `[CODE]` `{L1}` Set error status on OpenTrace span: `span.SetStatus(codes.Error, err.Error()); span.RecordError(err)`.
104. `[CODE]` `{L2}` Propagate trace context from OpenTrace's HTTP handler to a downstream gRPC call: `otel.GetTextMapPropagator().Inject(ctx, grpcMetadataCarrier)`.
105. `[CODE]` `{L2}` Initialize OTel TracerProvider for OpenTrace: OTLP/gRPC exporter, batch processor, TraceIDRatioBased(0.1) sampler, service.name resource.
106. `[CONCEPT]` `{L2}` What is head-based sampling vs tail-based sampling? What are the tradeoffs for OpenTrace?
107. `[CODE]` `{L2}` Propagate trace context through Kafka message headers in OpenTrace: inject in producer, extract in consumer.
108. `[CONCEPT]` `{L2}` What is Grafana Tempo? What is TraceQL? Write a query to find OpenTrace traces with duration > 100ms.
109. `[CODE]` `{L2}` Write TraceQL queries for OpenTrace: `{ .service.name = "openTrace-collector" && duration > 100ms }` and `{ status = error }`.
110. `[CONCEPT]` `{L2}` What is the OTel `Baggage` API? How does OpenTrace propagate `tenant_id` through the entire distributed call chain?
111. `[CODE]` `{L2}` Inject tenant_id as OTel baggage in OpenTrace gateway: `baggage.NewKeyValueProperty("tenant.id", tenantID)`. Extract in downstream services.
112. `[CONCEPT]` `{L2}` What is `force_flush` in OTel SDK? How does OpenTrace ensure all spans are exported before graceful shutdown?
113. `[CODE]` `{L2}` Write OTel Collector pipeline config for OpenTrace: receive OTLP, add resource attributes (environment), batch process, export to Tempo AND OpenTrace.
114. `[CONCEPT]` `{L2}` What is continuous profiling? How does Grafana Pyroscope link flame graphs to specific trace IDs in OpenTrace?
115. `[CONCEPT]` `{L1}` What is Grafana? What is a panel? What is `$__rate_interval`? Why does OpenTrace use it instead of hardcoded `[5m]`?
116. `[CODE]` `{L1}` Create the 10 essential Grafana panels for OpenTrace Collector: spans/sec, error rate, p99 latency, Kafka lag, goroutine count, GC pause, heap used, CPU, active connections, uptime.
117. `[CODE]` `{L2}` Create a Grafana template variable for OpenTrace service filter: `label_values(openTrace_spans_received_total, service)`.
118. `[CONCEPT]` `{L2}` What is Grafana provisioning? How does OpenTrace store dashboards as code in Git and auto-import on startup?
119. `[CODE]` `{L2}` Write a Grafana heatmap panel query for OpenTrace span latency distribution using histogram buckets.
120. `[CONCEPT]` `{L2}` What is Grafana `exemplar` linking? How does OpenTrace show the trace behind a latency spike directly from a metric spike?
121. `[CODE]` `{L2}` Create Grafana deployment annotation for OpenTrace: trigger from GitHub Actions, mark deploy time on all dashboards.
122. `[CONCEPT]` `{L2}` What is Grafana LGTM stack (Loki + Grafana + Tempo + Mimir)? How does OpenTrace deploy it as a unified observability platform?
123. `[CODE]` `{L2}` Configure Grafana Correlations for OpenTrace: metric spike → Loki logs → Tempo trace → seamless navigation in one click.
124. `[CONCEPT]` `{L2}` What is `grafonnet`? How does OpenTrace generate Grafana dashboards as code using Jsonnet?
125. `[CODE]` `{L2}` Write an Alertmanager notification template for OpenTrace: include alert name, service, current value, runbook URL, Grafana dashboard link.
126. `[CODE]` `{L2}` Write Grafana alert for OpenTrace span ingestion down: query `rate(openTrace_spans_received_total[5m]) < 100`, contact point PagerDuty.
127. `[CONCEPT]` `{L2}` What is the `Grafana SLO plugin`? How does OpenTrace create error budget burn rate panels?
128. `[CODE]` `{L2}` Create a Grafana stat panel for OpenTrace remaining error budget this month with color thresholds: green > 50%, yellow > 10%, red < 10%.
129. `[CONCEPT]` `{L2}` What is `grafana-dashboard-operator`? How does OpenTrace manage Grafana dashboards via Kubernetes CRDs?
130. `[CONCEPT]` `{L2}` What is Grafana OnCall? How does OpenTrace set up on-call schedules and escalation policies?
131. `[APPLY]` `{L2}` Design OpenTrace's complete observability stack: 5 Grafana dashboards, Prometheus recording rules, Loki log parsing, Tempo trace search, Pyroscope profiling, Alertmanager routing.
132. `[CODE]` `{L2}` Write the complete Grafana datasource config for OpenTrace: Prometheus (metrics), Loki (logs), Tempo (traces), exemplar linking between all three.
133. `[CONCEPT]` `{L2}` What is the four golden signals (Google SRE)? Latency, traffic, errors, saturation. Map each to an OpenTrace Prometheus metric.
134. `[CODE]` `{L2}` Write Grafana dashboard row for OpenTrace "Four Golden Signals": 4 panels in one row, each using `$service` template variable.
135. `[CONCEPT]` `{L2}` What is `Grafana Managed Alerts` vs Prometheus alerting rules? When does OpenTrace use each?
136. `[CODE]` `{L2}` Configure Grafana contact points for OpenTrace: PagerDuty (P1), Slack `#openTrace-alerts` (P2), email digest (P3). Set routing based on `severity` label.
137. `[CONCEPT]` `{L2}` What is alert silencing vs inhibition in Alertmanager? When does OpenTrace use each during maintenance windows?
138. `[CODE]` `{L2}` Create a 2-hour maintenance silence for OpenTrace ClickHouse migration: `amtool silence add --alertname="ClickHouseDiskHigh" --duration=2h --comment="migration"`.
139. `[CONCEPT]` `{L2}` What is `promtail` vs Fluent Bit vs OpenTelemetry Collector for log collection? When does OpenTrace use each?
140. `[CONCEPT]` `{L2}` What is structured log indexing in Loki? How does OpenTrace's JSON log format enable efficient LogQL filtering without full-text indexing?
141. `[CODE]` `{L2}` Write LogQL metric query for OpenTrace's per-service error rate: `sum by (service) (rate({namespace="openTrace"} | json | level="ERROR" [5m]))`.
142. `[CODE]` `{L2}` Write LogQL to find OpenTrace spans with duration > 1s: `{app="openTrace-processor"} | json | duration_ms > 1000 | line_format "{{.trace_id}} {{.duration_ms}}ms"`.
143. `[CONCEPT]` `{L2}` What is Tempo TraceQL metric queries? How does OpenTrace use `{ } | rate()` to get metrics from trace data without Prometheus?
144. `[CODE]` `{L2}` Write Tempo metric query for OpenTrace error rate: `{ .service.name = "openTrace-collector" } | rate() by (status)`.
145. `[CONCEPT]` `{L2}` What is `zap` vs `slog` vs `zerolog` in Go? Compare allocations per log call. Why does OpenTrace choose `slog` (standard library)?
146. `[CODE]` `{L2}` Add `slog` context handler to OpenTrace that automatically extracts `trace_id`, `request_id` from context and adds to every log line.
147. `[CONCEPT]` `{L2}` What is `OTEL_EXPORTER_OTLP_ENDPOINT`? How does OpenTrace configure the OTel SDK via environment variables for different environments?
148. `[CODE]` `{L2}` Configure OTel SDK via env vars for OpenTrace: `OTEL_SERVICE_NAME=openTrace-collector`, `OTEL_TRACES_SAMPLER=parentbased_traceidratio`, `OTEL_TRACES_SAMPLER_ARG=0.1`.
149. `[CONCEPT]` `{L2}` What is `auto-instrumentation` in OTel Go? What libraries does `go-contrib` auto-instrument: `net/http`, `database/sql`, `grpc`, `redis`, `kafka`?
150. `[APPLY]` `{L2}` Design the complete three-pillar correlation for OpenTrace: given a PagerDuty alert, navigate from Prometheus metric → Loki logs with same time window → Tempo trace that caused the error → Pyroscope flame graph for the slow function.

---

# PART C — Testing Strategies (Q161–Q260)

161. `[CONCEPT]` `{L1}` What is the testing pyramid: unit tests (70%), integration tests (20%), E2E tests (10%)? What percentage does OpenTrace target?
162. `[CONCEPT]` `{L1}` What is table-driven testing in Go? What is the standard structure? Why does OpenTrace use it for all validators?
163. `[CODE]` `{L1}` Write a table-driven test for OpenTrace's trace ID validator with 5 cases: valid UUID, invalid format, empty string, too short, too long.
164. `[CODE]` `{L1}` Use `require.NoError` (fatal) and `assert.Equal` (non-fatal) correctly in OpenTrace span store tests.
165. `[CONCEPT]` `{L2}` What is `t.Parallel()`, `t.Cleanup()`, `t.Helper()`, `t.TempDir()`? How does OpenTrace use each?
166. `[CODE]` `{L2}` Write an OpenTrace test using all four: parallel execution, cleanup of test database rows, helper function for span assertions, temp directory for WAL files.
167. `[CONCEPT]` `{L2}` What is `testing.Short()`? How does OpenTrace skip integration tests when `-short` is passed in CI fast-mode?
168. `[CONCEPT]` `{L2}` What is a test double? What is the difference between mock (behavior verification), stub (canned responses), spy (call recording), and fake (working implementation)?
169. `[CODE]` `{L2}` Write a fake `SpanStore` for OpenTrace unit tests: in-memory map, satisfies `SpanStorer` interface, thread-safe with `sync.Mutex`.
170. `[CODE]` `{L2}` Write a testify mock for OpenTrace's Kafka producer that records produced messages and verifies them in assertions.
171. `[CODE]` `{L2}` Test OpenTrace's HTTP span ingestion handler using `httptest.NewRecorder` and `httptest.NewRequest` without a real server.
172. `[CODE]` `{L2}` Test OpenTrace's gRPC handler using `google.golang.org/grpc/test/bufconn` for in-process gRPC without network overhead.
173. `[CONCEPT]` `{L2}` What is `goleak.VerifyNone`? What goroutine leaks does it catch that `go test -race` does not?
174. `[CODE]` `{L2}` Add goleak to OpenTrace's `TestMain`: `goleak.VerifyTestMain(m, goleak.IgnoreTopFunction("internal/poll.runtime_pollWait"))`.
175. `[CONCEPT]` `{L2}` What is `go test -race`? What data races does the race detector catch? How does OpenTrace run it in CI?
176. `[CODE]` `{L2}` Run OpenTrace tests with full quality flags: `go test -race -count=1 -timeout=60s -shuffle=on ./...`.
177. `[CONCEPT]` `{L2}` What is golden file testing? How does OpenTrace use `testdata/*.golden` for snapshot testing of JSON API responses?
178. `[CODE]` `{L2}` Implement golden file test for OpenTrace's trace serialization: compare against `testdata/trace_response.golden`, update with `-update` flag.
179. `[CONCEPT]` `{L2}` What is `go test -fuzz`? Write a fuzz test for OpenTrace's OTLP JSON parser that must not panic.
180. `[CODE]` `{L2}` Fuzz test for OpenTrace: `func FuzzParseSpan(f *testing.F) { f.Fuzz(func(t *testing.T, data []byte) { parseSpanJSON(data) }) }`.
181. `[CONCEPT]` `{L2}` What is testcontainers-go? What containers does OpenTrace use: ClickHouse, PostgreSQL, Kafka (Redpanda), Redis?
182. `[CODE]` `{L2}` Start a ClickHouse container for OpenTrace integration tests: use `testcontainers.WithWaitStrategy(wait.ForHTTP("/ping"))`, extract DSN, create span store.
183. `[CODE]` `{L2}` Write OpenTrace integration test: start ClickHouse, insert 100 spans, query by trace_id, assert correct results.
184. `[CODE]` `{L2}` Use `TestMain` to start containers once for all tests in OpenTrace's `store` package. Share the span store across tests.
185. `[CODE]` `{L2}` Write OpenTrace webhook delivery test using `httptest.NewServer`: capture received webhooks via a channel, assert body and HMAC signature.
186. `[CONCEPT]` `{L2}` What is Wiremock / `httpmock` for mocking HTTP client calls? When does OpenTrace use it for testing external API integrations?
187. `[CONCEPT]` `{L2}` What is `go test -coverprofile`? What coverage target does OpenTrace set (80%)?
188. `[CODE]` `{L2}` Run OpenTrace coverage: `go test -coverprofile=cov.out ./... && go tool cover -func=cov.out | tail -1`. Fail CI if total < 80%.
189. `[CODE]` `{L2}` Write benchmark for OpenTrace's Protobuf unmarshal: `b.ReportAllocs()`, `b.SetBytes(len(data))`, iterate `b.N` times. Target < 1000 ns/op, 0 allocs/op.
190. `[CONCEPT]` `{L2}` What is `benchstat`? How does OpenTrace compare benchmark results between two branches to detect performance regressions?
191. `[CODE]` `{L2}` Add benchmark regression check to OpenTrace CI: run on both base and PR, compare with `benchstat base.txt pr.txt`, fail if any metric degrades > 5%.
192. `[CONCEPT]` `{L2}` What is `gotestsum`? How does OpenTrace format test output for GitHub Actions PR annotations with JUnit XML?
193. `[CODE]` `{L2}` Run OpenTrace tests with gotestsum: `gotestsum --format github-actions --junitfile results.xml -- -race -count=1 ./...`.
194. `[CONCEPT]` `{L2}` What is Playwright? What does OpenTrace test E2E: trace list search, span detail view, live tail WebSocket, AI diagnosis UI?
195. `[CODE]` `{L2}` Write a Playwright test for OpenTrace's trace search: fill service filter, press Enter, verify trace list items appear with correct service badge.
196. `[CODE]` `{L2}` Write a Playwright test for OpenTrace's live tail: open trace page, submit test span via API, assert span row appears within 5 seconds.
197. `[CONCEPT]` `{L2}` What is MSW (Mock Service Worker)? How does DungBeetle UI mock API calls in React tests without modifying component code?
198. `[CODE]` `{L2}` Set up MSW for DungBeetle: intercept `GET /api/jobs` and `POST /api/jobs`, return mock data in tests.
199. `[CONCEPT]` `{L2}` What is Vitest vs Jest for TypeScript? What does DungBeetle use and why?
200. `[CODE]` `{L2}` Write a Vitest test for DungBeetle's job status component: render with `completed` status, assert green badge and "Completed" text.
201. `[CODE]` `{L2}` Write a Vitest integration test for DungBeetle using testcontainers: start PostgreSQL, run job worker, assert job status changes to `completed`.
202. `[CONCEPT]` `{L2}` What is k6 for load testing? Write a k6 test for OpenTrace that asserts p99 < 10ms at 100 VUs for 5 minutes.
203. `[CODE]` `{L2}` Write k6 scenarios for OpenTrace: ramp-up (0→100 VUs over 2 min), sustained (100 VUs for 5 min), spike (0→500→100 VUs over 1 min).
204. `[CONCEPT]` `{L2}` What is chaos testing? Write a Chaos Toolkit experiment for OpenTrace: kill one Collector pod, verify recovery within 30 seconds.
205. `[CONCEPT]` `{L2}` What is contract testing with Pact? How does OpenTrace test the SDK-to-Collector API contract without a real Collector?
206. `[CODE]` `{L2}` Write a Pact consumer test for OpenTrace's Go SDK: define the OTLP export interaction, verify contract against provider.
207. `[CONCEPT]` `{L2}` What is tracetest (trace-based testing)? How does OpenTrace verify the entire distributed pipeline by asserting on generated traces?
208. `[CODE]` `{L2}` Write a tracetest spec for OpenTrace: send a span, assert the resulting trace has spans from Collector, Kafka consumer, and ClickHouse writer components.
209. `[CONCEPT]` `{L2}` What is accessibility testing with `axe-core`? How does OpenTrace UI ensure WCAG 2.1 compliance in Playwright tests?
210. `[CODE]` `{L2}` Add accessibility check to OpenTrace Playwright tests: `const results = await new AxeBuilder({page}).analyze(); expect(results.violations).toEqual([])`.
211. `[CONCEPT]` `{L2}` What is Storybook for component-level visual testing? What does OpenTrace UI document in Storybook stories?
212. `[CODE]` `{L2}` Write Storybook stories for OpenTrace's `SpanRow` component: default, error state, high latency, currently selected.
213. `[CONCEPT]` `{L2}` What is mutation testing? What is `gremlins` for Go? How does it measure OpenTrace's test suite quality?
214. `[CODE]` `{L2}` Write a property-based test for OpenTrace's cursor encoding: encode + decode roundtrip must be identity for any valid trace_id + timestamp.
215. `[CONCEPT]` `{L2}` What is database migration testing? How does OpenTrace verify every migration can be applied AND rolled back cleanly?
216. `[CODE]` `{L2}` Test OpenTrace migrations: apply all up migrations to a fresh test DB, run smoke tests, run all down migrations, assert empty schema.
217. `[CONCEPT]` `{L2}` What is `go build -tags integration`? How does OpenTrace tag integration tests separately from unit tests?
218. `[CODE]` `{L2}` Tag OpenTrace integration tests: `//go:build integration` on test files. Run unit: `go test ./...`, integration: `go test -tags=integration ./...`.
219. `[CONCEPT]` `{L2}` What is visual regression testing with Chromatic? How does OpenTrace UI detect unintended UI changes in CI?
220. `[APPLY]` `{L2}` Design OpenTrace's complete testing strategy: unit (goleak, race detector, 80% coverage), integration (testcontainers), E2E (Playwright), load (k6), chaos (Chaos Toolkit), contract (Pact), visual (Chromatic). State the CI execution order.
221. `[CODE]` `{L2}` Write OpenTrace's test data generator: `GenerateSpan(overrides...)` with sensible defaults, support functional options for customization.
222. `[CODE]` `{L2}` Add `go test -shuffle=on` to OpenTrace CI to detect order-dependent tests: `go test -shuffle=on -count=5 ./...`.
223. `[CONCEPT]` `{L2}` What is `go-vcr` for recording HTTP interactions? When does OpenTrace use cassette recording for deterministic API client tests?
224. `[CODE]` `{L2}` Write OpenTrace's `TestMain` that sets up testcontainers, seeds test data, runs all tests, and tears down containers.
225. `[CONCEPT]` `{L2}` What is Playwright's `test.beforeAll` vs `test.beforeEach`? How does OpenTrace E2E suite seed traces once and share across multiple page tests?
226. `[CODE]` `{L2}` Write a k6 threshold configuration for OpenTrace: `http_req_duration{p(99)} < 10`, `http_req_failed < 0.001`, `checks > 0.999`. Fail CI if any threshold is violated.
227. `[CONCEPT]` `{L2}` What is `gotestfmt`? How does OpenTrace colorize and format Go test output for developer terminals?
228. `[CODE]` `{L2}` Configure Vitest coverage for DungBeetle: `provider: 'v8'`, thresholds `lines: 80`, `functions: 80`, `branches: 75`. Fail CI if under threshold.
229. `[CONCEPT]` `{L2}` What is `testing.T.Run` for subtests? How does OpenTrace organize complex handler tests into named subtests?
230. `[CODE]` `{L2}` Write OpenTrace handler test with subtests: `t.Run("valid span", ...)`, `t.Run("missing auth", ...)`, `t.Run("oversized batch", ...)`, `t.Run("rate limited", ...)`.
231. `[CONCEPT]` `{L2}` What is `go test -list`? How does OpenTrace list all available test names for documentation purposes?
232. `[CODE]` `{L2}` Write a DungBeetle Playwright test for the complete job lifecycle: submit job → see pending → wait for running → verify completed with result.
233. `[CONCEPT]` `{L2}` What is `httptest.NewServer` vs `httptest.NewRecorder`? When does OpenTrace use each?
234. `[CODE]` `{L2}` Test OpenTrace's ClickHouse batch inserter: use testcontainers ClickHouse, insert 10K spans in one batch, verify all rows via SELECT COUNT.
235. `[CONCEPT]` `{L2}` What is `b.RunParallel` in Go benchmarks? How does OpenTrace measure concurrent span processing throughput?
236. `[CODE]` `{L2}` Write a parallel benchmark for OpenTrace's span processor: `b.RunParallel(func(pb *testing.PB) { for pb.Next() { processSpan(span) } })`.
237. `[CONCEPT]` `{L2}` What is `go test -timeout`? Why does OpenTrace set a strict 60-second timeout to catch infinite loops and deadlocks in tests?
238. `[CODE]` `{L2}` Write OpenTrace's Makefile test target with all quality flags: `go test -race -count=1 -timeout=60s -shuffle=on -coverprofile=cov.out ./...`.
239. `[CONCEPT]` `{L2}` What is a test fixture? How does OpenTrace's `testdata/` directory store sample OTLP payloads for parser tests?
240. `[CODE]` `{L2}` Load OpenTrace's test fixture using `go:embed`: `//go:embed testdata/sample_trace.json var sampleTrace []byte`. Use in multiple tests without file I/O.
241. `[CONCEPT]` `{L2}` What is `assert.JSONEq` vs `assert.Equal` for JSON comparison? When does OpenTrace use each?
242. `[CODE]` `{L2}` Use `assert.JSONEq` in OpenTrace's API response tests to compare JSON regardless of key ordering.
243. `[CONCEPT]` `{L2}` What is `require.Eventually` in testify? How does OpenTrace use it to wait for async Kafka consumer processing in integration tests?
244. `[CODE]` `{L2}` Use `require.Eventually` in OpenTrace integration test: wait up to 10s for a span to appear in ClickHouse after being sent to Kafka: `require.Eventually(t, func() bool { return spanExists(traceID) }, 10*time.Second, 100*time.Millisecond)`.
245. `[CONCEPT]` `{L2}` What is load testing vs soak testing vs stress testing? Which does OpenTrace run before each major release?
246. `[CODE]` `{L2}` Write a k6 soak test for OpenTrace: run at 50 VUs for 4 hours. Assert no memory leaks (response time must not degrade over time), no goroutine leaks.
247. `[CONCEPT]` `{L2}` What is `testing.B.ResetTimer()`? When does OpenTrace use it to exclude setup time from benchmark measurements?
248. `[CODE]` `{L2}` Use `b.ResetTimer()` in OpenTrace's ClickHouse query benchmark: set up data before the timer reset, measure only query execution.
249. `[CONCEPT]` `{L2}` What is `go tool cover -mode=atomic`? When does OpenTrace use atomic coverage mode for race-condition-safe coverage in parallel tests?
250. `[APPLY]` `{L2}` Walk through OpenTrace's CI test pipeline: PR opened → `go vet` + `golangci-lint` → `go test -race -count=1` (unit) → `go test -tags=integration` (testcontainers) → `go test -fuzz` (1 minute) → `k6 run` (staging) → Playwright E2E. Estimate total CI time and where to optimize.
251. `[CODE]` `{L2}` Write a chaos test that kills OpenTrace's Kafka broker and verifies the Collector circuit breaker opens within 10 seconds and span ingestion returns 503.
252. `[CONCEPT]` `{L2}` What is `go test -covermode=count`? How does OpenTrace measure hot-path coverage — which lines are executed most frequently?
253. `[CODE]` `{L2}` Generate OpenTrace's hot-path coverage report: `go test -covermode=count -coverprofile=count.out ./...`, then view with `go tool cover -html=count.out`.
254. `[CONCEPT]` `{L2}` What is `go test -outputdir`? How does OpenTrace save test artifacts (coverage, pprof, benchmarks) to a separate directory?
255. `[CONCEPT]` `{L2}` What is `testing/iotest`? When does OpenTrace use `iotest.ErrReader` and `iotest.OneByteReader` to test stream error handling?
256. `[CODE]` `{L2}` Test OpenTrace's span batch reader with `iotest.OneByteReader` to simulate slow byte-at-a-time network reads.
257. `[CONCEPT]` `{L2}` What is `go test -run TestFoo/bar`? How does OpenTrace run specific table-driven test cases during development?
258. `[CODE]` `{L2}` Write OpenTrace's testing README: how to run unit tests, integration tests, load tests, E2E tests, how to update golden files, how to run benchmarks.
259. `[CONCEPT]` `{L2}` What is `require.WithinDuration` in testify? How does OpenTrace verify span timestamps are within an acceptable clock skew tolerance?
260. `[APPLY]` `{L2}` Describe OpenTrace's complete quality gate: a PR cannot merge unless ALL of these pass: `go vet`, `golangci-lint`, `govulncheck`, `tsc --noEmit`, unit tests (race), integration tests, `trivy image scan`, benchmark regression check, `promtool check rules`.

---

# PART D — GenAI & AI-Native Stack (Q261–Q400)

---

## LLM Fundamentals for Backend Engineers (Q261–Q300)

261. `[CONCEPT]` `{L1}` What is a Large Language Model (LLM)? What is a token? What is a context window (4K, 8K, 128K, 1M tokens)?
262. `[CONCEPT]` `{L1}` What is the difference between OpenAI GPT-4o, Anthropic Claude 3.5 Sonnet, Google Gemini 1.5 Pro? What API capabilities are most relevant for OpenTrace's AI features?
263. `[CONCEPT]` `{L1}` What is an LLM API call? What are `messages`, `model`, `max_tokens`, `temperature`, `stream` parameters? When does OpenTrace set `temperature=0` for deterministic diagnosis?
264. `[CONCEPT]` `{L1}` What is RAG (Retrieval-Augmented Generation)? What problem does it solve vs fine-tuning? When does OpenTrace use RAG for span anomaly explanation?
265. `[CONCEPT]` `{L1}` What is a vector embedding? What is cosine similarity? How do text embeddings enable OpenTrace's semantic span search?
266. `[CONCEPT]` `{L2}` What is the difference between text embeddings and LLM completions? When does OpenTrace call the embeddings API vs the completions API?
267. `[CONCEPT]` `{L2}` What is prompt engineering? What is a system prompt vs user message vs assistant message? How does OpenTrace structure prompts for span diagnosis?
268. `[CODE]` `{L2}` Write OpenTrace's system prompt for the AI diagnosis assistant:
    ```
    You are an expert in distributed systems and observability.
    Your role is to analyze distributed trace data and provide concise root cause analysis.
    Always provide: (1) root cause, (2) confidence level (high/medium/low), (3) 2-3 remediation steps.
    Respond in JSON format only.
    ```
269. `[CONCEPT]` `{L2}` What is few-shot prompting? How does OpenTrace include 2-3 historical incident examples in the prompt to improve diagnosis accuracy?
270. `[CODE]` `{L2}` Write a few-shot prompt for OpenTrace's anomaly detection: include examples of "DB connection pool exhausted" and "downstream timeout" patterns with expected diagnoses.
271. `[CONCEPT]` `{L2}` What is chain-of-thought (CoT) prompting? When does OpenTrace use `"Think step by step"` to improve LLM reasoning quality for complex trace analysis?
272. `[CONCEPT]` `{L2}` What is LLM hallucination? How does OpenTrace reduce it: grounded prompts with real data, output validation, confidence scoring, human-in-the-loop for high-severity incidents?
273. `[CONCEPT]` `{L2}` What is token counting? How does OpenTrace use `tiktoken` to estimate prompt size and truncate retrieved context to stay within 4K tokens?
274. `[CODE]` `{L2}` Count tokens before calling OpenAI in Go using `tiktoken-go`:
    ```go
    enc, _ := tiktoken.GetEncoding("cl100k_base")
    tokens := enc.Encode(prompt, nil, nil)
    if len(tokens) > 4000 {
        prompt = truncateToTokenLimit(prompt, 4000, enc)
    }
    ```
275. `[CONCEPT]` `{L2}` What is LLM streaming? How does OpenTrace stream the AI diagnosis response to the UI via SSE as tokens arrive?
276. `[CODE]` `{L2}` Stream LLM response from OpenTrace's Go backend via SSE:
    ```go
    stream, _ := openaiClient.CreateChatCompletionStream(ctx, req)
    w.Header().Set("Content-Type", "text/event-stream")
    for {
        chunk, err := stream.Recv()
        if errors.Is(err, io.EOF) { break }
        fmt.Fprintf(w, "data: %s\n\n", chunk.Choices[0].Delta.Content)
        flusher.Flush()
    }
    ```
277. `[CONCEPT]` `{L2}` What is structured output from LLMs? How does OpenTrace use OpenAI's JSON mode to get machine-parseable diagnosis objects?
278. `[CODE]` `{L2}` Parse structured output from OpenTrace's LLM diagnosis:
    ```go
    type Diagnosis struct {
        RootCause   string   `json:"root_cause"`
        Confidence  string   `json:"confidence"` // high|medium|low
        Steps       []string `json:"remediation_steps"`
    }
    var d Diagnosis
    json.Unmarshal([]byte(response.Content), &d)
    ```
279. `[CONCEPT]` `{L2}` What is `instructor` library for Go/Python? How does it enforce that LLM output conforms to a Go struct or Pydantic model?
280. `[CONCEPT]` `{L2}` What is LLM function calling (tool use)? How does OpenTrace define tools that the LLM can call: `query_prometheus`, `search_traces`, `get_runbook`?
281. `[CODE]` `{L2}` Define tools for OpenTrace's LLM agent:
    ```json
    [
      {"name":"query_prometheus","description":"Query Prometheus metrics for a service","parameters":{"service":{"type":"string"},"metric":{"type":"string"},"window":{"type":"string"}}},
      {"name":"search_similar_traces","description":"Find similar historical traces","parameters":{"error_message":{"type":"string"},"service":{"type":"string"}}}
    ]
    ```
282. `[CONCEPT]` `{L2}` What is the ReAct (Reason + Act) pattern for LLM agents? How does OpenTrace's diagnostic agent reason → call tool → observe result → reason again?
283. `[CONCEPT]` `{L2}` What is LangChain? What is LlamaIndex? When does OpenTrace use them vs raw OpenAI API calls?
284. `[CONCEPT]` `{L2}` What is `Ollama`? What models can run locally (Llama 3.2, Mistral, CodeLlama)? How does OpenTrace configure it for local development without API costs?
285. `[CODE]` `{L2}` Configure OpenTrace to use Ollama locally for development:
    ```go
    client := openai.NewClientWithConfig(openai.ClientConfig{
        BaseURL: "http://localhost:11434/v1",
        APIType: openai.APITypeOpenAI,
    })
    model := "llama3.2" // local model
    ```
286. `[CONCEPT]` `{L2}` What is `vLLM`? What is continuous batching? How does OpenTrace self-host LLM inference for enterprise customers who can't send data to OpenAI?
287. `[CONCEPT]` `{L2}` What is `LMSYS Chatbot Arena`? How do you choose the right LLM for OpenTrace's use case: diagnosis quality vs cost vs latency vs context length?
288. `[CONCEPT]` `{L2}` What is LLM cost optimization? What is prompt caching (OpenAI 2024)? How does OpenTrace use it to cache the static system prompt portion?
289. `[CODE]` `{L2}` Implement LLM response caching in OpenTrace using Redis: hash the prompt → check Redis → return cached response → on miss, call OpenAI, cache for 1 hour.
290. `[CONCEPT]` `{L2}` What is prompt injection? How does OpenTrace sanitize span data (error messages, service names) before including it in LLM prompts?
291. `[CODE]` `{L2}` Sanitize LLM prompt inputs in OpenTrace: validate trace_id matches `[0-9a-f-]{36}`, escape special characters in error messages, limit error message to 500 chars.
292. `[CONCEPT]` `{L2}` What is AI observability? How does OpenTrace instrument LLM calls with OpenTelemetry to track: model, tokens used, latency, cost per call?
293. `[CODE]` `{L2}` Instrument OpenTrace's OpenAI calls with OTel:
    ```go
    ctx, span := tracer.Start(ctx, "openai.chat_completion")
    span.SetAttributes(
        attribute.String("llm.model", model),
        attribute.Int("llm.prompt_tokens", usage.PromptTokens),
        attribute.Int("llm.completion_tokens", usage.CompletionTokens),
        attribute.Float64("llm.cost_usd", float64(usage.TotalTokens)*0.00003),
    )
    defer span.End()
    ```
294. `[CONCEPT]` `{L2}` What is an LLM rate limiter? How does OpenTrace limit AI diagnosis requests to 10/minute per tenant to control costs?
295. `[CODE]` `{L2}` Apply rate limiting to OpenTrace's AI endpoint: Redis sliding window, 10 requests/minute per `tenant_id`, return 429 with `Retry-After` when exceeded.
296. `[CONCEPT]` `{L2}` What is AI cost monitoring? How does OpenTrace track OpenAI costs per tenant for billing purposes?
297. `[CODE]` `{L2}` Track AI costs per tenant in OpenTrace: `aiCostTotal.WithLabelValues(tenantID, model).Add(cost)`. Alert when tenant exceeds $10/day.
298. `[CONCEPT]` `{L2}` What is `llm-guard` for prompt safety? How does OpenTrace detect and block prompt injection attempts before sending to the LLM?
299. `[CONCEPT]` `{L2}` What is the `"lost in the middle"` problem in LLMs? How does OpenTrace order retrieved context to put most relevant spans at the beginning and end of the prompt?
300. `[CONCEPT]` `{L2}` What is an embedding model? Compare `text-embedding-3-small` (1536 dims, $0.02/1M tokens) vs `text-embedding-3-large` (3072 dims, $0.13/1M tokens) for OpenTrace's semantic search.

---

## Vector Databases & RAG Pipelines (Q301–Q360)

301. `[CONCEPT]` `{L1}` What is a vector database? How does it store and query high-dimensional embeddings? Compare: Pinecone, Qdrant, Weaviate, Chroma, pgvector.
302. `[CONCEPT]` `{L1}` What is HNSW (Hierarchical Navigable Small World)? Why is it the dominant approximate nearest neighbor (ANN) algorithm?
303. `[CONCEPT]` `{L2}` What is ANN vs exact kNN? What is the recall vs latency tradeoff? What recall does OpenTrace need for anomaly search (95%)?
304. `[CODE]` `{L2}` Set up pgvector for OpenTrace's semantic search:
    ```sql
    CREATE EXTENSION vector;
    CREATE TABLE span_embeddings (
        span_id UUID PRIMARY KEY,
        embedding vector(1536),
        service_name TEXT,
        operation_name TEXT,
        error_message TEXT
    );
    CREATE INDEX ON span_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
    ```
305. `[CODE]` `{L2}` Query pgvector for semantically similar OpenTrace spans:
    ```sql
    SELECT span_id, 1 - (embedding <=> $1::vector) AS similarity
    FROM span_embeddings
    WHERE tenant_id = $2
    ORDER BY embedding <=> $1::vector
    LIMIT 10;
    ```
306. `[CONCEPT]` `{L2}` What is IVFFlat vs HNSW index in pgvector? What are the build time vs query time tradeoffs for OpenTrace's 100M span embeddings?
307. `[CODE]` `{L2}` Use HNSW index in pgvector for OpenTrace: `CREATE INDEX ON span_embeddings USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64)`.
308. `[CONCEPT]` `{L2}` What is Qdrant? How does it differ from pgvector for OpenTrace's 1B span embeddings that exceed PostgreSQL's capacity?
309. `[CODE]` `{L2}` Create a Qdrant collection for OpenTrace spans:
    ```python
    client.create_collection(
        collection_name="spans",
        vectors_config=VectorsConfig(size=1536, distance=Distance.COSINE),
        optimizers_config=OptimizersConfigDiff(indexing_threshold=50000),
    )
    ```
310. `[CODE]` `{L2}` Upsert span embeddings to Qdrant from OpenTrace's Kafka consumer:
    ```python
    client.upsert(
        collection_name="spans",
        points=[PointStruct(id=span.id, vector=embedding, payload={
            "service": span.service, "tenant_id": span.tenant_id, "error": span.error
        })]
    )
    ```
311. `[CODE]` `{L2}` Search Qdrant with filter for OpenTrace (tenant isolation):
    ```python
    results = client.search(
        collection_name="spans",
        query_vector=query_embedding,
        query_filter=Filter(must=[FieldCondition(key="tenant_id", match=MatchValue(value=tenant_id))]),
        limit=10
    )
    ```
312. `[CONCEPT]` `{L2}` What is vector quantization (scalar quantization, product quantization)? How does OpenTrace use int8 quantization to reduce Qdrant storage 4× with < 5% recall loss?
313. `[CODE]` `{L2}` Enable int8 scalar quantization in Qdrant for OpenTrace: reduces storage from 6GB to 1.5GB for 1M embeddings.
314. `[CONCEPT]` `{L2}` What is chunking in RAG? How does OpenTrace split span data into optimal chunks: one chunk per span (50 tokens) vs one chunk per trace (variable)?
315. `[CONCEPT]` `{L2}` What is hybrid search? How does OpenTrace combine BM25 keyword search (Elasticsearch) with semantic vector search for span error diagnosis?
316. `[CODE]` `{L2}` Implement hybrid search for OpenTrace using RRF (Reciprocal Rank Fusion):
    ```python
    def hybrid_search(query, k=10):
        bm25_results = elasticsearch_search(query, k=50)
        vector_results = qdrant_search(embed(query), k=50)
        # RRF: score = sum(1/(rank+60)) for each result across both lists
        return rrf_merge(bm25_results, vector_results)[:k]
    ```
317. `[CONCEPT]` `{L2}` What is a reranker (cross-encoder)? How does OpenTrace use it to rerank Qdrant results for higher precision after initial retrieval?
318. `[CODE]` `{L2}` Implement reranking in OpenTrace's RAG pipeline: retrieve 50 candidates via vector search, rerank with cross-encoder, return top 10.
319. `[CONCEPT]` `{L2}` What is a RAG pipeline? What are the stages: query → embed → retrieve → rerank → augment prompt → generate → parse response?
320. `[CODE]` `{L2}` Implement OpenTrace's RAG pipeline for span anomaly explanation:
    ```python
    def explain_anomaly(trace_id, tenant_id):
        trace = get_trace(trace_id)                           # 1. fetch trace
        query = extract_anomaly_description(trace)           # 2. extract key info
        embedding = embed(query)                             # 3. embed query
        similar = qdrant_search(embedding, tenant_id, k=5)  # 4. retrieve
        context = format_context(similar)                    # 5. format
        prompt = build_prompt(trace, context)                # 6. augment prompt
        return llm_complete(prompt)                          # 7. generate
    ```
321. `[CONCEPT]` `{L2}` What is the embedding pipeline? How does OpenTrace stream-process new spans: Kafka → embed in batches → upsert to Qdrant → acknowledge?
322. `[CODE]` `{L2}` Design OpenTrace's embedding pipeline: consume from Kafka `spans` topic, batch 100 spans per 500ms, call OpenAI embeddings API, upsert to Qdrant, commit Kafka offset.
323. `[CONCEPT]` `{L2}` What is `RAGAS` for evaluating RAG quality? What metrics does it measure: faithfulness, answer relevancy, context precision, context recall?
324. `[CODE]` `{L2}` Evaluate OpenTrace's RAG quality using RAGAS: run 50 test questions with ground truth answers, measure faithfulness (> 0.85) and context precision (> 0.80).
325. `[CONCEPT]` `{L2}` What is an embedding cache? How does OpenTrace cache frequently used embeddings in Redis to avoid repeated OpenAI API calls?
326. `[CODE]` `{L2}` Cache embeddings in OpenTrace: `SETEX embed:{sha256(text)} 86400 {base64(embedding)}`. Cache hit rate target: 60% for common error patterns.
327. `[CONCEPT]` `{L2}` What is vector database multi-tenancy? How does Qdrant filter by `tenant_id` payload field for OpenTrace's isolation requirements?
328. `[CODE]` `{L2}` Ensure multi-tenant isolation in OpenTrace's Qdrant queries: always filter by `tenant_id` in every search. Never allow cross-tenant retrieval.
329. `[CONCEPT]` `{L2}` What is a `sparse-dense` hybrid vector? What is SPLADE? When would OpenTrace use it for better keyword + semantic search?
330. `[CONCEPT]` `{L2}` What is `late chunking` vs `early chunking` for embeddings? Which preserves more context for OpenTrace's span-level embeddings?
331. `[CONCEPT]` `{L2}` What is `FAISS`? When does OpenTrace use FAISS in-process for fast prototype search without a dedicated vector database?
332. `[CODE]` `{L2}` Use FAISS in-process for OpenTrace's small-scale development search: `IndexFlatIP` for exact cosine similarity on < 1M vectors.
333. `[CONCEPT]` `{L2}` What is `semantic caching` for LLM responses? How does OpenTrace return a cached answer for semantically similar (> 0.98 cosine) queries without calling the LLM?
334. `[CODE]` `{L2}` Implement semantic caching for OpenTrace's AI search:
    ```python
    query_embedding = embed(user_query)
    cached = cache_index.search(query_embedding, similarity_threshold=0.98)
    if cached:
        return cached.response
    response = llm_complete(build_prompt(user_query, retrieved_context))
    cache_index.add(query_embedding, response)
    return response
    ```
335. `[CONCEPT]` `{L2}` What is embedding model drift? How does OpenTrace detect when the embedding model changes and invalidate the entire vector index?
336. `[CODE]` `{L2}` Store embedding model version in Qdrant collection metadata for OpenTrace. On model upgrade, create new collection `spans_v2`, backfill, swap alias.
337. `[CONCEPT]` `{L2}` What is `Weaviate` vs `Qdrant` vs `Chroma` for OpenTrace? Compare: horizontal scaling, hybrid search, multi-tenancy, self-hosting complexity.
338. `[TRADEOFF]` `{L2}` pgvector vs Qdrant vs Pinecone for OpenTrace's 1B span embeddings: compare max scale, query latency at 1M vectors, query latency at 1B vectors, cost, and operational overhead.
339. `[CONCEPT]` `{L2}` What is `contextual chunking`? How does OpenTrace add trace-level metadata (service, root error) to each span's embedding context?
340. `[CODE]` `{L2}` Enrich span text for embedding in OpenTrace:
    ```python
    def span_to_text(span, trace):
        return f"Service: {span.service_name}\nOperation: {span.operation_name}\nStatus: {span.status}\nError: {span.error or 'none'}\nParent: {trace.root_service}\nDuration: {span.duration_ms}ms"
    ```
341. `[CONCEPT]` `{L2}` What is `two-stage retrieval`? How does OpenTrace use fast ANN retrieval (Qdrant) followed by precise reranking (cross-encoder) for high-quality results?
342. `[CODE]` `{L2}` Implement two-stage retrieval for OpenTrace: Qdrant retrieves top-50 candidates in < 10ms, cross-encoder reranks in < 100ms, return top-10.
343. `[CONCEPT]` `{L2}` What is the context window packing problem? How does OpenTrace fit 5 retrieved spans + the current trace into a 4K token context window?
344. `[CONCEPT]` `{L2}` What is `MTEB` (Massive Text Embedding Benchmark)? How does OpenTrace evaluate embedding models before production deployment?
345. `[CONCEPT]` `{L2}` What is `vector index warm-up`? Why does Qdrant HNSW index search speed improve after the first 1000 queries (graph traversal caching)?
346. `[CODE]` `{L2}` Warm up OpenTrace's Qdrant collection on service startup: run 100 random searches to pre-load the HNSW graph into memory before accepting real queries.
347. `[CONCEPT]` `{L2}` What is `namespace` in Pinecone vs `collection` in Qdrant? How does OpenTrace map its multi-tenant architecture to the vector database's isolation model?
348. `[CONCEPT]` `{L2}` What is embedding compression? What is Matryoshka Embedding? How does `text-embedding-3-small` support truncating to 512 dimensions with minimal quality loss?
349. `[CODE]` `{L2}` Use 512-dimensional embeddings in OpenTrace to reduce storage 3× with minimal recall loss: `CreateEmbeddings(model="text-embedding-3-small", dimensions=512)`.
350. `[APPLY]` `{L2}` Design OpenTrace's complete vector search infrastructure for 1B span embeddings: embedding model (text-embedding-3-small, 512 dims), vector DB (Qdrant, int8 quantization), hybrid search (BM25 + vector), reranking, semantic caching, cost ($X/month estimate).

---

## AI Agents & AI-Native Architecture (Q351–Q400)

351. `[CONCEPT]` `{L1}` What is an AI agent? What is the ReAct loop: Reason → Act (call tool) → Observe → Reason again?
352. `[CONCEPT]` `{L1}` What is tool use (function calling) in LLMs? How does OpenTrace define tools: `query_prometheus`, `search_traces`, `get_runbook`, `create_alert`?
353. `[CONCEPT]` `{L2}` What is an orchestrator agent vs a specialist agent? How does OpenTrace's diagnostic system use one orchestrator that delegates to Prometheus, Loki, and Trace specialist agents?
354. `[CODE]` `{L2}` Design OpenTrace's multi-agent diagnostic system:
    ```python
    orchestrator = create_agent(llm=gpt4o, tools=[delegate_to_prometheus_agent, delegate_to_loki_agent, delegate_to_trace_agent, synthesize_diagnosis])
    result = orchestrator.run(f"Investigate high p99 latency in {service} starting at {timestamp}")
    ```
355. `[CONCEPT]` `{L2}` What is an LLM agent loop termination? How does OpenTrace prevent infinite tool-calling loops: max iterations (10), timeout (30s), required conclusion format?
356. `[CODE]` `{L2}` Implement agent loop with safety limits for OpenTrace:
    ```python
    agent = Agent(llm=gpt4o, tools=tools, max_iterations=10, timeout=30)
    try:
        result = agent.run(task, timeout=30)
    except AgentMaxIterationsError:
        return {"error": "diagnosis_timeout", "partial_analysis": agent.last_observation}
    ```
357. `[CONCEPT]` `{L2}` What is `CrewAI`? What is `AutoGen`? How do they simplify building OpenTrace's multi-agent diagnostic team vs raw LangChain agents?
358. `[CODE]` `{L2}` Build OpenTrace's diagnostic crew with CrewAI:
    ```python
    researcher = Agent(role="Trace Researcher", goal="Find similar historical incidents", tools=[search_qdrant])
    analyst = Agent(role="Root Cause Analyst", goal="Diagnose the incident", tools=[query_prometheus, query_loki])
    crew = Crew(agents=[researcher, analyst], tasks=[research_task, analysis_task], process=Process.sequential)
    result = crew.kickoff(inputs={"trace_id": trace_id})
    ```
359. `[CONCEPT]` `{L2}` What is agent memory? What is short-term memory (context window) vs long-term memory (vector store)? How does OpenTrace's agent remember past incidents?
360. `[CODE]` `{L2}` Add long-term memory to OpenTrace's diagnostic agent: after each resolved incident, store `{problem, diagnosis, resolution}` in Qdrant. Agent retrieves similar past incidents on each new investigation.
361. `[CONCEPT]` `{L2}` What is `LangGraph`? How does it enable stateful, cyclical agent workflows for OpenTrace's iterative diagnosis process?
362. `[CODE]` `{L2}` Build a LangGraph workflow for OpenTrace's diagnosis: nodes = [gather_metrics, search_logs, search_traces, synthesize], edges = conditional routing based on what data is available.
363. `[CONCEPT]` `{L2}` What is `human-in-the-loop` (HITL) for AI agents? How does OpenTrace require human approval before the AI agent creates a PagerDuty alert or scales infrastructure?
364. `[CODE]` `{L2}` Implement HITL approval in OpenTrace's agent: when the agent wants to call `scale_collector_replicas`, emit a Slack approval request, pause execution for up to 60 seconds for approval.
365. `[CONCEPT]` `{L2}` What is `Guardrails AI`? How does OpenTrace validate that LLM-generated remediation steps are safe before showing them to on-call engineers?
366. `[CONCEPT]` `{L2}` What is model selection strategy? When does OpenTrace use GPT-4o (complex diagnosis) vs GPT-4o-mini (simple classification) vs local Llama (development)?
367. `[CODE]` `{L2}` Implement model routing in OpenTrace based on query complexity:
    ```go
    func selectModel(query string) string {
        complexity := assessComplexity(query)
        if complexity == "high" { return "gpt-4o" }
        if complexity == "medium" { return "gpt-4o-mini" }
        return "llama3.2" // local for low complexity
    }
    ```
368. `[CONCEPT]` `{L2}` What is `dspy` (Declarative Self-improving Python)? How does it enable OpenTrace to optimize prompts automatically using a small labeled dataset?
369. `[CONCEPT]` `{L2}` What is LLM evaluation? What is `promptfoo`? How does OpenTrace CI test that prompt changes don't degrade diagnosis quality?
370. `[CODE]` `{L2}` Write a `promptfoo` test case for OpenTrace's diagnosis prompt:
    ```yaml
    prompts: [prompts/diagnosis.txt]
    providers: [openai:gpt-4o]
    tests:
    - vars: { service: "user-api", error: "Connection pool exhausted" }
      assert:
      - type: contains
        value: "connection pool"
      - type: llm-rubric
        value: "Diagnosis should mention increasing pool size"
    ```
371. `[CONCEPT]` `{L2}` What is AI feedback loop? How does OpenTrace collect implicit feedback (engineer accepted/dismissed diagnosis) to improve retrieval quality?
372. `[CODE]` `{L2}` Collect feedback for OpenTrace AI diagnoses: when engineer clicks "helpful" or "not helpful", store `{query, retrieved_spans, diagnosis, feedback}` for future evaluation.
373. `[CONCEPT]` `{L2}` What is `LLM-as-judge`? How does OpenTrace use GPT-4o to evaluate the quality of its own smaller model's diagnoses before showing them to users?
374. `[CODE]` `{L2}` Implement LLM-as-judge quality gate for OpenTrace: before returning a diagnosis to the user, pass it through a judge prompt that scores it on accuracy and actionability (reject if score < 7/10).
375. `[CONCEPT]` `{L2}` What is fine-tuning? What is LoRA (Low-Rank Adaptation)? When does OpenTrace fine-tune a model vs use RAG? (RAG for up-to-date data, fine-tuning for consistent format/tone)
376. `[CONCEPT]` `{L2}` What is `unsloth`? What is QLoRA? How could OpenTrace fine-tune Llama 3.2 on its own incident history with 4× less memory using QLoRA?
377. `[CODE]` `{L2}` Design OpenTrace's fine-tuning dataset: collect 1000 examples of `{trace_data, incident_description, expert_diagnosis, resolution}`. Format as `(instruction, input, output)` tuples for supervised fine-tuning.
378. `[CONCEPT]` `{L2}` What is `vLLM` for serving open-source LLMs? What is continuous batching? How does OpenTrace self-host Llama 3.2 on A100 GPUs for enterprise deployments?
379. `[CODE]` `{L2}` Configure `vLLM` for OpenTrace enterprise: `python -m vllm.entrypoints.openai.api_server --model meta-llama/Llama-3.2-8B-Instruct --tensor-parallel-size 2`. OpenAI-compatible API.
380. `[CONCEPT]` `{L2}` What is `litellm`? How does it provide a unified API for OpenTrace to switch between OpenAI, Anthropic, local Ollama, and vLLM without code changes?
381. `[CODE]` `{L2}` Use litellm in OpenTrace to abstract LLM provider:
    ```python
    from litellm import completion
    # Switch providers via config, not code
    response = completion(model="gpt-4o", messages=messages)  # OpenAI
    response = completion(model="claude-3-5-sonnet", messages=messages)  # Anthropic
    response = completion(model="ollama/llama3.2", messages=messages)  # Local
    ```
382. `[CONCEPT]` `{L2}` What is AI observability beyond OTel? What is `LangSmith`? What is `Langfuse`? How does OpenTrace trace every LLM call, tool invocation, and RAG retrieval for debugging?
383. `[CODE]` `{L2}` Integrate Langfuse with OpenTrace for LLM observability: trace every generation with `langfuse.trace()`, track tokens, cost, latency, and quality scores per tenant.
384. `[CONCEPT]` `{L2}` What is a `knowledge graph` for AI? How would OpenTrace store service dependencies as a graph to give the LLM structured context about the system topology?
385. `[CODE]` `{L2}` Build a service dependency graph for OpenTrace from trace data: `CREATE (a:Service {name:"user-api"})-[:CALLS]->(b:Service {name:"payment-svc"})`. Use Neo4j or PostgreSQL with recursive CTEs.
386. `[CONCEPT]` `{L2}` What is agentic search? How does OpenTrace's agent iteratively refine its search queries based on retrieved results to find the root cause?
387. `[CONCEPT]` `{L2}` What is `Semantic Kernel` by Microsoft? What is it suited for in OpenTrace's use case? When would you choose it over LangChain?
388. `[CONCEPT]` `{L2}` What is model caching for inference? What is KV cache? How does longer context from conversation history affect inference cost for OpenTrace's stateful diagnostic sessions?
389. `[CODE]` `{L2}` Implement conversation history management for OpenTrace's diagnostic chat: keep last 10 messages, summarize older history to save tokens, maintain `system_prompt + summary + recent_messages`.
390. `[CONCEPT]` `{L3}` What is a `mixture of experts` (MoE) model? How does Mixtral 8×7B compare to GPT-4o for OpenTrace's latency requirements?
391. `[CONCEPT]` `{L2}` What is speculative decoding? How does it speed up LLM inference for OpenTrace's time-sensitive diagnosis? (draft model + target model verify in parallel)
392. `[CONCEPT]` `{L2}` What is `RLHF` (Reinforcement Learning from Human Feedback)? How could OpenTrace use engineer feedback on diagnoses to improve the model over time?
393. `[CONCEPT]` `{L2}` What is AI red-teaming? How does OpenTrace test its AI features for adversarial inputs: prompt injection, jailbreaks, data exfiltration attempts?
394. `[CODE]` `{L2}` Add prompt injection detection to OpenTrace: check for patterns like `"ignore previous instructions"`, `"system:"`, `"<|im_start|>"` in user-supplied span data before including in prompts.
395. `[CONCEPT]` `{L2}` What is PII (Personally Identifiable Information) in span data? How does OpenTrace redact email addresses, IP addresses, and user IDs before sending span data to OpenAI?
396. `[CODE]` `{L2}` Implement PII redaction for OpenTrace's LLM prompts:
    ```go
    func redactPII(text string) string {
        text = emailRegex.ReplaceAllString(text, "[EMAIL]")
        text = ipv4Regex.ReplaceAllString(text, "[IP]")
        text = uuidRegex.ReplaceAllString(text, "[ID]")
        return text
    }
    ```
397. `[CONCEPT]` `{L2}` What is an AI feature flag rollout? How does OpenTrace progressively enable AI diagnosis for 1% → 10% → 100% of users while monitoring quality and cost?
398. `[CONCEPT]` `{L2}` What is `GDPR compliance for AI`? Can OpenTrace send EU customer span data to OpenAI's US servers? What is the `Azure OpenAI Service` EU residency option?
399. `[CONCEPT]` `{L3}` What is a `compound AI system`? How does OpenTrace combine retrieval (Qdrant), reasoning (GPT-4o), structured output (instructor), and observability (Langfuse) as separate, composable components?
400. `[APPLY]` `{L2}` Design OpenTrace's complete AI-native observability product: (1) semantic span search (Qdrant + BM25 hybrid), (2) AI anomaly explanation (RAG + GPT-4o), (3) auto-remediation suggestions (agent + tools), (4) predictive alerting (time series + LLM reasoning). For each: tech stack, latency target, cost estimate, quality metric.

---

# PART E — Production AI & Full Synthesis (Q401–Q500)

---

## Production AI Patterns (Q401–Q440)

401. `[CONCEPT]` `{L2}` What is AI reliability? How does OpenTrace handle LLM API outages: fallback to cached responses, fallback to rule-based diagnosis, graceful degradation?
402. `[CODE]` `{L2}` Implement AI fallback in OpenTrace: if OpenAI returns 503, fall back to cached similar incidents from Qdrant without LLM generation.
403. `[CONCEPT]` `{L2}` What is AI latency budget? How does OpenTrace allocate its 2-second budget: 100ms Qdrant retrieval, 200ms reranking, 1500ms LLM generation, 200ms response parsing?
404. `[CODE]` `{L2}` Implement AI latency budget in OpenTrace with Go contexts:
    ```go
    ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
    defer cancel()
    retrieved := qdrantSearch(ctx, embedding)  // 100ms budget
    reranked := rerank(ctx, retrieved)         // 200ms budget
    diagnosis := llmGenerate(ctx, reranked)    // 1.5s budget
    ```
405. `[CONCEPT]` `{L2}` What is AI A/B testing? How does OpenTrace compare GPT-4o vs GPT-4o-mini for diagnosis quality while measuring cost per query?
406. `[CODE]` `{L2}` Run A/B test for OpenTrace AI models: randomly route 50% of requests to GPT-4o and 50% to GPT-4o-mini. Track `ai_diagnosis_helpful_total{model}` and `ai_cost_per_query{model}`.
407. `[CONCEPT]` `{L2}` What is AI cost governance? How does OpenTrace set per-tenant monthly AI spending limits?
408. `[CODE]` `{L2}` Implement AI cost governance in OpenTrace:
    ```go
    monthlyLimit := getTenantAIBudget(tenantID) // e.g., $50/month
    spent := getMonthlyAISpend(tenantID)
    if spent >= monthlyLimit {
        return ErrAIBudgetExceeded
    }
    ```
409. `[CONCEPT]` `{L2}` What is AI quota system? How does OpenTrace offer tiered AI features: free (10 diagnoses/day), pro (100/day), enterprise (unlimited)?
410. `[CONCEPT]` `{L2}` What is AI observability dashboard? Design the 5 Grafana panels for OpenTrace's AI feature: queries/sec, avg tokens/query, cost/day by tenant, cache hit rate, diagnosis quality score.
411. `[CODE]` `{L2}` Write PromQL for OpenTrace's AI cost dashboard: `sum by (tenant_id) (rate(openTrace_ai_cost_usd_total[24h]))` sorted descending — find highest-cost tenants.
412. `[CONCEPT]` `{L2}` What is AI prompt versioning? How does OpenTrace track which prompt version produced each diagnosis for debugging quality regressions?
413. `[CODE]` `{L2}` Version OpenTrace's AI prompts: store in `ai_diagnoses(diagnosis_id, prompt_version, tokens_used, model, response, feedback_score)`. Alert when a new prompt version decreases feedback scores.
414. `[CONCEPT]` `{L2}` What is AI warm-up? How does OpenTrace pre-embed the most common error patterns at startup to reduce cold-start latency for the first queries?
415. `[CODE]` `{L2}` Pre-warm OpenTrace's AI feature: on service startup, embed the 100 most common error patterns and store in Redis cache. First user queries use cached embeddings.
416. `[CONCEPT]` `{L2}` What is AI shadow mode? How does OpenTrace run AI diagnosis silently for all incidents before exposing it to users, to validate quality without risk?
417. `[CODE]` `{L2}` Implement AI shadow mode for OpenTrace: run diagnosis async for every incident, store result with `shadow=true`. After 1 week, review quality with `SELECT AVG(quality_score) FROM shadow_diagnoses`.
418. `[CONCEPT]` `{L2}` What is a `Constitution AI` approach? How does OpenTrace build self-critique into its diagnosis prompts: generate diagnosis → critique → revise?
419. `[CODE]` `{L2}` Implement self-critique in OpenTrace's diagnosis pipeline:
    ```python
    diagnosis = llm_complete(diagnosis_prompt)
    critique = llm_complete(f"Critique this diagnosis for accuracy and completeness:\n{diagnosis}")
    if "insufficient" in critique or "missing" in critique:
        diagnosis = llm_complete(f"Revise this diagnosis based on this critique:\n{critique}\n\nOriginal: {diagnosis}")
    ```
420. `[CONCEPT]` `{L2}` What is AI incident post-mortem? How does OpenTrace use an LLM to draft a post-mortem report after an incident is resolved: timeline, root cause, impact, prevention?
421. `[CODE]` `{L2}` Implement AI post-mortem generation for OpenTrace: `POST /v1/ai/postmortem?incident_id=xyz` → gather Grafana annotations (timeline), Loki logs (errors), Tempo traces (slowest spans) → generate structured post-mortem.
422. `[CONCEPT]` `{L2}` What is AI-powered alert noise reduction? How does OpenTrace group and deduplicate alerts using an LLM to identify that 10 different alerts are all symptoms of one root cause?
423. `[CODE]` `{L2}` Implement alert clustering in OpenTrace: embed each alert description, cluster with DBSCAN in Qdrant, group correlated alerts, surface the root cause alert to the engineer instead of all 10 noisy alerts.
424. `[CONCEPT]` `{L2}` What is AI-powered capacity planning? How does OpenTrace use time-series + LLM to predict "you'll need to double ClickHouse storage in 6 weeks based on current growth"?
425. `[CONCEPT]` `{L2}` What is predictive alerting? How does OpenTrace use ML anomaly detection on metrics to alert before a threshold is breached?
426. `[CODE]` `{L2}` Implement anomaly detection in OpenTrace using Z-score: alert when metric value > 3 standard deviations from its 7-day rolling mean. Store rolling stats in Redis.
427. `[CONCEPT]` `{L2}` What is an `AI-native` vs `AI-powered` application? How does OpenTrace's observability product fundamentally change when AI is a core feature vs an add-on?
428. `[CONCEPT]` `{L2}` What is the role of a backend engineer in an AI-native application? What new skills are required: prompt engineering, RAG pipeline design, vector DB operation, LLM observability?
429. `[CODE]` `{L2}` Write OpenTrace's ADR for "Use RAG instead of fine-tuning for AI diagnosis": context (trace data changes daily), decision (RAG), consequences (higher latency, easier to update), alternatives (fine-tuning: better quality, requires retraining).
430. `[CONCEPT]` `{L2}` What is AI feature documentation? How does OpenTrace document its AI features for users: capabilities, limitations, when to trust/distrust the diagnosis, feedback mechanism?

---

## Complete Project Synthesis (Q441–Q500)

431. `[APPLY]` `{L2}` Walk through the complete OpenTrace AI diagnosis flow: engineer opens a slow trace → clicks "Explain with AI" → backend embeds the trace description → searches Qdrant for similar incidents → retrieves top-5 → builds prompt → streams GPT-4o response → displays diagnosis with confidence score.
432. `[APPLY]` `{L2}` Walk through OpenTrace's embedding pipeline for a newly ingested span: Kafka consumer reads span → extract text (`service.operation: error_message`) → batch 100 spans → call OpenAI embeddings API → upsert to Qdrant → commit Kafka offset. Latency target: < 2 seconds end-to-end.
433. `[APPLY]` `{L2}` Design the data architecture for OpenTrace's AI features: ClickHouse (raw spans), Qdrant (span embeddings for retrieval), PostgreSQL (AI diagnosis history, quality scores), Redis (embedding cache, rate limits), Kafka (span ingestion pipeline).
434. `[APPLY]` `{L2}` Design OpenTrace's multi-tenant AI isolation: Qdrant filters by `tenant_id` on every query, PII redaction before embedding, per-tenant AI cost tracking, per-tenant rate limiting, EU tenants route to Azure OpenAI (EU residency).
435. `[APPLY]` `{L2}` Calculate OpenTrace's AI feature costs: 1000 diagnoses/day × 2000 tokens avg × $0.00003/token = $0.06/day for GPT-4o-mini. + 10M spans/day × 50 tokens × $0.02/1M = $10/day for embeddings. Total: ~$310/month.
436. `[APPLY]` `{L2}` Walk through OpenTrace's observability during an AI outage: OpenAI API returns 503 → circuit breaker opens → all AI requests return cached results → Prometheus alert fires (`openTrace_ai_fallback_mode=1`) → Grafana dashboard shows fallback rate → PagerDuty notifies AI team.
437. `[APPLY]` `{L2}` Design OpenTrace's AI feature flag rollout: week 1 (1% of users, shadow mode only), week 2 (5%, real results), week 3 (20%), week 4 (100%). Rollback trigger: feedback score < 0.6 for any cohort.
438. `[APPLY]` `{L2}` Walk through OpenTrace's GenAI testing strategy: unit tests (prompt template rendering, PII redaction, JSON parsing), integration tests (fake LLM server), RAGAS evaluation (weekly, quality threshold 0.8), k6 load test for AI endpoint (50 VUs, p99 < 3s).
439. `[APPLY]` `{L2}` Design the OpenTrace AI feature architecture diagram: show the complete data flow from user query → API gateway (auth, rate limit) → AI service → [Qdrant search, OpenAI API, Redis cache] → structured response → SSE stream → UI.
440. `[APPLY]` `{L2}` Describe the OpenTrace AI feature to Infraspec's technical panel: what problem it solves (mean time to diagnosis), how it works (RAG + GPT-4o), the key technical decisions (RAG vs fine-tuning, Qdrant vs pgvector), the quality metrics (feedback score 0.82), and the cost ($310/month at current scale).
441. `[APPLY]` `{L2}` Walk through how OpenTrace handles the entire span lifecycle: SDK sends span → Collector validates + Kafka → Processor writes to ClickHouse → Processor embeds and upserts to Qdrant → Query Service serves via REST + gRPC → UI displays in waterfall → AI feature explains anomalies.
442. `[APPLY]` `{L2}` Design OpenTrace's incident response AI assistant: it monitors Alertmanager, when a P1 fires it automatically: queries Prometheus for context, searches Qdrant for similar past incidents, generates a diagnosis draft in Slack, awaits engineer approval before any automated actions.
443. `[APPLY]` `{L2}` Walk through a complete OpenTrace production incident with AI assistance: 3am PagerDuty alert → engineer opens Grafana → sees span latency spike → clicks "Explain with AI" → AI identifies DB connection pool exhaustion → suggests remediation → engineer approves scale-up → incident resolved in 8 minutes (vs 45 min baseline).
444. `[APPLY]` `{L2}` Design OpenTrace's AI quality regression system: after every prompt change, run 200 test cases, compare quality scores to baseline, fail CI if mean quality drops > 5%, add new test cases when users report bad diagnoses.
445. `[APPLY]` `{L2}` Walk through the economics of building vs buying for OpenTrace's AI features: build cost (2 engineers × 3 months = $150K), vs Datadog AI Observability ($50K/year), vs the competitive advantage of owning the AI stack and training on your own data.
446. `[APPLY]` `{L2}` Design OpenTrace's AI feature roadmap: Q1 (semantic search), Q2 (anomaly explanation), Q3 (auto-remediation suggestions), Q4 (predictive alerting). What are the prerequisite data requirements for each phase?
447. `[APPLY]` `{L2}` Describe the Infraspec business case for OpenTrace's AI features: reduces MTTR from 45 min to 8 min, saves 30 engineering hours/month per team, payback period < 3 months at enterprise pricing.
448. `[APPLY]` `{L2}` Explain the OpenTrace GenAI architecture to a CTO: 3 components — (1) vector search (Qdrant, spans embedded on ingest), (2) LLM reasoning (GPT-4o with RAG context), (3) agent orchestration (tools for Prometheus/Loki/runbooks). No training required, fully explainable, cost $300/month.
449. `[APPLY]` `{L2}` Design the OpenTrace v3 roadmap with GenAI: profiles signal (continuous profiling linked to traces), predictive autoscaling (LLM + time series), automated runbook generation from historical incidents, AI-powered SLO recommendations.
450. `[APPLY]` `{L2}` Walk through the tradeoffs in OpenTrace's AI architecture: (1) RAG vs fine-tuning (chosen RAG: fresh data, no retraining), (2) GPT-4o vs GPT-4o-mini (chose mini for speed/cost, fallback to GPT-4o for complex cases), (3) Qdrant vs pgvector (chose Qdrant for scale, pgvector for dev simplicity), (4) streaming vs batch diagnosis (streaming for better UX).
451. `[APPLY]` `{L2}` Final OpenTrace observability synthesis: walk through the complete three-pillar correlation flow — PagerDuty fires → Grafana Prometheus metric shows spike → click through to Loki logs with same timestamp → find ERROR with trace_id → click to Tempo trace → identify slow ClickHouse query → click to Pyroscope flame graph → identify GC pause → click "Explain with AI" → RAG diagnosis → fix applied → incident closed.
452. `[APPLY]` `{L2}` Design OpenTrace's observability-as-code strategy: Prometheus rules as YAML in Git (validated by promtool), Grafana dashboards as Jsonnet (validated by grafonnet), Loki rules as YAML, alert routing as code. All changes via PR, applied by ArgoCD.
453. `[APPLY]` `{L2}` Walk through OpenTrace's testing strategy as an interview answer: "We have 85% unit test coverage with race detector, integration tests using testcontainers for real ClickHouse/Kafka, E2E tests with Playwright, k6 load tests in CI, and chaos tests that kill components. AI features have additional RAGAS quality evaluation and promptfoo regression tests."
454. `[APPLY]` `{L2}` Walk through OpenTrace's AI failure modes and mitigations: LLM hallucination (mitigated by grounded prompts + output validation), PII leakage (mitigated by redaction before embedding), prompt injection (mitigated by input sanitization), API outage (mitigated by circuit breaker + cached fallback), cost overrun (mitigated by per-tenant limits).
455. `[APPLY]` `{L2}` Design OpenTrace's complete feedback loop for AI quality: user clicks helpful/unhelpful → feedback stored in PostgreSQL → weekly batch: compute quality score per prompt version → if score drops, alert AI team → root cause analysis → prompt update → CI validates → deploy → monitor improvement.
456. `[APPLY]` `{L2}` Explain how OpenTrace's AI features differentiate it from Jaeger and Zipkin: "Jaeger and Zipkin only show you the data. OpenTrace shows you the data AND explains what's wrong, why it happened, and what to do about it — using the same LLM-powered RAG pipeline that surfaces similar historical incidents from your own organization's history."
457. `[APPLY]` `{L2}` Design the OpenTrace SDK AI auto-instrumentation: the SDK automatically enriches spans with `ai.*` attributes (model name, tokens, cost) when it detects OpenAI/Anthropic/Ollama calls in the instrumented application. This makes AI operations visible in OpenTrace traces.
458. `[APPLY]` `{L2}` Walk through OpenTrace's data flow for the AI-powered SLO recommendation feature: collect 30 days of latency histograms → prompt LLM with current SLO + histogram data → LLM suggests tighter SLO targets → show recommendation with confidence interval → engineer approves → SLO auto-updated in Prometheus recording rules.
459. `[APPLY]` `{L2}` Design OpenTrace's AI feature security review checklist: PII redaction (email, IP, user IDs), tenant data isolation (Qdrant filters), prompt injection prevention (input validation), output validation (JSON schema), data residency compliance (EU → Azure OpenAI), cost governance (per-tenant limits), audit logging (all LLM calls logged to Loki).
460. `[APPLY]` `{L2}` Build the business case for OpenTrace's AI observability: current state (engineers spend 45 min/incident diagnosing), AI state (8 min/incident), savings (37 min × 10 incidents/week × 50 engineers = 308 hours/week = $616K/year at $100/hour), AI cost ($310/month), ROI = 165× in year 1.
461. `[APPLY]` `{L2}` Design the OpenTrace demo for an Infraspec interview: submit a test span that has high latency → open the trace waterfall UI → navigate to the slow span → click "Explain with AI" → watch the streaming diagnosis appear → show that the diagnosis correctly identified "DB connection pool exhausted" by finding a similar historical incident → show the runbook link that the agent retrieved.
462. `[CONCEPT]` `{L2}` What is `pydantic-ai`? What is `marvin`? How do they simplify building OpenTrace's structured LLM output parsing compared to raw API calls?
463. `[CONCEPT]` `{L2}` What is `Anthropic's MCP (Model Context Protocol)`? How could OpenTrace expose its trace data as MCP tools for Claude to query directly?
464. `[CODE]` `{L2}` Design an MCP server for OpenTrace that exposes: `list_services()`, `get_trace(trace_id)`, `search_spans(query)`, `get_metrics(service, window)` as tools that Claude can call directly.
465. `[CONCEPT]` `{L2}` What is `computer use` in AI agents? When would OpenTrace use it to automate Grafana navigation and alert configuration via a vision model?
466. `[CONCEPT]` `{L2}` What is `reasoning models` (o1, o3)? When would OpenTrace use a reasoning model vs GPT-4o for complex multi-hop incident diagnosis?
467. `[CODE]` `{L2}` Route complex diagnoses to reasoning model in OpenTrace:
    ```go
    model := "gpt-4o" // default
    if incidentComplexity(trace) == "high" { model = "o3-mini" } // use reasoning for complex cases
    ```
468. `[CONCEPT]` `{L2}` What is `deep research` mode in AI? How could OpenTrace implement an async deep-research diagnosis that takes 2 minutes but performs 10+ tool calls for thorough root cause analysis?
469. `[CONCEPT]` `{L2}` What is multimodal LLM? How would OpenTrace use GPT-4o Vision to analyze a Grafana screenshot and identify the anomaly time window automatically?
470. `[CODE]` `{L2}` Send a Grafana dashboard screenshot to GPT-4o Vision for OpenTrace: encode image as base64, include in messages as `image_url` content type, ask "When did the anomaly start and what service is affected?"
471. `[CONCEPT]` `{L2}` What is `function calling streaming` in OpenAI API? How does OpenTrace stream tool calls as they happen for a more responsive agent UI?
472. `[CONCEPT]` `{L2}` What is `parallel function calling`? How does OpenTrace's diagnostic agent call `query_prometheus` AND `search_traces` simultaneously to reduce diagnosis latency?
473. `[CODE]` `{L2}` Implement parallel tool execution in OpenTrace's agent: when the LLM requests multiple tools simultaneously, execute them concurrently with `errgroup`, merge results before continuing.
474. `[CONCEPT]` `{L2}` What is `structured output` with `response_format: {type: json_schema}`? How does OpenTrace guarantee the LLM always returns a valid `Diagnosis` JSON?
475. `[CODE]` `{L2}` Use OpenAI structured output for OpenTrace diagnosis:
    ```go
    response, _ := client.CreateChatCompletion(ctx, openai.ChatCompletionRequest{
        Model: "gpt-4o",
        Messages: messages,
        ResponseFormat: &openai.ChatCompletionResponseFormat{
            Type: openai.ChatCompletionResponseFormatTypeJSONSchema,
            JSONSchema: &openai.ChatCompletionResponseFormatJSONSchema{
                Name:   "diagnosis",
                Schema: diagnosisJSONSchema,
                Strict: true,
            },
        },
    })
    ```
476. `[CONCEPT]` `{L2}` What is `prompt caching` in Anthropic Claude? How does OpenTrace cache the long system prompt (1000 tokens) to save 90% of costs on subsequent calls?
477. `[CODE]` `{L2}` Use Anthropic prompt caching for OpenTrace's system prompt:
    ```python
    messages = [
        {"role": "user", "content": [
            {"type": "text", "text": long_system_prompt, "cache_control": {"type": "ephemeral"}},
            {"type": "text", "text": user_query}
        ]}
    ]
    ```
478. `[CONCEPT]` `{L2}` What is `extended thinking` in Claude 3.7 Sonnet? How would OpenTrace use it for complex multi-component incident diagnosis that requires reasoning through 10+ possible causes?
479. `[CONCEPT]` `{L2}` What is AI-assisted code generation for OpenTrace? How does GitHub Copilot + Claude Code improve developer productivity when building new OpenTrace features?
480. `[APPLY]` `{L2}` Walk through using Claude Code to build a new OpenTrace feature: "Add AI-powered SLO recommendation" → Claude reads the codebase → generates implementation plan → writes code → runs tests → submits PR with tests passing.
481. `[APPLY]` `{L2}` Design the OpenTrace "AI Explain" feature architecture end-to-end with all the new GenAI concepts: MCP for data access, structured output for diagnosis schema, parallel tool calling for faster retrieval, prompt caching for cost reduction, streaming for responsive UX, Langfuse for observability, promptfoo for CI quality testing.
482. `[CONCEPT]` `{L2}` What is `Model Context Protocol (MCP)` in the broader context? How does it standardize tool access for LLMs, similar to how OpenTelemetry standardized observability?
483. `[CODE]` `{L2}` Write an MCP server for OpenTrace in TypeScript: expose `get_trace`, `search_traces`, `get_metrics`, `get_logs` as MCP tools. This allows Claude to query OpenTrace directly in Claude Desktop.
484. `[CONCEPT]` `{L2}` What is `agentic loop` efficiency? How does OpenTrace measure and minimize the number of LLM calls per incident diagnosis (target: < 5 tool calls per diagnosis)?
485. `[APPLY]` `{L2}` Compare OpenTrace's AI stack to Datadog's Bits AI and Dynatrace's Davis AI: what are the architectural similarities (RAG + LLM), differences (Datadog's proprietary model vs OpenTrace's open architecture), and competitive advantages (open-source, self-hostable, trainable on your own data)?
486. `[APPLY]` `{L2}` Design OpenTrace's "AI-first on-call" workflow: when PagerDuty fires, before paging the engineer, the AI agent automatically: (1) gathers context (5 tool calls), (2) assesses severity, (3) if low severity + high confidence, auto-resolves with comment, (4) if high severity, pages engineer with full diagnosis already prepared.
487. `[APPLY]` `{L2}` Design OpenTrace's AI training data flywheel: more users → more incidents → more feedback → better RAG retrieval quality → faster diagnosis → more users. Describe the data pipeline that captures each incident with its resolution for continuous improvement.
488. `[APPLY]` `{L2}` Walk through OpenTrace's GenAI compliance posture: (1) data residency (EU data to Azure OpenAI EU, US data to OpenAI US), (2) PII handling (redacted before embedding, not stored in Qdrant), (3) audit trail (all LLM calls logged with user, prompt hash, response hash), (4) right to deletion (delete user's embeddings from Qdrant on GDPR request).
489. `[APPLY]` `{L2}` Design the go-to-market strategy for OpenTrace's AI features: (1) free tier (10 AI explanations/day), (2) Pro ($99/month, 500/day), (3) Enterprise (custom pricing, self-hosted LLM option, GDPR compliance package). What feature gates exist at each tier?
490. `[APPLY]` `{L2}` Walk through the interview story for OpenTrace's AI features: "I noticed that engineers using OpenTrace spent 80% of incident time on data gathering (looking at metrics, logs, traces) and only 20% on actual reasoning. So I built an AI layer that automates the data gathering using an agent with 4 tools, and uses RAG to surface similar historical incidents. This cut mean diagnosis time from 45 minutes to 8 minutes."
491. `[CONCEPT]` `{L2}` What is `context engineering`? Why is it considered more important than prompt engineering for production AI systems like OpenTrace?
492. `[CODE]` `{L2}` Design OpenTrace's context engineering strategy: for each AI diagnosis, gather exactly the right context — current trace (always), similar historical incidents (Qdrant, top 3), recent Prometheus metrics for affected service (last 1h), relevant Loki errors (last 30 min). Cap at 3000 tokens total.
493. `[CONCEPT]` `{L2}` What is `evaluation-driven development` for AI? How does OpenTrace build AI features by writing evals first, then iterating until evals pass — similar to TDD?
494. `[CODE]` `{L2}` Write an OpenTrace AI eval using `promptfoo`: 20 test cases covering different anomaly types (DB issues, network issues, memory issues, external dependencies), assert that each diagnosis contains the correct root cause category.
495. `[CONCEPT]` `{L2}` What is `Constitutional AI`? What is `RLAIF`? How could OpenTrace use AI feedback (LLM-as-judge) to create a self-improving diagnosis system without manual labeling?
496. `[APPLY]` `{L2}` Design OpenTrace's long-term AI product vision: year 1 (reactive — explain what happened), year 2 (proactive — predict before it happens), year 3 (autonomous — self-heal common issues without human intervention), year 4 (strategic — recommend architectural improvements based on incident patterns).
497. `[APPLY]` `{L2}` Describe how OpenTrace would demonstrate AI value to a skeptical CTO: "Run a 30-day blind trial — 50% of incidents get AI diagnosis, 50% don't. Measure MTTR for each group. We expect 35-minute improvement. Cost: $310/month. Conservatively worth $50K/month in engineering time saved."
498. `[APPLY]` `{L2}` Walk through the technical challenges of building OpenTrace's AI features that you would mention in an Infraspec interview: (1) multi-tenant vector isolation (Qdrant filter design), (2) prompt injection from span data, (3) hallucination in diagnosis (mitigated by grounding), (4) latency budget with streaming LLM, (5) cost at scale (token optimization + caching).
499. `[APPLY]` `{L2}` Design the OpenTrace AI contribution to open source: publish `go-observability-ai` library on GitHub — a Go SDK that adds AI diagnosis to any OpenTelemetry-compatible observability backend. Include: Qdrant client, OpenAI integration, RAG pipeline, structured output parsing. Apache 2.0 license.
500. `[APPLY]` `{L1}` Final synthesis: You are at your Infraspec technical interview. Walk through the complete OpenTrace system in 10 minutes: architecture (7 components), observability (Prometheus + Loki + Tempo + Grafana), testing (unit → integration → E2E → load → chaos), and GenAI features (RAG diagnosis with Qdrant + GPT-4o, agent with 4 tools, semantic search, cost $310/month). End with: "The AI layer is what transforms OpenTrace from another Jaeger clone into a product that actually reduces MTTR by 80% — and that's the story I'm most proud of."
