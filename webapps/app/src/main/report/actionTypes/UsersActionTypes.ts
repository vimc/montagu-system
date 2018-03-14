import {User} from "../../shared/models/Generated";

export enum UserTypeKeys {
    REPORT_READERS_FETCHED = "REPORT_READERS_FETCHED",
    REPORT_READER_REMOVED = "REPORT_READER_REMOVED"
}

export interface ReportReadersFetched {
    type: UserTypeKeys.REPORT_READERS_FETCHED;
    data: User[];
}

export interface ReportReaderRemoved {
    type: UserTypeKeys.REPORT_READER_REMOVED;
    data: string;
}

export type UserActionTypes =
    | ReportReadersFetched
    | ReportReaderRemoved
