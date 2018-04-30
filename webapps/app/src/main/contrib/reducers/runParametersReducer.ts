import {ModelRunParameterSet} from "../../shared/models/Generated";
import {
    RunParametersAction, RunParametersTypes, RunParametersUploadStatus,
    RunParametersUploadStatusData
} from "../actionTypes/RunParametersTypes";

export interface TokensMap {
    [setId: string]: string;
}

export interface RunParametersState {
    sets: ModelRunParameterSet[];
    tokens: TokensMap,
    uploadStatus: RunParametersUploadStatusData;
}

export const runParametersInitialState: RunParametersState = {
    sets: [],
    tokens: {},
    uploadStatus: {status: RunParametersUploadStatus.off, errors: null},
}

export const runParametersReducer = (state = runParametersInitialState, action: RunParametersAction) => {
    switch (action.type) {
        case RunParametersTypes.RUN_PARAMETERS_SETS_FETCHED:
            return {...state, sets: action.data ? action.data : [] };
        case RunParametersTypes.RUN_PARAMETERS_TOKEN_FETCHED:
            return { ...state,  tokens: {...state.tokens, ...{[action.data.id]: action.data.token}}};
        case RunParametersTypes.RUN_PARAMETERS_SET_UPLOAD_STATUS:
            return {...state, uploadStatus: action.data };
        default:
            return state;
    }
};

