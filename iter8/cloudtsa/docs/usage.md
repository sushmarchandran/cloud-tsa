# Usage

We present an overview of CloudTSA design and architecture in the following section. This will facilitate a better understanding of the steps needed to use CloudTSA with your own Istio application.

## CloudTSA: Design Overview
A CloudTSA alert involves a specific combination of an Istio service, a metric associated with this service, and a CloudTSA detector used in conjuction with this metric in order to trigger the alert. Hence, distinct combinations of services, metrics and detectors lead to distinct alerts as shown in the following figure.

<p align="center">
  <img src="https://raw.github.ibm.com/istio-research/iter8-docs/master/cloudtsa/img/crossproduct.png?token=AAAw2KaXBeOQmNS4hPcnyD3-fI_sYGK-ks5cWhW1wA%3D%3D">
</p>

The component architecture for CloudTSA service integrated with Istio infrastructure is illustrated in the following figure. The CloudTSA service executes the different detectors; the metrics analyzed by the detectors are periodically pulled by the CloudTSA service from the Prometheus service. CloudTSA alerts are written back to Prometheus service (in fact, these alerts are pulled by Prometheus periodically from a CloudTSA REST endpoint). Both the raw metrics and the CloudTSA alerts can be visualized in Grafana using appropriate Prometheus queries within the Grafana dashboards.

<p align="center">
  <img src="https://raw.github.ibm.com/istio-research/iter8-docs/master/cloudtsa/img/cloudtsaarch.png?token=AAAw2FR3IBSdLCWdO5u8EMCyjw7slkJAks5cWhYEwA%3D%3D">
</p>

We can now connect the CloudTSA service to your Istio application by following the five steps
described below.

1. [Basic configuration](#basicconfig)
2. [Deploying the CloudTSA service](#deploy) (includes nodeport creation for cloudtsa; we have to persist this somewhere...)
3. [Service, metric and detector configurations](#advancedconfig)
4. [Starting CloudTSA](#start)
5. [Setting up Grafana](#grafana)

<a name="deploy"></a>
## Deploying the CloudTSA service

To deploy the cloud TSA service, run the following command.
```
cd iter8/iter8/cloudtsa/utils
python3 deploy.py -c <your config.json file>
```
This command exposes the CloudTSA service via a [nodeport](https://kubernetes.io/docs/concepts/services-networking/service/), updates the Prometheus scrape configuration by adding CloudTSA as an end-point
which will be periodically scraped by Prometheus, and restarts prometheus so that these configuration changes take effect.
