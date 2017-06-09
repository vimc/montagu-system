import { shallow } from "enzyme";
import { expect } from "chai";
import * as React from "react";
import Router from "../../main/contrib/components/Router";
import { LoginPage } from "../../main/contrib/components/Login/LoginPage";
import { LoadingPage } from "../../main/contrib/components/LoadingPage";

describe("Router", () => {
    it("renders LoginPage when user is logged out", () => {
        const rendered = shallow(<Router loggedIn={false} loaded={false} />);
        expect(rendered.find(LoginPage)).has.length(1, "Expected LoginPage to be rendered");
    });

    it("renders LoadingPage when not ready", () => {
        const rendered = shallow(<Router loggedIn={true} loaded={false} />);
        const page = rendered.find(LoadingPage);
        expect(page).has.length(1, "Expected LoadingPage to be rendered");
    });

    it("does normal routing when logged in and loaded", () => {
        const rendered = shallow(<Router loggedIn={true} loaded={true} />);
        expect(rendered.text()).contains("No Route Found");
    });
});
