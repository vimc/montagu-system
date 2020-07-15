FROM vimc/node-docker-openjdk:master

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
COPY ./app/src/webmodels/gradlew src/webmodels/
COPY ./app/src/webmodels/gradle/ src/webmodels/gradle/
RUN ./src/webmodels/gradlew

# Install Kotlin compiler
COPY ./app/src/webmodels/build.gradle src/webmodels/
COPY ./app/src/webmodels/settings.gradle src/webmodels/
RUN ./src/webmodels/gradlew

# Install Node dependencies
COPY ./app/package.json .
COPY ./app/package-lock.json .
RUN npm install --quiet 2>&1

# Generate Typescript models from montagu-webmodels
COPY ./app/src/webmodels/ src/webmodels
RUN mkdir -p src/main/shared/models
RUN npm run generate-models

# Main build starts here
# --------------------------------
COPY app .
RUN mkdir -p docker
COPY docker docker
