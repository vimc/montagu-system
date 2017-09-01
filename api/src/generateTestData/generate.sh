#!/usr/bin/env bash

# This is what ends up getting run inside the Docker container made by 
# ../../scripts/generate-test-data.sh

set -ex

./generateTestData/build/install/generateTestData/bin/generateTestData $1
./user.sh add "Test User" test.user test.user@imperial.ac.uk password
./user.sh addRole test.user user
./user.sh addUserToGroup test.user IC-Garske