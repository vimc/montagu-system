import { Report } from "../../shared/models/Generated";
import {Version} from "../../shared/models/reports/Report";

export enum ReportTypeKeys {
    REPORTS_FETCHED = "REPORTS_FETCHED",
    SORT_REPORTS = "SORT_REPORTS",
    FILTER_REPORTS = "FILTER_REPORTS",
    REPORT_VERSIONS_FETCHED = "REPORT_VERSIONS_FETCHED",
    SET_CURRENT_REPORT = "SET_CURRENT_REPORT",
    REPORT_VERSION_DETAILS_FETCHED = "REPORT_VERSION_DETAILS_FETCHED",
    REPORT_PUBLISHED = "REPORT_PUBLISHED",
    REPORT_UNPUBLISHED = "REPORT_UNPUBLISHED"
}

export interface ReportsFetched {
    type: ReportTypeKeys.REPORTS_FETCHED;
    data: Report[];
}

export enum ReportsSortingFields {
    "name" = "name",
    "latest_version" = "latest_version"
}

export interface SortReports {
    type: ReportTypeKeys.SORT_REPORTS;
    data: ReportsSortingFields;
}

export enum ReportsFilterPublishTypes {
    "all" = "all",
    "published" = "published",
    "not_published" = "not_published"
}

export interface ReportsFilterFields {
    published: ReportsFilterPublishTypes;
    timeFrom: string;
    timeUntil: string;
}

export interface FilterReports {
    type: ReportTypeKeys.FILTER_REPORTS;
    data: ReportsFilterFields;
}

export interface SetCurrentReport {
    type: ReportTypeKeys.SET_CURRENT_REPORT;
    data: string;
}

export interface ReportVersionsFetched {
    type: ReportTypeKeys.REPORT_VERSIONS_FETCHED;
    data: string[];
}

export interface ReportVersionDetailssFetched {
    type: ReportTypeKeys.REPORT_VERSION_DETAILS_FETCHED;
    data: Version;
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

export type ReportsActionsTypes =
    | ReportsFetched
    | SortReports
    | FilterReports
    | SetCurrentReport
    | ReportVersionsFetched
    | ReportVersionDetailssFetched
    | ReportPublished
    | ReportUnpublished
