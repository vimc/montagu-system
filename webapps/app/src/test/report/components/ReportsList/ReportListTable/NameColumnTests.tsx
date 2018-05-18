import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";

import {
    nameAccessorFunction,
    NameCell
} from "../../../../../main/report/components/ReportsList/ReportListColumns/NameColumn";
import {Sandbox} from "../../../../Sandbox";
import {mockReport} from "../../../../mocks/mockModels";
import {InternalLink} from "../../../../../main/shared/components/InternalLink";

describe("ReportListComponent", () => {

    const sandbox = new Sandbox();

    beforeEach(function () {
        sandbox.restore();
    });

    describe("NameColumn", () => {

        it("accesses name and display name", function () {
            const result = nameAccessorFunction(mockReport({name: "name", display_name: "display name"}));
            expect(result).to.eq("display name (name)");
        });

        it("renders link to report", function () {
            const result = shallow(<NameCell original={mockReport({name: "report_name", display_name: null,
                latest_version: "1234"})} value={""}/>);

            expect(result.find(InternalLink).childAt(0).text()).to.eq("report_name");
            expect(result.find(InternalLink).prop("href")).to.eq("/report_name/1234/");
        });

        it("renders link to report with display name if exists", function () {
            const result = shallow(<NameCell original={mockReport({name: "report_name", display_name: "display_name",
                latest_version: "1234"})} value={""}/>);

            expect(result.find(InternalLink).childAt(0).html()).to.eq("<div>display_name<br/>(report_name)</div>");
            expect(result.find(InternalLink).prop("href")).to.eq("/report_name/1234/");
        });

    });
});