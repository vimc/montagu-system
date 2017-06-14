set -e
git_id=$(git rev-parse --short HEAD)
git_branch=$(git symbolic-ref --short HEAD)

docker build -f ./docker/build.dockerfile \
    -t montagu-portal-build-env \
    --build-arg MONTAGU_GIT_ID=$git_id \
    --build-arg MONTAGU_GIT_BRANCH=$git_branch \
    .