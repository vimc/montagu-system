import * as React from "react";
import { expect } from "chai";
import {  shallow } from "enzyme";
import { FileDownloadLink } from "../../../../main/report/components/FileDownloadLink";
import { Sandbox } from "../../../Sandbox";
import { ArtefactItem } from "../../../../main/report/components/Artefacts/ArtefactItem";
import {mockArtefact} from "../../../mocks/mockModels";
import {ReportDownloadSection} from "../../../../main/report/components/Reports/DownloadSection";

describe("ArtefactItem", () => {
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    const filenames = [
        "file1.txt",
        "subdir/file2.csv"
    ];
    const artefact = mockArtefact({filenames: filenames, description: "a file"});

    it("renders links", () => {

        const rendered = shallow(<ArtefactItem report="reportname" version="versionname"
                                                    artefact={artefact}/>);
        const links = rendered.find(ReportDownloadSection).children().find(FileDownloadLink);

        expect(links).to.have.length(2);
        expect(links.at(0).prop("href")).to.eq("/reports/reportname/versions/versionname/artefacts/file1.txt/");
        expect(links.at(0).children().first().text()).to.eq("file1.txt");
        expect(links.at(1).prop("href")).to.eq("/reports/reportname/versions/versionname/artefacts/subdir:file2.csv/");
        expect(links.at(1).children().first().text()).to.eq("subdir/file2.csv");

    });

    it("renders description", () => {
        const rendered = shallow(<ArtefactItem report="reportname" version="versionname"
                                                     artefact={artefact}/>);
        const row = rendered.find(ReportDownloadSection);
        expect(row.prop("title")).to.equal("a file");
    });

});