#!/usr/bin/env bash
set -ex

HERE=$(dirname $0)

CONFIG=$1

if [[ ! -z $CONFIG ]]; then
  # this is used if running the app on metal for running local blackbox tests
  CONFIG = localhost-packit
fi

# Install packit
python3 -m venv .venv
source .venv/bin/activate
pip3 install constellation packit-deploy

# TODO: configure, when packit deploy branch is merged
packit configure $HERE/$CONFIG
packit start --pull

# TODO: replace with packit equivalent
#$HERE/orderly-web-cli.sh add-users user@test.com
#$HERE/orderly-web-cli.sh grant user@test.com */users.manage
# Add user to packit, as admin
USERNAME='test.user'
EMAIL='user@test.com'
DISPLAY_NAME='Test User'
ROLE='ADMIN'
docker exec montagu-packit-db create-preauth-user --username "$USERNAME" --email "$EMAIL" --displayname "$DISPLAY_NAME" --role "$ROLE"
