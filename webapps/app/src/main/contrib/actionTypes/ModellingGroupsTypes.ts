import { ModellingGroup } from "../../shared/models/Generated";

export enum ModellingGroupTypes {
    USER_GROUPS_FETCHED = "USER_GROUPS_FETCHED",
}

export interface UserGroupsFetched {
    type: ModellingGroupTypes.USER_GROUPS_FETCHED;
    data: ModellingGroup[];
}

export type ModellingGroupsAction =
    | UserGroupsFetched
