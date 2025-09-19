#!/usr/bin/env bash
CLI_IMAGE=$1
docker run --network $NETWORK $CLI_IMAGE "$@" add "test" "test" "test" "test"
