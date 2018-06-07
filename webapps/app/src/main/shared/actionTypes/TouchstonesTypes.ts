import {Touchstone} from "../models/Generated";

export enum TouchstoneTypes {
    ALL_TOUCHSTONES_FETCHED = "ALL_TOUCHSTONES_FETCHED",
    TOUCHSTONES_FETCHED_FOR_GROUP = "TOUCHSTONES_FETCHED_FOR_GROUP",
    SET_CURRENT_TOUCHSTONE = "SET_CURRENT_TOUCHSTONE"
}

export interface AllTouchstonesFetched {
    type: TouchstoneTypes.ALL_TOUCHSTONES_FETCHED;
    data: Touchstone[];
}

export interface TouchstonesFetchedForGroup {
    type: TouchstoneTypes.TOUCHSTONES_FETCHED_FOR_GROUP;
    data: Touchstone[];
}

export interface SetCurrentTouchstone {
    type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE;
    data: Touchstone;
}

export type TouchstonesAction =
    | AllTouchstonesFetched
    | TouchstonesFetchedForGroup
    | SetCurrentTouchstone
