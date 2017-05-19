import * as React from "react";
import { shallow } from "enzyme";
import * as MainStore from "../../main/stores/MainStore";
import * as AuthStore from "../../main/stores/AuthStore";
import { expect } from "chai";

import { ApplicationComponent } from "../../main/components/Application";
import { ErrorLog } from "../../main/components/ErrorLog/ErrorLog";
import Router from "../../main/components/Router";

describe("Application", () => {
    it("renders Router", () => {
        const main = Object.assign(MainStore.initialState(), {
            ready: true,
        });
        const auth = Object.assign(AuthStore.initialState(), {
            loggedIn: true
        });
        const rendered = shallow(<ApplicationComponent main={ main } auth={ auth } />);
        const router = rendered.find(Router);
        expect(router).has.length(1, "Expected Router to be rendered");
        expect(router.props()).to.eql({
            loaded: true,
            loggedIn: true
        });
    });

    it("renders ErrorLog", () => {
        const main = Object.assign(MainStore.initialState(), {
            errors: [ "m1", "m2" ]
        });
        const auth = AuthStore.initialState();
        const rendered = shallow(<ApplicationComponent main={ main } auth={ auth } />);
        const log = rendered.find(ErrorLog);
        expect(log).has.length(1, "Expected Router to be rendered");
        expect(log.props()).to.eql({
            errors: [ "m1", "m2" ]
        });
    });
});