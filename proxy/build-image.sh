#!/usr/bin/env bash
set -ex

registry=docker.montagu.dide.ic.ac.uk:5000
name=montagu-reverse-proxy

commit_tag=$registry/$name:$MONTAGU_GIT_ID
branch_tag=$registry/$name:$MONTAGU_GIT_BRANCH

docker build -t $commit_tag -t $branch_tag .
docker push $commit_tag
docker push $branch_tag
