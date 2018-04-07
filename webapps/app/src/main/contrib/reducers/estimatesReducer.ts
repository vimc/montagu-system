import {EstimatesAction, EstimatesTypes} from "../actionTypes/EstimatesTypes";

export interface EstimatesState {
    token: string;
    redirectPath: string;
}

export const initialState: EstimatesState = {
    token: null,
    redirectPath: null
};

export const estimatesReducer = (state = initialState, action: EstimatesAction) => {
    switch (action.type) {
        case EstimatesTypes.ESTIMATES_SET_REDIRECT_PATH:
            console.log('reduc pat', action.data)
            return {...state, redirectPath: action.data };
        case EstimatesTypes.ESTIMATES_ONE_TIME_TOKEN_FETCHED:
            return {...state, token: action.data };
        case EstimatesTypes.ESTIMATES_ONE_TIME_TOKEN_CLEAR:
            return {...state, token: null };
        default:
            return state;
    }
};

