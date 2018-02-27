import * as React from "react";
import {shallow} from "enzyme";

import {expect} from "chai";
import {mockArtefact, mockVersion} from "../../../mocks/mockModels";
import {Sandbox} from "../../../Sandbox";
import {
    ReportDetailsComponent,
    ReportDetailsProps,
    mapStateToProps
} from "../../../../main/report/components/Reports/ReportDetails";
import {mockReportAppState} from "../../../mocks/mockStates";
import {InlineArtefact} from "../../../../main/report/components/Artefacts/InlineArtefact";
import {ReportTitle} from "../../../../main/report/components/Reports/ReportTitle";

describe("ReportDetails", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    describe("getPropsFromStores", () => {

        it("checks props mappings", () => {
            const reportStateProps = mockReportAppState({
                reports: {
                    versionDetails: mockVersion(),
                    currentReport: "reportname",
                    versions: ["v1", "v2", "v3"],
                }
            });

            const expected: ReportDetailsProps = {
                report: "reportname",
                versionDetails: mockVersion(),
                ready: true
            };
            expect(mapStateToProps(reportStateProps)).to.eql(expected);
        });

        it("is ready when version details is there", () => {
            const reportStateProps = mockReportAppState({
                reports: {
                    versionDetails: mockVersion(),
                }
            });
            expect(mapStateToProps(reportStateProps).ready).to.eql(true);
        });

        it("is not ready when no version details", () => {
            const reportStateProps = mockReportAppState({
                reports: {}
            });
            expect(mapStateToProps(reportStateProps).ready).to.eql(false);
        });

    });

    it("renders inline artefact", () => {
        const artefact = mockArtefact();
        const rendered = shallow(<ReportDetailsComponent
            versionDetails={mockVersion({id: "v1", artefacts: [{"a1": artefact}]})}
            report="reportname"
            ready={true}
        />);
        expect(rendered.find(InlineArtefact).props()).to.eql({
            version: "v1",
            report: "reportname",
            artefact: artefact
        });
    });

    it("renders title", () => {
        const version = mockVersion();

        const rendered = shallow(<ReportDetailsComponent
            versionDetails={version}
            report="reportname"
            ready={true}/>);

        expect(rendered.find(ReportTitle).props()).to.eql({
            versionDetails: version
        });
    });

});