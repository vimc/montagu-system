import { Dispatch } from "redux";

import { ModellingGroupsService } from "../services/modellingGroupsService";
import { TypeKeys } from "../actionTypes/ModellingGroupsTypes";

export const modellingGroupsActions = {

    getGroups() {
        return async (dispatch: Dispatch<any>, getState: Function) => {
            const allGroups: any = await (new ModellingGroupsService(dispatch, getState)).getGroups()
            const userGroups = getState().auth.modellingGroups;
            const groups = allGroups.filter((item: any) => userGroups.indexOf(item.id) > -1)
            dispatch({
                type: TypeKeys.GROUPS_FETCHED,
                data: groups
            });

        }
    },




};
