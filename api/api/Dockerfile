FROM ubuntu:16.04

# Installation tools
RUN apt-get update
RUN apt-get install -y wget unzip software-properties-common apt-transport-https

# JDK
RUN apt-get install -y openjdk-8-jdk

# Install gradle
ENV GRADLE_VERSION=3.1
ENV GRADLE_HOME=/opt/gradle
ENV GRADLE_FOLDER=/root/.gradle

WORKDIR /tmp

RUN wget --no-check-certificate --no-cookies https://downloads.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip \
    && unzip gradle-${GRADLE_VERSION}-bin.zip -d /opt \
    && ln -s /opt/gradle-${GRADLE_VERSION} /opt/gradle \
    && rm -f gradle-${GRADLE_VERSION}-bin.zip

RUN update-alternatives --install "/usr/bin/gradle" "gradle" "/opt/gradle/bin/gradle" 1 && \
    update-alternatives --set "gradle" "/opt/gradle/bin/gradle" 

RUN mkdir -p $GRADLE_FOLDER

VOLUME $GRADLE_FOLDER

# Install docker
RUN apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
RUN add-apt-repository 'deb https://apt.dockerproject.org/repo ubuntu-xenial main'
RUN apt-get update
RUN apt-get install -y docker-engine

# Do our build
COPY . /api
WORKDIR /api/api

CMD gradle :app:distDocker -i