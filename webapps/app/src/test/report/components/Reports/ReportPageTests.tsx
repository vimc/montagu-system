import * as React from "react";
import {mount, shallow} from "enzyme";
import {expect} from "chai";
import {Provider} from "react-redux";

import {Sandbox} from "../../../Sandbox";
import {mockLocation} from "../../../mocks/mocks";
import {IRouter} from "simple-react-router";
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

        const location = mockLocation<ReportPageProps>({report: "report", version: "v1"});
        sandbox.setStubFunc(ReportPageComponent.prototype, "getLocationParams", () => (location));
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
        const router: IRouter = {redirectTo};
        sandbox.setStub(ReportPageComponent.prototype, "loadVersion");
        const location = mockLocation<ReportPageProps>({report: "reportname", version: "oldVersion"}, "hash");
        const page = new ReportPageComponent({location: location, router: router});
        page.changeVersion("versionname");
        setTimeout(() => {
            expect(redirectTo.called).to.equal(true, "Expected redirectTo to be called");
            expect(redirectTo.calledWith("/reportname/versionname/#hash"));
            done();
        });
    });

    it("renders report details by default", () => {

        const location = mockLocation<ReportPageProps>({report: "report", version: "v1"});
        const rendered = shallow(<ReportPageComponent onLoad={() => {
        }} location={location} router={null}/>);
        expect(rendered.find(ReportDetails)).to.have.lengthOf(1);
        expect(rendered.find(ReportDownloads)).to.have.lengthOf(0);

    });

    it("renders report downloads when hash #downloads", () => {

        const location = mockLocation<ReportPageProps>({report: "report", version: "v1"}, "#downloads");
        const rendered = shallow(<ReportPageComponent onLoad={() => {
        }} location={location} router={null}/>);
        expect(rendered.find(ReportDetails)).to.have.lengthOf(0);
        expect(rendered.find(ReportDownloads)).to.have.lengthOf(1);
    });

    it("renders report details when hash #report", () => {

        const location = mockLocation<ReportPageProps>({report: "report", version: "v1"}, "#report");
        const rendered = shallow(<ReportPageComponent onLoad={() => {
        }} location={location} router={null}/>);
        expect(rendered.find(ReportDetails)).to.have.lengthOf(1);
        expect(rendered.find(ReportDownloads)).to.have.lengthOf(0);
    });

    const location = mockLocation<ReportPageProps>({report: "report", version: "v1"});
    const page = new ReportPageComponent({location: location, router: null});
    addNavigationTests(page, sandbox, () => {
    });
});