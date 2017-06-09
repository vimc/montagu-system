import alt from "../alt";
import { ModellingGroup } from "../models/Generated";
import { FetchActions, FetchActionsInterface } from "./FetchActions";
import { mainStore } from "../stores/MainStore";

interface Actions extends FetchActionsInterface<ModellingGroup[]> {
    setCurrentModellingGroup(id: string): ModellingGroup;
}

class ModellingGroupActions extends FetchActions<ModellingGroup[]> implements Actions {
    setCurrentModellingGroup(id: string): ModellingGroup {
        return mainStore.getGroupById(id);
    }
}

export const modellingGroupActions = alt.createActions<Actions>(ModellingGroupActions);
