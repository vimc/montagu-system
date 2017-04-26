import alt from '../alt';
import { FetchActions, FetchActionsInterface } from './FetchActions';
import { sources, ResponsibilityFetchParameters } from '../sources/Sources';
import { Responsibilities, Result, Touchstone } from '../Models';

interface Actions extends FetchActionsInterface<ResponsibilityFetchParameters> {
    setTouchstone(touchstone: Touchstone): Touchstone;
    updateResponsibilities(responsibilitySet: Responsibilities): Responsibilities;
    filterByDisease(diseaseId: string): string;
}


class ResponsibilityActions extends FetchActions<ResponsibilityFetchParameters, Responsibilities> implements Actions {
    setTouchstone(touchstone: Touchstone) {
        return touchstone;
    }

    doFetch(params: ResponsibilityFetchParameters): Promise<Response> {
        return sources.responsibilities.fetch(params);
    }

    receivedFetchedData(data: Responsibilities) {
        this.updateResponsibilities(data);
        return true;
    }

    updateResponsibilities(responsibilitySet: Responsibilities): Responsibilities {
        return responsibilitySet;
    }

    filterByDisease(diseaseId: string): string {
        return diseaseId;
    }
}

export const responsibilityActions = alt.createActions<Actions>(ResponsibilityActions);

