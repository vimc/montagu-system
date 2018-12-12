import {BurdenOutcome, EstimatesAction, EstimateTypes} from "../actionTypes/EstimateTypes";
import {ILookup} from "../../shared/models/Lookup";

export interface DataPoint {
    x: number
    y: number
}

export interface EstimatesState {
    // these are dictionaries with burden estimate set ids as keys
    deaths: ILookup<ILookup<DataPoint[]>>
    dalys: ILookup<ILookup<DataPoint[]>>
    cases: ILookup<ILookup<DataPoint[]>>
}

export const estimatesInitialState: EstimatesState = {
    deaths: null,
    dalys: null,
    cases: null
};

export const estimatesReducer = (state = estimatesInitialState, action: EstimatesAction): EstimatesState => {
    switch (action.type) {
        case EstimateTypes.BURDEN_ESTIMATES_FETCHED:
            const key = action.data.setId;
            const data = action.data.burdens;
            const type = action.data.type;
            let newState = null;
            switch(type){
                case BurdenOutcome.DEATHS:
                const newDeaths = {...state.deaths};
                    newDeaths[key] = data;
                newState = {...state, deaths: newDeaths };
                break;
                case BurdenOutcome.CASES:
                    const newCases = {...state.cases};
                    newCases[key] = data;
                    newState = {...state, cases: newCases };
                    break;
                case BurdenOutcome.DALYS:
                    const newDalys = {...state.dalys};
                    newDalys[key] = data;
                    newState = {...state, dalys: newDalys };
                    break;
            }
            return newState;
        default:
            return state;
    }
};