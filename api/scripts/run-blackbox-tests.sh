export MONTAGU_API_VERSION=$(git rev-parse --short HEAD)
docker-compose up --abort-on-container-exit