#!/usr/bin/env bash
set -ex

export MONTAGU_PROXY_TESTS=montagu-proxy-tests

docker build -f ./tests/tests.dockerfile -t $MONTAGU_PROXY_TESTS .
docker run $MONTAGU_PROXY_TESTS