#!/bin/bash


SCRIPTDIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

if [ -z "${V_ENV_ROOT_DIR}" ]; then
  export V_ENV_ROOT_DIR=/tmp
  echo "V_ENV_ROOT_DIR not set. Defaulting to /tmp"
fi

if [ -z "${ISTIO_ANALYTICS_ZIPKIN_HOST}" ]; then
  export ISTIO_ANALYTICS_ZIPKIN_HOST="http://localhost:9411"
  echo Setting ISTIO_ANALYTICS_ZIPKIN_HOST to $ISTIO_ANALYTICS_ZIPKIN_HOST
fi

echo "Creating a Python virtual environment under $V_ENV_ROOT_DIR"
python3.6 -m venv $V_ENV_ROOT_DIR/python3.6-venv
source $V_ENV_ROOT_DIR/python3.6-venv/bin/activate

$V_ENV_ROOT_DIR/python3.6-venv/bin/pip3.6 install wheel setuptools nose coverage
$V_ENV_ROOT_DIR/python3.6-venv/bin/pip3.6 install -r $SCRIPTDIR/../requirements.txt

export PYTHONPATH=$SCRIPTDIR/..
export ISTIO_ANALYTICS_DEBUG=true
$V_ENV_ROOT_DIR/python3.6-venv/bin/python3.6 $SCRIPTDIR/../istio_analytics_restapi/app.py
