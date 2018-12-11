import {EstimatesAction, EstimateTypes} from "../actionTypes/EstimateTypes";
import {ILookup} from "../../shared/models/Lookup";

export interface DataPoint {
    x: number
    y: number
}

export interface EstimatesState {
    burdenOutcomes: ILookup<ILookup<DataPoint[]>>
}

export const estimatesInitialState: EstimatesState = {
    burdenOutcomes: null
};

export const estimatesReducer = (state = estimatesInitialState, action: EstimatesAction): EstimatesState => {
    switch (action.type) {
        case EstimateTypes.BURDEN_ESTIMATES_FETCHED:
            const key = action.data.setId;
            const data = action.data.burdens;
            const burdens = {...state.burdenOutcomes};
            burdens[key] = data;
            return {...state, burdenOutcomes: burdens };
        default:
            return state;
    }
};