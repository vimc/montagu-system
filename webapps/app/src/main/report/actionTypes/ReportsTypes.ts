import { Report } from "../../shared/models/Generated";

export enum ReportTypeKeys {
    REPORTS_FETCHED = "REPORTS_FETCHED",
    REPORT_PUBLISHED = "REPORT_PUBLISHED",
    REPORT_UNPUBLISHED = "REPORT_UNPUBLISHED"
}

export interface BasicReport{
    name: string;
    version: string;
}

export interface ReportsFetched {
    type: ReportTypeKeys.REPORTS_FETCHED;
    data: Report[];
}

export interface ReportPublished {
    type: ReportTypeKeys.REPORT_PUBLISHED;
    data: BasicReport;
}

export interface ReportUnpublished {
    type: ReportTypeKeys.REPORT_UNPUBLISHED;
    data: BasicReport;
}

export type ReportsActionsTypes =
    | ReportsFetched
    | ReportPublished
    | ReportUnpublished
