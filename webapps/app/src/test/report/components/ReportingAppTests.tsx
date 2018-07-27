import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import {ReportingApp, ReportingAppComponent} from "../../../main/report/components/ReportingApp";
import {ReportingRouter} from "../../../main/report/components/ReportingRouter";

describe("ReportingApp", () => {
    it("passes through loggedIn to router", () => {
        const rendered = shallow(<ReportingAppComponent loggedIn={ true } />);
        expect(rendered.find(ReportingRouter).props()).to.eql({
            loggedIn: true,
            history: undefined
        });
    });
});