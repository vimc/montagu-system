export MONTAGU_API_VERSION=$(git rev-parse --short HEAD)
cert_tool_version=d3f4ecb

docker-compose pull
docker-compose --project-name montagu up -d
docker run montagu.dide.ic.ac.uk:5000/montagu-cert-tool:$cert_tool_version gen-self-signed password > keystore
./scripts/add-certificate-to-docker.sh keystore montagu_api_1

docker build -f blackbox.Dockerfile -t montagu-api-blackbox-tests .
docker run --network montagu_default montagu-api-blackbox-tests

docker-compose --project-name montagu down
