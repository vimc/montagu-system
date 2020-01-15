import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";

import "../../../../helper";
import {ResponsibilitySetStatusMessage} from "../../../../../main/contrib/components/Responsibilities/Overview/ResponsibilitySetStatusMessage";
import {ReviewedAndApprovedMessage} from "../../../../../main/contrib/components/Responsibilities/Overview/List/CurrentEstimateSetSummary";

describe("Responsibility Overview SetStatusMessage Component", () => {
    test("renders standard message when status is approved", () => {
        const rendered = shallow(<ResponsibilitySetStatusMessage status={"approved"} />);
        expect(rendered.find(ReviewedAndApprovedMessage)).to.have.length(1);
    });

    test(
        "renders no responsibilities message when status is not-applicable",
        () => {
            const rendered = shallow(<ResponsibilitySetStatusMessage status={"not-applicable"}/>);
            expect(rendered.text()).to.contain("no responsibilities in this touchstone");
        }
    );

    test("renders nothing when status is incomplete", () => {
        const rendered = shallow(<ResponsibilitySetStatusMessage status={"incomplete"}/>);
        expect(rendered.html()).to.be.null;
    });

    test("renders nothing when status is submitted", () => {
        const rendered = shallow(<ResponsibilitySetStatusMessage status={"submitted"}/>);
        expect(rendered.html()).to.be.null;
    });
});