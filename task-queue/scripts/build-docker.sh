#!/usr/bin/env bash
set -ex

HERE=$(readlink -f "$(dirname $0)")
. $HERE/common.sh

docker build . -t $LOCAL_TQ_IMAGE