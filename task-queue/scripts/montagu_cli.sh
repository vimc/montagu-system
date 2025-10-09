#!/usr/bin/env bash

image=ghcr.io/vimc/montagu-cli:update-repo #TODO: revert when merge branch
docker pull $image
exec docker run --rm --network ${NETWORK} $image "$@"
