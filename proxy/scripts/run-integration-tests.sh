#!/usr/bin/env bash

set -e
HERE=$(dirname $0)
. $HERE/common

function cleanup() {
    # Pull down old containers
    rm -rf workspace || true
    rm -rf montagu_emails || true
    $HERE/clear-docker.sh
}

trap cleanup EXIT

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
docker exec reverse-proxy curl http://outpack_server:8000/metrics

docker run \
  --rm \
	--network host \
	-v ${PWD}/montagu_emails:/workspace/montagu_emails \
	$INTEGRATION_TESTS_TAG
