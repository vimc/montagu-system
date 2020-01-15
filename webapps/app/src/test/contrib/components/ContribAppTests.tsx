import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";

import "../../helper";
import {ContribAppComponent} from "../../../main/contrib/components/ContribApp";
import {ContribRouter} from "../../../main/contrib/components/ContribRouter";

describe("ContribApp", () => {
    test("renders Router", () => {
        const rendered = shallow(<ContribAppComponent loggedIn={ true } />);
        const router = rendered.find(ContribRouter);
        expect(router).has.length(1, "Expected Router to be rendered");
        expect(router.props()).to.eql({
            loggedIn: true,
            history: undefined
        });
    });
});