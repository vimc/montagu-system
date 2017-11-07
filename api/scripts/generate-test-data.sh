#!/usr/bin/env bash
set -ex

registry=docker.montagu.dide.ic.ac.uk:5000
name=montagu-generate-test-data
commit=$(git rev-parse --short HEAD)
branch=$(git symbolic-ref --short HEAD)

# Make the build environment image that is shared between multiple build targets
./scripts/make-build-env.sh

# Setup the database on a named network
db_version=$(<src/config/db_version)
docker network create test-data
docker run -d --rm \
  --name db \
  --network=test-data \
  -p "8000:5432" \
  $registry/montagu-db:$db_version

docker exec db montagu-wait.sh

docker run --rm --network=test-data $registry/montagu-migrate:$db_version

# Generate the test data
docker build --tag $name -f generate-test-data.Dockerfile .
docker run --rm --network=test-data $name

# Dump the test data to an SQL file
docker exec db pg_dump -h localhost -U vimc -d montagu --data-only > ./test-data.sql

# Teardown
docker stop db
docker network rm test-data

# Tag and push
docker_tag=$registry/$name
commit_tag=$registry/$name:$commit
branch_tag=$registry/$name:$branch

docker tag $name $commit_tag
docker tag $name $branch_tag
docker push $commit_tag 
docker push $branch_tag
