import {Sandbox} from "../../../Sandbox";
import {createMockStore} from "../../../mocks/mockStore";
import {ModellingGroupsService} from "../../../../main/shared/services/ModellingGroupsService";
import {ModellingGroupTypes} from "../../../../main/admin/actionTypes/ModellingGroupsTypes";
import {mockModellingGroup, mockModellingGroupDetails, mockUser} from "../../../mocks/mockModels";
import {modellingGroupDetailsPageActionCreators} from "../../../../main/admin/actions/pages/ModellingGroupDetailsPageActionCreators";
import {UsersService} from "../../../../main/admin/services/UsersService";
import {UsersTypes} from "../../../../main/admin/actionTypes/UsersTypes";
import {modellingGroupsListPageActionCreators} from "../../../../main/admin/actions/pages/ModellingGroupsListPageActionCreators";
import {mockAdminState} from "../../../mocks/mockStates";
import DoneCallback = jest.DoneCallback;

describe("Modelling Group Details Page actions tests", () => {
    const sandbox = new Sandbox();

    const testUser = mockUser();
    const testUser2 = mockUser();
    const testGroup = mockModellingGroup({id: "g1"});
    const testGroup2 = mockModellingGroup();
    const testGroupDetails = mockModellingGroupDetails({members: [testUser.username]});
    const state = mockAdminState({
        groups: {groups: [testGroup, testGroup2], currentGroupDetails: testGroupDetails, currentGroup: testGroup},
        users: {users: [testUser, testUser2]}
    });
    const store = createMockStore(state);

    afterEach(() => {
        sandbox.restore();
    });

    it("has group list page as parent", () => {
        expect(modellingGroupDetailsPageActionCreators.parent).toEqual(modellingGroupsListPageActionCreators)
    });

    it("creates breadcrumb", () => {
        const result = modellingGroupDetailsPageActionCreators.createBreadcrumb(state);
        expect(result.name).toEqual("g1");
        expect(result.urlFragment).toEqual(`g1/`);
    });

    it("loads group members, group details and sets current group on load",
        (done: DoneCallback) => {

            const getAllUsersStub = sandbox.setStubFunc(UsersService.prototype, "getAllUsers", () => {
                return Promise.resolve([testUser, testUser2]);
            });
            const getGroupDetailsServiceStub = sandbox.setStubFunc(ModellingGroupsService.prototype, "getGroupDetails", () => {
                return Promise.resolve(testGroupDetails);
            });

            store.dispatch(modellingGroupDetailsPageActionCreators.loadData({groupId: testGroup.id}));
            setTimeout(() => {
                const actions = store.getActions();
                const expectedPayload = [
                    {type: ModellingGroupTypes.SET_CURRENT_GROUP, data: testGroup},
                    {type: UsersTypes.ALL_USERS_FETCHED, data: [testUser, testUser2]},
                    {type: ModellingGroupTypes.GROUP_DETAILS_FETCHED, data: testGroupDetails},
                    {type: ModellingGroupTypes.SET_CURRENT_GROUP_MEMBERS, data: [testUser]}
                ];
                expect(actions).toEqual(expectedPayload);
                expect(getAllUsersStub.mock.calls.length).toBe(1);
                expect(getGroupDetailsServiceStub.mock.calls.length).toBe(1);
                expect(getGroupDetailsServiceStub.mock.calls[0][0]).toEqual(testGroup.id);
                done();
            });
        }
    );

});