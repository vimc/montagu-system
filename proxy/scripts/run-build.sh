#!/usr/bin/env bash
set -ex
HERE=$(dirname $0)
. $HERE/common

# The main build env which tests and builds below
docker build -f build.dockerfile \
    -t $BUILD_ENV_TAG \
    --build-arg MONTAGU_GIT_ID=$GIT_SHA \
    --build-arg MONTAGU_GIT_BRANCH=$GIT_BRANCH \
    .

# This is the path for buildkite agents. If running locally, pass in your own docker config location
# i.e. /home/{user}/.docker/config.json
docker_auth_path=${1:-/var/lib/buildkite-agent/.docker/config.json}

docker run \
    -v $docker_auth_path:/root/.docker/config.json \
    -v /var/run/docker.sock:/var/run/docker.sock \
    --network=host \
    $BUILD_ENV_TAG
