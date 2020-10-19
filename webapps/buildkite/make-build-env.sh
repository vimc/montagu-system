 #!/usr/bin/env bash
set -e
HERE=$(dirname $0)
. $HERE/common

docker pull vimc/node-docker-openjdk:master

# Shared build env between the main build (being executed now) and the
# reusable integration test image that will be run in the main Montagu build.
docker build -f ./docker/shared-build-env.dockerfile \
    -t $BUILD_ENV_TAG \
    .

# We have to push this so it's available to other build steps
docker push $BUILD_ENV_TAG
