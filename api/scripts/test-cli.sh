#!/usr/bin/env bash
HERE=$(dirname $0)
. $HERE/common

CLI_IMAGE=$1
docker run --network $NETWORK $CLI_IMAGE "$@" add "test" "test" "test" "test"
