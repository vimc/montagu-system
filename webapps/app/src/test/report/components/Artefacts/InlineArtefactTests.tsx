import {shallow} from "enzyme";
import {
    ArtefactIFrame,
    ArtefactIFrameInner,
    InlineArtefact
} from "../../../../main/report/components/Artefacts/InlineArtefact";
import {mockArtefact} from "../../../mocks/mockModels";
import * as React from "react";
import {expect} from "chai";

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
        const wrappedIFrame = rendered.find(ArtefactIFrame);
        expect(wrappedIFrame).to.have.length(1, "Couldn't find ArtefactIFrame");
        expect(wrappedIFrame.prop("href")).to.equal("/reports/report/versions/version/artefacts/mock.png/");
    });
});

describe("ArtefactIFrame", () => {
    it("renders as expected", () => {
        const rendered = shallow(<ArtefactIFrameInner href="test" refreshToken={null} />);
        const iframe = rendered.find("iframe");
        expect(iframe).to.have.length(1);
        expect(iframe.prop("src")).to.eql("test&inline=true");
    });
});