#!/usr/bin/env bash
set -ex
HERE=$(dirname $0)
. $HERE/common

NAME=montagu-api-blackbox-tests
TAG=$ORG/$NAME
COMMIT_TAG=$TAG:$GIT_SHA
BRANCH_TAG=$TAG:$GIT_BRANCH

# Run test dependencies
$HERE/../scripts/start-database.sh
$HERE/../scripts/start-orderly-web.sh
$HERE/../scripts/start-api.sh

# Build an image that can run blackbox tests
docker build -f ./docker/blackbox.Dockerfile -t $NAME .

# Run the tests
docker run --rm \
  --network $NETWORK \
  -v montagu_emails:/tmp/montagu_emails \
  $NAME

# Push blackbox tests image so it can be reused
docker tag $NAME $COMMIT_TAG
docker tag $NAME $BRANCH_TAG
docker push $COMMIT_TAG
docker push $BRANCH_TAG
