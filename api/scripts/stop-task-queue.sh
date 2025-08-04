#!/usr/bin/env bash
set -ex

docker kill mq || true
docker logs task-queue-worker # TODO: remove!
docker kill task-queue-worker || true
docker kill flower || true
