import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import "../../helper";
import { AdminRouter } from "../../../main/admin/components/AdminRouter";
import { AdminLoginPage } from "../../../main/admin/components/AdminLoginPage";
import {AdminNoRouteFoundPage} from "../../../main/admin/components/AdminNoRouteFoundPage";
import {mockHistory} from "../../mocks/mocks";

describe("AdminRouter", () => {
   it("does normal routing when logged in", () => {
       const history = mockHistory();
       const rendered = shallow(<AdminRouter loggedIn={ true } history={history} />);
       expect(rendered.find(AdminNoRouteFoundPage)).has.length(1, "Expected AdminNoRouteFoundPage to be rendered");
   });

    it("renders LoginPage when logged out", () => {
        const history = mockHistory();
        const rendered = shallow(<AdminRouter loggedIn={ false } history={history} />);
        expect(rendered.find(AdminLoginPage).length).to.equal(1);
    });
});