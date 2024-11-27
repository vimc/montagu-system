#!/usr/bin/env bash
set -ex

HERE=$(dirname $0)
. $HERE/common

docker build \
    -t $BRANCH_TAG \
    -t $SHA_TAG \
    .

docker push $SHA_TAG
docker push $BRANCH_TAG
