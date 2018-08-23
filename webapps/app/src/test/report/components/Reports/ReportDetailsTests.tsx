import * as React from "react";
import {shallow} from "enzyme";

import {expect} from "chai";
import {mockArtefact, mockVersion} from "../../../mocks/mockModels";
import {Sandbox} from "../../../Sandbox";
import {
    mapStateToProps,
    ReportDetails,
    ReportDetailsComponent,
    ReportDetailsProps
} from "../../../../main/report/components/Reports/ReportDetails";
import {mockReportAppState} from "../../../mocks/mockStates";
import {InlineArtefact} from "../../../../main/report/components/Artefacts/InlineArtefact";
import {ReportTitle} from "../../../../main/report/components/Reports/ReportTitle";
import {createMockReportStore} from "../../../mocks/mockStore";
import {LoadingElement} from "../../../../main/shared/partials/LoadingElement/LoadingElement";

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
            };
            expect(mapStateToProps(reportStateProps)).to.eql(expected);
        });

    });

    it("renders inline artefact", () => {
        const artefact = mockArtefact();
        const rendered = shallow(<ReportDetailsComponent
            versionDetails={mockVersion({id: "v1", artefacts: [{"a1": artefact}]})}
            report="reportname"
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
            report="reportname"/>);

        expect(rendered.find(ReportTitle).props()).to.eql({
            versionDetails: version
        });
    });

    it("renders LoadingElement when versionDetails is null", () => {
        const store = createMockReportStore({
            reports: {
                currentReport: "report",
                versionDetails: null
            }
        });
        const rendered = shallow(<ReportDetails/>, {context: {store}}).dive().dive();
        expect(rendered.find(LoadingElement)).to.have.length(1);
    })

});