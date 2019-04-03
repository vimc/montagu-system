#!/usr/bin/env bash
set -ex

here=$(dirname $0)

git_id=$(git rev-parse --short=7 HEAD)
git_branch=$(git symbolic-ref --short HEAD)

function cleanup() {
    # Pull down old containers
    rm -rf workspace || true
    docker stop reverse-proxy || true
    docker rm reverse-proxy || true
    docker stop montagu-metrics || true
    docker rm montagu-metrics || true
    docker-compose --project-name montagu down || true
}

trap cleanup EXIT

$here/run-dependencies.sh

export REGISTRY=docker.montagu.dide.ic.ac.uk:5000

echo "Generating SSL keypair"
mkdir workspace
docker run --rm \
    -v $PWD/workspace:/workspace \
    $REGISTRY/montagu-cert-tool:master \
    gen-self-signed /workspace > /dev/null 2> /dev/null

docker run -d \
	-p "443:443" -p "80:80" \
	--name reverse-proxy \
	--network montagu_proxy\
	$REGISTRY/montagu-reverse-proxy:$git_id 443 localhost

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
rm -rf workspace

sleep 2s

docker run \
	--network host \
	montagu-reverse-proxy-integration-tests
