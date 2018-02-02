import { axiosRequest } from "../modules/AxiosRequest";
import { settings } from "../Settings";
import { authActions } from "../actions/authActions";

import {
    makeNotificationException,
    Notification,
    notificationActions,
    NotificationException
} from "../actions/NotificationActions";

export function localApiRequest(dispatch?: any, options?: any) {

    options.baseURL = settings.apiUrl();

    const handleError = (error: any) => {
        switch (error.code) {
            case "bearer-token-invalid":
                console.log("Access token has expired or is otherwise invalid: Logging out.");
                dispatch(authActions.logOut());
                const notification: Notification = {
                    message: "Your session has expired. You will need to log in again",
                    type: "info"
                };
                throw new NotificationException(notification);
            default:
                throw makeNotificationException(error.message, "error");
        }
    }

    // for http status success codes
    const processSuccess = (response: any) => {
        switch (response.data.status) {
            case "success":
                return response.data.data;
            case "failure":
                return response.data.errors.forEach(handleError);
            default:
                throw makeNotificationException("The server response was not correctly formatted: "
                    + response.toString(), "error");
        }
    }

    // for all with http error status code, probably the only one needed
    const processFailure = (response: any) => {
        if (response.data.errors) {
            return response.data.errors.forEach(handleError);
        }
        throw makeNotificationException("The server response was not correctly formatted: "
            + response.toString(), "error");
    }



    return {
        get(url: string){
            return axiosRequest(options)
                .get(url)
                .then(processSuccess)
                .catch(processFailure)
        },
        post(url: string, params:any){
            return axiosRequest(options)
                .post(url, params)
                .then(processSuccess)
                .catch(processFailure)
        },
        postNoProcess(url: string, params:any){
            return axiosRequest(options)
                .post(url, params)
        }

    }
}