#!/usr/bin/env bash
## Starts db containers for testing on Travis.
set -ex
HERE=$(dirname $0)
export DB_VERSION=$(<src/config/db_version)
export DB_PORT=5432
$HERE/../scripts/start-database.sh
