FROM nginx:1.13

COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx.montagu.conf /etc/nginx/conf.d/montagu.conf.template
COPY index.html /usr/share/nginx/html/index.html
COPY privacy.html /usr/share/nginx/html/privacy.html
COPY resources /usr/share/nginx/html/resources
RUN rm /etc/nginx/conf.d/default.conf

WORKDIR /app
COPY entrypoint.sh .

ENTRYPOINT ["/app/entrypoint.sh"]
