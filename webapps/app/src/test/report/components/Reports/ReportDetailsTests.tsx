import * as React from "react";
import {shallow} from "enzyme";

import {expect} from "chai";
import {mockVersion} from "../../../mocks/mockModels";
import {Sandbox} from "../../../Sandbox";
import {ReportDetailsComponent, ReportDetailsProps, mapStateToProps} from "../../../../main/report/components/Reports/ReportDetails";
import {ReportVersionSwitcher} from "../../../../main/report/components/Reports/ReportVersionSwitcher";
import {ArtefactsSection} from "../../../../main/report/components/Artefacts/ArtefactsSection";
import {DataLinks} from "../../../../main/report/components/Data/DataLinks";
import {ResourceLinks} from "../../../../main/report/components/Resources/ResourceLinks";
import {ParameterList} from "../../../../main/report/components/Parameters/ParameterList";
import {mockReportAppState} from "../../../mocks/mockStates";

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
            })
            const onChangeVersion = sandbox.sinon.stub();
            const reportPublicProps = {
                onChangeVersion
            }
            const expected: ReportDetailsProps = {
                report: "reportname",
                versionDetails: mockVersion(),
                ready: true,
                allVersions: ["v1", "v2", "v3"],
                onChangeVersion: onChangeVersion
            };
            expect(mapStateToProps(reportStateProps, reportPublicProps)).to.eql(expected);
        });

        it("is ready when version details is there", () => {
            const reportStateProps = mockReportAppState({
                reports: {
                    versionDetails: mockVersion(),
                }
            })
            const reportPublicProps = {
                onChangeVersion: sandbox.sinon.stub()
            }
            expect(mapStateToProps(reportStateProps, reportPublicProps).ready).to.eql(true);
        });

        it("is not ready when no version details", () => {
            const reportStateProps = mockReportAppState({
                reports: {
                }
            })
            const reportPublicProps = {
                onChangeVersion: sandbox.sinon.stub()
            }
            expect(mapStateToProps(reportStateProps, reportPublicProps).ready).to.eql(false);
        });

    });

    it("renders sub-components", () => {
        const details = mockVersion({
            id: "v1",
            hash_data: {foo: "bar"},
            resources: ["a", "b", "c"],
            parameters: {a: "1", b: "2"}
        });
        const rendered = shallow(<ReportDetailsComponent
            versionDetails={details}
            report="reportname"
            allVersions={[]}
            onChangeVersion={null}
            ready={true}
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

    it("renders report version switcher", () => {
        const handler = sandbox.sinon.stub();
        const rendered = shallow(<ReportDetailsComponent
            versionDetails={mockVersion({id: "v1"})}
            report="reportname"
            allVersions={["v1", "v2"]}
            onChangeVersion={handler}
            ready={true}
        />);
        expect(rendered.find(ReportVersionSwitcher).props()).to.eql({
            currentVersion: "v1",
            versions: ["v1", "v2"],
            onChangeVersion: handler
        });
    });

    it("emits onChangeVersion when switcher triggers it", () => {
        const handler = sandbox.sinon.stub();
        const rendered = shallow(<ReportDetailsComponent
            versionDetails={mockVersion({id: "v1"})}
            report="reportname"
            allVersions={["v1", "v2"]}
            onChangeVersion={handler}
            ready={true}
        />);
        rendered.find(ReportVersionSwitcher).simulate("changeVersion", "v3");
        expect(handler.calledWith("v3"));
    });

    it("renders name if display name not present", () => {
        const rendered = shallow(<ReportDetailsComponent
            versionDetails={mockVersion({ published: false, displayname: null, name: "name" })}
            report="report"
            allVersions={[]}
            onChangeVersion={null}
            ready={true}
        />);
        expect(rendered.find("h1.h2").text()).to.eql("name")
    });
});