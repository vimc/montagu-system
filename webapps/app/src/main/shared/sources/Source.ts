import SourceModel = AltJS.SourceModel;
import { ErrorInfo, Result } from "../models/Generated";
import fetcher from "./Fetcher";
import {
    makeNotificationException,
    Notification,
    notificationActions,
    NotificationException
} from "../actions/NotificationActions";
import { authActions } from "../actions/AuthActions";
import AltStore = AltJS.AltStore;

interface ActionProps<T> {
    success: (data: T) => void;
    loading: (x: any) => void
}

type UrlBuilder<TState> = (state: TState) => string;

export abstract class Source<TState> {
    protected doFetch<TModel>(urlFragment: UrlBuilder<TState>, actions: ActionProps<TModel>): AltJS.SourceModel<TModel> {
        const handler = this.processResponse;
        return {
            remote(state: TState) {
                return handler(fetcher.fetcher.fetch(urlFragment(state)))
                    .catch((error: any) => {
                        // Because of transpilation to ES5, we cannot test for instanceof NotificationException
                        if (error.hasOwnProperty("notification")) {
                            throw error;
                        } else if (error instanceof Error) {
                            throw makeNotificationException(error.message, "error");
                        } else {
                            throw makeNotificationException(error, "error");
                        }
                    });
            },
            local(state: TState) {
                return null;
            },
            success: actions.success,
            loading: actions.loading,
            error: notificationActions.notify,
        };
    }

    protected processResponse<TModel>(promise: Promise<Response>): Promise<any> {
        const handleError = (error: ErrorInfo) => {
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
        };

        return promise
            .then((response: Response) => response.json())
            .then((response: any) => {
                const apiResponse = <Result>response;
                switch (apiResponse.status) {
                    case "success":
                        return apiResponse.data as TModel;
                    case "failure":
                        return apiResponse.errors.forEach(handleError);
                    default:
                        throw makeNotificationException("The server response was not correctly formatted: "
                            + response.toString(), "error");
                }
            });
    }
}