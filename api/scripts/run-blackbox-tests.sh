export MONTAGU_API_VERSION=$(git rev-parse --short HEAD)

docker-compose pull
docker-compose --project-name montagu up -d

docker build -f Dockerfile-blackbox -t montagu-api-blackbox-tests .
docker run --network montagu_default montagu-api-blackbox-tests

docker-compose down
