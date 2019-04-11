#!/usr/bin/env bash
set -ex

here=$(dirname $0)

export REGISTRY=docker.montagu.dide.ic.ac.uk:5000

function cleanup() {
    docker-compose -f $here/docker-compose.yml --project-name montagu down || true
}

trap cleanup ERR

docker volume rm montagu_orderly_volume -f
docker-compose -f $here/docker-compose.yml pull
docker-compose -f $here/docker-compose.yml --project-name montagu up -d

# Start the APIs
docker exec montagu_api_1 mkdir -p /etc/montagu/api/
docker exec montagu_api_1 touch /etc/montagu/api/go_signal

# Wait for the database
docker exec montagu_db_1 montagu-wait.sh

# Migrate the database
migrate_image=$REGISTRY/montagu-migrate:master
docker pull $migrate_image
docker run --network=montagu_proxy $migrate_image

# Add test user
export NETWORK=montagu_proxy

$here/../scripts/cli.sh add "Test User" test.user \
    test.user@example.com password \
    --if-not-exists

$here/../scripts/cli.sh addRole test.user user
$here/../scripts/cli.sh addRole test.user admin
