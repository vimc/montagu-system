#!/usr/bin/env bash
set -ex

HERE=$(dirname $0)
ROOT=$(realpath $HERE/..)

ORDERLY_PATH=$ROOT/src/demo
ORDERLY_IMAGE="vimc/orderly:master"
OW_MIGRATE_IMAGE="vimc/orderlyweb-migrate:master"

if [[ -z $NETWORK ]]; then
  NETWORK=host
else
  # if running on a network, need this config to be able to talk to the api
  CONFIG_PATH=$(realpath $HERE/../src/config/blackboxTests/orderlyweb)
  VOLUME_MAPPING="-v $CONFIG_PATH:/etc/orderly/web"
fi

# create orderly db
if [[ -d $ORDERLY_PATH ]]; then
  rm $ORDERLY_PATH -rf
fi

if [[ -d $ROOT/src/git ]]; then
  rm $ROOT/src/git -rf
fi

docker pull $ORDERLY_IMAGE
docker run --rm \
    --entrypoint create_orderly_demo.sh \
    -v "$ROOT/src:/orderly" \
    -u $UID \
    -w /orderly \
    $ORDERLY_IMAGE .

# migrate to add orderlyweb tables
docker pull $OW_MIGRATE_IMAGE
docker run --rm -v "$ORDERLY_PATH:/orderly" $OW_MIGRATE_IMAGE

OW_CLI_IMAGE="vimc/orderly-web-user-cli:master"
docker run -v $ORDERLY_PATH:/orderly $OW_CLI_IMAGE add-users user@test.com
docker run -v $ORDERLY_PATH:/orderly $OW_CLI_IMAGE grant user@test.com */users.manage

# start orderlyweb
ORDERLY_WEB_IMAGE="vimc/orderly-web:master"
docker pull $ORDERLY_WEB_IMAGE
docker run -d --rm \
    -v "$ORDERLY_PATH:/orderly" \
    $VOLUME_MAPPING \
    -p 8888:8888 \
    --network=$NETWORK \
    --name orderly-web \
    $ORDERLY_WEB_IMAGE

docker exec orderly-web mkdir -p /etc/orderly/web
docker exec orderly-web touch /etc/orderly/web/go_signal
