import { Dispatch } from "redux";

import { ModellingGroupsService } from "../../shared/services/ModellingGroupsService";
import {AdminAppState} from "../reducers/adminAppReducers";
import {ModellingGroup, ModellingGroupDetails} from "../../shared/models/Generated";
import {
    AdminGroupsFetched,
    ModellingGroupTypes,
    SetAdminGroupDetails,
    SetCurrentAdminGroup
} from "../actionTypes/ModellingGroupsTypes";

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
                data: currentGroup
            } as SetCurrentAdminGroup);
        }
    }
};
