#!/usr/bin/env bash
set -ex

here=$(dirname $0)
export MONTAGU_API_VERSION=$(<$here/../../config/api_version)
export MONTAGU_DB_VERSION=$(<$here/../../config/db_version)
export ROOT=$(realpath $here/../..)

ORDERLY_IMAGE="vimc/orderly:master"
OW_MIGRATE_IMAGE="vimc/orderlyweb-migrate:master"
OW_CLI_IMAGE="vimc/orderly-web-user-cli:master"
MONTAGU_MIGRATE_IMAGE="vimc/montagu-migrate:$MONTAGU_DB_VERSION"

if [[ -d demo ]]
then
  echo "Orderly demo folder already exists, not re-creating it."
else
  docker pull $ORDERLY_IMAGE
  docker run --rm --entrypoint create_orderly_demo.sh -v "$ROOT:/orderly" -u $UID -w /orderly -e HOME=/tmp $ORDERLY_IMAGE .
fi

# migrate to add orderlyweb tables
docker pull $OW_MIGRATE_IMAGE
docker run --rm -v "$ROOT/demo:/orderly" $OW_MIGRATE_IMAGE

# add users manage permission to test user for Orderly Web
docker run -v $ROOT/demo:/orderly $OW_CLI_IMAGE add-users test.user@example.com
docker run -v $ROOT/demo:/orderly $OW_CLI_IMAGE grant test.user@example.com */users.manage

# Run the APIs and database
docker-compose pull
docker-compose --project-name montagu up -d

# Start the APIs
docker exec montagu_api_1 mkdir -p /etc/montagu/api/
docker exec montagu_api_1 touch /etc/montagu/api/go_signal
# Wait for the database
docker exec montagu_db_1 montagu-wait.sh

# Migrate the database
docker pull $MONTAGU_MIGRATE_IMAGE
docker run --network=montagu_default $MONTAGU_MIGRATE_IMAGE

#start orderly web
docker exec montagu_orderly_web_1 mkdir -p /etc/orderly/web
docker exec montagu_orderly_web_1 touch /etc/orderly/web/go_signal
