import * as React from "react";
import {mount} from "enzyme";
import {expect} from "chai";
import {ResourceLinks} from "../../../../main/report/components/Resources/ResourceLinks";
import {settings} from "../../../../main/shared/Settings";
import {ArtefactItem} from "../../../../main/report/components/Artefacts/Artefact";

describe("ArtefactItem", () => {
    it("can render", () => {

        const rendered = mount(<ArtefactItem report="reportname" version="versionname" filename="filename.csv" description="a file" />);

        expect(rendered.find("li").length).to.eq(1);

        const item = rendered.find("li").at(0);
        const link = item.find("a");

        expect(link.prop("href")).to.eq(settings.reportingApiUrl() + "/reports/reportname/versionname/artefacts/filename.csv");
        expect(link.text()).to.eq("filename.csv");

        const description = item.find("div");
        expect(description.text()).to.eq("(a file)");

    });

});