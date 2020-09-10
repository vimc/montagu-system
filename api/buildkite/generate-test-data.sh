#!/usr/bin/env bash
set -ex
HERE=$(dirname $0)
. $HERE/common

NAME=montagu-generate-test-data
TAG=$ORG/$NAME
COMMIT_TAG=$TAG:$GIT_SHA
BRANCH_TAG=$TAG:$GIT_BRANCH

function cleanup() {
  set +e
  $HERE/../scripts/stop-database.sh
}
trap cleanup EXIT

$HERE/../scripts/start-database.sh

# Build the test data generating image
docker build -f ./docker/generate-test-data.Dockerfile \
  --tag $NAME \
  --build-arg MONTAGU_GIT_ID=$GIT_SHA \
  .

# Check it runs
docker run --rm --network=$NETWORK $NAME

# Tag and push
docker tag $NAME $COMMIT_TAG
docker tag $NAME $BRANCH_TAG
docker push $COMMIT_TAG
docker push $BRANCH_TAG
