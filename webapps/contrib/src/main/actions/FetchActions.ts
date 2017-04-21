import { AbstractActions } from './AbstractActions';

export interface FetchActionsInterface {
    beginFetch(): any;
    fetchFailed(errorMessage: string): string;
}

export abstract class FetchActions<TFetchParameters, TModel> extends AbstractActions {
    abstract doFetch(parameters: TFetchParameters): Promise<Response>;
    abstract receivedFetchedData(data: TModel): void;

    dispatchFetch(parameters: TFetchParameters): (dispatch: any) => any {
        return (dispatch: any) => {
            dispatch();
            this.beginFetch();
            const promise = this.doFetch(parameters);
            this.handleResponse(promise, 
                data => this.receivedFetchedData(<TModel>(data)),
                error => this.fetchFailed(error)
            );
        };
    }

    fetchFailed(errorMessage: string): string {
        return errorMessage;
    }

    beginFetch(): any {
        return true;
    }
}