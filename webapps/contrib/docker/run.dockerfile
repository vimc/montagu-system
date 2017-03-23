FROM nginx:1.11

COPY dist /usr/share/nginx/html

CMD echo "Running..."