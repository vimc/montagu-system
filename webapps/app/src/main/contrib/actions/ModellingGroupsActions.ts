import { Dispatch } from "redux";

import { modellingGroupsService } from "../services/modellingGroupsService";

export const ModellingGroupsActions = {

    getGroups() {
        return async (dispatch: Dispatch<any>, getState: Function) => {
            const allGroups: any = await modellingGroupsService(dispatch, getState).getGroups()
            const userGroups = getState().auth.modellingGroups;
            const groups = allGroups.filter((item: any) => userGroups.indexOf(item.id) > -1)
            dispatch({
                type: 'GROUPS_FETCHED',
                data: groups
            });

        }
    },




};
