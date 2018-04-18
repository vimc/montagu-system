import {ModellingGroup} from "../../shared/models/Generated";

export enum ModellingGroupTypeKeys {
    USER_GROUPS_FETCHED = "USER_GROUPS_FETCHED",
    CONFIDENTIALITY_SIGNED = "CONFIDENTIALITY_SIGNED",
    CONFIDENTIALITY_RETRIEVED = "CONFIDENTIALITY_RETRIEVED"
}

export interface UserGroupsFetched {
    type: ModellingGroupTypeKeys.USER_GROUPS_FETCHED;
    data: ModellingGroup[];
}

export interface ConfidentialitySigned {
    type: ModellingGroupTypeKeys.CONFIDENTIALITY_SIGNED;
    data: boolean;
}

export interface ConfidentialityRetrieved {
    type: ModellingGroupTypeKeys.CONFIDENTIALITY_RETRIEVED;
    data: boolean;
}

export type ModellingGroupsAction =
    | UserGroupsFetched
    | ConfidentialitySigned
    | ConfidentialityRetrieved
