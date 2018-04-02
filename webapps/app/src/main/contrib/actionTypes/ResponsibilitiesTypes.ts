import {IExtendedResponsibilitySet} from "../models/ResponsibilitySet";

export enum ResponsibilitiesTypes {
    SET_RESPONSIBILITIES = "SET_RESPONSIBILITIES"
}

export interface SetResponsibilities {
    type: ResponsibilitiesTypes.SET_RESPONSIBILITIES;
    data: IExtendedResponsibilitySet;
}

export type ResponsibilitiesAction =
    | SetResponsibilities
