#!/usr/bin/env bash
set -ex
HERE=$(dirname $0)
. $HERE/common

# In case we switch agents between steps
[ ! -z $(docker images -q $BUILD_ENV_TAG) ] || docker pull $BUILD_ENV_TAG
