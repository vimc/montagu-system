import alt from "../../shared/alt";
import { FetchActions, FetchActionsInterface } from "../../shared/actions/FetchActions";
import { ModellingGroup } from "../../shared/models/Generated";

export const modellingGroupActions = alt.createActions<FetchActionsInterface<ModellingGroup[]>>(
    class extends FetchActions<ModellingGroup[]> {}
);
