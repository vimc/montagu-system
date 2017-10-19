#!/usr/bin/env bash
set -ex

export here=$(dirname $0)
source $here/run-apis.sh
$here/run-integration-tests.sh "$@"
result=$?

$here/stop-apis.sh
exit $result
