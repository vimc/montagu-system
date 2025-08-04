#!/usr/bin/env bash
set -ex

docker rm flower || true

if [[ ! -z $NETWORK ]]; then
  NETWORK_MAPPING="--network=$NETWORK"
else
  # if no network provided, use db default network
  NETWORK_MAPPING="--network=db_nw"
fi

MONTAGU_PROXY_TAG=vimc/montagu-reverse-proxy:master
docker pull $MONTAGU_PROXY_TAG
docker run -d \
  -p "443:443" -p "80:80" \
	--name reverse-proxy \
	$NETWORK_MAPPING
	$MONTAGU_PROXY_TAG 443 localhost