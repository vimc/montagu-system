import * as React from "react";

import {mount, shallow} from "enzyme";
import {Provider} from "react-redux";
import {createMemoryHistory} from 'history';

import "../../helper";
import {AdminRouter} from "../../../main/admin/components/AdminRouter";
import {AdminNoRouteFoundPage} from "../../../main/admin/components/AdminNoRouteFoundPage";
import {LoginPage} from "../../../main/shared/components/LoginPage";
import {Sandbox} from "../../Sandbox";
import {authActionCreators} from "../../../main/shared/actions/authActionCreators";
import {createMockAdminStore} from "../../mocks/mockStore";
import {RecursivePartial} from "../../mocks/mockStates";
import {AdminAppState} from "../../../main/admin/reducers/adminAppReducers";
import {CoveragePage} from "../../../main/admin/components/Touchstones/Coverage/CoveragePage";
import {UsersListPage} from "../../../main/admin/components/Users/List/UsersListPage";
import {UserDetailsPage} from "../../../main/admin/components/Users/SingleUser/UserDetailsPage";

describe("AdminRouter", () => {

    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    function renderComponent(state: RecursivePartial<AdminAppState>, route: string) {
        const history = createMemoryHistory({initialEntries: [route]});
        const store = createMockAdminStore(state);
        return mount(<Provider store={store}><AdminRouter history={history}/></Provider>);
    }

    it("does normal routing when logged in", () => {
        const rendered = renderComponent({auth: {loggedIn: true}}, "/asd");
        expect(rendered.find(AdminNoRouteFoundPage)).toHaveLength(1);
    });

    it("attempts to log user in when user is logged out", () => {
        const loginStub = sandbox.setStubReduxAction(authActionCreators, "loadAuthenticatedUser");
        const rendered = renderComponent({auth: {loggedIn: false}}, "/users/");
        expect(rendered.find(LoginPage)).toHaveLength(1);
        expect(loginStub.mock.calls.length).toBe(1);
    });

    it("includes coverage page only when user can upload coverage", () => {
        const coverageRoute = "/touchstones/touchstone-1/1/coverage/";
        let rendered = renderComponent({auth: {loggedIn: true, canUploadCoverage: true}}, coverageRoute);
        expect(rendered.find(CoveragePage)).toHaveLength(1);

        rendered = renderComponent({auth: {loggedIn: true, canUploadCoverage: false}}, coverageRoute);
        expect(rendered.find(CoveragePage)).toHaveLength(0);
    });

    it("includes users page only when current user can view users", () => {
        const usersRoute = "/users/";
        let rendered = renderComponent({auth: {loggedIn: true, canViewUsers: true}}, usersRoute);
        expect(rendered.find(UsersListPage)).toHaveLength(1);

        rendered = renderComponent({auth: {loggedIn: true, canViewUsers: false}}, usersRoute);
        expect(rendered.find(UsersListPage)).toHaveLength(0);
    });

    it("includes user page only when current user can view users", () => {
        const userRoute = "/users/test-user/";
        let rendered = renderComponent({auth: {loggedIn: true, canViewUsers: true}}, userRoute);
        expect(rendered.find(UserDetailsPage)).toHaveLength(1);

        rendered = renderComponent({auth: {loggedIn: true, canViewUsers: false}}, userRoute);
        expect(rendered.find(UserDetailsPage)).toHaveLength(0);
    });
});
