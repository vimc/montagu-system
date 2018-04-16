import {ModelRunParameterSet} from "../../shared/models/Generated";

export interface RunParametersTokenData {
    id: number,
    token: string
}

export enum RunParametersTypes {
    RUN_PARAMETERS_SETS_FETCHED = "RUN_PARAMETERS_SETS_FETCHED",
    RUN_PARAMETERS_TOKEN_FETCHED = "RUN_PARAMETERS_TOKEN_FETCHED",
    RUN_PARAMETERS_SET_UPLOAD_STATUS = "RUN_PARAMETERS_SET_UPLOAD_STATUS",
}

export interface RunParametersSetsFetched {
    type: RunParametersTypes.RUN_PARAMETERS_SETS_FETCHED;
    data: ModelRunParameterSet[];
}

export interface RunParametersTokenFetched {
    type: RunParametersTypes.RUN_PARAMETERS_TOKEN_FETCHED;
    data: RunParametersTokenData;
}

export enum RunParametersUploadStatus {
    off = 'off' ,
    in_progress = 'in_progress' ,
    completed = 'completed'
}

export interface RunParametersUploadStatusData {
    status: RunParametersUploadStatus,
    errors: Error[]
}

export interface RunParametersSetUploadStatus {
    type: RunParametersTypes.RUN_PARAMETERS_SET_UPLOAD_STATUS;
    data: RunParametersUploadStatusData
}

export type RunParametersAction =
    | RunParametersSetsFetched
    | RunParametersTokenFetched
    | RunParametersSetUploadStatus
