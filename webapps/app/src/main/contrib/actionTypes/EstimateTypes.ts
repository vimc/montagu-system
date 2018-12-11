export enum EstimateTypes {
    BURDEN_ESTIMATES_FETCHED
}

export enum BurdenOutcome {
    DEATHS = "deaths",
    CASES = "cases",
    DALYS = "dalys"
}

export namespace Estimates {

    export interface BurdenEstimatesFetched {
        type: EstimateTypes.BURDEN_ESTIMATES_FETCHED;
        data: any[];
    }

}

export type EstimatesAction =
    | Estimates.BurdenEstimatesFetched

