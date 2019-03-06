# iter8

A suite of tools/services with analytics to help developers and operators understand and troubleshoot microservice-based cloud applications.

We currently have the following sub-projects. The list below is expected to grow, and the existing projects will continue evolving.

### 1. Istio Analytics

Service for analyzing distributed-tracing data collected by Istio. It performs statistical aggregation of inter-service calls that can be used for _fine-grain, holistic canary analysis_.

Detailed information can be found [here](istio-analytics/README.md).

### 2. CloudTSA

Service for time-series analytics of cloud metrics. CloudTSA is integrated with Prometheus and Grafana and supports a variety of time series algorithms namely predictive alerts, change detection, threshold violations and peak detection.

Detailed information can be found [here](cloudtsa/README.md).
