import { ModellingGroup } from "../../shared/models/Generated";

export enum ModellingGroupTypes {
    USER_GROUPS_FETCHED = "USER_GROUPS_FETCHED",
    SET_CURRENT_USER_GROUP = "SET_CURRENT_USER_GROUP"
}

export interface UserGroupsFetched {
    type: ModellingGroupTypes.USER_GROUPS_FETCHED;
    data: ModellingGroup[];
}

export interface SetCurrentUserGroup {
    type: ModellingGroupTypes.SET_CURRENT_USER_GROUP;
    data: ModellingGroup;
}

export type ModellingGroupsAction =
    | UserGroupsFetched
    | SetCurrentUserGroup
