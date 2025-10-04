#!/usr/bin/env bash
set -ex

HERE=$(readlink -f "$(dirname $0)")
. $HERE/common.sh

TQ_IMAGE=$1
if [[ -z $1 ]]; then
  TQ_IMAGE=$LOCAL_TQ_IMAGE
fi

ARCHIVE_DIR=test_archive_files
LOCAL_ARCHIVE_DIR=$HERE/../$ARCHIVE_DIR

rm $LOCAL_ARCHIVE_DIR -rf
mkdir -m a+rw $LOCAL_ARCHIVE_DIR

docker run --env YOUTRACK_TOKEN=$YOUTRACK_TOKEN \
    --name $NAME \
    --network=montagu_default \
    -v $LOCAL_ARCHIVE_DIR:/$ARCHIVE_DIR \
    -d $TQ_IMAGE

