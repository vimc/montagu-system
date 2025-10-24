**Ensure that the following commands are all run from the app folder.**

# Development

1. Use node 12:
   ```
   nvm install 12
   ```
2. Run `npm install` to get dependencies
3. Run `npm install webpack@v4.30.0 webpack-cli@3.3.0 --global` to install webpack
4. To run all dependencies and both web apps in docker, run `dev-run.sh` from `app/scripts`.

Login to montagu at `https://localhost` with `test.user@example.com` and `password` and browse to the portals. 

You can set the version (branch or SHA) of dependencies to use in the `config` folder before running `dev-run.sh`.

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

Run integration tests locally with `scripts/run-integration-tests.sh`, having first run `scripts/dev-run.sh` to start
all containers. 

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
database](/db) are converted into properties on the `AuthState` interface, indicating what
the user is allowed to do in the portals. These properties are used by the components to determine whether links and
controls should be shown to the user. In addition, the [Montagu API](/api) will prevent 
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
