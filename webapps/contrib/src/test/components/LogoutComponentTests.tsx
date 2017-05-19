import * as React from "react";
import { Sandbox } from "../Sandbox";
import { expect } from "chai";
import { shallow } from "enzyme";
import { Link } from "simple-react-router";
import { dispatchSpy, expectOneAction } from "../actionHelpers";

import { initialState } from "../../main/stores/AuthStore";
import { LogoutComponent } from "../../main/components/Login/Logout";

describe("LogoutComponent", () => {
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it("renders nothing when the user is not logged in", () => {
        const state = initialState();
        const rendered = shallow(<LogoutComponent {...state} />)
        expect(rendered.text()).to.be.empty;
    });

    it("renders log out link", () => {
        const state = Object.assign(initialState(), {
            loggedIn: true,
            username: "test.user"
        });
        const rendered = shallow(<LogoutComponent {...state} />);
        expect(rendered.text()).to.contain("Logged in as test.user");
        expect(rendered.find(Link)).to.have.length(1);
    });

    it("renders group membership", () => {
        const state = Object.assign(initialState(), {
            loggedIn: true,
            username: "test.user",
            modellingGroups: [ "BEATLES", "BEACH BOYS" ]
        });
        const rendered = shallow(<LogoutComponent {...state} />);
        expect(rendered.text()).to.contain("Member of: BEATLES, BEACH BOYS");
    });

    it("clicking log out emits logOut event", () => {
        const state = Object.assign(initialState(), {
            loggedIn: true,
            username: "test.user"
        });
        const rendered = shallow(<LogoutComponent {...state} />);
        const spy = dispatchSpy(sandbox);
        rendered.find(Link).simulate("click");
        expectOneAction(spy, { action: "AuthActions.logOut" });
    });
});