import {Touchstone, TouchstoneVersion} from "../../shared/models/Generated";

export enum TouchstoneTypes {
    TOUCHSTONES_FETCHED = "TOUCHSTONES_FETCHED",
    SET_CURRENT_TOUCHSTONE_VERSION = "SET_CURRENT_TOUCHSTONE_VERSION"
}

export interface TouchstonesFetched {
    type: TouchstoneTypes.TOUCHSTONES_FETCHED;
    data: Touchstone[];
}

export interface SetCurrentTouchstoneVersion {
    type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE_VERSION;
    data: TouchstoneVersion;
}

export type TouchstonesAction =
    | TouchstonesFetched
    | SetCurrentTouchstoneVersion
