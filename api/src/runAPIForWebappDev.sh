#!/usr/bin/env bash
./gradlew :stopDatabase

./gradlew :startDatabase :blackboxTests:run \
&& ./user.sh add "Test User" test.user test@example.com password \
&& ./user.sh addRole test.user user \
&& ./user.sh addRole test.user member modelling-group group-1 \
&& ./gradlew :run