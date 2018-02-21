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

import {mockReportAppState} from "../../../mocks/mockStates";

describe("ReportPageTitle", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("it maps props", () => {
        const mockVersionData = mockVersion({ id: "v1" });
        const reportStateMock = mockReportState({
            reports: {
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

    it("it maps props displayname if version details displayname was empty", () => {
        const mockVersionData = mockVersion({ id: "v1", displayname: null });
        const reportStateMock = mockReportState({
            reports: {
                versionDetails: mockVersionData,
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
        const mockVersionData = mockVersion({ id: "v1", displayname: null });
        const reportStateMock = mockReportState({
            reports: {
                versionDetails: mockVersionData,
            }
        });
        const expectedProps: ReportPageTitleProps = {
            version: "v1",
            displayName: null
        }
        expect(mapStateToProps(reportStateMock)).to.eql(expectedProps);
    });

    it("it renders report page title if pass props to component", () => {
        const mockVersionData = mockVersion();
        const reportStateMock = mockReportAppState({
            reports: {
                versionDetails: mockVersionData,
                currentReport: "forecast"
            }
        });
        const reportPageProps = mapStateToProps(reportStateMock);
        const rendered = shallow(<ReportPageTitleComponent {...reportPageProps} />);
        expect(rendered.find("div").at(0).text()).to.eql(mockVersionData.displayname);
    });

});