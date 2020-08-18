 #!/usr/bin/env bash
set -e
HERE=$(dirname $0)
. $HERE/common

# The main build env which tests and builds in the next step
docker build -f build.dockerfile \
    -t $BUILD_ENV_TAG \
    --build-arg MONTAGU_GIT_ID=$git_id \
    --build-arg MONTAGU_GIT_BRANCH=$git_branch \
    .

docker push $BUILD_ENV_TAG
