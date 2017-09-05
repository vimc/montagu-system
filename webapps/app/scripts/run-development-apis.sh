#!/usr/bin/env bash
set -ex

here=$(dirname $0)
$here/clear-docker.sh
source $here/run-apis.sh

# From now on, if the user presses Ctrl+C we should teardown gracefully
trap on_interrupt INT
function on_interrupt() {
    $here/stop-apis.sh
}

# Generate report test data      
docker run --rm \
    --entrypoint create_orderly_demo.sh \
    -v montagu_orderly_volume:/orderly \
    $registry/orderly:$orderly_version \
    /orderly

# Generate test data
docker run --rm --network=montagu_default \
    $registry/montagu-generate-test-data:$MONTAGU_API_VERSION

# Add test user account that is not in the generated test data
$here/cli.sh add "Report reviewer" report.reviewer report.reviewer@example.com password
$here/cli.sh addRole report.reviewer user
$here/cli.sh addRole report.reviewer reports-reviewer

# Wait for Ctrl+C
echo "Ready to use. Press Ctrl+C to teardown."
sleep infinity
