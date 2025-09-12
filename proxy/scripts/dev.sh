#!/usr/bin/env bash
set -ex
here=$(dirname $0)
. $here/common

function cleanup() {
    # Pull down old containers
    rm -rf workspace || true
    rm -rf montagu_emails|| true
    docker stop reverse-proxy || true
    docker rm reverse-proxy || true
    docker stop montagu-metrics || true
    docker rm montagu-metrics || true
    docker compose down || true
}

cleanup

# This traps errors and Ctrl+C
trap cleanup EXIT

mkdir montagu_emails

$here/run-dependencies.sh "$@"

# Build and run the proxy and metrics containers
docker build -t reverse-proxy .
docker run -d \
	-p "443:443" -p "80:80" -p "9000:9000" \
	--name reverse-proxy \
	--network montagu_proxy\
	reverse-proxy 443 localhost

docker run -d \
    -p "9113:9113" \
    --network montagu_proxy \
    --name montagu-metrics \
    --restart always \
    nginx/nginx-prometheus-exporter:0.2.0 \
    -nginx.scrape-uri "http://reverse-proxy/basic_status"

docker cp $here/../2020 reverse-proxy:/usr/share/nginx/html
docker cp $here/../2021 reverse-proxy:/usr/share/nginx/html

sleep 2s
docker logs reverse-proxy

echo "Proxy and dependencies are running. Press Ctrl+C to teardown."
sleep infinity
