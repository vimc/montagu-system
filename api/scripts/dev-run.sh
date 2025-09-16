#!/usr/bin/env bash
set -ex

HERE=$(dirname $0)
. $HERE/common

GIT_SHA=$(git rev-parse --short=7 HEAD)
API_IMAGE=$ORG/$API_NAME:$GIT_SHA

(cd $HERE/../src && ./gradlew :app:distTar)

# Build docker image
docker build --tag $API_IMAGE -f $HERE/../src/app/Dockerfile $HERE/..

# Run start-api with the docker image
. $HERE/start-all.sh $API_IMAGE