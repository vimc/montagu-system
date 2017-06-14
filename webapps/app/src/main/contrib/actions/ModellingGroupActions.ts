import alt from "../../shared/alt";
import { ModellingGroup } from "../models/Generated";
import { FetchActions, FetchActionsInterface } from "./FetchActions";

interface Actions extends FetchActionsInterface<ModellingGroup[]> {
    setCurrentModellingGroup(id: string): string;
}

class ModellingGroupActions extends FetchActions<ModellingGroup[]> implements Actions {
    setCurrentModellingGroup(id: string): string {
        return id;
    }
}

export const modellingGroupActions = alt.createActions<Actions>(ModellingGroupActions);
