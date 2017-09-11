#!/bin/bash

if [ -z "${ISTIO_ANALYTICS_SERVER_PORT}" ]; then
  ISTIO_ANALYTICS_SERVER_PORT="5555"
else
  ISTIO_ANALYTICS_SERVER_PORT="${ISTIO_ANALYTICS_SERVER_PORT}"
fi

if [ -z "${ISTIO_ANALYTICS_DEBUG}" ]; then
  ISTIO_ANALYTICS_DEBUG="false"
else
  ISTIO_ANALYTICS_DEBUG="${ISTIO_ANALYTICS_DEBUG}"
fi

export PYTHONPATH=/istio_analytics

source /python3.6-venv/bin/activate
/python3.6-venv/bin/python /istio_analytics/istio_analytics_restapi/app.py
