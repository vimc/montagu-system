ARG git_id="UNKNOWN"
FROM vimc/montagu-api-shared-build-env:$git_id

ARG git_id='UNKNOWN'
ARG git_branch='UNKNOWN'
ARG org=vimc
ARG name=montagu-cli

ENV GIT_ID $git_id
ENV APP_DOCKER_TAG $org/$name
ENV APP_DOCKER_COMMIT_TAG $org/$name:$git_id
ENV APP_DOCKER_BRANCH_TAG $org/$name:$git_branch

CMD ./gradlew :userCLI:test :userCLI:docker -i -Pdocker_version=$GIT_ID -Pdocker_name=$APP_DOCKER_TAG \
    && docker tag $APP_DOCKER_COMMIT_TAG $APP_DOCKER_BRANCH_TAG \
    && docker push $APP_DOCKER_BRANCH_TAG
