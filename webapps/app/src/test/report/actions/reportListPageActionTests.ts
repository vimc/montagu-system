import {expect} from "chai";
import {Sandbox} from "../../Sandbox";
import {createMockReportStore} from "../../mocks/mockStore";
import {verifyActionThatCallsService} from "../../ActionCreatorTestHelpers";
import {mockReportVersion} from "../../mocks/mockModels";
import {ReportsService} from "../../../main/report/services/ReportsService";
import {reportListPageActionCreators} from "../../../main/report/actionCreators/pages/ReportListPageActionCreators";
import {ReportTypeKeys} from "../../../main/report/actionTypes/ReportsActionsTypes";

describe("Report list page actions tests", () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it("gets all reports on load", (done: DoneCallback) => {

        const store = createMockReportStore();
        const fakeData = [mockReportVersion()];
        verifyActionThatCallsService(done, {
            store: store,
            mockServices: () => {
                sandbox.stubService(ReportsService.prototype, "getAllReports", fakeData)
            },
            callActionCreator: () => reportListPageActionCreators.loadData(),
            expectTheseActions: [{type: ReportTypeKeys.REPORTS_FETCHED, data: fakeData}]
        })
    });

    it("creates breadcrumbs", () => {

        const result = reportListPageActionCreators.createBreadcrumb();

        expect(result.urlFragment).to.eq("/");
        expect(result.name).to.eq("Main menu");
    });

    it("has no parent", () => {
        expect(reportListPageActionCreators.parent).to.be.undefined;
    });

    it("creates title", () => {
        expect(reportListPageActionCreators.title()).to.eq("Main menu");
    });

});