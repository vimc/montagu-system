import * as React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";

import "../../../../helper";
import { Sandbox } from "../../../../Sandbox";
import {ResponsibilityOverviewDescription} from "../../../../../main/contrib/components/Responsibilities/Overview/ResponsibilityOverviewDescription";

describe("Responsibility Overview Description Component", () => {

    const sandbox = new Sandbox();
    const testTouchstoneId1 = "t-1";
    const testTouchstoneId2 = "rfp-1";
    const testGroupId = "g-1";
    const touchstoneStatus="open";
    afterEach(() => sandbox.restore());

    it("renders component on touchstone not applicants", () => {
        const rendered = shallow(<ResponsibilityOverviewDescription currentTouchstoneId={testTouchstoneId1} groupId={testGroupId} touchstoneStatus={touchstoneStatus}/>);
        expect(rendered.text().indexOf("See an overview of which scenarios") > -1).to.equal(true);
    });

    it("renders component on touchstone is applicants", () => {
        const rendered = shallow(<ResponsibilityOverviewDescription currentTouchstoneId={testTouchstoneId2} groupId={testGroupId} touchstoneStatus={touchstoneStatus}/>);
        expect(rendered.text().indexOf("Access the standardised demographic") > -1).to.equal(true);
    });

    it("renders component on touchstone is not open", () => {
        const rendered = shallow(<ResponsibilityOverviewDescription currentTouchstoneId={testTouchstoneId2} groupId={testGroupId} touchstoneStatus="finished"/>);
        expect(rendered.text().indexOf("This touchstone is no longer open")).to.greaterThan(-1);
    });
});

