import * as React from "react";
import {expect} from "chai";

import {Sandbox} from "../../../../Sandbox";
import {mockReport} from "../../../../mocks/mockModels";
import {shallow} from "enzyme";
import {ReportsListTable, TextFilter} from "../../../../../main/report/components/ReportsList/ReportListTable";
import ReactTable, {Column} from "react-table";

describe("ReportListTable", () => {

    const sandbox = new Sandbox();

    afterEach(function () {
        sandbox.restore();
    });

    function getNameColumn(): Column {
        const rendered = shallow(<ReportsListTable reports={[]} isReviewer={true}/>);
        const columns = (rendered.find(ReactTable).prop("columns") as Column[]);
       return columns[0];
    }

    describe("NameColumn", () => {

        it("is the pivot column", () => {
            const rendered = shallow(<ReportsListTable reports={[]} isReviewer={true}/>);
            expect(rendered.find(ReactTable).prop("pivotBy")).to.have.members(["name"]);
        });

        it("has text filter", () => {

            const nameCol = getNameColumn() as Column.FilterProps;
            expect(nameCol.Filter).to.eq(TextFilter);
        });

        it("accesses name and display name", function () {
            const accessor = getNameColumn().accessor as (row: object) => any;
            const result = accessor(mockReport({name: "name", display_name: "display name"}));
            expect(result).to.eq("display name (name)");
        });

        it("renders just name if no display name", function () {
            const accessor = getNameColumn().accessor as (row: object) => any;
            const result = accessor(mockReport({name: "name", display_name: null}));
            expect(result).to.eq("name");
        });

    });
});