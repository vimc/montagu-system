#!/usr/bin/env bash
set -ex

#Run tests in a node container. This will also output node_modules as a volume which the proxy image requires
./ci_tests.sh

git_id=$(git rev-parse --short=7 HEAD)
git_branch=$(git symbolic-ref --short HEAD)

registry=docker.montagu.dide.ic.ac.uk:5000
name=montagu-reverse-proxy

commit_tag=$registry/$name:$git_id
branch_tag=$registry/$name:$git_branch

docker build -t $commit_tag -t $branch_tag .
docker push $commit_tag
docker push $branch_tag
