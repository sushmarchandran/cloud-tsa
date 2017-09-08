#!/bin/bash

#CREATING PYTHON VIRTUAL ENVIRONMENT
apt-get update && apt-get install -y python3-pip
adduser user
apt-get install python3.6-venv
python3.6 -m venv /python3.6-venv
/bin/bash -c "source /python3.6-venv/bin/activate"


#Running the requirements.txt file
python3.6-venv/bin/pip3.6 install wheel
python3.6-venv/bin/pip3.6 install -r istio_analytics/requirements.txt


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

python3.6-venv/bin/python /istio_analytics/istio_analytics_restapi/app.py
