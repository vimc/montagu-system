FROM montagu-reverse-proxy-shared-build-env

COPY . /workspace

RUN npm run test

# Build, tag and publish docker image
CMD ./scripts/build-image.sh $MONTAGU_GIT_BRANCH $MONTAGU_GIT_ID
