set -e
git_id=$(git rev-parse --short HEAD)
docker build --tag montagu-api-build-environment --build-arg api_docker_version=$git_id .
