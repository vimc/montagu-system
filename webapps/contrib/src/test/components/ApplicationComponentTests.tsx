import { setupVirtualDOM } from "../JSDomHelpers";
setupVirtualDOM();

import * as React from "react";
import { shallow } from "enzyme";
import * as MainStore from "../../main/stores/MainStore";
import * as AuthStore from "../../main/stores/AuthStore";
import { expect } from "chai";

import { ApplicationComponent } from "../../main/components/Application";
import Router from "../../main/components/Router";

describe("Application", () => {
    it("renders Router", () => {
        const main = Object.assign(MainStore.initialState(), {
            errorMessage: "message",
            ready: true,
        });
        const auth = Object.assign(AuthStore.initialState(), {
            loggedIn: true
        });
        const rendered = shallow(<ApplicationComponent main={ main } auth={ auth } />);
        const router = rendered.find(Router);
        expect(router).has.length(1, "Expected Router to be rendered");
        expect(router.props()).to.eql({
            errorMessage: "message",
            loaded: true,
            loggedIn: true
        });
    });
});