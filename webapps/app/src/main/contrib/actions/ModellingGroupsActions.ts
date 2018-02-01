import { Dispatch } from "redux";
import { AxiosResponse } from "axios";

import { modellingGroupsService } from "../services/modellingGroupsService";

export const ModellingGroupsActions = {

    getGroups() {
        return async (dispatch: Dispatch<any>, getState: Function) => {
            try {
                const response: AxiosResponse = await modellingGroupsService(getState).getGroups()
                const userGroups = getState().auth.modellingGroups;
                const groups = response.data.data.filter((item: any) => userGroups.indexOf(item.id) > -1)
                dispatch({
                    type: 'GROUPS_FETCHED',
                    data: groups
                });
            } catch(e) {
                console.log("Could not fetch modelling groups for a user");
            }
        }
    },




};
