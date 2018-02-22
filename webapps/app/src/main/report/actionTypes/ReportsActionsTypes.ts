import { Report } from "../../shared/models/Generated";
import {Version} from "../../shared/models/reports/Report";

export enum ReportTypeKeys {
    REPORTS_FETCHED = "REPORTS_FETCHED",
    REPORTS_SORTED = "REPORTS_SORTED",
    REPORT_VERSIONS_FETCHED = "REPORT_VERSIONS_FETCHED",
    SET_CURRENT_REPORT = "SET_CURRENT_REPORT",
    REPORT_VERSION_DETAILS_FETCHED = "REPORT_VERSION_DETAILS_FETCHED",
}

export interface ReportsFetched {
    type: ReportTypeKeys.REPORTS_FETCHED;
    data: Report[];
}

export type ReportsSortingFields = "name" | "latest_version";

export interface ReportsSorted {
    type: ReportTypeKeys.REPORTS_SORTED;
    data: ReportsSortingFields;
}

export interface SetCurrentReport {
    type: ReportTypeKeys.SET_CURRENT_REPORT;
    data: string;
}

export interface ReportVersionsFetched {
    type: ReportTypeKeys.REPORT_VERSIONS_FETCHED;
    data: Version[];
}

export interface ReportVersionDetailssFetched {
    type: ReportTypeKeys.REPORT_VERSION_DETAILS_FETCHED;
    data: Version;
}

export type ReportsActionsTypes =
    | ReportsFetched
    | ReportsSorted
    | SetCurrentReport
    | ReportVersionsFetched
    | ReportVersionDetailssFetched
