#!/usr/bin/env bash

# Use this once you have run the API with ./run-apis.sh
exec docker run --network montagu_default \
    docker.montagu.dide.ic.ac.uk:5000/montagu-cli:master \
    "$@"
