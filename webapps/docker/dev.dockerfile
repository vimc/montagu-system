FROM node:8.9.4
RUN npm install webpack --global

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY ./app/package.json /usr/src/app
RUN npm install

COPY app /usr/src/app
RUN webpack

EXPOSE 5000
CMD npm start