#!/usr/bin/env bash
set -ex
HERE=$(dirname $0)
. $HERE/common

# This is the path for Buildkite agents. If running locally, pass in your own docker config location
# i.e. /home/{user}/.docker/config.json
DOCKER_AUTH_PATH=${1:-$BUILDKITE_DOCKER_AUTH_PATH}

# Create an image based on the shared build env that compiles and dockerises
# the CLI
docker build --tag montagu-api-cli-build \
    --build-arg git_id=$GIT_SHA \
    --build-arg git_branch=$GIT_BRANCH \
    -f ./docker/cli.Dockerfile \
    .

# Run test dependencies
$HERE/../scripts/start-database.sh

# Run the created image
docker run --rm \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v $DOCKER_AUTH_PATH:/root/.docker/config.json \
    --network=$NETWORK \
    montagu-api-cli-build
