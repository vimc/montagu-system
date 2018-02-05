import { axiosRequest } from "../modules/AxiosRequest";
import { settings } from "../Settings";
import { localStorageHandler } from "./localStorageHandler";

import {
    makeNotificationException,
    Notification,
    notificationActions,
    NotificationException
} from "../actions/NotificationActions";
import {TypeKeys} from "../actionTypes/AuthTypes";

export abstract class LocalService {
    dispatch: any;
    bearerToken: string;
    options: any = {};

    constructor(dispatch: any, getState: Function) {
        this.dispatch = dispatch;
        this.bearerToken = this.getTokenFromState(getState())
        this.initOptions();
    }

    getTokenFromState(state: any) {
        if (state.auth && state.auth.bearerToken) {
            return state.auth.bearerToken
        }
    }

    setOptions(options: any) {
        this.options = Object.assign(this.options, options);
    }

    initOptions() {
        this.options.baseURL = settings.apiUrl();
        if (this.bearerToken) {
            this.options.Authorization = 'Bearer ' + this.bearerToken;
        }
    }

    initRequestEngine() {
        return axiosRequest(this.options)
    }

    get(url: string){
        return this.initRequestEngine()
            .get(url)
            .then(this.processSuccess)
            .catch(this.processFailure)
    }

    post(url: string, params:any){
        return this.initRequestEngine()
            .post(url, params)
            .then(this.processSuccess)
            .catch(this.processFailure)
    }

    postNoProcess(url: string, params:any){
        return this.initRequestEngine()
            .post(url, params)
    }

    handleError (error: any) {
        switch (error.code) {
            case "bearer-token-invalid":
                console.log("Access token has expired or is otherwise invalid: Logging out.");
                this.dispatch(this.logOut());
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
    processSuccess (response: any) {
        switch (response.data.status) {
            case "success":
                return response.data.data;
            // in case if failure comes with good http response status code
            case "failure":
                return response.data.errors.forEach(this.handleError);
            default:
                throw makeNotificationException("The server response was not correctly formatted: "
                    + response.toString(), "error");
        }
    }

    // for all with http error status code, probably the only one needed
    processFailure (error: any) {
        if (error.response && error.response.data.errors && error.response.data.errors.length) {
            return error.response.data.errors.forEach(this.handleError);
        }
        throw makeNotificationException("The server response was not correctly formatted: "
            + error.message, "error");
    }

    logOut() {
        localStorageHandler.remove("accessToken");
        this.dispatch({
            type: TypeKeys.UNAUTHENTICATED
        });
    }

}
