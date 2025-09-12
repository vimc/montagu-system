FROM node:24

WORKDIR /workspace
COPY . /workspace

RUN npm install
RUN npm run test

FROM nginx:stable

COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx.montagu.conf /etc/nginx/conf.d/montagu.conf.template
COPY index.html /usr/share/nginx/html/index.html
COPY 404.html /usr/share/nginx/html/404.html
COPY resources /usr/share/nginx/html/resources

ADD https://ssl-config.mozilla.org/ffdhe2048.txt /etc/nginx/dhparam.pem

# Copy third party javascript from npm modules
ENV THIRDPARTY_JS_PATH=/usr/share/nginx/html/resources/js/third_party/
COPY --from=0 /workspace/node_modules/pako/dist/pako.min.js $THIRDPARTY_JS_PATH
COPY --from=0 /workspace/node_modules/vue/dist/vue.min.js $THIRDPARTY_JS_PATH
COPY --from=0 /workspace/node_modules/jwt-decode/build/jwt-decode.min.js $THIRDPARTY_JS_PATH
COPY --from=0 /workspace/node_modules/jquery/dist/jquery.min.js $THIRDPARTY_JS_PATH

# Copy third party css from npm modules
COPY --from=0 /workspace/node_modules/bootstrap/dist/css/bootstrap.min.css /usr/share/nginx/html/resources/css/third_party/
COPY --from=0 /workspace/node_modules/bootstrap/dist/css/bootstrap.min.css.map /usr/share/nginx/html/resources/css/third_party/

RUN rm /etc/nginx/conf.d/default.conf
RUN mkdir -p /etc/montagu/proxy
RUN mkdir -p /var/www

WORKDIR /app
COPY entrypoint.sh .

ENTRYPOINT ["/app/entrypoint.sh"]
