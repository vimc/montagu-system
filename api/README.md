# Montagu API

[![Build Status](https://badge.buildkite.com/172ef7d0efc887cb5810989791106d1741337d407ada9c97dc.svg?branch=master)](https://buildkite.com/mrc-ide/montagu-api)
[![codecov](https://codecov.io/gh/vimc/montagu-api/branch/master/graph/badge.svg)](https://codecov.io/gh/vimc/montagu-api)

## Running the app locally
System requirements:
* openjdk 8
* Docker

Install Docker and add your user to the Docker group (e.g. https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-16-04.) You may need to restart your machine for changes to take effect.

Configure your Docker client to use our registry by following instructions here:
https://github.com/vimc/montagu-ci#configuring-docker-clients-to-use-the-registry

Start the dependencies (the database and orderly web) by navigating to the `src` folder and running

    ./gradlew :startDatabase
    ./gradlew :startOrderlyWeb

Run the app

    ./gradlew :run
   
## Generating a root token
For use with the Ebola work, we wanted to be able to run the [reporting API](https://github.com/vimc/montagu-reporting-api)
without this main API. To circumvent the normal authorization, we added a mode
that allows you to run generate a root token with a 1 year expiry that gives 
access to all reports. This can then be hardcoded into the reporting portal and
any other code that needs access to this API-less version of Montagu.

To generate, first create a keypair at some TOKEN_KEY_PATH and then run:

```
docker run --rm \
    -v $TOKEN_KEY_PATH:/etc/montagu/api/token_key \
    docker.montagu.dide.ic.ac.uk:5000/montagu-api:$MONTAGU_API_VERSION \
    generate-token */can-login */reports.read */reports.review
```

The reporting API needs to be run with the public key from the keypair.

## Running tests
To run the Blackbox tests, you will need to start the dependencies and run the app as described above.
 Note that if you want to run individual tests through IntelliJ, you will need to manually run the `copySpec` Gradle task first.

To run Blackbox tests from the command line, after running the above 2 commands, from the same folder run

     ./gradlew :blackboxTests:run

## Upgrading dependencies
Run `./gradlew dependencyUpdates` and then manually update as required.

## Project anatomy
At the top level we have four folders of note:
* `buildkite/`: Contains a Buildkite pipeline along with scripts for testing and building the API and CLI.
* `docker/`: Contains docker files for images used in testing and compiling. None of these files is for the API
image itself, which is created via the Gradle `distDocker` task.
* `docs/`: The formal API specification. The API must conform to this. Developers writing clients use this.
* `scripts/`: Shell scripts used to run dependencies for local development or on CI.
* `src/`: The source code of the application and its tests and helpers
* `demo/`: The proof-of-concept API demo developed for the 2017 annual VIMC conference

### Source code
This is a Kotlin application. I use IntelliJ IDEA to develop it. The build system is Gradle. The root Gradle files are `src/build.gradle` and `src/settings.gradle`.

They define the following subprojects:
* `app/`: This contains the main code of the application that serves the API over HTTP. It contains a high-level database interface that wraps around the low-level `databaseInterface` project. It also (in `app/src/test`) contains unit tests.
* `databaseInterface/`: This contains the code for low-level interactions with the database, using jOOQ. It is largely generated Java code, with a few Kotlin classes that act as helpers.
* `generateDatabaseInterface/`: This is a very small program that is disjoint with this rest of the codebase (nothing depends on it, it depends on nothing). It invokes jOOQ's code generation to generate the Java classes in `databaseInterface`.
* `testHelpers/`: Code shared between the three kinds of tests.
* `databaseTests/`: In addition to the unit tests that run with no IO and no dependencies, we also have `databaseTests`. These use `databaseInterface` to set up the database in known states, and then test that the high-level repository layer 
 reads from or mutates the database state in the expected way. These could be considered a partial integration test: Checking integration with the database, but not actually running the API.
* `blackboxTests/`: The final kind of test is a full integration test. We run both a database and the API. We then use separate Kotlin code to interact with the API as a client and check that the results conform to the spec.
 Note that we again use the low-level `databaseInterface` to set up the database in a known state. Note that CI first runs the unit and database tests, and then pushes the app image to Dockerhub.
  In the last build step it actually uses this built image and runs the tests against the containerised API.

## CI build
This is what the CI system does:

1. `./buildkite/make-build-env.sh` - This builds a Docker image that contains OpenJDK, Gradle, Libsodium and the source files
1. `./buildkite/check-schema.sh` - Inside the Dockerised build environment, runs the `/gradlew :validateSchema` task
1. `./buildkite/generate-test-data.sh` - Builds an image that executes `./generateTestData/generate.sh` when run. This is used 
in the [Montagu-Webapps](https://github.com/vimc/montagu-webapps/) project for local development. 
1. `./buildkite/build-app.sh` - Inside the Dockerised build environment, tests, builds and dockerises the app.
1. `./buildkite/build-cli.sh` - Similar to previous step, but builds an image containing the [command line tool](#CLI).
1. `./buildkite/run-blackbox-tests.sh` - Creates and image that runs `/gradlew :blackboxTests:test`, 
runs the image to actually run tests, then tags and pushes that image to docker hub for reuse in the
 [deploy tool](https://github.com/vimc/montagu/) build.           
 
Each script corresponds to one build step and is responsible for bringing up and tearing down any dependencies needed 
for testing in that step.  
 
## CLI
The CLI is used for adding users and permissions. It is used for testing, in this repo and others, and by the 
[deploy tool](https://github.com/vimc/montagu/). 

## Docker run
To make use of a built image, run:

    docker pull vimc/montagu-api:master
    docker run --rm -p 8080:8080 vimc/montagu-api:master

Subsitute a different branch or 7-character commit hash in place of 'master' to get a different version.


