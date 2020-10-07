#!/usr/bin/env bash
set -ex

HERE=$(dirname $0)

HOST=$1

if [[ ! -z $NETWORK ]]; then
  OPTION_MAPPING="--option network=$NETWORK"
fi

if [[ ! -z $HOST ]]; then
  # this is used if running the app on metal for running local blackbox tests
  OPTION_MAPPING="--option network=host --option web.auth.montagu_url=http://localhost:8080 --option web.auth.montagu_api_url=http://localhost:8080/v1"
fi

# Install orderly-web
if which -a orderly-web > /dev/null; then
  echo "orderly-web already installed"
else
  pip3 install orderly-web --user
fi

#export PATH=$PATH:/var/lib/buildkite-agent/.local/bin
orderly-web start $HERE $OPTION_MAPPING

$HERE/orderly-web-cli.sh add-users user@test.com
$HERE/orderly-web-cli.sh grant user@test.com */users.manage
