import {shallow} from "enzyme";
import {expect} from "chai";
import {ResponsibilitySetStatusMessage} from "../../../../main/contrib/components/Responsibilities/Overview/ResponsibilitySetStatusMessage";
import {ReviewedAndApprovedMessage} from "../../../../main/contrib/components/Responsibilities/Overview/List/CurrentEstimateSetSummary";
import * as React from "react";

describe("ResponsibilitySetStatusMessage", () => {
    it("renders standard message when status is approved", () => {
        const rendered = shallow(<ResponsibilitySetStatusMessage status={"approved"} />);
        expect(rendered.find(ReviewedAndApprovedMessage)).to.have.length(1);
    });

    it("renders no responsibilities message when status is not-applicable", () => {
        const rendered = shallow(<ResponsibilitySetStatusMessage status={"not-applicable"}/>);
        expect(rendered.text()).to.contain("no responsibilities in this touchstone");
    });

    it("renders nothing when status is incomplete", () => {
        const rendered = shallow(<ResponsibilitySetStatusMessage status={"incomplete"}/>);
        expect(rendered.html()).to.be.null;
    });

    it("renders nothing when status is submitted", () => {
        const rendered = shallow(<ResponsibilitySetStatusMessage status={"submitted"}/>);
        expect(rendered.html()).to.be.null;
    });
});