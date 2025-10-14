#!/usr/bin/env bash
here=$(dirname $0)

# Use this once you have run the API with ./run-dependencies.sh
image=ghcr.io/vimc/montagu-cli:update-repo #TODO: revert this to main when branch is merged
exec docker run --network montagu_default $image "$@"
