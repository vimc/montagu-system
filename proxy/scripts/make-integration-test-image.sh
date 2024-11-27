 #!/usr/bin/env bash
set -e
HERE=$(dirname $0)
. $HERE/common

docker build -f integration-tests.dockerfile \
    -t $INTEGRATION_TESTS_TAG \
    .

docker push $INTEGRATION_TESTS_TAG
