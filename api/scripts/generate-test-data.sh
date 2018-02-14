#!/usr/bin/env bash
set -ex

registry=docker.montagu.dide.ic.ac.uk:5000
name=montagu-generate-test-data
commit=$(git rev-parse --short=7 HEAD)
branch=$(git symbolic-ref --short HEAD)

# Make the build environment image that is shared between multiple build targets
./scripts/make-build-env.sh

# Setup the database on a named network
db_version=$(<src/config/db_version)
docker network create test-data
docker run -d --rm \
  --name db \
  --network=test-data \
  $registry/montagu-db:$db_version

# Teardown on exit
function cleanup {
    set +e
    docker stop db
    docker network rm test-data
}
trap cleanup EXIT

docker exec db montagu-wait.sh

docker run --rm --network=test-data $registry/montagu-migrate:$db_version /etc/montagu/postgresql.test.conf

# Generate the test data
docker build --tag $name -f generate-test-data.Dockerfile .
docker run --rm --network=test-data $name

# Dump the test data to a binary file
docker exec db pg_dump --user=vimc -Fc --no-privileges montagu > ./test-data.bin

# Tag and push
docker_tag=$registry/$name
commit_tag=$registry/$name:$commit
branch_tag=$registry/$name:$branch

docker tag $name $commit_tag
docker tag $name $branch_tag
docker push $commit_tag 
docker push $branch_tag
