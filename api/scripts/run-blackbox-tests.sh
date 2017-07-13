export MONTAGU_API_VERSION=$(git rev-parse --short HEAD)
cert_tool_version=59657b2

docker-compose pull
docker-compose --project-name montagu up -d
docker exec montagu_api_1 touch /etc/montagu/api/go_signal

docker build -f blackbox.Dockerfile -t montagu-api-blackbox-tests .
docker run --network montagu_default montagu-api-blackbox-tests

docker-compose --project-name montagu down
