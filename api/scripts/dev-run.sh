#!/usr/bin/env bash
set -ex
HERE=$(dirname $0)

API_IMAGE=montagu_api_local_dev

(cd $HERE/../src && ./gradlew :app:distTar)

# Build docker image
docker build --tag $API_IMAGE -f $HERE/../src/app/Dockerfile $HERE/..

# Run start-api with the docker image
. $HERE/start-all.sh $API_IMAGE