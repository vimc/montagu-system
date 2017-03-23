FROM node:7

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
RUN apt-get install -y docker-ce=17.03.0~ce-0~debian-jessie

# Build our code
RUN npm install webpack --global

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app
RUN npm install

COPY . /usr/src/app

ARG app_docker_version='UNKNOWN'
ENV APP_DOCKER_VERSION $app_docker_version
ENV APP_DOCKER_TAG fi--didelx05.dide.ic.ac.uk/montagu-contrib-portal:$APP_DOCKER_VERSION

# Build and publish docker image
CMD webpack \
    && echo "Building $APP_DOCKER_TAG" \
    && docker build -f run.dockerfile -t $APP_DOCKER_TAG . \
    && docker push $APP_DOCKER_TAG