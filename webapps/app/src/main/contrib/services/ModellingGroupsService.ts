import { localApiRequest } from "../../shared/services/LocalApiRequest"

export function modellingGroupsService(dispatch: any, getState: Function) {
    return {

        getGroups() {
            return localApiRequest(dispatch, {
                Authorization: 'Bearer ' + getState().auth.bearerToken
            })
                .get("/modelling-groups/")
        },

    }
}
