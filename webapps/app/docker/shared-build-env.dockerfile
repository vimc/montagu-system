FROM node:7

# Install OpenJDK
# This section is cribbed from the official JDK image:
# https://github.com/docker-library/openjdk/blob/445f8b8d18d7c61e2ae7fda76d8883b5d51ae0a5/8-jdk/Dockerfile
ENV JAVA_DEBIAN_VERSION 8u131-b11-1~bpo8+1
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

# Install Docker Compose
RUN curl -L https://github.com/docker/compose/releases/download/1.16.1/docker-compose-`uname -s`-`uname -m` \
    -o /usr/local/bin/docker-compose
RUN chmod 744 /usr/local/bin/docker-compose

# Install webpack
RUN npm install webpack --global

# Create workspace
WORKDIR /workspace

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
COPY package.json .
RUN npm install 2>&1

# Generate Typescript models from montagu-webmodels
COPY ./src/webmodels/ src/webmodels
RUN mkdir -p src/main/shared/models
RUN npm run generate-models

# Main build starts here
# --------------------------------
COPY . .
