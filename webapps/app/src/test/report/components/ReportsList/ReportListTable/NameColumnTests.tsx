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

        it("renders name if no display name", function () {
            const result = nameAccessorFunction(mockReport({name: "name", display_name: null}));
            expect(result).to.eq("name");
        });

        it("renders display name if it exists, with name in brackets", function () {
            const result = nameAccessorFunction(mockReport({name: "name", display_name: "display name"}));
            expect(result).to.eq("display name (name)");
        });

        it("renders link to report", function () {
            const result = shallow(<NameCell original={mockReport({name: "report_name", latest_version: "1234"})}
                                             value={"display name"}/>);

            expect(result.find(InternalLink).childAt(0).text()).to.eq("display name");
            expect(result.find(InternalLink).prop("href")).to.eq("/report_name/1234/");
        });

    });
});