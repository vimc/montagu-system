import {BurdenOutcome, EstimatesAction, EstimateTypes} from "../actionTypes/EstimateTypes";
import {ILookup} from "../../shared/models/Lookup";
import {ErrorInfo} from "../../shared/models/Generated";

export interface DataPoint {
    x: number
    y: number
}

export interface EstimatesState {
    uploadToken: string;
    populateErrors: ErrorInfo[];
    hasPopulateSuccess: boolean;
    populatingInProgress: boolean;
    populatingSetId: number;
    // these are dictionaries with burden estimate set ids as keys
    deaths: ILookup<ILookup<DataPoint[]>>
    dalys: ILookup<ILookup<DataPoint[]>>
    cases: ILookup<ILookup<DataPoint[]>>
    chartType: BurdenOutcome
}

export const estimatesInitialState: EstimatesState = {
    uploadToken: null,
    populateErrors: [],
    hasPopulateSuccess: false,
    populatingInProgress: false,
    populatingSetId: null,
    deaths: null,
    dalys: null,
    cases: null,
    chartType: BurdenOutcome.DEATHS
};

export const estimatesReducer = (state = estimatesInitialState, action: EstimatesAction): EstimatesState => {
    switch (action.type) {
        case EstimateTypes.BURDEN_ESTIMATES_FETCHED:
            const key = action.data.setId;
            const data = action.data.burdens;
            const type = action.data.type;
            let newState = null;
            switch (type) {
                case BurdenOutcome.DEATHS:
                    const newDeaths = {...state.deaths};
                    newDeaths[key] = data;
                    newState = {...state, deaths: newDeaths};
                    break;
                case BurdenOutcome.CASES:
                    const newCases = {...state.cases};
                    newCases[key] = data;
                    newState = {...state, cases: newCases};
                    break;
                case BurdenOutcome.DALYS:
                    const newDalys = {...state.dalys};
                    newDalys[key] = data;
                    newState = {...state, dalys: newDalys};
                    break;
            }
            return newState;
        case EstimateTypes.SET_CHART_TYPE:
            return {...state, chartType: action.data};
        case EstimateTypes.UPLOAD_TOKEN_FETCHED:
            return {...state, uploadToken: action.data};
        case EstimateTypes.RESET_POPULATE_STATE:
            return {
                ...state,
                hasPopulateSuccess: false,
                populateErrors: [],
                populatingSetId: null,
                uploadToken: null,
                populatingInProgress: false
            };
        case EstimateTypes.POPULATING_ESTIMATES:
            return {
                ...state,
                populatingInProgress: true
            };
        case EstimateTypes.ESTIMATE_SET_POPULATED:
            return {
                ...state,
                populateErrors: action.data.errors,
                hasPopulateSuccess: action.data.setStatus == "complete",
                populatingInProgress: false,
                populatingSetId: null,
                uploadToken: null
            };
        case EstimateTypes.SET_CREATED:
            return {
                ...state,
                populatingSetId: action.data
            };
        default:
            return state;
    }
};