import {Coverage, CoverageAction, CoverageTypes} from "../actionTypes/CoverageTypes";
import {CoverageSet} from "../../shared/models/APITypes";

export interface CoverageState {
    dataSets: CoverageSet[];
    selectedFormat: string;
}

export const coverageInitialState: CoverageState = {
    dataSets: [],
    selectedFormat: Coverage.SelectedFormat.long
};

export const coverageReducer = (state = coverageInitialState, action: CoverageAction) => {
    switch (action.type) {
        case CoverageTypes.COVERAGE_DATA_SETS_FETCHED:
            return {...state, dataSets: action.data ? action.data : [] };
        case CoverageTypes.COVERAGE_SET_FORMAT:
            return {...state, selectedFormat: action.data ? action.data : Coverage.SelectedFormat.long };
        default:
            return state;
    }
};

