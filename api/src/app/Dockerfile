FROM eclipse-temurin:11

RUN apt-get update && apt-get install -y --no-install-recommends libsodium23 && apt-get clean && rm -rf /var/lib/apt/lists/*

ADD "src/app/build/distributions/app.tar" /
ENTRYPOINT ["/app/bin/app"]
