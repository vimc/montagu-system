#!/usr/bin/env bash
./gradlew :stopDatabase

./gradlew :startDatabase :generateTestData \
&& ./user.sh add "Test User" test.user test@example.com password \
&& ./user.sh addRole test.user user \
&& ./user.sh addRole test.user member modelling-group IC-Garske \
&& ./user.sh addRole test.user member modelling-group IC-Imaginary \
&& ./gradlew :run