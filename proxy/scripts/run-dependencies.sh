#!/usr/bin/env bash
set -ex

here=$(dirname $0)

export ORG=ghcr.io/vimc
export TOKEN_KEY_PATH=$PWD/token_key

function cleanup() {
    docker compose logs
    docker compose down || true
}

trap cleanup ERR

# Run up all the APIs and Portals which are to be proxied
docker volume rm montagu_orderly_volume -f
docker compose pull
docker compose up -d

# Start the APIs
docker compose exec api mkdir -p /etc/montagu/api/
docker compose exec api touch /etc/montagu/api/go_signal

# Wait for the database
docker compose exec db montagu-wait.sh 120

# Migrate the database
migrate_image=$ORG/montagu-migrate:main
docker pull $migrate_image
docker run --rm --network=montagu_proxy $migrate_image

# Generate test data if 'data' present as first param
if [ "$1" = "data" ]; then
  test_data_image=$ORG/montagu-generate-test-data:main
  docker pull $test_data_image
  docker run --rm --network=montagu_proxy $test_data_image
fi

export NETWORK=montagu_proxy

# Add test user to packit and montagu
# give packit db some time to start
if [ "$BUILDKITE" = "true" ]; then
    sleep 60
else
    sleep 5
fi
$here/packit-create-test-user.sh

$here/cli.sh add "Test User" test.user \
    test.user@example.com password \
    --if-not-exists

$here/cli.sh addRole test.user user
$here/cli.sh addRole test.user admin

$here/cli.sh add "Password Reset Test User" passwordtest.user \
    passwordtest.user@example.com password \
    --if-not-exists

$here/cli.sh addRole passwordtest.user user
