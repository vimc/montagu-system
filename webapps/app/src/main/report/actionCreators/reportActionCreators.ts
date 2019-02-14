import {Dispatch} from "redux";

import { ReportsService } from "../services/ReportsService";
import {
    ReportsAction, ReportsFetched, ReportTypeKeys,
    ReportVersionDetailssFetched,
    ReportVersionsFetched,
    ReportVersionChangelogFetched,
    ReportVersionChangelogReset,
    ReportRunStarted,
    ReportRunStatusFetched,
    ReportRunStatusRemoved,
    ReportPublished,
    ReportUnpublished
} from "../actionTypes/ReportsActionsTypes";
import {GlobalState} from "../../shared/reducers/GlobalState";
import {ReportVersion} from "../../shared/models/Generated";
import {RunningReportStatusUpdate, RunningReportStatusValues} from "../models/RunningReportStatus";


export const reportActionCreators = {

    getReports() {
        return async (dispatch: Dispatch<ReportsAction>, getState: () => GlobalState) => {
            const reports: ReportVersion[] = await (new ReportsService(dispatch, getState)).getAllReports();
            dispatch({
                type: ReportTypeKeys.REPORTS_FETCHED,
                data: reports
            } as ReportsFetched);
        }
    },

    setCurrentReport(report: string) {
        return {
            type: ReportTypeKeys.SET_CURRENT_REPORT,
            data: report
        }
    },
    publishReport(name: string, version: string) {
        return async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
            await (new ReportsService(dispatch, getState)).publishReport(name, version);
            dispatch({
                type: ReportTypeKeys.REPORT_PUBLISHED,
                data: {name: name, version: version}
            } as ReportPublished );
        }
    },
    unPublishReport(name: string, version: string) {
        return async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
            await (new ReportsService(dispatch, getState)).unPublishReport(name, version);
            dispatch({
                type: ReportTypeKeys.REPORT_UNPUBLISHED,
                data: {name: name, version: version}
            } as ReportUnpublished );
        }
    },

    runReport(name: string) {
        return async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
            const runningReportDetails = await (new ReportsService(dispatch, getState)).runReport(name);
            dispatch({
                type: ReportTypeKeys.REPORT_RUN_STARTED,
                data: runningReportDetails
            } as ReportRunStarted );

        }
    },

    pollRunStatus(key: string) {
        return async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
            let runningReportStatus : RunningReportStatusUpdate;
            runningReportStatus = await (new ReportsService(dispatch, getState))
                                    .setOptions({notificationOnError: false})
                                    .getReportRunStatus(key);

            //We've forced the service not to notify on error so the user doesn't see an expanding popup, but
            //if status was not set then something went wrong
            if (!runningReportStatus) {
                runningReportStatus = {
                    key: key,
                    status: RunningReportStatusValues.RUNNING_REPORT_STATUS_SERVER_ERROR,
                    version: null,
                    output: null
                }
            }
            dispatch({
                type: ReportTypeKeys.REPORT_RUN_STATUS_FETCHED,
                data: runningReportStatus
            } as ReportRunStatusFetched );
        }
    },

    reportRunStatusRemoved(reportId: string) {
        return {
                type: ReportTypeKeys.REPORT_RUN_STATUS_REMOVED,
                data: reportId
            };
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
    },

    resetVersionChangelog(): ReportVersionChangelogReset {
        return {
            type: ReportTypeKeys.REPORT_VERSION_CHANGELOG_RESET
        }
    },

    getVersionChangelog(reportId: string, versionId: string) {
        return async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
            const versionChangelog = await (new ReportsService(dispatch, getState)).getVersionChangelog(reportId, versionId);
            dispatch({
                type: ReportTypeKeys.REPORT_VERSION_CHANGELOG_FETCHED,
                data: versionChangelog
            } as ReportVersionChangelogFetched );
        }
    }

};
