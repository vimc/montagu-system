import * as React from "react";
import {mount} from "enzyme";

import {Provider} from "react-redux";
import {createMemoryHistory} from 'history';

import "../../helper";
import {ContribRouter} from "../../../main/contrib/components/ContribRouter";
import {createContribStore} from "../../../main/contrib/createStore";
import {ContribNoRouteFoundPage} from "../../../main/contrib/components/ContribNoRouteFoundPage";
import {LoginPage} from "../../../main/shared/components/LoginPage";
import {Sandbox} from "../../Sandbox";
import {AbstractLocalService} from "../../../main/shared/services/AbstractLocalService";
import {authActionCreators} from "../../../main/shared/actions/authActionCreators";

describe("ContribRouter", () => {

    const sandbox = new Sandbox();

    beforeEach(() => {
        sandbox.setStub(AbstractLocalService.prototype, "get");
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("attempts to log user in when user is logged out", () => {
        const loginStub = sandbox.setStubReduxAction(authActionCreators, "loadAuthenticatedUser");
        const history = createMemoryHistory({initialEntries: ['/help/touchstones/']});
        const store = createContribStore(history);
        const rendered = mount(<Provider store={store}><ContribRouter loggedIn={false} history={history}/></Provider>);

        expect(rendered.find(LoginPage)).toHaveLength(1);
        expect(loginStub.called).toBe(true);
    });

    it("does normal routing when logged in", () => {
        const history = createMemoryHistory({initialEntries: [ '/asd/asd/asd' ]});
        const store = createContribStore(history);
        const rendered = mount(<Provider store={store}><ContribRouter loggedIn={true} history={history} /></Provider>);
        expect(rendered.find(ContribNoRouteFoundPage)).toHaveLength(1);
    });
});
