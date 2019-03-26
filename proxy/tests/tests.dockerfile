FROM node:8

WORKDIR /workspace

COPY package.json /workspace
RUN npm install

COPY ./resources /workspace/resources
COPY ./tests /workspace/tests

# This env var is needed for the custom reporter to log to teamcity
ENV TEAMCITY_VERSION="teamcity"

ENTRYPOINT ["npm"]
CMD ["test"]
