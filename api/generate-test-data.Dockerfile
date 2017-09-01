FROM montagu-api-build-environment

RUN ./gradlew :generateTestData:installDist
RUN ./gradlew :userCLI:installDist

ENTRYPOINT ["bash", "./generateTestData/generate.sh"]
