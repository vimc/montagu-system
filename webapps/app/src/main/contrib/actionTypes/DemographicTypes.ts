import {DemographicDataset} from "../../shared/models/Generated";

export enum DemographicTypes {
    DEMOGRAPHIC_DATA_SETS_FETCHED = "DEMOGRAPHIC_DATA_SETS_FETCHED",
    DEMOGRAPHIC_SET_DATA_SET = "DEMOGRAPHIC_SET_DATA_SET",
    DEMOGRAPHIC_SET_GENDER = "DEMOGRAPHIC_SET_GENDER",
    DEMOGRAPHIC_SET_FORMAT = "DEMOGRAPHIC_SET_FORMAT",
    DEMOGRAPHIC_SET_TOKEN = "DEMOGRAPHIC_SET_TOKEN",
}

export interface DemographicDataSetsFetched {
    type: DemographicTypes.DEMOGRAPHIC_DATA_SETS_FETCHED;
    data: DemographicDataset[];
}

export interface DemographicSetDataSet {
    type: DemographicTypes.DEMOGRAPHIC_SET_DATA_SET;
    data: DemographicDataset;
}

export interface DemographicSetGender {
    type: DemographicTypes.DEMOGRAPHIC_SET_GENDER;
    data: string;
}

export interface DemographicSetFormat {
    type: DemographicTypes.DEMOGRAPHIC_SET_FORMAT;
    data: string;
}

export interface DemographicSetToken {
    type: DemographicTypes.DEMOGRAPHIC_SET_TOKEN;
    data: string;
}

export type DemographicAction =
    | DemographicDataSetsFetched
    | DemographicSetDataSet
    | DemographicSetGender
    | DemographicSetFormat
    | DemographicSetToken
