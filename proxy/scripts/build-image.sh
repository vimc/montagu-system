#!/usr/bin/env bash
set -ex

registry=docker.montagu.dide.ic.ac.uk:5000
name=montagu-reverse-proxy

commit_tag=$registry/$name:$MONTAGU_GIT_ID
branch_tag=$registry/$name:$MONTAGU_GIT_BRANCH

# Deal with dependabot tags which look like
#
#   dependabot/npm_and_yarn/app/lodash-4.17.19
#
# But docker does not like
branch_tag=$(echo $branch_tag | sed 's;/;-;g')

docker build -t $commit_tag -t $branch_tag .
docker push $commit_tag
docker push $branch_tag
