#!/usr/bin/env bash
set -ex

./gradlew :stopDatabase

./gradlew :startDatabase :generateTestData

./user.sh add "Test User" test.user test@example.com password
./user.sh addRole test.user user
./user.sh addUserToGroup test.user ALL

./user.sh add "Report reviewer" report.reviewer report.reviewer@example.com password
./user.sh addRole report.reviewer reports-reviewer

./gradlew :run