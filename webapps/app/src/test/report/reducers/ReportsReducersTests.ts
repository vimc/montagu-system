import { expect } from "chai";

import {reportsReducer, ReportsState} from "../../../main/report/reducers/reportsReducer";
import {
    ReportsFilterPublishTypes, ReportsSortingFields,
    ReportTypeKeys
} from "../../../main/report/actionTypes/ReportsActionsTypes";
import {mockReport, mockVersion} from "../../mocks/mockModels";

describe('Reports reducer tests', () => {
    it('sets fetched reports list', () => {
        const reportMock = mockReport();
        const newState: ReportsState = reportsReducer(undefined, { type: ReportTypeKeys.REPORTS_FETCHED, data: [reportMock] });
        expect(newState.reports).to.eql([reportMock]);
    });

    it('sets fetched reports list', () => {
        const newState: ReportsState = reportsReducer(undefined, { type: ReportTypeKeys.SET_CURRENT_REPORT, data: 'test' });
        expect(newState.currentReport).to.eql('test');
    });

    it('sets fetched report versions list', () => {
        const versionMock = mockVersion();
        const newState: ReportsState = reportsReducer(undefined, { type: ReportTypeKeys.REPORT_VERSIONS_FETCHED, data: [versionMock.id] });
        expect(newState.versions).to.eql([versionMock.id]);
    });

    it('sets fetched report version details list', () => {
        const versionMock = mockVersion();
        const newState: ReportsState = reportsReducer(undefined, { type: ReportTypeKeys.REPORT_VERSION_DETAILS_FETCHED, data: versionMock });
        expect(newState.versionDetails).to.eql(versionMock);
    });

    it('sorts reports list by name', () => {
        const newState: ReportsState = reportsReducer(undefined, { type: ReportTypeKeys.SORT_REPORTS, data: ReportsSortingFields.name });
        expect(newState.reportsSortBy).to.eql(ReportsSortingFields.name);
    });

    it('sorts reports list by latest version', () => {
        const newState: ReportsState = reportsReducer(undefined, { type: ReportTypeKeys.SORT_REPORTS, data: ReportsSortingFields.latest_version });
        expect(newState.reportsSortBy).to.eql(ReportsSortingFields.latest_version);
    });

    it('sets reports filter prop by published', () => {
        const newState: ReportsState = reportsReducer(undefined, {
            type: ReportTypeKeys.FILTER_REPORTS,
            data: { published: ReportsFilterPublishTypes.published }
        });
        expect(newState.reportsFilter).to.eql({
            published: "published",
            timeFrom: null,
            timeUntil: null
        });
    });

    it('sets reports filter prop by timeFrom', () => {
        const newState: ReportsState = reportsReducer(undefined, {
            type: ReportTypeKeys.FILTER_REPORTS,
            data: { timeFrom: "test_time" }
        });
        expect(newState.reportsFilter).to.eql({
            published: "all",
            timeFrom: "test_time",
            timeUntil: null
        });
    });
})