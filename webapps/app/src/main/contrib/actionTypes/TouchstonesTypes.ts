import { Touchstone } from "../../shared/models/Generated";

export enum TouchstoneTypes {
    TOUCHSTONES_FETCHED = "TOUCHSTONES_FETCHED",
}

export interface TouchstonesFetched {
    type: TouchstoneTypes.TOUCHSTONES_FETCHED;
    data: Touchstone[];
}

export type TouchstonesAction =
    | TouchstonesFetched
