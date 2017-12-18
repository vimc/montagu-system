FROM montagu-api-build-environment

RUN echo "docker" > config/current_user
RUN ./gradlew :generateTestData:installDist
RUN ./gradlew :userCLI:installDist

ENTRYPOINT ["bash", "./generateTestData/generate.sh"]
