import {ILookup} from "../../shared/models/Lookup";
import {DataPoint} from "../reducers/estimatesReducer";
import {BurdenEstimateSetStatus, ErrorInfo} from "../../shared/models/Generated";
import SetChartType = Estimates.SetChartType;
import UploadTokenFetched = Estimates.UploadTokenFetched;
import EstimateSetPopulated = Estimates.EstimateSetPopulated;
import ResetPopulateState = Estimates.ResetPopulateState;
import PopulatingEstimateSet = Estimates.PopulatingEstimateSet;
import BurdenEstimateSetCreated = Estimates.BurdenEstimateSetCreated;

export enum EstimateTypes {
    UPLOAD_TOKEN_FETCHED,
    BURDEN_ESTIMATES_FETCHED,
    ESTIMATE_SET_POPULATED,
    SET_CHART_TYPE,
    RESET_POPULATE_STATE,
    POPULATING_ESTIMATES,
    SET_CREATED
}

export enum BurdenOutcome {
    DEATHS = "deaths",
    CASES = "cases",
    DALYS = "dalys"
}

export namespace Estimates {

    export interface BurdenEstimatesFetched {
        type: EstimateTypes.BURDEN_ESTIMATES_FETCHED;
        data: { setId: number, burdens: ILookup<DataPoint[]>, type: BurdenOutcome }
    }

    export interface SetChartType {
        type: EstimateTypes.SET_CHART_TYPE;
        data: BurdenOutcome
    }

    export interface UploadTokenFetched {
        type: EstimateTypes.UPLOAD_TOKEN_FETCHED,
        data: string
    }

    export interface EstimateSetPopulated {
        type: EstimateTypes.ESTIMATE_SET_POPULATED,
        data: { setStatus: BurdenEstimateSetStatus, errors: ErrorInfo[] }
    }

    export interface PopulatingEstimateSet {
        type: EstimateTypes.POPULATING_ESTIMATES,
        data: boolean
    }

    export interface ResetPopulateState {
        type: EstimateTypes.RESET_POPULATE_STATE,
        data: boolean
    }

    export interface BurdenEstimateSetCreated {
        type: EstimateTypes.SET_CREATED,
        data: number
    }
}

export type EstimatesAction =
    | Estimates.BurdenEstimatesFetched
    | SetChartType
    | UploadTokenFetched
    | EstimateSetPopulated
    | ResetPopulateState
    | PopulatingEstimateSet
    | BurdenEstimateSetCreated