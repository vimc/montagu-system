import {shallow} from "enzyme";
import {ArtefactIFrame, InlineArtefact} from "../../../../main/report/components/Artefacts/InlineArtefact";
import {mockArtefact} from "../../../mocks/mockModels";
import * as React from "react";
import {expect} from "chai";
import {OneTimeLinkContext} from "../../../../main/report/components/OneTimeLinkContext";

describe("InlineArtefact", () => {
    it("ignores CSV file", () => {
        const artefact = mockArtefact({
            filenames: ["mock.csv"]
        });
        const rendered = shallow(<InlineArtefact report="report" version="version" artefact={artefact}/>);
        expect(rendered.html()).to.be.null;
    });

    it("renders iframe for valid file", () => {
        const artefact = mockArtefact({
            filenames: ["mock.png"]
        });
        const rendered = shallow(<InlineArtefact report="report" version="version" artefact={artefact}/>);
        const context = rendered.find(OneTimeLinkContext);
        expect(context).to.have.length(1);
        expect(context.prop("href")).to.equal("/reports/report/versions/version/artefacts/mock.png/");
        const iframe = context.find(ArtefactIFrame);
        expect(iframe).to.have.length(1);
    });
});

describe("ArtefactIFrame", () => {
    it("renders as expected", () => {
        const rendered = shallow(<ArtefactIFrame href="test" refreshToken={null} />);
        const iframe = rendered.find("iframe");
        expect(iframe).to.have.length(1);
        expect(iframe.prop("src")).to.eql("test&inline=true");
    });
});