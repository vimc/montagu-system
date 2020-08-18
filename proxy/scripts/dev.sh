#!/usr/bin/env bash
set -ex
here=$(dirname $0)

function cleanup() {
    # Pull down old containers
    rm -rf workspace || true
    rm -rf montagu_emails|| true
    docker stop reverse-proxy || true
    docker rm reverse-proxy || true
    docker stop montagu-metrics || true
    docker rm montagu-metrics || true
    docker-compose --project-name montagu down || true
}

export ORG=vimc

cleanup

# This traps errors and Ctrl+C
trap cleanup EXIT

echo "Generating SSL keypair"
mkdir workspace
mkdir montagu_emails
docker run --rm \
    -v $PWD/workspace:/workspace \
    $ORG/montagu-cert-tool:master \
    gen-self-signed /workspace > /dev/null 2> /dev/null

$here/run-dependencies.sh

# Build and run the proxy and metrics containers
docker build -t reverse-proxy .
docker run -d \
	-p "443:443" -p "80:80" \
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

# the real dhparam will be 4096 bits but that takes ages to generate
openssl dhparam -out workspace/dhparam.pem 1024

docker cp workspace/certificate.pem reverse-proxy:/etc/montagu/proxy/
docker cp workspace/ssl_key.pem reverse-proxy:/etc/montagu/proxy/
docker cp workspace/dhparam.pem reverse-proxy:/etc/montagu/proxy/
docker cp $here/../2020 reverse-proxy:/usr/share/nginx/html
rm -rf workspace

sleep 2s
docker logs reverse-proxy

echo "Proxy and dependencies are running. Press Ctrl+C to teardown."
sleep infinity
