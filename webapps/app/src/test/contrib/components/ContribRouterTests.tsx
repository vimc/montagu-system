import * as React from "react";
import { render } from "enzyme";
import { expect } from "chai";
import { Provider } from "react-redux";
import { createMemoryHistory } from 'history';

import "../../helper";
import { ContribRouter } from "../../../main/contrib/components/ContribRouter";
import {createContribStore} from "../../../main/contrib/stores/createContribStore";

describe("ContribRouter", () => {
    it("renders ContribLoginPage when user is logged out", () => {
        const history = createMemoryHistory();
        const store = createContribStore(history);

        const rendered = render(<Provider store={store}><ContribRouter loggedIn={false} loaded={false} history={history}/></Provider>);
        expect(rendered.find("div.page__title")).has.length(1);
        expect(rendered.find("div.page__title").text()).is.equal("Log in");
    });

    it("renders LoadingPage when not ready", () => {
        const history = createMemoryHistory();
        const store = createContribStore(history);
        const rendered = render(<Provider store={store}><ContribRouter loggedIn={true} loaded={false} history={history} /></Provider>);
        expect(rendered.find("div.page__title")).has.length(1);
        expect(rendered.find("div.page__title").text()).is.equal("Loading...");
    });

    it("does normal routing when logged in and loaded", () => {
        const history = createMemoryHistory();
        const store = createContribStore(history);
        const rendered = render(<Provider store={store}><ContribRouter loggedIn={true} loaded={true} history={history} /></Provider>);
        expect(rendered.find("div.page__title")).has.length(1);
        expect(rendered.find("div.page__title").text()).is.equal("Modellers' contribution portal");
    });
});
