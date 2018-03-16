import {expect} from "chai";
import {shallow} from "enzyme";
import {ArtefactsSection} from "../../../../main/report/components/Artefacts/ArtefactsSection";
import {mockArtefact, mockVersion} from "../../../mocks/mockModels";
import * as React from "react";
import {FileDownloadLink} from "../../../../main/report/components/FileDownloadLink";
import {ArtefactsList} from "../../../../main/report/components/Artefacts/ArtefactsList";
import {ReportDownloadSection} from "../../../../main/report/components/Reports/DownloadSection";

describe("ArtefactsSection", () => {

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