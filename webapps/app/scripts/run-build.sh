#!/usr/bin/env bash

# This is the path for teamcity agents. If running locally, pass in your own docker config location
docker_auth_path=${1:-/opt/teamcity-agent/.docker/config.json}

docker run \
    -v $docker_auth_path:/root/.docker/config.json \
    -v /var/run/docker.sock:/var/run/docker.sock \
    --network=host \
    montagu-portal-build-env
