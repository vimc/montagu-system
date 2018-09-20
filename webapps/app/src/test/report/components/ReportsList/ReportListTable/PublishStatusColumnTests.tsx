import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";

import {mockReportRow} from "../../../../mocks/mockModels";
import {Sandbox} from "../../../../Sandbox";
import ReactTable, {Column, Filter} from "react-table";
import {
    ReportRow,
    ReportRowRenderProps,
    ReportsListTable
} from "../../../../../main/report/components/ReportsList/ReportListTable";

describe("ReportListTable", () => {

    const sandbox = new Sandbox();

    afterEach(function () {
        sandbox.restore();
    });

    function getPublishStatusColumn(): Column {
        const rendered = shallow(<ReportsListTable reports={[]} isReviewer={true}/>);
        const columns = (rendered.find(ReactTable).prop("columns") as Column[]);
        return columns[2];
    }

    function getFilterMethod(): (filter: Partial<Filter>, row: any) => boolean {
        const col = getPublishStatusColumn() as Column.FilterProps;
   //     return (filter: Filter, row: any) => col.filterMethod(filter, row, null);
        return col.filterMethod as (filter: Partial<Filter>, row: any) => boolean
    }

    describe("PublishStatusColumn", () => {

        it("is not included if isReviewer is false", function () {
            const result = shallow(<ReportsListTable isReviewer={false} reports={[]}/>);
            expect(result.find(ReactTable).prop("columns").some(c => c.Header == "Status")).to.be.false;
        });

        it("is included if isReviewer is true", function () {
            const result = shallow(<ReportsListTable isReviewer={true} reports={[]}/>);
            expect(result.find(ReactTable).prop("columns").some(c => c.Header == "Status")).to.be.true;
        });

        it("renders published badge if status is published", function () {
            const col = getPublishStatusColumn() as Column.CellProps;
            const Cell = col.Cell as React.SFC<ReportRowRenderProps>;
            const result = shallow(<Cell row={mockReportRow()} value={true}/>);
            expect(result.find(".badge-published")).to.have.lengthOf(1);
        });

        it("renders internal badge if status is unpublished", function () {
            const col = getPublishStatusColumn() as Column.CellProps;
            const Cell = col.Cell as React.SFC<ReportRowRenderProps>;
            const result = shallow(<Cell row={mockReportRow()} value={false}/>);
            expect(result.find(".badge-internal")).to.have.lengthOf(1);
        });

        it("renders options to filter by status", function () {
            const onChange = sandbox.sinon.stub();
            const col = getPublishStatusColumn() as Column.FilterProps;
            const Filter = col.Filter as React.SFC<any>;
            const result = shallow(<Filter onChange={onChange}/>);
            expect(result.find("option").map(o => o.prop("value"))).to.have.members(["all", "published", "internal"])
        });

        describe("'published' filter option", () => {

            const publishedFilter = {value: "published"};

            it("reports with any published versions should show", function () {

                const filterMethod = getFilterMethod();
                
                let aggregateRow: Partial<ReportRow>  = {
                    // the aggregator function maps `published` to null
                    published: null,
                    subRows: [mockReportRow({published: true}), mockReportRow({published: false})]
                };

                expect(filterMethod(publishedFilter, aggregateRow)).to.be.true;
            });

            it("reports with no published versions should not show", function () {

                const filterMethod = getFilterMethod();
                
                let aggregateRow: Partial<ReportRow>  = {
                    published: null,
                    subRows: [mockReportRow({published: false}), mockReportRow({published: false})]
                };

                expect(filterMethod(publishedFilter, aggregateRow)).to.be.false;
            });

            it("versions that are published should show", function () {

                const filterMethod = getFilterMethod();
                
                let subRow: Partial<ReportRow>  = {
                    published: true
                };
                expect(filterMethod(publishedFilter, subRow)).to.be.true;
            });


            it("versions that are not published should not show", function () {

                const filterMethod = getFilterMethod();
                
                let subRow: Partial<ReportRow>  = {
                    published: false
                };

                expect(filterMethod(publishedFilter, subRow)).to.be.false;
            });
        });

        describe("'internal' filter option", () => {

            const internalFilter = {value: "internal"};

            it("reports with any internal versions should show", function () {

                const filterMethod = getFilterMethod();
                
                let aggregateRow: Partial<ReportRow> = {
                    published: null,
                    subRows: [mockReportRow({published: true}), mockReportRow({published: false})]
                };

                expect(filterMethod(internalFilter, aggregateRow)).to.be.true;
            });

            it("reports with no internal versions should not show", function () {

                const filterMethod = getFilterMethod();
                
                let aggregateRow: Partial<ReportRow> = {
                    published: null,
                    subRows: [mockReportRow({published: true}), mockReportRow({published: true})]
                };

                expect(filterMethod(internalFilter, aggregateRow)).to.be.false;
            });

            it("versions that are internal should show", function () {

                const filterMethod = getFilterMethod();
                
                let subRow: Partial<ReportRow>  = {
                    published: false
                };
                expect(filterMethod(internalFilter, subRow)).to.be.true;
            });


            it("versions that are published should not show", function () {

                const filterMethod = getFilterMethod();
                
                let subRow: Partial<ReportRow>  = {
                    published: true
                };

                expect(filterMethod(internalFilter, subRow)).to.be.false;
            });
        });

        describe("'all' filter option", () => {

            const allFilter = {value: "all"};

            it("reports with mixed versions should show", function () {

                const filterMethod = getFilterMethod();
                let aggregateRow: Partial<ReportRow>  = {
                    published: null,
                    subRows: [mockReportRow({published: true}), mockReportRow({published: false})]
                };

                expect(filterMethod(allFilter, aggregateRow)).to.be.true;
            });

            it("reports with all published versions should show", function () {

                const filterMethod = getFilterMethod();
                let aggregateRow: Partial<ReportRow>  = {
                    published: null,
                    subRows: [mockReportRow({published: true}), mockReportRow({published: true})]
                };

                expect(filterMethod(allFilter, aggregateRow)).to.be.true;
            });

            it("reports with all internal versions should show", function () {

                const filterMethod = getFilterMethod();
                let aggregateRow: Partial<ReportRow>  = {
                    published: null,
                    subRows: [mockReportRow({published: false}), mockReportRow({published: false})]
                };

                expect(filterMethod(allFilter, aggregateRow)).to.be.true;
            });

            it("versions that are internal should show", function () {

                const filterMethod = getFilterMethod();
                let subRow: Partial<ReportRow>  = {
                    published: false
                };
                expect(filterMethod(allFilter, subRow)).to.be.true;
            });


            it("versions that are published should show", function () {

                const filterMethod = getFilterMethod();
                let subRow: Partial<ReportRow>  = {
                    published: true
                };

                expect(filterMethod(allFilter, subRow)).to.be.true;
            });
        });

    });

});