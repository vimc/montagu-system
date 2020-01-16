import * as React from "react";
import {shallow} from "enzyme";


import "../../../../helper";
import {ResponsibilitySetStatusMessage} from "../../../../../main/contrib/components/Responsibilities/Overview/ResponsibilitySetStatusMessage";
import {ReviewedAndApprovedMessage} from "../../../../../main/contrib/components/Responsibilities/Overview/List/CurrentEstimateSetSummary";

describe("Responsibility Overview SetStatusMessage Component", () => {
    it("renders standard message when status is approved", () => {
        const rendered = shallow(<ResponsibilitySetStatusMessage status={"approved"} />);
        expect(rendered.find(ReviewedAndApprovedMessage)).toHaveLength(1);
    });

    it(
        "renders no responsibilities message when status is not-applicable",
        () => {
            const rendered = shallow(<ResponsibilitySetStatusMessage status={"not-applicable"}/>);
            expect(rendered.text()).toContain("no responsibilities in this touchstone");
        }
    );

    it("renders nothing when status is incomplete", () => {
        const rendered = shallow(<ResponsibilitySetStatusMessage status={"incomplete"}/>);
        expect(rendered.html()).toBe(null);
    });

    it("renders nothing when status is submitted", () => {
        const rendered = shallow(<ResponsibilitySetStatusMessage status={"submitted"}/>);
        expect(rendered.html()).toBe(null);
    });
});