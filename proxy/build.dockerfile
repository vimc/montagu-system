ARG MONTAGU_GIT_ID="UNKNOWN"
FROM vimc/montagu-reverse-proxy-shared-build-env:$MONTAGU_GIT_ID

RUN npm run test

# Build, tag and publish docker image
CMD ./scripts/build-image.sh $MONTAGU_GIT_BRANCH $MONTAGU_GIT_ID
