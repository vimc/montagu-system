FROM openjdk:8

# Putting this here as we'll need it later!
# TODO: CLI
RUN apt-get update && apt-get install -y --no-install-recommends libsodium23 && apt-get clean && rm -rf /var/lib/apt/lists/*

ADD "app.tar" /
ENTRYPOINT ["/app/bin/app"]
