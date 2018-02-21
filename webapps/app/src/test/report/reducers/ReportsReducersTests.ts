import { expect } from "chai";

import { reportsReducer } from "../../../main/report/reducers/reportsReducer";
import { ReportTypeKeys } from "../../../main/report/actionTypes/ReportsActionsTypes";
import {mockReport, mockVersion} from "../../mocks/mockModels";

describe('Reports reducer tests', () => {
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

})