 #!/usr/bin/env bash
set -e
HERE=$(dirname $0)
. $HERE/common

docker build -f integration-tests.dockerfile \
    -t $INTEGRATION_TESTS_TAG \
    --build-arg MONTAGU_GIT_ID=$GIT_SHA \
    .

docker push $INTEGRATION_TESTS_TAG
