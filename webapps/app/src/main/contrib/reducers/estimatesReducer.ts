import {EstimatesAction, EstimateTypes} from "../actionTypes/EstimateTypes";

export interface EstimatesState {
    deaths: any;
}

export const estimatesInitialState: EstimatesState = {
    deaths: null
};

export const estimatesReducer = (state = estimatesInitialState, action: EstimatesAction) => {
    switch (action.type) {
        case EstimateTypes.BURDEN_ESTIMATES_FETCHED:
            return {...state, deaths: action.data };
        default:
            return state;
    }
};