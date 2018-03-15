import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import {ArtefactsList} from "../../../../main/report/components/Artefacts/ArtefactsList";
import {mockArtefact} from "../../../mocks/mockModels";

describe("ArtefactsList", () => {
    it("renders list of ArtefactItems", () => {
        const staticGraph = mockArtefact();
        const csv = mockArtefact();
        const fakeArtefactsArray = [
            {
                staticgraph: staticGraph
            },
            {
                csv: csv
            }
        ];

        const rendered = shallow(<ArtefactsList report="reportname"
                                                version="v1"
                                                artefacts={fakeArtefactsArray}/>);

        expect(rendered.find("ArtefactItem").length).to.eq(2);
        expect(rendered.find("ArtefactItem").at(0).prop("artefact")).to.eql(staticGraph);
        expect(rendered.find("ArtefactItem").at(1).prop("artefact")).to.eq(csv);
    });
});