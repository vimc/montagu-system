#!/usr/bin/env bash
set -ex

here=$(dirname $0)
root=$(realpath $here/../../..)
export API_VERSION=$(<$here/../../config/api_version)
export DB_VERSION=$(<$here/../../config/db_version)

. $root/scripts/common.sh

ADMIN_IMAGE=$1
CONTRIB_IMAGE=$2

API_IMAGE=$ORG/montagu-api:$API_VERSION
DB_IMAGE=$ORG/montagu-db:$DB_VERSION
MIGRATE_IMAGE=$ORG/montagu-migrate:$DB_VERSION

$root/scripts/run-all.sh \
--admin-image $ADMIN_IMAGE --contrib-image $CONTRIB_IMAGE \
--api-image $API_IMAGE \
--db-image $DB_IMAGE --migrate-image $MIGRATE_IMAGE \
--api-config-path $here/montagu-api.config.properties \
--packit-config webapps-packit

# pull dependency images - webapp images may be local only so ignore pull failures
#ADMIN_IMAGE=$1 CONTRIB_IMAGE=$2 docker compose pull --ignore-pull-failures

# Run the dependencies and webapps
#ADMIN_IMAGE=$1 CONTRIB_IMAGE=$2 docker compose --project-name montagu up -d

# Start the APIs
#docker exec montagu-api-1 mkdir -p /etc/montagu/api/
#docker container cp $here/montagu-api.config.properties montagu-api-1:/etc/montagu/api/config.properties
#docker exec montagu-api-1 touch /etc/montagu/api/go_signal

# Wait for the database
#docker exec montagu-db-1 montagu-wait.sh 120

# Migrate the database
#docker pull $MONTAGU_MIGRATE_IMAGE
#docker run --network=montagu_default $MONTAGU_MIGRATE_IMAGE

# Run packit
#$here/../../../api/scripts/start-packit.sh webapps-packit
