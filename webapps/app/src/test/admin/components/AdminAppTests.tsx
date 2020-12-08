import * as React from "react";

import {shallow} from "enzyme";
import {AdminApp, AdminAppComponent} from "../../../main/admin/components/AdminApp";
import {AdminRouter} from "../../../main/admin/components/AdminRouter";
import {createMockAdminStore} from "../../mocks/mockStore";

describe("AdminApp", () => {
    it("passes through history to router", () => {
        const store = createMockAdminStore();
        const rendered = shallow(<AdminApp history={ "TEST HISTORY" as any } />, {context: {store}}).dive();
        expect(rendered.find(AdminRouter).props()).toEqual({
            loggedIn: undefined,
            history: "TEST HISTORY"
        });
    });
});
