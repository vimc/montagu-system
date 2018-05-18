import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";

import {mockReport} from "../../../../mocks/mockModels";
import {Sandbox} from "../../../../Sandbox";
import {
    latestVersionAccessorFunction,
    LatestVersionCell,
    versionFilterMethod, versionSortMethod,
} from "../../../../../main/report/components/ReportsList/ReportListColumns/VersionColumn";
import {ReportLatestVersionFilter} from "../../../../../main/report/components/ReportsList/ReportListColumns/LatestVersionFilter";
import {DateRangePicker} from "../../../../../main/shared/components/DatePicker/DateRangePicker";
import {DatePicker} from "../../../../../main/shared/components/DatePicker/DatePicker";

describe("ReportListComponent", () => {

    const sandbox = new Sandbox();

    beforeEach(function () {
        sandbox.restore();
    });


    describe("LatestVersionColumn", () => {

        it("creates data object with id and last updated date", function () {

            const now = new Date(2018, 4, 15);
            const result = latestVersionAccessorFunction(mockReport({
                latest_version: "1234",
                updated_on: now.toDateString()
            }));

            expect(result).to.eql({version: "1234", date: new Date(2018, 4, 15)});
        });

        it("renders version id and date", function () {
            const result = shallow(<LatestVersionCell original={mockReport({display_name: null})}
                                                      value={{
                                                          version: "46324",
                                                          date: new Date(2018, 4, 15)
                                                      }}/>);

            expect(result.find("div").first().childAt(0).text()).to.eq("Tue May 15 2018");
            expect(result.find("div").first().childAt(1).text()).to.eq("(46324)");
        });

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

            const result = shallow(<ReportLatestVersionFilter onChange={onChange} filter={filter}/>);

            expect(result.find(DateRangePicker).prop("value"))
                .to.eql({start: filterValue.start, end: filterValue.end});

        });

        it("passes through new start date to filter", function () {

            const onChange = sandbox.sinon.stub();

            const result = shallow(<ReportLatestVersionFilter onChange={onChange} filter={filter}/>);
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

            const result = shallow(<ReportLatestVersionFilter onChange={onChange} filter={filter}/>);
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

            const result = shallow(<ReportLatestVersionFilter onChange={onChange} filter={filter}/>);
            result.find("input").simulate("change", {target: {value: "newid"}});

            expect(onChange.calledWith({
                start: filterValue.start,
                end: filterValue.end,
                versionId: "newid"
            }))
        });

        it("filters reports by start date inclusive", function () {

            const row = {
                latest_version: {date: new Date(2017, 5, 14), version: "1234"}
            };

            let filter = {
                id: "version", value: {
                    start: new Date(2017, 5, 14),
                    end: new Date(2018, 5, 14),
                    versionId: ""
                }
            };

            let result = versionFilterMethod(filter, row as any);
            expect(result).to.be.true;

            filter = {
                id: "version", value: {
                    start: new Date(2017, 6, 14),
                    end: new Date(2018, 5, 14),
                    versionId: ""
                }
            };

            result = versionFilterMethod(filter, row as any);
            expect(result).to.be.false;

        });

        it("filters reports by end date inclusive", function () {

            const row = {
                latest_version: {date: new Date(2018, 5, 14), version: "1234"}
            };

            let filter = {
                id: "version", value: {
                    start: new Date(2017, 5, 14),
                    end: new Date(2018, 5, 14),
                    versionId: ""
                }
            };

            let result = versionFilterMethod(filter, row as any);
            expect(result).to.be.true;

            filter = {
                id: "version", value: {
                    start: new Date(2017, 5, 14),
                    end: new Date(2018, 5, 13),
                    versionId: ""
                }
            };

            result = versionFilterMethod(filter, row as any);
            expect(result).to.be.false;

        });

        it("filters reports by id", function () {

            const row = {
                latest_version: {date: new Date(2018, 5, 14), version: "1234"}
            };

            const filter = {
                id: "version", value: {
                    start: new Date(2017, 5, 14),
                    end: new Date(2018, 6, 14),
                    versionId: "5678"
                }
            };

            const result = versionFilterMethod(filter, row as any);
            expect(result).to.be.false;
        });


        it("sorts by date descending", function () {

            const a = {date: new Date(2018, 5, 14), version: "1234"};
            const b = {date: new Date(2018, 5, 13), version: "1234"};

            const result = versionSortMethod(a, b);
            expect(result).to.eq(-1);
        });


    });


});