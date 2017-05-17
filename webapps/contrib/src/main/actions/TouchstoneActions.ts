import alt from "../alt";
import { FetchActions, FetchActionsInterface } from "./FetchActions";
import { Touchstone } from "../Models";

export interface Actions extends FetchActionsInterface<Touchstone[]> {
    setCurrentTouchstone(touchstoneId: string): string;
}

class TouchstoneActions extends FetchActions<Touchstone[]> implements Actions {
    setCurrentTouchstone(touchstoneId: string): string {
        return touchstoneId;
    }
}

export const touchstoneActions = alt.createActions<Actions>(TouchstoneActions);

