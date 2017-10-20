#!/usr/bin/env bash
set -ex

psql -h $DB_HOST -U vimc -d postgres -c \
    "ALTER DATABASE $TEMPLATE_DB_NAME RENAME TO $DB_NAME"
