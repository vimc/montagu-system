import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import {ArtefactsList} from "../../../../main/report/components/Artefacts/ArtefactsList";
import {mockArtefact} from "../../../mocks/mockModels";

describe("ArtefactsList", () => {
    it("renders list of ArtefactItems", () => {

        const fakeArtefactsArray = [
            {
                "staticgraph": mockArtefact({filename: "file.csv", description: "a file"})
            },
            {
                "csv": mockArtefact()
            }];

        const rendered = shallow(<ArtefactsList report="reportname"
                                              version="v1"
                                              artefacts={fakeArtefactsArray}/>);

        expect(rendered.find("ArtefactItem").length).to.eq(2);
        expect(rendered.find("ArtefactItem").at(0).prop("filename")).to.eq("file.csv");
        expect(rendered.find("ArtefactItem").at(0).prop("description")).to.eq("a file");
        expect(rendered.find("ArtefactItem").at(0).prop("version")).to.eq("v1");


    });

});