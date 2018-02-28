import {reportsReducer} from "../../../main/report/reducers/reportsReducer";
import {mockReportsState} from "../../mocks/mockStates";
import {mockReport, mockVersion} from "../../mocks/mockModels";
import {ReportTypeKeys} from "../../../main/report/actionTypes/ReportsActionsTypes";
import {expect} from "chai";

describe('Reports reducer tests', () => {

    // TODO for now this should pass through state unchanged bc publish button is not connected
    it('should pass through state unchanged when report published', () => {

        const originalState = mockReportsState({
            reports: [mockReport({name: "r1"})],
            versionDetails: mockVersion({name: "r1", id: "v1"})
        });

        const mutatedState = reportsReducer(originalState, {
            type: ReportTypeKeys.REPORT_PUBLISHED,
            data: {name: "r1", version: "v1"}
        });

        expect(mutatedState).to.deep.eq(originalState);
    });

    // TODO for now this should pass through state unchanged bc publish button is not connected
    it('should pass through state unchanged when report unpublished', () => {

        const originalState = mockReportsState({
            reports: [mockReport({name: "r1"})],
            versionDetails: mockVersion({name: "r1", id: "v1"})
        });

        const mutatedState = reportsReducer(originalState, {
            type: ReportTypeKeys.REPORT_UNPUBLISHED,
            data: {name: "r1", version: "v1"}
        });

        expect(mutatedState).to.deep.eq(originalState);
    });

    it('sets fetched reports list', () => {
        const reportMock = mockReport();
        const newState = reportsReducer(undefined, { type: ReportTypeKeys.REPORTS_FETCHED, data: [reportMock] });
        expect(newState.reports).to.eql([reportMock]);
    });

    it('sets fetched reports list', () => {
        const newState = reportsReducer(undefined, { type: ReportTypeKeys.SET_CURRENT_REPORT, data: 'test' });
        expect(newState.currentReport).to.eql('test');
    });

    it('sets fetched report versions list', () => {
        const versionMock = mockVersion();
        const newState = reportsReducer(undefined, { type: ReportTypeKeys.REPORT_VERSIONS_FETCHED, data: [versionMock] });
        expect(newState.versions).to.eql([versionMock]);
    });

    it('sets fetched report version details list', () => {
        const versionMock = mockVersion();
        const newState = reportsReducer(undefined, { type: ReportTypeKeys.REPORT_VERSION_DETAILS_FETCHED, data: versionMock });
        expect(newState.versionDetails).to.eql(versionMock);
    });

});