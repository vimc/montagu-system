#!/usr/bin/env bash
set -e

git_branch=$1
git_id=$2
org=vimc
contrib_name=montagu-contrib-portal
admin_name=montagu-admin-portal

echo "Beginning webapp build with:"
echo "Branch: $git_branch"
echo "Commit hash: $git_id"

export MONTAGU_PORTAL_PROFILE=ci
npm run test

# Tell the tests where to find the database
export PGHOST=localhost
./scripts/run-integration-tests.sh

export MONTAGU_PORTAL_PROFILE=docker
webpack

function build {
    image_name=$1
    app_name=$2
    echo "Building $app_name portal image"
    docker build -f docker/run.dockerfile \
        -t $org/$image_name:$git_id \
        -t $org/$image_name:$git_branch \
        --build-arg APP_NAME=$app_name \
        .
}

build $contrib_name contrib
build $admin_name admin

function push {
	id=$1
	echo "Pushing $id"
	docker push $id
}

push $org/$contrib_name:$git_id
push $org/$contrib_name:$git_branch
push $org/$admin_name:$git_id
push $org/$admin_name:$git_branch
