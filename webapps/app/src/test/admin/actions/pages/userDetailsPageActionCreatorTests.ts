import {expect} from "chai";
import * as Sinon from "sinon"

import {Sandbox} from "../../../Sandbox";
import {createMockStore} from "../../../mocks/mockStore";
import {BreadcrumbsTypes} from "../../../../main/shared/actionTypes/BreadrumbsTypes";
import {breadcrumbsModule} from "../../../../main/shared/modules/breadcrumbs";
import {mockBreadcrumbs, mockRole, mockUser} from "../../../mocks/mockModels";
import {usersListPageActionCreators} from "../../../../main/admin/actions/pages/usersListPageActionCreators";
import {UsersTypes} from "../../../../main/admin/actionTypes/UsersTypes";
import {userDetailsPageActionCreators} from "../../../../main/admin/actions/pages/userDetailsPageActionCreators";
import {AdminAppState} from "../../../../main/admin/reducers/adminAppReducers";
import {mockAdminState} from "../../../mocks/mockStates";
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
        sandbox.setStubFunc(UsersService.prototype, "getAllUserRoles", () => {
            return Promise.resolve([testRole]);
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("loads data from user list page on load", async () => {

        await store.dispatch(userDetailsPageActionCreators.onLoad({username: "test.user"}));
        expect(parentStub.called).to.be.true;
    });

    it("creates breadcrumbs and sets current user on load", async () => {

        await store.dispatch(userDetailsPageActionCreators.onLoad({username: "test.user"}));

        const actions = store.getActions();
        const expectedPayload = [
            {type: UsersTypes.SET_CURRENT_USER, data: "test.user"},
            {type: UsersTypes.ALL_USER_ROLES_FETCHED,data: [testRole]},
            {type: BreadcrumbsTypes.BREADCRUMBS_RECEIVED, data: testBreadcrumbs}
        ];
        expect(actions).to.eql(expectedPayload);
    });

});