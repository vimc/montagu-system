#!/usr/bin/env bash

#!/usr/bin/env bash
set -ex
here=$(dirname $0)

function cleanup() {
    # Pull down old containers
    rm -rf workspace || true
    docker stop reverse-proxy || true
    docker rm reverse-proxy || true
    docker-compose --project-name montagu down || true
}

export REGISTRY=docker.montagu.dide.ic.ac.uk:5000

# This traps errors and Ctrl+C
trap cleanup EXIT

echo "Generating SSL keypair"
mkdir workspace
docker run --rm \
    -v $PWD/workspace:/workspace \
    $REGISTRY/montagu-cert-tool:master \
    gen-self-signed /workspace > /dev/null 2> /dev/null

$here/run-dependencies.sh

# Build and run the proxy and metrics containers
docker run -d \
	-p "8443:8443" -p "80:80" \
	--name reverse-proxy \
	--network montagu_proxy\
	 docker.montagu.dide.ic.ac.uk:5000/montagu-reverse-proxy-minimal:27bc3cc 8443 localhost

# the real dhparam will be 4096 bits but that takes ages to generate
openssl dhparam -out workspace/dhparam.pem 1024

docker cp workspace/certificate.pem reverse-proxy:/etc/montagu/proxy/
docker cp workspace/ssl_key.pem reverse-proxy:/etc/montagu/proxy/
docker cp workspace/dhparam.pem reverse-proxy:/etc/montagu/proxy/
rm -rf workspace

sleep 2s
docker logs reverse-proxy

echo "Proxy and dependencies are running. Press Ctrl+C to teardown."
sleep infinity
