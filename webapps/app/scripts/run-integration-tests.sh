#!/usr/bin/env bash
set -ex
# Note: PGHOST environment variable must be set; see below

# Either specify a portal with "Admin" or "Contrib", or fall back to *, which 
# will run all tests
export portal=${1:-*}

# Set database variables (the names here are used by the Node pg library,
# and shouldn't be changed)
export PGUSER=vimc
export PGPASSWORD=changeme
export PGDATABASE=montagu
export PGTEMPLATE=montagu_template
export PGPORT=5432
# We also need PGHOST to be set, but this varies based on whether the tests are
# being run in a container or not, so we require that to be set by the calling
# script

# Setup template database
docker exec montagu_db_1 psql -U vimc -d postgres -c \
    "ALTER DATABASE $PGDATABASE RENAME TO $PGTEMPLATE"

# Run the tests
set +e
./node_modules/mocha-webpack/bin/mocha-webpack \
    # --watch \
    --webpack-config webpack-test.config.js \
    --timeout 5000 \
    "src/integrationTests/{helper,${portal}IntegrationTests}.tsx"
result=$?

# ------- Teardown -----------
# Restore the database
docker exec montagu_db_1 psql -U vimc -d postgres -c \
    "ALTER DATABASE $PGTEMPLATE RENAME TO $PGDATABASE"

docker logs montagu_api_1 > api.log 2> api.log
docker logs montagu_reporting_api_1 > reporting_api.log 2> reporting_api.log
exit $result
