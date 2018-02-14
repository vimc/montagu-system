import { Dispatch } from "redux";

import { ModellingGroupsService } from "../services/ModellingGroupsService";
import { ModellingGroupTypeKeys } from "../actionTypes/ModellingGroupsTypes";

export const modellingGroupsActions = {

    getGroups() {
        return async (dispatch: Dispatch<any>, getState: Function) => {
            const allGroups: any = await (new ModellingGroupsService(dispatch, getState)).getGroups();
            if (allGroups && allGroups.length) {
                const userGroups = getState().auth.modellingGroups;
                if (userGroups && userGroups.length) {
                    const groups = allGroups.filter((item: any) => userGroups.indexOf(item.id) > -1);
                    dispatch({
                        type: ModellingGroupTypeKeys.GROUPS_FETCHED,
                        data: groups
                    });
                }
            }
        }
    },




};
