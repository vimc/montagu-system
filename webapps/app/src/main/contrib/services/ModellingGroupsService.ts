import { localApiRequest } from "../../shared/services/LocalApiRequest"
// import { AxiosResponse, AxiosError } from "axios";

export function ModellingGroupsService(token?: string) {
    return {

        getGroups() {
            return localApiRequest({
                Authorization: 'Bearer ' + token,
            })
                .get("/modelling-groups/")
        },

    }
}
