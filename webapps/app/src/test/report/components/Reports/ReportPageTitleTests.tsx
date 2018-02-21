import {expect} from "chai";
import {
    ReportPageTitleComponent,
    ReportPageTitleProps,
    mapStateToProps
} from "../../../../main/report/components/Reports/ReportPageTitle";
import {mockVersion} from "../../../mocks/mockModels";
import {shallow} from "enzyme";
import * as React from "react";
import {Sandbox} from "../../../Sandbox";

import {mockReportState} from "../../../mocks/mockStates";

describe("ReportPageTitle", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("it maps props", () => {
        const mockVersionData = mockVersion();
        const reportStateMock = mockReportState({
            reports: {
                currentVersion: "v1",
                versionDetails: mockVersionData,
                currentReport: "forecast"
            }
        });
        const expectedProps: ReportPageTitleProps = {
            version: "v1",
            displayName: mockVersionData.displayname
        }
        expect(mapStateToProps(reportStateMock)).to.eql(expectedProps);
    });

    it("it maps props displayname if version details was missing", () => {
        const mockVersionData = mockVersion();
        const reportStateMock = mockReportState({
            reports: {
                currentVersion: "v1",
                currentReport: "forecast"
            }
        });
        const expectedProps: ReportPageTitleProps = {
            version: "v1",
            displayName: "forecast"
        }
        expect(mapStateToProps(reportStateMock)).to.eql(expectedProps);
    });

    it("it has displayname undefined if version details and current report were missing", () => {
        const mockVersionData = mockVersion();
        const reportStateMock = mockReportState({
            reports: {
                currentVersion: "v1"
            }
        });
        const expectedProps: ReportPageTitleProps = {
            version: "v1",
            displayName: undefined
        }
        expect(mapStateToProps(reportStateMock)).to.eql(expectedProps);
    });

    it("it renders report page title if pass props to component", () => {
        const mockVersionData = mockVersion();
        const reportStateMock = mockReportState({
            reports: {
                currentVersion: "v1",
                versionDetails: mockVersionData,
                currentReport: "forecast"
            }
        });
        const reportPageProps = mapStateToProps(reportStateMock);
        const rendered = shallow(<ReportPageTitleComponent {...reportPageProps} />);
        expect(rendered.find("div").at(0).text()).to.eql(mockVersionData.displayname);
    });

});