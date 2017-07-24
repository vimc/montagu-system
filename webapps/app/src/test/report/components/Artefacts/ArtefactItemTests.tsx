import * as React from "react";
import {mount} from "enzyme";
import {expect} from "chai";
import {ResourceLinks} from "../../../../main/report/components/Resources/ResourceLinks";
import {settings} from "../../../../main/shared/Settings";
import {ArtefactItem} from "../../../../main/report/components/Artefacts/Artefact";

describe("ArtefactItem", () => {
    it("renders link", () => {

        const rendered = mount(<ArtefactItem report="reportname" version="versionname" filename="filename.csv" description="a file" />);
        const item = rendered.find("li").at(0);
        const link = item.find("a");

        expect(rendered.find("li").length).to.eq(1);
        expect(link.prop("href")).to.eq(settings.reportingApiUrl() + "/reports/reportname/versionname/artefacts/filename.csv");
        expect(link.text()).to.eq("filename.csv");

    });

    it("renders description", () => {

        const rendered = mount(<ArtefactItem report="reportname" version="versionname" filename="filename.csv" description="a file" />);
        const item = rendered.find("li").at(0);
        const description = item.find("div");

        expect(description.text()).to.eq("(a file)");

    });

});