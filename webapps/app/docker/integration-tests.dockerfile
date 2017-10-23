FROM montagu-portal-build-env

ENV PGHOST db
ENV MONTAGU_PORTAL_PROFILE packaged_integration_tests

ENTRYPOINT ["./scripts/run-integration-tests-in-container.sh"]
