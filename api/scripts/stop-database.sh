#!/usr/bin/env bash
set -e

HERE=$(dirname $0)
$HERE/../db/scripts/stop.sh $NETWORK
