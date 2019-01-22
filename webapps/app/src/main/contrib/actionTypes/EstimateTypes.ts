import {ILookup} from "../../shared/models/Lookup";
import {DataPoint} from "../reducers/estimatesReducer";
import SetChartType = Estimates.SetChartType;

export enum EstimateTypes {
    BURDEN_ESTIMATES_FETCHED,
    SET_CHART_TYPE
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

}

export type EstimatesAction =
    | Estimates.BurdenEstimatesFetched
    | SetChartType

