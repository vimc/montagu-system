// These settings are used when the integration tests are run from within
// a Docker container as part of the main Montagu repo's TeamCity build.
//
// When the integration tests are run outside their own Docker container,
// as part of the webapp TeamCity build, the "teamcity" settings file is
// used, same as the unit tests.
export const settings: Partial<Settings> = {
    apiUrl: () => "http://api:8080/v1",
    teamcityServiceMessages: true,
};