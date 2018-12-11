import * as React from "react";
import {shallow} from "enzyme";

import {expect} from "chai";
import {Sandbox} from "../../../Sandbox";
import {
    mapStateToProps,
    ReportChangelogComponent,
    ReportChangelogProps
} from "../../../../main/report/components/Reports/ReportChangelog";
import {mockReportAppState} from "../../../mocks/mockStates";
import {Changelog} from "../../../../main/shared/models/Generated"

describe("ReportChangelog", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    describe("getPropsFromStores", () => {

        const expectedChangelog =[
            {
                report_version: "v1",
                label:"internal",
                value:"test changelog message",
                from_file: true
            }
            ];

        it("checks props mappings", () => {
            const reportStateProps = mockReportAppState({
                reports: {
                    versionChangelog: expectedChangelog,
                    currentReport: "reportname",
                    versionDetails: {id: "v1"},
                    versions: ["v1", "v2", "v3"],
                }
            });

            const expected: ReportChangelogProps = {
                report: "reportname",
                version: "v1",
                versionChangelog: expectedChangelog,
                onLoad: null
            };
            expect(mapStateToProps(reportStateProps)).to.eql(expected);
        });

    });

    it("renders empty changelog", () => {
        const empty : Changelog[] = [];
        const rendered = shallow(<ReportChangelogComponent
            versionChangelog={empty}
            report="reportname"
        />);
        expect(rendered.find("h3").text()).to.eql("Changelog");
        expect(rendered.find("p").text()).to.eql("There is no Changelog for this Report version.");
    });

    it("renders changelog", () => {
        const expectedChangelog =[
            {
                report_version: "v2",
                label:"public",
                value:"public test changelog message",
                from_file: true
            },
            {
                report_version: "v1",
                label:"internal",
                value:"internal test changelog message",
                from_file: false
            }
        ];
        const rendered = shallow(<ReportChangelogComponent
            versionChangelog={expectedChangelog}
            report="reportname"
        />);
        expect(rendered.find("h3").text()).to.eql("Changelog");

        const tableHeaders = rendered.find("th");
        expect(tableHeaders.at(0).text()).to.eql("Version");
        expect(tableHeaders.at(1).text()).to.eql("Label");
        expect(tableHeaders.at(2).text()).to.eql("Text");

        const firstRow = rendered.find("tbody tr").first();
        const firstRowCells = firstRow.find("td");
        expect(firstRowCells.at(0).text()).to.eql("v2");
        expect(firstRowCells.at(1).text()).to.eql("public");
        expect(firstRowCells.at(1).find("span").hasClass("badge-published")).to.eql(true);
        expect(firstRowCells.at(2).text()).to.eql("public test changelog message");

        const secondRow = rendered.find("tbody tr").at(1);
        const secondRowCells = secondRow.find("td");
        expect(secondRowCells.at(0).text()).to.eql("v1");
        expect(secondRowCells.at(1).text()).to.eql("internal");
        expect(secondRowCells.at(1).find("span").hasClass("badge-internal")).to.eql(true);
        expect(secondRowCells.at(2).text()).to.eql("internal test changelog message");
    });
});