#!/usr/bin/env bash

# Run this script separately to dev.sh to test logging in to Montagu when there is a pre-existing user in packit, with
# admin role defined (so has perms to see all packets etc).

USERNAME='test.user'
EMAIL='test.user@example.com'
DISPLAY_NAME='Test User'
ROLE='ADMIN'

docker exec montagu-orderly-web-packit-db-1 create-preauth-user --username "$USERNAME" --email "$EMAIL" --displayname "$DISPLAY_NAME" --role "$ROLE"