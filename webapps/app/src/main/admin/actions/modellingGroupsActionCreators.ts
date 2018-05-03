import { Dispatch } from "redux";
import {compact} from "lodash";

import { ModellingGroupsService } from "../../shared/services/ModellingGroupsService";
import {AdminAppState} from "../reducers/adminAppReducers";
import {ModellingGroup, ModellingGroupDetails, Result} from "../../shared/models/Generated";
import {
    AdminGroupsFetched,
    ModellingGroupTypes,
    SetAdminGroupDetails,
    SetCurrentAdminGroup, SetCurrentAdminGroupMembers
} from "../actionTypes/ModellingGroupsTypes";
import {ContribAppState} from "../../contrib/reducers/contribAppReducers";

export const modellingGroupsActionCreators = {

    getAllGroups() {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            const groups: ModellingGroup[] = await (new ModellingGroupsService(dispatch, getState)).getAllGroups();
            dispatch({
                type: ModellingGroupTypes.ADMIN_GROUPS_FETCHED,
                data: groups
            } as AdminGroupsFetched );
        }
    },

    getGroupDetails(groupId: string) {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            const groupDetails: ModellingGroupDetails = await (new ModellingGroupsService(dispatch, getState)).getGroupDetails(groupId);
            dispatch({
                type: ModellingGroupTypes.ADMIN_GROUP_DETAILS_FETCHED,
                data: groupDetails
            } as SetAdminGroupDetails);
        }
    },

    setCurrentGroup(groupId: string) {
        return (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            const groups = getState().groups.groups;
            const currentGroup = groups.find(group => group.id === groupId);
            dispatch({
                type: ModellingGroupTypes.SET_CURRENT_ADMIN_GROUP,
                data: currentGroup ? currentGroup : null
            } as SetCurrentAdminGroup);
        }
    },

    addUserToGroup(groupId: string, username: string) {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            const result = await (new ModellingGroupsService(dispatch, getState))
                .addMember(groupId, username);
            if (result === "OK") {
                dispatch(this.clearCacheForGroupDetails(groupId));
                await dispatch(this.getGroupDetails(groupId));
                dispatch(this.setCurrentGroupMembers());
            }
        }
    },

    removeUserFromGroup(groupId: string, username: string) {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            const result = await (new ModellingGroupsService(dispatch, getState))
                .removeMember(groupId, username);
            if (result === "OK") {
                dispatch(this.clearCacheForGroupDetails(groupId));
                await dispatch(this.getGroupDetails(groupId));
                dispatch(this.setCurrentGroupMembers());
            }
        }
    },

    clearCacheForGroupDetails(groupId: string,) {
        return (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {
            (new ModellingGroupsService(dispatch, getState)).clearCacheForGroupDetails(groupId);
        }
    },

    setCurrentGroupMembers() {
        return (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            const currentGroupDetails = getState().groups.currentGroupDetails;
            const allUsers = getState().users.users;
            if (!currentGroupDetails || !allUsers.length) {
                return dispatch({
                    type: ModellingGroupTypes.SET_CURRENT_ADMIN_GROUP_MEMBERS,
                    data: []
                } as SetCurrentAdminGroupMembers);
            }

            const currentGroupMembers = compact(currentGroupDetails.members
                .map(memberUsername => allUsers.find(user => user.username === memberUsername))
            );

            dispatch({
                type: ModellingGroupTypes.SET_CURRENT_ADMIN_GROUP_MEMBERS,
                data: currentGroupMembers
            } as SetCurrentAdminGroupMembers);
        }
    },

};
