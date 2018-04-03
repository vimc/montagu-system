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
    selectedGender: null,
    selectedFormat: null,
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
        case DemographicTypes.DEMOGRAPHIC_SET_TOKEN:
            return {...state, token: action.data };
        default:
            return state;
    }
};

