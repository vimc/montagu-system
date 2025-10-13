#!/usr/bin/env bash
set -ex

HERE=$(dirname $0)

CONFIG=$1

if [[ -z $CONFIG ]]; then
  # this is used if running the app on metal for running local blackbox tests
  CONFIG=localhost-packit
fi

# Install packit
if [ "$GITHUB_ACTIONS" != "true" ]; then
  python3 -m venv .venv
  source .venv/bin/activate
fi
pip3 install constellation packit-deploy

packit configure $HERE/$CONFIG
packit start --pull

# give the db a moment...
if [ "$GITHUB_ACTIONS" = "true" ]; then
    sleep 60
else
    sleep 5
fi

USERNAME='test.user'
EMAIL='user@test.com'
DISPLAY_NAME='Test User'
ROLE='ADMIN'
docker exec montagu-packit-db create-preauth-user --username "$USERNAME" --email "$EMAIL" --displayname "$DISPLAY_NAME" --role "$ROLE"
