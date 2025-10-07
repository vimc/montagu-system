import {DemographicDataset} from "../models/APITypes";
import {Demographic, DemographicAction, DemographicTypes} from "../actionTypes/DemographicTypes";

export interface DemographicsState {
    dataSets: DemographicDataset[];
    selectedDataSet: DemographicDataset;
    selectedGender: string;
    selectedFormat: string;
}

export const demographicsInitialState: DemographicsState = {
    dataSets: [],
    selectedDataSet: null,
    selectedGender: Demographic.SelectedGender.both,
    selectedFormat: Demographic.SelectedFormat.long
};

export const demographicsReducer = (state = demographicsInitialState, action: DemographicAction) => {
    switch (action.type) {
        case DemographicTypes.DEMOGRAPHIC_DATA_SETS_FETCHED:
            return {...state, dataSets: action.data ? action.data : [] };
        case DemographicTypes.DEMOGRAPHIC_SET_DATA_SET:
            return {...state, selectedDataSet: action.data };
        case DemographicTypes.DEMOGRAPHIC_SET_GENDER:
            return {...state, selectedGender: action.data ? action.data : Demographic.SelectedGender.both};
        case DemographicTypes.DEMOGRAPHIC_SET_FORMAT:
            return {...state, selectedFormat: action.data ? action.data : Demographic.SelectedFormat.long };
        default:
            return state;
    }
};

