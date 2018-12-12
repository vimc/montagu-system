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
$here/cli.sh addRole test.user reports-reader
$here/cli.sh addRole test.user member modelling-group:IC-Garske
$here/cli.sh addRole test.user uploader modelling-group:IC-Garske
$here/cli.sh addRole test.user uploader modelling-group:test-group

$here/cli.sh add "Report reviewer" report.reviewer \
    report.reviewer@example.com password \
    --if-not-exists

$here/cli.sh addRole report.reviewer user
$here/cli.sh addRole report.reviewer reports-reviewer
$here/cli.sh addRole report.reviewer user-manager
$here/cli.sh addRole report.reviewer admin
$here/cli.sh addRole report.reviewer reports-reader report:html
$here/cli.sh addRole report.reviewer member modelling-group:IC-Garske

