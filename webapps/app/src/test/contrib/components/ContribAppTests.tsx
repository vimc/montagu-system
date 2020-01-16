import * as React from "react";
import {shallow} from "enzyme";


import "../../helper";
import {ContribAppComponent} from "../../../main/contrib/components/ContribApp";
import {ContribRouter} from "../../../main/contrib/components/ContribRouter";

describe("ContribApp", () => {
    it("renders Router", () => {
        const rendered = shallow(<ContribAppComponent loggedIn={ true } />);
        const router = rendered.find(ContribRouter);
        expect(router).toHaveLength(1);
        expect(router.props()).toEqual({
            loggedIn: true,
            history: undefined
        });
    });
});