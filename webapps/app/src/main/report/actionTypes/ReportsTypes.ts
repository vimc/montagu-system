import { Report } from "../../shared/models/Generated";

export enum ReportTypeKeys {
    REPORTS_FETCHED = "REPORTS_FETCHED",
}

export interface ReportsFetched {
    type: ReportTypeKeys.REPORTS_FETCHED;
    data: Report[];
}

export type ReportsActionsTypes =
    | ReportsFetched
