import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";

import {mockReportVersion} from "../../../../mocks/mockModels";
import {Sandbox} from "../../../../Sandbox";
import {
    VersionBadge,
    VersionCell,
} from "../../../../../main/report/components/ReportsList/ReportListColumns/VersionColumn";
import {ReportsListTable} from "../../../../../main/report/components/ReportsList/ReportListTable";
import {InternalLink} from "../../../../../main/shared/components/InternalLink";
import ReactTable, {Column} from "react-table";
import {ReportVersion} from "../../../../../main/shared/models/Generated";

describe("ReportListTable", () => {

    const sandbox = new Sandbox();

    afterEach(function () {
        sandbox.restore();
    });

    function getVersionColumn(): Column {
        const rendered = shallow(<ReportsListTable reports={[]} isReviewer={true}/>);
        const columns = (rendered.find(ReactTable).prop("columns") as Column[]);
        return columns[1];
    }

    describe("VersionColumn", () => {

        it("creates data object with version id and last updated date and report name", function () {

            const accessor = getVersionColumn().accessor as (row: object) => any;

            const now = new Date(2018, 4, 15);
            const result = accessor(mockReportVersion({
                id: "1234",
                date: now.toDateString(),
                name: "report-name"
            }));

            expect(result).to.eql({version: "1234", date: new Date(2018, 4, 15), name: "report-name"});
        });

        it("renders link with version date and id", function () {
            const original: ReportVersion = mockReportVersion({
                name: "report_name",
                latest_version: "12345"
            });

            const result = shallow(<VersionCell original={original}
                                                value={{
                                                    version: "46324",
                                                    date: new Date(2018, 4, 15),
                                                    name: "report_name"
                                                }}/>);

            expect(result.find("div").first().childAt(0).text()).to.eq("Tue May 15 2018");
            expect(result.find("div").last().text()).to.eq("(46324)");
            expect(result.find(InternalLink).prop("href")).to.eq("/report_name/46324/");
        });

        it("passes props to the latest version badge", function () {
            let original: ReportVersion = mockReportVersion({
                name: "report_name",
                latest_version: "12345"
            });

            let result = shallow(<VersionCell original={original}
                                              value={{
                                                  version: "46324",
                                                  date: new Date(2018, 4, 15),
                                                  name: "report_name"
                                              }}/>);

            expect(result.find(VersionBadge).prop("latest")).to.be.false;

            original["latest_version"] = "46324";

            result = shallow(<VersionCell original={original}
                                          value={{
                                              version: "46324",
                                              date: new Date(2018, 4, 15),
                                              name: "report_name"
                                          }}/>);

            expect(result.find(VersionBadge).prop("latest")).to.be.true
        });

        describe("VersionBadge", () => {

            it("shows latest if version is the latest", () => {

                const result = shallow(<VersionBadge latest={true}/>);
                expect(result.find("span").text()).to.eq("latest")
            });

            it("shows out-dated if version is not the latest", () => {

                const result = shallow(<VersionBadge latest={false}/>);
                expect(result.find("span").text()).to.eq("out-dated")
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

    });


});