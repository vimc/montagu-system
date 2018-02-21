#!/usr/bin/env bash
set -ex

export MONTAGU_API_VERSION=$(<config/api_version)
export MONTAGU_REPORTING_API_VERSION=$(<config/reporting_api_version)
export MONTAGU_DB_VERSION=$(<config/db_version)
export ORDERLY_VERSION=$(<config/orderly_version)
export TOKEN_KEY_PATH=$PWD/token_key
cert_tool_version=master
registry=docker.montagu.dide.ic.ac.uk:5000

# Generate a keypair
docker run --rm \
    -v $TOKEN_KEY_PATH:/workspace \
    $registry/montagu-cert-tool:$cert_tool_version \
    gen-keypair /workspace

docker volume rm montagu_orderly_volume -f

# Run the APIs and database
docker-compose pull
docker-compose --project-name montagu up -d

# Generate report test data
docker pull $registry/orderly:$ORDERLY_VERSION
docker run --rm \
    --entrypoint create_orderly_demo.sh \
    -v montagu_orderly_volume:/orderly \
    $registry/orderly:$ORDERLY_VERSION \
    /orderly

docker exec montagu_reporting_api_1 sh -c 'cp /orderly/demo/. /orderly/ -r'

# Start the APIs
docker exec montagu_api_1 mkdir -p /etc/montagu/api/
docker exec montagu_api_1 touch /etc/montagu/api/go_signal
docker exec montagu_reporting_api_1 mkdir -p /etc/montagu/reports_api
docker exec montagu_reporting_api_1 touch /etc/montagu/reports_api/go_signal

# Migrate the database
migrate_image=$registry/montagu-migrate:$MONTAGU_DB_VERSION
docker pull $migrate_image
docker run --network=montagu_default $migrate_image
