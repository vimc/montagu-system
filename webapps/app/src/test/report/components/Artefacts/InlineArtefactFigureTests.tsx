import {shallow} from "enzyme";
import {mockArtefact} from "../../../mocks/mockModels";
import * as React from "react";
import {expect} from "chai";
import {ArtefactFigure, InlineArtefactFigure} from "../../../../main/report/components/Artefacts/InlineArtefactFigure";

describe("InlineArtefactFigure", () => {
    it("ignores CSV file", () => {
        const artefact = mockArtefact({
            filenames: ["mock.csv"]
        });
        const rendered = shallow(<InlineArtefactFigure report="report" version="version" artefact={artefact}/>);
        expect(rendered.html()).to.be.null;
    });

    it("renders artefact figure for valid image file", () => {
        const artefact = mockArtefact({
            filenames: ["mock.png"]
        });
        const rendered = shallow(<InlineArtefactFigure report="report" version="version" artefact={artefact}/>);
        const figure = rendered.find(ArtefactFigure);
        expect(figure).to.have.length(1);
        expect(figure.prop("href")).to.equal("/reports/report/versions/version/artefacts/mock.png/");
    });
});
