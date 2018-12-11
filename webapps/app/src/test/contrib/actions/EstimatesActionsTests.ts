import {expect} from "chai";

import {Sandbox} from "../../Sandbox";
import {estimatesActionCreators} from "../../../main/contrib/actions/estimatesActionCreators";
import {EstimatesService} from "../../../main/contrib/services/EstimatesService";
import {ResponsibilitiesService} from "../../../main/contrib/services/ResponsibilitiesService";
import {createMockContribStore} from "../../mocks/mockStore";
import {mapStateToPropsHelper} from "../../../main/contrib/helpers/mapStateToPropsHelper";
import {mockModellingGroup, mockResponsibilitySetWithExpectations, mockTouchstone} from "../../mocks/mockModels";
import {ExtendedResponsibilitySet} from "../../../main/contrib/models/ResponsibilitySet";
import {ResponsibilitiesTypes} from "../../../main/contrib/actionTypes/ResponsibilitiesTypes";
import {CreateBurdenEstimateSet} from "../../../main/shared/models/Generated";
import {BurdenOutcome, EstimateTypes} from "../../../main/contrib/actionTypes/EstimateTypes";

describe("Estimates actions tests", () => {
    const sandbox = new Sandbox();

    const testTouchstone = mockTouchstone();
    const testTouchstoneVersion = testTouchstone.versions[0];
    const testGroup = mockModellingGroup();
    const testResponsibilitySet = mockResponsibilitySetWithExpectations();
    const testExtResponsibilitySet = new ExtendedResponsibilitySet(testResponsibilitySet, testTouchstoneVersion, testGroup);
    const testResponsibility = testExtResponsibilitySet.responsibilities[0];

    const createStore = () => {
     return  createMockContribStore({
         groups: { currentUserGroup: testGroup },
         touchstones: { currentTouchstoneVersion: testTouchstoneVersion },
         responsibilities: {
             currentResponsibility: testResponsibility,
             responsibilitiesSet: testExtResponsibilitySet
         }
     });
    };

    afterEach(() => {
        sandbox.restore();
    });

    it("gets burden estimates", async () => {

        const store = createStore();
        const getEstimatesEndpoint = sandbox.setStubFunc(EstimatesService.prototype, "getEstimates", ()=>{
            return Promise.resolve("TEST");
        });

        await store.dispatch(estimatesActionCreators.getEstimates(BurdenOutcome.DEATHS, 1));

        const actions = store.getActions();
        const expectedPayload = [
            { type: EstimateTypes.BURDEN_ESTIMATES_FETCHED, data: "TEST"}
        ];
        expect(actions).to.eql(expectedPayload);
        expect(getEstimatesEndpoint.calledOnce).to.be.true;

    });

    it("creates burden", (done) => {
        const store = createStore();
        const createBurdenEndpoint = sandbox.setStubFunc(EstimatesService.prototype, "createBurden", ()=>{
            return Promise.resolve();
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

        const data: CreateBurdenEstimateSet = {
            type: {
                type: "central-averaged",
                details: "test"
            },
            model_run_parameter_set: null
        };

        store.dispatch(estimatesActionCreators.createBurden(data));
        setTimeout(() => {
            const actions = store.getActions();
            const expectedPayload = [
                { type: ResponsibilitiesTypes.SET_RESPONSIBILITIES, data: testExtResponsibilitySet},
                { type: ResponsibilitiesTypes.SET_CURRENT_RESPONSIBILITY, data: testResponsibility}
            ];
            expect(actions).to.eql(expectedPayload);
            expect(createBurdenEndpoint.calledOnce).to.be.true;
            done();
        });
    });

});