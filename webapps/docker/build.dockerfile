FROM montagu-portal-shared-build-env

ARG MONTAGU_GIT_ID="UNKNOWN"
ARG MONTAGU_GIT_BRANCH="UNKNOWN"

ENV MONTAGU_GIT_ID=$MONTAGU_GIT_ID
ENV MONTAGU_GIT_BRANCH=$MONTAGU_GIT_BRANCH

# this env var needs to exist for the jest teamcity reporter to be activated
ENV TEAMCITY_VERSION=1

# Build, tag and publish docker image
CMD docker/build-images.sh $MONTAGU_GIT_BRANCH $MONTAGU_GIT_ID