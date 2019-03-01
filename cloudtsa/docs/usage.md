# Usage

The following design overview of CloudTSA will facilitate a better understanding of the steps needed to use CloudTSA with your own Istio application.

## CloudTSA: Design Overview
A CloudTSA alert involves a specific combination of an entity, a metric associated with this entity, and a CloudTSA detector used in conjuction with this metric in order to trigger the alert. Hence, distinct combinations of entities, metrics and detectors lead to distinct alerts as shown in the following figure.

An entity, in this context is determined by the response  obtained from Prometheus to user defined queries. Prometheus supports aggregation operations on its queries over all label dimensions using a *by* clause. In CloudTSA, the labels defined under this clause in the query forms the *entity keys*, each element of the label returned in the response is an *entity* and the value returned corresponding to each entity is the value we use to analyze changes for that entity. If a *by* clause is not specified and a single value is returned for the whole query, we use a daulft entity called *your_application*. Although in all our demo examples, we group the query responses by the label *destination_service_name*, both Prometheus and CloudTSA allow aggregation over multiple label names.


<p align="center">
  <img src="https://raw.githubusercontent.com/istio-ecosystem/iter8-docs/master/cloudtsa/img/crossproduct.png">
</p>

The component architecture for CloudTSA service monitoring an Istio application is illustrated in the following figure. The CloudTSA service executes the different detectors; the metrics analyzed by the detectors are periodically pulled by the CloudTSA service from the Prometheus service. CloudTSA alerts are written back to Prometheus service (in fact, these alerts are pulled by Prometheus periodically from a CloudTSA REST endpoint). Both the raw metrics and the CloudTSA alerts can be visualized in Grafana using appropriate Prometheus queries within the Grafana dashboards.

<p align="center">
  <img src="https://raw.githubusercontent.com/istio-ecosystem/iter8-docs/master/cloudtsa/img/cloudtsaarch.png">
</p>

The following five steps described below will help integrate the CloudTSA service with your Istio application.

1. [Basic configuration](#basicconfig)
2. [Deploying the CloudTSA service](#deploy)
3. [Service, metric and detector specifications](#advancedconfig)
4. [Starting CloudTSA](#start)
5. [Setting up Grafana](#grafana)

<a name="basicconfig"></a>
## Basic Configuration
Make a copy of `iter8/cloudtsa/config/config.json` which we will henceforth refer to as your
`config.json` file. Edit its contents to include the external IP of your Kubernetes cluster
and the absolute path of the CloudTSA project folder. Here is an example.
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
`metrics.json` file. Below is an example. In this example, we have defined three metrics namely, `latency`, `error_counts`, and `load`. The `query_template` field for each metric is the template of a Prometheus aggregation query pertaining to a specific entity (in this case notice that results are grouped by `destination_service_name`). CloudTSA requires each Prometheus query to return an [instant vector](https://prometheus.io/docs/prometheus/latest/querying/basics/). In the query template, the time period of aggregation, `$durationsec` is a variable whose values will be substituted by CloudTSA with the `duration` value of that metric.

The `duration` field determines how often each metric is queried. The unit for this field is seconds. Each metric can have its own field for `duration` as in the case of the `load` metric below. If this is not specified, the globally specified `duration` (which is 30 seconds in the example below) is used for each metric.

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
