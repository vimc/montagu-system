FROM openjdk:8u121-jdk

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

# Setup gradle
COPY gradlew /api/
COPY gradle /api/gradle/
WORKDIR /api
RUN ./gradlew

# Do our build
COPY . /api

ARG git_id='UNKNOWN'
ARG git_branch='UNKNOWN'
ARG registry=fi--didelx05.dide.ic.ac.uk:5000
ARG name=montagu-api

ENV GIT_ID $git_id
ENV APP_DOCKER_TAG $registry/$name
ENV APP_DOCKER_COMMIT_TAG $registry/$name:$git_id
ENV APP_DOCKER_BRANCH_TAG $registry/$name:$git_branch

CMD ./gradlew :app:distDocker -i -Pdocker_version=$GIT_ID -Pdocker_name=$APP_DOCKER_TAG \
    && docker tag $APP_DOCKER_COMMIT_TAG $APP_DOCKER_BRANCH_TAG \
    && docker push $APP_DOCKER_BRANCH_TAG