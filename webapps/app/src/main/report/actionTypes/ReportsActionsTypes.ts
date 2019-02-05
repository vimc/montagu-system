import { Changelog, ReportVersion } from "../../shared/models/Generated";
import {Version} from "../../shared/models/reports/Report";
import {RunningReportStatus, RunningReportStatusUpdate} from "../models/RunningReportStatus";

export enum ReportTypeKeys {
    REPORTS_FETCHED = "REPORTS_FETCHED",
    REPORT_VERSIONS_FETCHED = "REPORT_VERSIONS_FETCHED",
    SET_CURRENT_REPORT = "SET_CURRENT_REPORT",
    REPORT_RUN_STARTED = "REPORT_RUN_STARTED",
    REPORT_RUN_STATUS_FETCHED = "REPORT_RUN_STATUS_FETCHED",
    REPORT_VERSION_DETAILS_FETCHED = "REPORT_VERSION_DETAILS_FETCHED",
    REPORT_VERSION_CHANGELOG_FETCHED = "REPORT_VERSION_CHANGELOG_FETCHED",
    REPORT_VERSION_CHANGELOG_RESET = "REPORT_VERSION_CHANGELOG_RESET",
    REPORT_PUBLISHED = "REPORT_PUBLISHED",
    REPORT_UNPUBLISHED = "REPORT_UNPUBLISHED",
}

export interface ReportsFetched {
    type: ReportTypeKeys.REPORTS_FETCHED;
    data: ReportVersion[];
}

export interface SetCurrentReport {
    type: ReportTypeKeys.SET_CURRENT_REPORT;
    data: string;
}

export interface ReportRunStarted {
    type: ReportTypeKeys.REPORT_RUN_STARTED;
    data: RunningReportStatus;
}

export interface ReportRunStatusFetched {
    type: ReportTypeKeys.REPORT_RUN_STATUS_FETCHED;
    data: RunningReportStatusUpdate;
}

export interface ReportVersionsFetched {
    type: ReportTypeKeys.REPORT_VERSIONS_FETCHED;
    data: string[];
}

export interface ReportVersionDetailssFetched {
    type: ReportTypeKeys.REPORT_VERSION_DETAILS_FETCHED;
    data: Version;
}

export interface ReportVersionChangelogReset {
    type: ReportTypeKeys.REPORT_VERSION_CHANGELOG_RESET;
}

export interface ReportVersionChangelogFetched {
    type: ReportTypeKeys.REPORT_VERSION_CHANGELOG_FETCHED;
    data: Changelog[];
}

export interface ReportPublished {
    type: ReportTypeKeys.REPORT_PUBLISHED;
    data: BasicReport;
}

export interface ReportUnpublished {
    type: ReportTypeKeys.REPORT_UNPUBLISHED;
    data: BasicReport;
}

export interface BasicReport{
    name: string;
    version: string;
}

export type ReportsAction =
    | ReportsFetched
    | SetCurrentReport
    | ReportVersionsFetched
    | ReportVersionDetailssFetched
    | ReportVersionChangelogReset
    | ReportVersionChangelogFetched
    | ReportPublished
    | ReportUnpublished
    | ReportRunStarted
    | ReportRunStatusFetched
