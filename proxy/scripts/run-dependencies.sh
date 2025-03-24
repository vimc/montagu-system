#!/usr/bin/env bash
set -ex

here=$(dirname $0)

export ORG=vimc
export TOKEN_KEY_PATH=$PWD/token_key

function cleanup() {
    docker compose logs
    #docker compose down || true
}

trap cleanup ERR

# Run up all the APIs and Portals which are to be proxied
#docker volume rm montagu_orderly_volume -f
docker compose pull
docker compose up -d

#docker exec montagu-packit-db-1 wait-for-db

# Start the API
#docker compose exec api mkdir -p /etc/montagu/api/
#docker compose exec api touch /etc/montagu/api/go_signal

# TODO: need this on CI?
#sleep 30

# Wait for the database
#docker compose exec db montagu-wait.sh 120

# Migrate the database
#migrate_image=$ORG/montagu-migrate:master
#docker pull $migrate_image
#docker run --rm --network=montagu_proxy $migrate_image

# Generate test data if 'data' present as first param
#if [ "$1" = "data" ]; then
#  test_data_image=$ORG/montagu-generate-test-data:master
#  docker pull $test_data_image
#  docker run --rm --network=montagu_proxy $test_data_image
#fi

# Add test user
#export NETWORK=montagu_proxy

#$here/cli.sh add "Test User" test.user \
#    test.user@example.com password \
#    --if-not-exists

#$here/cli.sh addRole test.user user
#$here/cli.sh addRole test.user admin

#$here/cli.sh add "Password Reset Test User" passwordtest.user \
#    passwordtest.user@example.com password \
#    --if-not-exists

#$here/cli.sh addRole passwordtest.user user

# TODO
# start packit api and front end

# Add user to packit
#$here/packit-create-test-user.sh
