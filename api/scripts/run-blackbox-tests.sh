#!/usr/bin/env bash
set -ex

export MONTAGU_API_VERSION=$(git rev-parse --short HEAD)
export MONTAGU_DB_VERSION=$(<src/config/db_version)
MONTAGU_API_BRANCH=$(git symbolic-ref --short HEAD)

# Run API and DB
docker-compose pull
docker-compose --project-name montagu up -d
docker exec montagu_api_1 mkdir -p /etc/montagu/api/
docker exec montagu_api_1 touch /etc/montagu/api/go_signal

# Build and run image that can run blackbox tests
docker build --tag libsodium -f libsodium.Dockerfile .
docker build -f blackbox.Dockerfile -t montagu-api-blackbox-tests .
docker run \
  --network montagu_default \
  -v montagu_emails:/tmp/montagu_emails \
  montagu-api-blackbox-tests

# Tear down
docker-compose --project-name montagu down

# Push blackbox tests so they can be reused
registry=docker.montagu.dide.ic.ac.uk:5000
name=montagu-api-blackbox-tests
docker_tag=$registry/$name
commit_tag=$registry/$name:$MONTAGU_API_VERSION
branch_tag=$registry/$name:$MONTAGU_API_BRANCH

docker tag montagu-api-blackbox-tests $commit_tag
docker tag montagu-api-blackbox-tests $branch_tag
docker push $commit_tag 
docker push $branch_tag

