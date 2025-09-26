#!/usr/bin/env bash
set -ex
HERE=$(dirname $0)
. $HERE/common

CLI_IMAGE=$1
# Add user through the CLI
docker run --network $NETWORK $CLI_IMAGE add "CLI Test User" "cli.test.user" "cli.test@user.com" "test-password"
