import {DemographicDataset} from "../../shared/models/Generated";
import {DemographicAction, DemographicTypes} from "../actionTypes/DemographicTypes";

export interface DemographicState {
    dataSets: DemographicDataset[];
    selectedDataSet: DemographicDataset;
    selectedGender: string;
    selectedFormat: string;
    token: string;
}

export const initialState: DemographicState = {
    dataSets: [],
    selectedDataSet: null,
    selectedGender: "both",
    selectedFormat: "long",
    token: null
};

export const demographicReducer = (state = initialState, action: DemographicAction) => {
    switch (action.type) {
        case DemographicTypes.DEMOGRAPHIC_DATA_SETS_FETCHED:
            return {...state, dataSets: action.data };
        case DemographicTypes.DEMOGRAPHIC_SET_DATA_SET:
            return {...state, selectedDataSet: action.data };
        case DemographicTypes.DEMOGRAPHIC_SET_GENDER:
            return {...state, selectedGender: action.data };
        case DemographicTypes.DEMOGRAPHIC_SET_FORMAT:
            return {...state, selectedFormat: action.data };
        case DemographicTypes.DEMOGRAPHIC_ONE_TIME_TOKEN_FETCHED:
            return {...state, token: action.data };
        case DemographicTypes.DEMOGRAPHIC_ONE_TIME_TOKEN_CLEAR:
            return {...state, token: null };
        default:
            return state;
    }
};

