import {User} from "../../shared/models/Generated";

export enum UserActionKeys {
    REPORT_READERS_FETCHED = "REPORT_READERS_FETCHED",
    REPORT_READER_REMOVED = "REPORT_READER_REMOVED",
    REPORT_READER_ADDED = "REPORT_READER_ADDED"
}

export interface ReportReadersFetched {
    type: UserActionKeys.REPORT_READERS_FETCHED;
    data: User[];
}

export interface ReportReaderRemoved {
    type: UserActionKeys.REPORT_READER_REMOVED;
    data: string;
}

export interface ReportReaderAdded {
    type: UserActionKeys.REPORT_READER_ADDED;
    data: string;
}

export type UserAction =
    | ReportReadersFetched
    | ReportReaderRemoved
    | ReportReaderAdded
