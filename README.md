# restapi_server

This is the REST API server of the Istio Analytics service. This code has been developed and tested
using Python 3.6.

## Environment variables

The following environment variables control the behavior of the Istio Analytics service:

* `ISTIO_ANALYTICS_SERVER_PORT`: the port on which the API server will listen. Default: 5555.

* `ISTIO_ANALYTICS_DEBUG`: If set to 1 or `true`, the service will run in debug mode. Default: `false`.

* `ISTIO_ANALYTICS_ZIPKIN_HOST`: URL to the Zipkin service containing tracing data. Setting this variable is required for the service to run. If Zipkin is running locally on its default port, set this variable to `http://localhost:9411`.

## Swagger UI

The interactive Swagger documentation for the REST API is available at:

```
http://<host>:<port>/api/v1
```

The REST API is fully documented there.

## Test cases and code coverage

The script `/istio-analytics/restapi_server/run_tests.sh` runs all test cases and produces a detailed code-coverage report that can be inspected by opening the HTML file `/istio-analytics/restapi_server/code_coverage/index.html` in your browser. The directory `code_coverage` is populated as part of the `run_tests.sh` script.

Make sure to run the script `run_tests.sh` from inside the development VM that can be provisioned using vagrant. See the development-environment git repository [here](https://github.ibm.com/istio-analytics/dev_env).

## Running the demo locally

### Preferred approach: Docker

First, you need to follow the instructions in [dev_env](https://github.ibm.com/istio-analytics/dev_env/) to stand up a development environment and Zipkin instance with test data.

The preferred way to run Istio Analytics inside the development VM is via Docker. You need to build the `istio_analytics` Docker image and start the container. You can do so by running the following commands:

```bash
sudo /istio-analytics/restapi_server/scripts/buildDocker.sh
sudo /istio-analytics/restapi_server/scripts/runDocker.sh
```

### Alternative approach

As an alternative, you can also run the following script to start Istio Analytics locally:
```bash
./scripts/localRunServer.sh
```

Note, however, that before running this script you will have to make sure Python 3.6 is installed and used. That might entail creating a virtual environment and installing all dependencies declared in `requirements.txt` inside the virtual environment. For that reason, it is just simpler to build the Docker image and run Istio Analytics as a Docker container.