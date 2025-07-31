#!/usr/bin/env bash
set -ex

docker kill mq || true
docker logs task_queue_worker # TODO: remove!
docker kill task_queue_worker || true
docker kill flower || true
