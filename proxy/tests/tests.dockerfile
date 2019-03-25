FROM node:8

WORKDIR /workspace

COPY package.json /workspace
RUN npm install

COPY ./resources /workspace/resources
COPY ./tests /workspace/tests

ENTRYPOINT ["npm"]
CMD ["test"]
