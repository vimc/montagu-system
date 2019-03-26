#!/usr/bin/env bash
set -e

export TOKEN_KEY_PATH=$PWD/token_key

rm -rf workspace
docker-compose --project-name montagu down
docker stop reverse-proxy || true
docker rm reverse-proxy || true
docker stop montagu-metrics || true
docker rm montagu-metrics || true
docker network rm montagu_proxy || true

echo "Generating SSL keypair"
mkdir workspace
docker run --rm \
    -v $PWD/workspace:/workspace \
    docker.montagu.dide.ic.ac.uk:5000/montagu-cert-tool:master \
    gen-self-signed /workspace > /dev/null 2> /dev/null

#docker network create montagu_proxy

# Run up all the APIs and Portals which are to be proxied
docker volume rm montagu_orderly_volume -f
docker-compose pull
docker-compose --project-name montagu up -d

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
rm -rf workspace

sleep 2s
docker logs reverse-proxy
echo "Run 'docker stop reverse-proxy montagu-metrics' to stop"