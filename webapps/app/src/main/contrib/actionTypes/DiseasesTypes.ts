import {Disease} from "../../shared/models/Generated";

export enum DiseasesTypes {
    DISEASES_FETCHED = "DISEASES_FETCHED",
    DISEASES_SET_CURRENT_DISEASE_ID= "DISEASES_SET_CURRENT_DISEASE_ID"
}

export interface DiseasesFetched {
    type: DiseasesTypes.DISEASES_FETCHED;
    data: Disease[];
}

export interface SetCurrentDiseaseId {
    type: DiseasesTypes.DISEASES_SET_CURRENT_DISEASE_ID;
    data: string;
}

export type DiseasesAction =
    | DiseasesFetched
    | SetCurrentDiseaseId
