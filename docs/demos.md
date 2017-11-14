# Instructions for demonstrating Istio Analytics

## 1. Basic setup: run the Istio Analytics server locally

The first thing to do is to start the Istio Analytics server and Zipkin locally. We provide a Docker Compose manifest file to deploy both our server and Zipkin as Docker containers.

### Setup for environments with native Docker installed

Make sure you have [Docker](https://www.docker.com/) installed on your laptop.

Then, follow these steps:

1. If you do not have Docker Compose installed, follow the 
[Docker Compose installation instructions](https://docs.docker.com/compose/install/) for your OS.

2. Clone the GitHub repository `git@github.ibm.com:istio-analytics/restapi_server.git`.

3. Go into the top directory of the GitHub repo cloned above and run the following commands:

```bash
cd scripts
docker-compose up -d
```

4. At this point, you should have both Istio Analytics and Zipkin running. Confirm that by running `docker-compose ps`.
This command's output should show a container named `istio-analytics` and one named `zipkin`.

5. Verify that Zipkin is ready by pointing your browser to Zipkin's UI at 
[http://localhost:9411](http://localhost:9411). If may take a few seconds for Zipkin to get started.

6. Clone the GitHub repository containing Zipkin traces we will use to populate Zipkin.
This repository is `git@github.ibm.com:istio-analytics/dev_env.git`.

7. Populate Zipkin with previously-collected traces by going into the top directory of the repo cloned above 
and running the following command:

```bash
scripts/zipkinPopulate.sh
```

8. Now you are ready to demonstrate Istio Analytics. Follow the [Istio Analytics UI instructions](#2-using-the-istio-analytics-ui) next.

### Setup for environments with no native Docker 

If you do not want to (or cannot) install Docker on your system, you can resort to our Vagrantfile to create
a VirtualBox VM with Docker and Docker Compose. 

In this case, make sure you have VirtualBox and vagrant installed on your system.

Then, follow these steps:

1. Clone the GitHub repository containing the Vagrantfile.
This repository is `git@github.ibm.com:istio-analytics/dev_env.git`.

2. Clone the GitHub repository containing the Istio Analytics server code.
This repository is `git@github.ibm.com:istio-analytics/restapi_server.git`.

3. Make sure the directories `dev_env` and `restapi_server` are siblings in your 
directory tree.

4. Go into the `dev_env` directory and run the following commands:

```bash
vagrant up
vagrant ssh
``` 

5. Now that you are inside the VM, you need to start the Istio Analytics server and 
Zipkin. To do so, run the following command:

```bash
cd /istio-analytics/restapi_server/scripts
sudo docker-compose up -d
```

6. At this point, you should have both Istio Analytics and Zipkin running. Confirm that by running 
`sudo docker-compose ps`. This command's output should show a container named `istio-analytics` and one named `zipkin`.

7. Verify that Zipkin is ready by pointing your browser to Zipkin's UI at 
[http://localhost:9411](http://localhost:9411). If may take a few seconds for Zipkin to get started.

8. Populate Zipkin with previously-collected traces by running the following command:

```bash
/istio-analytics/dev_env/scripts/zipkinPopulate.sh
```

9. Now you are ready to demonstrate Istio Analytics. Follow the [Istio Analytics UI instructions](#2-using-the-istio-analytics-ui) next.

## 2. Using the Istio Analytics UI

The scenarios below demonstrate analytics performed on traces to statistically aggregate and compare them. The sequence suggested here takes the viewer through the various capabilities of Istio Analytics, including aggregating traces showing normal behavior; aggregating traces while detecting timeouts, retries, and errors; and finally, comparing 
baseline and canary aggreagated traces. 

### Scenario 1: Traces showing normal behavior

This scenario demonstrates the statistical aggregation of traces from the  _Bookinfo_ sample application
exhibiting normal behavior. In order to show it, point your browser to the following URL:
[]()