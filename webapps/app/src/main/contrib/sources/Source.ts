import SourceModel = AltJS.SourceModel;
import { Result } from "../models/Generated";
import fetcher from "../../shared/sources/Fetcher";
import { errorActions } from "../../shared/actions/ErrorActions";
import AltStore = AltJS.AltStore;

interface ActionProps<T> {
    success: (data: T) => void;
    loading: () => void
}

type UrlBuilder<TState> = (state: TState) => string;

export abstract class Source<TModel, TState> {
    private actions: ActionProps<TModel>;

    constructor(actions: ActionProps<TModel>, ) {
        this.actions = actions;
    }

    protected doFetch(urlFragment: UrlBuilder<TState>): AltJS.SourceModel<TModel> {
        const handler = this.processResponse;
        return {
            remote(state: TState) {
                return handler(fetcher.fetch(urlFragment(state)))
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
            success: this.actions.success,
            loading: this.actions.loading,
            error: errorActions.error,
        };
    }

    protected processResponse(promise: Promise<Response>): Promise<any> {
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