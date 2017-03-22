FROM openjdk:8

COPY . /api
WORKDIR /api

CMD ["./gradlew", ":app:test", "-i"]