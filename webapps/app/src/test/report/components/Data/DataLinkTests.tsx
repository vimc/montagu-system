import * as React from "react";
import {mount} from "enzyme";
import {expect} from "chai";
import {settings} from "../../../../main/shared/Settings";
import {ArtefactsList} from "../../../../main/report/components/Artefacts/ArtefactsList";
import {mockArtefact} from "../../../mocks/mockModels";
import {DataLinks} from "../../../../main/report/components/Data/DataLinks";

describe("DataLinks", () => {
    it("can render", () => {

        const fakeHash = "53269fehwjcfksd678";
        const fakeData =
            {
                "datasource": fakeHash,
                "another": "753927yhfdjwkncsalk"
            };

        const rendered = mount(<DataLinks {...fakeData}/>);

        expect(rendered.find("li").length).to.eq(2);

        const item = rendered.find("li").at(0);
        const firstLink = item.find("a").at(0);

        expect(firstLink.prop("href")).to.eq(settings.reportingApiUrl() + "/data/csv/" + fakeHash);
        expect(firstLink.text()).to.eq("Download csv");

        const secondLink = item.find("a").at(1);
        expect(secondLink.prop("href")).to.eq(settings.reportingApiUrl() + "/data/rds/" + fakeHash);
        expect(secondLink.text()).to.eq("Download rds");

    });

});