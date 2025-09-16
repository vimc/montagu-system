#!/usr/bin/env bash
set -ex

HERE=$(dirname $0)
. $HERE/common

API_IMAGE=$1

if [[ -z $1 ]]; then
  #TODO: use main on ghcr once building to there
  API_IMAGE=$OLD_ORG/$API_NAME:master
  # assume we should use local image if it is specified, pull latest main if not
  docker pull $API_IMAGE
fi

CONFIG_PATH=$HERE/docker-config.properties

if [[ ! -z $NETWORK ]]; then
  NETWORK_MAPPING="--network=$NETWORK"
else
  # if no network specified, use the default db network
   NETWORK_MAPPING="--network=db_nw"
fi

EMAILS_FOLDER=/tmp/montagu_emails

[ -e $EMAILS_FOLDER ] || mkdir $EMAILS_FOLDER

docker run -d --rm \
    $NETWORK_MAPPING \
    -p 8080:8080 \
    --mount type=bind,src="$EMAILS_FOLDER",target="$EMAILS_FOLDER" \
    --name api \
    $API_IMAGE

docker exec api mkdir -p /etc/montagu/api/
docker cp $CONFIG_PATH api:/etc/montagu/api/config.properties
docker exec api touch /etc/montagu/api/go_signal
