import 'babel-polyfill';
import { addTeamCityHooks } from "./TeamCityIntegration";
import { mockFetcherResponse } from "./mocks/mockRemote";

import * as enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-15";
enzyme.configure({ adapter: new Adapter() });

addTeamCityHooks();

before(() => {
    mockFetcherResponse();
});