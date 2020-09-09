ARG MONTAGU_GIT_ID="UNKNOWN"
FROM vimc/montagu-api-build-environment:$MONTAGU_GIT_ID

CMD ./gradlew :validateSchema -i
