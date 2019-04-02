#!/usr/bin/env bash

here=$(dirname $0)

# Use this once you have run the API with ./run-dependencies.sh
image=docker.montagu.dide.ic.ac.uk:5000/montagu-cli:master
exec docker run --network $NETWORK $image "$@"
