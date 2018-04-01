import { Dispatch } from "redux";

import { ModellingGroupsService } from "../../shared/services/ModellingGroupsService";
import {UserGroupsFetched, ModellingGroupTypes, SetCurrentUserGroup} from "../actionTypes/ModellingGroupsTypes";
import {ContribAppState} from "../reducers/contribAppReducers";

export const modellingGroupsActionCreators = {

    getUserGroups() {
        return async (dispatch: Dispatch<any>, getState: () => ContribAppState) => {
            const allGroups: any = await (new ModellingGroupsService(dispatch, getState)).getAllGroups();
            let groups = [];
            if (allGroups && allGroups.length) {
                const userGroups = getState().auth.modellingGroups;
                if (userGroups && userGroups.length) {
                    groups = allGroups.filter((item: any) => userGroups.indexOf(item.id) > -1);
                }
            }
            dispatch({
                type: ModellingGroupTypes.USER_GROUPS_FETCHED,
                data: groups
            } as UserGroupsFetched );
        }
    },

    setCurrentGroup(groupId: string) {
        return (dispatch: Dispatch<any>, getState: () => ContribAppState) => {
            const userGroups = getState().groups.userGroups;
            const currentUserGroup = userGroups.filter(group => group.id === groupId)[0];
            dispatch({
                type: ModellingGroupTypes.SET_CURRENT_USER_GROUP,
                data: currentUserGroup
            } as SetCurrentUserGroup );
        }
    }
};
