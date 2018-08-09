#!/bin/bash

SCRIPTDIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

if [ -z "${ISTIO_ANALYTICS_ZIPKIN_HOST}" ]; then
  export ISTIO_ANALYTICS_ZIPKIN_HOST="http://localhost:9411"
  echo Setting ISTIO_ANALYTICS_ZIPKIN_HOST to $ISTIO_ANALYTICS_ZIPKIN_HOST
fi

echo ""
echo ""
echo "===================================="
echo "=== STARTING TESTS with NOSETESTS==="
echo "===================================="
echo ""
echo ""

set -o xtrace
cd $SCRIPTDIR/..
nosetests --exe --with-coverage --cover-package=istio_analytics_restapi --cover-html --cover-html-dir=$SCRIPTDIR/../code_coverage
