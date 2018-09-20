import {shallow} from "enzyme";
import {ReportVersionFilter} from "../../../../../main/report/components/ReportsList/ReportListColumns/ReportVersionFilter";
import {expect} from "chai";
import {DateRangePicker} from "../../../../../main/shared/components/DatePicker/DateRangePicker";
import {DatePicker} from "../../../../../main/shared/components/DatePicker/DatePicker";
import * as React from "react";
import {Sandbox} from "../../../../Sandbox";
import {Column} from "react-table";
import {ReportRow, ReportsListTable} from "../../../../../main/report/components/ReportsList/ReportListTable";
import ReactTable from "react-table";
import {RecursivePartial} from "../../../../mocks/mockStates";

describe("ReportListComponent", () => {

    const sandbox = new Sandbox();

    afterEach(function () {
        sandbox.restore();
    });

    describe("ReportVersionFilter", () => {

        const filterValue = {
            start: new Date(2016, 12, 20),
            end: new Date(2018, 1, 12),
            versionId: "1234"
        };

        const filter = {
            id: "version", value: filterValue
        };

        it("renders date range picker", function () {

            const onChange = sandbox.sinon.stub();

            const result = shallow(<ReportVersionFilter onChange={onChange} filter={filter}/>);

            expect(result.find(DateRangePicker).prop("value"))
                .to.eql({start: filterValue.start, end: filterValue.end});

        });

        it("passes through new start date to filter", function () {

            const onChange = sandbox.sinon.stub();

            const result = shallow(<ReportVersionFilter onChange={onChange} filter={filter}/>);
            result.find(DateRangePicker).dive().find(DatePicker).first().simulate("change",
                new Date(2017, 12, 20));

            expect(onChange.calledWith({
                start: new Date(2017, 12, 20),
                end: filterValue.end,
                versionId: filterValue.versionId
            }))

        });

        it("passes through new end date to filter", function () {

            const onChange = sandbox.sinon.stub();

            const result = shallow(<ReportVersionFilter onChange={onChange} filter={filter}/>);
            result.find(DateRangePicker).dive().find(DatePicker).last().simulate("change",
                new Date(2017, 1, 10));

            expect(onChange.calledWith({
                start: filterValue.end,
                end: new Date(2017, 1, 10),
                versionId: filterValue.versionId
            }))

        });

        it("passes through new id to filter", function () {

            const onChange = sandbox.sinon.stub();

            const result = shallow(<ReportVersionFilter onChange={onChange} filter={filter}/>);
            result.find("input").simulate("change", {target: {value: "newid"}});

            expect(onChange.calledWith({
                start: filterValue.start,
                end: filterValue.end,
                versionId: "newid"
            }))
        });

        function getFilterMethod(): any {
            const rendered = shallow(<ReportsListTable reports={[]} isReviewer={true}/>);
            const columns = (rendered.find(ReactTable).prop("columns") as Column[]);
            const col = columns[1] as Column.FilterProps;
            return col.filterMethod;
        }

        describe("sub row filtering", () => {
            it("filters reports by start date inclusive", function () {

                const filterMethod = getFilterMethod();

                const row = {
                    version: {date: new Date(2017, 5, 14, 12, 1, 2), version: "1234"}
                };

                let filter = {
                    id: "version", value: {
                        start: new Date(2017, 5, 14),
                        end: new Date(2018, 5, 14),
                        versionId: ""
                    }
                };

                let result = filterMethod(filter, row);
                expect(result).to.be.true;

                filter = {
                    id: "version", value: {
                        start: new Date(2017, 6, 14),
                        end: new Date(2018, 5, 14),
                        versionId: ""
                    }
                };

                result = filterMethod(filter, row);
                expect(result).to.be.false;

            });

            it("filters reports by end date inclusive", function () {

                const filterMethod = getFilterMethod();

                const row = {
                    version: {date: new Date(2018, 5, 14, 12, 1, 2), version: "1234"}
                };

                let filter = {
                    id: "version", value: {
                        start: new Date(2017, 5, 14),
                        end: new Date(2018, 5, 14),
                        versionId: ""
                    }
                };

                let result = filterMethod(filter, row);
                expect(result).to.be.true;

                filter = {
                    id: "version", value: {
                        start: new Date(2017, 5, 14),
                        end: new Date(2018, 5, 13),
                        versionId: ""
                    }
                };

                result = filterMethod(filter, row);
                expect(result).to.be.false;

            });

            it("filters reports by id", function () {

                const filterMethod = getFilterMethod();

                const row = {
                    version: {date: new Date(2018, 5, 14), version: "1234"}
                };

                const filter = {
                    id: "version", value: {
                        start: new Date(2017, 5, 14),
                        end: new Date(2018, 6, 14),
                        versionId: "5678"
                    }
                };

                const result = filterMethod(filter, row as any);
                expect(result).to.be.false;
            });
        });

        describe("aggregate row filtering", () => {
            it("filters by sub rows start date inclusive", () => {
                const filterMethod = getFilterMethod();

                const subRow = {
                    version: {date: new Date(2017, 5, 14, 12, 1, 2), version: "1234"}
                };

                const earlierSubRow = {
                    version: {date: new Date(2017, 1, 1 , 12, 1, 2), version: "3456"}
                };

                let filter = {
                    id: "version", value: {
                        start: new Date(2017, 5, 14),
                        end: new Date(2018, 5, 14),
                        versionId: ""
                    }
                };

                const aggregateRow = {
                    subRows: [subRow, earlierSubRow]
                };

                let result = filterMethod(filter, aggregateRow);
                expect(result).to.be.true;

                filter = {
                    id: "version", value: {
                        start: new Date(2017, 6, 14),
                        end: new Date(2018, 5, 14),
                        versionId: ""
                    }
                };

                result = filterMethod(filter, aggregateRow);
                expect(result).to.be.false;
            });

            it("filters by sub rows end date inclusive", () => {
                const filterMethod = getFilterMethod();

                const subRow = {
                    version: {date: new Date(2018, 5, 14, 12, 1, 2), version: "1234"}
                };

                const laterSubRow = {
                    version: {date: new Date(2018, 6, 1 , 12, 1, 2), version: "3456"}
                };

                let aggregateRow = {
                    subRows: [subRow, laterSubRow]
                };

                let filter = {
                    id: "version", value: {
                        start: new Date(2017, 5, 14),
                        end: new Date(2018, 5, 14),
                        versionId: ""
                    }
                };

                let result = filterMethod(filter, aggregateRow);
                expect(result).to.be.true;

                filter = {
                    id: "version", value: {
                        start: new Date(2017, 5, 14),
                        end: new Date(2018, 5, 13),
                        versionId: ""
                    }
                };

                result = filterMethod(filter, aggregateRow);
                expect(result).to.be.false;
            });

            it("filters by sub rows id", function () {

                const filterMethod = getFilterMethod();

                const goodSubRow = {
                    version: {date: new Date(2018, 5, 14), version: "1234"}
                };

                const badSubRow = {
                    version: {date: new Date(2018, 5, 14), version: "5678"}
                };

                const filter = {
                    id: "version", value: {
                        start: new Date(2017, 5, 14),
                        end: new Date(2018, 6, 14),
                        versionId: "1234"
                    }
                };

                let aggregateRow = {
                    subRows: [goodSubRow, badSubRow]
                };

                let result = filterMethod(filter, aggregateRow);
                expect(result).to.be.true;

                aggregateRow = {
                    subRows: [badSubRow]
                };

                result = filterMethod(filter, aggregateRow);
                expect(result).to.be.false;
            });
        });



    });

});




