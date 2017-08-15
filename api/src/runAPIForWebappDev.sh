#!/usr/bin/env bash
set -ex

# delete directory if it already exists
if [ -d "/etc/montagu/api/token_key" ] 
then
   sudo rm /etc/montagu/api/token_key -r
fi

mkdir -p /etc/montagu/api/token_key

docker run --rm \
    -v /etc/montagu/api/token_key:/workspace \
    docker.montagu.dide.ic.ac.uk:5000/montagu-cert-tool:master \
    gen-keypair /workspace

./gradlew :stopDatabase || true

./gradlew :startDatabase :generateTestData

./user.sh add "Test User" test.user test@example.com password
./user.sh addRole test.user user
./user.sh addUserToGroup test.user ALL

./user.sh add "Report reviewer" report.reviewer report.reviewer@example.com password
./user.sh addRole report.reviewer user
./user.sh addRole report.reviewer reports-reviewer

./gradlew :run
