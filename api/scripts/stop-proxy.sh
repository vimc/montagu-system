#!/usr/bin/env bash
set -x

docker kill reverse-proxy
docker rm reverse-proxy
docker kill admin
docker rm admin
docker kill contrib
docker rm contrib