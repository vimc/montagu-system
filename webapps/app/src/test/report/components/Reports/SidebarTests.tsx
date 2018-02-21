import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import {PublishSwitch} from "../../../../main/report/components/Reports/PublishSwitch";
import {Sandbox} from "../../../Sandbox";
import {mapStateToProps, SidebarComponent, SidebarProps} from "../../../../main/report/components/Reports/Sidebar";
import {mockAuthState, mockReportAppState, mockReportsState} from "../../../mocks/mockStates";

describe("Sidebar", () => {

    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it("renders publish switch if user is reviewer", () => {

        const props: SidebarProps = {
            name: "report-name",
            version: "v1",
            published: true,
            isReviewer: true,
            ready: true
        };

        const rendered = shallow(<SidebarComponent {...props} />);
        expect(rendered.find(PublishSwitch)).to.have.lengthOf(1);
    });


    it("does not render publish switch if user is not reviewer", () => {

        const props: SidebarProps = {
            name: "report-name",
            version: "v1",
            published: true,
            isReviewer: false,
            ready: true
        };

        const rendered = shallow(<SidebarComponent {...props} />);
        expect(rendered.find(PublishSwitch)).to.have.lengthOf(0);
    });

    it("does not render publish switch if details are not ready", () => {

        const props: SidebarProps = {
            name: "report-name",
            version: "v1",
            published: true,
            isReviewer: true,
            ready: false
        };

        const rendered = shallow(<SidebarComponent {...props} />);
        expect(rendered.find(PublishSwitch)).to.have.lengthOf(0);
    });

    it("gets reviewer status from app state", () => {

        const props: Partial<SidebarProps> = {
            name: "report-name",
            version: "v1"
        };

        let state = mockReportAppState({
            auth: mockAuthState({permissions: ["*/reports.review"]})
        });

        let result = mapStateToProps(state, props);

        expect(result.isReviewer).to.be.true;

        state = mockReportAppState({
            auth: mockAuthState({permissions: []})
        });

        result = mapStateToProps(state, props);

        expect(result.isReviewer).to.be.false;

    });

    it("gets publish status from app state", () => {

        const props: Partial<SidebarProps> = {
            name: "report-name",
            version: "v1"
        };

        let state = mockReportAppState({
            reports: mockReportsState({versionDetails: {published: false}})
        });

        let result = mapStateToProps(state, props);

        expect(result.published).to.be.false;

        state = mockReportAppState({
            reports: mockReportsState({versionDetails: {published: true}})
        });

        result = mapStateToProps(state, props);

        expect(result.published).to.be.true;

    });

    it("is not ready when version details are null", () => {

        const props: Partial<SidebarProps> = {
            name: "report-name",
            version: "v1"
        };

        let state = mockReportAppState();
        let result = mapStateToProps(state, props);

        expect(result.ready).to.be.false;
    });

    it("is ready when version details are non null", () => {

        const props: Partial<SidebarProps> = {
            name: "report-name",
            version: "v1"
        };

        let state = mockReportAppState({
            reports:
                mockReportsState({versionDetails: {published: false}})
        });
        let result = mapStateToProps(state, props);

        expect(result.ready).to.be.true;
    });

});