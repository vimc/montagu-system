import { Dispatch } from "redux";

import { ModellingGroupsService } from "../../shared/services/ModellingGroupsService";
import { UserGroupsFetched, ModellingGroupTypes} from "../actionTypes/ModellingGroupsTypes";
import {GlobalState} from "../../shared/reducers/GlobalState";

export const modellingGroupsActionCreators = {

    getUserGroups() {
        return async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
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




};
