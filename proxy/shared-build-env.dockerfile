FROM docker.montagu.dide.ic.ac.uk:5000/node-docker:master

ARG MONTAGU_GIT_ID="UNKNOWN"
ARG MONTAGU_GIT_BRANCH="UNKNOWN"

ENV MONTAGU_GIT_ID=$MONTAGU_GIT_ID
ENV MONTAGU_GIT_BRANCH=$MONTAGU_GIT_BRANCH

# This env var is needed for the custom reporter to log to teamcity
ENV TEAMCITY_VERSION="teamcity"

WORKDIR /workspace

COPY package-lock.json /workspace

RUN npm install
