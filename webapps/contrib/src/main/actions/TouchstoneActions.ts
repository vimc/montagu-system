import alt from '../alt';
import { FetchActions, FetchActionsInterface } from './FetchActions';
import { TouchstoneSource, NoParameters } from '../sources/Sources';
import { Touchstone, Result } from '../Models';

interface Actions extends FetchActionsInterface {
    fetch(): (dispatch: any) => any;
    update(touchstones: Array<Touchstone>): Array<Touchstone>;
}

class TouchstoneActions extends FetchActions<NoParameters, Array<Touchstone>> implements Actions {
    fetch(): (dispatch: any) => any {
        return this.dispatchFetch({});
    }

    doFetch(_: NoParameters) {
        return TouchstoneSource.fetch({});
    }

    receivedFetchedData(data: Array<Touchstone>) {
        this.update(data);
    }

    update(touchstones: Array<Touchstone>): Array<Touchstone> {
        return touchstones;
    }
}

export const touchstoneActions = alt.createActions<Actions>(TouchstoneActions);

