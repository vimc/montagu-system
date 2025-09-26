#!/usr/bin/env bash
set -x
docker ps -aq | xargs -r docker stop
docker container prune --force
docker volume rm montagu_packit_db
docker volume prune --force
docker network prune --force