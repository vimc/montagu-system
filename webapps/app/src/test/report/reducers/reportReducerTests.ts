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