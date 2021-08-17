#!/usr/bin/env bash
set -e
HERE=$(dirname $0)
. $HERE/common

docker pull vimc/openjdk-libsodium:master
docker build -f ./docker/shared-build-env.dockerfile \
    -t $BUILD_ENV_TAG \
    .

# We have to push this so it's available to other build steps
docker push $BUILD_ENV_TAG
