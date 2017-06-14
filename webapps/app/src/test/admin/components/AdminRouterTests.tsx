import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import { AdminRouter } from "../../../main/admin/components/AdminRouter";
import { AdminLoginPage } from "../../../main/admin/components/AdminLoginPage";

describe("AdminRouter", () => {
   it("does normal routing when logged in", () => {
      const rendered = shallow(<AdminRouter loggedIn={ true } />);
       expect(rendered.text()).contains("No Route Found");
   });

    it("renders LoginPage when logged out", () => {
        const rendered = shallow(<AdminRouter loggedIn={ false } />);
        expect(rendered.find(AdminLoginPage).length).to.equal(1);
    });
});