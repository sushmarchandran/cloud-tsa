# Usage

Use CloudTSA with your Istio application. We start with the following design overview of CloudTSA.

## CloudTSA: Design Overview
A CloudTSA alert involves a specific combination of an entity, a metric associated with this entity, and a CloudTSA detector used in conjuction with this metric in order to trigger the alert. Hence, distinct combinations of entities, metrics and detectors lead to distinct alerts as shown in the following figure.

<p align="center">
  <img src="https://raw.githubusercontent.com/istio-ecosystem/iter8-docs/master/cloudtsa/img/crossproduct.png">
</p>

In the above figure and in all our demo examples, the entities are the services belonging to the application. However, it is possible to define entities more broadly. For example, consider tracking error counts (HTTP responses with status codes 4xx or 5xx) over 30 sec windows for each service. The distinct combinations of service names and status codes can be identified with the entities in this example.

Each metric that is analyzed by CloudTSA is associated with a corresponding Prometheus query template. In the above example, the metric under consideration is error counts. The entities associated with a metric are automatically inferred by CloudTSA from the Prometheus responses for the corresponding query.

The component architecture for CloudTSA is illustrated in the following figure. The CloudTSA instantiates and executes the different detectors; the metrics analyzed by the detectors are periodically pulled by CloudTSA from Prometheus. We also configure Prometheus to pull CloudTSA alerts periodically from the `/alerts` endpoint. Both the raw metrics and the CloudTSA alerts can be visualized in Grafana.

<p align="center">
  <img src="https://raw.githubusercontent.com/istio-ecosystem/iter8-docs/master/cloudtsa/img/cloudtsaarch.png">
</p>

<!-- Entities associated with a metric are automatically inferred by CloudTSA from the Prometheus responses for the queries made by CloudTSA for this metric. The idea is to treat prometheus responses as . Prometheus supports aggregation operations on its queries over all label dimensions using a *by* clause. In CloudTSA, the labels defined under this clause in the query definition forms the *entity keys*, each combination of label values returned in the response is an *entity* and the value returned corresponding to each entity is the value we use to analyze changes for that entity. If a *by* clause is not specified and a single value is returned for the whole query, we use a default entity called *your_application*. -->

Follow the steps below to integrate CloudTSA with your Istio application.

1. [Basic configuration](#basicconfig)
2. [Deploying the CloudTSA service](#deploy)
3. [Service, metric and detector specifications](#advancedconfig)
4. [Starting CloudTSA](#start)
5. [Setting up Grafana](#grafana)

<a name="basicconfig"></a>
## Basic Configuration
Make a copy of `iter8/cloudtsa/config/config.json` which we will henceforth refer to as your
`config.json` file. Edit its contents to include the external IP of your Kubernetes cluster. This is the IP address we will use to access the CloudTSA service. Also specify the absolute path of the CloudTSA project folder. Here is an example.
```json
{
  "prometheus_url": "http://prometheus.istio-system.svc.cluster.local:9090",
  "external_ip": "http://169.47.97.150",
  "project_home": "/home/istio/iter8/cloudtsa",
  "test_connection_query": "istio_requests_total"
}
```

<a name="deploy"></a>
## Deploying the CloudTSA service

To deploy the Cloud TSA service, run the following commands.
```
cd iter8/cloudtsa/utils
python deploy.py -c <path/to/your/config.json>
```
**The above command** deploys the CloudTSA service, exposes it via a [nodeport](https://kubernetes.io/docs/concepts/services-networking/service/), updates the Prometheus scrape configuration by adding CloudTSA as an end-point which will be periodically scraped by Prometheus, and restarts prometheus so that these configuration changes take effect.

<a name="advancedconfig"></a>
## Metric and detector specifications

### Metric specifications
Make a copy of `iter8/cloudtsa/config/metrics.json` which we will henceforth refer to as your
`metrics.json` file. This file specifies the Prometheus query templates for all the metrics analyzed by CloudTSA. In the following example, we have defined three metrics namely, `latency`, `error_counts`, and `load`.

```json
{
  "duration": 30,
  "metrics": {
  "latency": {
    "query_template": "(sum(increase(istio_request_duration_seconds_sum{source_app='istio-ingressgateway', reporter='source', destination_service_namespace='default'}[$durationsec])) by (destination_service_name)) / (sum(increase(istio_request_duration_seconds_count{source_app='istio-ingressgateway', reporter='source', destination_service_namespace='default'}[$durationsec])) by (destination_service_name))"
  },
  "error_counts": {
    "query_template": "sum(increase(istio_requests_total{response_code=~'5..', source_app='istio-ingressgateway', reporter='source', source_app='istio-ingressgateway', destination_service_namespace='default'}[$durationsec])) by (destination_service_name)"
  },
  "load": {
    "duration": 45,
    "query_template": "sum(increase(istio_requests_total{source_app='istio-ingressgateway', reporter='source', destination_service_namespace='default'}[$durationsec])) by (destination_service_name)"
  }
}
}
```

In the above examples, notice that the Prometheus query templates have a group by clause (specified using the `by` keyword) with `destination_service_name` as the group key. In general, each group in a Prometheus response corresponds to a distinct entity. We require each Prometheus response to be an [instant vector](https://prometheus.io/docs/prometheus/latest/querying/basics/).

In the query template, the time period of aggregation is the variable `$durationsec`. The default value of this variable is specified by the `duration` field and can be overridden within individual metric specifications. The `duration` field (sec) also determines how often CloudTSA queries Prometheus -- different metrics can be collected at different frequencies.

### Detector specifications
Make a copy of `iter8/cloudtsa/config/detectors.json` which we will henceforth refer to as your
`detectors.json` file. Below is an example. In this example, we are using all the four detectors available in CloudTSA. Each detector has a set of parameters which require specification. Note that a specific detector can be used with different metrics with distinct parameter values. For e.g., the **changedetection** detector is used with the *latency* and *error_counts* metrics with distinct parameter values.

We now describe the configuration fields for each of these detectors below.
1. **predictivethresholds**: This detector works by forecasting the value of the metric
using the [Holt-Winters triple exponential smoothing with additive damped trend and additive seasonality](https://otexts.com/fpp2/taxonomy.html) technique for *forecast_length* time steps
into the future. If any of these forecasts lie outside the interval *[min_value, max_value]*, then
the detector triggers an alarm. The parameters *cycle_length*, *forecast_length*,
*alpha*, *beta*, *gamma*, and *phi* correspond to parameters *m*, *h*,
&alpha;, &beta;, &gamma;, and &phi; in [Table 7.6 of the book](https://otexts.com/fpp2/taxonomy.html#tab:pegels). The forecast and hence any alerting itself will begin only after
*initialization_length* time steps.

2. **changedetection**: Our change detector uses the [CUSUM](https://en.wikipedia.org/wiki/CUSUM)
algorithm. The drift parameter corresponds to weights &omega;<sub>n</sub> or the likelihood function
&omega;. If the cumulative sum exceeds the threshold in the positive or negative direction then
an alert is triggered.

3. **thresholdpolicy**: An alert is triggered if the metric value lies outside the interval
*[min_value, max_value]*.

4. **peakdetection**: An alert is triggered for every peak detected in the data. A peak in the metric value is a local maxima based on the property that its value must be greater than its immediate neighbors. Note that these alerts are not generated *as soon as* the metric value reaches its peak value but is generated *after* the metric value reaches a peak and drops back below a threshold thereby *creating* a peak in the data. The *min_peak_height*, *min_peak_distance*, *threshold* and *edge* parameters below correspond to *mph*, *mpd*, *threshold* and *edge* in the function `detect_peaks.py` on [this](https://nbviewer.jupyter.org/github/demotu/BMC/blob/master/notebooks/DetectPeaks.ipynb) Jupiter Notebook.

```json
{
  "predictivethresholds": {
    "latency": {
      "forecast_type": "holtwinters",
      "forecast_parameters": {
        "cycle_length": 1,
        "initialization_length": 3,
        "forecast_length": 10,
        "alpha": 0.85,
        "beta": 0.85,
        "gamma": 0.0,
        "phi": 0.93
      },
      "threshold_parameters": {
        "min_value": -99999,
        "max_value": 4.0
      }
    }
  },
  "changedetection": {
    "latency": {
      "threshold": 1,
      "drift": 1
    },
    "error_counts": {
      "threshold": 8,
      "drift": 2
    }
  },
  "thresholdpolicy": {
    "latency": {
      "min_value": -99999,
      "max_value": 7
    }
  },
  "peakdetection": {
    "load": {
      "min_peak_height": 100,
      "min_peak_distance": 3,
      "threshold": 100,
      "edge": "rising"
    }
  }
}
```

<a name="start"></a>
## Starting CloudTSA
To start the CloudTSA service, run the following commands.
```
cd iter8/cloudtsa/utils
python startandfire.py -d <path/to/your/detectors.json> -m <path/to/your/metrics.json> -t <path/to/your/topology.json> -c <path/to/your/config.json>
```
**The above command** POSTs all the configuration files to a CloudTSA REST Endpoint. This means that the CloudTSA service now starts observing the user application and reports to Prometheus in accordance with the configuration files.

<a name="grafana"></a>
## Setting up Grafana
CloudTSA alerts can be visualized like other Prometheus metrics on Grafana. Refer to [this](https://raw.githubusercontent.com/istio-ecosystem/iter8-docs/master/cloudtsa/gif/gradual_latency.gif) panel used in the CloudTSA demo as an example.
