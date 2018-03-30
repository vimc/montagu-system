import { Disease } from "../../shared/models/Generated";

export enum DiseasesTypes {
    DISEASES_FETCHED = "DISEASES_FETCHED",
}

export interface DiseasesFetched {
    type: DiseasesTypes.DISEASES_FETCHED;
    data: Disease[];
}

export type DiseasesAction =
    | DiseasesFetched
