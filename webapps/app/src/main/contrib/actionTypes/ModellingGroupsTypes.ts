import { ModellingGroup } from "../../shared/models/Generated";

export enum ModellingGroupTypeKeys {
    USER_GROUPS_FETCHED = "USER_GROUPS_FETCHED",
}

export interface GroupsFetched {
    type: ModellingGroupTypeKeys.USER_GROUPS_FETCHED;
    data: ModellingGroup[];
}

export type ActionsTypes =
    | GroupsFetched
