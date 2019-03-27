#!/usr/bin/env bash
set -ex

export MONTAGU_PROXY_TESTS=montagu-proxy-tests

# If we do not have a node_modules dir (which will be the case on teamcity agent), create a volume so we can access
# the node_modules installed during the tests to copy into the proxy image
NODE_MODULES_DIR=$PWD/node_modules
VOLUME_PARAM=
if [ ! -d "$NODE_MODULES_DIR" ];
then
  VOLUME_PARAM="-v $NODE_MODULES_DIR:/workspace/node_modules"
fi

docker build -f ./tests/tests.dockerfile -t $MONTAGU_PROXY_TESTS .
docker run $VOLUME_PARAM $MONTAGU_PROXY_TESTS