#!/usr/bin/env bash

here=$(dirname $0)

# Use this once you have run the API with ./run-dependencies.sh
image=ghcr.io/vimc/montagu-cli:main
exec docker run --rm --network $NETWORK $image "$@"
