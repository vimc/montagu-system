export MONTAGU_API_VERSION=$(git rev-parse --short HEAD)

docker-compose pull
docker-compose --project-name montagu up -d
./scripts/generate-self-signed-certificate.sh password
./scripts/add-certificate-to-docker.sh keystore montagu_api_1

docker build -f blackbox.Dockerfile -t montagu-api-blackbox-tests .
docker run --network montagu_default montagu-api-blackbox-tests

docker-compose --project-name montagu down
