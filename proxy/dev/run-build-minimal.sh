#!/usr/bin/env bash
set -ex

git_id=$(git rev-parse --short=7 HEAD)
git_branch=$(git symbolic-ref --short HEAD | sed 's;/;-;g')
REGISTRY=docker.montagu.dide.ic.ac.uk:5000

docker build -f dev/buildMinimal.dockerfile \
    -t montagu-reverse-proxy-build-minimal-env \
    --build-arg MONTAGU_GIT_ID=$git_id \
    --build-arg MONTAGU_GIT_BRANCH=$git_branch \
    .

# This is the path for teamcity agents. If running locally, pass in your own docker config location
# i.e. /home/{user}/.docker/config.json
docker_auth_path=${1:-/opt/teamcity-agent/.docker/config.json}

docker run \
    -v $docker_auth_path:/root/.docker/config.json \
    -v /var/run/docker.sock:/var/run/docker.sock \
    --network=host \
    montagu-reverse-proxy-build-minimal-env
