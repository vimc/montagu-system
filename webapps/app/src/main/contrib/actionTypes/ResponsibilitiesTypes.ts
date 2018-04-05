import {ExtendedResponsibility, IExtendedResponsibilitySet} from "../models/ResponsibilitySet";

export enum ResponsibilitiesTypes {
    SET_RESPONSIBILITIES = "SET_RESPONSIBILITIES",
    SET_CURRENT_RESPONSIBILITY_SET = "SET_CURRENT_RESPONSIBILITY_SET",
}

export interface SetResponsibilities {
    type: ResponsibilitiesTypes.SET_RESPONSIBILITIES;
    data: IExtendedResponsibilitySet;
}

export interface SetCurrentResponsibility {
    type: ResponsibilitiesTypes.SET_CURRENT_RESPONSIBILITY_SET;
    data: ExtendedResponsibility
}

export type ResponsibilitiesAction =
    | SetResponsibilities
    | SetCurrentResponsibility
