import {ModellingGroup, ModellingGroupDetails, User} from "../../shared/models/Generated";

export enum ModellingGroupTypes {
    GROUPS_FETCHED = "GROUPS_FETCHED",
    GROUP_DETAILS_FETCHED = "GROUP_DETAILS_FETCHED",
    SET_CURRENT_GROUP = "SET_CURRENT_GROUP",
    SET_CURRENT_GROUP_MEMBERS = "SET_CURRENT_GROUP_MEMBERS",
    ADD_MODELLING_GROUP = "ADD_MODELLING_GROUP"
}

export interface GroupsFetched {
    type: ModellingGroupTypes.GROUPS_FETCHED;
    data: ModellingGroup[];
}

export interface SetCurrentGroup {
    type: ModellingGroupTypes.SET_CURRENT_GROUP;
    data: ModellingGroup;
}

export interface SetCurrentGroupMembers {
    type: ModellingGroupTypes.SET_CURRENT_GROUP_MEMBERS;
    data: User[];
}


export interface SetGroupDetails {
    type: ModellingGroupTypes.GROUP_DETAILS_FETCHED;
    data: ModellingGroupDetails;
}

export interface AddModellingGroup {
    type: ModellingGroupTypes.ADD_MODELLING_GROUP;
    data: ModellingGroup;
}

export type ModellingGroupsAction =
    | GroupsFetched
    | SetCurrentGroup
    | SetGroupDetails
    | SetCurrentGroupMembers
    | AddModellingGroup
    ;