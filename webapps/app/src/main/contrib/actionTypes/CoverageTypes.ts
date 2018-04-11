import {CoverageSet} from "../../shared/models/Generated";

export enum CoverageTypes {
    COVERAGE_DATA_SETS_FETCHED = "COVERAGE_DATA_SETS_FETCHED",
    COVERAGE_SET_FORMAT = "COVERAGE_SET_FORMAT",
    COVERAGE_ONE_TIME_TOKEN_FETCHED = "COVERAGE_ONE_TIME_TOKEN_FETCHED",
    COVERAGE_ONE_TIME_TOKEN_CLEAR = "COVERAGE_ONE_TIME_TOKEN_CLEAR"
}

export namespace Coverage {

    export interface DataSetsFetched {
        type: CoverageTypes.COVERAGE_DATA_SETS_FETCHED;
        data: CoverageSet[];
    }

    export interface SetFormat {
        type: CoverageTypes.COVERAGE_SET_FORMAT;
        data: string;
    }

    export interface OneTimeTokenFetched {
        type: CoverageTypes.COVERAGE_ONE_TIME_TOKEN_FETCHED;
        data: string;
    }

    export interface OneTimeTokenClear {
        type: CoverageTypes.COVERAGE_ONE_TIME_TOKEN_CLEAR;
    }
}

export type CoverageAction =
    | Coverage.DataSetsFetched
    | Coverage.SetFormat
    | Coverage.OneTimeTokenFetched
    | Coverage.OneTimeTokenClear
