#!/usr/bin/env bash
set -ex

here=$(dirname $0)
$here/clear-docker.sh
source $here/run-dependencies.sh

# From now on, if the user presses Ctrl+C we should teardown gracefully
trap on_interrupt INT
function on_interrupt() {
    $here/clear-docker.sh
}

# TODO: Might want to restore this so that webapps are manually testable - does this image stil exist?
# Generate test data
#image=vimc/montagu-generate-test-data:$MONTAGU_API_VERSION
#docker pull $image
#docker run --rm --network=montagu_default $image

# Add test accounts
$here/add-test-accounts-for-integration-tests.sh


# Wait for Ctrl+C
echo "Ready to use. Press Ctrl+C to teardown."
sleep infinity
