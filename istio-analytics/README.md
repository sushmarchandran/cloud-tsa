# Istio Analytics

The vision behind _Istio Analytics_ is to gain insights from Istio telemetry. Currently, it can
analyze distributed-tracing data collected by Istio, supporting both [Jaeger](https://www.jaegertracing.io/) and [Zipkin](https://zipkin.io/) (version 2.7, v1 API).

To showcase some of the service capabilities, we provide a **rudimentary UI**. **Note that this project is NOT about the UI**; rather, it is about the analytics capabilities provided by the service, which are still evolving.

At the heart of _Istio Analytics_ is a REST API implementing different operations, currently limited to the analysis of distributed traces. One such operation is the _fine-grain, holistic canary analysis_.

## Fine-grain, holistic canary analysis

When a new version of a microservice (the _canary_) is rolled out, a _canary analysis_ is performed to verify how the new version compares to the previous one with respect to performance and errors. A _fine-grain analysis_ further identifies which parts of the new code might be slower. The _holistic_ aspect enables one to understand how the canary affects the entire application, considering all its constituting microservices. Distributed-tracing data collected by Istio enables all of the above.

The following screenshots show the fine-grain, holistic canary analysis for a modified version of Istio's _Bookinfo_ sample application. In this scenario, the _reviews_ microservice is undergoing a canary rollout where version 2 is the baseline and version 3 is the canary (see the inputs below).

*Inputs:*

![Canary Analysis Inputs](https://raw.githubusercontent.com/istio-ecosystem/iter8-docs/master/istio-analytics/img/canary-analysis-input.png)

*Result:*

The next screenshots show how _Istio Analytics_ performs a statistical comparison of baseline and canary. Traces for baseline and canary are aggregated, statistical measures are computed, and the comparative analysis is summarized by colored "needles", green indicating success and red, failure, considering parameters given as input. Yellow boxes represent processing times, and needles over them isolate the comparison for the corresponding elements in the baseline and canary.

Overview            |  Zoom
:-------------------------:|:-------------------------:
![Result Part I](https://raw.githubusercontent.com/istio-ecosystem/iter8-docs/master/istio-analytics/img/canary-analysis-result-part1.png) | ![Result Part II](https://raw.githubusercontent.com/istio-ecosystem/iter8-docs/master/istio-analytics/img/canary-analysis-result-part2.png)

A quick inspection of the results reveals that the canary version of reviews is much slower in processing results returned by _ratings_.

Statistics are also summarized for communication times. One can see two sets of these for baseline traces and canary traces by hovering over each arrow corresponding to an inter-service call, as shown below for calls from _productpage_ to _details_.

![Result Part III](https://raw.githubusercontent.com/istio-ecosystem/iter8-docs/master/istio-analytics/img/canary-analysis-result-part3.png)

## Getting started

The instructions below enable you to quickly run _Istio Analytics_ locally and to see it in action for the fine-grain, holistic canary analysis illustrated above. The instructions assume you have Docker running on your computer and that you have [docker-compose](https://docs.docker.com/compose/install/) installed.

To follow the instructions, make sure you are on the `iter8/istio-analytics` directory.

### Running a fresh distributed-tracing backend locally

You can use these instructions to run both _Istio Analytics_ and your distributed-tracing backend of choice locally.

#### Option 1: using Jaeger

*1).* Start _Istio Analytics_ and Jaeger:

```bash
docker-compose -f scripts/docker-compose.jaeger.yaml up -d --build
```

*2).* Make sure Jaeger is ready by pointing your browser to its UI at `http://localhost:16686`.

*3).* Populate Jaeger with demo traces we have already collected:

```bash
curl https://raw.githubusercontent.com/istio-ecosystem/iter8-docs/master/istio-analytics/traces/jaeger/bookinfo/baseline_canary_demo/jaeger_traces_500_v2_v3spans.json -o ./demo_traces.json

curl -i -X POST http://localhost:9411/api/v2/spans -d @./demo_traces.json --header "Content-Type:application/json"

rm ./demo_traces.json
```

*4).* Point your browser to the _Istio Analytics_ UI at the following URL and click on the `Query` button.

```url
http://localhost:5555/canary/sequence/flow/0/trace/0?start=2019-01-31T16:56:15.0Z&end=2019-01-31T17:26:23.0Z&tags=node_id:reviews-v2&max=500&canaryStart=2019-01-31T16:56:15.0Z&canaryEnd=2019-01-31T17:26:23.0Z&canaryTags=node_id:reviews-v3&canaryMax=500&durationMinCount=100&errorcountMinCount=100&deltaMeanThreshold=0.3&deltaStddevThreshold=0.59&deltaRatioThreshold=0.1
```

*5).* To clean up after you are done, run the following command:

```bash
docker-compose -f scripts/docker-compose.jaeger.yaml down
```

#### Option 2: using Zipkin (version: 2.7)

*1).* Start _Istio Analytics_ and Zipkin:

```bash
docker-compose -f scripts/docker-compose.zipkin.yaml up -d --build
```

*2).* Make sure Zipkin is ready by pointing your browser to its UI at `http://localhost:9411`.

*3).* Populate Zipkin with demo traces we have already collected:

```bash
curl https://raw.githubusercontent.com/istio-ecosystem/iter8-docs/master/istio-analytics/traces/zipkin/bookinfo/baseline_canary_demo/zipkin_traces_500_v2_v3spans.json -o ./demo_traces.json

curl -i -X POST http://localhost:9411/api/v1/spans -d @./demo_traces.json --header "Content-Type:application/json"

rm ./demo_traces.json
```

*4).* Point your browser to the _Istio Analytics_ UI at the following URL and click on the `Query` button.

```url
http://localhost:5555/canary/sequence/flow/0/trace/0?start=2019-01-31T00:55:01.0Z&end=2019-01-31T01:26:24.0Z&tags=node_id:reviews-v2&max=4300&canaryStart=2019-01-31T00:55:01.0Z&canaryEnd=2019-01-31T01:26:24.0Z&canaryTags=node_id:reviews-v3&canaryMax=4300&durationMinCount=100&errorcountMinCount=100&deltaMeanThreshold=0.3&deltaStddevThreshold=0.55&deltaRatioThreshold=0.1
```

*5).* To clean up after you are done, run the following command:

```bash
docker-compose -f scripts/docker-compose.zipkin.yaml down
```

## Pointing _Istio Analytics_ to your Istio installation

* Follow [these instructions](docs/kube-istio-analytics.md) to run _Istio Analytics_ in the same Kubernetes environment where Istio is running and point it to Istio's Jaeger.

* Follow [these instructions](docs/istio-analytics-istio.md) to run _Istio Analytics_ locally and point it to your Istio's mesh tracing backend.

## Development

Below is some important information for developers.

### Environment variables

The following environment variables control the behavior of the Istio Analytics service:

* `ISTIO_ANALYTICS_SERVER_PORT`: the port on which the API server will listen. Default: 5555.

* `ISTIO_ANALYTICS_DEBUG`: If set to 1 or `true`, the service will run in debug mode. Default: `false`.

* `ISTIO_ANALYTICS_TRACE_BACKEND`(required): Name of backend trace service. Currently only `zipkin` or `jaeger` is supported.

* `ISTIO_ANALYTICS_TRACE_SERVER_URL`(required): URL to the backend trace service containing tracing data.

* `ISTIO_ANALYTICS_TRACE_SERVER_OVERRIDE`: URL to the backend trace service reported as part of the responses (in JSON) given by the Istio Analytics service. This is needed if `ISTIO_ANALYTICS_TRACE_SERVER_URL` is an internal URL not visible from the user's browser where the Istio Analytics UI runs. If not set, the service will report the value of `ISTIO_ANALYTICS_TRACE_SERVER_URL`.

### REST API documentation

We document our REST API using Swagger. After bringing up the server locally, you can see the REST API documentation in the browser at `http://localhost:<port>/api/v1`.

The port should match the value of the environment variable `ISTIO_ANALYTICS_SERVER_PORT`, defaulting to 5555.

### Testing and running

To test and run the code locally (not as a Docker container), you will need Python 3.7.

For your development activities, you might want to consider setting up a Python virtual environment ([instructions](https://docs.python.org/3/library/venv.html)) in order to isolate all Python packages required by _Istio Analytics_ from other Python installations you might have.

#### Tests and code-coverage report

To run the test cases, the _Istio Analytics_ server does NOT need to be started. All you have to do is to execute the following commands from the `iter8/istio-analytics` directory:

```bash
pip3 install -r test-requirements.txt
scripts/testsLocal.sh <backend_server>
```

As shown above, the script `testsLocal` takes one parameter, whose value can be either `zipkin` or `jaeger`. In the former case, the code for manipulating Zipkin traces is exercised; in the latter, the Jaeger-related code is executed.

The script `testsLocal.sh` produces a detailed code-coverage report that can be inspected by opening the HTML file `code_coverage/index.html` in your browser.

#### Running the code directly on your computer

In case you want to run _Istio Analytics_ natively (not as a Docker container), you need to set the environment variables `ISTIO_ANALYTICS_TRACE_BACKEND` and `ISTIO_ANALYTICS_TRACE_SERVER_URL` to specify the tracing backend type (either `jaeger` or `zipkin`) and the URL to the tracing backend (e.g., `http://localhost:16686`), respectively. Then, you can run the following commands from the `iter8/istio-analytics` directory:

```bash
pip3 install -r requirements.txt
scripts/localRunServer.sh
```