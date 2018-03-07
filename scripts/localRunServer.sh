#!/bin/bash

SCRIPTDIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

if [ -z "${ISTIO_ANALYTICS_ZIPKIN_HOST}" ]; then
  export ISTIO_ANALYTICS_ZIPKIN_HOST="http://localhost:9411"
  echo Setting ISTIO_ANALYTICS_ZIPKIN_HOST to $ISTIO_ANALYTICS_ZIPKIN_HOST
fi

if [ -z "${ISTIO_ANALYTICS_SKYDIVE_HOST}" ]; then
  export ISTIO_ANALYTICS_SKYDIVE_HOST="http://9.4.193.143:30703/topology"
  echo Setting ISTIO_ANALYTICS_ZIPKIN_HOST to $ISTIO_ANALYTICS_SKYDIVE_HOST
fi

export PYTHONPATH=$SCRIPTDIR/..
# export ISTIO_ANALYTICS_DEBUG=true
python3 $SCRIPTDIR/../istio_analytics_restapi/app.py
