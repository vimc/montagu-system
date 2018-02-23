import { Report } from "../../shared/models/Generated";
import {Version} from "../../shared/models/reports/Report";

export enum ReportTypeKeys {
    REPORTS_FETCHED = "REPORTS_FETCHED",
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
    | SetCurrentReport
    | ReportVersionsFetched
    | ReportVersionDetailssFetched
    | ReportPublished
    | ReportUnpublished
