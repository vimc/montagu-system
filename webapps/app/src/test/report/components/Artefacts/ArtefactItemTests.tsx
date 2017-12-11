import * as React from "react";
import { expect } from "chai";
import {  shallow } from "enzyme";
import { FileDownloadLink } from "../../../../main/report/components/FileDownloadLink";
import { Sandbox } from "../../../Sandbox";
import { ArtefactItem } from "../../../../main/report/components/Artefacts/ArtefactItem";
import {ArtefactRow} from "../../../../main/report/components/Artefacts/ArtefactRow";

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
        const links = rendered.find(ArtefactRow).children().find(FileDownloadLink);

        expect(links).to.have.length(2);
        expect(links.at(0).prop("href")).to.eq("/reports/reportname/versions/versionname/artefacts/file1.txt/");
        expect(links.at(0).children().first().text()).to.eq("file1.txt");
        expect(links.at(1).prop("href")).to.eq("/reports/reportname/versions/versionname/artefacts/subdir:file2.csv/");
        expect(links.at(1).children().first().text()).to.eq("subdir/file2.csv");

    });

    it("renders description", () => {
        const rendered = shallow(<ArtefactItem report="reportname" version="versionname"
                                                     filenames={["filename.csv"]} description="a file"/>);
        const row = rendered.find(ArtefactRow);
        expect(row.prop("description")).to.equal("a file");
    });

});