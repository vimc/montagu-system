import {ModelRunParameterSet} from "../../shared/models/Generated";

export interface tokenData {
    id: number,
    token: string
}

export enum RunParametersTypes {
    RUN_PARAMETERS_SETS_FETCHED = "RUN_PARAMETERS_SETS_FETCHED",
    RUN_PARAMETERS_TOKEN_FETCHED = "RUN_PARAMETERS_TOKEN_FETCHED",
}

export interface RunParametersSetsFetched {
    type: RunParametersTypes.RUN_PARAMETERS_SETS_FETCHED;
    data: ModelRunParameterSet[];
}

export interface RunParametersTokenFetched {
    type: RunParametersTypes.RUN_PARAMETERS_TOKEN_FETCHED;
    data: tokenData;
}

export type RunParametersAction =
    | RunParametersSetsFetched
    | RunParametersTokenFetched
