import {Dispatch} from "redux";

import { ReportsService } from "../services/ReportsService";
import {
    ReportsActionsTypes, ReportsFetched, ReportsSortingFields, ReportTypeKeys, ReportVersionDetailssFetched,
    ReportVersionsFetched
} from "../actionTypes/ReportsActionsTypes";
import {GlobalState} from "../../shared/reducers/GlobalState";
import {Report} from "../../shared/models/Generated";

export const reportsActions = {

    getReports() {
        return async (dispatch: Dispatch<ReportsActionsTypes>, getState: () => GlobalState) => {
            const reports: Report[] = await (new ReportsService(dispatch, getState)).getAllReports();
            dispatch({
                type: ReportTypeKeys.REPORTS_FETCHED,
                data: reports
            } as ReportsFetched);
        }
    },

    sortReports(value: ReportsSortingFields) {
        return {
            type: ReportTypeKeys.SORT_REPORTS,
            data: value
        }
    },

    setCurrentReport(report: string) {
        return {
            type: ReportTypeKeys.SET_CURRENT_REPORT,
            data: report
        }
    },
    publishReport(name: string, version: string) {
        //TODO actually publish report
        return {
            type: ReportTypeKeys.REPORT_PUBLISHED,
            data: {report: name, version: version}
        }
    },

    unPublishReport(name: string, version: string) {
        //TODO actually publish report
        return {
            type: ReportTypeKeys.REPORT_UNPUBLISHED,
            data: {report: name, version: version}
        }
    },

    getReportVersions(reportId: string) {
        return async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
            const versions = await (new ReportsService(dispatch, getState)).getReportVersions(reportId);
            dispatch({
                type: ReportTypeKeys.REPORT_VERSIONS_FETCHED,
                data: versions
            } as ReportVersionsFetched );
        }
    },

    getVersionDetails(reportId: string, versionId: string) {
        return async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
            const versionDetails = await (new ReportsService(dispatch, getState)).getVersionDetails(reportId, versionId);
            dispatch({
                type: ReportTypeKeys.REPORT_VERSION_DETAILS_FETCHED,
                data: versionDetails
            } as ReportVersionDetailssFetched );
        }
    }

};
