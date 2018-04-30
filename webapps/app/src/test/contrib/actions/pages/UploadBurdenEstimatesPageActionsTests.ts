import { expect } from "chai";

import { Sandbox } from "../../../Sandbox";
import {createMockStore} from "../../../mocks/mockStore";
import {ModellingGroupsService} from "../../../../main/shared/services/ModellingGroupsService";
import {ModellingGroupTypes} from "../../../../main/contrib/actionTypes/ModellingGroupsTypes";
import {BreadcrumbsTypes} from "../../../../main/shared/actionTypes/BreadrumbsTypes";
import {breadcrumbsModule} from "../../../../main/shared/modules/breadcrumbs";
import {
    mockBreadcrumbs, mockBurdenEstimateSet, mockDisease, mockModellingGroup, mockResponsibilitySet,
    mockTouchstone
} from "../../../mocks/mockModels";
import {TouchstonesService} from "../../../../main/contrib/services/TouchstonesService";
import {TouchstoneTypes} from "../../../../main/contrib/actionTypes/TouchstonesTypes";
import {DiseasesService} from "../../../../main/contrib/services/DiseasesService";
import {ResponsibilitiesService} from "../../../../main/contrib/services/ResponsibilitiesService";
import {DiseasesTypes} from "../../../../main/contrib/actionTypes/DiseasesTypes";
import {ResponsibilitiesTypes} from "../../../../main/contrib/actionTypes/ResponsibilitiesTypes";
import {ExtendedResponsibilitySet} from "../../../../main/contrib/models/ResponsibilitySet";
import {uploadBurdenEstimatesPageActionCreators} from "../../../../main/contrib/actions/pages/uploadBurdenEstimatesPageActionCreators";
import {EstimatesService} from "../../../../main/contrib/services/EstimatesService";
import {EstimatesTypes} from "../../../../main/contrib/actionTypes/EstimatesTypes";

describe("Responsibility Overview Page actions tests", () => {
    const sandbox = new Sandbox();

    const testGroup = mockModellingGroup();
    const testBreadcrumbs = mockBreadcrumbs();
    const testTouchstone = mockTouchstone({id: "touchstone-1"});
    const testDisease = mockDisease();
    const testResponsibilitySet = mockResponsibilitySet();
    const testExtResponsibilitySet = new ExtendedResponsibilitySet(testResponsibilitySet, testTouchstone, testGroup);
    const testBurdenEstimateSet = mockBurdenEstimateSet();
    const testResponsibility = testResponsibilitySet.responsibilities[0];
    const testResponsibilityWithEstimate = {...testResponsibility, current_estimate_set: testBurdenEstimateSet}
    const testScenario = testResponsibility.scenario;

    afterEach(() => {
        sandbox.restore();
    });

    it("on load", (done) => {
        const initialState = {
            auth: {modellingGroups: testGroup.id},
            groups: {userGroups: [testGroup], currentUserGroup: testGroup},
            touchstones: {touchstones: [testTouchstone], currentTouchstone: testTouchstone},
            responsibilities: {
                responsibilitiesSet: testResponsibilitySet,
                currentResponsibility: testResponsibilityWithEstimate
            },
            estimates: {
                redirectPath: '/test/'
            }
        };
        const store = createMockStore(initialState);

        sandbox.setStubFunc(ModellingGroupsService.prototype, "getAllGroups", ()=>{
            return Promise.resolve([testGroup]);
        });
        sandbox.setStubFunc(TouchstonesService.prototype, "getTouchstonesByGroupId", ()=>{
            return Promise.resolve([testTouchstone]);
        });
        sandbox.setStubFunc(DiseasesService.prototype, "getAllDiseases", ()=>{
            return Promise.resolve([testDisease]);
        });
        sandbox.setStubFunc(ResponsibilitiesService.prototype, "getResponsibilities", ()=>{
            return Promise.resolve(testResponsibilitySet);
        });
        sandbox.setStubFunc(EstimatesService.prototype, "getOneTimeToken", ()=>{
            return Promise.resolve('test-token');
        });
        sandbox.setStubFunc(breadcrumbsModule, "initialize", ()=>{
            return testBreadcrumbs;
        });

        store.dispatch(uploadBurdenEstimatesPageActionCreators
            .onLoad({groupId: testGroup.id, touchstoneId: testTouchstone.id, scenarioId: testScenario.id}));

        setTimeout(() => {
            const actions = store.getActions();

            const expectedPayload = [
                { type: ModellingGroupTypes.USER_GROUPS_FETCHED, data: [testGroup] },
                { type: ModellingGroupTypes.SET_CURRENT_USER_GROUP, data: testGroup },
                { type: TouchstoneTypes.TOUCHSTONES_FETCHED, data: [testTouchstone]},
                { type: DiseasesTypes.DISEASES_FETCHED, data: [testDisease]},
                { type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE, data: testTouchstone},
                { type: ResponsibilitiesTypes.SET_RESPONSIBILITIES, data: testExtResponsibilitySet},
                { type: ResponsibilitiesTypes.SET_CURRENT_RESPONSIBILITY, data: testResponsibility},
                { type: EstimatesTypes.ESTIMATES_ONE_TIME_TOKEN_CLEAR},
                { type: EstimatesTypes.ESTIMATES_ONE_TIME_TOKEN_FETCHED, data: "test-token"},
                { type: BreadcrumbsTypes.BREADCRUMBS_RECEIVED, data: testBreadcrumbs },
            ];
            expect(actions).to.eql(expectedPayload);
            done();
        });
    });



});