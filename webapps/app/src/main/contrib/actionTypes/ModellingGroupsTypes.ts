import { ModellingGroupsState } from "../reducers/modellingGroupsReducer";

export enum TypeKeys {
    GROUPS_FETCHED = "GROUPS_FETCHED",
}

export interface GroupsFetched {
    type: TypeKeys.GROUPS_FETCHED;
    data: ModellingGroupsState[];
}

export type ActionsTypes =
    | GroupsFetched
