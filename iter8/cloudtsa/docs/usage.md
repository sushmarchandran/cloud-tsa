# Usage

We present an overview of CloudTSA design and architecture in the following section. This will facilitate a better understanding of the steps needed to use CloudTSA with your own Istio application.

## CloudTSA: Design Overview
A CloudTSA alert involves a specific combination of a service, a metric associated with this service, and a CloudTSA detector used in conjuction with this metric in order to trigger the alert. Hence, distinct combinations of services, metrics and detectors lead to distinct alerts as shown in the following figure.

<p align="center">
  <img src="https://raw.githubusercontent.com/istio-ecosystem/iter8-docs/master/cloudtsa/img/crossproduct.png">
</p>

The component architecture for CloudTSA service integrated with Istio infrastructure is illustrated in the following figure. The CloudTSA service executes the different detectors; the metrics analyzed by the detectors are periodically pulled by the CloudTSA service from the Prometheus service. CloudTSA alerts are written back to Prometheus service (in fact, these alerts are pulled by Prometheus periodically from a CloudTSA REST endpoint). Both the raw metrics and the CloudTSA alerts can be visualized in Grafana using appropriate Prometheus queries within the Grafana dashboards.

<p align="center">
  <img src="https://raw.githubusercontent.com/istio-ecosystem/iter8-docs/master/cloudtsa/img/cloudtsaarch.png">
</p>

We can now connect the CloudTSA service to your Istio application by following the five steps
described below.

1. [Basic configuration](#basicconfig)
2. [Deploying the CloudTSA service](#deploy)
3. [Service, metric and detector configurations](#advancedconfig)
4. [Starting CloudTSA](#start)
5. [Setting up Grafana](#grafana)

<a name="basicconfig"></a>
## Basic Configuration
Copy `iter8/iter8/cloudtsa/config/config.json` file that was used for the demo. Edit its contents as follows to include external IP of your Kubernetes Cluster under `config['external_ip']` and the Absolute Path of the CloudTSA project folder till the `iter8/iter8/cloudtsa` folder under `config['project_home']`.


<a name="deploy"></a>
## Deploying the CloudTSA service

To deploy the Cloud TSA service, run the following command.
```
cd iter8/iter8/cloudtsa/utils
python3 deploy.py -c <path/to/your/config.json>
```
**The above command** deploys the CloudTSA service, exposes it via a [nodeport](https://kubernetes.io/docs/concepts/services-networking/service/), updates the Prometheus scrape configuration by adding CloudTSA as an end-point which will be periodically scraped by Prometheus, and restarts prometheus so that these configuration changes take effect.

<a name="advancedconfig"></a>
## Service, metric and detector configurations

<a name="start"></a>
## Starting CloudTSA
Once all the files have been set to user defined configurations, we are ready to start the CloudTSA service with these new configuration files. To do so navigate to the correct folder and run:
```
cd iter8/iter8/cloudtsa/utils
python3 startandfire.py -d <path/to/your/detectors.json> -m <path/to/your/metrics.json> -t <path/to/your/topology.json> -c <path/to/your/config.json>
```
**The above command** POSTS all the configuration files to the CloudTSA REST Endpoint. This means that the CloudTSA service now starts observing the user application and reports to Prometheus in accordance to the posted configuration files.


<a name="grafana"></a>
## Setting up Grafana
CloudTSA metrics can be visualized like any other Prometheus Metric. For sample Grafana templates please refer to the [Dashboard](https://github.ibm.com/istio-research/iter8-final/blob/master/iter8/cloudtsa/docs/getstarted.md) used in the demo.
