import * as React from "react";
import {mount} from "enzyme";
import {expect} from "chai";
import { Provider } from "react-redux";

import {Sandbox} from "../../../Sandbox";
import {mockLocation} from "../../../mocks/mocks";
import {IRouter} from "simple-react-router";
import {ReportPage, ReportPageComponent, ReportPageProps} from "../../../../main/report/components/Reports/ReportPage";
import {addNavigationTests} from "../../../shared/NavigationTests";
import {createMockStore} from "../../../mocks/mockStore";
import {ReportsService} from "../../../../main/report/services/ReportsService";
import {ReportTypeKeys} from "../../../../main/report/actionTypes/ReportsActionsTypes";

describe("ReportPage", () => {
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it("triggers actions on mount", (done: DoneCallback) => {
        const store = createMockStore({});

        const location = mockLocation<ReportPageProps>({report: "report", version: "v1"});
        sandbox.setStubFunc(ReportPageComponent.prototype, "getLocationParams", () => (location));
        sandbox.setStubFunc(ReportPageComponent.prototype, "render", () => (<p/>));
        const createBreadCrumbSpy = sandbox.setStub(ReportPageComponent.prototype, "createBreadcrumb");
        sandbox.setStub(ReportsService.prototype, "getReportVersions");
        sandbox.setStub(ReportsService.prototype, "getVersionDetails");

        const rendered = mount(<Provider store={store}><ReportPage /></Provider>);
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
        const location = mockLocation<ReportPageProps>({report: "reportname", version: "oldVersion"});
        const page = new ReportPageComponent({location: location, router: router});
        page.changeVersion("versionname")
        setTimeout(() => {
            expect(redirectTo.called).to.equal(true, "Expected redirectTo to be called");
            expect(redirectTo.calledWith("/reportname/versionname/"));
            done();
        });
    });

    const location = mockLocation<ReportPageProps>({report: "report", version: "v1"});
    const page = new ReportPageComponent({location: location, router: null});
    addNavigationTests(page, sandbox, () => {});
});