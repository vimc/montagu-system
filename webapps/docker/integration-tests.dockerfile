FROM montagu-portal-shared-build-env

ENTRYPOINT ["./scripts/run-integration-tests-in-container.sh"]
