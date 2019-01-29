#!/bin/bash
MY_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="${MY_DIR%/*}"

echo $ROOT_DIR
docker build $ROOT_DIR -t istio-analytics
