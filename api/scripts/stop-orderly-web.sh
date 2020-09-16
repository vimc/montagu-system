#!/usr/bin/env bash
set -ex
HERE=$(dirname $0)

orderly-web stop $HERE --kill --force
