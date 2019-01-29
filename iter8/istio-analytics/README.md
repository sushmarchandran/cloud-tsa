# Introduction

This is the REST API server of the Istio Analytics service. This code has been developed and tested
using Python 3.6.

## Environment variables

The following environment variables control the behavior of the Istio Analytics service:

* `ISTIO_ANALYTICS_SERVER_PORT`: the port on which the API server will listen. Default: 5555.

* `ISTIO_ANALYTICS_DEBUG`: If set to 1 or `true`, the service will run in debug mode. Default: `false`.

* `ISTIO_ANALYTICS_TRACE_BACKEND`(required): Name of backend trace service. Currently only `zipkin` or `jaeger` is supported.

* `ISTIO_ANALYTICS_TRACE_SERVER_URL`(required): URL to the backend trace service containing tracing data.

* `ISTIO_ANALYTICS_TRACE_SERVER_OVERRIDE`: URL to the backend trace service reported as part of the responses (in JSON) given by the Istio Analytics service. This is needed if `ISTIO_ANALYTICS_TRACE_SERVER_URL` is an internal URL not visible from the user's browser where the Istio Analytics UI runs. If not set, the service will report the value of `ISTIO_ANALYTICS_TRACE_SERVER_URL`.

## Running the server locally

### Approach 1: Docker on Host

Prerequisite: [docker-compose](https://docs.docker.com/compose/install/)

To build and run the istio-analytics server and backend trace server containers on docker platform using docker-compose:
#### Option 1: Zipkin as backend

```bash
docker-compose -f scripts/docker-compose.zipkin.yaml up -d
```

#### Option 2: Jaeger as backend

```bash
docker-compose -f scripts/docker-compose.jaeger.yaml up -d
```

If you have your own trace service running, you can bring up istio analytics server only.
Make sure to fill in the values for environment variables `ISTIO_ANALYTICS_TRACE_BACKEND` and `ISTIO_ANALYTICS_TRACE_SERVER_URL` in the docker-compose file before running the following command:
```bash
docker-compose -f scripts/docker-compose.server_only.yaml up -d
``` 
### Approach 2: Inside a Vagrant VM

Instead of running on host, you can choose to run both the contianersinside a vm.

Prerequisite:
* [vagrant](https://www.vagrantup.com)
* [VirtualBox](https://www.virtualbox.org)

Run the following command to bring up and go into the vagrant vm:
```bash
cd scripts
vagrant up
vagrant ssh
```

After going inside the vm, run the following cmds to bring up `istio-analytics` and `jaeger`
```bash
cd /istio-analytics/restapi_server/scripts
sudo docker-compose -f scripts/docker-compose.jaeger.yaml up -d 
```

or `zipkin`:
```bash
cd /istio-analytics/restapi_server/scripts
sudo docker-compose -f scripts/docker-compose.zipkin.yaml up -d 
```

### Approach 3: On bare host with python virtual environment

Prerequisites:
* [python3](https://www.python.org/download/releases/3.0/)

As an alternative, you can also run the Istio Analytics on host machine which might be easier for debugging process. It is recommended to run the server inside a Python virtual environment as explained [here](https://docs.python.org/3/library/venv.html).

After activating the virtual environment, run the following cmd to install all dependencies only for the first time of activation:

```bash
pip3 install -r requirements.txt
```

You can bring the server up later on:
```bash
./scripts/localRunServer.sh <backend_server> <server_url>
```

Replace `backend_server` and `server_url` with name and endpoint of the trace backend server. 

## Populate the Trace Backend Server with Tracing Data

Tracing data for [bookinfo example](https://istio.io/docs/examples/bookinfo/) has been collected for experimental and demonstrative purposes. You can follow the [instructions](https://github.ibm.com/istio-analytics/dev_env#populate-trace-server) to populate your trace backend with the pre-collected data.

## Test and Visualize APIs from Swagger UI

[Swagger UI](https://swagger.io/tools/swagger-ui/) is adopted in the server to help developers visualize and test the APIs of the server without additional efforts. 
After bring the server up locally, you can access the UI in the browser:

```
http://localhost:<port>/api/v1
```

The port value is set by env var `ISTIO_ANALYTICS_SERVER_PORT`.

## Test cases and code coverage
** Make sure the code can pass all current test cases before submitting a PR. **

If you have provisioned the vagrant environment, then simply run the following cmd to run the test inside the vm:
```bash
./scripts/testLocal.sh <backend_server>
```  

Otherwise, activate a python virtual environment([instructions](https://docs.python.org/3/library/venv.html)) and run the cmds:
```bash
pip3 install -r test-requirements.txt
./scripts/testLocal.sh <backend_server>
```

Remember to replace <backend_server> with the name of server module you want to test. 
 
The script `testLocal.sh` runs all test cases and produces a detailed code-coverage report that can be inspected by opening the HTML file `code_coverage/index.html` in your browser.
