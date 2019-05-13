import * as React from "react";
import {expect} from "chai";
import {mount} from "enzyme";
import {Provider} from "react-redux";
import {createMemoryHistory} from 'history';

import "../../helper";
import {ReportingRouter} from "../../../main/report/components/ReportingRouter";
import {createReportStore} from "../../../main/report/stores/createReportStore";
import {ReportingNoRouteFoundPage} from "../../../main/report/components/ReportingNoRouteFoundPage";
import {Sandbox} from "../../Sandbox";
import {LoginPage} from "../../../main/shared/components/LoginPage";
import {authActionCreators} from "../../../main/shared/actions/authActionCreators";

describe("ReportingRouter", () => {

    const sandbox = new Sandbox();
    afterEach(() => {
        sandbox.restore();
    });

   it("does normal routing when logged in", () => {
       const history = createMemoryHistory({initialEntries: [ '/asd' ]});
       const store = createReportStore(history);
       const rendered = mount( <Provider store={store}><ReportingRouter loggedIn={ true } history={history} /></Provider>);
       expect(rendered.find(ReportingNoRouteFoundPage)).has.length(1, "Expected ReportingNoRouteFoundPage to be rendered");
   });

    it("attempts to log user in when user is logged out", () => {

        const loginStub = sandbox.setStub(authActionCreators, "loadAuthenticatedUser");

        const history = createMemoryHistory({initialEntries: ['/some-url/']});
        const store = createReportStore(history);
        const rendered = mount(<Provider store={store}><ReportingRouter loggedIn={false} history={history}/></Provider>);
        expect(rendered.find(LoginPage)).has.length(1, "Expected ReportingLoginPage to be rendered");
        expect(loginStub.called).to.be.true;
    });
});