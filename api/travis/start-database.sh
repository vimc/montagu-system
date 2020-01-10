#!/usr/bin/env bash
## Starts db containers for testing on Travis.
## Unlike the gradle startDatabase task which uses the configured db version to run an image from the local registry
## this file always runs master, using the image from the public docker hub. This is ok because the Travis build is
# primarily for creating code coverage reports. The TeamCity build uses the gradle task to run all tests against the
# configured db version.

set -ex
DB_VERSION=master
PORT_MAPPING="-p 5432:5432"
ANNEX_PORT_MAPPING="-p 5433:5432"
PG_CONFIG=/etc/montagu/postgresql.test.conf
REGISTRY=vimc
DB_IMAGE=$REGISTRY/montagu-db:$DB_VERSION
MIGRATE_IMAGE=$REGISTRY/montagu-migrate:$DB_VERSION

DB_CONTAINER=db
DB_ANNEX_CONTAINER=db_annex
NETWORK=db_nw

docker network create $NETWORK

# First the core database:
docker run --rm --network=$NETWORK -d \
    --name $DB_CONTAINER $PORT_MAPPING $DB_IMAGE $PG_CONFIG
docker run --rm --network=$NETWORK -d \
    --name $DB_ANNEX_CONTAINER $ANNEX_PORT_MAPPING $DB_IMAGE $PG_CONFIG

# Wait for things to become responsive
docker exec $DB_CONTAINER montagu-wait.sh
docker exec $DB_ANNEX_CONTAINER montagu-wait.sh

# Do the migrations
docker run --rm --network=$NETWORK $MIGRATE_IMAGE -configFile=conf/flyway-annex.conf migrate
docker run --rm --network=$NETWORK $MIGRATE_IMAGE

docker exec $DB_CONTAINER psql -U vimc -d montagu -c \
       "CREATE USER MAPPING FOR vimc SERVER montagu_db_annex OPTIONS (user 'vimc', password 'changeme');"

trap - EXIT
