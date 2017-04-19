import alt from '../alt';
import { AbstractActions } from './AbstractActions';
import { ResponsibilitySource } from '../sources/ResponsibilitySource';
import { Responsibilities, Result, Touchstone } from '../Models';

interface Actions {
    setTouchstone(touchstone: Touchstone): Touchstone;
    fetch(groupId: string, touchstoneId: string): (dispatch: any) => any;
    updateResponsibilities(responsibilitySet: Responsibilities): Responsibilities;
    fetchFailed(errorMessage: string): string;
}

class ResponsibilityActions extends AbstractActions implements Actions {
    setTouchstone(touchstone: Touchstone) {
        return touchstone;
    }

    fetch(groupId: string, touchstoneId: string): (dispatch: any) => any {
        return (dispatch: any) => {
            dispatch();
            ResponsibilitySource.fetch(groupId, touchstoneId)
                .then((response: Response) => {
                    return response.json();
                })
                .then((response: any) => {
                    const apiResponse = <Result>response;
                    switch (apiResponse.status)
                    {
                        case "success":
                            this.updateResponsibilities(<Responsibilities>(apiResponse.data));
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

    updateResponsibilities(responsibilitySet: Responsibilities): Responsibilities {
        return responsibilitySet;
    }

    fetchFailed(errorMessage: string): string {
        return errorMessage;
    }
}

export const responsibilityActions = alt.createActions<Actions>(ResponsibilityActions);

