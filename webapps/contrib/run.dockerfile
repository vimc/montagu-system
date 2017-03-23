FROM nginx:1.11

COPY dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/nginx.conf

CMD echo "Running..."
CMD nginx -g daemon off;