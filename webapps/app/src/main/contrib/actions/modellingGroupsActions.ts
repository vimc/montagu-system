import { Dispatch } from "redux";

import { ModellingGroupsService } from "../../shared/services/ModellingGroupsService";
import {GroupsFetched, ModellingGroupTypeKeys} from "../actionTypes/ModellingGroupsTypes";

export const modellingGroupsActions = {

    getUserGroups() {
        return async (dispatch: Dispatch<any>, getState: Function) => {
            const allGroups: any = await (new ModellingGroupsService(dispatch, getState)).getAllGroups();
            let groups = [];
            if (allGroups && allGroups.length) {
                const userGroups = getState().auth.modellingGroups;
                if (userGroups && userGroups.length) {
                    groups = allGroups.filter((item: any) => userGroups.indexOf(item.id) > -1);
                }
            }
            dispatch({
                type: ModellingGroupTypeKeys.USER_GROUPS_FETCHED,
                data: groups
            } as GroupsFetched );
        }
    },




};
