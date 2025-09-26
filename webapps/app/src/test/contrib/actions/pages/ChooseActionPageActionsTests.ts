

import {Sandbox} from "../../../Sandbox";
import {createMockStore} from "../../../mocks/mockStore";
import {ModellingGroupTypes} from "../../../../main/contrib/actionTypes/ModellingGroupsTypes";
import {mockModellingGroup, mockTouchstoneVersion} from "../../../mocks/mockModels";
import {chooseActionPageActionCreators} from "../../../../main/contrib/actions/pages/chooseActionPageActionCreators";
import {TouchstonesService} from "../../../../main/shared/services/TouchstonesService";
import {TouchstoneTypes} from "../../../../main/shared/actionTypes/TouchstonesTypes";
import {chooseGroupPageActionCreators} from "../../../../main/contrib/actions/pages/chooseGroupPageActionCreators";
import {mockContribState} from "../../../mocks/mockStates";

describe("Choose Action Page actions tests", () => {
    const sandbox = new Sandbox();

    const testGroup = mockModellingGroup({description: "desc", id: "g1"});
    const testTouchstone = mockTouchstoneVersion({id: "touchstone-1"});
    const initialState = mockContribState({
        auth: {modellingGroups: [testGroup.id]},
        groups: {userGroups: [testGroup], currentUserGroup: testGroup}
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("has choose group page as parent", () => {
        expect(chooseActionPageActionCreators.parent).toEqual(chooseGroupPageActionCreators)
    });

    it("creates breadcrumb", () => {

        const result = chooseActionPageActionCreators.createBreadcrumb(initialState);

        expect(result.name).toEqual("desc");
        expect(result.urlFragment).toEqual("g1/");
    });

    it("loadData set current group and loads touchstones", async () => {

        const store = createMockStore(initialState);

        sandbox.setStubFunc(TouchstonesService.prototype, "getTouchstonesByGroupId", () => {
            return Promise.resolve([testTouchstone]);
        });

        await store.dispatch(chooseActionPageActionCreators.loadData({groupId: testGroup.id}));

        const actions = store.getActions();

        const expectedPayload = [
            {type: ModellingGroupTypes.SET_CURRENT_USER_GROUP, data: testGroup},
            {type: TouchstoneTypes.TOUCHSTONES_FETCHED_FOR_GROUP, data: [testTouchstone]}
        ];
        expect(actions).toEqual(expectedPayload);

    });


});