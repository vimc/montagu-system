FROM openjdk8

# Putting this here as we'll need it later!
# TODO: CLI
apt-get update && apt-get install -y --no-install-recommends libsodium23 && apt-get clean && rm -rf /var/lib/apt/lists/*

ADD "app.tar" /
ENTRYPOINT "/app/bin/app"
