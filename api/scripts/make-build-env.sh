set -e
git_id=$(git rev-parse --short HEAD)
git_branch=$(git symbolic-ref --short HEAD)

docker build --tag montagu-api-build-environment \
	--build-arg git_id=$git_id \
	--build-arg git_branch=$git_branch \
	.
