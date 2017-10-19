FROM montagu-portal-build-env

RUN npm install -g mocha-webpack
RUN webpack
CMD ./scripts/run-integration-tests.sh
