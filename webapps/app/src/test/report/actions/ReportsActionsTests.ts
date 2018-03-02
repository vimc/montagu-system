import { expect } from "chai";

import { Sandbox } from "../../Sandbox";
import { reportsActions } from "../../../main/report/actions/reportsActions";
import { ReportsService } from "../../../main/report/services/ReportsService";
import {ReportsSortingFields, ReportTypeKeys} from "../../../main/report/actionTypes/ReportsActionsTypes";
import { createMockStore } from "../../mocks/mockStore";

describe("Report actions tests", () => {
    const sandbox = new Sandbox();
    let store: any = null;

    beforeEach(() => {
        store = createMockStore();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("dispatches reports fetched action if get report action is dispatched", (done) => {
        sandbox.setStubFunc(ReportsService.prototype, "getAllReports", () => {
            return Promise.resolve([]);
        });
        store.dispatch(reportsActions.getReports())
        setTimeout(() => {
            const actions = store.getActions();
            expect(actions[0].type).to.eql(ReportTypeKeys.REPORTS_FETCHED);
            expect(actions[0].data).to.eql([]);
            done();
        });
    });

    it("dispatches set current report", (done) => {
        store.dispatch(reportsActions.setCurrentReport('test'))
        setTimeout(() => {
            const actions = store.getActions();
            expect(actions[0].type).to.eql(ReportTypeKeys.SET_CURRENT_REPORT);
            expect(actions[0].data).to.eql('test');
            done();
        });
    });

    it("dispatches reports versions fetched action if get report versions action is dispatched", (done) => {
        sandbox.setStubFunc(ReportsService.prototype, "getReportVersions", () => {
            return Promise.resolve([]);
        });
        store.dispatch(reportsActions.getReportVersions('test'))
        setTimeout(() => {
            const actions = store.getActions();
            expect(actions[0].type).to.eql(ReportTypeKeys.REPORT_VERSIONS_FETCHED);
            expect(actions[0].data).to.eql([]);
            done();
        });
    });

    it("dispatches reports version detials fetched action if get report version details action is dispatched", (done) => {
        sandbox.setStubFunc(ReportsService.prototype, "getVersionDetails", () => {
            return Promise.resolve({});
        });
        store.dispatch(reportsActions.getVersionDetails('test', 'v1'))
        setTimeout(() => {
            const actions = store.getActions();
            expect(actions[0].type).to.eql(ReportTypeKeys.REPORT_VERSION_DETAILS_FETCHED);
            expect(actions[0].data).to.eql({});
            done();
        });
    });

    it("dispatches reports sorted action if sort report is dispatched", (done) => {
        store.dispatch(reportsActions.sortReports(ReportsSortingFields.name))
        setTimeout(() => {
            const actions = store.getActions();
            expect(actions[0].type).to.eql(ReportTypeKeys.SORT_REPORTS);
            expect(actions[0].data).to.eql("name");
            done();
        });
    });
});
