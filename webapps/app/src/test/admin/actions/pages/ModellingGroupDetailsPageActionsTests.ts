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
import {modellingGroupDetailsPageActionCreators} from "../../../../main/admin/actions/pages/modellingGroupDetailsPageActionCreators";
import {UsersService} from "../../../../main/admin/services/UsersService";
import {UsersTypes} from "../../../../main/admin/actionTypes/UsersTypes";

describe("Modelling Group Details Page actions tests", () => {
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

    it("on load", (done) => {
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

        store.dispatch(modellingGroupDetailsPageActionCreators.onLoad({groupId: testGroup.id}));
        setTimeout(() => {
            const actions = store.getActions();
            const expectedPayload = [
                { type: ModellingGroupTypes.ADMIN_GROUPS_FETCHED, data: [testGroup] },
                { type: ModellingGroupTypes.SET_CURRENT_ADMIN_GROUP, data: testGroup},
                { type: UsersTypes.ALL_USERS_FETCHED, data: [testUser, testUser2]},
                { type: ModellingGroupTypes.ADMIN_GROUP_DETAILS_FETCHED, data: testGroupDetails},
                { type: ModellingGroupTypes.SET_CURRENT_ADMIN_GROUP_MEMBERS, data: [testUser]},
                { type: BreadcrumbsTypes.BREADCRUMBS_RECEIVED, data: testBreadcrumbs }
            ];
            expect(actions).to.eql(expectedPayload);
            expect(getAllGroupsStub.called).to.be.true;
            expect(getAllUsersStub.called).to.be.true;
            expect(getGroupDetailsServiceStub.called).to.be.true;
            expect(getGroupDetailsServiceStub.getCall(0).args[0]).to.equal(testGroup.id);
            done();
        });
    });



});