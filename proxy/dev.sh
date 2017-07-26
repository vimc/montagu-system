#!/usr/bin/env bash
set -e

rm -rf workspace
docker stop reverse-proxy || true
docker rm reverse-proxy || true

echo "Generating SSL keypair"
mkdir workspace
docker run --rm \
    -v $PWD/workspace:/workspace \
    docker.montagu.dide.ic.ac.uk:5000/montagu-cert-tool:master \
    gen-self-signed /workspace > /dev/null 2> /dev/null

docker build -t reverse-proxy .
docker run -d \
	-p "443:443" -p "80:80" \
	--name reverse-proxy \
	reverse-proxy 443

docker cp workspace/certificate.pem reverse-proxy:/etc/montagu/proxy/
docker cp workspace/ssl_key.pem reverse-proxy:/etc/montagu/proxy/
rm -rf workspace

echo "Reverse proxy is now running on port 443."
echo "Run 'docker stop reverse-proxy' to stop"