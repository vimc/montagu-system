#!/usr/bin/env bash
set -ex

./../scripts/run-orderly-web-deps.sh $PWD

# start orderlyweb
ORDERLY_WEB_IMAGE="vimc/orderly-web:master"
docker pull $ORDERLY_WEB_IMAGE
docker run -d -v "$PWD/demo:/orderly" --net=host --name orderly-web $ORDERLY_WEB_IMAGE

docker exec orderly-web mkdir -p /etc/orderly/web
docker exec orderly-web touch /etc/orderly/web/go_signal

