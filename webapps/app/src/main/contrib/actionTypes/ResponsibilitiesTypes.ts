import {ExtendedResponsibility, IExtendedResponsibilitySet} from "../models/ResponsibilitySet";

export enum ResponsibilitiesTypes {
    SET_RESPONSIBILITIES = "SET_RESPONSIBILITIES",
    SET_CURRENT_RESPONSIBILITY = "SET_CURRENT_RESPONSIBILITY",
}

export interface SetResponsibilities {
    type: ResponsibilitiesTypes.SET_RESPONSIBILITIES;
    data: IExtendedResponsibilitySet;
}

export interface SetCurrentResponsibility {
    type: ResponsibilitiesTypes.SET_CURRENT_RESPONSIBILITY;
    data: ExtendedResponsibility
}

export type ResponsibilitiesAction =
    | SetResponsibilities
    | SetCurrentResponsibility
