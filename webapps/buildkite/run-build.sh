#!/usr/bin/env bash
set -ex
HERE=$(dirname $0)
. $HERE/common

PORTAL_BUILD_ENV=montagu-portal-build-env

./$HERE/../app/scripts/run-dependencies.sh
./$HERE/../app/scripts/add-test-accounts-for-integration-tests.sh

# In case we switch agents between steps
[ ! -z $(docker images -q $BUILD_ENV_TAG) ] || docker pull $BUILD_ENV_TAG

# We build a docker image that inherits from the latest build env image
# so here tag the image with the name used in the dockerfile
docker tag $BUILD_ENV_TAG $BUILD_ENV_NAME

# The main build env which builds and tests below
docker build -f ./docker/build.dockerfile \
    -t $PORTAL_BUILD_ENV:$GIT_ID \
    --build-arg MONTAGU_GIT_ID=$GIT_SHA \
    --build-arg MONTAGU_GIT_BRANCH=$GIT_BRANCH \
    .

# This is the path for BuildKite agents. If running locally, pass in your own docker config location
# i.e. /home/{user}/.docker/config.json
docker_auth_path=${1:-/var/lib/buildkite-agent/.docker/config.json}

docker run \
    -v $docker_auth_path:/root/.docker/config.json \
    -v /var/run/docker.sock:/var/run/docker.sock \
    --network=host \
   $PORTAL_BUILD_ENV:$GIT_ID
