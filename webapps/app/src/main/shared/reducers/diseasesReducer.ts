import {DiseasesAction, DiseasesTypes} from "../actionTypes/DiseasesTypes";
import {Disease} from "../models/APITypes";
import {orderBy} from "lodash";

export interface DiseasesState {
    diseases: Disease[];
    currentDiseaseId: string;
}

export const diseasesInitialState: DiseasesState = {
    diseases: [],
    currentDiseaseId: null
};

export const diseasesReducer = (state = diseasesInitialState, action: DiseasesAction) => {
    switch (action.type) {
        case DiseasesTypes.DISEASES_FETCHED:
            const diseases = orderBy(action.data, ["name"], ["asc"]);
            return { ...state, diseases: diseases };
        case DiseasesTypes.DISEASES_SET_CURRENT_DISEASE_ID:
            return { ...state, currentDiseaseId: action.data };
        default:
            return state;
    }
};

