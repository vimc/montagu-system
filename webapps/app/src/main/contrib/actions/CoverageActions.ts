import { FetchActions, FetchActionsInterface } from "../../shared/actions/FetchActions";
import { ScenarioTouchstoneAndCoverageSets } from "../../shared/models/Generated";
import { alt } from "../../shared/alt";

interface Actions extends FetchActionsInterface<string> {
    clearUsedToken(): boolean;
}

class CoverageTokenActions extends FetchActions<string> implements Actions {
    clearUsedToken(): boolean {
        return true;
    }
}

export const coverageTokenActions = alt.createActions<Actions>(CoverageTokenActions);
