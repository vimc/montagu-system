#!/usr/bin/env bash
set -ex

ORDERLY_IMAGE="vimc/orderly:master"
OW_MIGRATE_IMAGE="vimc/orderlyweb-migrate:master"

here=$(dirname $0)
root=$(realpath $here/..)

# create orderly db
if [[ -d $root/demo ]]
then
  echo "Orderly demo folder already exists, not re-creating it."
else
  docker pull $ORDERLY_IMAGE
  docker run --rm --entrypoint create_orderly_demo.sh -v "$root:/orderly" -u $UID -w /orderly $ORDERLY_IMAGE .
fi

# migrate to add orderlyweb tables
docker pull $OW_MIGRATE_IMAGE
docker run --rm -v "$root/demo:/orderly" $OW_MIGRATE_IMAGE
