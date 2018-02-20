import { Dispatch, Action } from "redux";
import { settings } from "../Settings";
import { localStorageHandler } from "./localStorageHandler";
import {ErrorInfo, Result} from "../models/Generated";
import {
    makeNotificationException,
    Notification,
    NotificationException,
    notificationActions
} from "../actions/NotificationActions";

import { AuthTypeKeys } from "../actionTypes/AuthTypes";
import {GlobalState} from "../reducers/GlobalState";
import {localCache} from "./localCache";

export interface OptionsHeaders {
   Authorization?: string;
   'Content-Type'?: string;
};

export interface RequestOptions {
    headers?: OptionsHeaders;
    body?: any;
    method?: string;
    credentials?: "omit" | "same-origin" | "include";
}

export interface InputOptions {
    Authorization?: string;
    'Content-Type'?: string;
    credentials?: "omit" | "same-origin" | "include";
    baseURL?: string;
    cache?: string;
}

export abstract class LocalService {
    protected dispatch: Dispatch<Action>;
    protected getGlobalState: Function;

    protected bearerToken: string;
    protected options: InputOptions = {};

    public constructor(dispatch: Dispatch<Action>, getState: () => GlobalState) {
        this.dispatch = dispatch;
        this.getGlobalState = getState;

        this.bearerToken = this.getTokenFromState(getState());
        this.initOptions();

        this.processResponse = this.processResponse.bind(this);
        this.notifyOnErrors = this.notifyOnErrors.bind(this);
    }

    protected getTokenFromState(state: GlobalState) {
        if (state.auth && state.auth.bearerToken) {
            return state.auth.bearerToken
        }
    }

    public setOptions(options: InputOptions) {
        Object.assign(this.options, options);
    }

    protected initOptions() {
        this.options.baseURL = settings.apiUrl();
        this.options.cache = null;
        if (this.bearerToken) {
            this.options.Authorization = 'Bearer ' + this.bearerToken;
        }
    }

    protected makeRequestOptions(method: string, body?: any) :RequestOptions {
        const headers: OptionsHeaders = {};
        if (this.options.Authorization) headers.Authorization = this.options.Authorization;
        if (this.options['Content-Type']) headers['Content-Type'] = this.options['Content-Type'];
        const requestOptions : RequestOptions = {
            method,
            headers,
        }
        if (this.options.credentials) requestOptions.credentials = this.options.credentials;
        if (body) requestOptions.body = body;
        return requestOptions;
    }

    protected makeUrl(uri: string) {
        return this.options.baseURL + uri;
    }

    protected doFetch(url: string, params? :any) {
        return fetch(url, params)
    }

    public get(url: string){
        console.log('get', url);
        return this.getData(url, "GET");
    }

    public post(url: string, params?:any){
        console.log('post', url, params);
        return this.getData(url, "POST", params);
    }

    protected getCache(url: string) {
        return localCache.get([this.constructor.name, this.options.cache, encodeURIComponent(url)].join('.'));
    }

    protected setCache(url: string, data: any) {
        localCache.set([this.constructor.name, this.options.cache, encodeURIComponent(url)].join('.'), data);
    }

    protected getData(url: string, method: string, params?: any) {
        if (this.options.cache) {
           const cacheValue = this.getCache(this.makeUrl(url));
           if (cacheValue) {
               return Promise.resolve(cacheValue);
           }
        }
        return this.doFetch(this.makeUrl(url), this.makeRequestOptions(method, params))
            .then(this.processResponse)
            .catch(this.notifyOnErrors);
    }

    public postNoProcess(url: string, params?:any){
        return this.doFetch(this.makeUrl(url), this.makeRequestOptions('POST', params))
            .then((response:any) => response.json());
    }

    processResponse<TModel>(httpResponse: Response): Promise<any> {
        return httpResponse.json()
            .then((response: any) => {
                const apiResponse = <Result>response;
                return this.processResult(apiResponse, httpResponse);
            });
    }

    processResult<TModel>(result: Result, response: any): TModel | void {
        const handleError = (error: ErrorInfo) => {
            switch (error.code) {
                case "bearer-token-invalid":
                    console.log("Access token has expired or is otherwise invalid: Logging out.");
                    this.dispatch(this.logOut())
                    const notification: Notification = {
                        message: "Your session has expired. You will need to log in again",
                        type: "info"
                    };
                    throw new NotificationException(notification);
                default:
                    throw makeNotificationException(error.message, "error");
            }
        };

        switch (result.status) {
            case "success":
                if (this.options.cache) {
                    this.setCache(response.url, result.data);
                }
                return result.data as TModel;
            case "failure":
                return result.errors.forEach(handleError);
            default:
                throw makeNotificationException("The server response was not correctly formatted: "
                    + response.toString(), "error");
        }
    }

    notifyOnErrors(error: any) {
        notificationActions.notify(error);
    }

    errorToNotificationException(error: any): NotificationException {
        if (error.hasOwnProperty("notification")) {
            return error;
        } else if (error instanceof Error) {
            return makeNotificationException(error.message, "error");
        } else {
            return makeNotificationException(error, "error");
        }
    }


    protected logOut() {
        return (dispatch: Dispatch<Action>) => {
            localStorageHandler.remove("accessToken");
            localCache.clearAll();
            dispatch({
                type: AuthTypeKeys.UNAUTHENTICATED
            });
        };
    }

}
