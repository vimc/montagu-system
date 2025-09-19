FROM openjdk:17-alpine

RUN apk update && apk upgrade && apk add libsodium=1.0.18-r0

ADD "src/userCLI/build/distributions/userCLI.tar" /
ENTRYPOINT ["sh", "/userCLI/bin/userCLI"]
