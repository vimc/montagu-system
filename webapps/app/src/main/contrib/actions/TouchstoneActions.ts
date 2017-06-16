import alt from "../../shared/alt";
import { FetchActions, FetchActionsInterface } from "../../shared/actions/FetchActions";
import { Touchstone } from "../../shared/models/Generated";

export interface Actions extends FetchActionsInterface<Touchstone[]> {
    setCurrentTouchstone(touchstoneId: string): string;
}

class TouchstoneActions extends FetchActions<Touchstone[]> implements Actions {
    setCurrentTouchstone(touchstoneId: string): string {
        return touchstoneId;
    }
}

export const touchstoneActions = alt.createActions<Actions>(TouchstoneActions);

