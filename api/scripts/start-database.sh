#!/usr/bin/env bash
set -ex
HERE=$(dirname $0)

# If the database is already running, stop it
if docker top db &>/dev/null; then
    echo "Stopping database"
    $HERE/../db/scripts/stop.sh
    sleep 1s
fi

echo "Starting database"
$HERE/../db/scripts/start.sh $DB_VERSION $DB_PORT $NETWORK

echo "-------------------------------------------------------------------------"
echo "Databases are now running:"
echo "Main database is accessible at port $DB_PORT"
