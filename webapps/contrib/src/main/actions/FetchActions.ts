import { AbstractActions } from './AbstractActions';
import { Result } from '../Models';

export interface FetchActionsInterface<TFetchParameters> {    
    fetch(parameters: TFetchParameters): (dispatch: any) => any;
    beginFetch(): any;
    fetchFailed(errorMessage: string): string;
}

export abstract class FetchActions<TFetchParameters, TModel> extends AbstractActions {
    abstract doFetch(parameters: TFetchParameters): Promise<Response>;
    abstract receivedFetchedData(data: TModel): boolean;

    fetch(parameters: TFetchParameters): (dispatch: any) => any {
        return (dispatch: any) => {
            dispatch();
            this.beginFetch();
            const promise = this.doFetch(parameters);
            handleResponse(promise, 
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

function handleResponse(promise: Promise<Response>, success: (data: any) => void, failure: (message: string) => void): void {
    promise.then((response: Response) => {
        return response.json();
    })
    .then((response: any) => {
        const apiResponse = <Result>response;
        switch (apiResponse.status)
        {
            case "success":
                success(apiResponse.data);
                break;
            case "failure":
                failure(apiResponse.errors[0].message);
                break;
            default:
                failure("The server response was not correctly formatted: " + response.toString());
        }
    })
    .catch((errorMessage: string) => {
        failure(errorMessage);
    });
}