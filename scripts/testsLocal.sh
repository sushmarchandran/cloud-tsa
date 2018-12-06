#!/bin/bash

SCRIPTDIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

if [ ! -z "${1}" ]; then
   trace_backend="${1}" 

   case ${trace_backend} in 
      jaeger) 
         server_url="http://localhost:16686" 
         ;; 
      zipkin) 
	   server_url="http://localhost:9411" 
         ;; 
      *)  
         echo "Input trace backend can not be recognized." 
         echo "`basename ${0}`:usage: [trace_backend]" 
         exit 1
         ;; 
   esac 

   export ISTIO_ANALYTICS_TRACE_BACKEND=${trace_backend}
   export ISTIO_ANALYTICS_TRACE_SERVER_URL=${server_url}
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
