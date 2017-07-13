set -e

export MONTAGU_API_VERSION=$(git rev-parse --short HEAD)
cert_tool_version=59657b2

# Run API and DB
docker-compose pull
docker-compose --project-name montagu up -d
docker exec montagu_api_1 mkdir -p /etc/montagu/api/
docker exec montagu_api_1 touch /etc/montagu/api/go_signal

# Build and run image that can run blackbox tests
docker build --tag libsodium -f libsodium.Dockerfile .
docker build -f blackbox.Dockerfile -t montagu-api-blackbox-tests .
docker run --network montagu_default montagu-api-blackbox-tests

# Tear down
docker-compose --project-name montagu down
