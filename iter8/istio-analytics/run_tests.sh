#!/bin/bash

# Set this required environment variable
export ISTIO_ANALYTICS_ZIPKIN_HOST="http://localhost:9411"

sudo python3.6 -m venv /python3.6-venv
source /python3.6-venv/bin/activate

sudo /python3.6-venv/bin/pip3.6 install wheel setuptools nose coverage

sudo /python3.6-venv/bin/pip3.6 install -r requirements.txt

echo ""
echo ""
echo "===================================="
echo "=== STARTING TESTS with NOSETESTS==="
echo "===================================="
echo ""
echo ""

nosetests --exe --with-coverage --cover-package=istio_analytics_restapi --cover-html --cover-html-dir=/istio-analytics/restapi_server/code_coverage