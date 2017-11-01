#!/usr/bin/env bash
set -ex
here=$(dirname $0)

$here/cli.sh add "Test User" test.user \
    test@example.com password \
    --if-not-exists
$here/cli.sh addRole test.user user
$here/cli.sh addRole test.user user-manager
$here/cli.sh addRole test.user reports-reader
$here/cli.sh addRole test.user uploader modelling-group:IC-Garske
$here/cli.sh addRole test.user user-manager modelling-group:IC-Garske
$here/cli.sh addUserToGroup test.user test-group

$here/cli.sh add "Report reviewer" report.reviewer \
    report.reviewer@example.com password \
    --if-not-exists
$here/cli.sh addRole report.reviewer user
$here/cli.sh addRole report.reviewer reports-reviewer
