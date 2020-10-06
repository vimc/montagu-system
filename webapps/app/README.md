**Ensure that the following commands are all run from the app folder.**

# Development

1. Install Node.js:
   ```
   curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
2. Run `npm install` to get dependencies
3. Run `sudo npm install webpack@3.10.0 --global` to install webpack
4. Run `webpack` to build, or `webpack --watch` to continuously monitor files
   and rebuild as needed.
5. Run `npm run SHORT_NAME` to run a development server serving one of the three
   portals on port 5000.
6. Run `./scripts/run-development-dependencies.sh` to run Montagu
   with a shared key, and with test data.

## Linting
1. `npm run tslint` to see all tslint errors
2. Optionally you can enable tslint plugin in your IDE to see errors in code (for Webstorm users:
open Preferences > Languages & frameworks > Typescript > Tslint -> Enable)
If you need more rules to check against, add them in file tslint.json, under section rules.

# Testing
1. `npm test` runs all the tests
2. `npm test Foo` runs all tests in files with names that match "Foo".
3. `npm test -- -t "foo bar"` runs just the individual test called "foo bar".

## Integration tests
Run `npm run integration-test` to run all integration tests. The version of
the API that tests are run against is stored in `./config/api_version`.

The integration tests get run in three different ways:

1. During development, using the method above.
2. During the Webapp BuildKite build configuration. This runs the tests in
   exactly the same way, but does so inside a Docker container that gives a
   consistent build environment. Additionally, during this same build, another
   Docker image is built that can be used to run the integration tests
   separately from the Webapp build environment.
3. This reusable image is used in the Montagu TeamCity build configuration. It
   is slightly different, in that it is running as part of a Docker network, and
   so connects to the API and database at different URLs (e.g. `api` as
   opposed to `localhost`). Also, because we want the ability for the portals to
   be pinned at different versions, we run the integration test container once
   per portal, running just the subset of tests applicable to that portal, and
   using (potentially) a different version of the image each time.

# Dockerised build & run
1. Make a containerised build environment: `scripts/make-build-env.sh`
2. Use the build environment to build (and push) the two containerised apps: `scripts/run-build.sh`
3. Run a containerised app:
    ```
    docker run -p 8080:80 vimc/montagu-contrib-portal:CURRENT_GIT_BRANCH

    ```
   or

    ```
    docker run -p 8080:80 vimc/montagu-admin-portal:CURRENT_GIT_BRANCH

    ```
4. Browse to `http://localhost:8080/`

# Portals
There are 2 portals.

## Modellers' contribution portal
Short name: `contrib`

This portal allows modellers to download coverage and other input data,
and then upload burden estimates.

## Admin portal
Short name: `admin`

This portal allows administrative staff to set up touchstones with all the
necessary input data, responsibilities and recipes. It's also where we do user
management.
