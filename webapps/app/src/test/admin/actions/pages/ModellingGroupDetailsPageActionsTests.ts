import { expect } from "chai";

import { Sandbox } from "../../../Sandbox";
import {createMockStore} from "../../../mocks/mockStore";
import {ModellingGroupsService} from "../../../../main/shared/services/ModellingGroupsService";
import {ModellingGroupTypes} from "../../../../main/admin/actionTypes/ModellingGroupsTypes";
import {
    mockModellingGroup,
    mockModellingGroupDetails,
    mockUser
} from "../../../mocks/mockModels";
import {modellingGroupDetailsPageActionCreators} from "../../../../main/admin/actions/pages/ModellingGroupDetailsPageActionCreators";
import {UsersService} from "../../../../main/admin/services/UsersService";
import {UsersTypes} from "../../../../main/admin/actionTypes/UsersTypes";
import {modellingGroupsListPageActionCreators} from "../../../../main/admin/actions/pages/ModellingGroupsListPageActionCreators";
import {mockAdminState} from "../../../mocks/mockStates";

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

    test("has group list page as parent", () => {
        expect(modellingGroupDetailsPageActionCreators.parent).to.eq(modellingGroupsListPageActionCreators)
    });

    test("creates breadcrumb", () => {
        const result = modellingGroupDetailsPageActionCreators.createBreadcrumb(state);
        expect(result.name).to.eq("g1");
        expect(result.urlFragment).to.eq(`g1/`);
    });

    test(
        "loads group members, group details and sets current group on load",
        (done: DoneCallback) => {

            const getAllUsersStub = sandbox.setStubFunc(UsersService.prototype, "getAllUsers", ()=>{
                return Promise.resolve([testUser, testUser2]);
            });
            const getGroupDetailsServiceStub = sandbox.setStubFunc(ModellingGroupsService.prototype, "getGroupDetails", ()=>{
                return Promise.resolve(testGroupDetails);
            });

            store.dispatch(modellingGroupDetailsPageActionCreators.loadData({groupId: testGroup.id}));
            setTimeout(() => {
                const actions = store.getActions();
                const expectedPayload = [
                    { type: ModellingGroupTypes.SET_CURRENT_GROUP, data: testGroup},
                    { type: UsersTypes.ALL_USERS_FETCHED, data: [testUser, testUser2]},
                    { type: ModellingGroupTypes.GROUP_DETAILS_FETCHED, data: testGroupDetails},
                    { type: ModellingGroupTypes.SET_CURRENT_GROUP_MEMBERS, data: [testUser]}
                ];
                expect(actions).to.eql(expectedPayload);
                expect(getAllUsersStub.called).to.be.true;
                expect(getGroupDetailsServiceStub.called).to.be.true;
                expect(getGroupDetailsServiceStub.getCall(0).args[0]).to.equal(testGroup.id);
                done();
            });
        }
    );

});