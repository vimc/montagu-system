#!/usr/bin/env bash
set -ex
HERE=$(dirname $0)

source .venv/bin/activate
packit stop --kill
# remove volumes manually rather than --volumes flag to packit, to avoid requiring user confirmation
docker volume rm montagu_packit_db montagu_outpack_volume
