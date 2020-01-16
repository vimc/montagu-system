#!/usr/bin/env bash
set -e

here=$(dirname $0)
$here/../db/scripts/stop.sh

docker kill orderly-web
docker rm orderly-web

