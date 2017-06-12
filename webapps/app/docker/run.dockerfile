FROM nginx:1.13

ARG APP_NAME

COPY out/$APP_NAME /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx.default.conf /etc/nginx/conf.d/default.conf
WORKDIR /app
COPY docker/entrypoint.sh entrypoint.sh

ENV MONTAGU_CONTRIB_PROFILE docker

ENTRYPOINT /app/entrypoint.sh
