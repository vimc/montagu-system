import {User} from "../../shared/models/Generated";

export enum UserTypeKeys {
    REPORT_READERS_FETCHED = "REPORT_READERS_FETCHED",
}

export interface ReportReadersFetched {
    type: UserTypeKeys.REPORT_READERS_FETCHED;
    data: User[];
}

export type UserActionTypes =
    | ReportReadersFetched
