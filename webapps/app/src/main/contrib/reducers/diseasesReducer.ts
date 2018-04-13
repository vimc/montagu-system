import { DiseasesAction, DiseasesTypes } from "../actionTypes/DiseasesTypes";
import { Disease } from "../../shared/models/Generated";

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
            return { ...state, diseases: action.data };
        case DiseasesTypes.DISEASES_SET_CURRENT_DISEASE_ID:
            return { ...state, currentDiseaseId: action.data };
        default:
            return state;
    }
};

