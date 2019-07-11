#!/usr/bin/env bash
here=$(dirname $0)
api_version=$(<$here/../config/api_version)

# Use this once you have run the API with ./run-dependencies.sh
image=docker.montagu.dide.ic.ac.uk:5000/montagu-cli:$api_version
exec docker run --network montagu_default $image "$@"
