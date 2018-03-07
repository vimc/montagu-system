import * as React from "react";
import { mount } from "enzyme";
import { expect } from "chai";
import { Provider } from "react-redux";
import { createMemoryHistory } from 'history';

import "../../helper";
import { ContribRouter } from "../../../main/contrib/components/ContribRouter";
import {createContribStore} from "../../../main/contrib/stores/createContribStore";
import {ContribLoginPage} from "../../../main/contrib/components/Login/ContribLoginPage";
import {LoadingPage} from "../../../main/contrib/components/LoadingPage";
import {ContribNoRouteFoundPage} from "../../../main/contrib/components/ContribNoRouteFoundPage";

describe("ContribRouter", () => {
    it("renders ContribLoginPage when user is logged out", () => {
        const history = createMemoryHistory();
        const store = createContribStore(history);
        const rendered = mount(<Provider store={store}><ContribRouter loggedIn={false} loaded={false} history={history}/></Provider>);
        expect(rendered.find(ContribLoginPage)).has.length(1, "Expected ContribLoginPage to be rendered");
    });

    it("renders LoadingPage when not ready", () => {
        const history = createMemoryHistory();
        const store = createContribStore(history);
        const rendered = mount(<Provider store={store}><ContribRouter loggedIn={true} loaded={false} history={history} /></Provider>);
        const page = rendered.find(LoadingPage);
        expect(page).has.length(1, "Expected LoadingPage to be rendered");

    });

    it("does normal routing when logged in and loaded", () => {
        const history = createMemoryHistory({initialEntries: [ '/asd/asd/asd' ]});
        const store = createContribStore(history);
        const rendered = mount(<Provider store={store}><ContribRouter loggedIn={true} loaded={true} history={history} /></Provider>);
        expect(rendered.find(ContribNoRouteFoundPage)).has.length(1, "Expected ContribNoRouteFoundPage to be rendered");
    });
});
