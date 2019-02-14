import {reportsReducer, ReportsState} from "../../../main/report/reducers/reportsReducer";
import {mockReportsState} from "../../mocks/mockStates";
import {mockReportVersion, mockVersion} from "../../mocks/mockModels";
import {ReportTypeKeys} from "../../../main/report/actionTypes/ReportsActionsTypes";
import {expect} from "chai";

describe('Reports reducer tests', () => {

    it('sets published to true when report published', () => {

        const originalState = mockReportsState({
            reports: [mockReportVersion({name: "r1", id: "v1", published: false})],
            versionDetails: mockVersion({name: "r1", id: "v1", published: false})
        });

        const mutatedState = reportsReducer(originalState, {
            type: ReportTypeKeys.REPORT_PUBLISHED,
            data: {name: "r1", version: "v1"}
        });

        expect(mutatedState.versionDetails.published).to.eql(true);
        expect(mutatedState.reports[0].published).to.eql(true);
    });

    it('sets published to false when report unpublished', () => {

        const originalState = mockReportsState({
            reports: [mockReportVersion({name: "r1", id: "v1", published: true})],
            versionDetails: mockVersion({name: "r1", id: "v1", published: true})
        });

        const mutatedState = reportsReducer(originalState, {
            type: ReportTypeKeys.REPORT_UNPUBLISHED,
            data: {name: "r1", version: "v1"}
        });

        expect(mutatedState.versionDetails.published).to.eql(false);
        expect(mutatedState.reports[0].published).to.eql(false);
    });

    it('adds running report status on report run started', () => {

        const originalState = mockReportsState({
            runningReports: []
        });

        const mutatedState = reportsReducer(originalState, {
            type: ReportTypeKeys.REPORT_RUN_STARTED,
            data: {name: "r1", key: "melancholy mudskipper", status: "started", output: null, version: null}
        });

        expect(mutatedState.runningReports.length).to.eql(1);
        expect(mutatedState.runningReports[0].name).to.eql("r1");
        expect(mutatedState.runningReports[0].key).to.eql("melancholy mudskipper");
        expect(mutatedState.runningReports[0].status).to.eql("started");
        expect(mutatedState.runningReports[0].output).to.be.null;
        expect(mutatedState.runningReports[0].version).to.be.null;
    });

    it('replaces running report status on report run started', () => {

        const originalState = mockReportsState({
            runningReports: [
                {name: "r1", key: "melancholy mudskipper", status: "success", output: {}, version: "v1"},
                {name: "r2", key: "elated badger", status: "success", output: {}, version: "v2"}]
        });

        const mutatedState = reportsReducer(originalState, {
            type: ReportTypeKeys.REPORT_RUN_STARTED,
            data: {name: "r2", key: "poignant aardvark", status: "started", output: null, version: null}
        });

        expect(mutatedState.runningReports.length).to.eql(2);

        //Expect new report status to have replaced the old one
        const r2Status = mutatedState.runningReports.find(r => r.name == "r2")
        expect(r2Status.name).to.eql("r2");
        expect(r2Status.key).to.eql("poignant aardvark");
        expect(r2Status.status).to.eql("started");
        expect(r2Status.output).to.be.null;
        expect(r2Status.version).to.be.null;

        //Expect the status for different report to be unchanged
        const r1Status = mutatedState.runningReports.find(r => r.name == "r1")
        expect(r1Status.name).to.eql("r1");
        expect(r1Status.key).to.eql("melancholy mudskipper");
        expect(r1Status.status).to.eql("success");
        expect(r1Status.output).to.not.be.null;
        expect(r1Status.version).to.eql("v1");
    });

    it('replaces running report status on report status fetched', () => {

        const originalState = mockReportsState({
            runningReports: [
                {name: "r1", key: "melancholy mudskipper", status: "success", output: {}, version: "v1"},
                {name: "r2", key: "elated badger", status: "running", output: null, version: null}]
        });

        const mutatedState = reportsReducer(originalState, {
            type: ReportTypeKeys.REPORT_RUN_STATUS_FETCHED,
            data: {key: "elated badger", status: "success", output: {}, version: "v2"}
        });

        expect(mutatedState.runningReports.length).to.eql(2);

        //Expect new report status to have replaced the old one
        const r2Status = mutatedState.runningReports.find(r => r.name == "r2")
        expect(r2Status.name).to.eql("r2");
        expect(r2Status.key).to.eql("elated badger");
        expect(r2Status.status).to.eql("success");
        expect(r2Status.output).to.not.be.null;
        expect(r2Status.version).to.eql("v2");

        //Expect the status for different report to be unchanged
        const r1Status = mutatedState.runningReports.find(r => r.name == "r1")
        expect(r1Status.name).to.eql("r1");
        expect(r1Status.key).to.eql("melancholy mudskipper");
        expect(r1Status.status).to.eql("success");
        expect(r1Status.output).to.not.be.null;
        expect(r1Status.version).to.eql("v1");
    });

    it('removes running report status on report status removed', () => {

        const originalState = mockReportsState({
            runningReports: [
                {name: "r1", key: "melancholy mudskipper", status: "success", output: {}, version: "v1"},
                {name: "r2", key: "elated badger", status: "running", output: null, version: null}]
        });

        const mutatedState = reportsReducer(originalState, {
            type: ReportTypeKeys.REPORT_RUN_STATUS_REMOVED,
            data: "r2"
        });

        expect(mutatedState.runningReports.length).to.eql(1);

        //Expect the status for different report to be unchanged
        const r1Status = mutatedState.runningReports.find(r => r.name == "r1")
        expect(r1Status.name).to.eql("r1");
        expect(r1Status.key).to.eql("melancholy mudskipper");
        expect(r1Status.status).to.eql("success");
        expect(r1Status.output).to.not.be.null;
        expect(r1Status.version).to.eql("v1");
    });

    it('sets fetched reports list', () => {
        const reportMock = mockReportVersion();
        const newState: ReportsState = reportsReducer(undefined, {
            type: ReportTypeKeys.REPORTS_FETCHED,
            data: [reportMock]
        });
        expect(newState.reports).to.eql([reportMock]);
    });

    it('sets fetched reports list', () => {
        const newState: ReportsState = reportsReducer(undefined, {
            type: ReportTypeKeys.SET_CURRENT_REPORT,
            data: 'test'
        });
        expect(newState.currentReport).to.eql('test');
    });

    it('sets fetched report versions list', () => {
        const versionMock = mockVersion();
        const newState: ReportsState = reportsReducer(undefined, {
            type: ReportTypeKeys.REPORT_VERSIONS_FETCHED,
            data: [versionMock.id]
        });
        expect(newState.versions).to.eql([versionMock.id]);
    });

    it('sets fetched report version details list', () => {
        const versionMock = mockVersion();
        const newState: ReportsState = reportsReducer(undefined, {
            type: ReportTypeKeys.REPORT_VERSION_DETAILS_FETCHED,
            data: versionMock
        });
        expect(newState.versionDetails).to.eql(versionMock);
    });

});