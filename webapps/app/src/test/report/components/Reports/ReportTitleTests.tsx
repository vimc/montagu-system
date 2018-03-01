import * as React from "react";
import {shallow} from "enzyme";

import {expect} from "chai";
import {mockVersion} from "../../../mocks/mockModels";
import {ReportTitle} from "../../../../main/report/components/Reports/ReportTitle";

describe("ReportTitle", () => {

    it("renders display name and version id", () => {

        const versionDetails = mockVersion({displayname: "displayname", name: "name", id: "v1"});

        const rendered = shallow(<ReportTitle
            versionDetails={versionDetails}/>);

        expect(rendered.find("h1.h2").text()).to.eql("displayname");
        expect(rendered.find(".small").text()).to.eql("v1");

    });

    it("renders name if display name not present", () => {

        const versionDetails = mockVersion({displayname: null, name: "name"});

        const rendered = shallow(<ReportTitle
            versionDetails={versionDetails}/>);

        expect(rendered.find("h1.h2").text()).to.eql("name");

    });
});