 #!/usr/bin/env bash
set -e
HERE=$(dirname $0)
. $HERE/common

# Shared build env between the main build and the integration tests
docker build -f shared-build-env.dockerfile \
    -t $SHARED_BUILD_ENV_TAG \
    --build-arg MONTAGU_GIT_ID=$GIT_SHA \
    --build-arg MONTAGU_GIT_BRANCH=$GIT_BRANCH \
    .

# We have to push this so it's available to other build steps
docker push $SHARED_BUILD_ENV_TAG
