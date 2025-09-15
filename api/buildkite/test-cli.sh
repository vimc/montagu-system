#!/usr/bin/env bash
HERE=$(dirname $0)
. $HERE/common

$HERE/../scripts/start-database.sh

GIT_SHA=master
image=vimc/montagu-cli:${GIT_SHA}
docker run --network $NETWORK $image "$@" add "test" "test" "test" "test"
