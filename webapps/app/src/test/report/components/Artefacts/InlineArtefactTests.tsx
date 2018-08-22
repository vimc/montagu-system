import {shallow} from "enzyme";
import {InlineArtefact} from "../../../../main/report/components/Artefacts/InlineArtefact";
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
        const expectedUrl = "http://localhost:8081/v1/reports/report/versions/version/artefacts/mock.png?inline=true";
        const rendered = shallow(<InlineArtefact report="report" version="version" artefact={artefact}/>);
        const iframe = rendered.find("iframe");
        expect(iframe).to.have.length(1, "Couldn't find iframe");
        expect(iframe.prop("src")).to.equal(expectedUrl);
        const fullscreenLink = rendered.find("a");
        expect(fullscreenLink).to.have.length(1, "Couldn't find full screen link");
        expect(fullscreenLink.prop("href")).to.equal(expectedUrl);
    });
});
