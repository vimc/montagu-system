import {expect} from "chai";
import {shallow} from "enzyme";
import {ArtefactsSection} from "../../../../main/report/components/Artefacts/ArtefactsSection";
import {mockArtefact, mockVersion} from "../../../mocks/mockModels";
import * as React from "react";
import {ArtefactRow} from "../../../../main/report/components/Artefacts/ArtefactRow";
import {FileDownloadLink} from "../../../../main/report/components/FileDownloadLink";
import {ArtefactsList} from "../../../../main/report/components/Artefacts/ArtefactsList";

describe("ArtefactsSection", () => {
    it("renders zip download row", () => {
        const details = mockVersion({ id: "v1" });
        const rendered = shallow(<ArtefactsSection report="test_report" versionDetails={details}/>);
        const row = rendered.find(ArtefactRow);
        expect(row.children().find(FileDownloadLink).prop("href")).to.eq("/reports/test_report/versions/v1/all/");
    });

    it("renders artefacts list", () => {
        const artefacts = [
            { a: mockArtefact() },
            { b: mockArtefact() }
        ];
        const details = mockVersion({
            id: "v10",
            artefacts: artefacts
        });
        const rendered = shallow(<ArtefactsSection report="report" versionDetails={details}/>);
        const list = rendered.find(ArtefactsList);
        expect(list).to.have.length(1);
        expect(list.props()).to.eql({
            report: "report",
            version: "v10",
            artefacts: artefacts
        });
    });
});