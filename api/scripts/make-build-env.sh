# Create an image with libsodium installed
docker build --pull --tag libsodium -f libsodium.Dockerfile .

docker build --tag montagu-api-build-environment .
