FROM node:8

WORKDIR /workspace

COPY package.json /workspace
COPY tests/tests_docker.sh /workspace/tests_docker.sh

COPY ./resources /workspace/resources
COPY ./tests /workspace/tests

# This env var is needed for the custom reporter to log to teamcity
ENV TEAMCITY_VERSION="teamcity"

ENTRYPOINT ["./tests_docker.sh"]

