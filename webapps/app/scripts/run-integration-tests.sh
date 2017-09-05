#!/usr/bin/env bash
set -ex

here=$(dirname $0)

# Run the APIs
source $here/run-apis.sh

# Add just the roles and permissons we need to run,
# plus a test user account
docker pull $registry/montagu-generate-test-data:$MONTAGU_API_VERSION
docker run --rm --network=montagu_default \
    $registry/montagu-generate-test-data:$MONTAGU_API_VERSION justRoles

# Add some extra roles needed for testing
$here/cli.sh addRole test.user user-manager

# Set database variables (the names here are used by the Node pg library,
# and shouldn't be changed)
export PGUSER=vimc
export PGHOST=localhost
export PGPASSWORD=changeme
export PGDATABASE=montagu
export PGTEMPLATE=montagu_template
export PGPORT=5432

# Setup template database
docker exec montagu_db_1 psql -U vimc -d postgres -c \
    "ALTER DATABASE $PGDATABASE RENAME TO $PGTEMPLATE"

# Run the tests
set +e
mocha-webpack --webpack-config webpack-test.config.js "src/integrationTests/**/*"
result=$?

# Teardown
docker logs montagu_api_1 > api.log 2> api.log
docker logs montagu_reporting_api_1 > reporting_api.log 2> reporting_api.log
$here/stop-apis.sh
exit $result