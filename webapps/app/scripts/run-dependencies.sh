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
