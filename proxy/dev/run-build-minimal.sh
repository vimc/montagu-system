 #!/usr/bin/env bash
set -ex
HERE=$(dirname $0)
. $HERE/../scripts/common

docker build -f dev/buildMinimal.dockerfile \
    -t montagu-reverse-proxy-build-minimal-env \
    --build-arg MONTAGU_GIT_ID=$GIT_SHA \
    --build-arg MONTAGU_GIT_BRANCH=$GIT_BRANCH \
    .

# This is the path for buildkite agents. If running locally, pass in your own docker config location
# i.e. /home/{user}/.docker/config.json
docker_auth_path=${1:-/var/lib/buildkite-agent/.docker/config.json}

docker run \
    -v $docker_auth_path:/root/.docker/config.json \
    -v /var/run/docker.sock:/var/run/docker.sock \
    --network=host \
    montagu-reverse-proxy-build-minimal-env
