import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";

import {mockReport, mockBasicVersionDetails, mockReportRow} from "../../../../mocks/mockModels";
import {Sandbox} from "../../../../Sandbox";
import {
    LinkToReportCell,
    VersionCell,
} from "../../../../../main/report/components/ReportsList/ReportListColumns/VersionColumn";
import {
    ReportRow,
    ReportRowRenderProps,
    ReportsListTable
} from "../../../../../main/report/components/ReportsList/ReportListTable";
import {InternalLink} from "../../../../../main/shared/components/InternalLink";
import {Column} from "react-table";
import ReactTable from "react-table";

describe("ReportListTable", () => {

    const sandbox = new Sandbox();

    afterEach(function () {
        sandbox.restore();
    });

    function getVersionColumn(): Column {
        const rendered = shallow(<ReportsListTable reports={[]} isReviewer={true}/>);
        const columns = (rendered.find(ReactTable).prop("columns") as Column[]);
        return columns[3];
    }

    describe("VersionColumn", () => {

        it("creates data object with version id and last updated date", function () {

            const accessor = getVersionColumn().accessor as (row: object) => any;
            ;

            const now = new Date(2018, 4, 15);
            const result = accessor(mockReport({
                id: "1234",
                updated_on: now.toDateString()
            }));

            expect(result).to.eql({version: "1234", date: new Date(2018, 4, 15)});
        });

        it("renders version date", function () {
            const row: ReportRow = {
                ...mockReport({
                    name: "report_name"
                }),
                version: null
            };
            const result = shallow(<VersionCell row={row}
                                                value={{
                                                    version: "46324",
                                                    date: new Date(2018, 4, 15)
                                                }}/>);

            expect(result.find("div").first().childAt(0).text()).to.eq("Tue May 15 2018");
        });

        it("renders link cell", function () {

            const col = getVersionColumn() as Column.CellProps;
            const Cell = col.Cell as React.SFC<ReportRowRenderProps>;
            const row: ReportRow = {
                ...mockReport({
                    name: "report_name"
                }),
                version: null
            };

            const result = shallow(<Cell row={row} value={{
                version: "46324",
                date: new Date(2018, 4, 15)
            }}/>);

            const link = result.find(LinkToReportCell);
            expect(link.props()).to.deep.eq(row);

        });

        describe("LinkToReportCell", () => {

            it("renders link to report page", function () {
                const row: ReportRow = {
                    ...mockReport({
                        name: "report_name"
                    }),
                    version: mockBasicVersionDetails({version: "46324"})
                };

                const result = shallow(<LinkToReportCell {...row} />);

                const link = result.find(InternalLink);

                expect(link.childAt(0).text()).to.eq("View version");
                expect(link.prop("href")).to.eq("/report_name/46324/");
            });

        });

        it("sorts by date descending", function () {

            const col = getVersionColumn();
            const sortMethod = col.sortMethod;

            const a = {date: new Date(2018, 5, 14), version: "1234"};
            const b = {date: new Date(2018, 5, 13), version: "1234"};

            const result = sortMethod(a, b, null);
            expect(result).to.eq(-1);
        });

        it("gets most recent version for aggregate cell", function () {
            const col = getVersionColumn();
            const aggregate = col.aggregate;

            const a = {date: new Date(2018, 5, 9), version: "1234"};
            const b = {date: new Date(2018, 5, 13), version: "3456"};
            const c = {date: new Date(2018, 5, 10), version: "6789"};

            const result = aggregate([a, b, c], null);
            expect(result).to.eq(b);
        });

        it("displays link to latest version in aggregate cell", () => {

            const col = getVersionColumn();
            const AggregateCell = col.Aggregated as React.SFC<ReportRowRenderProps>;

            const rendered = shallow(<AggregateCell row={mockReportRow()}
                                                    value={mockBasicVersionDetails({version: "1234"})}/>);

            expect(rendered.find(InternalLink).childAt(0).text()).to.eq("View latest version");
            expect(rendered.find("span").childAt(1).text()).to.eq("(1234)");
        })

    });


});