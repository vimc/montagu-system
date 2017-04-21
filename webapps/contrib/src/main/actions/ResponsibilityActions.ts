import alt from '../alt';
import { FetchActions } from './FetchActions';
import { ResponsibilitySource } from '../sources/ResponsibilitySource';
import { Responsibilities, Result, Touchstone } from '../Models';

interface Actions {
    setTouchstone(touchstone: Touchstone): Touchstone;
    fetch(groupId: string, touchstoneId: string): (dispatch: any) => any;
    updateResponsibilities(responsibilitySet: Responsibilities): Responsibilities;
    fetchFailed(errorMessage: string): string;
}

interface FetchParameters {
    groupId: string;
    touchstoneId: string;
}

class ResponsibilityActions extends FetchActions<FetchParameters, Responsibilities> implements Actions {
    setTouchstone(touchstone: Touchstone) {
        return touchstone;
    }

    doFetch(params: FetchParameters): Promise<Response> {
        return ResponsibilitySource.fetch(params.groupId, params.touchstoneId);
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

