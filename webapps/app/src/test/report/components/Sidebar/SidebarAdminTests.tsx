import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import {Sandbox} from "../../../Sandbox";
import {PublicProps, ReportTabEnum} from "../../../../main/report/components/Sidebar/Sidebar";
import {mockAuthState, mockReportAppState, mockReportsState, mockUsersState} from "../../../mocks/mockStates";
import {mockUser, mockVersion} from "../../../mocks/mockModels";
import {ReportVersionSwitcher} from "../../../../main/report/components/Reports/ReportVersionSwitcher";
import {
    mapStateToProps,
    SidebarAdminComponent,
    SidebarAdminProps
} from "../../../../main/report/components/Sidebar/SidebarAdmin";
import {PublishSwitch} from "../../../../main/report/components/Sidebar/PublishSwitch";

describe("SidebarAdmin", () => {

    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    const defaultTabProps: PublicProps = {
        active: ReportTabEnum.REPORT,
        onChangeVersion: () => {
        }
    };

    const defaultSidebarProps: SidebarAdminProps = {
        published: true,
        isReviewer: true,
        isAdmin: true,
        ready: true,
        report: "name",
        version: "v1",
        onChangeVersion: () => {
        },
        allVersions: ["v1", "v2"],
        reportReaders: [mockUser()]
    };

    it("renders report version switcher", () => {

        const handler = sandbox.sinon.stub();
        const props = defaultSidebarProps;
        props.onChangeVersion = handler;

        const rendered = shallow(<SidebarAdminComponent {...props} />);
        expect(rendered.find(ReportVersionSwitcher).props()).to.eql({
            currentVersion: "v1",
            versions: ["v1", "v2"],
            onChangeVersion: handler
        });
    });

    it("emits onChangeVersion when switcher triggers it", () => {
        const handler = sandbox.sinon.stub();
        const props = defaultSidebarProps;
        props.onChangeVersion = handler;

        const rendered = shallow(<SidebarAdminComponent {...props} />);
        rendered.find(ReportVersionSwitcher).simulate("changeVersion", "v3");
        expect(handler.calledWith("v3"));
    });


    it("renders publish switch if user is reviewer", () => {

        const props = defaultSidebarProps;
        props.isReviewer = true;

        const rendered = shallow(<SidebarAdminComponent {...props} />);
        expect(rendered.find(PublishSwitch)).to.have.lengthOf(1);
    });


    it("does not render publish switch if user is not reviewer", () => {

        const props = defaultSidebarProps;
        props.isReviewer = false;

        const rendered = shallow(<SidebarAdminComponent {...props} />);
        expect(rendered.find(PublishSwitch)).to.have.lengthOf(0);
    });

    it("does not render publish switch if details are not ready", () => {

        const props = defaultSidebarProps;
        props.isReviewer = true;
        props.ready = false;

        const rendered = shallow(<SidebarAdminComponent {...props} />);
        expect(rendered.find(PublishSwitch)).to.have.lengthOf(0);
    });

    it("gets reviewer status from app state", () => {

        let state = mockReportAppState({
            auth: mockAuthState({permissions: ["*/reports.review"]}),
            reports: mockReportsState({versionDetails: mockVersion()})
        });

        let result = mapStateToProps(state, defaultTabProps);

        expect(result.isReviewer).to.be.true;

        state = mockReportAppState({
            auth: mockAuthState({permissions: []})
        });

        result = mapStateToProps(state, defaultTabProps);

        expect(result.isReviewer).to.be.false;

    });

    it("gets admin status from app state", () => {

        let state = mockReportAppState({
            auth: mockAuthState({permissions: ["*/roles.read"]}),
            reports: mockReportsState({versionDetails: mockVersion()})
        });

        let result = mapStateToProps(state, defaultTabProps);

        expect(result.isAdmin).to.be.true;

        state = mockReportAppState({
            auth: mockAuthState({permissions: []})
        });

        result = mapStateToProps(state, defaultTabProps);

        expect(result.isAdmin).to.be.false;

    });

    it("gets publish status from app state", () => {

        let state = mockReportAppState({
            reports: mockReportsState({versionDetails: {published: false}})
        });

        let result = mapStateToProps(state, defaultTabProps);

        expect(result.published).to.be.false;

        state = mockReportAppState({
            reports: mockReportsState({versionDetails: {published: true}})
        });

        result = mapStateToProps(state, defaultTabProps);

        expect(result.published).to.be.true;

    });

    it("gets report readers from app state", () => {

        const state = mockReportAppState({
            users: mockUsersState({reportReaders: [mockUser()]})
        });

        const result = mapStateToProps(state, defaultTabProps);

        expect(result.reportReaders).to.have.lengthOf(1);
    });

    it("is not ready when version details are null", () => {

        const state = mockReportAppState();
        const result = mapStateToProps(state, defaultTabProps);

        expect(result.ready).to.be.false;
    });

    it("is ready when version details are non null", () => {

        const state = mockReportAppState({
            reports:
                mockReportsState({versionDetails: {published: false}})
        });
        const result = mapStateToProps(state, defaultTabProps);

        expect(result.ready).to.be.true;
    });

});