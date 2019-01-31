# Istio Analytics

The vision behind _Istio_Analytics_ is to gain insights from Istio telemetry. Currently, it can
analyze distributed-tracing data collected by Istio, supporting both [Jaeger](https://www.jaegertracing.io/) and [Zipkin](https://zipkin.io/) (version 2.7, v1 API).

To showcase some of the service capabilities, we provide a **rudimentary UI**. **Note that this project is NOT about the UI**; rather, it is about the analytics capabilities provided by the service, which are still evolving.

At the heart of _Istio Analytics_ is a REST API implementing different operations, currently limited to the analysis of distributed traces. One such operation is the _fine-grain, holistic canary analysis_.

## Fine-grain, holistic canary analysis

When a new version of a microservice (the _canary_) is rolled out, a _canary analysis_ is performed to verify how the new version compares to the previous one with respect to performance and errors. A _fine-grain analysis_ further identifies which parts of the new code might be slower. The _holistic_ aspect enables one to analyze how the canary might affect the entire application, considering all its constituting microservices. Distributed-tracing data collected by Istio enables all of the above.

The following screenshots show the fine-grain, holistic canary analysis for a modified version of Istio's _bookinfo_ sample application. In this scenario, the _reviews_ microservice is undergoing a canary rollout where version 2 is the baseline and version 3 is the canary (see the inputs below).

*Inputs:*

![Canary Analysis Inputs](https://raw.githubusercontent.com/istio-ecosystem/iter8-docs/master/istio-analytics/img/canary-analysis-input.png)

*Result:*

The next screenshots show how _Istio Analytics_ performs a statistical comparison of baseline and canary. Traces for baseline and canary are aggregated, statistical measures are computed, and the comparative analysis is summarized by colored "needles", green indicating success and red, failure, considering parameters given as input. Yellow boxes represent processing times, and needles over them isolate the comparison for the corresponding elements in the baseline and canary.

Overview            |  Zoom
:-------------------------:|:-------------------------:
![Result Part I]
(https://raw.githubusercontent.com/istio-ecosystem/iter8-docs/master/istio-analytics/img/canary-analysis-result-part1.png) | ![Result Part II](https://raw.githubusercontent.com/istio-ecosystem/iter8-docs/master/istio-analytics/img/canary-analysis-result-part2.png)

A quick inspection of the results reveals that the canary version of reviews is much slower in processing results returned by _ratings_.

Statistics are also summarized for communication times. One can see two sets of these for baseline traces and canary traces by hovering over each arrow corresponding to an inter-service call, as shown below for calls from _productpage_ to _details_.

![Result Part III](https://raw.githubusercontent.com/istio-ecosystem/iter8-docs/master/istio-analytics/img/canary-analysis-result-part3.png)

## Getting started

The instructions below enable you to quickly run _Istio Analytics_ locally. They assume you have Docker running on your computer and that you have [docker-compose](https://docs.docker.com/compose/install/) installed.

To follow the instructions, make sure you are on the `iter8/istio-analytics` directory.

### Running a fresh distributed-tracing backend locally

You can use these instructions to run both _Istio Analytics_ and your distributed-tracing backend of choice locally.

#### Option 1: using Jaeger

*1).* Start _Istio Analytics_ and Jaeger:

```bash
docker-compose -f scripts/docker-compose.jaeger.yaml up -d --build
```

*2).* Populate Jaeger with demo traces we have already collected:

```bash
```

#### Option 2: using Zipkin (version: 2.7)

*1).* Start _Istio Analytics_ and Zipkin:

```bash
docker-compose -f scripts/docker-compose.zipkin.yaml up -d --build
```

*2).* Populate Zipkin with demo traces we have already collected:

```bash
```

### Pointing _Istio Analytics_ to an existing tracing backend

If you already have either Jaeger or Zipkin (version 2.7) running, you can point _Istio Analytics_ to it as follows:

```bash
```

## Development

This is the REST API server of the Istio Analytics service. This code has been developed and tested
using Python 3.7.

### Environment variables

The following environment variables control the behavior of the Istio Analytics service:

* `ISTIO_ANALYTICS_SERVER_PORT`: the port on which the API server will listen. Default: 5555.

* `ISTIO_ANALYTICS_DEBUG`: If set to 1 or `true`, the service will run in debug mode. Default: `false`.

* `ISTIO_ANALYTICS_TRACE_BACKEND`(required): Name of backend trace service. Currently only `zipkin` or `jaeger` is supported.

* `ISTIO_ANALYTICS_TRACE_SERVER_URL`(required): URL to the backend trace service containing tracing data.

* `ISTIO_ANALYTICS_TRACE_SERVER_OVERRIDE`: URL to the backend trace service reported as part of the responses (in JSON) given by the Istio Analytics service. This is needed if `ISTIO_ANALYTICS_TRACE_SERVER_URL` is an internal URL not visible from the user's browser where the Istio Analytics UI runs. If not set, the service will report the value of `ISTIO_ANALYTICS_TRACE_SERVER_URL`.

### Test and Visualize APIs from Swagger UI

[Swagger UI](https://swagger.io/tools/swagger-ui/) is adopted in the server to help developers visualize and test the APIs of the server without additional efforts.
After bring the server up locally, you can access the UI in the browser: `http://localhost:<port>/api/v1`.

The port value is set by env var `ISTIO_ANALYTICS_SERVER_PORT`.

### Test cases and code coverage

If you have provisioned the vagrant environment, then simply run the following cmd to run the test inside the vm:

```bash
./scripts/testLocal.sh <backend_server>
```  

Otherwise, activate a python virtual environment([instructions](https://docs.python.org/3/library/venv.html)) and run the commands:

```bash
pip3 install -r test-requirements.txt
./scripts/testLocal.sh <backend_server>
```

Remember to replace <backend_server> with the name of server module you want to test.

The script `testLocal.sh` runs all test cases and produces a detailed code-coverage report that can be inspected by opening the HTML file `code_coverage/index.html` in your browser.
