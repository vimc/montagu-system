import {expect} from "chai";

import {Sandbox} from "../../../Sandbox";
import {createMockContribStore} from "../../../mocks/mockStore";
import {
    mockBreadcrumbs,
    mockDisease,
    mockModellingGroup,
    mockModelRunParameterSet,
    mockResponsibilitySetWithExpectations,
    mockTouchstone
} from "../../../mocks/mockModels";
import {ExtendedResponsibilitySet} from "../../../../main/contrib/models/ResponsibilitySet";
import {modelRunParametersPageActionCreators} from "../../../../main/contrib/actions/pages/modelRunParametersPageActionCreators";
import {RunParametersService} from "../../../../main/contrib/services/RunParametersService";
import {RunParametersTypes} from "../../../../main/contrib/actionTypes/RunParametersTypes";
import {TouchstonesState} from "../../../../main/contrib/reducers/contribTouchstonesReducer";
import {responsibilityOverviewPageActionCreators} from "../../../../main/contrib/actions/pages/responsibilityOverviewPageActionCreators";
import {mockContribState} from "../../../mocks/mockStates";

describe("Model Run Parameters Page actions tests", () => {
    const sandbox = new Sandbox();

    const testGroup = mockModellingGroup();
    const testTouchstone = mockTouchstone();
    const testTouchstoneVersion = testTouchstone.versions[0];
    const testModelRunParametersSet = mockModelRunParameterSet();

    afterEach(() => {
        sandbox.restore();
    });

    it("loads parameter sets", async () => {
        const touchstonesState: Partial<TouchstonesState> = {
            touchstones: [testTouchstone],
            currentTouchstoneVersion: testTouchstoneVersion
        };
        const store = createMockContribStore(mockContribState({
            auth: {modellingGroups: testGroup.id},
            groups: {userGroups: [testGroup], currentUserGroup: testGroup},
            touchstones: touchstonesState
        }));

        sandbox.setStubFunc(RunParametersService.prototype, "getParameterSets", () => {
            return Promise.resolve([testModelRunParametersSet]);
        });

        await store.dispatch(modelRunParametersPageActionCreators
            .loadData({groupId: testGroup.id, touchstoneId: testTouchstoneVersion.id}));

        const actions = store.getActions();

        const expectedPayload = [
            {type: RunParametersTypes.RUN_PARAMETERS_SETS_FETCHED, data: [testModelRunParametersSet]}
        ];
        expect(actions).to.eql(expectedPayload);

    });

    it("creates breadcrumb", async () => {
        const touchstonesState: Partial<TouchstonesState> = {
            touchstones: [testTouchstone],
            currentTouchstoneVersion: testTouchstoneVersion
        };
        const state = mockContribState({
            auth: {modellingGroups: testGroup.id},
            groups: {userGroups: [testGroup], currentUserGroup: testGroup},
            touchstones: touchstonesState
        });

        const breadcrumb = modelRunParametersPageActionCreators.createBreadcrumb(state);
        expect(breadcrumb).to.eql({name: "Upload parameters", urlFragment: "parameters/"});
    });

    it("has responsibilities overview as parent", () => {
        expect(modelRunParametersPageActionCreators.parent).to.eq(responsibilityOverviewPageActionCreators);
    });

});