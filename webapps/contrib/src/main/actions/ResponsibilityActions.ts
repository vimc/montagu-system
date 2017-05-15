import alt from "../alt";
import { FetchActions, FetchActionsInterface } from "./FetchActions";
import { Responsibilities, Touchstone } from "../Models";

interface Actions extends FetchActionsInterface<Responsibilities> {
    setTouchstone(touchstone: Touchstone): Touchstone;
    filterByDisease(diseaseId: string): string;
}


class ResponsibilityActions extends FetchActions<Responsibilities> implements Actions {
    setTouchstone(touchstone: Touchstone) {
        return touchstone;
    }

    updateResponsibilities(responsibilitySet: Responsibilities): Responsibilities {
        return responsibilitySet;
    }

    filterByDisease(diseaseId: string): string {
        return diseaseId;
    }
}

export const responsibilityActions = alt.createActions<Actions>(ResponsibilityActions);

