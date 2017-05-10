import alt from "../alt";
import { FetchActions, FetchActionsInterface } from "./FetchActions";
import { NoParameters, sources } from "../sources/Sources";
import { Touchstone } from "../Models";

interface Actions extends FetchActionsInterface<NoParameters> {
    update(touchstones: Array<Touchstone>): Array<Touchstone>;
}

class TouchstoneActions extends FetchActions<NoParameters, Array<Touchstone>> implements Actions {
    doFetch(_: NoParameters) {
        return sources.touchstones.fetch({});
    }

    receivedFetchedData(data: Array<Touchstone>) {
        this.update(data);
        return true;
    }

    update(touchstones: Array<Touchstone>): Array<Touchstone> {
        return touchstones;
    }
}

export const touchstoneActions = alt.createActions<Actions>(TouchstoneActions);

