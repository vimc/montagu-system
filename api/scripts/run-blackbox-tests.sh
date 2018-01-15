#!/usr/bin/env bash
set -ex

export MONTAGU_API_VERSION=$(git rev-parse --short=7 HEAD)
export MONTAGU_DB_VERSION=$(<src/config/db_version)
MONTAGU_API_BRANCH=$(git symbolic-ref --short HEAD)
registry=docker.montagu.dide.ic.ac.uk:5000
migrate_image=$registry/montagu-migrate:$MONTAGU_DB_VERSION

# Run API and DB
docker-compose pull
docker-compose --project-name montagu up -d
docker exec montagu_api_1 mkdir -p /etc/montagu/api/
docker exec montagu_api_1 touch /etc/montagu/api/go_signal

docker exec --network=montagu_default db montagu-wait.sh
docker exec --network=montagu_default db_annex montagu-wait.sh

docker pull $migrate_image
docker run --rm --network=montagu_default $migrate_image
docker run --rm --network=montagu_default $migrate_image -configFile=conf/flyway-annex.conf migrate

# Build and image that can run blackbox tests
docker build --tag libsodium -f libsodium.Dockerfile .
docker build -f blackbox.Dockerfile -t montagu-api-blackbox-tests .

# Push blackbox tests image so it can be reused
name=montagu-api-blackbox-tests
docker_tag=$registry/$name
commit_tag=$registry/$name:$MONTAGU_API_VERSION
branch_tag=$registry/$name:$MONTAGU_API_BRANCH

docker tag montagu-api-blackbox-tests $commit_tag
docker tag montagu-api-blackbox-tests $branch_tag
docker push $commit_tag 
docker push $branch_tag

# Run the tests
docker run \
  --network montagu_default \
  -v montagu_emails:/tmp/montagu_emails \
  montagu-api-blackbox-tests

# Tear down
docker-compose --project-name montagu down


