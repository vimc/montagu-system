#!/usr/bin/env bash
## Starts db containers for testing on Travis.
set -ex
HERE=$(dirname $0)
export DB_VERSION=$(<src/config/db_version)
$HERE/../scripts/start-database.sh
