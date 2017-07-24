import * as React from "react";
import {mount} from "enzyme";
import {expect} from "chai";
import {ResourceLinks} from "../../../../main/report/components/Resources/ResourceLinks";
import {settings} from "../../../../main/shared/Settings";

describe("ResourceLinks", () => {
    it("can render", () => {

        const testResources = {
            "someresource.csv": "23774uhkjhjk",
            "someother.rds": "480ujkdnsckjkl;"
        };

        const rendered = mount(<ResourceLinks resources={testResources} report="reportname" version="versionname" />);
        const links = rendered.find('li a');

        expect(links.at(0).prop("href")).to.eq(settings.reportingApiUrl() + "/reports/reportname/versionname/resources/someresource.csv");
        expect(links.at(1).prop("href")).to.eq(settings.reportingApiUrl() + "/reports/reportname/versionname/resources/someother.rds");
    });

    it("shows 'none' if no resources", () => {

        const rendered = mount(<ResourceLinks resources={{}} report="reportname" version="versioname" />);
        expect(rendered.text()).to.eq("none");

    });

});