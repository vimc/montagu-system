#!/usr/bin/env bash
set -ex

here=$(dirname $0)

$here/make-build-env.sh
$here/run-build.sh
$here/run-integration-tests.sh
