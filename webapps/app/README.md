**Ensure that the following commands are all run from the app folder.**

# Development

1. Install Node.js:
   ```
   curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
2. Run `npm install` to get dependencies
3. Run `npm install webpack@4.30.0 --global` to install webpack
4. Run `webpack` to build, or `webpack --watch` to continuously monitor files
   and rebuild as needed.
5. Run `npm run SHORT_NAME` to run a development server serving one of the three
   portals on port 5000.
6. Run `./scripts/run-development-dependencies.sh` to run Montagu
   with a shared key, and with test data.

## Generating Typescript classes from Kotlin classes
This repo shares [montagu-webmodels](https://github.com/vimc/montagu-webmodels) as a submodule with
[montagu-api](https://github.com/vimc/montagu-api). When new Kotlin classes are added to `montagu-webmodels`, we
can generate Typescript interfaces to match them by doing the following:

1. Make sure the latest version of the models repo is checked out here:
 `cd app/src/webmodels/models && git checkout master && git pull`
1. Add any new models you want to include in the generation to the Kotlin tool, in the
 [`GenerateTypeDefinitions` class](src/webmodels/generate/src/main/kotlin/org/vaccineimpact/api/GenerateTypeDefinitions.kt)
1. Run the tool to generate new Typescript interfaces: `npm run generate-models`

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
`npm run integration-test` runs all integration tests. The version of
the API that tests are run against is stored in `./config/api_version`. 

*NB be wary about running integration tests directly in your local dev environment. We have scripts which set up some 
necessary environment variables for accessing the montagu db. Use `run-integration-tests-with-apis.sh` instead.*

The integration tests get run in three different ways:

1. During development, with `run-integration-tests-with-apis.sh`, which also runs dependencies and sets environment variables
used by postgres for accessing the montagu db.
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

# User permissions

Users can access some areas of the admin portal dependent on the permissions they possess. Raw user permissions from the [Montagu
database](https://github.com/vimc/montagu-db) are converted into properties on the `AuthState` interface, indicating what
the user is allowed to do in the portals. These properties are used by the components to determine whether links and
controls should be shown to the user. In addition, the [Montagu API](https://github.com/vimc/montagu-api) will prevent 
the user taking any actions for which they do not have permissions.

The `AuthState` properties, and their corresponding permissions are:

| Property | Permission | Used in
| --- | --- | --- |
| `canDownloadCoverage` | `*/coverage.read` | Touchstone scenarios page
| `canUploadCoverage` | `*/coverage.write` | Touchstone coverage upload page
| `canViewGroups` | `*/modelling-groups.read` | Main menu 
| `canViewTouchstones` | `*/touchstones.read` | Main menu
| `canViewUsers` | `*/users.read` | Main Menu
| `canReadRoles` | `*/roles.read` | User details page
| `canWriteRoles` | `*/roles.write` | User details page
| `canCreateUsers` | `*/users.create` | Users page (CreateUsersSection component)
| `canCreateModellingGroups` | `*/modelling-groups.write` | Modelling Groups page (CreateModellingGroupSection component)
| `canManageGroupMembers` | `*/modelling-groups.manage-members` | Modelling Group details page (several components)
| `canReviewResponsibilities` | `*/responsibilities.review` | Touchstone responsibilities page (to view/edit annotations)
