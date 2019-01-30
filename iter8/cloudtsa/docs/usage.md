# Usage

Use CloudTSA with your Istio application

# Table of Contents
1. [CloudTSA: Design and Architecture](#arch)
2. [Starting the CloudTSA service](#startup)
3. [Configuring Prometheus](#prometheus)
4. [Configuring Grafana](#grafana)
5. [Configuring CloudTSA](#cloudtsa)
    - [Schema for the overall configuration](#overall)
    - [Basic configuration](#basic)
    - [Topology](#topology)
    - [Defining metrics](#metrics)
    - [Configuring detectors](#detectors)

## Cloud TSA Component Architecture

<p align="center">
  <img src="https://raw.github.ibm.com/istio-research/iter8-docs/master/cloudtsa/img/crossproduct.png?token=AAAw2KaXBeOQmNS4hPcnyD3-fI_sYGK-ks5cWhW1wA%3D%3D">
</p>

<p align="center">
  <img src="https://raw.github.ibm.com/istio-research/iter8-docs/master/cloudtsa/img/cloudtsaarch.png?token=AAAw2FR3IBSdLCWdO5u8EMCyjw7slkJAks5cWhYEwA%3D%3D">
</p>



Using Cloud TSA with your application involves four steps:

1. Connecting your `Cloud TSA` and `Prometheus` services with each other
2. Telling the `Cloud TSA` service about the metrics in Prometheus which you want to analyze
3. Telling the `Cloud TSA` service about time series detectors which you want to use for their analysis
4. Visualizing `Cloud TSA` alerts in Prometheus and Grafana

Details of these steps...

#### Step 1

#### Step 2

#### Step 3

#### Step 4
