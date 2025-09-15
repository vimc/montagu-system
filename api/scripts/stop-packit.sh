#!/usr/bin/env bash
set -ex
HERE=$(dirname $0)

if [ "$BUILDKITE" != "true" ]; then
  source .venv/bin/activate
fi
packit stop --kill
# remove volumes manually rather than --volumes flag to packit, to avoid requiring user confirmation
docker volume rm montagu_packit_db montagu_outpack_volume
