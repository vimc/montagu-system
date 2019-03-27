FROM node:8

ARG MONTAGU_GIT_ID="UNKNOWN"
ARG MONTAGU_GIT_BRANCH="UNKNOWN"

ENV MONTAGU_GIT_ID=$MONTAGU_GIT_ID
ENV MONTAGU_GIT_BRANCH=$MONTAGU_GIT_BRANCH

# This env var is needed for the custom reporter to log to teamcity
ENV TEAMCITY_VERSION="teamcity"

# Install docker
RUN apt-get update
RUN apt-get install -y \
        apt-transport-https \
        ca-certificates \
        curl \
        software-properties-common
RUN curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add -
RUN add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/debian \
   $(lsb_release -cs) \
   stable"
RUN apt-get update
RUN apt-get install -y docker-ce=5:18.09.0~3-0~debian-stretch

WORKDIR /workspace

COPY . /workspace

RUN npm install
RUN npm test

# Build, tag and publish docker image
CMD ./build-image.sh $MONTAGU_GIT_BRANCH $MONTAGU_GIT_ID
