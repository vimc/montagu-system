import alt from '../alt';
import { FetchActions } from './FetchActions';
import { TouchstoneSource, NoParameters } from '../sources/Sources';
import { Touchstone, Result } from '../Models';

interface Actions {
    fetch(): (dispatch: any) => any;
    update(touchstones: Array<Touchstone>): Array<Touchstone>;
    fetchFailed(errorMessage: string): string;
}

class TouchstoneActions extends FetchActions<NoParameters, Array<Touchstone>> implements Actions {
    fetch(): (dispatch: any) => any {
        return this.dispatchFetch({});
    }

    doFetch(_: boolean) {
        return TouchstoneSource.fetch({});
    }

    receivedFetchedData(data: Array<Touchstone>) {
        this.update(data);
    }

    update(touchstones: Array<Touchstone>): Array<Touchstone> {
        return touchstones;
    }

    fetchFailed(errorMessage: string): string {
        return errorMessage;
    }
}

export const touchstoneActions = alt.createActions<Actions>(TouchstoneActions);

