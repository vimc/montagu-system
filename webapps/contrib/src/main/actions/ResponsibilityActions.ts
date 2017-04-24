import alt from '../alt';
import { FetchActions, FetchActionsInterface } from './FetchActions';
import { sources, ResponsibilityFetchParameters } from '../sources/Sources';
import { Responsibilities, Result, Touchstone } from '../Models';

interface Actions extends FetchActionsInterface {
    fetch(groupId: string, touchstoneId: string): boolean;
    setTouchstone(touchstone: Touchstone): Touchstone;
    updateResponsibilities(responsibilitySet: Responsibilities): Responsibilities;
}


class ResponsibilityActions extends FetchActions<ResponsibilityFetchParameters, Responsibilities> implements Actions {
    setTouchstone(touchstone: Touchstone) {
        return touchstone;
    }

    doFetch(params: ResponsibilityFetchParameters): Promise<Response> {
        return sources.responsibilities.fetch(params);
    }

    fetch(groupId: string, touchstoneId: string): boolean {
        this.dispatchFetch({ groupId, touchstoneId });
        return true;
    }

    receivedFetchedData(data: Responsibilities) {
        this.updateResponsibilities(data);
    }

    updateResponsibilities(responsibilitySet: Responsibilities): Responsibilities {
        return responsibilitySet;
    }
}

export const responsibilityActions = alt.createActions<Actions>(ResponsibilityActions);

