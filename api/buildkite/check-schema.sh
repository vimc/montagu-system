#!/usr/bin/env bash
set -ex
HERE=$(dirname $0)
. $HERE/common

$HERE/pull-build-env.sh

SCHEMA_CHECK=montagu-api-schema-check

docker build -f ./docker/check-schema.Dockerfile \
  --tag $SCHEMA_CHECK \
  --build-arg MONTAGU_GIT_ID=$GIT_SHA \
  .

docker run --rm $SCHEMA_CHECK
