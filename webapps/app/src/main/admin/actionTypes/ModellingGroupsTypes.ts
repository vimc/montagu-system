import {ModellingGroup, ModellingGroupDetails} from "../../shared/models/Generated";

export enum ModellingGroupTypes {
    ADMIN_GROUPS_FETCHED = "ADMIN_GROUPS_FETCHED",
    ADMIN_GROUP_DETAILS_FETCHED = "ADMIN_GROUP_DETAILS_FETCHED",
    SET_CURRENT_ADMIN_GROUP = "SET_CURRENT_ADMIN_GROUP"
}

export interface AdminGroupsFetched {
    type: ModellingGroupTypes.ADMIN_GROUPS_FETCHED;
    data: ModellingGroup[];
}

export interface SetCurrentAdminGroup {
    type: ModellingGroupTypes.SET_CURRENT_ADMIN_GROUP;
    data: ModellingGroup;
}

export interface SetAdminGroupDetails {
    type: ModellingGroupTypes.ADMIN_GROUP_DETAILS_FETCHED;
    data: ModellingGroupDetails;
}

export type ModellingGroupsAction =
    | AdminGroupsFetched
    | SetCurrentAdminGroup
    | SetAdminGroupDetails
;