FROM montagu-api-build-environment

CMD ./gradlew :validateSchema -i
