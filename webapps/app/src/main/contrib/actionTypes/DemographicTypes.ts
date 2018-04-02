import {DemographicDataset} from "../../shared/models/Generated";

export enum DemographicTypes {
    DEMOGRAPHIC_DATA_SETS_FETCHED = "DEMOGRAPHIC_DATA_SETS_FETCHED",
}

export interface DemographicDataSetsFetched {
    type: DemographicTypes.DEMOGRAPHIC_DATA_SETS_FETCHED;
    data: DemographicDataset[];
}

export type DemographicAction =
    | DemographicDataSetsFetched
