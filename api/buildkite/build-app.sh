#!/usr/bin/env bash
set -ex
HERE=$(dirname $0)
. $HERE/common

# This is the path for Buildkite agents. If running locally, pass in your own docker config location
# i.e. /home/{user}/.docker/config.json
DOCKER_AUTH_PATH=${1:-$BUILDKITE_DOCKER_AUTH_PATH}

# Create an image based on the shared build env that compiles, tests and dockerises
# the app
docker build --tag montagu-api-app-build \
    --build-arg git_id=$GIT_SHA \
    --build-arg git_branch=$GIT_BRANCH \
    -f ./docker/app.Dockerfile \
    .

# Run test dependencies
$HERE/../scripts/start-database.sh
$HERE/../scripts/start-orderly-web.sh
$HERE/../scripts/start-api.sh
$HERE/../scripts/start-task-queue.sh

# Run the created image
docker run --rm \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v $DOCKER_AUTH_PATH:/root/.docker/config.json \
    --network=$NETWORK \
    montagu-api-app-build
