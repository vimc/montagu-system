import { addTeamCityHooks } from "./TeamCityIntegration";
import { mockFetcherResponse } from "./mocks/mockRemote";

addTeamCityHooks();

before(() => {
    mockFetcherResponse();
});