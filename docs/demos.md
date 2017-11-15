# Instructions for demonstrating Istio Analytics

## 1. Basic setup: run the Istio Analytics server

Before demonstrating the Istio Analytics capabilities, the Istio Analytics server must be running. 
Below we have instructions on how to set it up to run either locally or on Armada. Follow the instructions
suitable for your desired demo environment.

* [Running locally with native Docker](#setup-for-running-locally-on-environments-with-native-docker-installed)
* [Running locally on a VM](#setup-for-running-locally-on-environments-with-no-native-docker)
* [Running on Armada](#setup-for-running-on-armada)

### Setup for running locally on environments with native Docker installed

Make sure you have [Docker](https://www.docker.com/) installed on your laptop.

Then, follow these steps:

1. If you do not have Docker Compose installed, follow the 
[Docker Compose installation instructions](https://docs.docker.com/compose/install/) for your OS.

2. Clone the GitHub repository `git@github.ibm.com:istio-analytics/restapi_server.git`.

3. Go into the top directory of the GitHub repo cloned above and run the following commands:

```bash
cd scripts
docker-compose up -d --build
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

### Setup for running locally on environments with no native Docker 

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
sudo docker-compose up -d --build
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

### Setup for running on Armada

1. Clone the GitHub repository `git@github.ibm.com:istio-analytics/restapi_server.git`.

2. Build the istio-analytics Docker image by running the following commands from the top directory
where you cloned the repo above:

```bash
cd scripts
./buildDocker.sh
```

3. Ensure you are logged into the IBM Bluemix image registry by doing `bx cr images`.
If you are not logged in do `bx cr login`.  If _bx cr_ is not a registered command
do `bx plugin install container-registry -r Bluemix` and then repeat the steps above.

```bash
export DOCKER_NAMESPACE=<your Docker namespace> # Use "bx cr namespaces" for your Bluemix namespace
```

From the _restapi_server/scripts_ directory, run `./pushServer.sh` to push
a copy of the Istio Analytics server to a Docker repo.  It defaults to the IBM
Cloud private Docker repo.

4. Provide local access to Istio's Zipkin so that historical demo data may be loaded

```bash
kubectl port-forward --namespace istio-system $(kubectl get pod --namespace istio-system -l app=zipkin -o jsonpath='{.items[0].metadata.name}') 9411:9411 &
```

5. Verify you can access Istio's Zipkin by pointing your browser to Zipkin's UI at 
[http://localhost:9411](http://localhost:9411).

6. Clone the GitHub repository containing Zipkin traces we will use to populate Zipkin with historical
data. This repository is `git@github.ibm.com:istio-analytics/dev_env.git`.

7. Populate Zipkin with historical data by going into the top directory of the repo cloned above 
and running the following command:

```bash
scripts/zipkinPopulate.sh
``` 
**Note that Zipkin will have this historical data, but will also continue accumulating new data.**
 
8. Authorize the _istio-system_ namespace in your cluster to read your private images if given _imagePullSecrets_

```bash
# See https://www.ibm.com/blogs/bluemix/2017/03/whats-secret-pull-image-non-default-kubernetes-namespace-ibm-bluemix-container-service/
kubectl get secret bluemix-default-secret -o yaml | sed 's/namespace: default/namespace: istio-system/g' | kubectl -n istio-system create -f -
```

9. Start the Istio analytics web service and UI

```bash
DOCKER_REGISTRY="registry.ng.bluemix.net" # Or use another registry
DOCKER_NAMESPACE=<your Docker namespace> # Use "bx cr namespaces" for your Bluemix namespace
cat istio-analytics.yaml | \
   sed "s/NAMESPACE/$DOCKER_NAMESPACE/" | \
   sed "s/REGISTRY/$DOCKER_REGISTRY/" | \
   kubectl create -f -
kubectl port-forward --namespace istio-system $(kubectl get pod --namespace istio-system -l run=istio-analytics -o jsonpath='{.items[0].metadata.name}') 5555:5555 &
```

10. Now you are ready to demonstrate Istio Analytics. Follow the [Istio Analytics UI instructions](#2-using-the-istio-analytics-ui) next.

## 2. Using the Istio Analytics UI

The scenarios below demonstrate analytics performed on distributed traces of the _Bookinfo_ sample application. Istio Analytics can statistically aggregate traces and compare them. The sequence suggested here takes the viewer through the various capabilities of Istio Analytics, including aggregating traces showing normal behavior; aggregating traces while detecting timeouts, retries, and errors; and finally, comparing 
baseline and canary aggregated traces.

### Scenario 1: Traces showing normal behavior

This scenario demonstrates the statistical aggregation of traces of the  _Bookinfo_ sample application
exhibiting normal behavior. In order to show it, point your browser to the following URL:

[http://localhost:5555/uml5/sequence/flow/0/trace/0?start=2017-10-27T20:08:00.0Z&end=2017-10-27T20:11:00.0Z&max=500&auto=true](http://localhost:5555/uml5/sequence/flow/0/trace/0?start=2017-10-27T20:08:00.0Z&end=2017-10-27T20:11:00.0Z&max=500&auto=true)

In this case, version 1 of the `reviews` microservice was used.

### Scenario 2: Traces showing normal behavior and one additional microservice

This scenario also demonstrates traces exhibiting normal behavior. This time, the `ratings` microservice
appears on the traces because version 2 of the `reviews` microservice was used during the time interval of interest. That version of reviews calls the `ratings` microservice.

Point your browser to the following URL to go through this scenario:

[http://localhost:5555/uml5/sequence/flow/0/trace/0?start=2017-10-27T20:12:00.0Z&end=2017-10-27T20:16:00.0Z&max=500&auto=true](http://localhost:5555/uml5/sequence/flow/0/trace/0?start=2017-10-27T20:12:00.0Z&end=2017-10-27T20:16:00.0Z&max=500&auto=true)

### Scenario 3: Traces showing a timeout-policy mismatch and retries

Like the previous scenario, version 2 of the `reviews` microservice was used. However, a delay of 7 seconds was injected to all calls to the `ratings` microservice. This scenario highlights a mismatch between the timeout parameters of the `productpage` and `reviews`: even though `productpage` calls `reviews`, the first times out but the latter proceeds with its call to `ratings`. As a result, the response returned by `ratings` (dangling arrows) are not processed by `reviews`. 

Note that the sequence diagram shows that `productpage` retries calling `reviews` and times out again. The blue arrows/labels depict the timeouts.

Point your browser to the following URL to go through this scenario:

[http://localhost:5555/uml5/sequence/flow/0/trace/0?start=2017-11-13T16:18:14.0Z&end=2017-11-13T18:01:00.0Z&max=500&auto=true](http://localhost:5555/uml5/sequence/flow/0/trace/0?start=2017-11-13T16:18:14.0Z&end=2017-11-13T18:01:00.0Z&max=500&auto=true)

### Scenario 4: Traces showing compatible timeout policies with retries and errors

In this scenario, we use version 3 of the `reviews` microservice, which has a timeout parameter compatible with that of the `productpage` microservice. Thus, in this case, `reviews` times out before `productpage`. When `reviews` times out, it returns a 500 HTTP code to `productpage`; in response to that, `productpage` retries calling `reviews`, which times out and again returns a 500 HTTP code back to `productpage`. After the second retry, `productpage` returns a 200 HTTP code back to the end user.

Note that, in this case, `ratings` never received the call from `reviews`. Also, the red arrows/labels indicate that the call from `productpage` to `reviews` received a 500 HTTP return code.

Point your browser to the following URL to see this scenario:

[http://localhost:5555/uml5/sequence/flow/0/trace/0?start=2017-11-13T18:17:17.0Z&end=2017-11-13T19:48:35.0Z&max=5&auto=true](http://localhost:5555/uml5/sequence/flow/0/trace/0?start=2017-11-13T18:17:17.0Z&end=2017-11-13T19:48:35.0Z&max=5&auto=true)

### Scenario 5: Fine-grain, holistic canary comparisons

In this scenario, we show the sequence diagram for two time intervals: a baseline and a canary. In the baseline
time interval, version 2 of `reviews` was used, whereas in the canary time interval `reviews` version 3 was used. The sequence diagram shows the effect of the rollout of the new version of `reviews`. Each element on the diagram has a
needle that can be red or green. The needle can also be vertical or point to the left or right.

In the diagram, the red needle shows the portion that was significantly slower for the version 3 of `reviews`; in particular, the time needed to process a response returned by `ratings`.

Point your browser to the following URL to see this scenario:

[http://localhost:5555/canary/sequence/flow/0/trace/0?start=2017-09-19T19:27:00.0Z&end=2017-09-19T19:30:00.0Z&max=50&canaryStart=2017-09-19T19:34:00.0Z&canaryEnd=2017-09-19T19:36:00.0Z&canaryMax=500&auto=true](http://localhost:5555/canary/sequence/flow/0/trace/0?start=2017-09-19T19:27:00.0Z&end=2017-09-19T19:30:00.0Z&max=50&canaryStart=2017-09-19T19:34:00.0Z&canaryEnd=2017-09-19T19:36:00.0Z&canaryMax=500&auto=true)

### Scenario 6: Volume flow diagram 

## 3. Cleaning up after the demo (for local runs)

To clean up after running the demo locally (not on Armada), you should remove the `zipkin` and `istio-analytics` Docker containers that are running on your laptop. Below we suggest one way of doing so.

If you are on an environment with native Docker, run the following command from the same directory
from where you ran the `docker-compose` command during setup:  

```bash
docker-compose down
```

If you used our Vagrantfile to create a VirtualBox VM, run the following commands:  

```bash
cd /istio-analytics/restapi_server/scripts
sudo docker-compose down
```

**Note that, after the clean-up, the next time you run the demo locally you will need start from the basic setup instructions again.**