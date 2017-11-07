import {ErrorInfo, Result} from "../models/Generated";
import fetcher from "./Fetcher";
import {
    makeNotificationException,
    Notification,
    notificationActions,
    NotificationException
} from "../actions/NotificationActions";
import {authActions} from "../actions/AuthActions";
import {jwtDecoder} from "./JwtDecoder";

export interface FetchConfig<TState, TModel> {
    success: (data: TModel) => void;
    loading: (x: any) => void;
    isCached: CacheCheck<TState>;
}

export type UrlBuilder<TState> = (state: TState) => string;
type CacheCheck<TState> = (state: TState, ...args: any[]) => boolean;

export abstract class Source<TState> {
    protected doFetch<TModel>(urlFragment: UrlBuilder<TState>, config: FetchConfig<TState, TModel>): AltJS.SourceModel<TModel> {
        const remoteFetch = this.fetchRemoteData;
        const source: AltJS.SourceModel<TModel> = {
            remote(state: TState) {
                const promise: Promise<Response> = remoteFetch(urlFragment(state));
                return promise
                    .then(response => processResponse<TModel>(response))
                    .catch(notifyOnErrors);
            },
            local(state: TState): any {
                return Promise.resolve(true);
            },
            success: config.success,
            loading: config.loading,
            error: notificationActions.notify,
        };
        source.shouldFetch = ((state: TState) => !config.isCached(state)) as any;
        return source;
    }

    protected fetchRemoteData(url: string): Promise<Response> {
        return fetcher.fetcher.fetch(url)
    }
}

export function processResponseAndNotifyOnErrors<TModel>(response: Response): Promise<any> {
    return processResponse<TModel>(response).catch(notifyOnErrors);
}

export function processEncodedResultAndNotifyOnErrors<TModel>(queryAsObject: any): TModel | void {

    try {
        const decoded = jwtDecoder.jwtDecode(queryAsObject.result);
        const result = JSON.parse(decoded.result);
        return processResult<TModel>(result, decoded)
    } catch (e) {
        try {
            notifyOnErrors(e)
        }
        catch(e){
            notificationActions.notify(e)
        }
    }
}

function processResponse<TModel>(response: Response): Promise<any> {

    return response.json()
        .then((response: any) => {
            const apiResponse = <Result>response;
            return processResult(apiResponse, response);
        });
}

function handleError(error: ErrorInfo) {
    switch (error.code) {
        case "bearer-token-invalid":
            console.log("Access token has expired or is otherwise invalid: Logging out.");
            authActions.logOut();
            const notification: Notification = {
                message: "Your session has expired. You will need to log in again",
                type: "info"
            };
            throw new NotificationException(notification);
        default:
            throw makeNotificationException(error.message, "error");
    }
}

function processResult<TModel>(result: Result, response: any): TModel | void {
    switch (result.status) {
        case "success":
            return result.data as TModel;
        case "failure":
            return result.errors.forEach(handleError);
        default:
            throw makeNotificationException("The server response was not correctly formatted: "
                + response.toString(), "error");
    }
}

export function notifyOnErrors(error: any) {
    if (error.hasOwnProperty("notification")) {
        throw error;
    } else if (error instanceof Error) {
        throw makeNotificationException(error.message, "error");
    } else {
        throw makeNotificationException(error, "error");
    }
}