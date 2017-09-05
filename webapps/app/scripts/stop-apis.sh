#!/usr/bin/env bash
set -ex
docker-compose --project-name montagu down --volumes
docker-compose --project-name montagu rm