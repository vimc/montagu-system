import SourceModel = AltJS.SourceModel;
import { Result } from "../models/Generated";
import fetcher from "./Fetcher";
import { errorActions } from "../actions/ErrorActions";
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
                        if (error instanceof Error) {
                            throw error;
                        } else {
                            throw Error(error);
                        }
                    });
            },
            local(state: TState) {
                return null;
            },
            success: actions.success,
            loading: actions.loading,
            error: errorActions.error,
        };
    }

    protected processResponse<TModel>(promise: Promise<Response>): Promise<any> {
        return promise
            .then((response: Response) => response.json())
            .then((response: any) => {
                const apiResponse = <Result>response;
                switch (apiResponse.status) {
                    case "success":
                        return apiResponse.data as TModel;
                    case "failure":
                        throw Error(apiResponse.errors[ 0 ].message);
                    default:
                        throw Error("The server response was not correctly formatted: " + response.toString());
                }
            });
    }
}