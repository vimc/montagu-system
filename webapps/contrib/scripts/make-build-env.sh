set -e
git_id=$(git rev-parse --short HEAD)
docker build -f .\build.dockerfile -t montagu-contrib-portal-build-env --build-arg app_docker_version=$git_id .