import {DemographicDataset} from "../../shared/models/Generated";
import {DemographicAction, DemographicTypes} from "../actionTypes/DemographicTypes";

export interface DemographicState {
    dataSets: DemographicDataset[];
}

export const initialState: DemographicState = {
    dataSets: [],
};

export const demographicReducer = (state = initialState, action: DemographicAction) => {
    switch (action.type) {
        case DemographicTypes.DEMOGRAPHIC_DATA_SETS_FETCHED:
            return {...state, dataSets: action.data };
        default:
            return state;
    }
};

