#!/usr/bin/env bash
set -ex

export MONTAGU_API_VERSION=$(<config/api_version)
export MONTAGU_DB_VERSION=$(<config/db_version)
export TOKEN_KEY_PATH=$PWD/token_key
cert_tool_version=master
registry=docker.montagu.dide.ic.ac.uk:5000

# Generate a keypair
docker run --rm \
    -v $TOKEN_KEY_PATH:/workspace \
    $registry/montagu-cert-tool:$cert_tool_version \
    gen-keypair /workspace

# prepare to create orderly db
rm $PWD/demo -rf
rm $PWD/git -rf
mkdir $PWD/demo
ORDERLY_IMAGE="vimc/orderly:master"
OW_MIGRATE_IMAGE="vimc/orderlyweb-migrate:master"
OW_CLI_IMAGE="vimc/orderly-web-user-cli:master"

#create orderly db
docker pull $ORDERLY_IMAGE
docker run --rm --entrypoint create_orderly_demo.sh -v "$PWD:/orderly" -u $UID -w /orderly $ORDERLY_IMAGE .

# migrate to add orderlyweb tables
docker pull $OW_MIGRATE_IMAGE
docker run --rm -v "$PWD/demo:/orderly" $OW_MIGRATE_IMAGE

# Run the APIs and database
docker-compose pull
docker-compose --project-name montagu up -d

# Start the APIs
docker exec montagu_api_1 mkdir -p /etc/montagu/api/
docker exec montagu_api_1 touch /etc/montagu/api/go_signal
# Wait for the database
docker exec montagu_db_1 montagu-wait.sh

# Migrate the database
migrate_image=$registry/montagu-migrate:$MONTAGU_DB_VERSION
docker pull $migrate_image
docker run --network=montagu_default $migrate_image

#Add users manage permission to test uesr for Orderly Web
docker run -v $PWD/demo:/orderly $OW_CLI_IMAGE add-users test.user@example.com
docker run -v $PWD/demo:/orderly $OW_CLI_IMAGE grant test.user@example.com */users.manage

#start orderly web
docker exec montagu_orderly_web_1 mkdir -p /etc/orderly/web
docker exec montagu_orderly_web_1 touch /etc/orderly/web/go_signal
