ARG MONTAGU_GIT_ID="UNKNOWN"
FROM vimc/montagu-api-build-environment:$MONTAGU_GIT_ID

RUN echo "docker" > config/current_user
RUN ./gradlew :generateTestData:installDist
RUN ./gradlew :userCLI:installDist

ENTRYPOINT ["bash", "./generateTestData/generate.sh"]
