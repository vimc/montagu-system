#!/usr/bin/env bash
set -ex

export MONTAGU_API_VERSION=$(git rev-parse --short=7 HEAD)
export MONTAGU_DB_VERSION=$(<src/config/db_version)
MONTAGU_API_BRANCH=$(git symbolic-ref --short HEAD)
registry=docker.montagu.dide.ic.ac.uk:5000
migrate_image=$registry/montagu-migrate:$MONTAGU_DB_VERSION

# Clear orderly web demo folder
rm $PWD/src/demo -rf
rm $PWD/src/git -rf
mkdir $PWD/src/demo

# Run API, DB and orderlyweb
docker-compose pull
docker-compose --project-name montagu up -d
docker exec montagu_api_1 mkdir -p /etc/montagu/api/
docker exec montagu_api_1 touch /etc/montagu/api/go_signal

# This chunk should be refactored to be shared with the db repo
# -------------------------------------------------------------
docker exec montagu_db_1 montagu-wait.sh
docker exec montagu_db_annex_1 montagu-wait.sh

docker pull $migrate_image
docker run --rm --network=montagu_default $migrate_image
docker run --rm --network=montagu_default $migrate_image -configFile=conf/flyway-annex.conf migrate

docker exec montagu_db_1 psql -U vimc -d montagu -c \
       "CREATE USER MAPPING FOR vimc SERVER montagu_db_annex OPTIONS (user 'vimc', password 'changeme');"
# -------------------------------------------------------------


ORDERLY_IMAGE="vimc/orderly:master"
OW_MIGRATE_IMAGE="vimc/orderlyweb-migrate:master"
OW_CLI_IMAGE="vimc/orderly-web-user-cli:master"

# create orderly db
docker pull $ORDERLY_IMAGE
docker run --rm --entrypoint create_orderly_demo.sh -v "$PWD/src:/orderly" -u $UID -w /orderly $ORDERLY_IMAGE .

# migrate to add orderlyweb tables
docker pull $OW_MIGRATE_IMAGE
docker run --rm -v "$PWD/src/demo:/orderly" $OW_MIGRATE_IMAGE

docker exec montagu_orderly_web_1 mkdir -p /etc/orderly/web
docker exec montagu_orderly_web_1 touch /etc/orderly/web/go_signal

#Add users manage permission to test user for Orderly Web
docker run -v $PWD/src/demo:/orderly $OW_CLI_IMAGE add-users user@test.com
docker run -v $PWD/src/demo:/orderly $OW_CLI_IMAGE grant user@test.com */users.manage

# Build an image that can run blackbox tests
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



