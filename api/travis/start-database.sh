#!/usr/bin/env bash
## Starts a set of containers:
##
##   db - main db
##   db_annex - annex
##
## On the network
##
##   db_nw

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
