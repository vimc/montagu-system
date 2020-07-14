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

docker build -f ./docker/integration-tests.dockerfile \
        -t $TAG_SHA \
        --build-arg MONTAGU_GIT_ID=$GIT_SHA \
        .

docker tag $TAG_SHA $TAG_BRANCH
docker push $TAG_SHA
docker push $TAG_BRANCH
