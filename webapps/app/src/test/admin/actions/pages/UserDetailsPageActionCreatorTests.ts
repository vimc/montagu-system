import {expect} from "chai";
import * as Sinon from "sinon"

import {Sandbox} from "../../../Sandbox";
import {createMockStore} from "../../../mocks/mockStore";
import {BreadcrumbsTypes} from "../../../../main/shared/actionTypes/BreadrumbsTypes";
import {breadcrumbsModule} from "../../../../main/shared/modules/breadcrumbs";
import {mockBreadcrumbs, mockRole, mockUser} from "../../../mocks/mockModels";
import {usersListPageActionCreators} from "../../../../main/admin/actions/pages/UsersListPageActionCreators";
import {UsersTypes} from "../../../../main/admin/actionTypes/UsersTypes";
import {userDetailsPageActionCreators} from "../../../../main/admin/actions/pages/UserDetailsPageActionCreators";
import {AdminAppState} from "../../../../main/admin/reducers/adminAppReducers";
import {mockAdminState, mockAdminUsersState} from "../../../mocks/mockStates";
import {MockStore} from "redux-mock-store";
import {UserDetailsPageComponent} from "../../../../main/admin/components/Users/SingleUser/UserDetailsPage";
import {UsersService} from "../../../../main/admin/services/UsersService";

describe("User Details Page actions tests", () => {
    const sandbox = new Sandbox();

    const testUser = mockUser();
    const testRole = mockRole();
    const testBreadcrumbs = mockBreadcrumbs();
    let parentStub: Sinon.SinonStub, store: MockStore<AdminAppState>;

    beforeEach(() => {
        store = createMockStore(mockAdminState());

        sandbox.setStub(UserDetailsPageComponent, "breadcrumb");
        sandbox.setStubFunc(breadcrumbsModule, "initialize", () => {
            return testBreadcrumbs;
        });
        parentStub = sandbox.setStubFunc(usersListPageActionCreators, "loadData", () => {
            return async () => Promise.resolve([testUser]);
        });
        sandbox.setStubFunc(UsersService.prototype, "getGlobalRoles", () => {
            return Promise.resolve([testRole]);
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("has user list page as parent", async () => {

        expect(userDetailsPageActionCreators.parent).to.eq(usersListPageActionCreators)
    });

    it("creates breadcrumb", () => {

        const mockUsersState = mockAdminUsersState({currentUser: mockUser({username: "fake.name", name: "Fake Name"})});
        const mockAdminAppState = mockAdminState({users: mockUsersState});
        const breadcrumb = userDetailsPageActionCreators.createBreadcrumb(mockAdminAppState);

        expect(breadcrumb.name).is.equal("fake.name");
        expect(breadcrumb.urlFragment).is.equal("fake.name/");
    });

    it("sets current user and gets global roles on load", async () => {

        store = createMockStore(mockAdminState({auth: {permissions: ["*/roles.read"]}}));
        await store.dispatch(userDetailsPageActionCreators.loadData({username: "test.user"}));

        const actions = store.getActions();
        const expectedPayload = [
            {type: UsersTypes.SET_CURRENT_USER, data: "test.user"},
            {type: UsersTypes.ALL_GLOBAL_ROLES_FETCHED,data: [testRole]}
        ];
        expect(actions).to.eql(expectedPayload);
    });

    it("does not get global roles if user does not have permission", async () => {

        await store.dispatch(userDetailsPageActionCreators.loadData({username: "test.user"}));

        const actions = store.getActions();
        const expectedPayload = [
            {type: UsersTypes.SET_CURRENT_USER, data: "test.user"}
        ];
        expect(actions).to.eql(expectedPayload);
    });

});