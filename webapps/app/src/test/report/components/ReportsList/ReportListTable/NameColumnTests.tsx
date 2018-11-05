import * as React from "react";
import {expect} from "chai";

import {Sandbox} from "../../../../Sandbox";
import {mockReportRow} from "../../../../mocks/mockModels";
import {shallow} from "enzyme";
import {
    ReportRow,
    ReportsListTable,
    TextFilter
} from "../../../../../main/report/components/ReportsList/ReportListTable";
import ReactTable, {Column, Filter, RowInfo} from "react-table";

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

    function getFilterMethod(): (filter: Partial<Filter>, row: any) => boolean {
        const col = getNameColumn() as Column.FilterProps;
        return col.filterMethod as (filter: Partial<Filter>, row: any) => boolean
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

        it("accesses name", function () {
            const accessor = getNameColumn().accessor as string;
            expect(accessor).to.eq("name");
        });
    });

    describe("NamFilterMethod", () => {


        it("returns true if any sub row matches name", function () {
            const filter = getFilterMethod();

            let aggregateRow: Partial<RowInfo> = {
                subRows: [{_original: {name: "testing", display_name: null}},
                    {_original: {name: "name", display_name: null}}]
            };

            expect(filter({value: "test"}, aggregateRow)).to.be.true;
        });

        it("returns true if any sub row matches display name", function () {
            const filter = getFilterMethod();

            let aggregateRow: Partial<RowInfo> = {
                subRows: [{_original: {name: "name", display_name: "test-val"}},
                    {_original: {name: "name", display_name: null}}]
            };

            expect(filter({value: "test"}, aggregateRow)).to.be.true;
        });

    });

    describe("NameCell", () => {

        const subRows: any[] = [{_original: {name: "name", display_name: null}},
            {_original: {name: "name", display_name: null}}];

        it("renders display name if it exists", function () {
            const col = getNameColumn() as Column;
            const Cell = col.PivotValue as React.SFC<Partial<RowInfo>>;
            const result = shallow(<Cell row={{name: "name", version: {version: "1232"}}}
                                         subRows={[{_original: {name: "name", display_name: "display name"}}]}
            />);

            expect(result.find(".name").text()).to.eq("display name");
        });

        it("renders just name if no display name", function () {
            const col = getNameColumn() as Column;
            const Cell = col.PivotValue as React.SFC<Partial<RowInfo>>;
            const result = shallow(<Cell row={{name: "name", version: {version: "1232"}}}
                                         subRows={subRows}
            />);

            expect(result.find(".name").text()).to.eq("name");
        });

        it("renders plural version count", function () {
            const col = getNameColumn() as Column;
            const Cell = col.PivotValue as React.SFC<Partial<RowInfo>>;

            let result = shallow(<Cell row={{name: "name", version: {version: "1232"}}}
                                       subRows={subRows}/>);

            expect(result.find(".text-muted").text()).to.eq("2 versions: ");
        });

        it("renders single version count", function () {
            const col = getNameColumn() as Column;
            const Cell = col.PivotValue as React.SFC<Partial<RowInfo>>;

            let result = shallow(<Cell row={{name: "name", version: {version: "1232"}}}
                                       subRows={[subRows[0]]}/>);

            expect(result.find(".text-muted").text()).to.eq("1 version: ");
        });
    })
});