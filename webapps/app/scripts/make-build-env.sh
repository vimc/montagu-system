#!/usr/bin/env bash
set -ex
git_id=$(git rev-parse --short HEAD)
git_branch=$(git symbolic-ref --short HEAD)

# Shared build env between the main build (being executed now) and the 
# reusable integration test image that will be run in the main Montagu build.
docker build -f ./docker/shared-build-env.dockerfile \
    -t montagu-portal-build-env \
    .

# The main build env which builds and tests in the next step
docker build -f ./docker/build.dockerfile \
    -t montagu-portal-build \
    --build-arg MONTAGU_GIT_ID=$git_id \
    --build-arg MONTAGU_GIT_BRANCH=$git_branch \
    .

# Package up integration tests as a docker image for later rerunning
registry=docker.montagu.dide.ic.ac.uk:5000
name=$registry/montagu-portal-integration-tests

docker build -f ./docker/integration-tests.dockerfile -t $name:$git_id .
docker tag $name:$git_id $name:$git_branch
docker push $name:$git_id
docker push $name:$git_branch
