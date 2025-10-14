#!/usr/bin/env bash

image=ghcr.io/vimc/montagu-cli:main
docker pull $image
exec docker run --rm --network ${NETWORK} $image "$@"
