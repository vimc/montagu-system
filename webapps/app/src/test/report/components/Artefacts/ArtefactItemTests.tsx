import * as React from "react";
import { expect } from "chai";
import { ArtefactItem } from "../../../../main/report/components/Artefacts/Artefact";
import { FileDownloadLink } from "../../../../main/report/components/FileDownloadLink";
import { Sandbox } from "../../../Sandbox";

describe("ArtefactItem", () => {
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it("renders link", () => {

        const rendered = sandbox.mount(<ArtefactItem report="reportname" version="versionname" filename="filename.csv" description="a file" />);
        const item = rendered.find("li").at(0);
        const link = item.find(FileDownloadLink);

        expect(rendered.find("li").length).to.eq(1);
        expect(link.prop("href")).to.eq("/reports/reportname/versionname/artefacts/filename.csv/");
        expect(link.text()).to.eq("filename.csv");

    });

    it("renders description", () => {

        const rendered = sandbox.mount(<ArtefactItem report="reportname" version="versionname" filename="filename.csv" description="a file" />);
        const item = rendered.find("li").at(0);
        const description = item.find("div");

        expect(description.text()).to.eq("(a file)");

    });

});