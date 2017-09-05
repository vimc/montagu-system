#!/usr/bin/env bash
set -e

git_branch=$1
git_id=$2
registry=docker.montagu.dide.ic.ac.uk:5000
contrib_name=montagu-contrib-portal
admin_name=montagu-admin-portal
report_name=montagu-report-portal

echo "Beginning webapp build with:"
echo "Branch: $git_branch"
echo "Commit hash: $git_id"

export MONTAGU_PORTAL_PROFILE=teamcity
npm run test
npm run integration_tests

export MONTAGU_PORTAL_PROFILE=docker
webpack

function build {
    image_name=$1
    app_name=$2
    echo "Building $app_name portal image"
    docker build -f docker/run.dockerfile \
        -t $registry/$image_name:$git_id \
        -t $registry/$image_name:$git_branch \
        --build-arg APP_NAME=$app_name \
        .
}

build $contrib_name contrib
build $admin_name admin
build $report_name report

function push {
	id=$1
	echo "Pushing $id"
	docker push $id
}

push $registry/$contrib_name:$git_id
push $registry/$contrib_name:$git_branch
push $registry/$admin_name:$git_id
push $registry/$admin_name:$git_branch
push $registry/$report_name:$git_id
push $registry/$report_name:$git_branch
