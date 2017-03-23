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

ARG git_id='UNKNOWN'
ARG git_branch='UNKNOWN'
ARG registry=fi--didelx05.dide.ic.ac.uk:5000
ARG name=montagu-contrib-portal

ENV APP_DOCKER_COMMIT_TAG $registry/$name:$git_id
ENV APP_DOCKER_BRANCH_TAG $registry/$name:$git_branch

# Build, tag and publish docker image
CMD webpack \
    && echo "Building $APP_DOCKER_TAG" \
    && docker build -f docker/run.dockerfile -t $APP_DOCKER_COMMIT_TAG . \
    && docker tag $APP_DOCKER_COMMIT_TAG $APP_DOCKER_BRANCH_TAG \
    && docker push $APP_DOCKER_TAG