#!/usr/bin/env bash
# Builds and pushes a reusable integration test image that will be run in the main Montagu build.
set -e
HERE=$(dirname $0)
. $HERE/common

NAME=$ORG/montagu-portal-integration-tests
TAG_SHA=$NAME:$GIT_SHA
TAG_BRANCH=$NAME:$GIT_BRANCH

# In case we switch agents between steps
[ ! -z $(docker images -q $BUILD_ENV_TAG) ] || docker pull $BUILD_ENV_TAG

# We build a docker image that inherits from the latest build env image
# so here tag the image with the name used in the dockerfile
docker tag $BUILD_ENV_TAG $BUILD_ENV_NAME

docker build -f ./docker/integration-tests.dockerfile -t $TAG_SHA .
docker tag $TAG_SHA $TAG_BRANCH
docker push $TAG_SHA
docker push $TAG_BRANCH
