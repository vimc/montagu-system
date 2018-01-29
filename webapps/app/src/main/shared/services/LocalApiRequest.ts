import { axiosRequest } from "../modules/AxiosRequest";
import { settings } from "../Settings";

export function localApiRequest(options?: any) {

    options.baseURL = settings.apiUrl();

    return axiosRequest(options)
}