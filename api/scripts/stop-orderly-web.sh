#!/usr/bin/env bash
set -ex
HERE=$(dirname $0)

if which -a orderly-web >/dev/null; then
  orderly-web stop $HERE --kill --force
fi
