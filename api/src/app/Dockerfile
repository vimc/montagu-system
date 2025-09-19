FROM openjdk:17-alpine

RUN apk update && apk upgrade && apk add libsodium=1.0.18-r0

ADD "src/app/build/distributions/app.tar" /
ENTRYPOINT ["/app/bin/app"]
