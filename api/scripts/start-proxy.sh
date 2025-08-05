#!/usr/bin/env bash
set -ex

docker rm flower || true

if [[ ! -z $NETWORK ]]; then
  NETWORK_MAPPING="--network=$NETWORK"
else
  # if no network provided, use db default network
  NETWORK_MAPPING="--network=db_nw"
fi

REGISTRY=vimc
# we also need to keep the proxy happy by running the web apps
MONTAGU_ADMIN_TAG=$REGISTRY/montagu-admin-portal:master
docker pull $MONTAGU_ADMIN_TAG
docker run -d \
   --name admin \
   $NETWORK_MAPPING \
   $MONTAGU_ADMIN_TAG

MONTAGU_CONTRIB_TAG=$REGISTRY/montagu-contrib-portal:master
docker pull $MONTAGU_CONTRIB_TAG
docker run -d \
   --name contrib \
   $NETWORK_MAPPING \
   $MONTAGU_CONTRIB_TAG

MONTAGU_PROXY_TAG=$REGISTRY/montagu-reverse-proxy:master
docker pull $MONTAGU_PROXY_TAG
docker run -d \
  -p "443:443" -p "80:80" \
	--name reverse-proxy \
	$NETWORK_MAPPING \
	$MONTAGU_PROXY_TAG 443 localhost