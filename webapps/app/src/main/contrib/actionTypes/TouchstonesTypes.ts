import {Touchstone} from "../../shared/models/Generated";

export enum TouchstoneTypes {
    TOUCHSTONES_FETCHED = "TOUCHSTONES_FETCHED",
    SET_CURRENT_TOUCHSTONE = "SET_CURRENT_TOUCHSTONE"
}

export interface TouchstonesFetched {
    type: TouchstoneTypes.TOUCHSTONES_FETCHED;
    data: Touchstone[];
}

export interface SetCurrentTouchstone {
    type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE;
    data: Touchstone;
}

export type TouchstonesAction =
    | TouchstonesFetched
    | SetCurrentTouchstone
