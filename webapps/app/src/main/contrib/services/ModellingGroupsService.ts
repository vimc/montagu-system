import { localApiRequest } from "../../shared/services/LocalApiRequest"

export function modellingGroupsService(getState: Function) {
    return {

        getGroups() {
            return localApiRequest({
                Authorization: 'Bearer ' + getState().auth.bearerToken,
            })
                .get("/modelling-groups/")
        },

    }
}
