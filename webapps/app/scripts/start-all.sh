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
