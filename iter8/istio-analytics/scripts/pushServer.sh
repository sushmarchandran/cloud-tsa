#!/bin/bash

SCRIPTDIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

set -o errexit
set -o xtrace

# If no registry has been provided default to IBM Cloud private registry
if [ -z "${DOCKER_REGISTRY}" ]; then
  export DOCKER_REGISTRY="registry.ng.bluemix.net"
  echo Setting DOCKER_REGISTRY to $DOCKER_REGISTRY
fi

# If no namespace has been provided default to user's local username
if [ -z "${DOCKER_NAMESPACE}" ]; then
  export DOCKER_NAMESPACE=`whoami`
  echo Setting DOCKER_NAMESPACE to $DOCKER_NAMESPACE
fi

docker tag istio-analytics $DOCKER_REGISTRY/$DOCKER_NAMESPACE/istio-analytics
docker push $DOCKER_REGISTRY/$DOCKER_NAMESPACE/istio-analytics
