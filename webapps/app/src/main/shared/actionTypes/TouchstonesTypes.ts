import {ErrorInfo, ResponsibilitySet, Touchstone, TouchstoneVersion} from "../models/Generated";

export enum TouchstoneTypes {
    ALL_TOUCHSTONES_FETCHED = "ALL_TOUCHSTONES_FETCHED",
    RESPONSIBILITIES_FOR_TOUCHSTONE_VERSION_FETCHED = "RESPONSIBILITIES_FOR_TOUCHSTONE_VERSION_FETCHED",
    TOUCHSTONES_FETCHED_FOR_GROUP = "TOUCHSTONES_FETCHED_FOR_GROUP",
    SET_CURRENT_TOUCHSTONE_VERSION = "SET_CURRENT_TOUCHSTONE_VERSION",
    NEW_TOUCHSTONE_CREATED = "NEW_TOUCHSTONE_CREATED",
    SET_CREATE_TOUCHSTONE_ERROR = "SET_CREATE_TOUCHSTONE_ERROR"
    SET_CURRENT_TOUCHSTONE = "SET_CURRENT_TOUCHSTONE",
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

export interface SetCurrentTouchstoneVersion {
    type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE_VERSION;
    data: TouchstoneVersion;
}

export interface ResponsibilitiesForTouchstoneVersionFetched {
    type: TouchstoneTypes.RESPONSIBILITIES_FOR_TOUCHSTONE_VERSION_FETCHED;
    data: ResponsibilitySet[];
}

export interface NewTouchstoneCreated {
    type: TouchstoneTypes.NEW_TOUCHSTONE_CREATED;
    data: Touchstone;
}

export interface SetCreateTouchstoneError {
    type: TouchstoneTypes.SET_CREATE_TOUCHSTONE_ERROR;
    data: ErrorInfo[];
}

export type TouchstonesAction =
    | AllTouchstonesFetched
    | TouchstonesFetchedForGroup
    | SetCurrentTouchstone
    | SetCurrentTouchstoneVersion
    | ResponsibilitiesForTouchstoneVersionFetched
    | NewTouchstoneCreated
    | SetCreateTouchstoneError
