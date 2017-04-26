import alt from '../alt';
import { FetchActions, FetchActionsInterface } from './FetchActions';
import { sources, NoParameters } from '../sources/Sources';
import { Disease } from '../Models';

interface Actions extends FetchActionsInterface<NoParameters> {
    receiveDiseases(diseases: Array<Disease>): Array<Disease>;
}

class MainActions extends FetchActions<NoParameters, Array<Disease>> implements Actions {
    doFetch(_: NoParameters) {
        return sources.diseases.fetch({});
    }

    receivedFetchedData(data: Array<Disease>) {
        this.receiveDiseases(data);
        return true;
    }

    receiveDiseases(diseases: Array<Disease>): Array<Disease> {
        return diseases;
    }
}

export const mainActions = alt.createActions<Actions>(MainActions);

