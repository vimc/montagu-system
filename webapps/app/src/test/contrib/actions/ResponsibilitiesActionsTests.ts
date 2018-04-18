import { expect } from "chai";

import { Sandbox } from "../../Sandbox";
import { responsibilitiesActionCreators } from "../../../main/contrib/actions/responsibilitiesActionCreators";
import { ResponsibilitiesService } from "../../../main/contrib/services/ResponsibilitiesService";
import { ResponsibilitiesTypes } from "../../../main/contrib/actionTypes/ResponsibilitiesTypes";
import {createMockStore} from "../../mocks/mockStore";
import {mockModellingGroup, mockResponsibilitySet, mockTouchstone} from "../../mocks/mockModels";
import {statePropsMapHelper} from "../../../main/contrib/helpers/statePropsMapHelper";
import {EstimatesTypes} from "../../../main/contrib/actionTypes/EstimatesTypes";
import {EstimatesService} from "../../../main/contrib/services/EstimatesService";
import {ExtendedResponsibilitySet} from "../../../main/contrib/models/ResponsibilitySet";

describe("Responsibilities actions tests", () => {
    const sandbox = new Sandbox();

    const testTouchstone = mockTouchstone();
    const testGroup = mockModellingGroup();
    const testResponsibilitySet = mockResponsibilitySet();
    const testExtResponsibilitySet = new ExtendedResponsibilitySet(testResponsibilitySet, testTouchstone, testGroup);
    const testScenarioId = testExtResponsibilitySet.responsibilities[0].scenario.id;
    const testResponsibility = testExtResponsibilitySet.responsibilities[0];

    afterEach(() => {
        sandbox.restore();
    });

    it("clears cache for responsibility set", (done) => {
        const store = createMockStore({
            groups: { currentUserGroup: testGroup },
            touchstones: { currentTouchstone: testTouchstone }
        });
        sandbox.setStubFunc(ResponsibilitiesService.prototype, "clearCacheForResponsibilities", ()=>{
          return Promise.resolve();
        });
        store.dispatch(responsibilitiesActionCreators.clearCacheForResponsibilitySet());
        setTimeout(() => {
            const actions = store.getActions()
            expect(actions).to.eql([])
            done();
        });
    });

    it("gets responsibility set", (done) => {
        const store = createMockStore({
            groups: { currentUserGroup: testGroup },
            touchstones: { currentTouchstone: testTouchstone }
        });
        sandbox.setStubFunc(ResponsibilitiesService.prototype, "getResponsibilities", ()=>{
            return Promise.resolve(testResponsibilitySet);
        });
        store.dispatch(responsibilitiesActionCreators.getResponsibilitySet());
        setTimeout(() => {
            const actions = store.getActions();
            const expectedPayload = { type: ResponsibilitiesTypes.SET_RESPONSIBILITIES, data: testExtResponsibilitySet};
            expect(actions).to.eql([expectedPayload]);
            done();
        });
    });

    it("sets current responsibility set", (done) => {
        const store = createMockStore({
            responsibilities: {responsibilitiesSet: testExtResponsibilitySet}
        });
        store.dispatch(responsibilitiesActionCreators.setCurrentResponsibility(testScenarioId));
        setTimeout(() => {
            const actions = store.getActions();
            const expectedPayload = { type: ResponsibilitiesTypes.SET_CURRENT_RESPONSIBILITY, data: testResponsibility};
            expect(actions).to.eql([expectedPayload]);
            done();
        });
    });

    it("refresh responsibilities", (done) => {
        const store = createMockStore({
            groups: { currentUserGroup: testGroup },
            touchstones: { currentTouchstone: testTouchstone },
            responsibilities: {
                currentResponsibility: testResponsibility,
                responsibilitiesSet: testExtResponsibilitySet
            },
            estimates: {
                redirectPath: '/test/'
            }
        });
        sandbox.setStubFunc(ResponsibilitiesService.prototype, "clearCacheForResponsibilities", ()=>{
            return Promise.resolve();
        });
        sandbox.setStubFunc(ResponsibilitiesService.prototype, "getResponsibilities", ()=>{
            return Promise.resolve(testResponsibilitySet);
        });
        sandbox.setStubFunc(EstimatesService.prototype, "getOneTimeToken", ()=>{
            return Promise.resolve('test-token');
        });
        sandbox.setStubFunc(statePropsMapHelper, "getResponsibilityIds", ()=>{
            return {groupId: "g-1", touchstoneId: "t-1", scenarioId: "s-1", estimateSetId: "e-1"};
        });
        store.dispatch(responsibilitiesActionCreators.refreshResponsibilities());
        setTimeout(() => {
            const actions = store.getActions();
            const expectedPayload = [
                { type: ResponsibilitiesTypes.SET_RESPONSIBILITIES, data: testExtResponsibilitySet},
                { type: ResponsibilitiesTypes.SET_CURRENT_RESPONSIBILITY, data: testResponsibility},
                { type: EstimatesTypes.ESTIMATES_ONE_TIME_TOKEN_CLEAR},
                { type: EstimatesTypes.ESTIMATES_ONE_TIME_TOKEN_FETCHED, data: 'test-token' }
            ];
            expect(actions).to.eql(expectedPayload);
            done();
        });
    });
});