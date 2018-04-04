import {ModelRunParameterSet} from "../../shared/models/Generated";

export enum RunParametersTypes {
    RUN_PARAMETERS_SETS_FETCHED = "RUN_PARAMETERS_SETS_FETCHED",
}

export interface RunParametersSetsFetched {
    type: RunParametersTypes.RUN_PARAMETERS_SETS_FETCHED;
    data: ModelRunParameterSet[];
}

export type RunParametersAction =
    | RunParametersSetsFetched
