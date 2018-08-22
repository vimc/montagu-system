import {Dispatch, Action} from "redux";
import {clone} from "lodash";

import {settings} from "../Settings";
import {localStorageHandler} from "./localStorageHandler";
import {ErrorInfo, Result} from "../models/Generated";
import {AuthTypeKeys} from "../actionTypes/AuthTypes";
import {CacheInterface} from "../modules/cache/CacheInterface";
import {singletonVariableCache} from "../modules/cache/singletonVariableCache";
import {APIService} from "../models/APIService";
import {notificationActionCreators} from "../actions/notificationActionCreators";
import {CommonState} from "../reducers/CommonState";

export interface OptionsHeaders {
    Authorization?: string;
    'Content-Type'?: string;
    Cookie?: string;
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
    cacheKey?: string;
    notificationOnError?: boolean;
    noCache?: boolean;
}

export abstract class AbstractLocalService {
    protected dispatch: Dispatch<Action>;

    protected bearerToken: string;
    protected options: InputOptions = {};

    protected cacheEngine: CacheInterface = null;

    constructor(dispatch: Dispatch<Action>, getState: () => CommonState) {
        this.dispatch = dispatch;

        this.bearerToken = this.getTokenFromState(getState());
        this.initOptions();

        this.cacheEngine = singletonVariableCache;

        this.processResponse = this.processResponse.bind(this);
        this.notifyOnErrors = this.notifyOnErrors.bind(this);
        this.handleErrorsWithNotifications = this.handleErrorsWithNotifications.bind(this);
    }

    protected getTokenFromState(state: CommonState) {
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
        this.options.cacheKey = null;
        this.options.notificationOnError = true;
        this.options.noCache = false;
    }

    protected makeRequestOptions(method: string, body?: any): RequestOptions {
        const headers: OptionsHeaders = {};
        if (this.options.Authorization) headers.Authorization = this.options.Authorization;
        if (this.options['Content-Type']) headers['Content-Type'] = this.options['Content-Type'];
        // If we're not running in a browser, manually add the cookie (for integration tests)
        if (navigator.userAgent.startsWith("Node.js")) {
            headers.Cookie = `montagu_jwt_token=${this.bearerToken}`;
        }

        const requestOptions: RequestOptions = {
            method,
            headers,
            credentials: "include"
        };
        if (body) requestOptions.body = body;
        return requestOptions;
    }

    protected makeUrl(uri: string, service: APIService) {
        return buildURL(uri, service);
    }

    protected doFetch(url: string, params?: any) {
        return fetch(url, params)
    }

    public get(url: string, service?: APIService) {
        console.log('get', url);
        service = service || "main";
        return this.getData(this.makeUrl(url, service), "GET");
    }

    public post(url: string, params?: any, service?: APIService) {
        console.log('post', url, params);
        service = service || "main";
        return this.getData(this.makeUrl(url, service), "POST", params);
    }

    private getFullyQualifiedCacheKey(cacheKey: string, url: string): string {
        return ["localService", this.constructor.name, cacheKey, encodeURIComponent(url)].join('.');
    }

    protected clearCache(cacheKey: string, url: string, service?: APIService) {
        service = service || "main";
        const fullyQualifiedUrl = this.makeUrl(url, service);
        const key = this.getFullyQualifiedCacheKey(cacheKey, fullyQualifiedUrl);

        this.cacheEngine.clear(key);
    }

    public clearAllCache() {
        this.cacheEngine.clearAll();
        return this;
    }

    protected getData(url: string, method: string, params?: any) {
        if (this.options.cacheKey && !this.options.noCache) {
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

    public postNoProcess(url: string, params?: any, service?: APIService) {
        service = service || "main";
        return this.doFetch(this.makeUrl(url, service), this.makeRequestOptions('POST', params))
            .then((response: any) => {
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

    expiredTokenAction() {
        console.log("Access token has expired or is otherwise invalid: Logging out.");
        this.dispatch(this.logOut());
        notificationActionCreators.notify("Your session has expired. You will need to log in again", "info")(this.dispatch, null);
        setTimeout(() => notificationActionCreators.clear("error")(this.dispatch, null));
    }

    handleErrorsWithNotifications(error: ErrorInfo) {
        switch (error.code) {
            case "cookie-bearer-token-invalid":
                return this.expiredTokenAction();
            default:
                notificationActionCreators.notify(error.message, "error")(this.dispatch, null);
        }
    };

    handleErrorsReturn(result: any) {
        if (result.errors.some((x: ErrorInfo) => x.code === "cookie-bearer-token-invalid")) {
            return this.expiredTokenAction();
        }
        return result;
    };

    processResult<TModel>(result: Result, response: Response): TModel | void {
        const options = clone(this.options);
        this.initOptions();
        switch (result.status) {
            case "success":
                if (options.cacheKey && !options.noCache) {
                    this.cacheEngine.set(this.getFullyQualifiedCacheKey(options.cacheKey, response.url), result.data)
                }
                return result.data as TModel;
            case "failure":
                return options.notificationOnError
                    ? result.errors.forEach(this.handleErrorsWithNotifications)
                    : this.handleErrorsReturn(result) as TModel;
            default:
                notificationActionCreators.notify(
                    "The server response was not correctly formatted: " + JSON.stringify(result),
                    "error"
                )(this.dispatch, null);
        }
    }

    notifyOnErrors(error: any) {
        this.initOptions();
        notificationActionCreators.notify(error.toString(), "error")(this.dispatch, null);
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

export function buildRelativeURL(urlFragment: string): string {
    return "/v1" + urlFragment;
}

export function buildURL(urlFragment: string, service: APIService): string {
    if (urlFragment.startsWith("/v1")) {
        urlFragment = urlFragment.substring("/v1".length);
    }
    let baseUrl = settings.apiUrl();
    if (service == "reporting") {
        baseUrl = settings.reportingApiUrl();
    }
    return baseUrl + urlFragment;
}