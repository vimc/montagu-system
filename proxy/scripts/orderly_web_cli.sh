#!/usr/bin/env bash

image=docker.montagu.dide.ic.ac.uk:5000/orderly-web-user-cli:master
docker run -v $PWD/demo:/orderly --network montagu_proxy $image $@
