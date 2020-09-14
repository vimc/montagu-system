ARG MONTAGU_GIT_ID="UNKNOWN"
FROM vimc/montagu-api-shared-build-env:$MONTAGU_GIT_ID

CMD ./gradlew :validateSchema -i
