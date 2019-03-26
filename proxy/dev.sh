#!/usr/bin/env bash
set -e

export TOKEN_KEY_PATH=$PWD/token_key
export REGISTRY=docker.montagu.dide.ic.ac.uk:5000

# Pull down old containers
rm -rf workspace || true
docker stop reverse-proxy || true
docker rm reverse-proxy || true
docker stop montagu-metrics || true
docker rm montagu-metrics || true
docker-compose --project-name montagu down
docker network rm montagu_proxy || true

echo "Generating SSL keypair"
mkdir workspace
docker run --rm \
    -v $PWD/workspace:/workspace \
    $REGISTRY/montagu-cert-tool:master \
    gen-self-signed /workspace > /dev/null 2> /dev/null

# Run up all the APIs and Portals which are to be proxied
docker volume rm montagu_orderly_volume -f
docker-compose pull
docker-compose --project-name montagu up -d

# Start the APIs
docker exec montagu_api_1 mkdir -p /etc/montagu/api/
docker exec montagu_api_1 touch /etc/montagu/api/go_signal
docker exec montagu_reporting_api_1 mkdir -p /etc/montagu/reports_api
docker exec montagu_reporting_api_1 touch /etc/montagu/reports_api/go_signal
docker exec montagu_orderly_1 touch /orderly_go

# Wait for the database
docker exec montagu_db_1 montagu-wait.sh

# Migrate the database
migrate_image=$REGISTRY/montagu-migrate:master
docker pull $migrate_image
docker run --network=montagu_proxy $migrate_image

# Generate test data, including test users and reports, if 'data' present as first param
if [ "$1" = "data" ]; then
  test_data_image=$REGISTRY/montagu-generate-test-data:master
  docker pull $test_data_image
  docker run --rm --network=montagu_proxy $test_data_image

  # Generate report test data
    docker pull $REGISTRY/orderly:master
    docker run --rm \
      --entrypoint create_orderly_demo.sh \
      -v montagu_orderly_volume:/orderly \
      $REGISTRY/orderly:master \
    /orderly

  docker exec montagu_reporting_api_1 sh -c 'cp /orderly/demo/. /orderly/ -r'
fi

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
rm -rf workspace

sleep 2s
docker logs reverse-proxy
echo "Run 'docker stop reverse-proxy montagu-metrics' to stop"