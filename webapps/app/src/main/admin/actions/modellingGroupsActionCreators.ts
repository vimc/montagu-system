import { Dispatch } from "redux";

import { ModellingGroupsService } from "../../shared/services/ModellingGroupsService";
import {AdminAppState} from "../reducers/adminAppReducers";
import {ModellingGroup} from "../../shared/models/Generated";
import {AdminGroupsFetched, ModellingGroupTypes} from "../actionTypes/ModellingGroupsTypes";

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

    // setCurrentGroup(groupId: string) {
    //     return (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {
    //         const userGroups = getState().groups.userGroups;
    //         const currentUserGroup = userGroups.filter(group => group.id === groupId)[0];
    //         dispatch({
    //             type: ModellingGroupTypes.SET_CURRENT_USER_GROUP,
    //             data: currentUserGroup
    //         } as SetCurrentUserGroup );
    //     }
    // }
};
