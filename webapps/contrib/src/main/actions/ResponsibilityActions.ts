import alt from '../alt';
import { FetchActions } from './FetchActions';
import { ResponsibilitySource, ResponsibilityFetchParameters } from '../sources/Sources';
import { Responsibilities, Result, Touchstone } from '../Models';

interface Actions {
    setTouchstone(touchstone: Touchstone): Touchstone;
    fetch(groupId: string, touchstoneId: string): (dispatch: any) => any;
    updateResponsibilities(responsibilitySet: Responsibilities): Responsibilities;
    fetchFailed(errorMessage: string): string;
}


class ResponsibilityActions extends FetchActions<ResponsibilityFetchParameters, Responsibilities> implements Actions {
    setTouchstone(touchstone: Touchstone) {
        return touchstone;
    }

    doFetch(params: ResponsibilityFetchParameters): Promise<Response> {
        return ResponsibilitySource.fetch(params);
    }

    fetch(groupId: string, touchstoneId: string): (dispatch: any) => any {
        return this.dispatchFetch({ groupId, touchstoneId });
    }

    receivedFetchedData(data: Responsibilities) {
        this.updateResponsibilities(data);
    }

    updateResponsibilities(responsibilitySet: Responsibilities): Responsibilities {
        return responsibilitySet;
    }
}

export const responsibilityActions = alt.createActions<Actions>(ResponsibilityActions);

