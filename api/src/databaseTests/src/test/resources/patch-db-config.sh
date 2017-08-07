#!/usr/bin/env bash
set -ex
apt-get update
apt-get install patch
patch /pgdata/postgresql.conf /conf.patch