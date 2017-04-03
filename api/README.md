# Montagu API
This is a Kotlin application. I use IntelliJ IDEA to develop it. The build system is Gradle.

## Docker build
This is what the CI system does:

1. `./scripts/make-build-env.sh` - This builds a Docker image that contains OpenJDK, Gradle and the source files
2. `./scripts/run-build.sh` - Within that built docker image it compiles the code, runs the unit tests, and builds a second Docker image. This second Docker image contains the compiled code and a Java Runtime Environment.

## Docker run
Do make use of a built image, run:

    docker pull fi--didelx05.dide.ic.ac.uk:5000/montagu-api:master
    docker run --rm -p 8080:8080 fi--didelx05.dide.ic.ac.uk:5000/montagu-api:master

Subsitute a different branch or 7-character commit hash in place of 'master' to get a different version.


