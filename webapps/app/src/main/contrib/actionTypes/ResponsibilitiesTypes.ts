import {ExtendedResponsibilitySet} from "../models/ResponsibilitySet";

export enum ResponsibilitiesTypes {
    SET_RESPONSIBILITIES = "SET_RESPONSIBILITIES"
}

export interface SetResponsibilities {
    type: ResponsibilitiesTypes.SET_RESPONSIBILITIES;
    data: ExtendedResponsibilitySet;
}

export type ResponsibilitiesAction =
    | SetResponsibilities
