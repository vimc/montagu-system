import alt from '../alt';
import { AbstractActions } from './AbstractActions';
import { TouchstoneSource } from '../sources/TouchstoneSource';
import { Touchstone, Result } from '../Models';

interface Actions {
    fetch(): (dispatch: any) => any;
    update(touchstones: Array<Touchstone>): Array<Touchstone>;
    fetchFailed(errorMessage: string): string;
}

class TouchstoneActions extends AbstractActions implements Actions {
    fetch(): (dispatch: any) => any {
        return (dispatch: any) => {
            dispatch();
            TouchstoneSource.fetch()
                .then((response: Response) => {
                    return response.json();
                })
                .then((response: any) => {
                    const apiResponse = <Result>response;
                    switch (apiResponse.status)
                    {
                        case "success":
                            this.update(<Array<Touchstone>>(apiResponse.data));
                            break;
                        case "failure":
                            this.fetchFailed(apiResponse.errors[0].message);
                            break;
                        default:
                            this.fetchFailed("The server response was not correctly formatted: " + response.toString());
                    }
                })
                .catch((errorMessage: string) => {
                    this.fetchFailed(errorMessage);
                });
        };
    }

    update(touchstones: Array<Touchstone>): Array<Touchstone> {
        return touchstones;
    }

    fetchFailed(errorMessage: string): string {
        return errorMessage;
    }
}

export const touchstoneActions = alt.createActions<Actions>(TouchstoneActions);

