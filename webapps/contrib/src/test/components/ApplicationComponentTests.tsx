import * as React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";
import { initialMainState } from "../../main/stores/MainStore";
import { initialAuthState } from "../../main/stores/AuthStore";

import { ApplicationComponent } from "../../main/components/Application";
import { ErrorLog } from "../../main/components/ErrorLog/ErrorLog";
import Router from "../../main/components/Router";

describe("Application", () => {
    it("renders Router", () => {
        const main = Object.assign(initialMainState(), {
            ready: true,
        });
        const auth = Object.assign(initialAuthState(), {
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
        const main = Object.assign(initialMainState(), {
            errors: [ "m1", "m2" ]
        });
        const auth = initialAuthState();
        const rendered = shallow(<ApplicationComponent main={ main } auth={ auth } />);
        const log = rendered.find(ErrorLog);
        expect(log).has.length(1, "Expected Router to be rendered");
        expect(log.props()).to.eql({
            errors: [ "m1", "m2" ]
        });
    });
});