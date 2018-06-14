import {TouchstoneVersion} from "../../shared/models/Generated";

export enum TouchstoneTypes {
    TOUCHSTONES_FETCHED = "TOUCHSTONES_FETCHED",
    SET_CURRENT_TOUCHSTONE = "SET_CURRENT_TOUCHSTONE"
}

export interface TouchstonesFetched {
    type: TouchstoneTypes.TOUCHSTONES_FETCHED;
    data: TouchstoneVersion[];
}

export interface SetCurrentTouchstone {
    type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE;
    data: TouchstoneVersion;
}

export type TouchstonesAction =
    | TouchstonesFetched
    | SetCurrentTouchstone
