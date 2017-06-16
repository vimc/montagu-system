import * as React from "react";
import { Sandbox } from "../../Sandbox";
import { expect } from "chai";
import { shallow } from "enzyme";
import { Link } from "simple-react-router";
import { expectOneAction } from "../../actionHelpers";

import { initialAuthState } from "../../../main/contrib/stores/ContribAuthStore";
import { LogoutComponent } from "../../../main/contrib/components/Login/Logout";
import { InternalLink } from "../../../main/shared/components/InternalLink";

describe("LogoutComponent", () => {
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it("renders nothing when the user is not logged in", () => {
        const state = initialAuthState();
        const rendered = shallow(<LogoutComponent {...state} />)
        expect(rendered.text()).to.be.empty;
    });

    it("renders log out link", () => {
        const state = Object.assign(initialAuthState(), {
            loggedIn: true,
            username: "test.user"
        });
        const rendered = shallow(<LogoutComponent {...state} />);
        expect(rendered.text()).to.contain("Logged in as test.user");
        expect(rendered.find(InternalLink)).to.have.length(1);
    });

    it("clicking log out emits logOut event", () => {
        const state = Object.assign(initialAuthState(), {
            loggedIn: true,
            username: "test.user"
        });
        const rendered = shallow(<LogoutComponent {...state} />);
        const spy = sandbox.dispatchSpy();
        rendered.find(InternalLink).simulate("click");
        expectOneAction(spy, { action: "AuthActions.logOut" });
    });
});