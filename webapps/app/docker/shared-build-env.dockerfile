FROM node:8

# Install OpenJDK
RUN echo 'deb http://deb.debian.org/debian stretch-backports main' > /etc/apt/sources.list.d/stretch-backports.list
RUN apt-get update
RUN apt-get install -t stretch-backports -y \
    openjdk-8-jdk
RUN rm /etc/apt/sources.list.d/stretch-backports.list

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

# Install Docker Compose
RUN curl -L https://github.com/docker/compose/releases/download/1.16.1/docker-compose-`uname -s`-`uname -m` \
    -o /usr/local/bin/docker-compose
RUN chmod 744 /usr/local/bin/docker-compose

# Install webpack
RUN npm install webpack@v4.30.0 webpack-cli --global

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
COPY package-lock.json .
RUN npm install --quiet 2>&1

# Generate Typescript models from montagu-webmodels
COPY ./src/webmodels/ src/webmodels
RUN mkdir -p src/main/shared/models
RUN npm run generate-models

# Main build starts here
# --------------------------------
COPY . .
