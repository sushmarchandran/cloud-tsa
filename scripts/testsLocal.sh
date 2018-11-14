#!/bin/bash

SCRIPTDIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

# Override env settings if cmd args have been set
if [ ! -z "${1}" ]; then
   trace_backend="${1}" 

   case ${trace_backend} in 
      jaeger) server_url="${2}"
         if [ -z "${server_url}" ]; then
	    server_url="http://localhost:16686" 
         fi
         ;; 
      zipkin) server_url="${2}" 
         if [ -z "${server_url}" ]; then
	    server_url="http://localhost:9411" 
         fi
         ;; 
      *)  
         echo "Input trace backend can not be recognized." 
         echo "`basename ${0}`:usage: [trace_backend] [server_url]" 
         exit 1
         ;; 
   esac 

   export ISTIO_ANALYTICS_TRACE_BACKEND=${trace_backend}
   export ISTIO_ANALYTICS_TRACE_SERVER_URL=${server_url}
fi

# If env vars have not been set completely, they would be set to default options
if [ -z "${ISTIO_ANALYTICS_TRACE_BACKEND}" ] || [ -z "${ISTIO_ANALYTICS_TRACE_SERVER_URL}" ]; then
   export ISTIO_ANALYTICS_TRACE_BACKEND="zipkin"
   export ISTIO_ANALYTICS_TRACE_SERVER_URL="http://localhost:9411"
fi

echo Setting ISTIO_ANALYTICS_TRACE_BACKEND to $ISTIO_ANALYTICS_TRACE_BACKEND
echo Setting ISTIO_ANALYTICS_TRACE_SERVER_URL to $ISTIO_ANALYTICS_TRACE_SERVER_URL

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
