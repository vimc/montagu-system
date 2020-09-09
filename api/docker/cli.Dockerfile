ARG git_id="UNKNOWN"
FROM vimc/montagu-api-shared-build-env:$git_id

ARG git_branch='UNKNOWN'
ARG registry=docker.montagu.dide.ic.ac.uk:5000
ARG name=montagu-cli

ENV GIT_ID $git_id
ENV APP_DOCKER_TAG $registry/$name
ENV APP_DOCKER_COMMIT_TAG $registry/$name:$git_id
ENV APP_DOCKER_BRANCH_TAG $registry/$name:$git_branch

CMD ./gradlew :startDatabase userCLI:test :stopDatabase :userCLI:distDocker -i -Pdocker_version=$GIT_ID -Pdocker_name=$APP_DOCKER_TAG \
    && docker tag $APP_DOCKER_COMMIT_TAG $APP_DOCKER_BRANCH_TAG \
    && docker push $APP_DOCKER_BRANCH_TAG
