import {ModelRunParameterSet} from "../../shared/models/APITypes";
import {
    RunParametersAction,
    RunParametersTypes,
    RunParametersUploadStatus,
    RunParametersUploadStatusData
} from "../actionTypes/RunParametersTypes";

export interface RunParametersState {
    sets: ModelRunParameterSet[];
    uploadStatus: RunParametersUploadStatusData;
}

export const runParametersInitialState: RunParametersState = {
    sets: [],
    uploadStatus: {status: RunParametersUploadStatus.off, errors: null},
};

export const runParametersReducer = (state = runParametersInitialState, action: RunParametersAction) => {
    switch (action.type) {
        case RunParametersTypes.RUN_PARAMETERS_SETS_FETCHED:
            return {...state, sets: action.data ? action.data : [] };
        case RunParametersTypes.RUN_PARAMETERS_SET_UPLOAD_STATUS:
            return {...state, uploadStatus: action.data };
        default:
            return state;
    }
};

