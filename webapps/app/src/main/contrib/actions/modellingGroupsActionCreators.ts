import { Dispatch } from "redux";

import { ModellingGroupsService } from "../../shared/services/ModellingGroupsService";
import {UserGroupsFetched, ModellingGroupTypes, SetCurrentUserGroup} from "../actionTypes/ModellingGroupsTypes";
import {ContribAppState} from "../reducers/contribAppReducers";
import {ModellingGroup} from "../../shared/models/Generated";

export const modellingGroupsActionCreators = {

    getUserGroups() {
        return async (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {
            const groups: ModellingGroup[] = await (new ModellingGroupsService(dispatch, getState)).getUserGroups();
            dispatch({
                type: ModellingGroupTypes.USER_GROUPS_FETCHED,
                data: groups
            } as UserGroupsFetched );
        }
    },

    setCurrentGroup(groupId: string) {
        return (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {
            const userGroups = getState().groups.userGroups;
            const currentUserGroup = userGroups.filter(group => group.id === groupId)[0];
            dispatch({
                type: ModellingGroupTypes.SET_CURRENT_USER_GROUP,
                data: currentUserGroup
            } as SetCurrentUserGroup );
        }
    }
};
