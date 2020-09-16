#!/usr/bin/env bash
set -ex
HERE=$(dirname $0)

OW_CLI_IMAGE="vimc/orderly-web-user-cli:master"
docker run -v orderly_volume:/orderly $OW_CLI_IMAGE "$@"
