#!/bin/bash

SCRIPTDIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

if [ -z "${ISTIO_ANALYTICS_ZIPKIN_HOST}" ]; then
  export ISTIO_ANALYTICS_ZIPKIN_HOST="http://localhost:9411"
  echo Setting ISTIO_ANALYTICS_ZIPKIN_HOST to $ISTIO_ANALYTICS_ZIPKIN_HOST
fi

export ISTIO_ANALYTICS_DEBUG=true
python $SCRIPTDIR/../istio_analytics_restapi/app.py