#!/usr/bin/env bash
set -ex

HERE=$(dirname $0)
VERSION=$GIT_SHA

if [[ -z $GIT_SHA ]]; then
  VERSION=master
fi

if [[ -z $NETWORK ]]; then
  NETWORK=host
else
  # if running on a network, need this config to be able to talk to orderlyweb
  CONFIG_PATH=$(realpath $HERE/../src/config/blackboxTests/api/config.properties)
fi

API_IMAGE=vimc/montagu-api:$VERSION

docker pull $API_IMAGE
docker run -d --rm \
    --network=$NETWORK \
    -p 8080:8080 \
    -v montagu_emails:/tmp/montagu_emails \
    --name api \
    $API_IMAGE

docker exec api mkdir -p /etc/montagu/api/

if [[ ! -z $CONFIG_PATH ]]; then
  docker cp $CONFIG_PATH api:/etc/montagu/api/config.properties
fi

docker exec api touch /etc/montagu/api/go_signal
