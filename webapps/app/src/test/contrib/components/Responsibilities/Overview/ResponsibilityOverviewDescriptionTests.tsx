import * as React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";

import "../../../../helper";
import { Sandbox } from "../../../../Sandbox";
import {ResponsibilityOverviewDescription} from "../../../../../main/contrib/components/Responsibilities/Overview/ResponsibilityOverviewDescription";
import {settings} from "../../../../../main/shared/Settings";
import {InternalLink} from "../../../../../main/shared/components/InternalLink";

describe("Responsibility Overview Description Component", () => {

    const sandbox = new Sandbox();
    const testTouchstoneId1 = "t-1";
    const testTouchstoneId2 = "rfp-1";
    const testGroupId = "g-1";
    const touchstoneStatus="open";
    afterEach(() => sandbox.restore());

    test("renders component on touchstone not applicants", () => {
        const rendered = shallow(<ResponsibilityOverviewDescription currentTouchstoneId={testTouchstoneId1} groupId={testGroupId} touchstoneStatus={touchstoneStatus}/>);
        expect(rendered.text().indexOf("See an overview of which scenarios") > -1).to.equal(true);
    });

    test("renders component on touchstone is applicants", () => {
        const rendered = shallow(<ResponsibilityOverviewDescription currentTouchstoneId={testTouchstoneId2} groupId={testGroupId} touchstoneStatus={touchstoneStatus}/>);
        expect(rendered.text().indexOf("Access the standardised demographic") > -1).to.equal(true);
    });

    test("renders component on touchstone is not open", () => {
        const rendered = shallow(<ResponsibilityOverviewDescription currentTouchstoneId={testTouchstoneId2} groupId={testGroupId} touchstoneStatus="finished"/>);
        expect(rendered.text().indexOf("This touchstone is no longer open")).to.greaterThan(-1);
    });

    test("renders internal links for non-2019 touchstone", () => {
        const rendered = shallow(<ResponsibilityOverviewDescription currentTouchstoneId={"t1"}
                                                                    groupId={testGroupId}
                                                                    touchstoneStatus={"open"}/>);
        const link = rendered.find(InternalLink);

        expect(link.at(0).prop("href")).eq("/help/model-inputs/t1");
        expect(link.at(1).prop("href")).eq("/help/model-outputs/t1");
        expect(rendered.find("a").length).eq(0);
    });

    test("renders external links for 2019 touchstone", () => {
        const rendered = shallow(<ResponsibilityOverviewDescription currentTouchstoneId={"201910"}
                                                                    groupId={testGroupId}
                                                                    touchstoneStatus={"open"}/>);
        const link = rendered.find("a");

        expect(link.at(0).prop("href")).contains("guidance-2019-inputs.pdf");
        expect(link.at(1).prop("href")).contains("guidance-2019-outputs.pdf");
        expect(rendered.find(InternalLink).length).eq(0);
    });

    test("renders stochastic content when touchstone is stochastic", () => {
        const stub = sandbox.setStubFunc(settings, "isVersionOfStochasticTouchstone", () => true );
        const rendered = shallow(<ResponsibilityOverviewDescription currentTouchstoneId={testTouchstoneId1} groupId={testGroupId} touchstoneStatus={touchstoneStatus}/>);
        expect(rendered.text().indexOf("Download csv templates for central and stochastic burden estimates")).to.greaterThan(-1);
        expect(rendered.text().indexOf("upload stochastic burden estimates for each scenario")).to.greaterThan(-1);
        expect(rendered.text().indexOf("Upload your parameters file")).to.greaterThan(-1);
    });

    test(
        "does not render stochastic content when touchstone is not stochastic",
        () => {
            const stub = sandbox.setStubFunc(settings, "isVersionOfStochasticTouchstone", () => false );
            const rendered = shallow(<ResponsibilityOverviewDescription currentTouchstoneId={testTouchstoneId1} groupId={testGroupId} touchstoneStatus={touchstoneStatus}/>);
            expect(rendered.text().indexOf("Download csv templates for central burden estimates")).to.greaterThan(-1);
            expect(rendered.text().indexOf("Stochastic estimates are not required for this touchstone")).to.greaterThan(-1);
            expect(rendered.text().indexOf("upload stochastic burden estimates for each scenario")).to.eq(-1);
            expect(rendered.text().indexOf("Upload your parameters file")).to.eq(-1);
        }
    );
});

