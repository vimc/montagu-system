#!/usr/bin/env bash
set -ex

git_id=$(git rev-parse --short=7 HEAD)
git_branch=$(git symbolic-ref --short HEAD)
REGISTRY=docker.montagu.dide.ic.ac.uk:5000

function cleanup() {
    rm -rf secrets || true
}

trap cleanup EXIT

echo "Generating SSL keypair"
mkdir secrets
docker run --rm \
    -v $PWD/secrets:/workspace \
    $REGISTRY/montagu-cert-tool:master \
    gen-self-signed /workspace > /dev/null 2> /dev/null

# the real dhparam will be 4096 bits but that takes ages to generate
openssl dhparam -out secrets/dhparam.pem 1024

docker build -f dev/buildMinimal.dockerfile \
    -t montagu-reverse-proxy-build-minimal-env \
    --build-arg MONTAGU_GIT_ID=$git_id \
    --build-arg MONTAGU_GIT_BRANCH=$git_branch \
    .

# This is the path for teamcity agents. If running locally, pass in your own docker config location
# i.e. /home/{user}/.docker/config.json
docker_auth_path=${1:-/opt/teamcity-agent/.docker/config.json}

docker run \
    -v $docker_auth_path:/root/.docker/config.json \
    -v /var/run/docker.sock:/var/run/docker.sock \
    --network=host \
    montagu-reverse-proxy-build-minimal-env
