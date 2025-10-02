FROM nginx:1.13

ARG APP_NAME

COPY out/$APP_NAME /usr/share/nginx/html
# TODO: put these somewhere more sensible
COPY nginxConfig/nginx.conf /etc/nginx/nginx.conf
COPY nginxConfig/nginx.default.conf /etc/nginx/conf.d/default.conf

ENV MONTAGU_PORTAL_PROFILE docker
