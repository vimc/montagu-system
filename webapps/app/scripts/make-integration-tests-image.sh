#!/usr/bin/env bash
set -ex

git_id=$(git rev-parse --short=7 HEAD)
git_branch=$(git symbolic-ref --short HEAD)
registry=docker.montagu.dide.ic.ac.uk:5000
name=$registry/montagu-portal-integration-tests

docker build -f ./docker/integration-tests.dockerfile -t $name:$git_id .
docker tag $name:$git_id $name:$git_branch
docker push $name:$git_id
docker push $name:$git_branch
