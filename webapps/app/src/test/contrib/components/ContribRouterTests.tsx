import * as React from "react";
import { mount } from "enzyme";
import { expect } from "chai";
import { Provider } from "react-redux";
import { createMemoryHistory } from 'history';

import "../../helper";
import { ContribRouter } from "../../../main/contrib/components/ContribRouter";
import {createContribStore} from "../../../main/contrib/createStore";
import {ContribLoginPage} from "../../../main/contrib/components/Login/ContribLoginPage";
import {ContribNoRouteFoundPage} from "../../../main/contrib/components/ContribNoRouteFoundPage";

describe("ContribRouter", () => {
    it("renders ContribLoginPage when user is logged out", () => {
        const history = createMemoryHistory();
        const store = createContribStore(history);
        const rendered = mount(<Provider store={store}><ContribRouter loggedIn={false} history={history}/></Provider>);
        expect(rendered.find(ContribLoginPage)).has.length(1, "Expected ContribLoginPage to be rendered");
    });

    it("does normal routing when logged in", () => {
        const history = createMemoryHistory({initialEntries: [ '/asd/asd/asd' ]});
        const store = createContribStore(history);
        const rendered = mount(<Provider store={store}><ContribRouter loggedIn={true} history={history} /></Provider>);
        expect(rendered.find(ContribNoRouteFoundPage)).has.length(1, "Expected ContribNoRouteFoundPage to be rendered");
    });
});
