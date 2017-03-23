FROM ubuntu:16.04

# Installation tools
RUN apt-get update
RUN apt-get install -y software-properties-common apt-transport-https

# JDK
RUN apt-get install -y openjdk-8-jdk

# Install docker
RUN apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
RUN add-apt-repository 'deb https://apt.dockerproject.org/repo ubuntu-xenial main'
RUN apt-get update
RUN apt-get install -y docker-engine

# Setup gradle
COPY gradlew /api/
COPY gradle /api/gradle/
WORKDIR /api
RUN ./gradlew

# Do our build
COPY . /api
ARG docker_version=UNKNOWN
ENV API_DOCKER_VERSION $docker_version

CMD ./gradlew :app:distDocker -i -Pdocker_version=$API_DOCKER_VERSION