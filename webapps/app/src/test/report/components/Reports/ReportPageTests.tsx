import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import {Sandbox} from "../../../Sandbox";
import {mockLocation} from "../../../mocks/mocks";
import {checkAsync, checkPromise} from "../../../testHelpers";
import {reportStore} from "../../../../main/report/stores/ReportStore";
import {expectOneAction, expectOrderedActions} from "../../../actionHelpers";
import {alt} from "../../../../main/shared/alt";
import {IRouter} from "simple-react-router";
import {ReportPage, ReportPageProps} from "../../../../main/report/components/Reports/ReportPage";
import {ReportDetails} from "../../../../main/report/components/Reports/ReportDetails";
import {addNavigationTests} from "../../../shared/NavigationTests";
import {mockFetcherForMultipleResponses} from "../../../mocks/mockMultipleEndpoints";
import {mockReportDetailsEndpoint, mockReportsEndpoint, mockReportVersionsEndpoint} from "../../../mocks/mockEndpoints";
import {mockReport, mockVersion} from "../../../mocks/mockModels";
import {Version} from "../../../../main/shared/models/reports/Report";

describe("ReportPage", () => {
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());
    beforeEach(() => {
        alt.bootstrap(JSON.stringify({
            ReportStore: {
                ready: true,
                reports: ["report"],
                currentReport: "",
                currentVersion: "",
                versionDetails: {},
                versions: {}
            }
        }));
    });

    const checkExpectedActionsWhen = function (done: DoneCallback, action: () => Promise<Version>) {
        const spy = sandbox.dispatchSpy();
        const fetchReports = sandbox.sinon.stub(reportStore, "fetchReports").returns(Promise.resolve(null));
        const fetchVersions = sandbox.sinon.stub(reportStore, "fetchVersions").returns(Promise.resolve(null));
        const fetchVersionDetails = sandbox.sinon.stub(reportStore, "fetchVersionDetails").returns(Promise.resolve(null));

        const promise = action();
        checkPromise(done, promise, () => {
            expect(fetchReports.called).to.equal(true, "Expected fetchReports to be called");
            expect(fetchVersions.called).to.equal(true, "Expected fetchVersions to be called");
            expect(fetchVersionDetails.called).to.equal(true, "Expected fetchVersionDetails to be called");
            expectOrderedActions(spy, [
                {action: "ReportActions.setCurrentReport", payload: "reportname"},
                {action: "ReportActions.setCurrentVersion", payload: "versionname"}
            ]);
        });
    };

    it("triggers actions on mount", (done: DoneCallback) => {
        checkExpectedActionsWhen(done, () => {
            return new ReportPage({location: location, router: null}).load({
                report: "reportname",
                version: "versionname"
            });
        });
    });

    it("triggers actions and redirect when child triggers changeVersion", (done: DoneCallback) => {
        const redirectTo = sandbox.sinon.stub();
        const router: IRouter = {redirectTo};

        checkExpectedActionsWhen(done, () => {
            const location = mockLocation<ReportPageProps>({report: "reportname", version: "oldVersion"});
            const page = new ReportPage({location: location, router: router});
            const promise = page.changeVersion("versionname")
            expect(redirectTo.called).to.equal(true, "Expected redirectTo to be called");
            expect(redirectTo.calledWith("/reportname/versionname/"));
            return promise;
        });
    });

    const location = mockLocation<ReportPageProps>({report: "report", version: "v1"});
    const page = new ReportPage({location: location, router: null});
    addNavigationTests(page, sandbox, () => {
        const version = mockVersion({name: "report", id: "v1"});
        mockFetcherForMultipleResponses([
            mockReportsEndpoint([mockReport({name: "report"})]),
            mockReportVersionsEndpoint("report", [version, mockVersion()]),
            mockReportDetailsEndpoint(version)
        ])
    });
});