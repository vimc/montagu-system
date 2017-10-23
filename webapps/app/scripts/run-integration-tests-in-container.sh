#!/usr/bin/env bash
set -ex
./scripts/add-test-accounts-for-integration-tests.sh
./scripts/run-integration-tests.sh "$@"
