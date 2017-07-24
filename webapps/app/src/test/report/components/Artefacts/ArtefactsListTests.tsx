import * as React from "react";
import {mount} from "enzyme";
import {expect} from "chai";
import {settings} from "../../../../main/shared/Settings";
import {ArtefactsList} from "../../../../main/report/components/Artefacts/ArtefactsList";
import {mockArtefact} from "../../../mocks/mockModels";

describe("ArtefactsList", () => {
    it("can render", () => {

        const fakeArtefactsArray = [
            {
                "staticgraph": mockArtefact({filename: "file.csv", description: "a file"})
            },
            {
                "csv": mockArtefact()
            }];

        const rendered = mount(<ArtefactsList report="reportname"
                                              version="versionname"
                                              artefacts={fakeArtefactsArray}/>);

        expect(rendered.find("li").length).to.eq(2);

        const item = rendered.find("li").at(0);
        const firstLink = item.find("a");

        expect(firstLink.prop("href")).to.eq(settings.reportingApiUrl() + "/reports/reportname/versionname/artefacts/file.csv");
        expect(firstLink.text()).to.eq("file.csv");

        const firstDescription = item.find("div");
        expect(firstDescription.text()).to.eq("(a file)");

    });

});