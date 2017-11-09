import * as React from "react";
import { mount, shallow } from "enzyme";
import {expect} from "chai";
import {ResourceLinks} from "../../../../main/report/components/Resources/ResourceLinks";
import { FileDownloadLink } from "../../../../main/report/components/FileDownloadLink";
import { Sandbox } from "../../../Sandbox";

describe("ResourceLinks", () => {
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it("can render", () => {

        const testResources = [
            "R/someresource.csv",
            "someother.rds"
        ];

        const rendered = shallow(<ResourceLinks resources={testResources} report="reportname" version="versionname" />);
        const links = rendered.find('li').find(FileDownloadLink);

        expect(links.at(0).prop("href")).to.eq("/reports/reportname/versions/versionname/resources/R:someresource.csv/");
        expect(links.at(1).prop("href")).to.eq("/reports/reportname/versions/versionname/resources/someother.rds/");
    });

    it("renders nothing if no resources", () => {
        const rendered = shallow(<ResourceLinks resources={[]} report="reportname" version="versioname" />);
        expect(rendered.html()).to.be.null;
    });

});