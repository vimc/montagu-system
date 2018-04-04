import {ModelRunParameterSet} from "../../shared/models/Generated";
import {RunParametersAction, RunParametersTypes} from "../actionTypes/RunParametersTypes";

export interface RunParametersState {
    sets: ModelRunParameterSet[];
}

export const initialState: RunParametersState = {
    sets: [],
}

export const runParametersReducer = (state = initialState, action: RunParametersAction) => {
    switch (action.type) {
        case RunParametersTypes.RUN_PARAMETERS_SETS_FETCHED:
            return {...state, sets: action.data };
        default:
            return state;
    }
};

