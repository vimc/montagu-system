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

if [[ -d $ROOT/demo ]]
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
docker compose pull
docker compose --project-name montagu up -d

# Start the APIs
docker exec montagu-api-1 mkdir -p /etc/montagu/api/
docker container cp $here/montagu-api.config.properties montagu-api-1:/etc/montagu/api/config.properties
docker exec montagu-api-1 touch /etc/montagu/api/go_signal

# Wait for the database - this can take a while on buildkite
docker exec montagu-db-1 montagu-wait.sh 300

# Migrate the database
docker pull $MONTAGU_MIGRATE_IMAGE
docker run --network=montagu_default $MONTAGU_MIGRATE_IMAGE

#start orderly web
docker exec montagu-orderly_web-1 mkdir -p /etc/orderly/web
docker exec montagu-orderly_web-1 touch /etc/orderly/web/go_signal
