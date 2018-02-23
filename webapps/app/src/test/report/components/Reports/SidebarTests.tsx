import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import {PublishSwitch} from "../../../../main/report/components/Reports/PublishSwitch";
import {Sandbox} from "../../../Sandbox";
import {mapStateToProps, SidebarComponent, SidebarProps} from "../../../../main/report/components/Reports/Sidebar";
import {mockAuthState, mockReportAppState, mockReportsState} from "../../../mocks/mockStates";
import {mockVersion} from "../../../mocks/mockModels";

describe("Sidebar", () => {

    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it("renders publish switch if user is reviewer", () => {

        const props: SidebarProps = {
            published: true,
            isReviewer: true,
            ready: true,
            name: "name",
            version: "v1"
        };

        const rendered = shallow(<SidebarComponent {...props} />);
        expect(rendered.find(PublishSwitch)).to.have.lengthOf(1);
    });


    it("does not render publish switch if user is not reviewer", () => {

        const props: SidebarProps = {
            published: true,
            isReviewer: false,
            ready: true,
            name: "name",
            version: "v1"
        };

        const rendered = shallow(<SidebarComponent {...props} />);
        expect(rendered.find(PublishSwitch)).to.have.lengthOf(0);
    });

    it("does not render publish switch if details are not ready", () => {

        const props: SidebarProps = {
            published: true,
            isReviewer: true,
            ready: false,
            name: "name",
            version: "v1"
        };

        const rendered = shallow(<SidebarComponent {...props} />);
        expect(rendered.find(PublishSwitch)).to.have.lengthOf(0);
    });

    it("gets reviewer status from app state", () => {

        let state = mockReportAppState({
            auth: mockAuthState({permissions: ["*/reports.review"]}),
            reports: mockReportsState({versionDetails: mockVersion()})
        });

        let result = mapStateToProps(state, {});

        expect(result.isReviewer).to.be.true;

        state = mockReportAppState({
            auth: mockAuthState({permissions: []})
        });

        result = mapStateToProps(state, {});

        expect(result.isReviewer).to.be.false;

    });

    it("gets publish status from app state", () => {

        let state = mockReportAppState({
            reports: mockReportsState({versionDetails: {published: false}})
        });

        let result = mapStateToProps(state, {});

        expect(result.published).to.be.false;

        state = mockReportAppState({
            reports: mockReportsState({versionDetails: {published: true}})
        });

        result = mapStateToProps(state, {});

        expect(result.published).to.be.true;

    });

    it("is not ready when version details are null", () => {

        let state = mockReportAppState();
        let result = mapStateToProps(state, {});

        expect(result.ready).to.be.false;
    });

    it("is ready when version details are non null", () => {

        let state = mockReportAppState({
            reports:
                mockReportsState({versionDetails: {published: false}})
        });
        let result = mapStateToProps(state, {});

        expect(result.ready).to.be.true;
    });

});