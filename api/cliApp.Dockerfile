FROM montagu-api-build-environment

RUN ./gradlew :userCli:installDist

ENTRYPOINT ["./userCLI/build/install/userCLI/bin/userCLI"]
