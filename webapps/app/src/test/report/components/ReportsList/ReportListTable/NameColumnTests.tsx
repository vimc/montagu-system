import * as React from "react";
import {expect} from "chai";

import {
    nameAccessorFunction} from "../../../../../main/report/components/ReportsList/ReportListColumns/NameColumn";
import {Sandbox} from "../../../../Sandbox";
import {mockReport} from "../../../../mocks/mockModels";

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

        it("renders just name if no display name", function () {
            const result = nameAccessorFunction(mockReport({name: "name", display_name: null}));
            expect(result).to.eq("name");
        });

    });
});