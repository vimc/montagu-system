import { expect } from "chai";

import { Sandbox } from "../../Sandbox";
import { coverageActionCreators } from "../../../main/contrib/actions/coverageActionCreators";
import { CoverageService } from "../../../main/contrib/services/CoverageService";
import {Coverage, CoverageTypes} from "../../../main/contrib/actionTypes/CoverageTypes";
import {createMockStore} from "../../mocks/mockStore";
import {mockCoverageSet, mockDemographicDataset, mockScenario, mockTouchstone} from "../../mocks/mockModels";
import {ScenarioAndCoverageSets} from "../../../main/shared/models/Generated";
import {statePropsMapHelper} from "../../../main/contrib/helpers/statePropsMapHelper";

describe("Coverage actions tests", () => {
    const sandbox = new Sandbox();

    const testCoverageSet = mockCoverageSet();
    const testScenario = mockScenario();
    const testScenarioAndCoverageSet: ScenarioAndCoverageSets = {
        coverage_sets: [testCoverageSet],
        scenario: testScenario
    };

    afterEach(() => {
        sandbox.restore();
    });

    it("data sets fetched", (done) => {
        const store = createMockStore({});
        sandbox.setStubFunc(statePropsMapHelper, "getResponsibilityIds", ()=>{
            return Promise.resolve({groupId: "g1", touchstoneId: "t1", scenarioId: "s1"});
        });
        sandbox.setStubFunc(CoverageService.prototype, "getDataSets", ()=>{
            return Promise.resolve(testScenarioAndCoverageSet);
        });

        store.dispatch(coverageActionCreators.getDataSets())
        setTimeout(() => {
            const actions = store.getActions();
            const expectedPayload = { type: CoverageTypes.COVERAGE_DATA_SETS_FETCHED, data: [testCoverageSet] };
            expect(actions).to.eql([expectedPayload]);
            done();
        });
    });

    it("sets format", (done) => {
        const store = createMockStore({});
        store.dispatch(coverageActionCreators.setFormat(Coverage.SelectedFormat.long));
        setTimeout(() => {
            const actions = store.getActions();
            const expectedPayload = { type: CoverageTypes.COVERAGE_SET_FORMAT, data: "long" };
            expect(actions).to.eql([expectedPayload]);
            done();
        });
    });

    it("get one time token", (done) => {
        const store = createMockStore({
            coverage: {
                selectedFormat: Coverage.SelectedFormat.long
            }
        });
        sandbox.setStubFunc(statePropsMapHelper, "getResponsibilityIds", ()=>{
            return Promise.resolve({groupId: "g1", touchstoneId: "t1", scenarioId: "s1"});
        });
        sandbox.setStubFunc(CoverageService.prototype, "getOneTimeToken", ()=>{
            return Promise.resolve('test-token');
        });

        store.dispatch(coverageActionCreators.getOneTimeToken())
        setTimeout(() => {
            const actions = store.getActions();
            const expectedPayload = [
                { type: CoverageTypes.COVERAGE_ONE_TIME_TOKEN_CLEAR},
                { type: CoverageTypes.COVERAGE_ONE_TIME_TOKEN_FETCHED, data: 'test-token' }
            ];
            expect(actions).to.eql(expectedPayload);
            done();
        });
    });

});