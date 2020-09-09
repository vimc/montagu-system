#!/usr/bin/env bash
set -ex
HERE=$(dirname $0)
. $HERE/common

NAME=montagu-generate-test-data
TAG=$ORG/$NAME
COMMIT_TAG=$TAG:$GIT_SHA
BRANCH_TAG=$TAG:$GIT_BRANCH
DB_IMAGE=$ORG/montagu-db:$DB_VERSION
MIGRATE_IMAGE=$ORG/montagu-migrate:$DB_VERSION

# Teardown on exit
function cleanup() {
  set +e
  docker stop db
  docker network rm test-data
}
trap cleanup EXIT

# Setup the database on a named network
docker network create test-data
docker run -d --rm \
  --name db \
  --network=test-data \
  $DB_IMAGE /etc/montagu/postgresql.test.conf

docker exec db montagu-wait.sh

docker run --rm --network=test-data $MIGRATE_IMAGE

# Generate the test data
docker build -f ./docker/generate-test-data.Dockerfile \
  --tag $NAME \
  --build-arg MONTAGU_GIT_ID=$GIT_SHA \
  .

docker run --rm --network=test-data $NAME

# Dump the test data to a binary file
docker exec db pg_dump --user=vimc -Fc --no-privileges montagu >./test-data.bin

# Tag and push
docker tag $NAME $COMMIT_TAG
docker tag $NAME $BRANCH_TAG
docker push $COMMIT_TAG
docker push $BRANCH_TAG
