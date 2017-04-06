import alt from '../alt';
import { AbstractActions } from './AbstractActions';
import { ResponsibilitySource } from '../sources/ResponsibilitySource';
import { ResponsibilitySet } from '../stores/ResponsibilityStore';
import { APIResponse } from '../models/APIResponse';
import { Touchstone } from '../stores/TouchstoneStore';

interface Actions {
    setTouchstone(touchstone: Touchstone): Touchstone;
    fetch(groupId: string, touchstoneId: string): (dispatch: any) => any;
    updateResponsibilities(responsibilitySet: ResponsibilitySet): ResponsibilitySet;
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
                    const apiResponse = <APIResponse>response;
                    switch (apiResponse.status)
                    {
                        case "success":
                            this.updateResponsibilities(<ResponsibilitySet>(apiResponse.data));
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

    updateResponsibilities(responsibilitySet: ResponsibilitySet): ResponsibilitySet {
        return responsibilitySet;
    }

    fetchFailed(errorMessage: string): string {
        return errorMessage;
    }
}

export const responsibilityActions = alt.createActions<Actions>(ResponsibilityActions);

