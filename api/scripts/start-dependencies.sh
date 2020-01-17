#!/usr/bin/env bash
set -ex

echo "Running in $(pwd)"

#start database
here=$(dirname $0)

# If the database is already running, stop it
if docker top db &>/dev/null; then
    echo "Stopping database"
    $here/../db/scripts/stop.sh
    sleep 1s
fi

echo "Starting database"
$here/../db/scripts/start.sh $DB_VERSION $DB_PORT $ANNEX_PORT

echo "-------------------------------------------------------------------------"
echo "Databases are now running:"
echo "Main database is accessible at port $DB_PORT"
echo "Annex database is accessible at port $ANNEX_PORT"

#start orderly-web
ORDERLY_IMAGE="vimc/orderly:master"
OW_MIGRATE_IMAGE="vimc/orderlyweb-migrate:master"
ORDERLY_WEB_IMAGE="vimc/orderly-web:master"

# create orderly db
rm $PWD/demo -rf
rm $PWD/git -rf

#extra logging for teamcity
ls $PWD

SRC=$(realpath $here/../src)
echo "SRC: $SRC"
ls $SRC

docker pull $ORDERLY_IMAGE
docker run --rm --entrypoint create_orderly_demo.sh -v "$PWD:/orderly" -u $UID -w /orderly $ORDERLY_IMAGE .

# migrate to add orderlyweb tables
docker pull $OW_MIGRATE_IMAGE
docker run --rm -v "$PWD/demo:/orderly" $OW_MIGRATE_IMAGE

# start orderlyweb
docker pull $ORDERLY_WEB_IMAGE
docker run -d -v "$PWD/demo:/orderly" -p 8888:8888 --net=host --name orderly-web $ORDERLY_WEB_IMAGE

docker exec orderly-web mkdir -p /etc/orderly/web
docker exec orderly-web touch /etc/orderly/web/go_signal

