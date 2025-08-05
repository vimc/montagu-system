#!/usr/bin/env bash
set -ex

docker kill reverse-proxy || true
docker rm reverse-proxy || true
docker kill admin || true
docker rm admin || true
docker kill contrib || true
docker rm contrib || true