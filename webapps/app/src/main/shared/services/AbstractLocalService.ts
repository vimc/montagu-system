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
import {CacheInterface} from "../modules/cache/CacheInterface";
import {singletonVariableCache} from "../modules/cache/singletonVariableCache";

export interface OptionsHeaders {
   Authorization?: string;
   'Content-Type'?: string;
}

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
    cacheKey?: string;
}

export abstract class AbstractLocalService {
    protected dispatch: Dispatch<Action>;

    protected bearerToken: string;
    protected options: InputOptions = {};

    protected cacheEngine: CacheInterface = null;

    public constructor(dispatch: Dispatch<Action>, getState: () => GlobalState) {
        this.dispatch = dispatch;

        this.bearerToken = this.getTokenFromState(getState());
        this.initOptions();

        this.cacheEngine = singletonVariableCache;

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
        return this;
    }

    protected initOptions() {
        this.options = {};
        this.options.baseURL = settings.apiUrl();
        this.options.cacheKey = null;
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
        return this.getData(this.makeUrl(url), "GET");
    }

    public post(url: string, params?:any){
        console.log('post', url, params);
        return this.getData(this.makeUrl(url), "POST", params);
    }

    private getFullyQualifiedCacheKey(cacheKey: string, url: string) : string {
        return ["localService", this.constructor.name, cacheKey, encodeURIComponent(url)].join('.');
    }

    protected clearCache(cacheKey: string, url: string) {
        const fullyQualifiedUrl = this.makeUrl(url);
        const key = this.getFullyQualifiedCacheKey(cacheKey, fullyQualifiedUrl);

        this.cacheEngine.clear(key);
    }

    public clearAllCache() {
        this.cacheEngine.clearAll();
        return this;
    }

    protected getData(url: string, method: string, params?: any) {
        if (this.options.cacheKey) {
            const cacheValue = this.cacheEngine.get(this.getFullyQualifiedCacheKey(this.options.cacheKey, url));
            if (cacheValue) {
                // reset options on returning cached data from endpoint
                this.initOptions();
                return Promise.resolve(cacheValue);
            }
        }
        return this.doFetch(url, this.makeRequestOptions(method, params))
            .then(this.processResponse)
            .catch(this.notifyOnErrors);
    }

    public postNoProcess(url: string, params?:any){
        return this.doFetch(this.makeUrl(url), this.makeRequestOptions('POST', params))
            .then((response:any) => {
                this.initOptions();
                return response.json()
            });
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
                    this.dispatch(this.logOut());
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
                if (this.options.cacheKey) {
                    this.cacheEngine.set(this.getFullyQualifiedCacheKey(this.options.cacheKey, response.url), result.data)
                }
                // reset options on successful request
                this.initOptions();
                return result.data as TModel;
            case "failure":
                // reset options on defined failure
                this.initOptions();
                return result.errors.forEach(handleError);
            default:
                // reset options on unexpected failure
                this.initOptions();
                throw makeNotificationException("The server response was not correctly formatted: "
                    + response.toString(), "error");
        }
    }

    notifyOnErrors(error: any) {
        this.initOptions();
        notificationActions.notify(error);
    }

    protected logOut() {
        return (dispatch: Dispatch<Action>) => {
            localStorageHandler.remove("accessToken");
            this.clearAllCache();
            dispatch({
                type: AuthTypeKeys.UNAUTHENTICATED
            });
        };
    }

}
