git_id = $(git rev-parse --short HEAD)
docker build \
    --tag montagu-api-build-environment \
    --build-arg $git_id
    .
