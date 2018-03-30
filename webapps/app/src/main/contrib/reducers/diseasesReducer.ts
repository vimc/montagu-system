import { DiseasesAction, DiseasesTypes } from "../actionTypes/DiseasesTypes";
import { Disease } from "../../shared/models/Generated";

export interface DiseasesState {
    diseases: Disease[];
}

export const initialState: DiseasesState = {
    diseases: []
};

export const diseasesReducer = (state = initialState, action: DiseasesAction) => {
    switch (action.type) {
        case DiseasesTypes.DISEASES_FETCHED:
            return { diseases: action.data };
        default:
            return state;
    }
};

