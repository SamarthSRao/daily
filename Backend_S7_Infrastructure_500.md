# Backend Engineering — Section 7: Infrastructure, DevOps & Security
### 500 Questions | Docker · Kubernetes · Terraform · AWS · CI/CD · Security · Cost
> Mapped to Backend 2026 Roadmap Stages 9, 11 | Infraspec Target
> Tagged: [CONCEPT] [CODE] [DEBUG] [TRADEOFF] [DESIGN] [APPLY]
> Levels: {L1} must know · {L2} mid/senior · {L3} staff/platform

---

# PART A — Docker (Q1–Q80)

---

## Docker Fundamentals (Q1–Q40)

1. `[CONCEPT]` `{L1}` What is Docker? What problem does it solve vs installing software directly on a host?
2. `[CONCEPT]` `{L1}` What is a Docker image? What is a Docker container? What is the relationship between them?
3. `[CONCEPT]` `{L1}` What is a Docker layer? How does layer caching work? Why does layer order matter in a Dockerfile?
4. `[CONCEPT]` `{L1}` What is the difference between `CMD` and `ENTRYPOINT` in a Dockerfile? When do you use each?
5. `[CODE]` `{L1}` Write a Dockerfile for OpenTrace Collector: single-stage build, `FROM golang:1.23`, `COPY go.mod go.sum`, `RUN go mod download`, `COPY .`, `RUN go build`, `CMD`.
6. `[CONCEPT]` `{L1}` What is a multi-stage Docker build? Why does it reduce image size from 900MB to ~20MB?
7. `[CODE]` `{L1}` Write a multi-stage Dockerfile for OpenTrace Collector: builder stage compiles Go binary, runner stage uses `gcr.io/distroless/static`. Compare image sizes.
8. `[CONCEPT]` `{L1}` What is `gcr.io/distroless/static` vs `alpine` vs `scratch` as a base image? What are the security and size tradeoffs?
9. `[CODE]` `{L2}` Write a production Dockerfile for OpenTrace Collector: multi-stage, distroless base, non-root user `USER 65534:65534`, read-only filesystem, `HEALTHCHECK`.
10. `[CONCEPT]` `{L1}` What is a `.dockerignore` file? What should OpenTrace exclude: `.git`, `vendor`, `*.test`, `node_modules`, `dist`?
11. `[CODE]` `{L1}` Write `.dockerignore` for OpenTrace: exclude git, test files, local config, coverage reports. Show impact on build context size.
12. `[CONCEPT]` `{L2}` What is `docker build --cache-from`? How does OpenTrace's CI use it to speed up builds by reusing layers from the previous image?
13. `[CODE]` `{L2}` Use BuildKit cache mounts in OpenTrace's Dockerfile: `RUN --mount=type=cache,target=/go/pkg/mod go build`. This caches module downloads across builds.
14. `[CONCEPT]` `{L2}` What is BuildKit? What does it enable over the classic Docker builder: parallel stages, secret mounts, cache mounts, SSH forwarding?
15. `[CODE]` `{L2}` Enable BuildKit for OpenTrace's Docker build: `DOCKER_BUILDKIT=1 docker build .` or `docker buildx build .`.
16. `[CONCEPT]` `{L1}` What is a Docker volume? What is a bind mount? What is `tmpfs`? When does OpenTrace use each?
17. `[CODE]` `{L1}` Run OpenTrace Collector with a bind mount for config: `docker run -v /etc/openTrace:/config:ro openTrace-collector`.
18. `[CONCEPT]` `{L2}` What is `docker compose`? What is a `docker-compose.yml`? When does OpenTrace use it for local development?
19. `[CODE]` `{L2}` Write a `docker-compose.yml` for OpenTrace local dev: Collector, Kafka (Redpanda), ClickHouse, PostgreSQL, Redis. Set `depends_on` with health checks.
20. `[CONCEPT]` `{L2}` What is `HEALTHCHECK` in a Dockerfile? How does OpenTrace's Collector define its health check?
21. `[CODE]` `{L2}` Add `HEALTHCHECK` to OpenTrace Collector's Dockerfile: `HEALTHCHECK --interval=30s --timeout=10s --retries=3 CMD wget -qO- http://localhost:8080/health/live || exit 1`.
22. `[CONCEPT]` `{L2}` What is `docker inspect`? How do you find OpenTrace Collector's container IP, port bindings, and environment variables?
23. `[CODE]` `{L2}` Use `docker inspect openTrace-collector --format '{{.NetworkSettings.IPAddress}}'` to get the container IP.
24. `[CONCEPT]` `{L2}` What is `docker stats`? How do you monitor OpenTrace Collector's CPU and memory usage in real-time?
25. `[CODE]` `{L2}` Run `docker stats openTrace-collector --format "CPU: {{.CPUPerc}}, MEM: {{.MemUsage}}"` to monitor resource usage.
26. `[CONCEPT]` `{L2}` What is `docker exec`? How do you get a shell into a running OpenTrace container for debugging?
27. `[CODE]` `{L2}` Debug OpenTrace container: `docker exec -it openTrace-collector /bin/sh`. But distroless has no shell — how do you debug a distroless container?
28. `[CONCEPT]` `{L2}` How do you debug a distroless container? Options: `docker debug`, `kubectl debug`, or ephemeral container with `busybox`.
29. `[CODE]` `{L2}` Debug distroless OpenTrace container: `docker run --rm --pid container:openTrace-collector --network container:openTrace-collector -it busybox sh`.
30. `[CONCEPT]` `{L2}` What is a Docker network? What are the modes: bridge, host, overlay, none? When does OpenTrace use host networking for maximum performance?
31. `[CODE]` `{L2}` Run OpenTrace Collector with host networking: `docker run --network host openTrace-collector`. When is this appropriate and when is it a security risk?
32. `[CONCEPT]` `{L2}` What is `docker system prune`? What does it clean? How often should OpenTrace's CI runners run it?
33. `[CONCEPT]` `{L2}` What is a Docker registry? What is ECR (AWS), GHCR (GitHub), Docker Hub? How does OpenTrace push to ECR?
34. `[CODE]` `{L2}` Push OpenTrace image to ECR: `aws ecr get-login-password | docker login --username AWS --password-stdin $ECR_URL && docker push $ECR_URL/openTrace-collector:$TAG`.
35. `[CONCEPT]` `{L2}` What is image vulnerability scanning? What is `trivy`? What is `grype`? How does OpenTrace's CI block deploys with CRITICAL CVEs?
36. `[CODE]` `{L2}` Run `trivy image openTrace-collector:latest --severity CRITICAL,HIGH --exit-code 1` in CI. This fails the build if any critical vulnerabilities are found.
37. `[CONCEPT]` `{L2}` What is `docker sbom` (Software Bill of Materials)? When does OpenTrace generate an SBOM for security compliance?
38. `[CONCEPT]` `{L2}` What is OCI (Open Container Initiative) image format? How does it differ from Docker's image format?
39. `[CODE]` `{L2}` Use `docker buildx` for multi-platform builds: `docker buildx build --platform linux/amd64,linux/arm64 -t openTrace-collector:latest --push .`.
40. `[TRADEOFF]` `{L2}` Distroless vs Alpine vs scratch for OpenTrace's base image: compare size, security surface, debugging ability, and compatibility.

---

## Docker Security & Best Practices (Q41–Q80)

41. `[CONCEPT]` `{L1}` What is running as non-root in Docker? Why does OpenTrace use `USER 65534:65534` (nobody)?
42. `[CODE]` `{L1}` Add non-root user to OpenTrace Dockerfile: `USER 65534:65534` in the runner stage. Verify: `docker run openTrace-collector whoami` → `nobody`.
43. `[CONCEPT]` `{L2}` What is a read-only root filesystem in Docker? Why does OpenTrace use `--read-only` for the Collector container?
44. `[CODE]` `{L2}` Run OpenTrace with read-only filesystem: `docker run --read-only --tmpfs /tmp openTrace-collector`. What directories need tmpfs mounts?
45. `[CONCEPT]` `{L2}` What is `--cap-drop ALL --cap-add NET_BIND_SERVICE` for Docker? How does OpenTrace minimize Linux capabilities?
46. `[CODE]` `{L2}` Run OpenTrace Collector with dropped capabilities: `docker run --cap-drop ALL --security-opt no-new-privileges openTrace-collector`.
47. `[CONCEPT]` `{L2}` What is a seccomp profile in Docker? What is the default Docker seccomp profile? How does OpenTrace use a custom restricted profile?
48. `[CONCEPT]` `{L2}` What are Docker secrets vs environment variables? Why should OpenTrace's database password not be in `ENV` in the Dockerfile?
49. `[CODE]` `{L2}` Pass OpenTrace's PostgreSQL password via Docker secret: `docker run --secret id=pg_password,src=./pg_password.txt openTrace-collector`. Read from `/run/secrets/pg_password`.
50. `[CONCEPT]` `{L2}` What is `--no-cache` in Docker build? When does OpenTrace's CI force a clean build to pick up security patches?
51. `[CONCEPT]` `{L2}` What is image pinning? Why does OpenTrace pin base images to digest (`FROM golang:1.23@sha256:abc...`) instead of tags?
52. `[CODE]` `{L2}` Pin OpenTrace's base image: `FROM golang:1.23.4@sha256:abc123... AS builder`. This prevents unexpected base image changes.
53. `[CONCEPT]` `{L2}` What is Hadolint? How does OpenTrace use it to lint Dockerfiles in CI?
54. `[CODE]` `{L2}` Add Hadolint to OpenTrace CI: `hadolint Dockerfile --ignore DL3008 --ignore DL3009`. Show common Dockerfile anti-patterns it catches.
55. `[CONCEPT]` `{L2}` What is `COPY --chown` vs `RUN chown` in Dockerfile? Why does `COPY --chown` produce fewer layers?
56. `[CODE]` `{L2}` Use `COPY --chown=65534:65534` in OpenTrace Dockerfile to set file ownership in one step instead of a separate `RUN chown`.
57. `[CONCEPT]` `{L2}` What is Docker Content Trust (DCT)? How does it verify image signatures?
58. `[CONCEPT]` `{L2}` What is `docker login` with OIDC? How does OpenTrace's CI authenticate to ECR using GitHub Actions OIDC without stored credentials?
59. `[CODE]` `{L2}` Configure ECR authentication in OpenTrace's GitHub Actions: use `aws-actions/configure-aws-credentials` with OIDC role, no static AWS keys.
60. `[CONCEPT]` `{L2}` What is layer deduplication in Docker? How does OpenTrace's monorepo share base layers between Collector, Processor, and Query Service images?
61. `[CODE]` `{L2}` Create a shared base image for OpenTrace: `openTrace-base` with Go toolchain + common dependencies. All services `FROM openTrace-base AS builder`.
62. `[CONCEPT]` `{L2}` What is `docker image ls --digests`? How do you verify OpenTrace's deployed image matches what CI built?
63. `[CODE]` `{L2}` Verify OpenTrace deployment integrity: compare `docker image ls openTrace-collector --digests` on the deployed node with the CI-produced digest.
64. `[CONCEPT]` `{L2}` What is `dive` for Docker image analysis? How do you find which Dockerfile instruction adds the most size?
65. `[CODE]` `{L2}` Run `dive openTrace-collector:latest` to analyze layer efficiency. Identify wasted space (e.g., test files not cleaned up, apt cache not removed).
66. `[CONCEPT]` `{L2}` What is `docker buildx bake`? How does OpenTrace build all 7 component images in parallel?
67. `[CODE]` `{L2}` Write a `docker-bake.hcl` for OpenTrace: define 7 targets (collector, processor, query, gateway, ui, sdk, init), build all in parallel.
68. `[CONCEPT]` `{L3}` What is an OCI artifact? How does OpenTrace store Helm charts and SBOM alongside container images in ECR?
69. `[CONCEPT]` `{L2}` What is `docker manifest`? How does OpenTrace create a multi-arch manifest list pointing to amd64 and arm64 images?
70. `[CODE]` `{L2}` Create OpenTrace multi-arch manifest: `docker manifest create openTrace:latest openTrace:amd64 openTrace:arm64`. Push with `docker manifest push`.
71. `[CONCEPT]` `{L2}` What is `--platform` in Docker `FROM` for cross-compilation? How does OpenTrace build ARM64 images on AMD64 CI runners?
72. `[CODE]` `{L2}` Add QEMU emulation for cross-platform builds: `docker run --rm --privileged multiarch/qemu-user-static --reset -p yes`. Then `docker buildx build --platform linux/arm64`.
73. `[CONCEPT]` `{L2}` What is `EXPOSE` in Dockerfile? Is it documentation or does it actually open a port?
74. `[CODE]` `{L2}` Add `EXPOSE 4317/tcp` (gRPC) and `EXPOSE 8080/tcp` (HTTP) to OpenTrace Collector Dockerfile. Explain it's metadata only.
75. `[CONCEPT]` `{L2}` What is `ARG` vs `ENV` in Dockerfile? When does OpenTrace use `ARG` for build-time variables like git SHA?
76. `[CODE]` `{L2}` Pass git SHA to OpenTrace image: `ARG GIT_SHA`, `ENV APP_VERSION=$GIT_SHA`, `docker build --build-arg GIT_SHA=$(git rev-parse HEAD)`.
77. `[CONCEPT]` `{L2}` What is `docker network create`? How does OpenTrace's docker-compose create an isolated network for all services?
78. `[CONCEPT]` `{L2}` What is `--init` in Docker run? Why does OpenTrace use it to handle zombie processes in the container?
79. `[DEBUG]` `{L2}` OpenTrace Collector container exits with code 137 (OOMKilled). How do you diagnose: check `docker inspect --format '{{.State.OOMKilled}}'`, then tune memory limits.
80. `[APPLY]` `{L2}` Design OpenTrace's complete Docker strategy: multi-stage builds, distroless base, non-root, read-only FS, BuildKit cache mounts, multi-arch, trivy scanning, ECR OIDC push, size target < 25MB.

---

# PART B — Kubernetes (Q81–Q200)

---

## Kubernetes Core Concepts (Q81–Q130)

81. `[CONCEPT]` `{L1}` What is Kubernetes? What problem does it solve vs running Docker containers directly?
82. `[CONCEPT]` `{L1}` What is a Pod? What is a Deployment? What is a Service? What is an Ingress? How do they relate?
83. `[CONCEPT]` `{L1}` What is the Kubernetes control plane? What are: kube-apiserver, etcd, kube-scheduler, kube-controller-manager?
84. `[CONCEPT]` `{L1}` What is a node? What is kubelet? What is kube-proxy? What is a container runtime (containerd)?
85. `[CODE]` `{L1}` Write a minimal Kubernetes Deployment for OpenTrace Collector: 3 replicas, container image, ports, resource requests/limits.
86. `[CODE]` `{L1}` Write a Kubernetes Service for OpenTrace Collector: `ClusterIP` type, port 4317 (gRPC), port 8080 (HTTP), selector by `app: openTrace-collector`.
87. `[CODE]` `{L1}` Write a Kubernetes Ingress for OpenTrace: `collector.openTrace.dev → collector:4317`, `ui.openTrace.dev → ui:3000`. TLS with cert-manager annotation.
88. `[CONCEPT]` `{L1}` What is a ConfigMap? What is a Secret? How does OpenTrace use each?
89. `[CODE]` `{L1}` Create a ConfigMap for OpenTrace's Kafka topic config. Create a Secret for the ClickHouse password. Mount both in the Collector pod.
90. `[CONCEPT]` `{L1}` What is a readiness probe vs liveness probe vs startup probe? What does each test?
91. `[CODE]` `{L1}` Configure probes for OpenTrace Collector: readiness = `GET /health/ready` (Kafka connected), liveness = `GET /health/live` (process alive), startup = `GET /health/live` with `failureThreshold: 30`.
92. `[CONCEPT]` `{L1}` What are resource requests vs limits? What happens when a container exceeds its memory limit (OOMKill) vs CPU limit (throttled)?
93. `[CODE]` `{L1}` Set resources for OpenTrace Collector: `requests: {cpu: 100m, memory: 256Mi}`, `limits: {cpu: 500m, memory: 1Gi}`. Set `GOMEMLIMIT=900MiB` env var.
94. `[CONCEPT]` `{L2}` What is HPA (Horizontal Pod Autoscaler)? What metrics can it scale on: CPU, memory, custom metrics?
95. `[CODE]` `{L2}` Create HPA for OpenTrace Collector: scale 2–20 replicas based on custom metric `kafka_consumer_lag > 10000` from Prometheus Adapter.
96. `[CONCEPT]` `{L2}` What is VPA (Vertical Pod Autoscaler)? When would OpenTrace use VPA instead of or alongside HPA?
97. `[CONCEPT]` `{L2}` What is PodDisruptionBudget (PDB)? How does OpenTrace ensure at least 2 Collector replicas are always running during node maintenance?
98. `[CODE]` `{L2}` Create PDB for OpenTrace Collector: `minAvailable: 2`. This prevents all pods from being evicted simultaneously.
99. `[CONCEPT]` `{L2}` What is rolling update strategy? What are `maxSurge` and `maxUnavailable`?
100. `[CODE]` `{L2}` Configure rolling update for OpenTrace Collector: `maxSurge: 1`, `maxUnavailable: 0`. Zero-downtime deployment.
101. `[CONCEPT]` `{L2}` What is a StatefulSet? When does OpenTrace's ClickHouse cluster use StatefulSet instead of Deployment?
102. `[CODE]` `{L2}` Write a StatefulSet for OpenTrace's ClickHouse: stable pod names (clickhouse-0, clickhouse-1), PersistentVolumeClaim templates.
103. `[CONCEPT]` `{L2}` What is a DaemonSet? When does OpenTrace use it for the log collector (Fluentd on every node)?
104. `[CODE]` `{L2}` Write a DaemonSet for OpenTrace's Fluentd log collector: runs on every node, mounts `/var/log/containers` as hostPath.
105. `[CONCEPT]` `{L2}` What is a CronJob? How does OpenTrace use it for daily ClickHouse partition creation?
106. `[CODE]` `{L2}` Write a CronJob for OpenTrace: runs at `0 0 * * *`, creates next month's ClickHouse partition, uses the same image as the Query Service.
107. `[CONCEPT]` `{L2}` What is a Kubernetes Job? When does OpenTrace use it for one-time database migrations?
108. `[CODE]` `{L2}` Write a Kubernetes Job for OpenTrace's database migration: runs `golang-migrate` on startup, `restartPolicy: OnFailure`, `backoffLimit: 3`.
109. `[CONCEPT]` `{L2}` What is a ServiceAccount? What is IRSA (IAM Role for Service Account)? How does OpenTrace Collector write to S3 without hardcoded credentials?
110. `[CODE]` `{L2}` Configure IRSA for OpenTrace Collector: create ServiceAccount with `eks.amazonaws.com/role-arn` annotation, IAM role with S3:PutObject, bind in pod spec.
111. `[CONCEPT]` `{L2}` What is a NetworkPolicy? How does OpenTrace restrict Collector to only communicate with Kafka and PostgreSQL?
112. `[CODE]` `{L2}` Write NetworkPolicy for OpenTrace Collector: deny all ingress/egress, allow ingress on 4317, egress to Kafka (9092), PostgreSQL (5432), CoreDNS (53).
113. `[CONCEPT]` `{L2}` What is a PersistentVolume (PV) and PersistentVolumeClaim (PVC)? What is a StorageClass?
114. `[CODE]` `{L2}` Write PVC for OpenTrace ClickHouse: `storageClassName: gp3`, `resources.requests.storage: 1Ti`, `accessModes: ReadWriteOnce`.
115. `[CONCEPT]` `{L2}` What is pod affinity vs anti-affinity? How does OpenTrace prevent two Collector pods from running on the same node?
116. `[CODE]` `{L2}` Add pod anti-affinity to OpenTrace Collector: `podAntiAffinity.requiredDuringSchedulingIgnoredDuringExecution`, `topologyKey: kubernetes.io/hostname`.
117. `[CONCEPT]` `{L2}` What is `topologySpreadConstraints`? How does OpenTrace spread pods across AZs?
118. `[CODE]` `{L2}` Add topologySpreadConstraints to OpenTrace: spread across 3 AZs with `maxSkew: 1`, `topologyKey: topology.kubernetes.io/zone`.
119. `[CONCEPT]` `{L2}` What is a Taint and Toleration? How does OpenTrace dedicate nodes to ClickHouse?
120. `[CODE]` `{L2}` Add taint to ClickHouse nodes: `kubectl taint nodes ch-node dedicated=clickhouse:NoSchedule`. Add toleration to ClickHouse pods.
121. `[CONCEPT]` `{L2}` What is node affinity? How does OpenTrace schedule ClickHouse only on `r6i.4xlarge` (memory-optimized) nodes?
122. `[CODE]` `{L2}` Add node affinity to OpenTrace ClickHouse: require `node.kubernetes.io/instance-type: r6i.4xlarge`.
123. `[CONCEPT]` `{L2}` What is `kubectl rollout`? What are `status`, `history`, `undo`? How does OpenTrace roll back a bad deployment?
124. `[CODE]` `{L2}` Roll back OpenTrace Collector: `kubectl rollout undo deployment/openTrace-collector`. Verify: `kubectl rollout status deployment/openTrace-collector`.
125. `[CONCEPT]` `{L2}` What is `kubectl port-forward`? How does OpenTrace developer access pprof endpoint from a running pod?
126. `[CODE]` `{L2}` Access OpenTrace Collector pprof: `kubectl port-forward pod/openTrace-collector-xyz 6060:6060`. Then `go tool pprof http://localhost:6060/debug/pprof/profile`.
127. `[CONCEPT]` `{L2}` What is `kubectl top pod`? What is `kubectl top node`? How does OpenTrace identify the highest memory consumer?
128. `[CODE]` `{L2}` Find OpenTrace's memory-hungry pod: `kubectl top pod -n openTrace --sort-by=memory | head -5`.
129. `[CONCEPT]` `{L2}` What is QoS class in Kubernetes: Guaranteed, Burstable, BestEffort? What class does OpenTrace Collector get?
130. `[CODE]` `{L2}` Debug OpenTrace pod eviction: `kubectl describe pod openTrace-collector-xyz | grep -A5 Conditions`. Check `OOMKilled` in `kubectl get events`.

---

## Kubernetes Advanced (Q131–Q200)

131. `[CONCEPT]` `{L2}` What is cert-manager? How does it automate TLS certificate issuance for OpenTrace?
132. `[CODE]` `{L2}` Write cert-manager ClusterIssuer for OpenTrace: Let's Encrypt production, DNS-01 challenge via Cloudflare. Annotate Ingress to auto-issue certificate.
133. `[CONCEPT]` `{L2}` What is ExternalDNS? How does it create Cloudflare DNS records when OpenTrace Ingress is deployed?
134. `[CODE]` `{L2}` Deploy ExternalDNS for OpenTrace: configure with Cloudflare API token, `--domain-filter=openTrace.dev`, watch Ingress resources.
135. `[CONCEPT]` `{L2}` What is Kubernetes RBAC? What is a Role vs ClusterRole vs RoleBinding vs ClusterRoleBinding?
136. `[CODE]` `{L2}` Create RBAC for OpenTrace Operator: ClusterRole with get/list/watch on deployments and configmaps, bind to ServiceAccount.
137. `[CONCEPT]` `{L2}` What is a Kubernetes Operator? What is a Custom Resource Definition (CRD)?
138. `[CODE]` `{L2}` Define a CRD for OpenTrace: `OpenTraceCluster` resource with spec for replica counts, storage sizes, and Kafka bootstrap servers.
139. `[CONCEPT]` `{L2}` What is Helm? What is a chart? What is `values.yaml`? How does OpenTrace publish a Helm chart?
140. `[CODE]` `{L2}` Create a Helm chart for OpenTrace Collector: templates for Deployment, Service, ServiceAccount, ConfigMap. Parametrize image tag and replica count in `values.yaml`.
141. `[CONCEPT]` `{L2}` What is Kustomize? How does OpenTrace use it for environment overlays (dev vs staging vs prod)?
142. `[CODE]` `{L2}` Write Kustomize overlays for OpenTrace: base (common), dev (1 replica, small resources), prod (3 replicas, larger resources, HPA).
143. `[CONCEPT]` `{L2}` What is GitOps? What is ArgoCD? How does OpenTrace deploy from Git without direct `kubectl apply`?
144. `[CODE]` `{L2}` Write ArgoCD Application for OpenTrace: sync from `github.com/org/openTrace-k8s`, auto-sync with prune, self-heal.
145. `[CONCEPT]` `{L2}` What is Flux? How does it compare to ArgoCD for OpenTrace's GitOps?
146. `[CONCEPT]` `{L2}` What is Argo Rollouts? What is a canary deployment? How does OpenTrace shift 5% → 20% → 100% of traffic to a new version?
147. `[CODE]` `{L2}` Write Argo Rollouts canary for OpenTrace Collector: steps 5%, 20%, 100%, 5-minute pause at each step, auto-rollback if error rate > 1%.
148. `[CONCEPT]` `{L2}` What is Karpenter? How does it provision EC2 nodes faster than cluster-autoscaler for OpenTrace's traffic spikes?
149. `[CONCEPT]` `{L2}` What is Velero? How does it backup OpenTrace's Kubernetes resources and PVCs to S3?
150. `[CODE]` `{L2}` Schedule Velero backup for OpenTrace: `velero schedule create openTrace-daily --schedule="0 2 * * *" --include-namespaces openTrace`.
151. `[CONCEPT]` `{L2}` What is the Kubernetes admission controller? What is OPA (Open Policy Agent) Gatekeeper? How does it enforce OpenTrace's security policies?
152. `[CODE]` `{L2}` Write OPA Gatekeeper constraint for OpenTrace: require all pods to have resource limits set, require `runAsNonRoot: true`.
153. `[CONCEPT]` `{L2}` What is Kubernetes `ResourceQuota`? How does it prevent OpenTrace from consuming all cluster resources?
154. `[CODE]` `{L2}` Write ResourceQuota for OpenTrace namespace: `requests.cpu: 16`, `requests.memory: 32Gi`, `limits.memory: 64Gi`, `count/pods: 100`.
155. `[CONCEPT]` `{L2}` What is `LimitRange`? How does it set default resource requests/limits for pods in OpenTrace's namespace?
156. `[CODE]` `{L2}` Write LimitRange for OpenTrace: default container memory request 128Mi, default limit 512Mi. Prevents unbounded resource consumption.
157. `[CONCEPT]` `{L2}` What is a PriorityClass? How does OpenTrace's Collector get higher scheduling priority than the UI?
158. `[CODE]` `{L2}` Create PriorityClass for OpenTrace: `collector-critical` (1000), `query-high` (500), `ui-normal` (0). Assign to respective deployments.
159. `[CONCEPT]` `{L2}` What is an init container? How does OpenTrace wait for Kafka to be ready before starting the Collector?
160. `[CODE]` `{L2}` Add init container to OpenTrace Collector pod: busybox that runs `nc -z kafka:9092` in a loop until Kafka responds, then exits 0.
161. `[CONCEPT]` `{L2}` What is a sidecar container? How does OpenTrace use an OTel Collector sidecar vs DaemonSet approach?
162. `[CONCEPT]` `{L2}` What is ephemeral container in Kubernetes? How do you add a debug container to a running distroless pod?
163. `[CODE]` `{L2}` Add ephemeral container to running OpenTrace pod: `kubectl debug -it openTrace-collector-xyz --image=busybox --target=openTrace-collector`.
164. `[CONCEPT]` `{L2}` What is `kubectl events`? How does OpenTrace's on-call use it to diagnose why a pod is not starting?
165. `[CODE]` `{L2}` Diagnose failing OpenTrace pod: `kubectl get events -n openTrace --field-selector involvedObject.name=openTrace-collector-xyz --sort-by=.lastTimestamp`.
166. `[CONCEPT]` `{L2}` What is `kubectl drain` vs `kubectl cordon`? How do you safely remove a node from OpenTrace's cluster?
167. `[DEBUG]` `{L2}` OpenTrace Collector pods are in `Pending` state. `kubectl describe pod` shows `Insufficient memory`. What are the options: add nodes, reduce requests, or use spot instances?
168. `[DEBUG]` `{L2}` OpenTrace pod is in `CrashLoopBackOff`. How do you get the previous container logs: `kubectl logs --previous openTrace-collector-xyz`?
169. `[DEBUG]` `{L2}` OpenTrace pod stuck in `Terminating` for 10 minutes. How do you force delete: `kubectl delete pod openTrace-collector-xyz --grace-period=0 --force`?
170. `[CONCEPT]` `{L2}` What is `kubectl diff`? How does OpenTrace verify what will change before applying a new Kubernetes manifest?
171. `[CODE]` `{L2}` Dry-run OpenTrace deployment: `kubectl apply --dry-run=server -f deployment.yaml`. Then `kubectl diff -f deployment.yaml` to see changes.
172. `[CONCEPT]` `{L2}` What is the Kubernetes API rate limit? How does OpenTrace's CI avoid hitting the rate limit when deploying many resources at once?
173. `[CONCEPT]` `{L2}` What is `kubectl wait`? How does OpenTrace's deployment script wait for rollout to complete?
174. `[CODE]` `{L2}` Wait for OpenTrace deployment: `kubectl wait deployment/openTrace-collector --for=condition=Available --timeout=5m -n openTrace`.
175. `[CONCEPT]` `{L2}` What is Kubernetes server-side apply? How does it handle conflict when multiple tools modify the same resource?
176. `[CODE]` `{L2}` Use server-side apply for OpenTrace: `kubectl apply --server-side -f deployment.yaml`. Shows field manager ownership.
177. `[CONCEPT]` `{L2}` What is `kubectl get --watch`? How does OpenTrace's on-call monitor rolling deployment status in real-time?
178. `[CODE]` `{L2}` Monitor OpenTrace deployment: `kubectl get pods -n openTrace -l app=openTrace-collector --watch` to see pod creation and readiness in real-time.
179. `[CONCEPT]` `{L2}` What is Kubernetes `imagePullPolicy: Always` vs `IfNotPresent`? When does OpenTrace use each?
180. `[CONCEPT]` `{L3}` What is the Kubernetes container resource model for GPU? How would OpenTrace's fraud detection ML inference use NVIDIA GPUs in Kubernetes?
181. `[CONCEPT]` `{L2}` What is a Kubernetes Operator lifecycle: watch → reconcile → update? How does OpenTrace's Operator handle a ClickHouse node failure?
182. `[CODE]` `{L2}` Sketch OpenTrace Operator reconcile loop: if `openTraceCluster.spec.replicas != deployment.spec.replicas`, update deployment. If ClickHouse is not ready, requeue.
183. `[CONCEPT]` `{L2}` What is `kubectl scale`? How do you manually scale OpenTrace Collector during an incident?
184. `[CODE]` `{L2}` Scale OpenTrace Collector during incident: `kubectl scale deployment/openTrace-collector --replicas=10 -n openTrace`. Monitor with `kubectl get pods -w`.
185. `[CONCEPT]` `{L2}` What is KEDA (Kubernetes Event-Driven Autoscaler)? How does it scale OpenTrace based on Kafka consumer lag without Prometheus Adapter?
186. `[CODE]` `{L2}` Create KEDA ScaledObject for OpenTrace Collector: scale 2–20 replicas based on Kafka topic `spans` consumer group lag > 10000.
187. `[CONCEPT]` `{L2}` What is Kubernetes Pod Topology Spread? What is `whenUnsatisfiable: DoNotSchedule` vs `ScheduleAnyway`?
188. `[CONCEPT]` `{L3}` What is the Kubernetes scheduler extender? How would a custom scheduler prioritize OpenTrace's Collector pods on NUMA-aware nodes?
189. `[CONCEPT]` `{L2}` What is `kubectl config`? What is a kubeconfig context? How does OpenTrace's team manage access to dev/staging/prod clusters?
190. `[CODE]` `{L2}` Use `kubectl config use-context openTrace-prod` to switch context. Verify: `kubectl config current-context`.
191. `[CONCEPT]` `{L2}` What is Service Mesh (Istio/Linkerd)? What does it add to OpenTrace's Kubernetes networking: mTLS, retries, circuit breaking, distributed tracing?
192. `[CODE]` `{L2}` Enable Istio sidecar injection for OpenTrace namespace: `kubectl label namespace openTrace istio-injection=enabled`. This adds Envoy sidecar to every pod.
193. `[CONCEPT]` `{L2}` What is Kubernetes Secrets encryption at rest? How does OpenTrace enable envelope encryption for Secrets using AWS KMS?
194. `[CONCEPT]` `{L2}` What is External Secrets Operator? How does OpenTrace sync secrets from AWS Secrets Manager to Kubernetes Secrets automatically?
195. `[CODE]` `{L2}` Write ExternalSecret for OpenTrace: sync `openTrace/clickhouse-password` from AWS Secrets Manager to Kubernetes Secret.
196. `[CONCEPT]` `{L2}` What is Kubernetes `ownerReferences`? How does garbage collection work when a Deployment is deleted?
197. `[CONCEPT]` `{L2}` What is `kubectl api-resources`? How do you list all CRDs installed in the OpenTrace cluster?
198. `[CONCEPT]` `{L2}` What is `kubectl explain`? How does OpenTrace developer explore the Kubernetes API schema?
199. `[CONCEPT]` `{L2}` What is Kubernetes audit logging? How does OpenTrace enable it to track who made what changes to the cluster?
200. `[APPLY]` `{L2}` Design the complete Kubernetes architecture for OpenTrace: 7 components, RBAC, NetworkPolicies, HPA, PDB, cert-manager, ExternalDNS, ArgoCD, Velero backup, node groups for different workloads.

---

# PART C — Terraform & AWS (Q201–Q300)

---

## Terraform (Q201–Q250)

201. `[CONCEPT]` `{L1}` What is Terraform? What is HCL? What is the `plan → apply` workflow?
202. `[CONCEPT]` `{L1}` What is Terraform state? Where does OpenTrace store it: S3 backend with DynamoDB lock?
203. `[CODE]` `{L1}` Write Terraform backend config for OpenTrace: S3 state bucket, DynamoDB lock table, state encryption with KMS.
204. `[CONCEPT]` `{L1}` What is a Terraform module? How does OpenTrace use modules for reusable infrastructure components?
205. `[CODE]` `{L1}` Write a Terraform module for OpenTrace ECS Fargate service: input variables for image, cpu, memory, env vars; output the service ARN.
206. `[CONCEPT]` `{L2}` What is `terraform plan` vs `terraform apply`? What is `terraform destroy`? What is `-target`?
207. `[CODE]` `{L2}` Run Terraform plan for OpenTrace and save the plan: `terraform plan -out=openTrace.tfplan`. Apply the saved plan: `terraform apply openTrace.tfplan`.
208. `[CONCEPT]` `{L2}` What is `terraform import`? When does OpenTrace use it to bring manually created AWS resources under Terraform management?
209. `[CONCEPT]` `{L2}` What is `terraform workspace`? How does OpenTrace use workspaces for dev/staging/prod environments?
210. `[CODE]` `{L2}` Use Terraform workspaces for OpenTrace: `terraform workspace new staging`, `terraform workspace select staging`, apply with workspace-specific `tfvars`.
211. `[CONCEPT]` `{L2}` What is `terraform fmt` and `terraform validate`? How does OpenTrace's CI enforce formatting?
212. `[CODE]` `{L2}` Add Terraform quality checks to OpenTrace's CI: `terraform fmt -check`, `terraform validate`, `tflint --recursive`. Fail on any issue.
213. `[CONCEPT]` `{L2}` What is `tfsec` / `checkov`? How does OpenTrace scan Terraform for security misconfigurations?
214. `[CODE]` `{L2}` Run `tfsec .` on OpenTrace's Terraform. Common findings: S3 bucket not encrypted, security groups too permissive, no MFA delete on S3.
215. `[CONCEPT]` `{L2}` What is `terraform output`? How does OpenTrace CI extract the ECS cluster ARN after apply?
216. `[CODE]` `{L2}` Output OpenTrace's ECS cluster ARN: `output "cluster_arn" { value = aws_ecs_cluster.openTrace.arn }`. Use in `terraform output -raw cluster_arn`.
217. `[CONCEPT]` `{L2}` What is `depends_on` in Terraform? When does OpenTrace explicitly declare dependencies between resources?
218. `[CODE]` `{L2}` Use `depends_on` in OpenTrace: ECS service depends on RDS being created first. `depends_on = [aws_db_instance.openTrace]`.
219. `[CONCEPT]` `{L2}` What is `lifecycle` in Terraform? What is `create_before_destroy`? How does OpenTrace use it for zero-downtime ECS service updates?
220. `[CODE]` `{L2}` Add `lifecycle { create_before_destroy = true }` to OpenTrace's ECS service. This creates the new service before destroying the old.
221. `[CONCEPT]` `{L2}` What is `data source` in Terraform? How does OpenTrace reference existing AWS resources (existing VPC, existing EKS cluster)?
222. `[CODE]` `{L2}` Use data source in OpenTrace Terraform: `data "aws_eks_cluster" "existing" { name = "my-cluster" }`. Reference: `data.aws_eks_cluster.existing.endpoint`.
223. `[CONCEPT]` `{L2}` What is `for_each` vs `count` in Terraform? How does OpenTrace create 3 subnets in 3 AZs using `for_each`?
224. `[CODE]` `{L2}` Create OpenTrace subnets with `for_each`:
    ```hcl
    for_each = toset(["us-east-1a", "us-east-1b", "us-east-1c"])
    availability_zone = each.value
    ```
225. `[CONCEPT]` `{L2}` What is `dynamic` block in Terraform? When does OpenTrace use it for variable-length ingress rules?
226. `[CODE]` `{L2}` Use dynamic block for OpenTrace security group ingress rules:
    ```hcl
    dynamic "ingress" { for_each = var.allowed_ports; content { from_port = ingress.value; to_port = ingress.value; protocol = "tcp" } }
    ```
227. `[CONCEPT]` `{L2}` What is `local` value in Terraform? How does OpenTrace use locals to avoid repeating expressions?
228. `[CODE]` `{L2}` Define locals for OpenTrace: `locals { name_prefix = "${var.environment}-openTrace", common_tags = { Environment = var.environment, Project = "openTrace" } }`.
229. `[CONCEPT]` `{L2}` What is `variable` vs `locals` vs `output` in Terraform? When does OpenTrace expose outputs to other modules?
230. `[CONCEPT]` `{L2}` What is Terragrunt? How does OpenTrace use it to reduce Terraform boilerplate and manage multiple environments?
231. `[CODE]` `{L2}` Write Terragrunt config for OpenTrace: root `terragrunt.hcl` with S3 backend config, environment `terragrunt.hcl` with variable overrides.
232. `[CONCEPT]` `{L2}` What is Terraform Cloud / Terraform Enterprise? When does OpenTrace use it for team collaboration and audit trail?
233. `[CONCEPT]` `{L2}` What is `terraform state mv`? When does OpenTrace use it to rename a resource without destroying and recreating it?
234. `[CODE]` `{L2}` Move OpenTrace's ECS cluster in Terraform state: `terraform state mv aws_ecs_cluster.openTrace aws_ecs_cluster.openTrace_v2`.
235. `[CONCEPT]` `{L2}` What is `terraform refresh`? What is `terraform state pull`? When does OpenTrace use them for drift detection?
236. `[CONCEPT]` `{L2}` What is configuration drift? How does OpenTrace detect when AWS resources differ from Terraform state?
237. `[CODE]` `{L2}` Detect drift in OpenTrace: `terraform plan -refresh-only` shows what needs to be refreshed. Alert if drift detected in CI.
238. `[CONCEPT]` `{L3}` What is `terraform test`? What is a provider mock? How does OpenTrace unit-test Terraform modules?
239. `[CODE]` `{L3}` Write a Terraform test for OpenTrace's ECS module: assert that the service has the correct CPU and memory, uses the correct VPC.
240. `[CONCEPT]` `{L2}` What is CDK for Terraform (CDKTF)? When would OpenTrace use TypeScript to write Terraform instead of HCL?
241. `[CONCEPT]` `{L2}` What is OpenTofu (open-source Terraform fork)? What changed with HashiCorp's BSL license?
242. `[CONCEPT]` `{L2}` What is Pulumi? How does it compare to Terraform for OpenTrace? Why does the plan choose Terraform?
243. `[TRADEOFF]` `{L2}` Terraform vs AWS CDK vs Pulumi vs CloudFormation for OpenTrace's infrastructure: compare developer experience, vendor lock-in, and state management.
244. `[CONCEPT]` `{L2}` What is `terraform plan -destroy`? When does OpenTrace use it to safely preview destroying staging infrastructure?
245. `[CODE]` `{L2}` Preview destroying OpenTrace staging: `terraform plan -destroy -var-file=staging.tfvars`. Review output before confirming.
246. `[CONCEPT]` `{L2}` What is `terraform providers lock`? How does OpenTrace pin provider versions for reproducible infrastructure?
247. `[CODE]` `{L2}` Lock provider versions for OpenTrace: `terraform providers lock -platform=linux_amd64 -platform=darwin_amd64`. Commit `.terraform.lock.hcl`.
248. `[CONCEPT]` `{L2}` What is `terraform apply -auto-approve`? When does OpenTrace's CI use it safely vs requiring manual approval?
249. `[CONCEPT]` `{L2}` What is Infracost? How does OpenTrace estimate AWS cost changes before applying Terraform changes?
250. `[CODE]` `{L2}` Add Infracost to OpenTrace's CI: `infracost breakdown --path . --format json`. Show cost diff in PR comment. Alert if monthly cost increases > $500.

---

## AWS Services (Q251–Q300)

251. `[CONCEPT]` `{L1}` What is AWS ECS Fargate? What problem does it solve vs EC2? When does OpenTrace use Fargate for stateless services?
252. `[CODE]` `{L1}` Write Terraform for OpenTrace ECS Fargate task definition: container definition with image, CPU (512), memory (1024), port mappings, environment variables from Secrets Manager.
253. `[CONCEPT]` `{L1}` What is AWS RDS? What is Multi-AZ RDS? What is the difference between RDS PostgreSQL and Aurora PostgreSQL?
254. `[CODE]` `{L2}` Write Terraform for OpenTrace PostgreSQL RDS: `db.t3.medium`, Multi-AZ, encrypted, in private subnet group, security group allowing only app security group.
255. `[CONCEPT]` `{L1}` What is AWS ElastiCache? What is Redis on ElastiCache vs self-managed Redis? When does OpenTrace use ElastiCache?
256. `[CODE]` `{L2}` Write Terraform for OpenTrace Redis ElastiCache: `cache.r7g.large`, cluster mode disabled, encryption in transit + at rest, replication group with 1 replica.
257. `[CONCEPT]` `{L1}` What is AWS MSK (Managed Streaming for Kafka)? How does it compare to self-managed Kafka for OpenTrace?
258. `[CODE]` `{L2}` Write Terraform for OpenTrace MSK cluster: 3 brokers, `kafka.m5.large`, storage 500GB, encryption, SASL/SCRAM authentication.
259. `[CONCEPT]` `{L1}` What is AWS S3? What are buckets, objects, keys, versioning, lifecycle policies?
260. `[CODE]` `{L1}` Write Terraform for OpenTrace S3 bucket: versioning enabled, server-side encryption (AES-256), lifecycle policy (delete versions > 30 days), block all public access.
261. `[CONCEPT]` `{L2}` What is S3 presigned URL? How does OpenTrace generate them for secure trace export downloads?
262. `[CODE]` `{L2}` Generate S3 presigned URL in Go for OpenTrace: `s3.PresignGetObject(ctx, bucket, key, 1*time.Hour)`. Include in export response.
263. `[CONCEPT]` `{L2}` What is S3 multipart upload? When does OpenTrace use it for exporting > 5MB trace archives?
264. `[CODE]` `{L2}` Implement S3 multipart upload for OpenTrace's trace export: split into 10MB parts, upload in parallel (5 concurrent), complete multipart upload.
265. `[CONCEPT]` `{L2}` What is S3 Intelligent-Tiering? When does OpenTrace use it for automatically tiering span archives from S3 Standard to Glacier?
266. `[CONCEPT]` `{L2}` What is AWS VPC? What are public vs private subnets? What is a NAT Gateway?
267. `[CODE]` `{L2}` Write Terraform for OpenTrace VPC: 3 AZs, public subnets (load balancers), private subnets (services), database subnets (RDS/Redis), NAT Gateway per AZ.
268. `[CONCEPT]` `{L2}` What is a security group vs NACL in AWS? How does OpenTrace use security groups for micro-segmentation?
269. `[CODE]` `{L2}` Write Terraform security groups for OpenTrace: ALB SG (0.0.0.0/0 on 443), Collector SG (only from ALB SG), RDS SG (only from Collector SG).
270. `[CONCEPT]` `{L2}` What is AWS CloudFront? How does OpenTrace use it to cache the UI static assets globally?
271. `[CODE]` `{L2}` Write Terraform for OpenTrace CloudFront: origin = S3 bucket, cache policy for static assets (max-age=31536000), default root object `index.html`.
272. `[CONCEPT]` `{L2}` What is AWS ACM (Certificate Manager)? How does OpenTrace provision TLS certificates for CloudFront and ALB?
273. `[CODE]` `{L2}` Write Terraform for OpenTrace ACM certificate: `*.openTrace.dev`, DNS validation via Route53, wait for validation.
274. `[CONCEPT]` `{L2}` What is AWS Route53? What is a hosted zone? How does OpenTrace manage DNS in Terraform?
275. `[CODE]` `{L2}` Write Terraform for OpenTrace Route53: A record alias for ALB (`collector.openTrace.dev → ALB DNS`), CNAME for CloudFront (`ui.openTrace.dev → CloudFront`).
276. `[CONCEPT]` `{L2}` What is AWS EKS? What is a node group? What is Fargate profile on EKS?
277. `[CODE]` `{L2}` Write Terraform for OpenTrace EKS cluster: version 1.29, managed node groups (general: m5.xlarge, memory: r6i.4xlarge), enable IRSA, cluster autoscaler.
278. `[CONCEPT]` `{L2}` What is AWS IAM? What is OIDC federation? How does EKS IRSA work?
279. `[CODE]` `{L2}` Write Terraform for OpenTrace IRSA: create OIDC provider for EKS, IAM role with assume-role policy for service account, S3 write policy.
280. `[CONCEPT]` `{L2}` What is AWS Secrets Manager vs SSM Parameter Store? When does OpenTrace use each?
281. `[CODE]` `{L2}` Write Terraform for OpenTrace Secrets Manager: store ClickHouse password, enable rotation every 30 days, grant read access to ECS task role.
282. `[CONCEPT]` `{L2}` What is AWS CloudWatch? What is CloudWatch Logs? When does OpenTrace use CloudWatch vs Loki?
283. `[CODE]` `{L2}` Write Terraform for OpenTrace CloudWatch log group: 30-day retention, KMS encryption, subscription filter to forward to Loki.
284. `[CONCEPT]` `{L2}` What is AWS SQS? When would OpenTrace use SQS vs Kafka for simple async work queues?
285. `[CODE]` `{L2}` Write Terraform for OpenTrace SQS dead letter queue: main queue with `visibilityTimeout=30`, DLQ with `maxReceiveCount=3`.
286. `[CONCEPT]` `{L2}` What is AWS SNS? How does OpenTrace use it for fan-out notifications to multiple SQS queues?
287. `[CONCEPT]` `{L2}` What is AWS Lambda? When does OpenTrace use Lambda for event-driven processing?
288. `[CODE]` `{L2}` Write Terraform for OpenTrace Lambda: S3 trigger on new trace export, Lambda reads and indexes in Elasticsearch. Function URL for HTTP access.
289. `[CONCEPT]` `{L2}` What is AWS ALB? What is target group? What is listener rule? How does OpenTrace route traffic?
290. `[CODE]` `{L2}` Write Terraform for OpenTrace ALB: HTTPS listener (port 443), forward rules by host header (collector.openTrace.dev → Collector target group).
291. `[CONCEPT]` `{L2}` What is AWS CloudFront distribution? What is origin access identity (OAI) / origin access control (OAC)?
292. `[CONCEPT]` `{L2}` What is AWS Cost Explorer? How does OpenTrace identify the top 3 cost drivers monthly?
293. `[CONCEPT]` `{L2}` What is Cloudflare R2 vs AWS S3? What is the zero-egress advantage for OpenTrace's trace downloads?
294. `[CODE]` `{L2}` Write Terraform for Cloudflare R2 bucket for OpenTrace: `cloudflare_r2_bucket` resource, CORS policy for UI downloads.
295. `[CONCEPT]` `{L2}` What is AWS Auto Scaling group? When does OpenTrace use ASG with spot instances for cost-optimized batch processing?
296. `[CONCEPT]` `{L2}` What is Reserved Instances vs Spot Instances vs On-Demand? What is OpenTrace's cost optimization strategy for each component?
297. `[CONCEPT]` `{L2}` What is AWS Graviton (ARM64)? What is the cost savings vs x86? Why does OpenTrace build ARM64 images?
298. `[TRADEOFF]` `{L2}` AWS ECS Fargate vs EKS for OpenTrace: compare operational complexity, cost, scaling speed, and control.
299. `[CONCEPT]` `{L2}` What is AWS Bedrock? When would OpenTrace use it for the AI-native stack (span anomaly detection)?
300. `[APPLY]` `{L2}` Design OpenTrace's complete AWS architecture: VPC (3 AZs), EKS (node groups), RDS (Multi-AZ), ElastiCache (replicated), MSK (3 brokers), S3 (span archives), CloudFront (UI), Route53 (DNS), ACM (TLS). Draw the network flow.

---

# PART D — CI/CD & Security (Q301–Q420)

---

## GitHub Actions & CI/CD (Q301–Q360)

301. `[CONCEPT]` `{L1}` What is CI/CD? What is continuous integration vs continuous delivery vs continuous deployment?
302. `[CONCEPT]` `{L1}` What is GitHub Actions? What is a workflow? What is a job? What is a step?
303. `[CODE]` `{L1}` Write a basic GitHub Actions workflow for OpenTrace: trigger on `push` to `main`, jobs: lint, test, build Docker image.
304. `[CONCEPT]` `{L1}` What is `on: [push, pull_request]` vs `on: push: branches: [main]` in GitHub Actions?
305. `[CODE]` `{L2}` Write OpenTrace's PR validation workflow: on pull_request, run `golangci-lint`, `go test -race`, `govulncheck`, `tsc --noEmit`, `vitest run`.
306. `[CONCEPT]` `{L2}` What is a GitHub Actions matrix build? How does OpenTrace test across multiple Go versions?
307. `[CODE]` `{L2}` Add matrix build to OpenTrace CI: `matrix: { go: ['1.22', '1.23'], os: ['ubuntu-latest'] }`. Run tests on each combination.
308. `[CONCEPT]` `{L2}` What is a GitHub Actions `paths` filter? How does OpenTrace skip the backend build when only UI files changed?
309. `[CODE]` `{L2}` Add path filters to OpenTrace CI:
    ```yaml
    on: push: paths: ['collector/**', 'processor/**', 'go.mod']
    ```
310. `[CONCEPT]` `{L2}` What is `actions/cache`? How does OpenTrace cache Go modules between runs?
311. `[CODE]` `{L2}` Add Go module cache to OpenTrace CI:
    ```yaml
    - uses: actions/cache@v3
      with: { path: ~/go/pkg/mod, key: "${{ hashFiles('**/go.sum') }}" }
    ```
312. `[CONCEPT]` `{L2}` What is GitHub Actions OIDC? How does OpenTrace authenticate to AWS without storing credentials?
313. `[CODE]` `{L2}` Configure OIDC auth for OpenTrace CI: `aws-actions/configure-aws-credentials` with `role-to-assume: arn:aws:iam::123:role/openTrace-ci`. No static keys.
314. `[CONCEPT]` `{L2}` What is `docker/build-push-action`? How does OpenTrace build and push Docker images in CI?
315. `[CODE]` `{L2}` Write OpenTrace Docker build and push step:
    ```yaml
    - uses: docker/build-push-action@v5
      with: { context: ., push: true, tags: "${{ env.ECR_URL }}/openTrace:${{ github.sha }}", cache-from: "type=registry", cache-to: "type=inline" }
    ```
316. `[CONCEPT]` `{L2}` What is branch protection in GitHub? How does OpenTrace require PR reviews and passing CI before merging?
317. `[CODE]` `{L2}` Write GitHub branch protection rules for OpenTrace `main`: require 1 reviewer, require status checks (lint, test, trivy), no direct push.
318. `[CONCEPT]` `{L2}` What is a GitHub Actions environment with protection rules? How does OpenTrace require manual approval for production deploys?
319. `[CODE]` `{L2}` Create `production` environment in GitHub Actions for OpenTrace: require review from `openTrace-ops` team, timeout after 1 hour.
320. `[CONCEPT]` `{L2}` What is `github.sha` vs `github.ref` in Actions? How does OpenTrace tag Docker images?
321. `[CODE]` `{L2}` Tag OpenTrace images with both SHA and semantic version: `$ECR_URL/openTrace:${{ github.sha }}` and `$ECR_URL/openTrace:${{ github.ref_name }}` (for tags).
322. `[CONCEPT]` `{L2}` What is `actions/checkout` with `fetch-depth: 0`? When does OpenTrace need full git history for changelog generation?
323. `[CODE]` `{L2}` Write OpenTrace release workflow: on git tag push, `goreleaser release --clean`, build multi-arch binaries, create GitHub release, push Docker images.
324. `[CONCEPT]` `{L2}` What is semantic-release? How does OpenTrace auto-generate changelogs from conventional commits?
325. `[CODE]` `{L2}` Configure conventional commits for OpenTrace: `feat: add tail sampling`, `fix: correct span duration`, `chore: upgrade Go 1.23`. `semantic-release` generates CHANGELOG.md.
326. `[CONCEPT]` `{L2}` What is `reusable workflow` in GitHub Actions? How does OpenTrace create a shared Docker build workflow used by all 7 component jobs?
327. `[CODE]` `{L2}` Write a reusable workflow for OpenTrace Docker build: inputs `component`, `dockerfile-path`, outputs `image-digest`. Called from each component's workflow.
328. `[CONCEPT]` `{L2}` What is `workflow_dispatch`? How does OpenTrace's ops team manually trigger a rollback workflow?
329. `[CODE]` `{L2}` Add `workflow_dispatch` to OpenTrace's rollback workflow: input `target-sha` (the SHA to roll back to), update ECS task definition or Kubernetes image.
330. `[CONCEPT]` `{L2}` What is `concurrency` in GitHub Actions? How does OpenTrace cancel in-progress deploys when a new deploy is triggered?
331. `[CODE]` `{L2}` Add concurrency to OpenTrace deploy workflow: `concurrency: { group: deploy-production, cancel-in-progress: true }`.
332. `[CONCEPT]` `{L2}` What is `timeout-minutes` in GitHub Actions? How does OpenTrace prevent runaway CI jobs from consuming runners indefinitely?
333. `[CODE]` `{L2}` Add timeouts to OpenTrace CI jobs: test job `timeout-minutes: 15`, build job `timeout-minutes: 20`, deploy job `timeout-minutes: 10`.
334. `[CONCEPT]` `{L2}` What is a self-hosted runner? When does OpenTrace use self-hosted runners for faster builds or AWS network access?
335. `[CONCEPT]` `{L2}` What is `dorny/paths-filter`? How does OpenTrace detect which components changed in a monorepo?
336. `[CODE]` `{L2}` Add path-based filtering to OpenTrace CI monorepo: only build collector when collector files change, only build UI when UI files change.
337. `[CONCEPT]` `{L2}` What is Turbo for monorepo CI? How does OpenTrace skip unchanged packages using Turborepo's dependency graph?
338. `[CONCEPT]` `{L2}` What is `gotestsum` for Go test output? How does OpenTrace format test results for GitHub Actions annotations?
339. `[CODE]` `{L2}` Use `gotestsum` in OpenTrace CI: `gotestsum --format github-actions --junitfile results.xml -- -race -count=1 ./...`. Upload results.xml as artifact.
340. `[CONCEPT]` `{L2}` What is `actionlint`? How does OpenTrace lint GitHub Actions workflow files in CI?
341. `[CODE]` `{L2}` Add actionlint to OpenTrace's CI: `actionlint .github/workflows/*.yml`. Catches type errors and missing inputs in workflow files.
342. `[CONCEPT]` `{L2}` What is `slsa-provenance`? How does OpenTrace generate SLSA build provenance for supply chain security?
343. `[CONCEPT]` `{L2}` What is `sigstore/cosign`? How does OpenTrace sign container images?
344. `[CODE]` `{L2}` Sign OpenTrace images with cosign in CI: `cosign sign --key cosign.key $ECR_URL/openTrace:$SHA`. Verify at deploy time: `cosign verify --key cosign.pub`.
345. `[CONCEPT]` `{L2}` What is dependabot? How does OpenTrace automatically update Go and npm dependencies?
346. `[CODE]` `{L2}` Configure dependabot for OpenTrace: weekly Go module updates, weekly npm updates, weekly GitHub Actions updates, auto-merge patch updates.
347. `[CONCEPT]` `{L2}` What is `gitleaks`? How does OpenTrace scan for accidentally committed secrets?
348. `[CODE]` `{L2}` Add gitleaks to OpenTrace CI: `gitleaks detect --source . --verbose`. Also as a pre-commit hook: `gitleaks protect --staged`.
349. `[CONCEPT]` `{L2}` What is release engineering? What is a release candidate? How does OpenTrace manage versioning across 7 components?
350. `[CONCEPT]` `{L2}` What is `k6` cloud execution? How does OpenTrace run load tests against staging from GitHub Actions on every deploy?
351. `[CODE]` `{L2}` Add k6 load test to OpenTrace's staging deploy pipeline: run 100 VUs for 5 minutes, assert p99 < 10ms, error rate < 0.1%. Fail deploy if thresholds not met.
352. `[CONCEPT]` `{L2}` What is a feature flag deployment? How does OpenTrace deploy code and enable the feature only after verifying it in production?
353. `[CODE]` `{L2}` Integrate LaunchDarkly into OpenTrace's deploy workflow: deploy code, enable flag for 1% of traffic, monitor for 30 minutes, gradually increase to 100%.
354. `[CONCEPT]` `{L2}` What is zero-downtime deployment? What techniques does OpenTrace use: rolling update, blue-green, canary?
355. `[CONCEPT]` `{L2}` What is a rollback procedure? How fast can OpenTrace roll back: Kubernetes rollout undo (30 seconds), ECS force new deployment (2 minutes)?
356. `[CODE]` `{L2}` Write OpenTrace's automated rollback: if deploy webhook reports error rate > 5% for 5 minutes, trigger `kubectl rollout undo`.
357. `[CONCEPT]` `{L2}` What is progressive delivery? What is feature flag + canary + observability-driven promotion?
358. `[CONCEPT]` `{L2}` What is `atlantis` for Terraform pull request automation? How does OpenTrace auto-run `terraform plan` on PR and apply on merge?
359. `[CODE]` `{L2}` Configure atlantis for OpenTrace: auto-plan on PR, require plan comment approval, auto-apply on merge to `main`.
360. `[APPLY]` `{L2}` Design OpenTrace's complete CI/CD pipeline: PR check → merge → build → scan → push to ECR → deploy to staging → load test → manual approval → deploy to prod → monitor → auto-rollback.

---

## Security (Q361–Q420)

361. `[CONCEPT]` `{L1}` What is authentication vs authorization? What is OpenTrace's auth model: JWT RS256 for users, API keys for SDKs, mTLS for services?
362. `[CONCEPT]` `{L1}` What is a JWT? What are the three parts? What does OpenTrace put in the payload?
363. `[CONCEPT]` `{L1}` What is RS256 vs HS256 for JWT? Why does OpenTrace use RS256 (asymmetric)?
364. `[CODE]` `{L1}` Generate RS256 JWT in Go: create RSA key pair, sign with private key, verify with public key. Show the three-part token structure.
365. `[CONCEPT]` `{L1}` What is a refresh token? Why does it exist? How does OpenTrace implement rotation?
366. `[CODE]` `{L1}` Implement refresh token rotation: on refresh, verify old token, issue new access token (15min) + new refresh token (7 days), revoke old refresh token in Redis.
367. `[CONCEPT]` `{L2}` What is parameterized SQL query? Why is `fmt.Sprintf` in SQL a critical SQL injection vulnerability?
368. `[CODE]` `{L2}` Show SQL injection in OpenTrace:
    ```go
    // VULNERABLE: userInput can be "1; DROP TABLE spans --"
    query := fmt.Sprintf("SELECT * FROM spans WHERE service = '%s'", userInput)
    // SAFE: parameterized
    query := "SELECT * FROM spans WHERE service = $1"
    db.QueryContext(ctx, query, userInput)
    ```
369. `[CONCEPT]` `{L2}` What is HMAC webhook signature? Why does OpenTrace use it for webhook delivery verification?
370. `[CODE]` `{L2}` Implement HMAC webhook signature in Go: `hmac.New(sha256.New, secret)`, sign body, set `X-Signature: sha256={hex}`. Verify using `hmac.Equal` (timing-safe).
371. `[CONCEPT]` `{L2}` What is a timing attack? Why must you use `hmac.Equal` (constant-time) instead of `==` for comparing secrets?
372. `[CODE]` `{L2}` Demonstrate timing attack vulnerability:
    ```go
    // VULNERABLE: returns early on first mismatch
    if gotSig == expectedSig { ... }
    // SAFE: constant-time comparison
    if hmac.Equal([]byte(gotSig), []byte(expectedSig)) { ... }
    ```
373. `[CONCEPT]` `{L2}` What is `crypto/rand` vs `math/rand` in Go? Why must OpenTrace use `crypto/rand` for OTP generation?
374. `[CODE]` `{L2}` Generate cryptographically secure OTP in Go: `crypto/rand.Int(rand.Reader, big.NewInt(1000000))`. Pad to 6 digits with `fmt.Sprintf("%06d", n)`.
375. `[CONCEPT]` `{L2}` What is API key storage? Why does OpenTrace store `SHA256(key)` not the raw key?
376. `[CODE]` `{L2}` Implement API key creation in Go: `crypto/rand.Read(keyBytes)`, encode as `hex.EncodeToString`, store `sha256.Sum256(key)` in DB. Return raw key once.
377. `[CONCEPT]` `{L2}` What is `http.MaxBytesReader`? Why does OpenTrace set a 10MB request body limit?
378. `[CODE]` `{L2}` Add body size limiting to OpenTrace: `r.Body = http.MaxBytesReader(w, r.Body, 10<<20)`. Return 413 if exceeded.
379. `[CONCEPT]` `{L2}` What is input validation? What is the Zod schema for OpenTrace's span submission?
380. `[CODE]` `{L2}` Validate OpenTrace span submission with Zod (TypeScript SDK): `z.object({ trace_id: z.string().uuid(), spans: z.array(spanSchema).min(1).max(10000) })`.
381. `[CONCEPT]` `{L2}` What is XSS (Cross-Site Scripting)? How does React prevent it? When does `dangerouslySetInnerHTML` reintroduce the risk?
382. `[CONCEPT]` `{L2}` What is CSRF (Cross-Site Request Forgery)? How does `SameSite=Strict` cookie prevent it?
383. `[CODE]` `{L2}` Set secure cookies for OpenTrace: `SameSite=Strict; Secure; HttpOnly; Max-Age=86400`. Explain what each attribute prevents.
384. `[CONCEPT]` `{L2}` What is CORS? How does OpenTrace configure allowed origins for the API?
385. `[CODE]` `{L2}` Configure CORS in OpenTrace: allow `https://openTrace.dev` origin, `GET POST DELETE` methods, `Authorization Content-Type` headers. Reject all other origins.
386. `[CONCEPT]` `{L2}` What is CSP (Content Security Policy)? Write a CSP header for OpenTrace UI.
387. `[CODE]` `{L2}` Write OpenTrace UI CSP: `Content-Security-Policy: default-src 'self'; script-src 'self' cdn.openTrace.dev; connect-src 'self' api.openTrace.dev wss://api.openTrace.dev; img-src 'self' data:`.
388. `[CONCEPT]` `{L2}` What is HSTS? What is HSTS preloading? How does OpenTrace enable it?
389. `[CODE]` `{L2}` Add HSTS to OpenTrace: `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`. Submit domain to HSTS preload list.
390. `[CONCEPT]` `{L2}` What is `X-Content-Type-Options: nosniff`? What is `X-Frame-Options: DENY`? What is `Referrer-Policy: strict-origin-when-cross-origin`?
391. `[CODE]` `{L2}` Add all security headers to OpenTrace in one middleware: `nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy: camera=(), microphone=()`.
392. `[CONCEPT]` `{L2}` What is OAuth2 PKCE? Why does OpenTrace require it for browser-based authorization flows?
393. `[CODE]` `{L2}` Implement OAuth2 PKCE in TypeScript: `crypto.getRandomValues` for code_verifier, `crypto.subtle.digest('SHA-256', ...)` for code_challenge, send both to auth server.
394. `[CONCEPT]` `{L2}` What is `govulncheck`? What does it scan (Go module vulnerabilities in OSV database)? How does OpenTrace use it in CI?
395. `[CODE]` `{L2}` Run `govulncheck ./...` on OpenTrace. Show the output format: affected symbol, vulnerability ID, severity. Add to CI with `exit 1` on any finding.
396. `[CONCEPT]` `{L2}` What is `trivy` image scanning? What does it find: OS package vulnerabilities, language package vulnerabilities?
397. `[CODE]` `{L2}` Scan OpenTrace's Docker image: `trivy image --severity CRITICAL,HIGH --exit-code 1 openTrace-collector:latest`. Show typical findings in a Go + distroless image.
398. `[CONCEPT]` `{L2}` What is supply chain security? What is SLSA (Supply Levels for Software Artifacts)?
399. `[CONCEPT]` `{L2}` What is a penetration test? What is responsible disclosure? How does OpenTrace handle vulnerability reports?
400. `[CONCEPT]` `{L2}` What are the OWASP Top 10? Which apply to OpenTrace: injection (A03), broken auth (A07), sensitive data exposure (A02), security misconfiguration (A05)?
401. `[CONCEPT]` `{L2}` What is multi-factor authentication (MFA)? How does OpenTrace require TOTP for admin accounts?
402. `[CODE]` `{L2}` Implement TOTP validation in Go: `pquerna/otp` library, verify 6-digit code against stored TOTP secret, accept ±1 time step for clock skew.
403. `[CONCEPT]` `{L2}` What is a secret scanning tool? What is `detect-secrets`? How does OpenTrace's pre-commit hook prevent committing secrets?
404. `[CODE]` `{L2}` Configure pre-commit hooks for OpenTrace: `gitleaks protect --staged` (blocks if secrets detected), `golangci-lint run` (lint Go), `tsc --noEmit` (type check TS).
405. `[CONCEPT]` `{L2}` What is encryption at rest? How does OpenTrace encrypt ClickHouse data, PostgreSQL data, and S3 archives?
406. `[CONCEPT]` `{L2}` What is encryption in transit? What protocols does OpenTrace use: TLS 1.3 for HTTP, mTLS for inter-service gRPC, TLS for Kafka, SSL for PostgreSQL?
407. `[CONCEPT]` `{L2}` What is a WAF (Web Application Firewall)? When does OpenTrace use Cloudflare WAF in front of the Collector?
408. `[CONCEPT]` `{L2}` What is DDoS protection? How does Cloudflare protect OpenTrace's public Collector endpoint?
409. `[CONCEPT]` `{L2}` What is IAM least privilege? How does OpenTrace's ECS task role only have `s3:PutObject` on the specific bucket, not `s3:*`?
410. `[CODE]` `{L2}` Write IAM policy for OpenTrace Collector: `s3:PutObject` on `arn:aws:s3:::openTrace-spans/*` only. `kms:GenerateDataKey` for encryption. Nothing else.
411. `[CONCEPT]` `{L2}` What is AWS GuardDuty? What is AWS SecurityHub? How does OpenTrace use them for threat detection?
412. `[CONCEPT]` `{L2}` What is an audit trail? How does OpenTrace log every API mutation for compliance: who, what, when, from where?
413. `[CODE]` `{L2}` Implement audit logging middleware for OpenTrace: log `{timestamp, user_id, tenant_id, method, path, status, ip, trace_id}` to a separate append-only Loki stream.
414. `[CONCEPT]` `{L2}` What is GDPR? What is the right to erasure? How does OpenTrace implement span deletion for GDPR compliance?
415. `[CODE]` `{L2}` Implement GDPR erasure in OpenTrace: `DELETE FROM spans WHERE user_id = $1`, invalidate all caches for that user, return 202 with job ID for async completion.
416. `[CONCEPT]` `{L2}` What is SOC 2? What are the five trust service criteria? What does OpenTrace need to achieve SOC 2 Type II?
417. `[CONCEPT]` `{L2}` What is PCI DSS? When would OpenTrace need it (if PayCore processes card data via OpenTrace's spans)? What is PCI scope reduction?
418. `[CONCEPT]` `{L2}` What is a security review process? What is threat modeling? How does OpenTrace do threat modeling for new features?
419. `[CODE]` `{L2}` Write a threat model for OpenTrace's span ingestion: assets (span data), threats (injection, replay, exfiltration), controls (auth, rate limiting, TLS, HMAC).
420. `[APPLY]` `{L2}` Design OpenTrace's complete security posture: JWT auth, mTLS inter-service, parameterized SQL, HMAC webhooks, crypto/rand, HSTS, CSP, govulncheck in CI, trivy image scan, OIDC for CI/CD, Secrets Manager, IRSA, audit logs, GDPR erasure.

---

# PART E — Cost Optimization & Production Practices (Q421–Q500)

---

## Cost Optimization (Q421–Q460)

421. `[CONCEPT]` `{L1}` What are the four main AWS cost drivers for OpenTrace: compute (ECS/EKS), storage (S3/RDS/ElastiCache), network egress, managed services (MSK/RDS)?
422. `[CONCEPT]` `{L2}` What is AWS Savings Plan vs Reserved Instance? How does OpenTrace commit to 1-year Savings Plan for 30% discount?
423. `[CONCEPT]` `{L2}` What is Spot Instance? What is Fargate Spot? When does OpenTrace use spot for batch processing jobs?
424. `[CODE]` `{L2}` Configure OpenTrace batch processor with Fargate Spot: set capacity provider `FARGATE_SPOT` with weight 4, `FARGATE` with weight 1 (mostly spot, fallback on-demand).
425. `[CONCEPT]` `{L2}` What is AWS Graviton3? What is the compute cost saving (20-40%)? How does OpenTrace build ARM64 images for Graviton?
426. `[CONCEPT]` `{L2}` What is right-sizing? How does OpenTrace use AWS Compute Optimizer recommendations to reduce oversized instances?
427. `[CONCEPT]` `{L2}` What is S3 storage tiering? What are Standard, Intelligent-Tiering, Standard-IA, Glacier, Glacier Deep Archive? What does OpenTrace use for each retention tier?
428. `[CODE]` `{L2}` Write S3 lifecycle policy for OpenTrace trace archives: Standard (0-30 days) → Standard-IA (30-90 days) → Glacier (90-365 days) → expire (365 days).
429. `[CONCEPT]` `{L2}` What is S3 egress cost? How does serving OpenTrace UI from S3 + CloudFront reduce egress vs from EC2?
430. `[CONCEPT]` `{L2}` What is Cloudflare R2 zero-egress pricing? How does replacing S3 for trace export downloads save OpenTrace $X/month?
431. `[CODE]` `{L2}` Calculate OpenTrace's S3 egress cost: 100TB/month of trace downloads × $0.09/GB = $9,000/month. R2 = $0 egress. Show the cost savings in ADR.
432. `[CONCEPT]` `{L2}` What is data compression for cost? ClickHouse LZ4 compression achieves 8:1 ratio. How much storage does OpenTrace save vs uncompressed?
433. `[CODE]` `{L2}` Calculate OpenTrace ClickHouse storage cost: 10M spans/sec × 2KB = 20GB/sec uncompressed. With 8:1 LZ4 = 2.5GB/sec = 200TB/day. At $0.025/GB/month = $X/month.
434. `[CONCEPT]` `{L2}` What is database connection cost? Every PostgreSQL connection uses ~5MB RAM. How does PgBouncer reduce OpenTrace's RDS instance size requirement?
435. `[CONCEPT]` `{L2}` What is NAT Gateway pricing? How does OpenTrace reduce NAT Gateway costs by routing internal traffic through VPC endpoints?
436. `[CONCEPT]` `{L2}` What is CloudFront cost vs EC2 egress cost? How does serving OpenTrace UI from CloudFront reduce EC2 egress charges?
437. `[CONCEPT]` `{L2}` What is AWS Cost Anomaly Detection? How does OpenTrace set alerts for unexpected cost spikes?
438. `[CODE]` `{L2}` Write Terraform for Cost Anomaly Detection in OpenTrace: alert if monthly spend increases > $500 vs rolling 7-day average. Notify via SNS to Slack.
439. `[CONCEPT]` `{L2}` What is FinOps? How does OpenTrace tag all resources with `Environment`, `Service`, `Team` for cost allocation?
440. `[CODE]` `{L2}` Write Terraform `default_tags` for OpenTrace: `Environment = terraform.workspace`, `Service = "openTrace"`, `Team = "platform"`. These apply to all resources.
441. `[CONCEPT]` `{L2}` What is AWS Trusted Advisor? How does OpenTrace use it to find underutilized resources?
442. `[CODE]` `{L2}` Calculate OpenTrace's monthly AWS cost breakdown: EKS ($144), 3× r6i.xlarge nodes ($450), RDS db.t3.medium Multi-AZ ($100), ElastiCache cache.r7g.large ($150), MSK 3× m5.large ($300), S3 ($50), CloudFront ($30). Total: ~$1224/month.
443. `[CONCEPT]` `{L2}` What is ECR lifecycle policy? How does OpenTrace automatically delete old Docker images to reduce ECR storage cost?
444. `[CODE]` `{L2}` Write ECR lifecycle policy for OpenTrace: keep last 10 tagged images, delete untagged images after 1 day.
445. `[CONCEPT]` `{L2}` What is EBS gp2 vs gp3 pricing? OpenTrace's ClickHouse volumes on gp3 cost 20% less than gp2 with better baseline performance.
446. `[CODE]` `{L2}` Migrate OpenTrace ClickHouse EBS from gp2 to gp3: `aws ec2 modify-volume --volume-id vol-xxx --volume-type gp3 --iops 3000 --throughput 125`. Zero downtime.
447. `[CONCEPT]` `{L2}` What is AWS Cost Explorer? How does OpenTrace analyze cost by service, by tag, and by usage type?
448. `[CONCEPT]` `{L2}` What is RDS auto-scaling storage? How does OpenTrace avoid manual storage increases by enabling `manage_master_user_password = true`?
449. `[CONCEPT]` `{L2}` What is Kafka message compression? How does enabling `snappy` compression on OpenTrace's MSK producers reduce MSK storage and throughput costs?
450. `[CODE]` `{L2}` Calculate cost savings from Kafka compression in OpenTrace: 10M spans/sec × 2KB = 20GB/sec. With snappy 4:1 compression = 5GB/sec MSK throughput. Halves MSK instance size.
451. `[CONCEPT]` `{L2}` What is EC2 instance type selection? For OpenTrace ClickHouse (memory-intensive): r6i.4xlarge (memory-optimized) vs c6i.4xlarge (compute-optimized) vs m6i.4xlarge (general)?
452. `[CONCEPT]` `{L2}` What is auto-scaling based on custom metrics? How does OpenTrace scale down Collector pods at night to save compute cost?
453. `[CODE]` `{L2}` Configure OpenTrace HPA with scheduled scaling: minimum 2 replicas at night (00:00-08:00), minimum 5 replicas during business hours (08:00-20:00).
454. `[CONCEPT]` `{L2}` What is AWS DataTransfer? How does placing OpenTrace's ClickHouse and Kafka in the same AZ reduce cross-AZ data transfer costs?
455. `[TRADEOFF]` `{L2}` Cross-AZ data transfer cost vs high availability for OpenTrace: same-AZ deployment is cheaper but single point of failure. What is the right balance?
456. `[CONCEPT]` `{L2}` What is Kubecost? How does OpenTrace allocate Kubernetes costs to individual services and tenants?
457. `[CODE]` `{L2}` Label OpenTrace's Kubernetes namespaces for Kubecost: `kubectl label namespace openTrace-collector app.kubernetes.io/managed-by=openTrace cost-center=platform`. View per-service cost in Kubecost.
458. `[CONCEPT]` `{L2}` What is OpenTrace's total cost of ownership (TCO) calculation? Include: AWS infrastructure, engineering time, on-call burden, security tooling.
459. `[APPLY]` `{L2}` Write the OpenTrace cost optimization ADR: current cost ($1224/month), optimizations applied (Graviton: -20%, Savings Plan: -30%, S3 tiering: -$50, R2 for egress: -$300), optimized cost (~$600/month).
460. `[APPLY]` `{L2}` Design OpenTrace's cost monitoring alert system: alert when monthly cost increases > 20% vs previous month, alert when any single service cost exceeds $300/month.

---

## Production Operations (Q461–Q500)

461. `[CONCEPT]` `{L1}` What is SLO, SLI, SLA? Define each for OpenTrace's Collector service.
462. `[CODE]` `{L1}` Write OpenTrace SLOs: availability 99.9% (max 43.8 min/month downtime), p99 latency < 10ms, error rate < 0.1%.
463. `[CONCEPT]` `{L2}` What is an error budget? If OpenTrace's SLO is 99.9%, what is the monthly error budget in minutes?
464. `[CODE]` `{L2}` Calculate OpenTrace's error budget: `(1 - 0.999) × 30 days × 24 hours × 60 min = 43.8 min/month`. Alert when budget consumed at 2× burn rate.
465. `[CONCEPT]` `{L2}` What is a burn rate alert? How does OpenTrace detect SLO violations before the error budget is exhausted?
466. `[CODE]` `{L2}` Write burn rate alert for OpenTrace: fire if error rate × time > 5% of monthly budget in 1 hour (5× burn rate). Page immediately.
467. `[CONCEPT]` `{L1}` What is a runbook? What are the required sections for OpenTrace's production runbooks?
468. `[CODE]` `{L1}` Write the OpenTrace runbook for "Collector p99 > 100ms": symptoms, first 3 checks (Kafka lag, ClickHouse health, goroutine count), diagnosis queries, remediation steps.
469. `[CONCEPT]` `{L2}` What is PagerDuty? What is an on-call rotation? How does OpenTrace set up escalation policies?
470. `[CODE]` `{L2}` Design OpenTrace's on-call escalation: P1 (pager in 2 min) → primary on-call → secondary (5 min) → engineering manager (15 min). P2: Slack notification only.
471. `[CONCEPT]` `{L2}` What is a blameless postmortem? What are the five sections: summary, timeline, root cause, contributing factors, action items?
472. `[CODE]` `{L2}` Write a blameless postmortem for OpenTrace: "2024-01-15 03:00 UTC - ClickHouse out of disk space, 15 minutes of span loss. Root cause: insufficient disk monitoring. Action: add disk alert at 80%."
473. `[CONCEPT]` `{L2}` What is change management? What is a change freeze? How does OpenTrace implement a change freeze during major product launches?
474. `[CONCEPT]` `{L2}` What is capacity planning? How does OpenTrace forecast compute and storage needs for 3× growth?
475. `[CODE]` `{L2}` Capacity plan for OpenTrace 3× growth: current 10M spans/sec → 30M spans/sec. Need: 3× Collector replicas, 3× Kafka partitions, 3× ClickHouse storage. Calculate new costs.
476. `[CONCEPT]` `{L2}` What is chaos engineering? What is Chaos Monkey? What failure scenarios does OpenTrace test?
477. `[CODE]` `{L2}` Write OpenTrace chaos test plan: (1) kill one Collector pod - should failover in < 30s, (2) kill Kafka broker - consumer lag should recover in < 5 min, (3) inject 500ms ClickHouse latency - adaptive rate limiting should activate.
478. `[CONCEPT]` `{L2}` What is `kubectl top` vs `metrics-server` vs Prometheus for resource monitoring? When does OpenTrace use each?
479. `[CONCEPT]` `{L2}` What is an incident communication plan? How does OpenTrace communicate outages to users via status page?
480. `[CODE]` `{L2}` Write OpenTrace's status page update template: "Investigating - We are aware of increased error rates in span ingestion (started 14:23 UTC). Our team is investigating. Next update in 15 minutes."
481. `[CONCEPT]` `{L2}` What is disaster recovery? What is the difference between RTO (Recovery Time Objective) and RPO (Recovery Point Objective)?
482. `[CODE]` `{L2}` Define OpenTrace DR objectives: RTO = 10 minutes (restore service), RPO = 0 (no span data loss via Kafka retention). Test quarterly with a full DR drill.
483. `[CONCEPT]` `{L2}` What is a DR drill? How does OpenTrace test restoring from backup to a separate AWS region in under 10 minutes?
484. `[CODE]` `{L2}` Write OpenTrace's DR drill runbook: restore ClickHouse from S3 backup to DR region, replay Kafka for last hour, validate 10 sample traces, cut over DNS.
485. `[CONCEPT]` `{L2}` What is a game day? How does OpenTrace run quarterly game days: simulated production failure, team responds without advance notice?
486. `[CONCEPT]` `{L2}` What is observability-driven deployment? How does OpenTrace automatically promote a canary based on error rate and latency metrics?
487. `[CODE]` `{L2}` Write Argo Rollouts analysis template for OpenTrace: query Prometheus for error rate, if < 1% after 5 minutes promote, if > 1% abort and rollback.
488. `[CONCEPT]` `{L2}` What is feature flag kill switch? How does OpenTrace instantly revert a bad feature in production without a deployment?
489. `[CODE]` `{L2}` Implement emergency kill switch for OpenTrace's tail sampling feature: LaunchDarkly flag `tail_sampling_enabled`, default `true`, set to `false` in dashboard to instantly disable.
490. `[CONCEPT]` `{L2}` What is MTTR (Mean Time to Recovery)? What is MTTD (Mean Time to Detect)? How does OpenTrace measure and improve each?
491. `[APPLY]` `{L2}` Walk through OpenTrace's production incident response: alert fires → on-call acknowledges → initial triage (Grafana dashboard) → identify component (Kafka lag) → remediation (scale consumers) → verify resolution → postmortem.
492. `[APPLY]` `{L2}` Walk through OpenTrace's deployment pipeline on a Monday morning: PR merged → CI passes → staging deploy (auto) → load test (auto) → staging validation (5 min) → production deploy (manual approval) → canary 5% → monitor 10 min → 100%.
493. `[APPLY]` `{L2}` Calculate OpenTrace's operational maturity score: SLOs defined (yes), runbooks for all P1 alerts (yes), DR drill last 30 days (yes), chaos tests in CI (no), postmortem for all P1s (yes). Score: 4/5.
494. `[APPLY]` `{L2}` Design the OpenTrace production readiness review (PRR): what must be true before shipping a new feature: runbook written, alert rules created, SLOs defined, load test passing, security review complete.
495. `[APPLY]` `{L2}` Design OpenTrace's on-call handbook: what tools to use, how to escalate, how to declare an incident, how to write the status page update, how to do a postmortem.
496. `[APPLY]` `{L2}` Walk through the OpenTrace weekly operations review: SLO burn rate last 7 days, top 5 errors by frequency, top 3 slow queries, cost vs budget, upcoming maintenance, open P2/P3 incidents.
497. `[APPLY]` `{L2}` Design OpenTrace's infrastructure as code review process: all Terraform changes require PR with `terraform plan` output, security check (tfsec), cost estimate (infracost), 1 reviewer from platform team.
498. `[APPLY]` `{L2}` Walk through OpenTrace's annual security audit: penetration test of public endpoints, review of IAM permissions (least privilege), rotation of all secrets, review of security headers, update of dependency versions.
499. `[APPLY]` `{L2}` Design OpenTrace's multi-region failover: DNS health check on Collector endpoint, Route53 failover record, secondary region with warm standby (replicated ClickHouse), RTO 5 minutes.
500. `[APPLY]` `{L1}` Final synthesis: You are presenting OpenTrace's infrastructure to Infraspec. In 5 minutes, cover: Docker (multi-stage, distroless, trivy), Kubernetes (7 components, HPA, PDB, Argo Rollouts), Terraform (AWS EKS + RDS + MSK + S3), CI/CD (GitHub Actions, OIDC, canary deploy), Security (JWT RS256, mTLS, govulncheck), Cost ($600/month optimized), and the SLO (99.9% availability, p99 < 10ms).
