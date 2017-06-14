#!/usr/bin/env bash
set -e

git_branch=$1
git_id=$2
registry=montagu.dide.ic.ac.uk:5000
contrib_name=montagu-contrib-portal
admin_name=montagu-admin-portal

echo "Beginning webapp build with:"
echo "Branch: $git_branch"
echo "Commit hash: $git_id"

webpack
npm run test

echo "Building contribution portal image"
docker build -f docker/run.dockerfile \
    -t $registry/$contrib_name:$git_id \
    -t $registry/$contrib_name:$git_branch \
    --build-arg APP_NAME=contrib \
    .

echo "Building admin portal image"
docker build -f docker/run.dockerfile \
    -t $registry/$admin_name:$git_id \
    -t $registry/$admin_name:$git_branch \
    --build-arg APP_NAME=admin \
    .

id=$registry/$contrib_name:$git_id
echo "Pushing $id"
docker push $id

id=$registry/$admin_name:$git_id
echo "Pushing $id"
docker push $id