#!/usr/bin/env bash
set -ex

export here=$(dirname $0)
source $here/run-apis.sh

# Add test accounts
$here/add-test-accounts-for-integration-tests.sh

# Tell the tests where to find the database
export PGHOST=localhost

$here/run-integration-tests.sh "$@"
result=$?

$here/stop-apis.sh
exit $result