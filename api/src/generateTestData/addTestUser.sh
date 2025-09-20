#!/usr/bin/env bash
set -ex

./userCLI/build/install/userCLI/bin/userCLI add "Test User" test.user test.user@imperial.ac.uk password
./userCLI/build/install/userCLI/bin/userCLI addRole test.user user