#!/usr/bin/env bash
set -ex

HERE=$(dirname $0)
. $HERE/../scripts/common

MINIMAL_BRANCH_TAG=$ORG/montagu-reverse-proxy-minimal:$GIT_BRANCH
MINIMAL_SHA_TAG=$ORG/montagu-reverse-proxy-minimal:$GIT_SHA

docker build \
    -t $MINIMAL_BRANCH_TAG \
    -t $MINIMAL_SHA_TAG \
    .

if [[ "$BUILDKITE" = "true" ]]; then
    docker push $MINIMAL_SHA_TAG
    docker push $MINIMAL_BRANCH_TAG
fi
