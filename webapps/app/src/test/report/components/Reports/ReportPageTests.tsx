import * as React from "react";
import {mount, shallow} from "enzyme";
import {expect} from "chai";
import {Provider} from "react-redux";

import {Sandbox} from "../../../Sandbox";
import {mockHistory, mockLocation, mockMatch} from "../../../mocks/mocks";
import {ReportPage, ReportPageComponent, ReportPageProps} from "../../../../main/report/components/Reports/ReportPage";
import {addNavigationTests} from "../../../shared/NavigationTests";
import {createMockStore} from "../../../mocks/mockStore";
import {ReportsService} from "../../../../main/report/services/ReportsService";
import {ReportTypeKeys} from "../../../../main/report/actionTypes/ReportsActionsTypes";
import {ReportDetails} from "../../../../main/report/components/Reports/ReportDetails";
import {ReportDownloads} from "../../../../main/report/components/Reports/ReportDownloads";

describe("ReportPage", () => {
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());
    let createBreadCrumbSpy = sandbox.setStub(ReportPageComponent.prototype, "createBreadcrumb");
    let store = createMockStore({});

    const mountPage = () => {

        const matchMock = mockMatch({report: "report", version: "v1"})
        sandbox.setStubFunc(ReportPageComponent.prototype, "getLocationParams", () => (matchMock));
        sandbox.setStubFunc(ReportPageComponent.prototype, "render", () => (<p/>));
        sandbox.setStub(ReportsService.prototype, "getReportVersions");
        sandbox.setStub(ReportsService.prototype, "getVersionDetails");

        return mount(<Provider store={store}><ReportPage/></Provider>);
    };

    it("triggers actions on mount", (done: DoneCallback) => {

        mountPage();

        setTimeout(() => {
            const actions = store.getActions();
            expect(actions[0].type).to.eql(ReportTypeKeys.SET_CURRENT_REPORT);
            expect(actions[1].type).to.eql(ReportTypeKeys.REPORT_VERSIONS_FETCHED);
            expect(actions[2].type).to.eql(ReportTypeKeys.REPORT_VERSION_DETAILS_FETCHED);
            expect(createBreadCrumbSpy.called).to.eq(true);
            done();
        });
    });

    it("triggers actions and redirect when child triggers changeVersion", (done: DoneCallback) => {
        const redirectTo = sandbox.sinon.stub();
        const history = mockHistory({push: redirectTo});
        sandbox.setStub(ReportPageComponent.prototype, "loadVersion");
        const match = mockMatch<ReportPageProps>({report: "reportname", version: "oldVersion"});
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
        const match = mockMatch<ReportPageProps>({report: "report", version: "v1"});
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
        const match = mockMatch<ReportPageProps>({report: "report", version: "v1"});
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
        const match = mockMatch<ReportPageProps>({report: "report", version: "v1"});
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

    const location = mockLocation();
    const match = mockMatch<ReportPageProps>({report: "report", version: "v1"});
    const page = new ReportPageComponent({location: location, router: null, match, history: null});
    addNavigationTests(page, sandbox, () => {
    });
});