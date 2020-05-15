import * as React from "react";
import { shallow } from "enzyme";
import "../../../../helper";
import { Sandbox } from "../../../../Sandbox";
import {ResponsibilityOverviewDescription} from "../../../../../main/contrib/components/Responsibilities/Overview/ResponsibilityOverviewDescription";
import {settings} from "../../../../../main/shared/Settings";
import {InternalLink} from "../../../../../main/shared/components/InternalLink";

describe("Responsibility Overview Description Component", () => {

    const sandbox = new Sandbox();
    const itTouchstoneId1 = "t-1";
    const itTouchstoneId2 = "rfp-1";
    const itGroupId = "g-1";
    const touchstoneStatus="open";
    afterEach(() => sandbox.restore());

    it("renders component on touchstone not applicants", () => {
        const rendered = shallow(<ResponsibilityOverviewDescription currentTouchstoneId={itTouchstoneId1} groupId={itGroupId} touchstoneStatus={touchstoneStatus}/>);
        expect(rendered.text().indexOf("See an overview of which scenarios") > -1).toEqual(true);
    });

    it("renders component for 2019 applicants touchstone", () => {
        const rendered = shallow(<ResponsibilityOverviewDescription currentTouchstoneId={itTouchstoneId2} groupId={itGroupId} touchstoneStatus={touchstoneStatus}/>);
        expect(rendered.text().indexOf("Access the standardised demographic") > -1).toEqual(true);
    });

    it("renders component for 2020 applicants touchstone", () => {
        const touchstoneId = "2020rfp-1";
        const rendered = shallow(<ResponsibilityOverviewDescription currentTouchstoneId={touchstoneId} groupId={itGroupId} touchstoneStatus={touchstoneStatus}/>);
        expect(rendered.text().indexOf("test country named 'RFP'") > -1).toEqual(true);
    });

    it("renders component on touchstone is not open", () => {
        const rendered = shallow(<ResponsibilityOverviewDescription currentTouchstoneId={itTouchstoneId2} groupId={itGroupId} touchstoneStatus="finished"/>);
        expect(rendered.text().indexOf("This touchstone is no longer open")).toBeGreaterThan(-1);
    });

    it("renders no guidance content where isNoGuidanceTouchstone", () => {
        const rendered = shallow(<ResponsibilityOverviewDescription currentTouchstoneId={"op-2018-1"}
                                                                    groupId={itGroupId}
                                                                    touchstoneStatus={"open"}/>);
        const linksTitle = rendered.find("#useful-links");
        expect(linksTitle.length).toBe(0);

        const intLinks = rendered.find(InternalLink);
        expect(intLinks.length).toBe(0);

        const links = rendered.find("a");
        expect(links.length).toBe(0);
    });

    it("renders internal links for non-2019 touchstone", () => {
        const rendered = shallow(<ResponsibilityOverviewDescription currentTouchstoneId={"t1"}
                                                                    groupId={itGroupId}
                                                                    touchstoneStatus={"open"}/>);
        const linksTitle = rendered.find("#useful-links");
        expect(linksTitle.length).toBe(1);

        const link = rendered.find(InternalLink);

        expect(link.at(0).prop("href")).toBe("/help/model-inputs/t1");
        expect(link.at(1).prop("href")).toBe("/help/model-outputs/t1");
        expect(rendered.find("a").length).toBe(0);
    });

    it("renders external links for 2019 touchstone", () => {
        const rendered = shallow(<ResponsibilityOverviewDescription currentTouchstoneId={"201910"}
                                                                    groupId={itGroupId}
                                                                    touchstoneStatus={"open"}/>);
        const linksTitle = rendered.find("#useful-links");
        expect(linksTitle.length).toBe(1);

        const link = rendered.find("a");

        expect(link.at(0).prop("href")).toContain("guidance-2019-inputs.pdf");
        expect(link.at(1).prop("href")).toContain("guidance-2019-outputs.pdf");
        expect(rendered.find(InternalLink).length).toBe(0);
    });

    it("renders stochastic content when touchstone is stochastic", () => {
        const stub = sandbox.setStubFunc(settings, "isVersionOfStochasticTouchstone", () => true );
        const rendered = shallow(<ResponsibilityOverviewDescription currentTouchstoneId={itTouchstoneId1} groupId={itGroupId} touchstoneStatus={touchstoneStatus}/>);
        expect(rendered.text().indexOf("Download csv templates for central and stochastic burden estimates")).toBeGreaterThan(-1);
        expect(rendered.text().indexOf("upload stochastic burden estimates for each scenario")).toBeGreaterThan(-1);
        expect(rendered.text().indexOf("Upload your parameters file")).toBeGreaterThan(-1);
    });

    it(
        "does not render stochastic content when touchstone is not stochastic",
        () => {
            const stub = sandbox.setStubFunc(settings, "isVersionOfStochasticTouchstone", () => false );
            const rendered = shallow(<ResponsibilityOverviewDescription currentTouchstoneId={itTouchstoneId1} groupId={itGroupId} touchstoneStatus={touchstoneStatus}/>);
            expect(rendered.text().indexOf("Download csv templates for central burden estimates")).toBeGreaterThan(-1);
            expect(rendered.text().indexOf("Stochastic estimates are not required for this touchstone")).toBeGreaterThan(-1);
            expect(rendered.text().indexOf("upload stochastic burden estimates for each scenario")).toEqual(-1);
            expect(rendered.text().indexOf("Upload your parameters file")).toEqual(-1);
        }
    );
});

