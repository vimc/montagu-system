import * as React from "react";
import { expect } from "chai";
import { render } from "enzyme";
import { Provider } from "react-redux";
import { createMemoryHistory } from 'history';

import "../../helper";
import { AdminRouter } from "../../../main/admin/components/AdminRouter";
import {createAdminStore} from "../../../main/admin/stores/createAdminStore";

describe("AdminRouter", () => {
   it("does normal routing when logged in", () => {
       const history = createMemoryHistory();
       const store = createAdminStore(history);

       const rendered = render(<Provider store={store}><AdminRouter loggedIn={ true } history={history} /></Provider>);

       expect(rendered.find("div.page__title")).has.length(1, "Expected Main menu to be rendered");
       expect(rendered.find("div.page__title").text()).is.equal("Main menu");
   });

    it("renders LoginPage when logged out", () => {
        const history = createMemoryHistory();
        const store = createAdminStore(history);

        const rendered = render(<Provider store={store}><AdminRouter loggedIn={ false } history={history} /></Provider>);
        expect(rendered.find("div.page__title")).has.length(1);
        expect(rendered.find("div.page__title").text()).is.equal("Log in");
    });
});