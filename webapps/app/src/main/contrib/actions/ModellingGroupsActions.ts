import { Dispatch } from "redux";
import { AxiosError, AxiosResponse } from "axios";

import { modellingGroupsService } from "../services/modellingGroupsService";

export const ModellingGroupsActions = {

    getGroups() {
        return (dispatch: Dispatch<any>, getState: Function) => {
            modellingGroupsService(getState().auth.bearerToken).getGroups()
                .then((response: AxiosResponse) => {
                    const userGroups = getState().auth.modellingGroups;
                    console.log('bf comp', userGroups, response.data.data)
                    const groups = response.data.data.filter((item: any) => userGroups.indexOf(item.id) > -1)
                    dispatch({
                        type: 'GROUPS_FETCHED',
                        data: groups
                    });
                });
        }
    },




};
