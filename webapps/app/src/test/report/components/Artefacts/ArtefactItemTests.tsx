import * as React from "react";
import { expect } from "chai";
import {  shallow } from "enzyme";
import { FileDownloadLink } from "../../../../main/report/components/FileDownloadLink";
import { Sandbox } from "../../../Sandbox";
import { ArtefactItem } from "../../../../main/report/components/Artefacts/ArtefactItem";

const styles = require("../../../../main/report/styles/reports.css");

describe("ArtefactItem", () => {
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it("renders links", () => {
        const filenames = [
            "file1.txt",
            "subdir/file2.csv"
        ];
        const rendered = shallow(<ArtefactItem report="reportname" version="versionname"
                                                     filenames={filenames} description="a file"/>);
        const item = rendered.find(`.${styles.artefact}`).at(0);
        const links = item.find(FileDownloadLink);

        expect(links).to.have.length(2);
        expect(links.at(0).prop("href")).to.eq("/reports/reportname/versions/versionname/artefacts/file1.txt/");
        expect(links.at(0).children().first().text()).to.eq("file1.txt");
        expect(links.at(1).prop("href")).to.eq("/reports/reportname/versions/versionname/artefacts/subdir:file2.csv/");
        expect(links.at(1).children().first().text()).to.eq("subdir/file2.csv");

    });

    it("renders description", () => {

        const rendered = shallow(<ArtefactItem report="reportname" version="versionname"
                                                     filenames={["filename.csv"]} description="a file"/>);
        const item = rendered.find(`.${styles.artefact}`).at(0);
        const description = item.find("div");

        expect(description.text()).to.eq("a file");

    });

});