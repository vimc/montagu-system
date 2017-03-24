FROM nginx:1.11

COPY out/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/nginx.conf