#!/usr/bin/env bash
set -ex

here=$(dirname $0)
$here/clear-docker.sh

export MONTAGU_API_VERSION=master
export MONTAGU_REPORTING_API_VERSION=master
export MONTAGU_DB_VERSION=master
export TOKEN_KEY_PATH=$pwd/token_key
registry=docker.montagu.dide.ic.ac.uk:5000

# Generate a keypair
docker run --rm \
    -v $TOKEN_KEY_PATH:/workspace \
    docker.montagu.dide.ic.ac.uk:5000/montagu-cert-tool:master \
    gen-keypair /workspace

# Run the APIs and database
docker-compose pull
docker-compose --project-name montagu up -d

# From now on, if the user presses Ctrl+C we should teardown gracefully
trap ctrl_c INT
function ctrl_c() {
    docker-compose --project-name montagu down
    docker-compose --project-name montagu rm
}

# Start the APIs
docker exec montagu_api_1 mkdir -p /etc/montagu/api/
docker exec montagu_api_1 touch /etc/montagu/api/go_signal
docker exec montagu_reporting_api_1 mkdir -p /etc/montagu/reports_api
docker exec montagu_reporting_api_1 touch /etc/montagu/reports_api/go_signal

# Generate test data
docker run --rm --network=montagu_default \
    $registry/montagu-generate-test-data:i608

# Add test user account that is not in the generated test data

$here/cli.sh add "Report reviewer" report.reviewer report.reviewer@example.com password
$here/cli.sh addRole report.reviewer user
$here/cli.sh addRole report.reviewer reports-reviewer

# Wait for Ctrl+C
echo "Ready to use. Press Ctrl+C to teardown."
sleep infinity
