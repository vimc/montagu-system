FROM montagu-reverse-proxy-shared-build-env

RUN apt-get update && apt-get install -yq default-jre

RUN apt-get -f install

RUN apt-get install chromium-browser
RUN ./scripts/install-chromedriver.sh

CMD npm run integration-test
