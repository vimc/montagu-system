#!/usr/bin/env bash
set -ex

HERE=$(dirname $0)
VERSION=$1

if [[ -z $1 ]]; then
  VERSION=master
fi

if [[ ! -z $NETWORK ]]; then
  NETWORK_MAPPING="--network=$NETWORK"
else
  # if no network specified, use the default db network
   NETWORK_MAPPING="--network=db_nw"
fi

# need this config to be able to talk to orderlyweb
CONFIG_PATH=$(realpath $HERE/../src/config/blackboxTests/config.properties)

API_IMAGE=vimc/montagu-api:$VERSION

docker pull $API_IMAGE
docker run -d --rm \
    $NETWORK_MAPPING \
    -p 8080:8080 \
    -v montagu_emails:/tmp/montagu_emails \
    --name api \
    $API_IMAGE

docker exec api mkdir -p /etc/montagu/api/
docker cp $CONFIG_PATH api:/etc/montagu/api/config.properties
docker exec api touch /etc/montagu/api/go_signal
