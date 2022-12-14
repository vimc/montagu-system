#!/usr/bin/env bash
set -ex
HERE=$(dirname $0)
ROOT=$(realpath $HERE/..)

docker rm flower || true

if [[ ! -z $NETWORK ]]; then
  NETWORK_MAPPING="--network=$NETWORK"
else
  # if no network provided, use db default network
  NETWORK_MAPPING="--network=db_nw"
fi

docker run --rm -d \
  $NETWORK_MAPPING \
  -p 6379:6379 \
  --name mq \
  redis

docker pull vimc/task-queue-worker:master
docker run --rm -d \
  $NETWORK_MAPPING \
  -v $ROOT/scripts/task-queue-config.yml:/home/worker/config/config.yml \
  --name task_queue_worker \
  vimc/task-queue-worker:master

# flower provides an http api for interacting with/monitoring celery
docker run -d \
  $NETWORK_MAPPING \
  -p 5555:5555 \
  -e CELERY_BROKER_URL=redis://mq// \
  -e CELERY_RESULT_BACKEND=redis://mq/0/ \
  -e FLOWER_PORT=5555 \
  --name flower \
  mher/flower:0.9.5

# add task q user
CLI=vimc/montagu-cli:master
docker pull $CLI
docker run --rm \
  $NETWORK_MAPPING \
  $CLI \
  add "Task User" task.user task.user@example.com password --if-not-exists

docker run --rm \
  $NETWORK_MAPPING \
  $CLI addRole task.user user

$HERE/orderly-web-cli.sh add-users task.user@example.com
$HERE/orderly-web-cli.sh grant task.user@example.com */reports.read */reports.run */reports.review
