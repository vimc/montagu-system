# Montagu API

[![Build Status](https://badge.buildkite.com/172ef7d0efc887cb5810989791106d1741337d407ada9c97dc.svg?branch=master)](https://buildkite.com/mrc-ide/montagu-api)
[![codecov](https://codecov.io/gh/vimc/montagu-api/branch/master/graph/badge.svg)](https://codecov.io/gh/vimc/montagu-api)

## Running the app locally
System requirements:
* openjdk 11
* Docker

Install Docker and add your user to the Docker group (e.g. https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-16-04.) You may need to restart your machine for changes to take effect.

Configure your Docker client to use our registry by following instructions here:
https://github.com/vimc/montagu-ci#configuring-docker-clients-to-use-the-registry

Run the app (in docker) and all dependencies using `./dev-run.sh` in the `scripts` folder. 

For historical reasons you can also run the app (outside docker) from the `src` folder, but will need to make sure
a dockerised api is not also trying to use port 8080:

    ./gradlew :run
  
## Running tests
To run all unit and integration tests, start app and dependencies as described above, then from `src` folder run 
    
    ./gradlew :testLibrary

To run the Blackbox tests, start app and dependencies as described above, then from `src` folder  run

    ./gradlew :blackboxTests:test

Note that if you want to run individual tests through IntelliJ, you will need to manually run the `copySpec` Gradle task first.

## Upgrading dependencies
Run `./gradlew dependencyUpdates` and then manually update as required.

## Project anatomy
At the top level we have four folders of note:
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

CI for this project is done through the [API Build and Test](/.github/workflows/api.yml) github action, which: 
- builds and pushes docker images to ghcr.io for the API and CLI
- runs the API image and all dependencies
- smoke tests the CLI
- runs unit and integration tests
- runs blackbox tests
 
## CLI
The CLI is used for adding users and permissions. It is useful for testing, but should not normally be required on 
production montagu systems, where there is a web interface for user management.

## Burden estimate upload notifications

See [KB article](https://mrc-ide.myjetbrains.com/youtrack/articles/VIMC-A-55/Burden-estimate-upload-notifications) for further details of this feature
