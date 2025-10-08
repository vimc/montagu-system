#!/usr/bin/env bash
set -ex
HERE=$(dirname $0)
. $HERE/common

docker rm flower || true

if [[ ! -z $NETWORK ]]; then
  NETWORK_MAPPING="--network=$NETWORK"
else
  # if no network provided, use db default network
  NETWORK_MAPPING="--network=db_nw"
fi

# TODO: get from ghcr once that's migrated
# we also need to keep the proxy happy by running the web apps
MONTAGU_ADMIN_TAG=$ORG/montagu-admin-portal:main
docker pull $MONTAGU_ADMIN_TAG
docker run -d \
   --name admin \
   $NETWORK_MAPPING \
   $MONTAGU_ADMIN_TAG

MONTAGU_CONTRIB_TAG=$ORG/montagu-contrib-portal:main
docker pull $MONTAGU_CONTRIB_TAG
docker run -d \
   --name contrib \
   $NETWORK_MAPPING \
   $MONTAGU_CONTRIB_TAG

MONTAGU_PROXY_TAG=$ORG/montagu-proxy:main
docker pull $MONTAGU_PROXY_TAG
docker run -d \
  -p "443:443" -p "80:80" \
	--name reverse-proxy \
	$NETWORK_MAPPING \
	$MONTAGU_PROXY_TAG 443 localhost
