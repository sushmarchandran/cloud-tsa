<h1 align="center">
  <br>
  CloudTSA
  <br>
</h1>

<h3 align="center">Time series toolkit for analysis of CloudOps metrics. Integrated with Prometheus and Grafana.</h3>

<p align="center">
  <a href="#demo">Demo</a> •
  <a href="#key-features">Key Features</a> •
  <a href="#get-started">Get Started</a> •
  <a href="#usage">Usage</a> •
  <a href="#related">Related</a>
</p>

## Demo
In this demo, CloudTSA forecasts latency of services based on recent trends and predicts if latency will violate a preset threshold.
Service `svc0` experiences a gradual increase in mean latency from ~ 0.1 sec to ~ 8.0 sec as seen in the graph on the left. CloudTSA learns this trend and creates two types of alerts for `svc0` as seen on the graph on the right.

  1. A 'reactive' alert (yellow curve) *after* the mean latency value violates a preset threshold.

  2. A 'predictive' alert (blue curve) *before* the mean latency value violates a preset threshold. CloudTSA uses the Holt-Winters triple exponential smoothing algorithm to infer the increasing trend in latency and *predicts* that latency is likely to violate a preset threshold.

  <p align="center">
    <img src="https://raw.githubusercontent.com/istio-ecosystem/iter8-docs/master/cloudtsa/gif/gradual_latency.gif">
  </p>

## Key Features

1. Analyze your CloudOps metrics using four different time series analysis algorithms
    * Use trends to *predict* performance degradations *before* they occur using Holt-Winters triple exponential smoothing algorithm
    * Detect abrupt changes in metrics using CUSUM algorithm
    * Detect peaks in metrics
    * Detect when metrics violate thresholds
2. Easily combine any metric from [Prometheus](https://prometheus.io) with above detectors
    * Use [Prometheus queries](https://prometheus.io/docs/prometheus/latest/querying/basics/) to specify a metric in CloudTSA in minutes
3. Easily adjust the behavior of detectors in minutes using configurable parameters
4. CloudTSA alerts integrated with Prometheus and Grafana
    * Visualize CloudTSA in [Grafana](https://grafana.com)
    * Use [Prometheus alert management capabilities](https://prometheus.io/docs/alerting/alertmanager/) with CloudTSA alerts
5. Run the CloudTSA service within a [Docker container](https://www.docker.com)

## Get Started
[Run](./docs/getstarted.md) the various CloudTSA demos in your Kubernetes environment.

## Usage
[Use](./docs/usage.md) CloudTSA with your Istio application.

## Related
1. [Exponential Smoothing](https://en.wikipedia.org/wiki/Exponential_smoothing)
2. [CUSUM](https://en.wikipedia.org/wiki/CUSUM) algorithm
3. [Book](https://otexts.com/fpp2/) on time series forecasting. Our implementation of Holt-Winters based predictive threshold detection uses formulae from the [exponential smoothing](https://otexts.com/fpp2/expsmooth.html) chapter in this book.
4. [Book](http://people.irisa.fr/Michele.Basseville/kniga/kniga.pdf) on detection of abrupt changes.
5. Background on [peak detection](https://nbviewer.jupyter.org/github/demotu/BMC/blob/master/notebooks/DetectPeaks.ipynb). Our implementation is an incremental (streaming) version of the peak detection algorithm in this jupyter notebook.
6. More background on [CUSUM](https://nbviewer.jupyter.org/github/demotu/BMC/blob/master/notebooks/DetectCUSUM.ipynb). Our implementation is an incremental (streaming) version of the CUSUM algorithm in this jupyter notebook.
