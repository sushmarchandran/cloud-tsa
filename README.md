# restapi_server

This is the REST API server of the Istio Analytics service.

## Environment variables

The following environment variables control the behavior of the Istio Analytics service:

* `ISTIO_ANALYTICS_SERVER_PORT`: the port on which the API server will listen. Default: 5555.

* `ISTIO_ANALYTICS_DEBUG`: If set to 1 or `true`, the service will run in debug mode. Default: `false`.

* `ISTIO_ANALYTICS_ZIPKIN_HOST`: URL to the Zipkin service containing tracing data. Setting this variable is required for the service to run. If Zipkin is running locally on its default port, set this variable to `http://localhost:9411`.
