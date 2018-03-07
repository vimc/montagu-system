import * as React from "react";
import { expect } from "chai";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { createMemoryHistory } from 'history';

import "../../helper";
import { AdminRouter } from "../../../main/admin/components/AdminRouter";
import {createAdminStore} from "../../../main/admin/stores/createAdminStore";
import {AdminNoRouteFoundPage} from "../../../main/admin/components/AdminNoRouteFoundPage";
import {AdminLoginPage} from "../../../main/admin/components/AdminLoginPage";

describe("AdminRouter", () => {
   it("does normal routing when logged in", () => {
       const history = createMemoryHistory({initialEntries: [ '/asd' ]});
       const store = createAdminStore(history);
       const rendered = mount(<Provider store={store}><AdminRouter loggedIn={ true } history={history} /></Provider>);
       expect(rendered.find(AdminNoRouteFoundPage)).has.length(1, "Expected AdminNoRouteFoundPage to be rendered");
   });

    it("renders LoginPage when logged out", () => {
        const history = createMemoryHistory();
        const store = createAdminStore(history);
        const rendered = mount(<Provider store={store}><AdminRouter loggedIn={ false } history={history} /></Provider>);
        expect(rendered.find(AdminLoginPage).length).to.equal(1);

    });
});