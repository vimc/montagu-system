import { FetchActions, FetchActionsInterface } from "../../shared/actions/FetchActions";
import { alt } from "../../shared/alt";

class EstimateTokenActions extends FetchActions<string> implements FetchActionsInterface<string>  {
}

export const estimateTokenActions = alt.createActions<FetchActionsInterface<string>>(EstimateTokenActions);