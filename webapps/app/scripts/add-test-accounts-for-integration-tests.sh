#!/usr/bin/env bash
set -ex
here=$(dirname $0)

$here/cli.sh add "Test User" test.user \
    test.user@example.com password \
    --if-not-exists

$here/cli.sh addRole test.user user
$here/cli.sh addRole test.user admin
$here/cli.sh addRole test.user user-manager
$here/cli.sh addRole test.user funder
$here/cli.sh addRole test.user coverage-provider
$here/cli.sh addRole test.user member modelling-group:IC-Garske
$here/cli.sh addRole test.user uploader modelling-group:IC-Garske
$here/cli.sh addRole test.user uploader modelling-group:test-group

