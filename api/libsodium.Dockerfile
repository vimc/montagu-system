FROM openjdk:8u121-jdk

# Install libsodium
RUN apt-get update
RUN apt-get install -y build-essential

COPY ./scripts/install-libsodium.sh .
RUN ./install-libsodium.sh
