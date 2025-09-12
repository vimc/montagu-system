#!/usr/bin/env bash

USERNAME='test.user'
EMAIL='test.user@example.com'
DISPLAY_NAME='Test User'
ROLE='ADMIN'

docker exec montagu-packit-db-1 create-preauth-user --username "$USERNAME" --email "$EMAIL" --displayname "$DISPLAY_NAME" --role "$ROLE"
