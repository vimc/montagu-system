import {User} from "../../shared/models/Generated";

export enum UserActionTypes {
    REPORT_READERS_FETCHED = "REPORT_READERS_FETCHED",
    REPORT_READER_REMOVED = "REPORT_READER_REMOVED",
    REPORT_READER_ADDED = "REPORT_READER_ADDED"
}

export interface ReportReadersFetched {
    type: UserActionTypes.REPORT_READERS_FETCHED;
    data: User[];
}

export interface ReportReaderRemoved {
    type: UserActionTypes.REPORT_READER_REMOVED;
    data: string;
}

export type UserAction =
    | ReportReadersFetched
    | ReportReaderRemoved