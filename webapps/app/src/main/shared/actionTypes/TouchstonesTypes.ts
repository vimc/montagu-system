import {Touchstone, TouchstoneVersion} from "../../shared/models/Generated";

export enum TouchstoneTypes {
    TOUCHSTONES_FETCHED_FOR_GROUP = "TOUCHSTONES_FETCHED_FOR_GROUP",
    SET_CURRENT_TOUCHSTONE_VERSION = "SET_CURRENT_TOUCHSTONE_VERSION"
}

export interface TouchstonesFetchedForGroup {
    type: TouchstoneTypes.TOUCHSTONES_FETCHED_FOR_GROUP;
    data: Touchstone[];
}

export interface SetCurrentTouchstoneVersion {
    type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE_VERSION;
    data: TouchstoneVersion;
}

export type TouchstonesAction =
    | TouchstonesFetchedForGroup
    | SetCurrentTouchstoneVersion
