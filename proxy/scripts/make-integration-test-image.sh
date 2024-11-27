#!/usr/bin/env bash

set -e

HERE=$(dirname $0)
. $HERE/common

docker build -f integration-tests.dockerfile \
    -t $INTEGRATION_TESTS_TAG \
    .

if [[ "$BUILDKITE" = "true" ]]; then
    docker push $INTEGRATION_TESTS_TAG
fi
