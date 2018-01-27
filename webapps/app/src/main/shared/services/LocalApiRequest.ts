import { request } from "../modules/Request";
import { settings } from "../Settings";

export function localApiRequest(options: any) {

    options.baseURL = settings.apiUrl();

    return request(options)
}