import * as React from "react";

import {mount} from "enzyme";
import {Provider} from "react-redux";
import {createMemoryHistory} from 'history';

import "../../helper";
import {AdminRouter} from "../../../main/admin/components/AdminRouter";
import {createAdminStore} from "../../../main/admin/stores/createAdminStore";
import {AdminNoRouteFoundPage} from "../../../main/admin/components/AdminNoRouteFoundPage";
import {LoginPage} from "../../../main/shared/components/LoginPage";
import {Sandbox} from "../../Sandbox";
import {authActionCreators} from "../../../main/shared/actions/authActionCreators";

describe("AdminRouter", () => {

    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it("does normal routing when logged in", () => {
        const history = createMemoryHistory({initialEntries: ['/asd']});
        const store = createAdminStore(history);
        const rendered = mount(<Provider store={store}><AdminRouter loggedIn={true} history={history}/></Provider>);
        expect(rendered.find(AdminNoRouteFoundPage)).toHaveLength(1);
    });

    it("attempts to log user in when user is logged out", () => {

        const loginStub = sandbox.setStubReduxAction(authActionCreators, "loadAuthenticatedUser");

        const history = createMemoryHistory({initialEntries: ['/users/']});
        const store = createAdminStore(history);
        const rendered = mount(<Provider store={store}><AdminRouter loggedIn={false} history={history}/></Provider>);
        expect(rendered.find(LoginPage)).toHaveLength(1);
        expect(loginStub.mock.calls.length).toBe(1);
    });

});