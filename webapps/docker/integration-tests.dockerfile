FROM montagu-portal-shared-build-env

# this env var needs to exist for the jest teamcity reporter to be activated
ENV TEAMCITY_VERSION=1

ENTRYPOINT ["./scripts/run-integration-tests-in-container.sh"]
