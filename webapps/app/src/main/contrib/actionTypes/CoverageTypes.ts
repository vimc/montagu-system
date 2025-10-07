import {CoverageSet} from "../../shared/models/APITypes";

export enum CoverageTypes {
    COVERAGE_DATA_SETS_FETCHED = "COVERAGE_DATA_SETS_FETCHED",
    COVERAGE_SET_FORMAT = "COVERAGE_SET_FORMAT"
}

export namespace Coverage {

    export interface DataSetsFetched {
        type: CoverageTypes.COVERAGE_DATA_SETS_FETCHED;
        data: CoverageSet[];
    }

    export enum SelectedFormat {
        long = "long",
        wide = "wide"
    }

    export interface SetFormat {
        type: CoverageTypes.COVERAGE_SET_FORMAT;
        data: SelectedFormat;
    }
}

export type CoverageAction =
    | Coverage.DataSetsFetched
    | Coverage.SetFormat
