docker run --rm \
	-v /var/run/docker.sock:/var/run/docker.sock \
	--network=host \
	montagu-api-build-environment
