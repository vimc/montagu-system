import {CoverageSet} from "../../shared/models/Generated";

export enum CoverageTypes {
    COVERAGE_DATA_SETS_FETCHED = "COVERAGE_DATA_SETS_FETCHED",
    COVERAGE_SET_FORMAT = "COVERAGE_SET_FORMAT",
    COVERAGE_ONE_TIME_TOKEN_FETCHED = "COVERAGE_ONE_TIME_TOKEN_FETCHED",
    COVERAGE_ONE_TIME_TOKEN_CLEAR = "COVERAGE_ONE_TIME_TOKEN_CLEAR"
}

export interface CoverageDataSetsFetched {
    type: CoverageTypes.COVERAGE_DATA_SETS_FETCHED;
    data: CoverageSet[];
}

export interface CoverageSetFormat {
    type: CoverageTypes.COVERAGE_SET_FORMAT;
    data: string;
}

export interface CoverageOneTimeTokenFetched {
    type: CoverageTypes.COVERAGE_ONE_TIME_TOKEN_FETCHED;
    data: string;
}

export interface CoverageOneTimeTokenClear {
    type: CoverageTypes.COVERAGE_ONE_TIME_TOKEN_CLEAR;
}

export type CoverageAction =
    | CoverageDataSetsFetched
    | CoverageSetFormat
    | CoverageOneTimeTokenFetched
    | CoverageOneTimeTokenClear
