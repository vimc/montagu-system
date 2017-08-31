FROM libsodium

# Setup gradle
COPY src/gradlew /api/src/
COPY src/gradle /api/src/gradle/
WORKDIR /api/src
RUN ./gradlew

# Pull in dependencies
COPY ./src/build.gradle /api/src/
COPY ./src/settings.gradle /api/src/
COPY ./src/config/ /api/src/config/
RUN echo 'docker' > config/current_user
RUN ./gradlew

# Do our build
COPY . /api
RUN ./gradlew :blackboxTests:compileKotlin
CMD ./gradlew :blackboxTests:test -i