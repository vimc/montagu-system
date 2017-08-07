#!/usr/bin/env bash
./scripts/make-build-env.sh
docker build --tag montagu-api-schema-check -f check-schema.Dockerfile .
docker run --rm montagu-api-schema-check