import { ModellingGroup } from "../../shared/models/Generated";

export enum ModellingGroupTypeKeys {
    GROUPS_FETCHED = "GROUPS_FETCHED",
}

export interface GroupsFetched {
    type: ModellingGroupTypeKeys.GROUPS_FETCHED;
    data: ModellingGroup[];
}

export type ActionsTypes =
    | GroupsFetched
