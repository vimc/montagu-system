import * as React from "react";
import {mount, shallow} from "enzyme";
import {expect} from "chai";
import {Provider} from "react-redux";
import { createMemoryHistory } from 'history';

import "../../../helper";
import {Sandbox} from "../../../Sandbox";
import {mockHistory, mockLocation, mockMatch} from "../../../mocks/mocks";
import {
    ReportPage, ReportPageComponent, ReportPageLocationProps,
} from "../../../../main/report/components/Reports/ReportPage";
import {createMockStore} from "../../../mocks/mockStore";
import {ReportsService} from "../../../../main/report/services/ReportsService";
import {ReportTypeKeys} from "../../../../main/report/actionTypes/ReportsActionsTypes";
import {ReportDetails} from "../../../../main/report/components/Reports/ReportDetails";
import {ReportDownloads} from "../../../../main/report/components/Reports/ReportDownloads";
import {BreadcrumbsTypeKeys} from "../../../../main/shared/actionTypes/BreadrumbsTypes";
import {createReportStore} from "../../../../main/report/stores/createReportStore";
import {ReportAppState} from "../../../../main/report/reducers/reportAppReducers";

describe("ReportPage", () => {
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it("triggers actions on mount", (done: DoneCallback) => {
        let store = createMockStore({});
        let createBreadCrumbSpy = sandbox.setStub(ReportPageComponent, "breadcrumb");
        const matchMock = mockMatch({report: "report", version: "v1"})
        sandbox.setStubFunc(ReportPageComponent.prototype, "render", () => (<p/>));
        sandbox.setStub(ReportsService.prototype, "getReportVersions");
        sandbox.setStub(ReportsService.prototype, "getVersionDetails");

        mount(<Provider store={store}><ReportPage match={matchMock} /></Provider>);

        setTimeout(() => {
            const actions = store.getActions();
            expect(actions[0].type).to.eql(ReportTypeKeys.SET_CURRENT_REPORT);
            expect(actions[1].type).to.eql(BreadcrumbsTypeKeys.BREADCRUMBS_RECEIVED);
            expect(actions[2].type).to.eql(ReportTypeKeys.REPORT_VERSIONS_FETCHED);
            expect(actions[3].type).to.eql(ReportTypeKeys.REPORT_VERSION_DETAILS_FETCHED);
            expect(createBreadCrumbSpy.called).to.eq(true);
            done();
        });
    });

    it("generates breadcrumb on mount", (done: DoneCallback) => {
        const history = createMemoryHistory();
        let store = createReportStore(history);
        const matchMock = mockMatch({report: "report", version: "v1"})
        sandbox.setStubFunc(ReportPageComponent.prototype, "render", () => (<p/>));
        sandbox.setStub(ReportsService.prototype, "getReportVersions");
        sandbox.setStub(ReportsService.prototype, "getVersionDetails");

        mount(<Provider store={store}><ReportPage match={matchMock} /></Provider>);

        setTimeout(() => {
            const state = store.getState() as ReportAppState;
            const breadcrumbs = state.breadcrumbs.breadcrumbs;
            expect(breadcrumbs[0].name).to.equal("Main menu")
            expect(breadcrumbs[0].url).to.equal("/")
            expect(breadcrumbs[1].name).to.equal("report (v1)")
            expect(breadcrumbs[1].url).to.equal("/report/v1/")
            done();
        });
    });

    it("triggers actions and redirect when child triggers changeVersion", (done: DoneCallback) => {
        const redirectTo = sandbox.sinon.stub();
        const history = mockHistory({push: redirectTo});
        sandbox.setStub(ReportPageComponent.prototype, "loadVersion");
        const match = mockMatch<ReportPageLocationProps>({report: "reportname", version: "oldVersion"});
        const location = mockLocation();
        const page = new ReportPageComponent({match, history, location, router: null});
        page.changeVersion("versionname");
        setTimeout(() => {
            expect(redirectTo.called).to.equal(true, "Expected redirectTo to be called");
            expect(redirectTo.calledWith("/reportname/versionname/#hash"));
            done();
        });
    });

    it("renders report details by default", () => {

        const location = mockLocation();
        const match = mockMatch<ReportPageLocationProps>({report: "report", version: "v1"});
        const rendered = shallow(<ReportPageComponent
            onLoad={() => {}}
            location={location}
            match={match}
            router={null}
            history={null}
        />);
        expect(rendered.find(ReportDetails)).to.have.lengthOf(1);
        expect(rendered.find(ReportDownloads)).to.have.lengthOf(0);

    });

    it("renders report downloads when hash #downloads", () => {

        const location = mockLocation({hash: "#downloads"});
        const match = mockMatch<ReportPageLocationProps>({report: "report", version: "v1"});
        const rendered = shallow(<ReportPageComponent
            onLoad={() => {}}
            location={location}
            match={match}
            router={null}
            history={null}
        />);
        expect(rendered.find(ReportDetails)).to.have.lengthOf(0);
        expect(rendered.find(ReportDownloads)).to.have.lengthOf(1);
    });

    it("renders report details when hash #report", () => {

        const location = mockLocation({hash: "#report"});
        const match = mockMatch<ReportPageLocationProps>({report: "report", version: "v1"});
        const rendered = shallow(<ReportPageComponent
            onLoad={() => {}}
            location={location}
            router={null}
            match={match}
            history={null}
        />);
        expect(rendered.find(ReportDetails)).to.have.lengthOf(1);
        expect(rendered.find(ReportDownloads)).to.have.lengthOf(0);
    });


});