#!/usr/bin/env bash
set -e

echo "Creating database with test data"
./gradlew :startDatabase :blackboxTests:run
./user.sh add "Test User" test.user test.user@imperial.ac.uk password
./user.sh addRole test.user user
./user.sh addRole test.user member modelling-group IC-Garske

echo "----------------------------------------------------"
echo "Created database with test data. Ready to dump data to $1"
echo "Please enter database password."
../scripts/dump-data.sh > $1
./gradlew :stopDatabase
