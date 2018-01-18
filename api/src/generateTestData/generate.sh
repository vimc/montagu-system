#!/usr/bin/env bash

# This is what ends up getting run inside the Docker container made by 
# ../../scripts/generate-test-data.sh

set -ex

./generateTestData/build/install/generateTestData/bin/generateTestData $1
./userCLI/build/install/userCLI/bin/userCLI add "Test User" test.user test.user@imperial.ac.uk password
./userCLI/build/install/userCLI/bin/userCLI addRole test.user user
./userCLI/build/install/userCLI/bin/userCLI addUserToGroup test.user IC-Garske