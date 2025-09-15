FROM ubuntu:16.04
RUN apt-get update && apt-get install -yy openjdk-8-jdk
ADD . /vimc
WORKDIR /vimc
## RUN ./gradlew generateFromDatabase && ./gradlew build
CMD ["./gradlew", "run"]
