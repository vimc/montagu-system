import * as React from "react";
import {shallow} from "enzyme";

import {expect} from "chai";
import {mockVersion} from "../../../mocks/mockModels";
import {Sandbox} from "../../../Sandbox";
import {ArtefactsSection} from "../../../../main/report/components/Artefacts/ArtefactsSection";
import {DataLinks} from "../../../../main/report/components/Data/DataLinks";
import {ResourceLinks} from "../../../../main/report/components/Resources/ResourceLinks";
import {ParameterList} from "../../../../main/report/components/Parameters/ParameterList";
import {mockReportAppState} from "../../../mocks/mockStates";
import {
    mapStateToProps, ReportDownloads,
    ReportDownloadsComponent,
    ReportDownloadsProps
} from "../../../../main/report/components/Reports/ReportDownloads";
import {ReportTitle} from "../../../../main/report/components/Reports/ReportTitle";
import {FileDownloadButton} from "../../../../main/shared/components/FileDownloadLink";
import {createMockReportStore} from "../../../mocks/mockStore";
import {LoadingElement} from "../../../../main/shared/partials/LoadingElement/LoadingElement";

describe("ReportDownloads", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("checks props mappings", () => {
        const reportStateProps = mockReportAppState({
            reports: {
                versionDetails: mockVersion(),
                currentReport: "reportname",
                versions: ["v1", "v2", "v3"],
            }
        });

        const expected: ReportDownloadsProps = {
            report: "reportname",
            versionDetails: mockVersion()
        };
        expect(mapStateToProps(reportStateProps)).to.eql(expected);
    });

    it("renders sub-components", () => {
        const details = mockVersion({
            id: "v1",
            hash_data: {foo: "bar"},
            resources: ["a", "b", "c"],
            parameters: {a: "1", b: "2"}
        });
        const rendered = shallow(<ReportDownloadsComponent
            versionDetails={details}
            report="reportname"
        />);
        expect(rendered.find(ArtefactsSection).props()).to.eql({
            report: "reportname",
            versionDetails: details
        });
        expect(rendered.find(DataLinks).props()).to.eql({
            foo: "bar"
        });
        expect(rendered.find(ResourceLinks).props()).to.eql({
            resources: ["a", "b", "c"],
            report: "reportname",
            version: "v1"
        });
        expect(rendered.find(ParameterList).props()).to.eql({
            a: "1",
            b: "2"
        });

    });

    it("renders title", () => {
        const version = mockVersion();

        const rendered = shallow(<ReportDownloadsComponent
            versionDetails={version}
            report="reportname"/>);

        expect(rendered.find(ReportTitle).props()).to.eql({
            versionDetails: version
        });
    });

    it("renders download zip button", () => {
        const version = mockVersion({ id: "v1" });
        const rendered = shallow(<ReportDownloadsComponent
            versionDetails={version}
            report="test_report"/>);

        const button = rendered.find(FileDownloadButton);
        expect(button.prop("href")).to.eq("/reports/test_report/versions/v1/all/");
    });

    it("renders LoadingElement when versionDetails is null", () => {
        const store = createMockReportStore({
            reports: {
                currentReport: "report",
                versionDetails: null
            }
        });
        const rendered = shallow(<ReportDownloads/>, {context: {store}}).dive().dive();
        expect(rendered.find(LoadingElement)).to.have.length(1);
    })

});