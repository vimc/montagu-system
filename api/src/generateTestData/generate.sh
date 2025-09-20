#!/usr/bin/env bash
set -ex

./generateTestData/build/install/generateTestData/bin/generateTestData $1
./userCLI/build/install/userCLI/bin/userCLI addUserToGroup test.user IC-Garske