#!/usr/bin/env bash
set -ex
HERE=$(dirname $0)
. $HERE/common

$HERE/start-database.sh
$HERE/start-packit.sh docker-packit
$HERE/start-task-queue.sh
$HERE/start-api.sh $1
$HERE/start-proxy.sh