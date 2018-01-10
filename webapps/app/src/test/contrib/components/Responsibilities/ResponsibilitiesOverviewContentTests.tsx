import * as React from "react";
import {Sandbox} from "../../../Sandbox";
import {shallow} from "enzyme";
import {ResponsibilityOverviewContent} from "../../../../main/contrib/components/Responsibilities/Overview/ResponsibilityOverviewContent";

describe('ResponsibilityOverviewPage', () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it("show params if touchstone is not 201801rfp-1", () => {

        const rendered = shallow(<ResponsibilityOverviewContent />);
    });
});