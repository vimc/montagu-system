# Create an image with libsodium installed
docker build --tag libsodium -f libsodium.Dockerfile .

docker build --tag montagu-api-build-environment .
