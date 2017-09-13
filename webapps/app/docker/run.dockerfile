FROM nginx:1.13

ARG APP_NAME

COPY out/$APP_NAME /usr/share/nginx/html
COPY src/templates /usr/share/nginx/html/templates
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx.default.conf /etc/nginx/conf.d/default.conf

ENV MONTAGU_PORTAL_PROFILE docker
