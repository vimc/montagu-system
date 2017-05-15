import SourceModel = AltJS.SourceModel;
import { Result } from "../Models";
import fetcher from "./Fetcher";
import { errorActions } from "../actions/ErrorActions";
import AltStore = AltJS.AltStore;

interface ActionProps<T> {
    success: (data: T) => void;
    loading: () => void
}

export abstract class Source<TModel, TState> {
    private actions: ActionProps<TModel>;

    constructor(actions: ActionProps<TModel>, ) {
        this.actions = actions;
    }

    protected doFetch(urlFragment: (state: TState) => string): AltJS.SourceModel<TModel> {
        return {
            remote(state: TState) {
                return fetcher.fetch(urlFragment(state))
                    .then((response: Response) => response.json())
                    .then((response: any) => {
                        const apiResponse = <Result>response;
                        switch (apiResponse.status) {
                            case "success":
                                return apiResponse.data as TModel;
                            case "failure":
                                throw Error(apiResponse.errors[0].message);
                            default:
                                throw Error("The server response was not correctly formatted: " + response.toString());
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
}