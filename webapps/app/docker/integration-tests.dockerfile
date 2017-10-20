FROM montagu-portal-build-env

ENV PGHOST db
ENV MONTAGU_PORTAL_PROFILE packaged_integration_tests

CMD ./scripts/add-test-accounts-for-integration-tests.sh && \
    ./scripts/run-integration-tests.sh
