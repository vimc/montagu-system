import {Dispatch} from "redux";

import {ModellingGroupsService} from "../../shared/services/ModellingGroupsService";
import {
    ConfidentialityRetrieved, ConfidentialitySigned, ModellingGroupTypeKeys,
    UserGroupsFetched
} from "../actionTypes/ModellingGroupsTypes";
import {GlobalState} from "../../shared/reducers/GlobalState";
import {UserService} from "../services/UserService";

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
                type: ModellingGroupTypeKeys.USER_GROUPS_FETCHED,
                data: groups
            } as UserGroupsFetched);
        }
    },

    signConfidentialityAgreement() {

        return async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
            const result: any = await (new UserService(dispatch, getState)).signConfidentiality();

            if (result == "OK") {
                dispatch({
                    type: ModellingGroupTypeKeys.CONFIDENTIALITY_SIGNED,
                    data: true
                } as ConfidentialitySigned);
            }
        }
    },

    getConfidentialityAgreement() {

        return async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
            const result: Boolean = await (new UserService(dispatch, getState)).getConfidentiality();

            dispatch({
                type: ModellingGroupTypeKeys.CONFIDENTIALITY_RETRIEVED,
                data: result
            } as ConfidentialityRetrieved);
        }
    }
};
