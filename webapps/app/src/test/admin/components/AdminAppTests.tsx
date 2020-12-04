import * as React from "react";

import {shallow} from "enzyme";
import {AdminApp, AdminAppComponent} from "../../../main/admin/components/AdminApp";
import {AdminRouter} from "../../../main/admin/components/AdminRouter";

describe("AdminApp", () => {
    it("passes through history to router", () => {
        const rendered = shallow(<AdminAppComponent loggedIn={ true } history={ "TEST HISTORY" as any } />);
        expect(rendered.find(AdminRouter).props()).toEqual({
            loggedIn: undefined,
            history: "TEST HISTORY"
        });
    });
});
