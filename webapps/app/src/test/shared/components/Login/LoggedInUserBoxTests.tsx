import * as React from "react";
import { Sandbox } from "../../../Sandbox";
import { expect } from "chai";
import { shallow } from "enzyme";

import { initialAuthState } from "../../../../main/shared/reducers/authReducer";
import { InternalLink } from "../../../../main/shared/components/InternalLink";
import { LoggedInUserBoxComponent } from "../../../../main/shared/components/Login/LoggedInUserBox";

describe("LoggedInUserBoxComponent", () => {
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it("renders nothing when the user is not logged in", () => {
        const rendered = shallow(<LoggedInUserBoxComponent
            loggedIn={initialAuthState.loggedIn}
            username={initialAuthState.username}
            logOut={()=>({})}
        />);
        expect(rendered.text()).to.be.empty;
    });

    it("renders log out link", () => {
        const rendered = shallow(<LoggedInUserBoxComponent
            loggedIn={true}
            username="test.user"
            logOut={()=>({})}
        />);
        expect(rendered.text()).to.contain("Logged in as test.user");
        expect(rendered.find(InternalLink)).to.have.length(1);
    });

    it("clicking log out emits logOut event", () => {
        const dispatchSpy = sandbox.createSpy();
        const rendered = shallow(<LoggedInUserBoxComponent
            loggedIn={true}
            username="test.user"
            logOut={dispatchSpy}
        />);
        const spy = sandbox.dispatchSpy();
        rendered.find(InternalLink).simulate("click");
        expect(dispatchSpy.called).to.equal(true);
    });
});