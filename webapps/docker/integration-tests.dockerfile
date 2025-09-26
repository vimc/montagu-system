ARG MONTAGU_GIT_ID="UNKNOWN"

FROM vimc/montagu-portal-shared-build-env:$MONTAGU_GIT_ID

ENTRYPOINT ["./scripts/run-integration-tests-in-container.sh"]
