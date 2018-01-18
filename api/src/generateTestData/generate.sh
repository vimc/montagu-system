#!/usr/bin/env bash

# This is what ends up getting run inside the Docker container made by 
# ../../scripts/generate-test-data.sh

set -ex

./generateTestData/build/install/generateTestData/bin/generateTestData $1
./userCLI/build/install/userCLI/bin/userCLI add "Test User" test.userInternal test.userInternal@imperial.ac.uk password
./userCLI/build/install/userCLI/bin/userCLI addRole test.userInternal userInternal
./userCLI/build/install/userCLI/bin/userCLI addUserToGroup test.userInternal IC-Garske