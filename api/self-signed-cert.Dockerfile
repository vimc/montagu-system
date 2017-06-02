FROM openjdk:8u121-jdk

WORKDIR /app
COPY scripts/generate-self-signed-certificate.sh .

ENTRYPOINT ["./generate-self-signed-certificate.sh"]