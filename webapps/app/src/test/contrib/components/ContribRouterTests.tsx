import { shallow } from "enzyme";
import { expect } from "chai";
import * as React from "react";

import { ContribRouter } from "../../../main/contrib/components/ContribRouter";
import { LoadingPage } from "../../../main/contrib/components/LoadingPage";
import { ContribLoginPage } from "../../../main/contrib/components/Login/ContribLoginPage";
import {ContribNoRouteFoundPage} from "../../../main/contrib/components/ContribNoRouteFoundPage";

describe("ContribRouter", () => {
    it("renders ContribLoginPage when user is logged out", () => {
        const rendered = shallow(<ContribRouter loggedIn={false} loaded={false} />);
        expect(rendered.find(ContribLoginPage)).has.length(1, "Expected ContribLoginPage to be rendered");
    });

    it("renders LoadingPage when not ready", () => {
        const rendered = shallow(<ContribRouter loggedIn={true} loaded={false} />);
        const page = rendered.find(LoadingPage);
        expect(page).has.length(1, "Expected LoadingPage to be rendered");
    });

    it("does normal routing when logged in and loaded", () => {
        const rendered = shallow(<ContribRouter loggedIn={true} loaded={true} />);
        expect(rendered.find(ContribNoRouteFoundPage)).has.length(1, "Expected ContribNoRouteFoundPage to be rendered");
    });
});
