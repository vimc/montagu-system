#!/usr/bin/env bash
set -e
HERE=$(dirname $0)

$HERE/clear-docker.sh

ADMIN_IMAGE=montagu-admin-portal-local-dev
CONTRIB_IMAGE=montagu-contrib-portal-local-dev

export MONTAGU_PORTAL_PROFILE=docker
(cd $HERE/.. && webpack)

docker build --tag $ADMIN_IMAGE -f $HERE/../Dockerfile --build-arg APP_NAME=admin $HERE/..
docker build --tag $CONTRIB_IMAGE -f $HERE/../Dockerfile --build-arg APP_NAME=contrib $HERE/..

. $HERE/start-all.sh $ADMIN_IMAGE $CONTRIB_IMAGE

# Add test accounts
. $HERE/add-test-accounts-for-integration-tests.sh

# From now on, if the user presses Ctrl+C we should teardown gracefully
trap on_interrupt INT
function on_interrupt() {
    $here/clear-docker.sh
}

# Wait for Ctrl+C
echo "Ready to use. Press Ctrl+C to teardown."
sleep infinity