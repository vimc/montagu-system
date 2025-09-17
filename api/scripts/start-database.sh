#!/usr/bin/env bash
set -ex
HERE=$(dirname $0)
. $HERE/common

# If the database is already running, stop it
if docker top db &>/dev/null; then
    echo "Stopping database"
    $HERE/../../db/scripts/stop-db.sh
    sleep 1s
fi

echo "Starting database"
DB_VERSION=$(<../src/config/db_version)
DB_IMAGE=$ORG/montagu-db:$DB_VERSION
MIGRATE_IMAGE=$ORG/montagu-migrate:$DB_VERSION
$HERE/../../db/scripts/start-db $DB_IMAGE $MIGRATE_IMAGE $NETWORK

echo "-------------------------------------------------------------------------"
echo "Database is now running"