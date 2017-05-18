FROM node:7

# Install OpenJDK
# This section is cribbed from the official JDK image:
# https://github.com/docker-library/openjdk/blob/445f8b8d18d7c61e2ae7fda76d8883b5d51ae0a5/8-jdk/Dockerfile
ENV JAVA_DEBIAN_VERSION 8u121-b13-1~bpo8+1
ENV CA_CERTIFICATES_JAVA_VERSION 20161107~bpo8+1

RUN echo 'deb http://deb.debian.org/debian jessie-backports main' > /etc/apt/sources.list.d/jessie-backports.list
RUN apt-get update
RUN apt-get install -t jessie-backports -y \
    ca-certificates-java="$CA_CERTIFICATES_JAVA_VERSION" \
    openjdk-8-jdk="$JAVA_DEBIAN_VERSION"
RUN rm /etc/apt/sources.list.d/jessie-backports.list

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

# Install webpack
RUN npm install webpack --global

# Create workspace
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install Gradle wrapper
RUN mkdir -p src/webmodels/
COPY ./src/webmodels/gradlew src/webmodels/
COPY ./src/webmodels/gradle/ src/webmodels/gradle/
RUN ./src/webmodels/gradlew

# Install Kotlin compiler
COPY ./src/webmodels/build.gradle src/webmodels/
COPY ./src/webmodels/settings.gradle src/webmodels/
RUN ./src/webmodels/gradlew

# Install Node dependencies
COPY package.json /usr/src/app
RUN npm install

# Generate Typescript models from montagu-webmodels
COPY ./src/webmodels/ src/webmodels
RUN mkdir -p src/main/models
RUN npm run generate-models

# Main build starts here
# --------------------------------
WORKDIR /usr/src/app
COPY . /usr/src/app

ARG git_id='UNKNOWN'
ARG git_branch='UNKNOWN'
ARG registry=montagu.dide.ic.ac.uk:5000
ARG name=montagu-contrib-portal

ENV APP_DOCKER_COMMIT_TAG $registry/$name:$git_id
ENV APP_DOCKER_BRANCH_TAG $registry/$name:$git_branch
ENV MONTAGU_CONTRIB_PROFILE teamcity

# Build, tag and publish docker image
CMD webpack \
    && npm run test \
    && echo "Building $APP_DOCKER_COMMIT_TAG" \
    && docker build -f docker/run.dockerfile -t $APP_DOCKER_COMMIT_TAG . \
    && docker tag $APP_DOCKER_COMMIT_TAG $APP_DOCKER_BRANCH_TAG \
    && docker push $APP_DOCKER_COMMIT_TAG \
    && docker push $APP_DOCKER_BRANCH_TAG