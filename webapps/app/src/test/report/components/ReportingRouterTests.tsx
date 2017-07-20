import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import { ReportingRouter } from "../../../main/report/components/ReportingRouter";
import { ReportingLoginPage } from "../../../main/report/components/ReportingLoginPage";
import {ReportingNoRouteFoundPage} from "../../../main/report/components/ReportingNoRouteFoundPage";

describe("ReportingRouter", () => {
   it("does normal routing when logged in", () => {
      const rendered = shallow(<ReportingRouter loggedIn={ true } />);
       expect(rendered.find(ReportingNoRouteFoundPage)).has.length(1, "Expected ReportingNoRouteFoundPage to be rendered");
   });

    it("renders LoginPage when logged out", () => {
        const rendered = shallow(<ReportingRouter loggedIn={ false } />);
        expect(rendered.find(ReportingLoginPage).length).to.equal(1);
    });
});