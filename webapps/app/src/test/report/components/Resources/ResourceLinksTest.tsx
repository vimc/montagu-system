import * as React from "react";
import {mount} from "enzyme";
import {expect} from "chai";
import {ResourceLinks} from "../../../../main/report/components/Resources/ResourceLinks";
import { FileDownloadLink } from "../../../../main/report/components/FileDownloadLink";
import { Sandbox } from "../../../Sandbox";

describe("ResourceLinks", () => {
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it("can render", () => {

        const testResources = {
            "R/someresource.csv": "23774uhkjhjk",
            "someother.rds": "480ujkdnsckjkl;"
        };

        const rendered = sandbox.mount(<ResourceLinks resources={testResources} report="reportname" version="versionname" />);
        const links = rendered.find('li').find(FileDownloadLink);

        expect(links.at(0).prop("href")).to.eq("/reports/reportname/versionname/resources/R:someresource.csv/");
        expect(links.at(1).prop("href")).to.eq("/reports/reportname/versionname/resources/someother.rds/");
    });

    it("shows 'none' if no resources", () => {

        const rendered = sandbox.mount(<ResourceLinks resources={{}} report="reportname" version="versioname" />);
        expect(rendered.text()).to.eq("none");

    });

});