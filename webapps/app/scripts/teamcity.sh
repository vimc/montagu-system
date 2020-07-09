#!/usr/bin/env bash

set -x
./scripts/clear-docker.sh
set -e
./scripts/make-build-env.sh
./scripts/run-dependencies.sh
./scripts/add-test-accounts-for-integration-tests.sh
./scripts/run-build.sh
./scripts/make-integration-tests-image.sh
