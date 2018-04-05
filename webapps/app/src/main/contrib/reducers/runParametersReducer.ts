import {ModelRunParameterSet} from "../../shared/models/Generated";
import {RunParametersAction, RunParametersTypes} from "../actionTypes/RunParametersTypes";

export interface TokensMap {
    [setId: string]: string;
}

export interface RunParametersState {
    sets: ModelRunParameterSet[];
    tokens: TokensMap
}

export const initialState: RunParametersState = {
    sets: [],
    tokens: {}
}

export const runParametersReducer = (state = initialState, action: RunParametersAction) => {
    switch (action.type) {
        case RunParametersTypes.RUN_PARAMETERS_SETS_FETCHED:
            return {...state, sets: action.data };
        case RunParametersTypes.RUN_PARAMETERS_TOKEN_FETCHED:
            return { ...state,  tokens: {...state.tokens, ...{[action.data.id]: action.data.token}}};
        default:
            return state;
    }
};

