#!/usr/bin/env bash
set -ex

git_id=$(git rev-parse --short=7 HEAD)
git_branch=$(git symbolic-ref --short HEAD)

# Shared build env between the main build and the integration tests
docker build -f shared-build-env.dockerfile \
    -t montagu-reverse-proxy-shared-build-env \
    --build-arg MONTAGU_GIT_ID=$git_id \
    --build-arg MONTAGU_GIT_BRANCH=$git_branch \
    .

# The main build env which builds and tests in the next step
docker build -f build.dockerfile \
    -t montagu-reverse-proxy-build-env \
    --build-arg MONTAGU_GIT_ID=$git_id \
    --build-arg MONTAGU_GIT_BRANCH=$git_branch \
    .

# The integration tests image
docker build -f integration-tests.dockerfile \
    -t montagu-reverse-proxy-integration-tests \
    .