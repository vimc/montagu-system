import { ModellingGroup } from "../../shared/models/Generated";

export enum ModellingGroupTypes {
    ADMIN_GROUPS_FETCHED = "ADMIN_GROUPS_FETCHED",
    // SET_CURRENT_USER_GROUP = "SET_CURRENT_USER_GROUP"
}

export interface AdminGroupsFetched {
    type: ModellingGroupTypes.ADMIN_GROUPS_FETCHED;
    data: ModellingGroup[];
}

// export interface SetCurrentUserGroup {
//     type: ModellingGroupTypes.SET_CURRENT_USER_GROUP;
//     data: ModellingGroup;
// }

export type ModellingGroupsAction =
    | AdminGroupsFetched
    // | SetCurrentUserGroup
