#!/usr/bin/env bash
set -ex

export PGHOST=db
export MONTAGU_PORTAL_PROFILE=packaged_integration_tests
./scripts/add-test-accounts-for-integration-tests.sh
./scripts/run-integration-tests.sh "$@"
