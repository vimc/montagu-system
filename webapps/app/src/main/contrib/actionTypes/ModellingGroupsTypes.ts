import { ModellingGroupsState } from "../reducers/modellingGroupsReducer";
import { ModellingGroup } from "../../shared/models/Generated";

export enum TypeKeys {
    GROUPS_FETCHED = "GROUPS_FETCHED",
}

export interface GroupsFetched {
    type: TypeKeys.GROUPS_FETCHED;
    data: ModellingGroup[];
}

export type ActionsTypes = | GroupsFetched
