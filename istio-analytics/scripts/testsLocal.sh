#!/bin/bash

SCRIPTDIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

if [ -n "${1}" ]; then
   trace_backend="${1}" 

   case ${trace_backend} in 
      jaeger) 
         server_url="http://localhost:16686" 
         ;; 
      zipkin) 
	   server_url="http://localhost:9411" 
         ;; 
      *)
         echo ""
         echo "Invalid tracing backend."
         echo "Usage: `basename ${0}` <'zipkin' | 'jaeger'>"
         echo ""
         exit 1
         ;; 
   esac 

   export ISTIO_ANALYTICS_TRACE_BACKEND=${trace_backend}
   export ISTIO_ANALYTICS_TRACE_SERVER_URL=${server_url}
else
   echo ""
   echo "Please, specify the target tracing backend ('zipkin' or 'jaeger') for tests."
   echo "Usage: `basename ${0}` <'zipkin' | 'jaeger'>"
   echo ""
   exit 1
fi

echo Setting ISTIO_ANALYTICS_TRACE_BACKEND to $ISTIO_ANALYTICS_TRACE_BACKEND
echo Setting ISTIO_ANALYTICS_TRACE_SERVER_URL to $ISTIO_ANALYTICS_TRACE_SERVER_URL

export ISTIO_ANALYTICS_DEBUG=false

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
