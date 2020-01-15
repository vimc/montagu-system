import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import {AdminApp, AdminAppComponent} from "../../../main/admin/components/AdminApp";
import {AdminRouter} from "../../../main/admin/components/AdminRouter";

describe("AdminApp", () => {
    test("passes through loggedIn to router", () => {
        const rendered = shallow(<AdminAppComponent loggedIn={ true } />);
        expect(rendered.find(AdminRouter).props()).to.eql({
            loggedIn: true,
            history: undefined
        });
    });
});