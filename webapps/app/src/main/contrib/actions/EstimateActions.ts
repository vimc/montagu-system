import {FetchActions, FetchActionsInterface} from "../../shared/actions/FetchActions";
import {alt} from "../../shared/alt";

interface Actions extends FetchActionsInterface<string> {
    clearUsedToken(): boolean;

    setRedirectPath(path: string): string;
}

class EstimateTokenActions extends FetchActions<string> implements Actions {
    clearUsedToken(): boolean {
        return true;
    }

    setRedirectPath(path: string): string {
        return path;
    }

}

export const estimateTokenActions = alt.createActions<Actions>(EstimateTokenActions);
