

import {Sandbox} from "../../Sandbox";
import {responsibilitiesActionCreators} from "../../../main/contrib/actions/responsibilitiesActionCreators";
import {ResponsibilitiesService} from "../../../main/contrib/services/ResponsibilitiesService";
import {ResponsibilitiesTypes} from "../../../main/contrib/actionTypes/ResponsibilitiesTypes";
import {createMockContribStore} from "../../mocks/mockStore";
import {mockModellingGroup, mockResponsibilitySetWithExpectations, mockTouchstone} from "../../mocks/mockModels";
import {mapStateToPropsHelper} from "../../../main/contrib/helpers/mapStateToPropsHelper";
import {ExtendedResponsibilitySet} from "../../../main/contrib/models/ResponsibilitySet";

describe("Responsibilities actions tests", () => {
    const sandbox = new Sandbox();

    const testTouchstone = mockTouchstone();
    const testTouchstoneVersion = testTouchstone.versions[0];
    const testGroup = mockModellingGroup();
    const testResponsibilitySet = mockResponsibilitySetWithExpectations();
    const testExtResponsibilitySet = new ExtendedResponsibilitySet(testResponsibilitySet, testTouchstoneVersion, testGroup);
    const testScenarioId = testExtResponsibilitySet.responsibilities[0].scenario.id;
    const testResponsibility = testExtResponsibilitySet.responsibilities[0];

    afterEach(() => {
        sandbox.restore();
    });

    it("clears cache for responsibility set", (done) => {
        const store = createMockContribStore({
            groups: { currentUserGroup: testGroup },
            touchstones: { currentTouchstoneVersion: testTouchstoneVersion }
        });
        sandbox.setStubFunc(ResponsibilitiesService.prototype, "clearCacheForResponsibilities", ()=>{
          return Promise.resolve();
        });
        store.dispatch(responsibilitiesActionCreators.clearCacheForResponsibilitySet());
        setTimeout(() => {
            const actions = store.getActions();
            expect(actions).toEqual([]);
            done();
        });
    });

    it("gets responsibility set", (done) => {
        const store = createMockContribStore({
            groups: { currentUserGroup: testGroup },
            touchstones: { currentTouchstoneVersion: testTouchstoneVersion }
        });
        sandbox.setStubFunc(ResponsibilitiesService.prototype, "getResponsibilities", ()=>{
            return Promise.resolve(testResponsibilitySet);
        });
        store.dispatch(responsibilitiesActionCreators.getResponsibilitySet());
        setTimeout(() => {
            const actions = store.getActions();
            const expectedPayload = { type: ResponsibilitiesTypes.SET_RESPONSIBILITIES, data: testExtResponsibilitySet};
            expect(actions).toEqual([expectedPayload]);
            done();
        });
    });

    it("sets current responsibility set", (done) => {
        const store = createMockContribStore({
            responsibilities: {responsibilitiesSet: testExtResponsibilitySet}
        });
        store.dispatch(responsibilitiesActionCreators.setCurrentResponsibility(testScenarioId));
        setTimeout(() => {
            const actions = store.getActions();
            const expectedPayload = { type: ResponsibilitiesTypes.SET_CURRENT_RESPONSIBILITY, data: testResponsibility};
            expect(actions).toEqual([expectedPayload]);
            done();
        });
    });

    it("refresh responsibilities", (done) => {
        const store = createMockContribStore({
            groups: { currentUserGroup: testGroup },
            touchstones: { currentTouchstoneVersion: testTouchstoneVersion },
            responsibilities: {
                currentResponsibility: testResponsibility,
                responsibilitiesSet: testExtResponsibilitySet
            }
        });
        sandbox.setStubFunc(ResponsibilitiesService.prototype, "clearCacheForResponsibilities", ()=>{
            return Promise.resolve();
        });
        sandbox.setStubFunc(ResponsibilitiesService.prototype, "getResponsibilities", ()=>{
            return Promise.resolve(testResponsibilitySet);
        });
        sandbox.setStubFunc(mapStateToPropsHelper, "getResponsibilityIds", ()=>{
            return {groupId: "g-1", touchstoneId: "t-1", scenarioId: "s-1", estimateSetId: "e-1"};
        });
        store.dispatch(responsibilitiesActionCreators.refreshResponsibilities());
        setTimeout(() => {
            const actions = store.getActions();
            const expectedPayload = [
                { type: ResponsibilitiesTypes.SET_RESPONSIBILITIES, data: testExtResponsibilitySet},
                { type: ResponsibilitiesTypes.SET_CURRENT_RESPONSIBILITY, data: testResponsibility},
            ];
            expect(actions).toEqual(expectedPayload);
            done();
        });
    });
});