#!/usr/bin/env bash
set -ex

docker kill mq || true
docker kill task_queue_worker || true
