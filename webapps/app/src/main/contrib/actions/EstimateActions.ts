import { FetchActions, FetchActionsInterface } from "../../shared/actions/FetchActions";
import { alt } from "../../shared/alt";

interface Actions extends FetchActionsInterface<string> {
    clearUsedToken(): boolean;
}

class EstimateTokenActions extends FetchActions<string> implements Actions {
    clearUsedToken(): boolean {
        return true;
    }
}

export const estimateTokenActions = alt.createActions<Actions>(EstimateTokenActions);
