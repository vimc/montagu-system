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
docker pull $registry/orderly:$orderly_version
docker run --rm \
    --entrypoint create_orderly_demo.sh \
    -v montagu_orderly_volume:/orderly \
    $registry/orderly:$orderly_version \
    /orderly

# Generate test data
image=$registry/montagu-generate-test-data:$MONTAGU_API_VERSION
docker pull $image
docker run --rm --network=montagu_default $image

# Wait for Ctrl+C
echo "Ready to use. Press Ctrl+C to teardown."
sleep infinity
