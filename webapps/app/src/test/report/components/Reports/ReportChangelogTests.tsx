import * as React from "react";
import {shallow} from "enzyme";

import {expect} from "chai";
import {Sandbox} from "../../../Sandbox";
import {
    ChangelogRow,
    mapStateToProps,
    ReportChangelog,
    ReportChangelogComponent,
    ReportChangelogProps
} from "../../../../main/report/components/Reports/ReportChangelog";
import {mockReportAppState} from "../../../mocks/mockStates";
import {createMockStore} from "../../../mocks/mockStore";
import {Changelog} from "../../../../main/shared/models/Generated"
import {reportActionCreators} from "../../../../main/report/actionCreators/reportActionCreators";
import {InternalLink} from "../../../../main/shared/components/InternalLink";

describe("ReportChangelog", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    const mockChangelog = [
        {
            report_version: "20180123-155855-5d5b8238",
            label: "public",
            value: "public v1 test changelog message",
            from_file: true
        },
        {
            report_version: "20180123-155855-5d5b8238",
            label: "internal",
            value: "internal v1 test changelog message",
            from_file: true
        },
        {
            report_version: "20180104-082959-0544c986",
            label: "internal",
            value: "internal v2 test changelog message",
            from_file: false
        }
    ];

    describe("getPropsFromStores", () => {

        const expectedChangelog = [
            {
                report_version: "v1",
                label: "internal",
                value: "test changelog message",
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

            const expected: Partial<ReportChangelogProps> = {
                versionChangelog: expectedChangelog
            };
            expect(mapStateToProps(reportStateProps)).to.eql(expected);
        });

    });

    describe("ChangelogRow", () => {

        it("renders changelog items", () => {

            const rendered = shallow(<ChangelogRow reportName={"name"} version={"20180123-155855-5d5b8238"}
                                                   changelog={[mockChangelog[0], mockChangelog[1]]}/>);

            const cell = rendered.find("tr").find("td").at(1);
            const labels = cell.find(".changelog-label");
            const items = cell.find(".changelog-item");

            expect(labels.at(0).hasClass("badge-published")).to.be.true;
            expect(labels.at(0).text()).to.eql("public");
            expect(items.at(0).text()).to.eql("public v1 test changelog message");
            expect(items.at(0).hasClass("published")).to.be.true;

            expect(labels.at(1).hasClass("badge-internal")).to.eql(true);
            expect(labels.at(1).text()).to.eql("internal");
            expect(items.at(1).text()).to.eql("internal v1 test changelog message");
            expect(items.at(1).hasClass("internal")).to.be.true;
        });

        it("renders link to report versions", () => {

            const rendered = shallow(<ChangelogRow reportName={"name"} version={"20180123-155855-5d5b8238"}
                                                   changelog={[]}/>);

            const cell = rendered.find("td").at(0);
            expect(cell.find(InternalLink).childAt(0).text()).to.eql("Jan 23 2018, 15:58");
            expect(cell.find(InternalLink).prop("href")).to.eql("/name/20180123-155855-5d5b8238/");

        });
    });

    it("renders empty changelog", () => {

        const rendered = shallow(<ReportChangelogComponent
            versionChangelog={[]}
            report="reportname"
            version="v1"
            fetchChangelog={null}
        />);
        expect(rendered.find("h3").text()).to.eql("Changelog");
        expect(rendered.find("p").text()).to.eql("There is no Changelog for this Report version.");
    });

    it("renders one changelog row per version", () => {

        const rendered = shallow(<ReportChangelogComponent
            versionChangelog={mockChangelog}
            report="reportname"
            version="v2"
            fetchChangelog={null}
        />);

        expect(rendered.find("h3").text()).to.eql("Changelog");
        expect(rendered.find(ChangelogRow)).to.have.lengthOf(2);
    });

    it("fetches changelog when updates with null current changelog", () => {
        const store = createMockStore(mockReportAppState({reports: {versionChangelog: null}}));
        const fetchChangelogStub = sandbox.setStubReduxAction(reportActionCreators, "getVersionChangelog");

        //Render..
        const rendered = shallow(<ReportChangelog
            report="reportname"
            version="v2"
        />, {context: {store}}).dive();

        //Fetch on mount
        expect(fetchChangelogStub.calledOnce).to.be.true;

        //..then update
        rendered.setProps({version:"v3"});

        //Expect changelog to have been fetched twice, once on mount, and once on update
        expect(fetchChangelogStub.calledTwice).to.be.true;

    });

    it("does not fetch changelog when updates with non-null current changelog", () => {
        const changelog = [{
            report_version: "20180123-155855-5d5b8238",
            label: "public",
            value: "public test changelog message",
            from_file: true
        }];
        const store = createMockStore(mockReportAppState({reports: {versionChangelog: changelog}}));
        const fetchChangelogStub = sandbox.setStubReduxAction(reportActionCreators, "getVersionChangelog");

        //Render..
        const rendered = shallow(<ReportChangelog
            report="reportname"
            version="v2"
        />, {context: {store}}).dive();

        //Fetch on mount
        expect(fetchChangelogStub.calledOnce).to.be.true;

        //..then update
        rendered.instance().forceUpdate();

        //Changelog should not have been re-fetched
        expect(fetchChangelogStub.calledTwice).to.be.false;

    });

});