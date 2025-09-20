FROM openjdk:11

RUN apt-get update && apt-get install -y --no-install-recommends libsodium23 && apt-get clean && rm -rf /var/lib/apt/lists/*

ADD "src/userCLI/build/distributions/userCLI.tar" /
ENTRYPOINT ["sh", "/userCLI/bin/userCLI"]
