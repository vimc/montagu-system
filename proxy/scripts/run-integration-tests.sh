#!/usr/bin/env bash

set -e
HERE=$(dirname $0)
. $HERE/common

function cleanup() {
    # Pull down old containers
    rm -rf workspace || true
    rm -rf montagu_emails || true
}

trap cleanup EXIT

# We need to have an orderly demo folder available for outpack_server container to become available - see README for
# suggestion for local setup. If we're on Buildkit, write out a minimal config and the server should spin up
#if [[ "$BUILDKITE" = "true" ]]; then
#    OUTPACK_ROOT=$HERE/../../packit/demos/orderly/.outpack
#    OUTPACK_CONFIG_FILE=$OUTPACK_ROOT/config.json
#    if [ ! -f $OUTPACK_CONFIG_FILE ]; then
#        echo "Testing local mkdir"
#        mkdir -p $HERE/testdir || true
#        echo "Creating outpack config file"
#        mkdir -p $OUTPACK_ROOT || true
#        echo '{"core":{"path_archive":null,"use_file_store":true,"require_complete_tree":true,"hash_algorithm":"sha256"},"location":[{"name":"local","type":"local","args":{}}]}' > $OUTPACK_CONFIG_FILE || true
#    fi
#fi

mkdir montagu_emails
$HERE/run-dependencies.sh

export ORG=vimc

docker run -d \
	-p "443:443" -p "80:80" \
	--name reverse-proxy \
	--network montagu_proxy\
	$SHA_TAG 443 localhost

docker run -d \
  -p "9113:9113" \
  --network montagu_proxy \
  --name montagu-metrics \
  --restart always \
  nginx/nginx-prometheus-exporter:0.2.0 \
  -nginx.scrape-uri "http://reverse-proxy/basic_status"

#TODO: remove debug
docker ps
docker logs montagu-outpack_server-1
docker exec reverse-proxy curl http://outpack_server:8000/metrics

docker run \
  --rm \
	--network host \
	-v ${PWD}/montagu_emails:/workspace/montagu_emails \
	$INTEGRATION_TESTS_TAG
