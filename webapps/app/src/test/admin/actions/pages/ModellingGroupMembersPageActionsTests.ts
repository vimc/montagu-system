import { expect } from "chai";

import { Sandbox } from "../../../Sandbox";
import {createMockStore} from "../../../mocks/mockStore";
import {ModellingGroupsService} from "../../../../main/shared/services/ModellingGroupsService";
import {ModellingGroupTypes} from "../../../../main/admin/actionTypes/ModellingGroupsTypes";
import {BreadcrumbsTypes} from "../../../../main/shared/actionTypes/BreadrumbsTypes";
import {breadcrumbsModule} from "../../../../main/shared/modules/breadcrumbs";
import {
    mockBreadcrumbs,
    mockModellingGroup,
    mockModellingGroupDetails,
    mockUser
} from "../../../mocks/mockModels";
import {modellingGroupMembersPageActionCreators} from "../../../../main/admin/actions/pages/ModellingGroupMembersPageActionCreators";
import {UsersService} from "../../../../main/admin/services/UsersService";
import {UsersTypes} from "../../../../main/admin/actionTypes/UsersTypes";

describe("Modelling Group Members Page actions tests", () => {
    const sandbox = new Sandbox();

    const testUser = mockUser();
    const testUser2 = mockUser();
    const testGroup = mockModellingGroup();
    const testGroup2 = mockModellingGroup();
    const testBreadcrumbs = mockBreadcrumbs();
    const testGroupDetails = mockModellingGroupDetails({members: [testUser.username]});

    afterEach(() => {
        sandbox.restore();
    });

    test("on load", async () => {
        const initialState = {
            groups: {groups: [testGroup, testGroup2], currentGroupDetails: testGroupDetails, currentGroup: testGroup},
            users: {users: [testUser, testUser2]}
        };
        const store = createMockStore(initialState);

        const getAllGroupsStub =  sandbox.setStubFunc(ModellingGroupsService.prototype, "getAllGroups", ()=>{
            return Promise.resolve([testGroup]);
        });
        const getAllUsersStub = sandbox.setStubFunc(UsersService.prototype, "getAllUsers", ()=>{
            return Promise.resolve([testUser, testUser2]);
        });
        const getGroupDetailsServiceStub = sandbox.setStubFunc(ModellingGroupsService.prototype, "getGroupDetails", ()=>{
            return Promise.resolve(testGroupDetails);
        });
        sandbox.setStubFunc(breadcrumbsModule, "initialize", ()=>{
            return testBreadcrumbs;
        });

        await store.dispatch(modellingGroupMembersPageActionCreators.onLoad({groupId: testGroup.id}));

        const actions = store.getActions();
        const expectedPayload = [
            { type: ModellingGroupTypes.GROUPS_FETCHED, data: [testGroup] },
            { type: ModellingGroupTypes.SET_CURRENT_GROUP, data: testGroup},
            { type: UsersTypes.ALL_USERS_FETCHED, data: [testUser, testUser2]},
            { type: ModellingGroupTypes.GROUP_DETAILS_FETCHED, data: testGroupDetails},
            { type: ModellingGroupTypes.SET_CURRENT_GROUP_MEMBERS, data: [testUser]},
            { type: BreadcrumbsTypes.BREADCRUMBS_RECEIVED, data: testBreadcrumbs }
        ];
        expect(actions).to.eql(expectedPayload);
        expect(getAllGroupsStub.called).to.be.true;
        expect(getAllUsersStub.called).to.be.true;
        expect(getGroupDetailsServiceStub.called).to.be.true;
        expect(getGroupDetailsServiceStub.getCall(0).args[0]).to.equal(testGroup.id);

    });

});