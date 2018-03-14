import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import * as sinon from 'sinon';
import {Sandbox} from "../../../Sandbox";
import {mockAuthState, mockReportAppState, mockReportsState, mockUsersState} from "../../../mocks/mockStates";
import {mockUser} from "../../../mocks/mockModels";
import {mapDispatchToProps, SidebarAdmin} from "../../../../main/report/components/Sidebar/SidebarAdmin";
import {ReportsState} from "../../../../main/report/reducers/reportsReducer";
import {createMockStore} from "../../../mocks/mockStore";
import {userActionCreators} from "../../../../main/report/actions/userActionCreators";
import {ReportAppState} from "../../../../main/report/reducers/reportAppReducers";
import {ReportReadersList} from "../../../../main/report/components/Sidebar/ReportReadersList";
import {defaultProps} from "recompose";
import {SidebarAdminProps} from "../../../../main/report/components/Sidebar/SidebarAdminComponent";

describe("SidebarAdmin", () => {

    const sandbox = new Sandbox();
    let store: ReportAppState, getReadersStub: sinon.SinonStub;

    afterEach(() => {
        sandbox.restore();
    });

    beforeEach(() => {
        store = createMockStore(storeState);
        getReadersStub = sandbox.setStubReduxAction(userActionCreators, 'getReportReaders');
    });

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
        reportReaders: [],
        getReportReaders: sandbox.sinon.stub(),
        removeReportReader: sandbox.sinon.stub(),
        addReportReader: sandbox.sinon.stub()
    };

    const readyReportsState: ReportsState =
        mockReportsState({
            versionDetails: {published: false, name: "name", id: "v1"},
            versions: []
        });

    const storeState = mockReportAppState({
        reports: readyReportsState,
        auth: mockAuthState({permissions: ["*/roles.read"]}),
        users: mockUsersState({reportReaders: []})
    });


    it("calls getReportReaders if user is admin", () => {

        // 1 dive takes us to the wrapped withLifecycle component
        const rendered = shallow(<SidebarAdmin onChangeVersion={null}/>,
            {context: {store}}).dive();

        rendered.setProps({isAdmin: true});

        expect(getReadersStub.called).to.be.true;
    });

    it("does not call getReportReaders if user is not admin", () => {

        // 1 dive takes us to the wrapped withLifecycle component
        const rendered = shallow(<SidebarAdmin onChangeVersion={null}/>,
            {context: {store}}).dive();

        rendered.setProps({isAdmin: false});

        expect(getReadersStub.called).to.be.false;
    });

    it("gets reviewer status from app state", () => {

        let state = mockReportAppState({
            auth: mockAuthState({permissions: ["*/reports.review"]}),
            reports: readyReportsState
        });

        store = createMockStore(state);

        let rendered = shallow(<SidebarAdmin onChangeVersion={null}/>,
            {context: {store}});

        expect(rendered.prop("isReviewer")).to.be.true;

        state = mockReportAppState({
            auth: mockAuthState({permissions: []})
        });

        store = createMockStore(state);

        rendered = shallow(<SidebarAdmin onChangeVersion={null}/>,
            {context: {store}});

        expect(rendered.prop("isReviewer")).to.be.false;

    });

    it("gets admin status from app state", () => {

        let state = mockReportAppState({
            auth: mockAuthState({permissions: ["*/roles.read"]}),
            reports: readyReportsState
        });

        store = createMockStore(state);

        let rendered = shallow(<SidebarAdmin onChangeVersion={null}/>,
            {context: {store}});

        expect(rendered.prop("isAdmin")).to.be.true;

        state = mockReportAppState({
            auth: mockAuthState({permissions: []})
        });

        store = createMockStore(state);

        rendered = shallow(<SidebarAdmin onChangeVersion={null}/>,
            {context: {store}});

        expect(rendered.prop("isAdmin")).to.be.false;

    });

    it("gets publish status from app state", () => {

        let state = mockReportAppState({
            reports: mockReportsState({
                versionDetails: {published: true},
                versions: []
            })
        });
        store = createMockStore(state);

        let rendered = shallow(<SidebarAdmin onChangeVersion={null}/>,
            {context: {store}});

        expect(rendered.prop("published")).to.be.true;

        state = mockReportAppState({
            reports: mockReportsState({
                versionDetails: {published: false},
                versions: []
            })
        });

        store = createMockStore(state);

        rendered = shallow(<SidebarAdmin onChangeVersion={null}/>,
            {context: {store}});

        expect(rendered.prop("published")).to.be.false;

    });

    it("gets report readers from app state", () => {

        const state = mockReportAppState({
            reports: readyReportsState,
            users: mockUsersState({reportReaders: [mockUser()]})
        });

        store = createMockStore(state);

        const rendered = shallow(<SidebarAdmin onChangeVersion={null}/>,
            {context: {store}});

        expect(rendered.prop("reportReaders")).to.have.lengthOf(1);
    });

    it("passes addReportReader to ReportReadersList", () => {

        const dispatchStub = sandbox.sinon.stub();
        sandbox.setStubFunc(userActionCreators, "addReportReader", () => {
            return "testresult"
        });

        const result = mapDispatchToProps(dispatchStub, defaultSidebarProps);

        result.addReportReader("report", "test.user");
        expect(dispatchStub.calledWith("testresult"));

    });

    it("renders nothing when version details are null", () => {

        const state = mockReportAppState({
            reports: mockReportsState({
                versions: []
            })
        });

        store = createMockStore(state);

        const rendered = shallow(<SidebarAdmin onChangeVersion={null}/>,
            {context: {store}}).dive().dive();

        expect(rendered.find("div")).to.have.lengthOf(0);
    });

    it("renders nothing when versions are null", () => {

        const state = mockReportAppState({
            reports: mockReportsState({versionDetails: {published: false}})
        });

        store = createMockStore(state);

        const rendered = shallow(<SidebarAdmin onChangeVersion={null}/>,
            {context: {store}}).dive().dive();

        expect(rendered.find("div")).to.have.lengthOf(0);
    });

});