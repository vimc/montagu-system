#!/usr/bin/env bash
set -ex

org=vimc
name=montagu-reverse-proxy

commit_tag=$org/$name:$MONTAGU_GIT_ID
branch_tag=$org/$name:$MONTAGU_GIT_BRANCH

docker build -t $commit_tag -t $branch_tag .
docker push $commit_tag
docker push $branch_tag
