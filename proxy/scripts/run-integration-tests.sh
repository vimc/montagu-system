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

echo "Generating SSL keypair"
mkdir workspace
docker run --rm \
    -v $PWD/workspace:/workspace \
    $ORG/montagu-cert-tool:master \
    gen-self-signed /workspace > /dev/null 2> /dev/null

echo "Running reverse proxy"
docker run -d \
	-p "443:443" -p "80:80" \
	--name reverse-proxy \
	--network montagu_proxy\
	$SHA_TAG 443 localhost

echo "Running metrics"
docker run -d \
    -p "9113:9113" \
    --network montagu_proxy \
    --name montagu-metrics \
    --restart always \
    nginx/nginx-prometheus-exporter:0.2.0 \
    -nginx.scrape-uri "http://reverse-proxy/basic_status"

# the real dhparam will be 4096 bits but that takes ages to generate
openssl dhparam -out workspace/dhparam.pem 1024

echo "Copying workshpace"
docker cp workspace/certificate.pem reverse-proxy:/etc/montagu/proxy/
docker cp workspace/ssl_key.pem reverse-proxy:/etc/montagu/proxy/
docker cp workspace/dhparam.pem reverse-proxy:/etc/montagu/proxy/
rm -rf workspace

sleep 2s

echo "Running integration tests container"
docker run \
  --rm \
	--network host \
	-v ${PWD}/montagu_emails:/workspace/montagu_emails \
	$INTEGRATION_TESTS_TAG
