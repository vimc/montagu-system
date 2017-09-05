import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import {ArtefactsList} from "../../../../main/report/components/Artefacts/ArtefactsList";
import {mockArtefact} from "../../../mocks/mockModels";

describe("ArtefactsList", () => {
    it("renders list of ArtefactItems", () => {
        const fakeArtefactsArray = [
            {
                "staticgraph": mockArtefact({
                    description: "a graph",
                    filenames: ["file.png"],
                })
            },
            {
                "staticgraph": mockArtefact({
                    description: "a different graph",
                    filenames: ["file2.png"],
                })
            },
            {
                "csv": mockArtefact()
            }
        ];

        const rendered = shallow(<ArtefactsList report="reportname"
                                              version="v1"
                                              artefacts={fakeArtefactsArray}/>);

        expect(rendered.find("ArtefactItem").length).to.eq(3);
        expect(rendered.find("ArtefactItem").at(0).prop("filenames")).to.eql(["file.png"]);
        expect(rendered.find("ArtefactItem").at(0).prop("description")).to.eq("a graph");
        expect(rendered.find("ArtefactItem").at(0).prop("version")).to.eq("v1");
    });
});