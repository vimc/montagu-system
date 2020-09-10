#!/usr/bin/env bash
set -ex
HERE=$(dirname $0)
. $HERE/common

$HERE/pull-build-env.sh

NAME=montagu-generate-test-data
TAG=$ORG/$NAME
COMMIT_TAG=$TAG:$GIT_SHA
BRANCH_TAG=$TAG:$GIT_BRANCH

$HERE/../scripts/start-database.sh

# Generate the test data
docker build -f ./docker/generate-test-data.Dockerfile \
  --tag $NAME \
  --build-arg MONTAGU_GIT_ID=$GIT_SHA \
  .

docker run --rm --network=$NETWORK $NAME

# Dump the test data to a binary file
docker exec db pg_dump --user=vimc -Fc --no-privileges montagu >./test-data.bin

# Tag and push
docker tag $NAME $COMMIT_TAG
docker tag $NAME $BRANCH_TAG
docker push $COMMIT_TAG
docker push $BRANCH_TAG
