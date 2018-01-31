import { Dispatch } from "redux";
import { AxiosError, AxiosResponse } from "axios";

// import { AuthenticationError, TypeKeys } from "../actionTypes/AuthTypes";
// import { decodeToken, Token, isExpired, parseModellingGroups } from "../modules/JwtToken";
import { ModellingGroupsService } from "../services/ModellingGroupsService";

export const ModellingGroupsActions = {

    getGroups() {
        return (dispatch: any, getState: any) => {
            ModellingGroupsService(getState().auth.bearerToken).getGroups()
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
