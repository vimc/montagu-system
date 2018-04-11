import {DemographicDataset} from "../../shared/models/Generated";

export enum DemographicTypes {
    DEMOGRAPHIC_DATA_SETS_FETCHED = "DEMOGRAPHIC_DATA_SETS_FETCHED",
    DEMOGRAPHIC_SET_DATA_SET = "DEMOGRAPHIC_SET_DATA_SET",
    DEMOGRAPHIC_SET_GENDER = "DEMOGRAPHIC_SET_GENDER",
    DEMOGRAPHIC_SET_FORMAT = "DEMOGRAPHIC_SET_FORMAT",
    DEMOGRAPHIC_ONE_TIME_TOKEN_FETCHED = "DEMOGRAPHIC_ONE_TIME_TOKEN_FETCHED",
    DEMOGRAPHIC_ONE_TIME_TOKEN_CLEAR = "DEMOGRAPHIC_ONE_TIME_TOKEN_CLEAR"
}

export namespace Demographic {

    export interface DataSetsFetched {
        type: DemographicTypes.DEMOGRAPHIC_DATA_SETS_FETCHED;
        data: DemographicDataset[];
    }

    export interface SetDataSet {
        type: DemographicTypes.DEMOGRAPHIC_SET_DATA_SET;
        data: DemographicDataset;
    }

    export interface SetGender {
        type: DemographicTypes.DEMOGRAPHIC_SET_GENDER;
        data: string;
    }

    export interface SetFormat {
        type: DemographicTypes.DEMOGRAPHIC_SET_FORMAT;
        data: string;
    }

    export interface OneTimeTokenFetched {
        type: DemographicTypes.DEMOGRAPHIC_ONE_TIME_TOKEN_FETCHED;
        data: string;
    }

    export interface OneTimeTokenClear {
        type: DemographicTypes.DEMOGRAPHIC_ONE_TIME_TOKEN_CLEAR;
    }
}

export type DemographicAction =
    | Demographic.DataSetsFetched
    | Demographic.SetDataSet
    | Demographic.SetGender
    | Demographic.SetFormat
    | Demographic.OneTimeTokenFetched
    | Demographic.OneTimeTokenClear
